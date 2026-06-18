import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  Hammer,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  ShieldCheck,
  Send,
  Github
} from 'lucide-react'

// Import Marketing Pages via @ path aliases
import Home from '@/routes/Home'
import Features from '@/routes/Features'
import Pricing from '@/routes/Pricing'
import Solutions from '@/routes/Solutions'
import AICenter from '@/routes/AI'
import Security from '@/routes/Security'
import Contact from '@/routes/Contact'
import Auth from '@/routes/Auth'

function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'AI Center', path: '/ai' },
    { name: 'Security', path: '/security' }
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.includes('@')) return
    setNewsletterSubscribed(true)
  }

  return (
    <div className="min-h-screen bg-brand-lightgray dark:bg-brand-obsidian text-foreground transition-colors duration-200 flex flex-col font-sans">
      {/* Announcement Bar */}
      <div className="bg-brand-obsidian text-slate-300 dark:bg-slate-900 border-b border-slate-800 text-[11px] py-2 px-4 text-center font-semibold">
        🚀 RAG Construction GPT and volumetric site scans are now live.{' '}
        <Link to="/ai" className="text-brand-accent hover:underline inline-flex items-center gap-0.5 ml-1">
          Try AI Sandbox <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Global Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white/85 dark:bg-brand-obsidian/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-brand-safety rounded-md text-white flex items-center justify-center shadow shadow-brand-safety/20">
              <Hammer className="w-4.5 h-4.5" />
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-safety to-brand-accent bg-clip-text text-transparent">
              BuildSpace AI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-muted-foreground hover:text-foreground">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors ${
                  location.pathname === link.path ? 'text-brand-safety' : 'hover:text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Global Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border"
            title={isDarkMode ? 'Construction Site Mode (Light)' : 'Obsidian Mode (Dark)'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-brand-safety" /> : <Moon className="w-4 h-4 text-brand-obsidian" />}
          </button>
          
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

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 hover:bg-muted text-muted-foreground rounded-md"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-brand-safety" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-border bg-white dark:bg-brand-obsidian p-4 space-y-3 flex flex-col text-xs font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-2 border-b border-border last:border-0 ${
                location.pathname === link.path ? 'text-brand-safety' : 'text-muted-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/login"
              className="py-2 text-center text-muted-foreground border border-border rounded-lg"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="py-2.5 text-center bg-brand-safety text-white rounded-lg shadow shadow-brand-safety/10"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}

      {/* Main Pages Content wrapper */}
      <main className="flex-1">
        {children}
      </main>

      {/* Global conversion Footer */}
      <footer className="bg-white dark:bg-brand-obsidian border-t border-border py-12 text-xs text-muted-foreground mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo & Info column */}
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
              The AI Operating System for Modern Construction. Forecasting project delay indices, safety compliance, and cost overruns.
            </p>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-success" />
              <span className="font-bold text-[10px] uppercase text-slate-600 dark:text-slate-400">SOC 2 Type II Certified</span>
            </div>
          </div>

          {/* Nav columns */}
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
                <a href="#status" className="hover:text-foreground flex items-center gap-1">
                  Status <span className="w-2.5 h-2.5 rounded-full bg-brand-success block"></span>
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter signup column */}
          <div className="md:col-span-4 space-y-3 text-left">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Subscribe to Site Reports</span>
            <p className="leading-relaxed max-w-xs">
              Get monthly newsletters detailing artificial intelligence progress indices in the construction industry.
            </p>
            
            {newsletterSubscribed ? (
              <div className="p-2.5 bg-brand-success/10 border border-brand-success/20 rounded-lg text-brand-success text-[11px] font-bold">
                Thank you! You have been subscribed.
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
                  className="p-2 bg-brand-obsidian text-white dark:bg-white dark:text-brand-obsidian hover:opacity-90 rounded transition-all flex items-center justify-center"
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

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/ai" element={<AICenter />} />
          <Route path="/security" element={<Security />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
