import { memo, useCallback, useMemo, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  FiArrowUp,
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
import Footer from './Footer.jsx'

const dashboardLinks = [
  { to: '/', label: 'Finance', end: true, icon: FiHome },
]

const pageLinks = [
  { to: '/transactions', label: 'Transactions', end: false, icon: FiList },
  { to: '/insights', label: 'Insights', end: false, icon: FiBarChart2 },
]

const NavItem = memo(function NavItem({ item, linkClass, desktopExpanded, onNavClick }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        linkClass({ isActive }) +
        (desktopExpanded ? '' : ' justify-center px-2')
      }
      onClick={onNavClick}
      title={item.label}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className={`${desktopExpanded ? 'inline' : 'hidden'}`}>{item.label}</span>
    </NavLink>
  )
})

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopExpanded, setDesktopExpanded] = useState(true)
  const { theme, toggleTheme, isAdmin } = useFinance()
  const location = useLocation()
  const [showScroll, setShowScroll] = useState(false)

  //Window scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  const handleMobileOpen = useCallback(() => setMobileOpen(true), [])
  const handleMobileClose = useCallback(() => setMobileOpen(false), [])
  const handleToggleSidebar = useCallback(() => {
    setDesktopExpanded((prev) => !prev)
  }, [])

  //Scroll to top using window
  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const pageTitle = useMemo(() => {
    switch (location.pathname) {
      case '/transactions':
        return 'Transactions'
      case '/insights':
        return 'Insights'
      default:
        return 'Finance dashboard'
    }
  }, [location.pathname])

  const pageDescription = useMemo(() => {
    if (pageTitle === 'Finance dashboard') {
      return 'Track cash flow, spending, and account activity'
    }
    return `Review the latest ${pageTitle.toLowerCase()} information`
  }, [pageTitle])

  const linkClass = useCallback(({ isActive }) =>
    [
      'flex gap-[12px] rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
      isActive
        ? 'bg-fd-accent-soft text-fd-text-accent border border-fd-border-accent'
        : 'text-fd-text-muted hover:bg-fd-accent-soft hover:text-fd-text-accent border border-transparent',
    ].join(' '),
    []
  )

  const asideClassName = useMemo(
    () => [
      'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-fd-border bg-fd-bg-solid backdrop-blur-md transition-all duration-200',
      desktopExpanded ? 'w-64' : 'w-20',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ].join(' '),
    [desktopExpanded, mobileOpen]
  )

  const mainClassName = useMemo(
    () => `flex min-w-0 flex-1 flex-col transition-all duration-200 ${
      desktopExpanded ? 'lg:pl-64' : 'lg:pl-20'
    }`,
    [desktopExpanded]
  )

  return (
    <div className="flex min-h-dvh bg-fd-bg text-fd-text">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-fd-surface-muted lg:hidden"
          aria-label="Close menu"
          onClick={handleMobileClose}
        />
      ) : null}

      <aside className={asideClassName}>
        <div className="flex h-16 items-center justify-between gap-2 border-b border-fd-border px-4">
          <NavLink
            to="/"
            className={`flex items-center gap-2 ${desktopExpanded ? '' : 'justify-center w-full'}`}
            onClick={handleMobileClose}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-fd-accent-soft text-sm font-bold text-fd-text-accent">
              ZV
            </div>
            {desktopExpanded ? (
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-fd-text">Fido</p>
                </div>
              </div>
            ) : null}
          </NavLink>
          <button
            type="button"
            className="rounded-lg p-2 text-fd-text-muted hover:bg-fd-glass-12 lg:hidden cursor-pointer"
            onClick={handleMobileClose}
            aria-label="Close sidebar"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
          <div>
            <p className={`px-3 pb-2 text-3xs uppercase tracking-[0.25em] text-fd-text-muted ${desktopExpanded ? 'block' : 'hidden'}`}>
              Dashboard
            </p>
            <div className="space-y-1">
              {dashboardLinks.map((item) => (
                <NavItem
                  key={item.to}
                  item={item}
                  linkClass={linkClass}
                  desktopExpanded={desktopExpanded}
                  onNavClick={handleMobileClose}
                />
              ))}
            </div>
          </div>

          <div>
            <p className={`px-3 pb-2 text-3xs uppercase tracking-[0.25em] text-fd-text-muted ${desktopExpanded ? 'block' : 'hidden'}`}>
              Pages
            </p>
            <div className="space-y-1">
              {pageLinks.map((item) => (
                <NavItem
                  key={item.to}
                  item={item}
                  linkClass={linkClass}
                  desktopExpanded={desktopExpanded}
                  onNavClick={handleMobileClose}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className={`border-t border-fd-border p-3 ${desktopExpanded ? '' : 'px-0 text-center'}`}>
          <p className={`text-sm font-semibold text-fd-text ${desktopExpanded ? '' : 'sr-only'}`}>
            Amisha Abasana
          </p>
          <p className={`mt-0.5 text-2xs text-fd-text-muted ${desktopExpanded ? '' : 'sr-only'}`}>
            {isAdmin ? 'Administrator' : 'Viewer access'}
          </p>
          {!desktopExpanded ? (
            <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-fd-glass-5 text-fd-text-muted">
              ZV
            </div>
          ) : null}
        </div>
      </aside>

      <div className={mainClassName}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-fd-border bg-fd-bg-solid/95 px-4 backdrop-blur-md">
          <button
            type="button"
            className="rounded-lg p-2 text-fd-text-muted hover:bg-fd-glass-12 lg:hidden cursor-pointer"
            onClick={handleMobileOpen}
            aria-label="Open menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="hidden rounded-lg p-2 text-fd-text-muted hover:bg-fd-glass-12 lg:inline-flex cursor-pointer"
            onClick={handleToggleSidebar}
            aria-label={desktopExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {desktopExpanded ? <FiMenu className="h-5 w-5" /> : <FiX className="h-5 w-5" />}
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-fd-text sm:text-lg">
              {pageTitle}
            </h1>
            <p className="hidden text-xs text-fd-text-muted sm:block">
              {pageDescription}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-fd-border-elevated-50 bg-fd-elevated p-2 text-fd-text transition hover:bg-fd-glass-12 cursor-pointer"
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
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Scroll to top"
          className={`fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-fd-border bg-fd-border-elevated-muted text-fd-text transition duration-300 hover:bg-fd-glass-12 hover:border-fd-border-accent focus:outline-none focus:ring-2 focus:ring-fd-accent sm:bottom-8 sm:right-8 cursor-pointer ${showScroll ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          <FiArrowUp className="h-5 w-5" />
        </button>

        {/* Footer */}
        <Footer/>
      </div>
    </div>
  )
}
