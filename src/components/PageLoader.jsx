import { memo } from 'react'

export const PageLoader = memo(function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-fd-border border-t-fd-accent" />
        <p className="text-sm text-fd-text-muted">Loading page...</p>
      </div>
    </div>
  )
})
