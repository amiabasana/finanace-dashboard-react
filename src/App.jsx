import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AppLayout } from './components/AppLayout.jsx'
import { FinanceProvider } from './context/FinanceContext.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Insights } from './pages/Insights.jsx'
import { Transactions } from './pages/Transactions.jsx'

import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="insights" element={<Insights />} />
            <Route path="transactions" element={<Transactions />} />
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
