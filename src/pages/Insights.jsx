import { memo, useMemo } from 'react'
import { useFinance } from '../context/FinanceContext.jsx'
import { RevealOnScroll } from '../components/RevealOnScroll.jsx'

const currency = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export const Insights = memo(function Insights() {
  const { insights, summary } = useFinance()

  const balanceDisplay = useMemo(() => currency(summary.balance), [summary.balance])

  return (
    <RevealOnScroll className="mx-auto flex max-w-full flex-col gap-6">
      <section data-reveal className="rounded-xl border border-fd-border bg-fd-surface p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-fd-text">Insights</h1>
            <p className="mt-1 max-w-2xl text-sm text-fd-text-muted">
              A quick summary of your top spending category, recent monthly changes, and useful observations.
            </p>
          </div>
          <div className="rounded-2xl bg-fd-glass-12 px-4 py-3 text-sm text-fd-text-muted">
            Total balance: <span className="text-fd-text font-semibold lg:text-base">{balanceDisplay}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
        <article data-reveal className="rounded-3xl border border-fd-border bg-fd-glass-5 p-5">
          <p className="card-title">
            Highest spending category
          </p>
          <p className="mt-3 sm:text-3xl text-2xl font-semibold text-fd-text">
            {insights.topCategory ? insights.topCategory.name : 'No Data'}
          </p>
          <p className="mt-2 text-sm text-fd-text-accent xl:text-2xl lg:text-xl">
            {insights.topCategory
              ? currency(insights.topCategory.amount)
              : 'Add expense transactions to see results.'}
          </p>
        </article>

        <article data-reveal className="rounded-3xl border border-fd-border bg-fd-glass-5 p-5">
          <p className="card-title">
            Monthly comparison
          </p>
          {insights.monthCompare ? (
            <div className="mt-3 space-y-2 text-sm text-fd-text">
              <p>
                <span className="font-semibold text-fd-text">{insights.monthCompare.fromLabel}</span> →{' '}
                <span className="font-semibold text-fd-text">{insights.monthCompare.toLabel}</span>
              </p>
              <p>
                Expense change:{' '}
                <span className="text-fd-text-accent">
                  {insights.monthCompare.expenseDelta >= 0 ? '+' : ''}
                  {currency(insights.monthCompare.expenseDelta)}
                </span>
              </p>
              <p>
                Income change:{' '}
                <span className="text-fd-text-accent">
                  {insights.monthCompare.incomeDelta >= 0 ? '+' : ''}
                  {currency(insights.monthCompare.incomeDelta)}
                </span>
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-fd-text-muted">
              Need at least two months of data to compare.
            </p>
          )}
        </article>

        <article data-reveal className="rounded-3xl border border-fd-border bg-fd-glass-5 p-5 sm:col-start-1 sm:col-end-3 md:col-start-auto md:col-end-auto">
          <p className="card-title">
            Useful observation
          </p>
          <p className="mt-4 text-sm leading-7 text-fd-text-muted">
            {insights.observation}
          </p>
        </article>
      </div>

      <section data-reveal className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-fd-border bg-fd-glass-5 p-5">
          <h2 className="card-title">Transaction snapshot</h2>
          <p className="mt-2 text-sm text-fd-text-dim">
            {insights.expenseTxCount} expense records and {insights.incomeTxCount} income records.
          </p>
        </div>
        <div className="rounded-3xl border border-fd-border bg-fd-glass-5 p-5">
          <h2 className="card-title">Average expense</h2>
          <p className="mt-2 xl:text-2xl lg:text-xl text-lg font-semibold text-fd-text">
            {insights.avgExpense > 0 ? currency(insights.avgExpense) : '—'}
          </p>
          <p className="mt-2 text-sm text-fd-text-muted">
            Average value of your expense line items.
          </p>
        </div>
      </section>
    </RevealOnScroll>
  )
})
