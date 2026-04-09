import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AppLayout } from './components/AppLayout.jsx'
import { FinanceProvider } from './context/FinanceContext.jsx'
import { PageLoader } from './components/PageLoader.jsx'

import 'react-toastify/dist/ReactToastify.css'

// Code splitting with lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard.jsx').then(m => ({ default: m.Dashboard })))
const Transactions = lazy(() => import('./pages/Transactions.jsx').then(m => ({ default: m.Transactions })))
const Insights = lazy(() => import('./pages/Insights.jsx').then(m => ({ default: m.Insights })))

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="transactions" element={<Suspense fallback={<PageLoader />}><Transactions /></Suspense>} />
            <Route path="insights" element={<Suspense fallback={<PageLoader />}><Insights /></Suspense>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          theme="light"
          toastClassName="!bg-fd-elevated !text-fd-text !border !border-fd-border-accent"
          progressClassName="!bg-fd-accent"
          autoClose={2800}
        />
      </BrowserRouter>
    </FinanceProvider>
  )
}
