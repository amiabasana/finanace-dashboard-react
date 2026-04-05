import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  FiBarChart2,
  FiHome,
  FiList,
  FiMenu,
  FiMoon,
  FiSun,
  FiX,
} from 'react-icons/fi'
import { RoleSwitcher } from './RoleSwitcher.jsx'
import { useFinance } from '../context/FinanceContext.jsx'

const dashboardLinks = [
  { to: '/', label: 'Finance', end: true, icon: FiHome },
]

const pageLinks = [
  { to: '/insights', label: 'Insights', end: false, icon: FiBarChart2 },
  { to: '/transactions', label: 'Transactions', end: false, icon: FiList },
]

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopExpanded, setDesktopExpanded] = useState(true)
  const { theme, toggleTheme, isAdmin } = useFinance()
  const location = useLocation()
  const sidebarCollapsed = !desktopExpanded

  const roleBadgeClass = isAdmin
    ? 'bg-fd-accent-soft text-fd-text-accent border border-fd-border-accent'
    : 'bg-fd-glass-5 text-fd-text-muted border border-fd-border'

  const pageTitle = (() => {
    switch (location.pathname) {
      case '/transactions':
        return 'Transactions'
      case '/insights':
        return 'Insights'
      default:
        return 'Finance dashboard'
    }
  })()

  const linkClass = ({ isActive }) =>
    [
      'flex gap-[12px] rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
      isActive
        ? 'bg-fd-accent-soft text-fd-text-accent border border-fd-border-accent'
        : 'text-fd-text-muted hover:bg-fd-glass-12 hover:text-fd-text border border-transparent',
    ].join(' ')

  return (
    <div className="flex min-h-dvh bg-fd-bg text-fd-text">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-fd-surface-muted lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-fd-border bg-fd-bg-solid backdrop-blur-md transition-all duration-200',
          desktopExpanded ? 'w-64' : 'w-20',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-fd-border px-4">
          <NavLink
            to="/"
            className={`flex items-center gap-2 ${desktopExpanded ? '' : 'justify-center w-full'}`}
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-fd-accent-soft text-sm font-bold text-fd-text-accent">
              ZV
            </div>
            {desktopExpanded ? (
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-fd-text">Zorvyn</p>
                </div>
              </div>
            ) : null}
          </NavLink>
          <button
            type="button"
            className="rounded-lg p-2 text-fd-text-muted hover:bg-fd-glass-12 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
          <div>
            <p className={`px-3 pb-2 text-[11px] uppercase tracking-[0.25em] text-fd-text-muted ${desktopExpanded ? 'block' : 'hidden'}`}>
              Dashboard
            </p>
            <div className="space-y-1">
              {dashboardLinks.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      linkClass({ isActive }) +
                      (desktopExpanded ? '' : ' justify-center px-2')
                    }
                    onClick={() => setMobileOpen(false)}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className={`${desktopExpanded ? 'inline' : 'hidden'}`}>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>

          <div>
            <p className={`px-3 pb-2 text-[11px] uppercase tracking-[0.25em] text-fd-text-muted ${desktopExpanded ? 'block' : 'hidden'}`}>
              Pages
            </p>
            <div className="space-y-1">
              {pageLinks.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      linkClass({ isActive }) +
                      (desktopExpanded ? '' : ' justify-center px-2')
                    }
                    onClick={() => setMobileOpen(false)}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className={`${desktopExpanded ? 'inline' : 'hidden'}`}>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </nav>

        <div className={`border-t border-fd-border p-3 ${desktopExpanded ? '' : 'px-0 text-center'}`}>
          <p className={`text-xs font-semibold text-fd-text ${desktopExpanded ? '' : 'sr-only'}`}>
            Amisha Abasana
          </p>
          <p className={`mt-1 text-[11px] text-fd-text-muted ${desktopExpanded ? '' : 'sr-only'}`}>
            {isAdmin ? 'Administrator' : 'Viewer access'}
          </p>
          {!desktopExpanded ? (
            <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-fd-glass-5 text-fd-text-muted">
              ZV
            </div>
          ) : null}
        </div>
      </aside>

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-200 ${
          desktopExpanded ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-fd-border bg-fd-bg-solid/95 px-4 backdrop-blur-md">
          <button
            type="button"
            className="rounded-lg p-2 text-fd-text-muted hover:bg-fd-glass-12 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="hidden rounded-lg p-2 text-fd-text-muted hover:bg-fd-glass-12 lg:inline-flex"
            onClick={() => setDesktopExpanded((prev) => !prev)}
            aria-label={desktopExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {desktopExpanded ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-fd-text sm:text-lg">
              {pageTitle}
            </h1>
            <p className="hidden text-xs text-fd-text-muted sm:block">
              {pageTitle === 'Finance dashboard'
                ? 'Track cash flow, spending, and account activity'
                : `Review the latest ${pageTitle.toLowerCase()} information`}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-fd-border-elevated-50 bg-fd-surface p-2 text-fd-text transition hover:bg-fd-glass-12"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <FiMoon className="h-5 w-5" />
            ) : (
              <FiSun className="h-5 w-5" />
            )}
          </button>
          <RoleSwitcher />
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
        <footer className="border-t border-fd-border px-4 py-4 text-xs text-fd-text-muted bg-fd-bg-solid/90 sm:px-6">
          <div className="mx-auto max-w-full text-center">
            <p>© {new Date().getFullYear()}  — automatic footer year.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
