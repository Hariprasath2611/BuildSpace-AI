import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  Hammer,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  Send,
  Github,
  Bell,
  Search,
  Plus,
  Compass,
  LayoutDashboard,
  FolderGit2,
  FolderDot,
  Lock
} from 'lucide-react'

// Import Marketing / Auth Pages via @ path aliases
import Home from '@/routes/Home'
import Features from '@/routes/Features'
import Pricing from '@/routes/Pricing'
import Solutions from '@/routes/Solutions'
import AICenter from '@/routes/AI'
import Security from '@/routes/Security'
import Contact from '@/routes/Contact'
import Auth from '@/routes/Auth'
import SelectOrg from '@/routes/SelectOrg'
import ForgotPassword from '@/routes/ForgotPassword'
import MFA from '@/routes/MFA'
import Admin from '@/routes/Admin'

// Import Global Framework Components & Stores
import CommandPalette from '@/components/common/CommandPalette'
import NotificationDrawer from '@/components/common/NotificationDrawer'
import { useUIStore } from '@/store/uiStore'
import { useSyncStore } from '@/store/syncStore'
import { useAuthStore } from '@/store/authStore'
import { useDashboardStore } from '@/store/dashboardStore'
import {
  StatsWidget,
  WeatherWidget,
  ProgressWidget,
  SafetyWidget,
  BudgetWidget
} from '@/components/common/Widgets'

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  
  // Zustand States
  const isSidebarExpanded = useUIStore((state) => state.isSidebarExpanded)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const setCommandOpen = useUIStore((state) => state.setCommandPaletteOpen)
  const toggleNotification = useUIStore((state) => state.toggleNotification)
  
  const isOnline = useSyncStore((state) => state.isOnline)
  const setOnline = useSyncStore((state) => state.setOnline)

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const currentOrgId = useAuthStore((state) => state.currentOrgId)

  const [isDarkMode, setIsDarkMode] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  // Browser Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.includes('@')) return
    setNewsletterSubscribed(true)
  }

  // Define sidebar navigation link arrays
  const publicLinks = [
    { name: 'Features', path: '/features', icon: FolderGit2 },
    { name: 'Solutions', path: '/solutions', icon: Compass },
    { name: 'Pricing', path: '/pricing', icon: FolderDot },
    { name: 'AI Center', path: '/ai', icon: Hammer },
    { name: 'Security', path: '/security', icon: ShieldCheck }
  ]

  const protectedLinks = [
    { name: 'Dashboard Control', path: '/', icon: LayoutDashboard },
    { name: 'Features Directory', path: '/features', icon: FolderGit2 },
    { name: 'Solutions Portal', path: '/solutions', icon: Compass },
    { name: 'Security Hub', path: '/security', icon: ShieldCheck },
    { name: 'Admin Console', path: '/admin', icon: Lock }
  ]

  const links = isAuthenticated && currentOrgId ? protectedLinks : publicLinks

  return (
    <div className="min-h-screen bg-brand-lightgray dark:bg-brand-obsidian text-foreground transition-colors duration-200 flex flex-col font-sans">
      
      {/* 1. Global Command Palette & Notification Overlay */}
      <CommandPalette />
      <NotificationDrawer />

      {/* 2. Connection Sync Warning Banner */}
      {!isOnline && (
        <div className="bg-brand-safety text-white text-[11px] py-2 px-4 text-center font-bold animate-pulse-slow">
          ⚠️ Operational Warning: Connection offline. Pushing logs to local sync queue (IndexedDB)...
        </div>
      )}

      {/* 3. Sticky Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white/85 dark:bg-brand-obsidian/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-brand-safety rounded-md text-white flex items-center justify-center shadow shadow-brand-safety/20">
              <Hammer className="w-4.5 h-4.5" />
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-safety to-brand-accent bg-clip-text text-transparent">
              BuildSpace AI
            </span>
          </Link>

          {/* Quick-Search hotkey triggers Command Palette */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-muted/50 border border-border text-muted-foreground hover:text-foreground text-xs rounded-lg transition-colors text-left w-52"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search or command...</span>
            <kbd className="ml-auto font-mono text-[9px] font-bold bg-muted px-1.5 py-0.5 rounded border border-border">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-3.5">
          {/* Notifications Trigger */}
          <button
            onClick={toggleNotification}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border relative"
            title="Open Notification Center"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-danger animate-pulse-slow"></span>
          </button>

          {/* Theme Toggler */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border"
            title={isDarkMode ? 'Construction Mode (Light)' : 'Obsidian Mode (Dark)'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-brand-safety" /> : <Moon className="w-4 h-4 text-brand-obsidian" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3.5 pl-2 border-l border-border">
              <Link
                to="/select-organization"
                className="hidden sm:inline-flex px-3 py-1.5 bg-muted text-slate-800 dark:text-slate-350 text-xs font-semibold rounded-lg hover:bg-muted/80 border border-border transition-all"
              >
                Switch Workspace
              </Link>
              <button
                onClick={() => logout()}
                className="text-xs font-semibold text-muted-foreground hover:text-brand-danger transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3.5 pl-2 border-l border-border">
              <Link
                to="/login"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-brand-safety hover:bg-brand-safety/90 text-white text-xs font-semibold rounded-lg shadow shadow-brand-safety/15 transition-all flex items-center gap-1"
              >
                Start Free Trial
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 4. Main Grid shell */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside
          className={`border-r border-border bg-white dark:bg-[#101625] flex flex-col pt-4 transition-all duration-200 select-none ${
            isSidebarExpanded ? 'w-64' : 'w-16'
          }`}
        >
          {/* Collapse toggle */}
          <div className="px-4 pb-4 border-b border-border flex justify-end">
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground hidden sm:block"
              title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isSidebarExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-2 flex-1 flex flex-col gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-1 block ${
              !isSidebarExpanded && 'sr-only'
            }`}>
              Navigation
            </span>
            {links.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-safety text-white shadow shadow-brand-safety/15'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                  title={link.name}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                  <span className={`${!isSidebarExpanded && 'hidden'}`}>{link.name}</span>
                </Link>
              )
            })}
          </div>
        </aside>

        {/* Content canvas area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-brand-obsidian border-t border-border py-12 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-safety rounded text-white flex items-center justify-center">
                <Hammer className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold text-sm tracking-tight text-slate-800 dark:text-white">
                BuildSpace AI
              </span>
            </div>
            <p className="leading-relaxed max-w-xs">
              The AI Operating System for Modern Construction.
            </p>
          </div>

          <div className="md:col-span-4 grid grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Product</span>
              <div className="flex flex-col gap-1.5">
                <Link to="/features" className="hover:text-foreground">SaaS Modules</Link>
                <Link to="/solutions" className="hover:text-foreground">Roster Solutions</Link>
                <Link to="/pricing" className="hover:text-foreground">Pricing Plans</Link>
                <Link to="/ai" className="hover:text-foreground">AI Sandboxes</Link>
              </div>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Trust & Legal</span>
              <div className="flex flex-col gap-1.5">
                <Link to="/security" className="hover:text-foreground">Trust Center</Link>
                <a href="#privacy" className="hover:text-foreground">Privacy Policy</a>
                <a href="#terms" className="hover:text-foreground">Terms of Service</a>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3 text-left">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Subscribe to Site Reports</span>
            
            {newsletterSubscribed ? (
              <div className="p-2.5 bg-brand-success/10 border border-brand-success/20 rounded-lg text-brand-success text-[11px] font-bold">
                Subscribed successfully.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 p-2 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs"
                />
                <button
                  type="submit"
                  className="p-2 bg-brand-obsidian text-white dark:bg-white dark:text-brand-obsidian hover:opacity-90 rounded transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 BuildSpace AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// -------------------------------------------------------------
// DYNAMIC DASHBOARD VIEW (HOMEPAGE FOR AUTHENTICATED USERS)
// -------------------------------------------------------------
function DashboardOverview() {
  const widgets = useDashboardStore((state) => state.widgets)
  const removeWidget = useDashboardStore((state) => state.removeWidget)
  const addWidget = useDashboardStore((state) => state.addWidget)

  const [isBuilderOpen, setIsBuilderOpen] = useState(false)

  const handleAddWidget = (type: any, title: string) => {
    addWidget(type, title)
    setIsBuilderOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header control */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div className="text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold">Control Center</h1>
          <p className="text-xs text-muted-foreground">Personalize and track real-time visual progress and crane limits.</p>
        </div>

        <button
          onClick={() => setIsBuilderOpen(!isBuilderOpen)}
          className="px-4 py-2 bg-brand-accent text-brand-obsidian text-xs font-bold rounded-lg hover:opacity-90 shadow shadow-brand-accent/10 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Dashboard Builder
        </button>
      </div>

      {/* Widget template selector modal */}
      {isBuilderOpen && (
        <div className="p-4 bg-white dark:bg-[#141B2D] border border-brand-accent/35 rounded-xl shadow-floating text-xs flex flex-wrap gap-2 text-left animate-fade-in max-w-2xl">
          <span className="font-bold text-slate-800 dark:text-slate-200 block w-full mb-1">Add Reusable Widgets:</span>
          <button
            onClick={() => handleAddWidget("stats", "Telemetry Index")}
            className="p-2 border border-border rounded hover:border-brand-accent"
          >
            + Telemetry Cards
          </button>
          <button
            onClick={() => handleAddWidget("weather", "Weather warnings")}
            className="p-2 border border-border rounded hover:border-brand-accent"
          >
            + Weather Limits
          </button>
          <button
            onClick={() => handleAddWidget("progress", "Pour Progress Graph")}
            className="p-2 border border-border rounded hover:border-brand-accent"
          >
            + SVG Progress Chart
          </button>
          <button
            onClick={() => handleAddWidget("safety", "Safety Inspections")}
            className="p-2 border border-border rounded hover:border-brand-accent"
          >
            + Compliance Lists
          </button>
          <button
            onClick={() => handleAddWidget("budget", "Contingency Budget")}
            className="p-2 border border-border rounded hover:border-brand-accent"
          >
            + Budget Gauges
          </button>
        </div>
      )}

      {/* Custom Widgets grid layout builder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {widgets.map((w) => (
          <div
            key={w.id}
            className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised relative flex flex-col gap-3 group transition-all hover:shadow-floating"
          >
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">
                {w.title}
              </span>
              <button
                onClick={() => removeWidget(w.id)}
                className="p-1 text-slate-400 hover:text-brand-danger hover:bg-muted dark:hover:bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove Widget"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {w.type === "stats" && <StatsWidget />}
            {w.type === "weather" && <WeatherWidget />}
            {w.type === "progress" && <ProgressWidget />}
            {w.type === "safety" && <SafetyWidget />}
            {w.type === "budget" && <BudgetWidget />}
          </div>
        ))}

        {widgets.length === 0 && (
          <div className="md:col-span-2 text-center py-12 border border-dashed border-border rounded-2xl text-xs text-muted-foreground italic space-y-3">
            <p>Your dashboard is empty. Click Dashboard Builder to add widgets.</p>
            <button
              onClick={() => handleAddWidget("progress", "Volumetric Pour Graph")}
              className="px-4 py-2 bg-brand-safety text-white rounded font-semibold text-[11px]"
            >
              Add Default Progress Widget
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// APP ROUTER WRAPPER
// -------------------------------------------------------------
export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentOrgId = useAuthStore((state) => state.currentOrgId)

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* If authenticated and org selected, render Dashboard, else render Home */}
          <Route
            path="/"
            element={isAuthenticated && currentOrgId ? <DashboardOverview /> : <Home />}
          />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/ai" element={<AICenter />} />
          <Route path="/security" element={<Security />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/select-organization" element={<SelectOrg />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-mfa" element={<MFA />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
