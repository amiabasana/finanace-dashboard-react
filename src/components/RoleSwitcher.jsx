import { memo } from 'react'
import { useFinance } from '../context/FinanceContext.jsx'

export const RoleSwitcher = memo(function RoleSwitcher() {
  const { role, setRole, isAdmin } = useFinance()

  return (
    <div className="flex items-center gap-2">
      <select
        id="role-select"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="max-w-36 rounded-lg border border-fd-border-elevated-50 bg-fd-surface px-2 py-1.5 text-xs font-medium text-fd-text focus:border-fd-border-accent focus:outline-none focus:ring-1 focus:ring-fd-accent sm:max-w-none sm:text-sm cursor-pointer"
        aria-describedby="role-hint"
      >
        <option value="viewer">Viewer (Read-only)</option>
        <option value="admin">Admin (Edit)</option>
      </select>
      <span
        id="role-hint"
        className="hidden rounded-md border border-fd-border px-2 py-1 text-4xs text-fd-text-muted lg:inline lg:max-w-35 lg:truncate"
        title={
          isAdmin
            ? 'You can add, edit, and remove transactions.'
            : 'You can view and filter data only.'
        }
      >
        {isAdmin ? 'Edit enabled' : 'View only'}
      </span>
    </div>
  )
})
