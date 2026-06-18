import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Lock,
  Mail,
  User,
  Building2,
  Briefcase,
  Eye,
  EyeOff,
  CheckCircle2,
  Hammer
} from 'lucide-react'

interface AuthProps {
  mode: 'login' | 'signup'
}

export default function Auth({ mode }: AuthProps) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "", company: "", role: "superintendent" })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setIsLoading(true)

    // Simulate network authentication verification
    setTimeout(() => {
      setIsLoading(false)
      if (mode === 'login' && !formData.email.includes('@')) {
        setErrorMsg("Please enter a valid work email address.")
        return
      }
      if (mode === 'signup' && formData.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.")
        return
      }

      // Successful auth - redirect to internal portal preview
      navigate('/')
    }, 1200)
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 bg-brand-safety rounded-full filter blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full space-y-6 bg-white dark:bg-[#141B2D] border border-border p-6 sm:p-8 rounded-2xl shadow-floating">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-brand-safety rounded-lg flex items-center justify-center mx-auto text-white shadow shadow-brand-safety/20">
            <Hammer className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            {mode === 'login' ? 'Sign in to BuildSpace AI' : 'Create Your Site Account'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {mode === 'login' ? (
              <>
                New to BuildSpace?{' '}
                <Link to="/signup" className="text-brand-safety font-bold hover:underline">
                  Start your 14-day trial
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-brand-safety font-bold hover:underline">
                  Sign in here
                </Link>
              </>
            )}
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 bg-brand-danger/10 border border-brand-danger/25 text-brand-danger text-xs rounded-lg font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <input
                type="text"
                required
                placeholder="D. Hariprasath"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Work Email
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
            />
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Builders"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Roster Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2.5 rounded border border-border bg-white dark:bg-[#141B2D] focus:outline-none focus:border-brand-safety"
                >
                  <option value="superintendent">Superintendent</option>
                  <option value="pm">Project Manager</option>
                  <option value="estimator">Estimator</option>
                  <option value="subcontractor">Subcontractor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Password
              </label>
              {mode === 'login' && (
                <a href="#forgot" className="text-[10px] text-brand-safety hover:underline">
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2.5 pr-10 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-brand-safety text-white text-xs font-semibold rounded hover:bg-brand-safety/90 transition-all shadow shadow-brand-safety/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                Authenticating...
              </>
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="border-t border-border pt-4 text-center text-[10px] text-muted-foreground leading-normal">
          By continuing, you agree to BuildSpace AI's{' '}
          <a href="#terms" className="underline hover:text-foreground">Terms of Service</a> and{' '}
          <a href="#privacy" className="underline hover:text-foreground">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
