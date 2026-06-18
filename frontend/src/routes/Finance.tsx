import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFinanceStore } from '../store/financeStore'
import {
  Plus,
  Search,
  AlertTriangle,
  X,
  TrendingUp,
  TrendingDown,
  Calculator,
  Sparkles
} from 'lucide-react'

export default function Finance() {
  const budgets = useFinanceStore((state) => state.budgets)
  const cashFlow = useFinanceStore((state) => state.cashFlow)
  const addBudgetRevision = useFinanceStore((state) => state.addBudgetRevision)

  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("All")
  const [isRevisionOpen, setIsRevisionOpen] = useState(false)
  const [activeCostCode, setActiveCostCode] = useState("")
  const [revisionAmount, setRevisionAmount] = useState(0)

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeCostCode || revisionAmount <= 0) return
    addBudgetRevision(activeCostCode, revisionAmount)
    setIsRevisionOpen(false)
    setActiveCostCode("")
    setRevisionAmount(0)
  }

  const filtered = budgets.filter(b => {
    const matchesSearch = b.costCode.includes(search) || b.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = selectedStatus === "All" || b.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Financial Telemetry Metrics
  const totalBaseline = budgets.reduce((acc, b) => acc + b.baseline, 0)
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0)
  const totalVariance = totalBaseline - totalSpent

  // Custom Interactive SVG Cash Flow In vs Out Graph
  const maxCashValue = Math.max(...cashFlow.flatMap(c => [c.inflow, c.outflow]))
  const chartHeight = 110
  const chartWidth = 500
  const barWidth = 20

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6 gap-4">
        <div className="text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">Financial Intelligence Center</h1>
          <p className="text-xs text-muted-foreground">Manage project baseline allocations, approve purchase order commitments, and trace portfolios profitability.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (budgets.length > 0) {
                setActiveCostCode(budgets[0].costCode)
                setRevisionAmount(budgets[0].revised)
                setIsRevisionOpen(true)
              }
            }}
            className="px-4 py-2.5 bg-brand-safety text-white text-xs font-bold rounded-lg hover:bg-brand-safety/90 shadow shadow-brand-safety/15 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Adjust Budget
          </button>
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised text-left space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Baseline Budget</span>
            <Calculator className="w-4 h-4 text-brand-safety" />
          </div>
          <p className="text-2xl font-bold font-heading">${totalBaseline.toLocaleString()}</p>
          <p className="text-[10px] text-brand-success font-semibold flex items-center gap-1">
            🟢 Active project cost baseline allocations
          </p>
        </div>

        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised text-left space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Actual Spent (ACWP)</span>
            <TrendingUp className="w-4 h-4 text-brand-accent" />
          </div>
          <p className="text-2xl font-bold font-heading">${totalSpent.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">
            {Math.round((totalSpent / totalBaseline) * 100)}% of total allocated budget consumed
          </p>
        </div>

        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised text-left space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Project Cost Variance</span>
            {totalVariance >= 0 ? <TrendingDown className="w-4 h-4 text-brand-success" /> : <AlertTriangle className="w-4 h-4 text-brand-danger" />}
          </div>
          <p className="text-2xl font-bold font-heading">${totalVariance.toLocaleString()}</p>
          <p className={`text-[10px] font-semibold flex items-center gap-1 ${totalVariance >= 0 ? 'text-brand-success' : 'text-brand-danger'}`}>
            {totalVariance >= 0 ? '🟢 Under Budget surplus' : '⚠️ Cost overrun risk detected'}
          </p>
        </div>
      </div>

      {/* Cash Flow Forecast graph widget */}
      <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h3 className="font-heading font-extrabold text-sm">Monthly Liquidity Analysis (Inflow vs. Outflow)</h3>
          <div className="flex gap-3 text-[10px] font-semibold">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand-success rounded-sm"></span> Inflow</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand-danger rounded-sm"></span> Outflow</span>
          </div>
        </div>

        <div className="relative w-full aspect-[16/5] bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
          <svg className="w-full h-full text-slate-800" viewBox="0 0 500 130" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="65" x2="500" y2="65" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />

            {/* Custom columns bars */}
            {cashFlow.map((cf, idx) => {
              const xStart = idx * (chartWidth / cashFlow.length) + 20
              const inflowHeight = (cf.inflow / maxCashValue) * chartHeight
              const outflowHeight = (cf.outflow / maxCashValue) * chartHeight

              const inflowY = chartHeight - inflowHeight + 5
              const outflowY = chartHeight - outflowHeight + 5

              return (
                <g key={idx} className="group cursor-pointer">
                  {/* Inflow bar */}
                  <rect
                    x={xStart}
                    y={inflowY}
                    width={barWidth}
                    height={inflowHeight}
                    fill="#10B981"
                    rx="2"
                    className="hover:fill-opacity-90 transition-all"
                  />
                  {/* Outflow bar */}
                  <rect
                    x={xStart + barWidth + 2}
                    y={outflowY}
                    width={barWidth}
                    height={outflowHeight}
                    fill="#EF4444"
                    rx="2"
                    className="hover:fill-opacity-90 transition-all"
                  />
                </g>
              )
            })}
          </svg>

          {/* Labels */}
          <div className="flex justify-between text-[9px] text-slate-500 font-mono pt-2 border-t border-slate-900 mt-2">
            {cashFlow.map((c, idx) => (
              <span key={idx} style={{ width: `${chartWidth / cashFlow.length}px`, textAlign: 'center' }}>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#141B2D] border border-border p-4 rounded-xl shadow-raised text-left">
        <div className="flex gap-2">
          {["All", "Optimal", "Warning", "Overrun"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStatus === st
                  ? 'bg-brand-safety text-white shadow shadow-brand-safety/15'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search Cost Code, scope description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg text-left"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Cost Codes Baseline Grid Table */}
      <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl shadow-raised overflow-x-auto text-left">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase tracking-wider font-bold">
              <th className="p-4">Cost Code</th>
              <th className="p-4">Scope description</th>
              <th className="p-4 text-right">Baseline Budget</th>
              <th className="p-4 text-right">Revised Budget</th>
              <th className="p-4 text-right">Expended spent</th>
              <th className="p-4">Health</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                <td className="p-4 font-mono font-bold">{b.costCode}</td>
                <td className="p-4">{b.description}</td>
                <td className="p-4 text-right font-bold">${b.baseline.toLocaleString()}</td>
                <td className="p-4 text-right font-bold text-slate-500">${b.revised.toLocaleString()}</td>
                <td className="p-4 text-right font-bold text-brand-accent">${b.spent.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    b.status === 'Optimal' ? 'bg-brand-success/10 text-brand-success' :
                    b.status === 'Warning' ? 'bg-brand-safety/10 text-brand-safety' : 'bg-brand-danger/10 text-brand-danger'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link
                    to={`/finance/${b.id}`}
                    className="inline-flex px-3 py-1.5 bg-muted hover:bg-brand-safety hover:text-white rounded-md transition-all font-bold mr-2"
                  >
                    Drill Down
                  </Link>
                  <button
                    onClick={() => {
                      setActiveCostCode(b.costCode)
                      setRevisionAmount(b.revised)
                      setIsRevisionOpen(true)
                    }}
                    className="inline-flex px-3 py-1.5 bg-muted hover:bg-slate-700 hover:text-white rounded-md transition-all font-bold text-[10px]"
                  >
                    Adjust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust Budget dialog modal */}
      {isRevisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsRevisionOpen(false)}></div>
          
          <form onSubmit={handleRevisionSubmit} className="w-full max-w-md bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Adjust Cost Code Baseline</h3>
                <p className="text-[10px] text-muted-foreground">Submit a budget revision baseline commitment</p>
              </div>
              <button type="button" onClick={() => setIsRevisionOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Target Cost Code</label>
                <select
                  value={activeCostCode}
                  onChange={(e) => {
                    const b = budgets.find(x => x.costCode === e.target.value)
                    setActiveCostCode(e.target.value)
                    if (b) setRevisionAmount(b.revised)
                  }}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                >
                  {budgets.map((b) => (
                    <option key={b.id} value={b.costCode}>{b.costCode} - {b.description}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">New Revised Baseline Budget ($)</label>
                <input
                  type="number"
                  required
                  value={revisionAmount}
                  onChange={(e) => setRevisionAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button
                type="button"
                onClick={() => setIsRevisionOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-safety text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Commmit Adjust
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
