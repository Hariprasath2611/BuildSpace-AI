import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAnalyticsStore } from '@/store/analyticsStore'
import {
  TrendingUp,
  Activity,
  ChevronLeft,
  Calendar,
  ShieldAlert,
  Play
} from 'lucide-react'

interface CostCodeItem {
  code: string
  name: string
  budget: number
  actual: number
  variance: number
}

const COST_CODES: Record<string, CostCodeItem[]> = {
  p_1: [
    { code: "03-300", name: "Concrete Structural Pouring", budget: 4500000, actual: 4620000, variance: 120000 },
    { code: "05-100", name: "Structural Metal Steel Framing", budget: 3800000, actual: 3680000, variance: -120000 },
    { code: "09-250", name: "Internal Gypsum Drywalling", budget: 2200000, actual: 2310000, variance: 110000 }
  ],
  p_2: [
    { code: "02-200", name: "Earthwork Excavation Grading", budget: 1200000, actual: 1350000, variance: 150000 },
    { code: "03-300", name: "Foundation Concrete Pouring", budget: 2500000, actual: 2420000, variance: -80000 }
  ]
}

export default function AnalyticsDetail() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get("projectId") || "p_1"


  const [activeSubTab, setActiveSubTab] = useState<'costs' | 'schedule' | 'defects'>('costs')

  // AI Project Chat Sidebar state
  const [projectPrompt, setProjectPrompt] = useState("")
  const [projectChatLog, setProjectChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: "I have loaded this project's cost sheets, WBS schedule logs, and defect compliance records. Ask me to run forecasts or analyze variances." }
  ])
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Retrieve project metadata
  const projectName = projectId === "p_1"
    ? "Apex Residences"
    : projectId === "p_2"
      ? "Sector B Site"
      : projectId === "p_3"
        ? "Metro Line Underground"
        : "Commercial Office Tower"

  const projectHealth = projectId === "p_2" ? "warning" : projectId === "p_4" ? "critical" : "optimal"

  const costCodes = COST_CODES[projectId] || [
    { code: "01-000", name: "General Project Logistics", budget: 5000000, actual: 4800000, variance: -200000 }
  ]

  // RFI Clash Defects checklist
  const mockDefects = [
    { id: "df_1", name: "Zone B Concrete Core Honeycombing", status: "Open", loggedDate: "2026-06-12" },
    { id: "df_2", name: "Sector C Handrail height variance", status: "Resolved", loggedDate: "2026-06-08" }
  ]

  const handleSendPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectPrompt.trim()) return

    const newLog = [...projectChatLog, { role: 'user' as const, text: projectPrompt }]
    setProjectChatLog(newLog)
    setProjectPrompt("")
    setIsAiLoading(true)

    setTimeout(() => {
      let aiText = "Analyzing project cost codes..."
      if (projectPrompt.toLowerCase().includes("cost") || projectPrompt.toLowerCase().includes("budget")) {
        aiText = `Based on cost codes data, concrete pouring is currently showing a budget overrun of **$120,000** due to subcontractor mobilization delays. Steel framing is running **$120,000** under budget, maintaining a balanced net margin.`
      } else if (projectPrompt.toLowerCase().includes("schedule") || projectPrompt.toLowerCase().includes("delay")) {
        aiText = "The critical path schedule indicates a potential 4-day drift on milestone [Structural Framing] due to Friday's lightning warnings. Suggest shifting crews to internal tasks."
      } else {
        aiText = "I have scanned this project's EHS logs and punchlist records. TRIR is stable, and 1 quality honeycomb defect is open in Zone B."
      }
      setProjectChatLog((prev) => [...prev, { role: 'assistant' as const, text: aiText }])
      setIsAiLoading(false)
    }, 1200)
  }

  return (
    <div className="space-y-6 py-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER ROW */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <Link
            to="/analytics"
            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Analytics Directory
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight">
              {projectName} Analytics Workspace
            </h1>
            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
              projectHealth === 'optimal'
                ? 'bg-emerald-500/10 text-emerald-500'
                : projectHealth === 'warning'
                  ? 'bg-amber-500/10 text-amber-600'
                  : 'bg-rose-500/10 text-rose-500'
            }`}>
              {projectHealth} health
            </span>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Cost lists, SVGs and checklist panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sub Tab switcher */}
          <div className="flex border-b border-border/80 gap-2">
            {[
              { id: 'costs', label: 'Cost Codes ledgers', icon: TrendingUp },
              { id: 'schedule', label: 'Schedule Variance curve', icon: Calendar },
              { id: 'defects', label: 'Punchlist Defects checklist', icon: ShieldAlert }
            ].map((sub) => {
              const Icon = sub.icon
              const isActive = activeSubTab === sub.id
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  style={isActive ? { borderBottomColor: '#FF7B00', color: '#FF7B00' } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {sub.label}
                </button>
              )
            })}
          </div>

          {/* Sub Tab Content 1: Cost codes */}
          {activeSubTab === 'costs' && (
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Detailed Cost Variance Ledgers
              </h3>

              <div className="border border-border/60 rounded-xl overflow-hidden bg-muted/5">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/30 border-b border-border/80 text-[10px] uppercase font-mono text-muted-foreground">
                    <tr>
                      <th className="p-3">Cost Code</th>
                      <th className="p-3">Budget Item Name</th>
                      <th className="p-3 text-right">Baseline Budget</th>
                      <th className="p-3 text-right">Actual Cost</th>
                      <th className="p-3 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-semibold text-slate-700 dark:text-slate-200">
                    {costCodes.map((item) => (
                      <tr key={item.code}>
                        <td className="p-3 font-mono text-[11px] text-muted-foreground">{item.code}</td>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-right font-mono">${item.budget.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono">${item.actual.toLocaleString()}</td>
                        <td className={`p-3 text-right font-mono ${item.variance <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {item.variance <= 0 ? '-' : '+'}${Math.abs(item.variance).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub Tab Content 2: Schedule Variance curve */}
          {activeSubTab === 'schedule' && (
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Planned vs actual milestone completion timeline
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground font-mono">
                  Variance rating (Days drift)
                </span>
              </div>

              <div className="relative h-44 bg-muted/10 rounded-xl flex items-center justify-center">
                <svg className="w-full h-full p-4" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  
                  {/* Planned Completion - Cyan */}
                  <polyline
                    fill="none"
                    stroke="#00C8FF"
                    strokeWidth="3.5"
                    points="30,150 140,110 250,85 360,70 470,30"
                    strokeLinecap="round"
                  />
                  {/* Real completion - Orange */}
                  <polyline
                    fill="none"
                    stroke="#FF7B00"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    points="30,150 140,118 250,94 360,82"
                    strokeLinecap="round"
                  />

                  <circle cx="360" cy="82" r="5" fill="#FF7B00" />
                </svg>
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-[9px] font-bold text-muted-foreground font-mono">
                  <span>Excavate</span><span>Foundations</span><span>Concrete Structure</span><span>Drywalling</span><span>Finishes</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub Tab Content 3: Punchlist defects checklist */}
          {activeSubTab === 'defects' && (
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Quality Inspections Punchlist Defects
              </h3>

              <div className="space-y-3">
                {mockDefects.map((def) => (
                  <div
                    key={def.id}
                    className="border border-border rounded-xl p-4 bg-muted/5 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{def.name}</h4>
                      <span className="text-[10px] text-muted-foreground block">Logged Date: {def.loggedDate}</span>
                    </div>

                    <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      def.status === 'Resolved'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-amber-500/10 text-amber-500 animate-pulse'
                    }`}>
                      {def.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Sidebar Analysis tool */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised flex flex-col h-[480px]">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Activity className="w-4 h-4 text-[#FF7B00] animate-pulse" />
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                AI Project Assistant
              </h3>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
              {projectChatLog.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                    log.role === 'user'
                      ? 'bg-brand-primary/10 border-[#FF7B00]/30 text-slate-900 dark:text-slate-100 ml-6'
                      : 'bg-muted/10 border-border text-slate-800 dark:text-slate-250 mr-6'
                  }`}
                  style={log.role === 'user' ? { backgroundColor: 'rgba(255, 123, 0, 0.1)' } : {}}
                >
                  <span className="font-bold uppercase tracking-wider text-[9px] text-muted-foreground block mb-1">
                    {log.role === 'user' ? 'You' : 'AI'}
                  </span>
                  {log.text}
                </div>
              ))}
              {isAiLoading && (
                <div className="p-3 border border-border bg-muted/5 rounded-xl text-[10px] text-muted-foreground animate-pulse mr-6">
                  AI parsing project cost tables...
                </div>
              )}
            </div>

            {/* Input Prompt bar */}
            <form onSubmit={handleSendPromptSubmit} className="border-t border-border pt-3 flex gap-2">
              <input
                type="text"
                value={projectPrompt}
                onChange={(e) => setProjectPrompt(e.target.value)}
                placeholder="Ask about overruns or schedule delays..."
                className="flex-1 bg-white dark:bg-[#0B0F19] border border-border rounded-lg text-xs px-3 py-2 focus:ring-1 focus:ring-[#FF7B00] focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-[#FF7B00] hover:bg-[#FF7B00]/90 text-white rounded-lg transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
