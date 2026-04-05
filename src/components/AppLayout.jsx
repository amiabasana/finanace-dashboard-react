import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { RoleSwitcher } from './RoleSwitcher.jsx'

const nav = [
  { to: '/', label: 'Overview', end: true },
  { to: '/transactions', label: 'Transactions', end: false },
]

function MenuIcon({ open }) {
  return (
    <svg
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      {open ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    [
      'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
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
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-fd-border bg-fd-bg-solid backdrop-blur-md transition-transform duration-200 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-fd-border px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-fd-accent-soft text-sm font-bold text-fd-text-accent">
              FD
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-fd-text">FinDash</p>
              <p className="text-xs text-fd-text-muted">Workspace</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-fd-text-muted hover:bg-fd-glass-12 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <MenuIcon open />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-fd-border p-3">
          <p className="text-xs text-fd-text">
            Amisha Abasana
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-fd-border bg-fd-bg-solid/95 px-4 backdrop-blur-md">
          <button
            type="button"
            className="rounded-lg p-2 text-fd-text-muted hover:bg-fd-glass-12 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon open={false} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-fd-text sm:text-lg">
              Finance dashboard
            </h1>
            <p className="hidden text-xs text-fd-text-muted sm:block">
              Track cash flow, spending, and account activity
            </p>
          </div>
          <RoleSwitcher />
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
