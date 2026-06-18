import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  Hammer,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Send,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Compass
} from 'lucide-react'

// Mock Stores for Zustand replacement demonstration
const useStoreSimulation = () => {
  const [user] = useState({ name: 'D. Hariprasath', role: 'Superintendent', organization: 'Apex Builders Inc.' })
  const [notifications] = useState([
    { id: 1, text: 'Safety: Class 2 hazard detected on Tower A Level 4', type: 'hazard' },
    { id: 2, text: 'Schedule: Concrete pour delayed by 2 hours', type: 'delay' }
  ])
  return { user, notifications }
}

// Global Layout Wrapper
function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useStoreSimulation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCopilotOpen, setIsCopilotOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const location = useLocation()

  // Simulating connection fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline((prev) => !prev)
    }, 45000) // Alternate every 45s for demo
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const navigationItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Safety Logs', path: '/safety', icon: ShieldAlert }
  ]

  return (
    <div className="min-h-screen bg-brand-lightgray dark:bg-brand-obsidian text-foreground transition-colors duration-200 flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white/85 dark:bg-brand-obsidian/85 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-muted rounded-md md:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="relative p-2 bg-brand-safety rounded-md text-white flex items-center justify-center shadow-lg shadow-brand-safety/20">
              <Hammer className="w-5 h-5 animate-bounce-slow" />
            </div>
            <span className="font-heading font-bold text-lg md:text-xl tracking-tight bg-gradient-to-r from-brand-safety to-brand-accent bg-clip-text text-transparent">
              BuildSpace AI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
            <span className="w-2 h-2 rounded-full bg-brand-success"></span>
            {user.organization}
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Offline/Online Indicator */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            isOnline ? 'bg-brand-success/15 text-brand-success' : 'bg-brand-safety/15 text-brand-safety'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 animate-pulse-slow" />
                <span className="hidden sm:inline">Offline (Draft Mode)</span>
              </>
            )}
          </div>

          {/* Theme Toggler */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border"
            title={isDarkMode ? 'Switch to Construction Site Mode' : 'Switch to Obsidian Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-brand-safety" /> : <Moon className="w-4 h-4 text-brand-obsidian" />}
          </button>

          {/* User Profile */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent flex items-center justify-center font-bold text-sm text-brand-accent">
              DH
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold leading-tight">{user.name}</p>
              <p className="text-[10px] text-muted-foreground">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-200 border-r border-border bg-white dark:bg-[#101625] w-64 flex flex-col pt-16 md:pt-0`}>
          <div className="p-4 flex-1 flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-1">
              Modules
            </p>
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-safety text-white shadow-lg shadow-brand-safety/15'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-border bg-muted/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Sync status</span>
              <span className="font-semibold text-brand-success">Synced</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div className="bg-brand-success h-1.5 rounded-full w-full"></div>
            </div>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

        {/* Collapsible Right AI Copilot Panel */}
        <aside className={`fixed inset-y-0 right-0 z-40 transform ${
          isCopilotOpen ? 'translate-x-0' : 'translate-x-full'
        } xl:relative xl:translate-x-0 transition-transform duration-200 border-l border-border bg-[#101625] text-slate-200 w-80 md:w-96 flex flex-col pt-16 xl:pt-0 shadow-2xl`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-brand-obsidian">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-accent/20 rounded-md text-brand-accent">
                <Sparkles className="w-4 h-4 animate-ai-pulse" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm tracking-tight text-white block">
                  AI Copilot
                </span>
                <span className="text-[10px] text-slate-400">RAG Construction Engine v1.0</span>
              </div>
            </div>
            <button
              onClick={() => setIsCopilotOpen(false)}
              className="xl:hidden p-1.5 hover:bg-slate-800 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI Chat History */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs">
            {/* Copilot message */}
            <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-lg flex flex-col gap-2">
              <p className="text-slate-300">
                Welcome back! I've analyzed drawing revisions for the **Tower A Structural Framework**.
              </p>
              <div className="p-2 bg-brand-obsidian/85 rounded border border-brand-safety/20 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-brand-safety">
                  <span>CRITICAL RISK: Schedule Delay Prediction</span>
                  <span>94% Confidence</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  RFI delay on concrete formwork validation might block next Tuesday's pour.
                </p>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <span>Source:</span>
                  <a href="#cit" className="text-brand-accent hover:underline">[spec_formwork_2026.pdf]</a>
                </div>
              </div>
            </div>

            {/* User prompt examples */}
            <div className="mt-2">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Suggested queries</p>
              <div className="flex flex-col gap-1.5">
                <button className="text-left p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  "Any safety clashes on concrete forms?"
                </button>
                <button className="text-left p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  "Show checklist completion rate for Project Apex."
                </button>
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-slate-800 bg-brand-obsidian">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask AI Copilot..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent"
              />
              <button className="absolute right-2.5 top-2 p-1 bg-brand-accent hover:bg-brand-accent/80 text-brand-obsidian rounded-md transition-colors">
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Copilot Toggle for smaller sizes */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-brand-accent text-brand-obsidian p-3.5 rounded-full shadow-2xl hover:scale-105 transition-all animate-bounce-slow"
          title="Open AI Copilot"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// MODULE PAGES
// -------------------------------------------------------------

// Page 1: Dashboard Overview
function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Construction Intelligence Control Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time performance index, schedules, and active threat matrices.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Formwork Completion', value: '78.4%', trend: '+4.2% this week', type: 'progress', icon: CheckCircle2, color: 'text-brand-success' },
          { label: 'Active Schedule Path', value: 'On Track', trend: 'Critical pour upcoming', type: 'status', icon: Clock, color: 'text-brand-accent' },
          { label: 'Unresolved RFIs', value: '4 Urgent', trend: '2 predicting delays', type: 'info', icon: Compass, color: 'text-brand-safety' },
          { label: 'Open Safety Observations', value: '1 Hazard', trend: 'Safety score: 98/100', type: 'warning', icon: ShieldAlert, color: 'text-brand-danger' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#141B2D] p-4 rounded-xl border border-border shadow-raised flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold font-heading">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-brand-success" />
                  {stat.trend}
                </p>
              </div>
              <div className={`p-2 bg-muted/60 dark:bg-slate-800/40 rounded-lg ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid: Schedule View & Risk Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <h3 className="font-heading font-bold text-base">Gantt Schedule View</h3>
            <span className="text-xs px-2.5 py-1 bg-brand-safety/10 text-brand-safety font-medium rounded-full">
              Critical Path
            </span>
          </div>

          <div className="space-y-4">
            {[
              { task: 'Level 2 Structural Slab Concrete', progress: 100, date: 'June 10 - June 14', status: 'Completed', color: 'bg-brand-success' },
              { task: 'Formwork and Rebar Level 3 Tower B', progress: 65, date: 'June 15 - June 20', status: 'Active (On Critical Path)', color: 'bg-brand-safety animate-pulse-slow' },
              { task: 'Electrical Conduit rough-ins', progress: 10, date: 'June 21 - June 24', status: 'Delayed - Awaiting Inspector', color: 'bg-brand-danger' }
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.task}</span>
                  <span className="text-muted-foreground">{item.date} • {item.status}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Grid */}
        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised">
          <h3 className="font-heading font-bold text-base mb-4 border-b border-border pb-3">
            Active Risk Matrix (5x5)
          </h3>
          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold text-white mb-2">
            {/* 5x5 Mock Heatmap grid (from low to critical) */}
            <div className="bg-brand-success p-2 rounded">1</div>
            <div className="bg-brand-success p-2 rounded">2</div>
            <div className="bg-amber-400 p-2 rounded">3</div>
            <div className="bg-brand-safety p-2 rounded">4</div>
            <div className="bg-brand-danger p-2 rounded animate-pulse-slow">5</div>
            <div className="bg-brand-success p-2 rounded">2</div>
            <div className="bg-amber-400 p-2 rounded">4</div>
            <div className="bg-brand-safety p-2 rounded">6</div>
            <div className="bg-brand-danger p-2 rounded">8</div>
            <div className="bg-brand-danger p-2 rounded">10</div>
            <div className="bg-amber-400 p-2 rounded">3</div>
            <div className="bg-brand-safety p-2 rounded">6</div>
            <div className="bg-brand-safety p-2 rounded">9</div>
            <div className="bg-brand-danger p-2 rounded">12</div>
            <div className="bg-brand-danger p-2 rounded">15</div>
            <div className="bg-brand-safety p-2 rounded">4</div>
            <div className="bg-brand-danger p-2 rounded">8</div>
            <div className="bg-brand-danger p-2 rounded">12</div>
            <div className="bg-brand-danger p-2 rounded">16</div>
            <div className="bg-brand-danger p-2 rounded">20</div>
            <div className="bg-brand-danger p-2 rounded">5</div>
            <div className="bg-brand-danger p-2 rounded">10</div>
            <div className="bg-brand-danger p-2 rounded">15</div>
            <div className="bg-brand-danger p-2 rounded">20</div>
            <div className="bg-brand-danger p-2 rounded">25</div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs justify-between">
            <span className="text-brand-success flex items-center gap-1">🟢 Low Risk</span>
            <span className="text-brand-safety flex items-center gap-1">🟠 High Risk</span>
            <span className="text-brand-danger flex items-center gap-1">🔴 Critical Clash</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Page 2: Projects Module
function ProjectsPage() {
  const [projects] = useState([
    { id: 1, name: 'Tower A Residences', location: 'Bengaluru, India', budget: '$45.2M', progress: 78, hazards: 0 },
    { id: 2, name: 'APEX Commercial Hub', location: 'San Jose, CA', budget: '$124.0M', progress: 45, hazards: 1 },
    { id: 3, name: 'Metro Line Underground', location: 'Mumbai, India', budget: '$210.5M', progress: 12, hazards: 4 }
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Active Projects</h1>
        <p className="text-sm text-muted-foreground">Manage organization construction scopes, financial profiles, and field telemetry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised flex flex-col justify-between h-56">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-white">{project.name}</h3>
                {project.hazards > 0 && (
                  <span className="text-[10px] bg-brand-danger/10 text-brand-danger border border-brand-danger/25 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse-slow">
                    <AlertTriangle className="w-3 h-3" />
                    {project.hazards} Alerts
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-4">{project.location}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Authorized Budget</span>
                <span className="font-semibold">{project.budget}</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Execution Progress</span>
                  <span className="font-bold">{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-brand-accent h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Page 3: Safety Module
function SafetyPage() {
  const [logs] = useState([
    { id: 1, type: 'Clash Alert', detail: 'Slab reinforcement steel colliding with plumbing conduits', severity: 'High', area: 'Tower A Level 3', status: 'Open' },
    { id: 2, type: 'Hazard Warning', detail: 'Missing perimeter scaffolding netting', severity: 'Critical', area: 'Building B East Face', status: 'Reviewing' },
    { id: 3, type: 'Routine Inspection', detail: 'Personal Protective Equipment compliance audit', severity: 'Low', area: 'Entire Site', status: 'Resolved' }
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Safety & Compliance Log</h1>
        <p className="text-sm text-muted-foreground">Real-time warning tracking, WCAG / OSHA inspection templates, and incident reporting.</p>
      </div>

      <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl overflow-hidden shadow-raised">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-heading font-bold text-base">Active Site Observations</h3>
          <button className="text-xs bg-brand-safety text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-brand-safety/90 transition-colors shadow-lg shadow-brand-safety/15">
            Log New Observation
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 dark:bg-slate-800/40 text-muted-foreground font-semibold border-b border-border">
                <th className="p-3">Type</th>
                <th className="p-3">Detail</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Area</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 dark:hover:bg-slate-800/20">
                  <td className="p-3 font-semibold">{log.type}</td>
                  <td className="p-3 text-muted-foreground">{log.detail}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      log.severity === 'Critical' ? 'bg-brand-danger/10 text-brand-danger' :
                      log.severity === 'High' ? 'bg-brand-safety/10 text-brand-safety' : 'bg-brand-success/10 text-brand-success'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-3">{log.area}</td>
                  <td className="p-3">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        log.status === 'Resolved' ? 'bg-brand-success' :
                        log.status === 'Open' ? 'bg-brand-danger animate-pulse-slow' : 'bg-amber-400'
                      }`}></span>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// APP ENTRY POINT WITH ROUTER
// -------------------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/safety" element={<SafetyPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
