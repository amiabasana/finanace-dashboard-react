import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useFinance } from '../context/FinanceContext.jsx'
import { DEFAULT_CATEGORIES } from '../data/categories.js'

const currency = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

function buildCategorySelectOptions(categoryOptions) {
  const set = new Set([...DEFAULT_CATEGORIES, ...categoryOptions])
  return [...set].sort((a, b) => a.localeCompare(b))
}

function exportTransactionsCsv(rows) {
  const esc = (s) => `"${String(s).replace(/"/g, '""')}"`
  const headers = ['date', 'description', 'category', 'type', 'amount']
  const lines = [
    headers.join(','),
    ...rows.map((t) =>
      [
        t.date,
        esc(t.description),
        esc(t.category),
        t.type,
        t.amount,
      ].join(','),
    ),
  ]
  const blob = new Blob([lines.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('CSV downloaded')
}

function exportTransactionsJson(rows) {
  const blob = new Blob([JSON.stringify(rows, null, 2)], {
    type: 'application/json;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('JSON downloaded')
}

export function Transactions() {
  const {
    transactions,
    filteredTransactions,
    filters,
    setFilters,
    resetFilters,
    categoryOptions,
    isAdmin,
    addTransaction,
    updateTransaction,
    removeTransaction,
    resetToMock,
  } = useFinance()

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Other')
  const [type, setType] = useState('expense')
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  )
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState(null)

  const formCategories = useMemo(
    () => buildCategorySelectOptions(categoryOptions),
    [categoryOptions],
  )

  const filterCategoryOptions = useMemo(() => {
    const set = new Set(['all', ...categoryOptions])
    return [...set].sort((a, b) => {
      if (a === 'all') return -1
      if (b === 'all') return 1
      return a.localeCompare(b)
    })
  }, [categoryOptions])

  function handleAdd(e) {
    e.preventDefault()
    const n = Number.parseFloat(amount)
    if (!description.trim() || Number.isNaN(n) || n <= 0) {
      toast.error('Enter a description and a positive amount.')
      return
    }
    addTransaction({
      date,
      description: description.trim(),
      category,
      amount: Math.round(n * 100) / 100,
      type,
    })
    toast.success('Transaction saved')
    setDescription('')
    setAmount('')
  }

  function startEdit(t) {
    setEditingId(t.id)
    setEditDraft({
      date: t.date,
      description: t.description,
      category: t.category,
      type: t.type,
      amount: String(t.amount),
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditDraft(null)
  }

  function saveEdit() {
    if (!editDraft || !editingId) return
    const n = Number.parseFloat(editDraft.amount)
    if (!editDraft.description.trim() || Number.isNaN(n) || n <= 0) {
      toast.error('Valid description and amount required.')
      return
    }
    updateTransaction(editingId, {
      date: editDraft.date,
      description: editDraft.description.trim(),
      category: editDraft.category,
      type: editDraft.type,
      amount: Math.round(n * 100) / 100,
    })
    toast.success('Transaction updated')
    cancelEdit()
  }

  const showEmptyFiltered =
    transactions.length > 0 && filteredTransactions.length === 0

  return (
    <div className="mx-auto flex max-w-full flex-col gap-6">
      {isAdmin ? (
        <section className="rounded-xl border border-fd-border bg-fd-surface p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-fd-text">Add transaction</h2>
          <p className="mt-1 text-xs text-fd-text-muted">
            Admin only — saved to context and localStorage
          </p>
          <form
            onSubmit={handleAdd}
            className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end"
          >
            <label className="flex flex-col gap-1 lg:col-span-3">
              <span className="text-xs text-fd-text-muted">Description</span>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-lg border border-fd-border-elevated-50 bg-fd-glass-12 px-3 py-2 text-sm text-fd-text placeholder:text-fd-placeholder focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent"
                placeholder="e.g. Client invoice"
              />
            </label>
            <label className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-xs text-fd-text-muted">Amount (USD)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-lg border border-fd-border-elevated-50 bg-fd-glass-12 px-3 py-2 text-sm text-fd-text tabular-nums placeholder:text-fd-placeholder focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent"
                placeholder="0.00"
              />
            </label>
            <label className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-xs text-fd-text-muted">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-lg border border-fd-border-elevated-50 bg-fd-glass-12 px-3 py-2 text-sm text-fd-text focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent"
              >
                <option value="expense" className='bg-fd-surface'>Expense</option>
                <option value="income" className='bg-fd-surface'>Income</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-xs text-fd-text-muted">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-fd-border-elevated-50 bg-fd-glass-12 px-3 py-2 text-sm text-fd-text focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent"
              >
                {formCategories.map((c) => (
                  <option key={c} value={c} className='bg-fd-surface'>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-xs text-fd-text-muted">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg border border-fd-border-elevated-50 bg-fd-glass-12 px-3 py-2 text-sm text-fd-text focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent"
              />
            </label>
            <div className="flex gap-2 lg:col-span-1">
              <button
                type="submit"
                className="w-full rounded-lg bg-fd-accent px-4 py-2 text-sm font-medium text-fd-text transition hover:opacity-90 cursor-pointer"
              >
                Add
              </button>
            </div>
          </form>
        </section>
      ) : (
        <div
          className="rounded-xl border border-fd-border bg-fd-glass-12 px-4 py-3 text-sm text-fd-text-muted"
          role="note"
        >
          You are in <strong className="text-fd-text">Viewer</strong> mode —
          switch role to <strong className="text-fd-text-accent">Admin</strong>{' '}
          in the header to add or edit transactions.
        </div>
      )}

      <section className="rounded-xl border border-fd-border bg-fd-glass-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-fd-text">
              Filter & sort
            </h2>
            <p className="text-xs text-fd-text-muted">
              Search, narrow by type/category, order results
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetFilters()
              toast.info('Filters reset')
            }}
            className="self-start rounded-lg border border-fd-border-light bg-fd-surface px-3 py-1.5 text-xs font-medium text-fd-text-muted hover:text-fd-text cursor-pointer"
          >
            Clear filters
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 lg:col-span-2">
            <span className="text-xs text-fd-text-muted">Search</span>
            <input
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Description or category…"
              className="rounded-lg border border-fd-border-elevated-50 bg-fd-surface px-3 py-2 text-sm text-fd-text placeholder:text-fd-placeholder focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-fd-text-muted">Type</span>
            <select
              value={filters.typeFilter}
              onChange={(e) => setFilters({ typeFilter: e.target.value })}
              className="rounded-lg border border-fd-border-elevated-50 bg-fd-surface px-3 py-2 text-sm text-fd-text focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-fd-text-muted">Category</span>
            <select
              value={filters.categoryFilter}
              onChange={(e) => setFilters({ categoryFilter: e.target.value })}
              className="rounded-lg border border-fd-border-elevated-50 bg-fd-surface px-3 py-2 text-sm text-fd-text focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent"
            >
              {filterCategoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All categories' : c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-fd-text-muted">Sort by</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value })}
              className="rounded-lg border border-fd-border-elevated-50 bg-fd-surface px-3 py-2 text-sm text-fd-text focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
              <option value="description">Description</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-fd-text-muted">Direction</span>
            <select
              value={filters.sortDir}
              onChange={(e) => setFilters({ sortDir: e.target.value })}
              className="rounded-lg border border-fd-border-elevated-50 bg-fd-surface px-3 py-2 text-sm text-fd-text focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent"
            >
              <option value="desc">Newest / high → low</option>
              <option value="asc">Oldest / low → high</option>
            </select>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-fd-text">
          Transactions ({filteredTransactions.length}
          {filteredTransactions.length !== transactions.length
            ? ` of ${transactions.length}`
            : ''}
          )
        </h2>
        <div className="flex flex-wrap gap-2">
          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={() => exportTransactionsCsv(filteredTransactions)}
                className="rounded-lg border border-fd-border-light bg-fd-glass-12 px-3 py-1.5 text-xs font-medium text-fd-text-muted hover:text-fd-text cursor-pointer"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => exportTransactionsJson(filteredTransactions)}
                className="rounded-lg border border-fd-border-light bg-fd-glass-12 px-3 py-1.5 text-xs font-medium text-fd-text-muted hover:text-fd-text cursor-pointer"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToMock()
                  toast.info('Restored mock dataset')
                }}
                className="rounded-lg border border-fd-border-light bg-fd-glass-12 px-3 py-1.5 text-xs font-medium text-fd-text-muted hover:text-fd-text cursor-pointer"
              >
                Reset to mock data
              </button>
            </>
          ) : null}
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-fd-border bg-fd-glass-5">
        {transactions.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-fd-text-muted">
            No transactions yet. Switch to Admin and add one, or use mock data.
          </p>
        ) : showEmptyFiltered ? (
          <p className="px-4 py-12 text-center text-sm text-fd-text-muted">
            No rows match your filters. Try clearing search or widening type /
            category.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left text-sm">
              <thead>
                <tr className="border-b border-fd-border text-xs uppercase text-fd-text-muted">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  {isAdmin ? (
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => {
                  const isEditing = editingId === t.id
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-fd-border-elevated-muted last:border-0 hover:bg-fd-glass-12"
                    >
                      {isEditing && editDraft ? (
                        <>
                          <td className="px-4 py-2 align-top">
                            <input
                              type="date"
                              value={editDraft.date}
                              onChange={(e) =>
                                setEditDraft((d) => ({
                                  ...d,
                                  date: e.target.value,
                                }))
                              }
                              className="w-full min-w-34 rounded border border-fd-border-elevated-50 bg-fd-surface px-2 py-1 text-xs text-fd-text"
                            />
                          </td>
                          <td className="px-4 py-2 align-top">
                            <input
                              value={editDraft.description}
                              onChange={(e) =>
                                setEditDraft((d) => ({
                                  ...d,
                                  description: e.target.value,
                                }))
                              }
                              className="w-full min-w-32 rounded border border-fd-border-elevated-50 bg-fd-surface px-2 py-1 text-xs text-fd-text"
                            />
                          </td>
                          <td className="px-4 py-2 align-top">
                            <select
                              value={editDraft.category}
                              onChange={(e) =>
                                setEditDraft((d) => ({
                                  ...d,
                                  category: e.target.value,
                                }))
                              }
                              className="w-full max-w-36 rounded border border-fd-border-elevated-50 bg-fd-surface px-2 py-1 text-xs text-fd-text"
                            >
                              {formCategories.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2 align-top">
                            <select
                              value={editDraft.type}
                              onChange={(e) =>
                                setEditDraft((d) => ({
                                  ...d,
                                  type: e.target.value,
                                }))
                              }
                              className="w-full rounded border border-fd-border-elevated-50 bg-fd-surface px-2 py-1 text-xs text-fd-text"
                            >
                              <option value="expense">expense</option>
                              <option value="income">income</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 align-top text-right">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editDraft.amount}
                              onChange={(e) =>
                                setEditDraft((d) => ({
                                  ...d,
                                  amount: e.target.value,
                                }))
                              }
                              className="w-full min-w-20 rounded border border-fd-border-elevated-50 bg-fd-surface px-2 py-1 text-xs tabular-nums text-fd-text"
                            />
                          </td>
                          <td className="px-4 py-2 align-top text-right">
                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-end">
                              <button
                                type="button"
                                onClick={saveEdit}
                                className="text-xs font-medium text-fd-text-accent hover:underline"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="text-xs font-medium text-fd-text-muted hover:text-fd-text"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 tabular-nums text-fd-text-muted">
                            {t.date}
                          </td>
                          <td className="px-4 py-3 text-fd-text">
                            {t.description}
                          </td>
                          <td className="px-4 py-3 text-fd-text-muted">
                            {t.category}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                                t.type === 'income'
                                  ? 'bg-fd-accent-soft text-fd-text-accent'
                                  : 'bg-fd-glass-12 text-fd-text-muted'
                              }`}
                            >
                              {t.type}
                            </span>
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-medium tabular-nums ${
                              t.type === 'income'
                                ? 'text-fd-text-accent'
                                : 'text-fd-text'
                            }`}
                          >
                            {t.type === 'income' ? '+' : '-'}
                            {currency(t.amount)}
                          </td>
                          {isAdmin ? (
                            <td className="px-4 py-3 text-right">
                              <div className="flex flex-col gap-1 sm:flex-row sm:justify-end sm:gap-3">
                                <button
                                  type="button"
                                  onClick={() => startEdit(t)}
                                  className="text-xs font-medium text-fd-text-muted hover:text-fd-text-accent"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeTransaction(t.id)
                                    toast.success('Removed')
                                  }}
                                  className="text-xs font-medium text-fd-text-muted hover:text-fd-text-accent"
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          ) : null}
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
