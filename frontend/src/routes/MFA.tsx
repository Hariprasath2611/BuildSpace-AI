import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

export default function MFA() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const inputRefs = useRef<HTMLInputElement[]>([])

  // Resend Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, "")
    if (!value) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1) // keep last digit
    setOtp(newOtp)

    // Focus next input slot
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp]
      if (!otp[index]) {
        // If current box is empty, focus previous and clear it
        if (index > 0 && inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus()
          newOtp[index - 1] = ""
        }
      } else {
        // Clear current value
        newOtp[index] = ""
      }
      setOtp(newOtp)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6)
    if (pastedData.length !== 6) return

    const newOtp = pastedData.split("")
    setOtp(newOtp)
    
    // Focus last slot
    if (inputRefs.current[5]) {
      inputRefs.current[5].focus()
    }
  }

  const handleVerify = () => {
    const code = otp.join("")
    if (code.length !== 6) return
    setIsLoading(true)

    // Simulate OTP verification API
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      
      // Perform mock authenticated login in Zustand store
      setTimeout(() => {
        login(
          { uid: "mock_user_1", email: "d.hariprasath@apex.com", name: "D. Hariprasath" },
          "mock_jwt_token_claims_909",
          "admin" // Map claim to admin
        )
        navigate('/select-organization')
      }, 800)
    }, 1200)
  }

  const handleResend = () => {
    setOtp(new Array(6).fill(""))
    setTimeLeft(30)
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 bg-brand-accent rounded-full filter blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full space-y-6 bg-white dark:bg-[#141B2D] border border-border p-6 sm:p-8 rounded-2xl shadow-floating">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center mx-auto text-brand-accent shadow shadow-brand-accent/15">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            Security Verification Required
          </h2>
          <p className="text-xs text-muted-foreground">
            We sent a 6-digit confirmation code to your trusted device
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 bg-brand-success/10 border border-brand-success/20 rounded-xl text-center space-y-3 text-xs">
            <CheckCircle2 className="w-10 h-10 text-brand-success mx-auto" />
            <h4 className="font-heading font-bold text-base text-brand-success">Identity Confirmed</h4>
            <p className="text-muted-foreground">Redirecting to organization workspace switcher...</p>
          </div>
        ) : (
          <div className="space-y-6 text-xs text-center">
            {/* OTP Inputs Group */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(ref) => { if (ref) inputRefs.current[index] = ref }}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-bold bg-muted/20 dark:bg-slate-800/40 border border-border rounded-lg focus:outline-none focus:border-brand-accent text-slate-800 dark:text-white"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full py-2.5 bg-brand-accent text-brand-obsidian text-xs font-bold rounded hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-brand-obsidian border-t-transparent animate-spin"></div>
                  Verifying Identity...
                </>
              ) : (
                <>
                  Verify Code
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Resend Timer */}
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground pt-2 border-t border-border">
              <Clock className="w-3.5 h-3.5" />
              {timeLeft > 0 ? (
                <span>Resend verification code in <strong>{timeLeft}s</strong></span>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-brand-accent font-bold hover:underline"
                >
                  Resend Verification OTP
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
