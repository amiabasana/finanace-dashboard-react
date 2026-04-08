import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { MOCK_TRANSACTIONS } from '../data/mockFinance.js'

const STORAGE_KEY = 'finance-dashboard-data-v1'
const UI_STORAGE_KEY = 'finance-dashboard-ui-v1'

const defaultFilters = {
  search: '',
  typeFilter: 'all',
  categoryFilter: 'all',
  sortBy: 'date',
  sortDir: 'desc',
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function loadStoredTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

function loadStoredUi() {
  try {
    const raw = localStorage.getItem(UI_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function aggregateMonthly(transactions) {
  const map = new Map()
  for (const t of transactions) {
    const key = t.date.slice(0, 7)
    const cur = map.get(key) ?? { income: 0, expense: 0 }
    if (t.type === 'income') cur.income += t.amount
    else cur.expense += t.amount
    map.set(key, cur)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ym, v]) => ({
      ym,
      month: formatMonthLabel(ym),
      income: Math.round(v.income * 100) / 100,
      expense: Math.round(v.expense * 100) / 100,
    }))
}

function formatMonthLabel(ym) {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  })
}

function computeBalanceTrend(monthly) {
  let running = 0
  return monthly.map((m) => {
    running += m.income - m.expense
    return {
      month: m.month,
      balance: Math.round(running * 100) / 100,
    }
  })
}

function computeCategorySpending(transactions) {
  const map = new Map()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()]
    .map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }))
    .sort((a, b) => b.value - a.value)
}

function summarize(transactions) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  return {
    totalIncome: Math.round(income * 100) / 100,
    totalExpense: Math.round(expense * 100) / 100,
    balance: Math.round((income - expense) * 100) / 100,
  }
}

function computeInsights(transactions, monthly, summary) {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const breakdown = computeCategorySpending(transactions)
  const topCategory =
    breakdown.length > 0
      ? { name: breakdown[0].name, amount: breakdown[0].value }
      : null

  let monthCompare = null
  if (monthly.length >= 2) {
    const prev = monthly[monthly.length - 2]
    const last = monthly[monthly.length - 1]
    monthCompare = {
      fromLabel: prev.month,
      toLabel: last.month,
      expenseDelta: Math.round((last.expense - prev.expense) * 100) / 100,
      incomeDelta: Math.round((last.income - prev.income) * 100) / 100,
    }
  }

  const monthsOverBudget = monthly.filter((m) => m.expense > m.income).length

  const avgExpense =
    expenses.length > 0
      ? Math.round(
          (expenses.reduce((s, t) => s + t.amount, 0) / expenses.length) * 100,
        ) / 100
      : 0

  const incomeTx = transactions.filter((t) => t.type === 'income').length
  const expenseTx = transactions.filter((t) => t.type === 'expense').length

  let observation = null
  if (transactions.length === 0) {
    observation = 'Add transactions to unlock trends and comparisons.'
  } else if (monthsOverBudget > 0) {
    observation = `${monthsOverBudget} month(s) had higher spending than income — review recurring costs.`
  } else if (summary.balance > 0) {
    observation = 'Net cash flow is positive overall — surplus can go to savings or investments.'
  } else if (summary.balance < 0) {
    observation = 'Total expenses exceed income in the dataset — consider trimming top categories.'
  } else {
    observation = 'Income and expenses are balanced over the recorded period.'
  }

  return {
    topCategory,
    monthCompare,
    avgExpense,
    incomeTxCount: incomeTx,
    expenseTxCount: expenseTx,
    observation,
  }
}

function applyFilters(transactions, filters) {
  let list = [...transactions]
  const { search, typeFilter, categoryFilter, sortBy, sortDir } = filters

  const q = search.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    )
  }
  if (typeFilter !== 'all') {
    list = list.filter((t) => t.type === typeFilter)
  }
  if (categoryFilter !== 'all') {
    list = list.filter((t) => t.category === categoryFilter)
  }

  const dir = sortDir === 'asc' ? 1 : -1
  list.sort((a, b) => {
    if (sortBy === 'date') return dir * a.date.localeCompare(b.date)
    if (sortBy === 'amount') return dir * (a.amount - b.amount)
    if (sortBy === 'category') return dir * a.category.localeCompare(b.category)
    if (sortBy === 'description')
      return dir * a.description.localeCompare(b.description)
    return 0
  })

  return list
}

const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const stored = loadStoredTransactions()
    return stored && stored.length > 0 ? stored : [...MOCK_TRANSACTIONS]
  })

  const uiLoaded = loadStoredUi()
  const [role, setRoleState] = useState(() =>
    uiLoaded?.role === 'admin' || uiLoaded?.role === 'viewer'
      ? uiLoaded.role
      : 'viewer',
  )
  const [filters, setFiltersState] = useState(() => ({
    ...defaultFilters,
    ...(uiLoaded?.filters && typeof uiLoaded.filters === 'object'
      ? uiLoaded.filters
      : {}),
  }))

  const [theme, setThemeState] = useState(() => {
    if (uiLoaded?.theme === 'light' || uiLoaded?.theme === 'dark') {
      return uiLoaded.theme
    }
    return getSystemTheme()
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(
      UI_STORAGE_KEY,
      JSON.stringify({ role, filters, theme }),
    )
  }, [role, filters, theme])

  useEffect(() => {
    if (theme !== 'light' && theme !== 'dark') {
      setThemeState(getSystemTheme())
    }
  }, [theme])

  useEffect(() => {
    if (uiLoaded?.theme === 'light' || uiLoaded?.theme === 'dark') return
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      setThemeState(media.matches ? 'dark' : 'light')
    }

    handleChange()

    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }

    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [uiLoaded?.theme])

  const setRole = useCallback((next) => {
    setRoleState(next === 'admin' ? 'admin' : 'viewer')
  }, [])

  const setFilters = useCallback((patch) => {
    setFiltersState((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState({ ...defaultFilters })
  }, [])

  const isAdmin = role === 'admin'

  const monthly = useMemo(
    () => aggregateMonthly(transactions),
    [transactions],
  )
  const monthlyForCharts = useMemo(
    () =>
      monthly.map((m) => ({
        month: m.month,
        income: m.income,
        expense: m.expense,
      })),
    [monthly],
  )
  const balanceTrend = useMemo(
    () => computeBalanceTrend(monthly),
    [monthly],
  )
  const categorySpending = useMemo(
    () => computeCategorySpending(transactions),
    [transactions],
  )
  const summary = useMemo(() => summarize(transactions), [transactions])
  const insights = useMemo(
    () => computeInsights(transactions, monthly, summary),
    [transactions, monthly, summary],
  )
  const filteredTransactions = useMemo(
    () => applyFilters(transactions, filters),
    [transactions, filters],
  )

  const categoryOptions = useMemo(() => {
    const set = new Set()
    for (const t of transactions) set.add(t.category)
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [transactions])

  const addTransaction = useCallback((input) => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setTransactions((prev) => [{ ...input, id }, ...prev])
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    )
  }, [])

  const removeTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const resetToMock = useCallback(() => {
    setTransactions([...MOCK_TRANSACTIONS])
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      transactions,
      monthly: monthlyForCharts,
      balanceTrend,
      categorySpending,
      summary,
      insights,
      filteredTransactions,
      filters,
      setFilters,
      resetFilters,
      categoryOptions,
      role,
      setRole,
      isAdmin,
      theme,
      toggleTheme,
      addTransaction,
      updateTransaction,
      removeTransaction,
      resetToMock,
    }),
    [
      transactions,
      monthlyForCharts,
      balanceTrend,
      categorySpending,
      summary,
      insights,
      filteredTransactions,
      filters,
      setFilters,
      resetFilters,
      categoryOptions,
      role,
      setRole,
      isAdmin,
      theme,
      addTransaction,
      updateTransaction,
      removeTransaction,
      resetToMock,
    ],
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
