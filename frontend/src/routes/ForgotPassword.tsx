import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setIsLoading(true)

    // Simulate sending recovery email
    setTimeout(() => {
      setIsLoading(false)
      setIsSent(true)
    }, 1200)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 bg-brand-safety rounded-full filter blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full space-y-6 bg-white dark:bg-[#141B2D] border border-border p-6 sm:p-8 rounded-2xl shadow-floating">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-brand-safety/10 rounded-lg flex items-center justify-center mx-auto text-brand-safety shadow shadow-brand-safety/15">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            Recover Your Password
          </h2>
          <p className="text-xs text-muted-foreground">
            We will send a secure reset link to your authorized work email
          </p>
        </div>

        {isSent ? (
          <div className="p-6 bg-brand-success/10 border border-brand-success/20 rounded-xl text-center space-y-3 text-xs">
            <CheckCircle2 className="w-10 h-10 text-brand-success mx-auto" />
            <h4 className="font-heading font-bold text-base text-brand-success">Reset Email Dispatched</h4>
            <p className="text-muted-foreground">
              We have sent instructions to <strong>{email}</strong>. Check your inbox and spam folders.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-brand-safety font-bold hover:underline"
              >
                Return to Login
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Work Email
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-2.5 bg-brand-safety text-white text-xs font-semibold rounded hover:bg-brand-safety/90 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Dispatching Reset...
                </>
              ) : (
                'Send Recovery Email'
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-[10px] text-muted-foreground hover:text-foreground hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
