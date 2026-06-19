import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAnalyticsStore } from '@/store/analyticsStore'
import {
  TrendingUp,
  BarChart2,
  Search,
  Activity,
  FileText,
  Layers,
  Settings,
  Plus,
  Trash2,
  X,
  ChevronRight,
  Download,
  Mail,
  Calendar,
  Briefcase,
  ShieldCheck
} from 'lucide-react'

interface MockProjectData {
  id: string
  name: string
  progress: number
  health: 'optimal' | 'warning' | 'critical'
  variance: number
  completionDate: string
  budget: number
}

const MOCK_PROJECTS: MockProjectData[] = [
  { id: "p_1", name: "Apex Residences", progress: 78, health: "optimal", variance: -2, completionDate: "2026-08-14", budget: 12000000 },
  { id: "p_2", name: "Sector B Site", progress: 42, health: "warning", variance: 6, completionDate: "2026-11-20", budget: 4500000 },
  { id: "p_3", name: "Metro Line Underground", progress: 91, health: "optimal", variance: 0, completionDate: "2026-06-30", budget: 25000000 },
  { id: "p_4", name: "Commercial Office Tower", progress: 15, health: "critical", variance: 12, completionDate: "2027-02-15", budget: 18500000 }
]

export default function Analytics() {
  // Zustand Store binding
  const kpis = useAnalyticsStore((state) => state.kpis)
  const schedules = useAnalyticsStore((state) => state.schedules)
  const customReportFields = useAnalyticsStore((state) => state.customReportFields)
  const forecasts = useAnalyticsStore((state) => state.forecasts)
  const companyHealthScore = useAnalyticsStore((state) => state.companyHealthScore)
  const netCashFlow = useAnalyticsStore((state) => state.netCashFlow)
  const activeIncidentCount = useAnalyticsStore((state) => state.activeIncidentCount)

  const updateKPIThreshold = useAnalyticsStore((state) => state.updateKPIThreshold)
  const addSchedule = useAnalyticsStore((state) => state.addSchedule)
  const toggleScheduleEnabled = useAnalyticsStore((state) => state.toggleScheduleEnabled)
  const deleteSchedule = useAnalyticsStore((state) => state.deleteSchedule)
  const toggleCustomField = useAnalyticsStore((state) => state.toggleCustomField)
  const triggerManualExport = useAnalyticsStore((state) => state.triggerManualExport)

  // Navigation states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'builder' | 'kpis' | 'forecasting' | 'scheduler'>('dashboard')
  const [projectSearch, setProjectSearch] = useState("")

  // Custom Report Builder Wizard states
  const [selectedSource, setSelectedSource] = useState<'Projects' | 'Finance' | 'Materials' | 'Workforce' | 'Safety'>('Projects')
  const [reportFormat, setReportFormat] = useState<'PDF' | 'Excel' | 'CSV'>('PDF')
  const [isExporting, setIsExporting] = useState(false)
  const [downloadLink, setDownloadLink] = useState<string | null>(null)

  // Report Delivery Scheduler States
  const [newScheduleName, setNewScheduleName] = useState("")
  const [newScheduleFreq, setNewScheduleFreq] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly')
  const [newScheduleEmails, setNewScheduleEmails] = useState("")
  const [newScheduleFormat, setNewScheduleFormat] = useState<'PDF' | 'Excel' | 'CSV'>('PDF')
  const [showAddScheduler, setShowAddScheduler] = useState(false)

  // Active Forecast Model state
  const [activeForecastModel, setActiveForecastModel] = useState<'cashflow' | 'material'>('cashflow')

  // Quick Action Export handler
  const handleManualExportTrigger = async (format: 'PDF' | 'Excel' | 'CSV', name: string) => {
    setIsExporting(true)
    setDownloadLink(null)
    try {
      const url = await triggerManualExport(format, name)
      setDownloadLink(url)
    } catch (e) {
      console.error(e)
    } finally {
      setIsExporting(false)
    }
  }

  // Add Scheduled Delivery rule
  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newScheduleName || !newScheduleEmails) return
    
    const emailList = newScheduleEmails.split(',').map((email) => email.trim())
    addSchedule({
      templateId: `temp_${Date.now()}`,
      templateName: newScheduleName,
      frequency: newScheduleFreq,
      emails: emailList,
      exportType: newScheduleFormat
    })

    setNewScheduleName("")
    setNewScheduleEmails("")
    setShowAddScheduler(false)
  }

  // Filter project cards
  const filteredProjects = MOCK_PROJECTS.filter((p) =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  )

  // Custom Report Selected Fields
  const selectedFields = customReportFields.filter((f) => f.source === selectedSource)

  return (
    <div className="space-y-6 py-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEALTH TELEMETRY TOP BAR */}
      <header className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-primary/10 text-brand-primary rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#FF7B00]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight">
              Reports & Business Intelligence Center
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Centralized BI console tracking baselines, milestone drift indices, and custom automated schedulers.
          </p>
        </div>

        {/* Corporate Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
          {/* Health Gauge */}
          <div className="bg-muted/10 border border-border/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Activity className="w-4 h-4 text-[#FF7B00]" />
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Health Rating</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{companyHealthScore}%</span>
            </div>
          </div>

          {/* Cash flow */}
          <div className="bg-muted/10 border border-border/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Net Cash Flow</span>
              <span className="text-sm font-extrabold text-emerald-500">+${(netCashFlow / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          {/* Safety */}
          <div className="bg-muted/10 border border-border/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Safety Status</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                {activeIncidentCount === 0 ? 'Compliant' : `${activeIncidentCount} Open Incidents`}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. NAVIGATION TABS */}
      <div className="flex border-b border-border overflow-x-auto gap-2 scrollbar-none">
        {[
          { id: 'dashboard', label: 'Company Overview', icon: Layers },
          { id: 'projects', label: 'Project Portfolio', icon: Briefcase },
          { id: 'builder', label: 'Custom Report Builder', icon: FileText },
          { id: 'kpis', label: 'KPI Target Thresholds', icon: Settings },
          { id: 'forecasting', label: 'ML Projections', icon: TrendingUp },
          { id: 'scheduler', label: 'Delivery Schedules', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any)
                setDownloadLink(null)
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-brand-primary text-brand-primary bg-brand-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10'
              }`}
              style={isActive ? { borderBottomColor: '#FF7B00', color: '#FF7B00' } : {}}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 3. CORE DISPLAY */}
      <main className="min-h-[500px]">
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: KPI Indicator status */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-border pb-3">
                  Company Health KPI Metrics
                </h3>

                <div className="space-y-3">
                  {kpis.map((kpi) => (
                    <div
                      key={kpi.id}
                      className="border border-border/60 rounded-xl p-3 bg-muted/5 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{kpi.name}</span>
                        <span className="text-[10px] text-muted-foreground block">{kpi.category} category</span>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="text-xs font-extrabold block">
                          {kpi.value}{kpi.unit} <span className="text-muted-foreground font-semibold text-[10px]">/ {kpi.target}{kpi.unit}</span>
                        </span>
                        <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          kpi.status === 'optimal'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : kpi.status === 'warning'
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {kpi.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Cost deviation line graph & report action board */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cost Forecast Overlay Area Chart */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Net Cash Flow Prediction Analysis
                  </h3>
                  <span className="text-[10px] font-bold text-muted-foreground font-mono">
                    Solid: Actual Cost | Dashed: ML Prediction
                  </span>
                </div>

                <div className="relative h-48 bg-muted/10 rounded-xl flex items-center justify-center">
                  <svg className="w-full h-full p-4" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                    
                    {/* Prediction line - blue */}
                    <polyline
                      fill="none"
                      stroke="#00C8FF"
                      strokeWidth="3.5"
                      points="30,130 150,105 270,140 390,95 510,80 570,55"
                      strokeLinecap="round"
                    />
                    {/* Real Line - Orange */}
                    <polyline
                      fill="none"
                      stroke="#FF7B00"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      points="30,130 150,110 270,145 390,100"
                      strokeLinecap="round"
                    />

                    <circle cx="390" cy="100" r="5" fill="#FF7B00" />
                    <circle cx="570" cy="55" r="5" fill="#00C8FF" className="animate-pulse" />
                  </svg>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-[9px] font-bold text-muted-foreground font-mono">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May (Est)</span><span>Jun (Est)</span>
                  </div>
                </div>
              </div>

              {/* Direct Export Action Widget */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Quick Export Options
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "OSHA Safety Summary", format: "PDF" as const },
                    { label: "Financial Budget Variance", format: "Excel" as const },
                    { label: "Inventory Turnover Sheet", format: "CSV" as const }
                  ].map((exportItem) => (
                    <div
                      key={exportItem.label}
                      className="border border-border/80 rounded-xl p-4 bg-muted/5 flex flex-col justify-between h-32"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-extrabold bg-[#FF7B00]/10 text-[#FF7B00] px-2 py-0.5 rounded uppercase">
                          {exportItem.format}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{exportItem.label}</h4>
                      </div>

                      <button
                        onClick={() => handleManualExportTrigger(exportItem.format, exportItem.label)}
                        disabled={isExporting}
                        className="py-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-655 font-bold rounded-lg text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Generate Export
                      </button>
                    </div>
                  ))}
                </div>

                {isExporting && (
                  <div className="border border-border rounded-xl p-4 text-center text-xs bg-muted/10 animate-pulse">
                    AI engine generating cost tables and parsing PDF coordinates...Please wait...
                  </div>
                )}

                {downloadLink && (
                  <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                    <span>Export generated successfully. Ready for archival.</span>
                    <a
                      href={downloadLink}
                      download
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg uppercase text-[10px] tracking-wider flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download file
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECT PORTFOLIO ANALYTICS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search project codes..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full text-xs bg-white dark:bg-[#141B2D] border border-border rounded-xl pl-9 pr-4 py-2.5 focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        p.health === 'optimal'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : p.health === 'warning'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {p.health} health
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                        Exp. Completion: {p.completionDate}
                      </span>
                    </div>

                    <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-slate-200">
                      {p.name}
                    </h4>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                        <span>Milestone Progress</span>
                        <span>{p.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-[#FF7B00] h-2 rounded-full" style={{ width: `${p.progress}%` }}></div>
                      </div>
                    </div>

                    {/* Cost Variance stats */}
                    <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Cost variance</span>
                        <span className={`font-mono font-bold ${p.variance <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {p.variance <= 0 ? `${p.variance} Days Ahead` : `+${p.variance} Days Drift`}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Project Budget</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          ${(p.budget / 1000000).toFixed(1)}M USD
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/analytics/detail?projectId=${p.id}`}
                    className="w-full py-2 bg-muted/40 hover:bg-muted/80 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    View detailed analytics
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOM REPORT BUILDER */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Field Options Configuration */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-border pb-3">
                Report Field Selector
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Data Source</label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value as any)}
                    className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="Projects">Projects</option>
                    <option value="Finance">Finance</option>
                    <option value="Materials">Materials</option>
                    <option value="Workforce">Workforce</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Columns to include</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedFields.map((f) => (
                      <label
                        key={f.id}
                        className="flex items-center gap-3 p-2 bg-muted/15 border border-border/60 hover:border-[#FF7B00]/40 rounded-xl cursor-pointer text-xs transition-all font-semibold"
                      >
                        <input
                          type="checkbox"
                          checked={f.isSelected}
                          onChange={() => toggleCustomField(f.id)}
                          className="rounded text-[#FF7B00] focus:ring-[#FF7B00]"
                        />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Export Type</label>
                  <select
                    value={reportFormat}
                    onChange={(e) => setReportFormat(e.target.value as any)}
                    className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Excel">Excel Spreadsheet</option>
                    <option value="CSV">Comma Separated values</option>
                  </select>
                </div>

                <button
                  onClick={() => handleManualExportTrigger(reportFormat, `${selectedSource}_Report`)}
                  disabled={isExporting}
                  className="w-full py-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: '#FF7B00' }}
                >
                  <Download className="w-4 h-4" />
                  Generate Custom report
                </button>
              </div>
            </div>

            {/* Layout Preview */}
            <div className="lg:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Custom Layout Preview Table
              </h3>

              <div className="border border-border/60 rounded-xl overflow-hidden bg-muted/5">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/30 border-b border-border/80 text-[10px] uppercase font-mono text-muted-foreground">
                    <tr>
                      {selectedFields.filter((f) => f.isSelected).map((f) => (
                        <th key={f.id} className="p-3 font-semibold">{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-semibold text-slate-700 dark:text-slate-200">
                    <tr>
                      {selectedFields.filter((f) => f.isSelected).map((f) => (
                        <td key={f.id} className="p-3 font-mono text-[11px]">
                          {f.label === 'Project Name'
                            ? 'Plaza Mall'
                            : f.label === 'Baseline Budget'
                              ? '$15,000,000'
                              : f.label === 'Actual Cost Incurred'
                                ? '$9,400,000'
                                : f.label === 'Milestone Completion Rate'
                                  ? '85%'
                                  : f.label === 'Workforce Count'
                                    ? '140'
                                    : 'Parsed Data'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      {selectedFields.filter((f) => f.isSelected).map((f) => (
                        <td key={f.id} className="p-3 font-mono text-[11px]">
                          {f.label === 'Project Name'
                            ? 'Apex Residences'
                            : f.label === 'Baseline Budget'
                              ? '$12,000,000'
                              : f.label === 'Actual Cost Incurred'
                                ? '$12,200,000'
                                : f.label === 'Milestone Completion Rate'
                                  ? '78%'
                                  : f.label === 'Workforce Count'
                                    ? '120'
                                    : 'Parsed Data'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {isExporting && (
                <div className="border border-border rounded-xl p-4 text-center text-xs bg-muted/10 animate-pulse">
                  Assembling custom query dataset and calculating pivot parameters...Please wait...
                </div>
              )}

              {downloadLink && (
                <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Custom template generated.</span>
                  <a
                    href={downloadLink}
                    download
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg uppercase text-[10px] tracking-wider flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download file
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: KPI THRESHOLDS MANAGEMENT */}
        {activeTab === 'kpis' && (
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                KPI Target & Threshold Configuration
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Drag the sliders to adjust target criteria. The alert system automatically re-evaluates the optimal/warning thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kpis.map((kpi) => (
                <div
                  key={kpi.id}
                  className="border border-border/80 rounded-xl p-4 bg-muted/5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{kpi.name}</span>
                      <span className="text-[10px] text-muted-foreground block">{kpi.category} level</span>
                    </div>

                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      kpi.status === 'optimal'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : kpi.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {kpi.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs font-bold text-slate-700 dark:text-slate-200 pt-1">
                    <div>
                      <span className="text-muted-foreground block text-[9px] uppercase">Current Value</span>
                      <span>{kpi.value}{kpi.unit}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px] uppercase">Threshold Target</span>
                      <span>{kpi.target}{kpi.unit}</span>
                    </div>
                  </div>

                  {/* Threshold Slider control */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                      <span>Adjust Target Threshold</span>
                      <span>Target: {kpi.target}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={kpi.value * 2 || 100}
                      step={0.1}
                      value={kpi.target}
                      onChange={(e) => updateKPIThreshold(kpi.id, Number(e.target.value))}
                      className="w-full accent-[#FF7B00] bg-muted h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FORECASTING & ML PROJECTIONS */}
        {activeTab === 'forecasting' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forecast details sidebar */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-border pb-3">
                Select Forecasting Model
              </h3>

              <div className="space-y-3">
                {[
                  { id: 'cashflow', label: "Net Cash Flow projections", icon: TrendingUp },
                  { id: 'material', label: "Cement inventory depletion", icon: BarChart2 }
                ].map((item) => {
                  const Icon = item.icon
                  const isActive = activeForecastModel === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveForecastModel(item.id as any)}
                      className={`w-full text-left p-3 rounded-xl border font-bold text-xs flex items-center gap-3 transition-all ${
                        isActive
                          ? 'bg-[#FF7B00]/5 border-[#FF7B00] text-[#FF7B00]'
                          : 'border-border hover:bg-muted/30 text-slate-700 dark:text-slate-350'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {item.label}
                    </button>
                  )
                })}
              </div>

              <div className="border border-border/80 rounded-xl p-4 bg-[#FF7B00]/5 text-xs space-y-2">
                <span className="font-bold block text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#FF7B00]" />
                  ML Regression Model Summary
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Based on historical cost deviations, price fluctuations, and seasonal weather patterns, predictions show a variance rating with **92.4%** accuracy levels.
                </p>
              </div>
            </div>

            {/* Visualizer Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Predicted Forecast & Confidence Margins
              </h3>

              <div className="relative h-56 bg-muted/10 rounded-xl flex items-center justify-center">
                <svg className="w-full h-full p-4" viewBox="0 0 600 200" preserveAspectRatio="none">
                  {/* Shaded confidence interval range */}
                  <polygon
                    points="30,140 150,110 270,120 390,75 510,70 570,40 570,80 510,120 390,115 270,150 150,130 30,150"
                    fill="rgba(0, 200, 255, 0.08)"
                  />
                  
                  <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />

                  {/* Predicted - blue */}
                  <polyline
                    fill="none"
                    stroke="#00C8FF"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    points="30,145 150,120 270,135 390,95 510,95 570,60"
                    strokeLinecap="round"
                  />

                  {/* Actual values - Orange */}
                  <polyline
                    fill="none"
                    stroke="#FF7B00"
                    strokeWidth="3.5"
                    points="30,145 150,122 270,137 390,92"
                    strokeLinecap="round"
                  />

                  <circle cx="390" cy="92" r="5" fill="#FF7B00" />
                </svg>

                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-[9px] font-bold text-muted-foreground font-mono">
                  {forecasts[activeForecastModel]?.map((d, i) => (
                    <span key={i}>{d.period}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SCHEDULED REPORTS MANAGEMENT */}
        {activeTab === 'scheduler' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List configured cron schedules */}
            <div className="lg:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-border pb-3">
                Active Email Report Deliveries
              </h3>

              <div className="space-y-3">
                {schedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="border border-border rounded-xl p-4 bg-muted/5 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold bg-[#FF7B00]/10 text-[#FF7B00] px-2 py-0.5 rounded uppercase">
                          {sch.exportType}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{sch.templateName}</h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Frequency: {sch.frequency} delivery</p>
                      <div className="flex flex-wrap gap-1">
                        {sch.emails.map((e) => (
                          <span key={e} className="text-[9px] bg-muted border border-border/80 px-2 py-0.5 rounded text-slate-700 dark:text-slate-350">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleScheduleEnabled(sch.id)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                          sch.isEnabled
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/35'
                            : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                        }`}
                      >
                        {sch.isEnabled ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => deleteSchedule(sch.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 border border-border hover:border-rose-500/30 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Schedule rule form */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised flex flex-col justify-center items-center text-center space-y-4">
              {!showAddScheduler ? (
                <>
                  <div className="p-3.5 bg-brand-primary/10 text-brand-primary rounded-full">
                    <Calendar className="w-6 h-6 text-[#FF7B00] animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-slate-200">
                      Schedule Automated Report
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Deliver custom generated PDF/Excel reports to email lists automatically on daily, weekly, or monthly periods.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddScheduler(true)}
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5"
                    style={{ backgroundColor: '#FF7B00' }}
                  >
                    <Plus className="w-4 h-4" />
                    Add scheduler rule
                  </button>
                </>
              ) : (
                <form onSubmit={handleAddScheduleSubmit} className="w-full space-y-3 text-left">
                  <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                    <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-200">Schedule Details</span>
                    <button type="button" onClick={() => setShowAddScheduler(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Report Title Name</label>
                    <input
                      type="text"
                      value={newScheduleName}
                      onChange={(e) => setNewScheduleName(e.target.value)}
                      placeholder="e.g. Monthly Budget Cost Report"
                      className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Delivery Period</label>
                    <select
                      value={newScheduleFreq}
                      onChange={(e) => setNewScheduleFreq(e.target.value as any)}
                      className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="Daily">Daily summary</option>
                      <option value="Weekly">Weekly briefing</option>
                      <option value="Monthly">Monthly closure report</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Recipient Emails (comma-separated)</label>
                    <input
                      type="text"
                      value={newScheduleEmails}
                      onChange={(e) => setNewScheduleEmails(e.target.value)}
                      placeholder="e.g. pm@buildspace.ai, client@apex.com"
                      className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Export Format</label>
                    <select
                      value={newScheduleFormat}
                      onChange={(e) => setNewScheduleFormat(e.target.value as any)}
                      className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="PDF">PDF File</option>
                      <option value="Excel">Excel Sheet</option>
                      <option value="CSV">CSV Table</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-brand-primary hover:bg-[#FF7B00]/90 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: '#FF7B00' }}
                  >
                    <Mail className="w-4 h-4" /> Save schedule rule
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center pt-8 border-t border-border/60">
        <p className="text-[10px] text-muted-foreground font-mono">
          BuildSpace BI analytics Platform. Secured metrics verified by standard GAAP/OSHA-1926 parameters.
        </p>
      </footer>
    </div>
  )
}
