import { memo, useMemo } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiArrowDownRight, FiArrowUpRight, FiDollarSign } from "react-icons/fi";
import { useFinance } from "../context/FinanceContext.jsx";
import { RevealOnScroll } from "../components/RevealOnScroll.jsx";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const tooltipStyle = {
  contentStyle: {
    background: "#252b37",
    border: "1px solid #427cf033",
    borderRadius: 8,
    color: "#f9fafb",
  },
  labelStyle: { color: "#9da3af" },
};

const StatCard = memo(function StatCard({ title, value, accent, icon}) {
  const bg =
    accent === "accent"
      ? "bg-fd-accent-soft border-fd-border-accent"
      : accent === "success"
        ? "bg-fd-success-soft border-fd-border"
        : "bg-fd-glass-12 border-fd-border";

  const iconBg =
    accent === "accent"
      ? "bg-blue-100"
      : accent === "success"
        ? "bg-green-100"
        : "bg-blue-100";

  const iconColor =
    accent === "accent"
      ? "text-blue-600"
      : accent === "success"
        ? "text-green-600"
        : "text-blue-600";

  return (
    <div
      className={`flex rounded-xl border p-4 shadow-sm ${bg} hover:-translate-y-1.5 transition-all duration-300 ease-in-out`}
    >
      <div className="flex-1">
        <p className="card-title">
          {title}
        </p>
        <p className="mt-2 xl:text-3xl md:text-xl font-semibold tabular-nums text-fd-text sm:text-xl">
          {value}
        </p>
      </div>
      <div className={`h-12 w-12 lg:h-14 lg:w-14 rounded-lg sm:rounded-xl lg:rounded-2xl ${iconBg} flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
    </div>
  );
})

const EmptyChart = memo(function EmptyChart({ message }) {
  return (
    <div className="flex h-64 items-center justify-center px-4 text-center text-sm text-fd-text-muted sm:h-72">
      {message}
    </div>
  );
})

export function Dashboard() {
  const {
    summary,
    monthly,
    balanceTrend,
    categorySpending,
    transactions,
    insights,
  } = useFinance();

  const recent = useMemo(
    () => [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5),
    [transactions]
  );

  const hasData = transactions.length > 0;

  return (
    <RevealOnScroll className="mx-auto flex max-w-full flex-col gap-6">
      {!hasData ? (
        <div
          className="rounded-xl border border-fd-border-accent bg-fd-accent-soft px-4 py-3 text-sm text-fd-text"
          role="status"
        >
          No transactions yet. Switch to{" "}
          <strong className="text-fd-text-accent">Admin</strong> and add entries
          on the Transactions page, or load mock data from there.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div data-reveal>
          <StatCard
            title="Total balance"
            value={currency(summary.balance)}
            // hint="Income minus expenses (all time)"
            accent="accent"
            icon={<FiDollarSign className="h-6 w-6" />}
          />
        </div>
        <div data-reveal>
          <StatCard
            title="Total income"
            value={currency(summary.totalIncome)}
            accent="success"
            icon={<FiArrowUpRight className="h-6 w-6" />}
          />
        </div>
        <div data-reveal className="sm:col-start-1 sm:col-end-3 md:col-auto">
          <StatCard
            title="Total expenses"
            value={currency(summary.totalExpense)}
            icon={<FiArrowDownRight className="h-6 w-6" />}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section
          data-reveal
          className="rounded-xl border border-fd-border bg-fd-glass-5 p-4"
        >
          <h2 className="text-xl font-semibold text-fd-text">Balance Trend</h2>
          <p className="mt-0.5 text-sm text-fd-text-muted">
            Running balance by month (cumulative net cash flow)
          </p>
          <div className="mt-4 h-64 w-full min-w-0 sm:h-72">
            {!hasData || balanceTrend.length === 0 ? (
              <EmptyChart message="Not enough monthly data for a trend yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={balanceTrend}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#252b374d"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#9da3af", fontSize: 11 }}
                    axisLine={{ stroke: "#252b3766" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9da3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      `$${Number(v) >= 1000 ? `${Number(v) / 1000}k` : v}`
                    }
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value) => currency(Number(value ?? 0))}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#427cf0"
                    strokeWidth={2}
                    dot={{ fill: "#427cf0", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section
          data-reveal
          className="rounded-xl border border-fd-border bg-fd-surface p-4"
        >
          <h2 className="text-xl font-semibold text-fd-text">
            Spending by Category
          </h2>
          <p className="mt-0.5 text-sm text-fd-text-muted">
            Expense totals grouped by category
          </p>
          <div className="mt-4 h-64 w-full min-w-0 sm:h-72">
            {categorySpending.length === 0 ? (
              <EmptyChart message="No expense transactions yet — add some to see a breakdown." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={categorySpending}
                  margin={{ top: 8, right: 16, left: 4, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#252b374d"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#9da3af", fontSize: 11 }}
                    axisLine={{ stroke: "#252b3766" }}
                    tickLine={false}
                    tickFormatter={(v) =>
                      `$${Number(v) >= 1000 ? `${Number(v) / 1000}k` : v}`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={88}
                    tick={{ fill: "#9da3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value) => currency(Number(value ?? 0))}
                  />
                  <Bar
                    dataKey="value"
                    fill="#427cf0"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section
          data-reveal
          className="rounded-xl border border-fd-border bg-fd-glass-5 p-4 lg:col-span-2"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-fd-text">Cash Flow</h2>
              <p className="mt-0.5 text-sm text-fd-text-muted">
                Monthly income vs expenses
              </p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 text-fd-text-muted">
                <span
                  className="size-2 rounded-full"
                  style={{ background: "#427cf0" }}
                />
                Income
              </span>
              <span className="inline-flex items-center gap-1.5 text-fd-text-muted">
                <span
                  className="size-2 rounded-full"
                  style={{ background: "#9da3af" }}
                />
                Expense
              </span>
            </div>
          </div>
          <div className="h-64 w-full min-w-0 sm:h-72">
            {monthly.length === 0 ? (
              <EmptyChart message="Add dated transactions to plot cash flow." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthly}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="dash-inc" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#427cf0"
                        stopOpacity={0.35}
                      />
                      <stop offset="100%" stopColor="#427cf0" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dash-exp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9da3af" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#9da3af" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#252b374d"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#9da3af", fontSize: 11 }}
                    axisLine={{ stroke: "#252b3766" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9da3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      `$${Number(v) >= 1000 ? `${Number(v) / 1000}k` : v}`
                    }
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value) => currency(Number(value ?? 0))}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#427cf0"
                    strokeWidth={2}
                    fill="url(#dash-inc)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#9da3af"
                    strokeWidth={2}
                    fill="url(#dash-exp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-fd-border bg-fd-surface p-4">
          <h2 className="text-xl font-semibold text-fd-text">Insights</h2>
          <p className="mt-0.5 text-sm text-fd-text-muted">
            Quick signals from your data
          </p>
          <ul className="mt-4 space-y-3 text-sm grid md:grid-cols-3 md:gap-3 lg:block sm:grid-cols-2 gap-2">
            <li className="rounded-lg border border-fd-border-elevated-muted bg-fd-glass-5 p-3 lg:mb-3 mb-0">
              <p className="card-title">
                Highest spending category
              </p>
              <p className="mt-1 font-semibold text-fd-text">
                {insights.topCategory
                  ? `${insights.topCategory.name} · ${currency(insights.topCategory.amount)}`
                  : "—"}
              </p>
            </li>
            <li className="rounded-lg border border-fd-border-elevated-muted bg-fd-glass-5 p-3 lg:mb-3 mb-0">
              <p className="card-title">
                Monthly comparison
              </p>
              {insights.monthCompare ? (
                <div className="mt-2 space-y-1 text-xs text-fd-text-muted">
                  <p>
                    <span className="text-fd-text">
                      {insights.monthCompare.fromLabel}
                    </span>{" "}
                    →{" "}
                    <span className="text-fd-text">
                      {insights.monthCompare.toLabel}
                    </span>
                  </p>
                  <p>
                    Expenses:{" "}
                    <span
                      className={
                        insights.monthCompare.expenseDelta > 0
                          ? "text-fd-text"
                          : "text-fd-text-accent"
                      }
                    >
                      {insights.monthCompare.expenseDelta > 0 ? "+" : ""}
                      {currency(insights.monthCompare.expenseDelta)}
                    </span>
                  </p>
                  <p>
                    Income:{" "}
                    <span className="text-fd-text-accent">
                      {insights.monthCompare.incomeDelta > 0 ? "+" : ""}
                      {currency(insights.monthCompare.incomeDelta)}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="mt-1 text-xs text-fd-text-dim">
                  Need at least two months of data.
                </p>
              )}
            </li>
            <li className="rounded-lg border border-fd-border-elevated-muted bg-fd-glass-5 p-3 lg:mb-3 mb-0">
              <p className="card-title">
                Avg expense (per line item)
              </p>
              <p className="mt-1 font-semibold tabular-nums text-fd-text">
                {insights.avgExpense > 0 ? currency(insights.avgExpense) : "—"}
              </p>
              <p className="mt-1 text-3xs text-fd-text-muted">
                {insights.expenseTxCount} expense · {insights.incomeTxCount}{" "}
                income records
              </p>
            </li>
            <li className="border-t border-fd-border-elevated-muted pt-3 text-xs leading-relaxed text-fd-text-muted sm:col-start-1 sm:col-end-4">
              {insights.observation}
            </li>
          </ul>
        </section>
      </div>

      <section
        data-reveal
        className="overflow-hidden rounded-xl border border-fd-border bg-fd-glass-5"
      >
        <div className="border-b border-fd-border px-4 py-3">
          <h2 className="text-xl font-semibold text-fd-text">
            Recent Activity
          </h2>
          <p className="mt-0.5 text-sm text-fd-text-muted">
            Latest five by date (Full list on transactions)
          </p>
        </div>
        {recent.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-fd-text-muted">
            Nothing to show yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-130 text-left text-sm">
              <thead>
                <tr className="border-b border-fd-border text-xs uppercase text-fd-text-muted">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-fd-border-elevated-muted last:border-0 hover:bg-fd-glass-12"
                  >
                    <td className="px-4 py-3 tabular-nums text-fd-text-muted">
                      {t.date}
                    </td>
                    <td className="px-4 py-3 text-fd-text">{t.description}</td>
                    <td className="px-4 py-3 text-fd-text-muted">
                      {t.category}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium tabular-nums ${
                        t.type === "income"
                          ? "text-fd-text-accent"
                          : "text-fd-text"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {currency(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </RevealOnScroll>
  );
}
