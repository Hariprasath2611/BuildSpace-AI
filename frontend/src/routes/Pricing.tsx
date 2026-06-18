import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  TrendingUp,
  ArrowRight,
  DollarSign
} from 'lucide-react'

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [projectValue, setProjectValue] = useState(15) // in Millions
  const [delayDays, setDelayDays] = useState(4)
  const [rfiCount, setRfiCount] = useState(25)

  // ROI Math
  // Assume: 1 delay day costs $8,500 in superintendent, labor standby, & trailer operations.
  // Assume: An average RFI takes 4.5 hours to process. Pushing to AI saves 45% of clashing reviews, valued at $350/RFI.
  const calculateSavings = () => {
    const delaySavings = delayDays * 8500
    const rfiSavings = rfiCount * 350 * 0.45
    const monthlyTotal = delaySavings + rfiSavings
    const annualTotal = monthlyTotal * 12
    return {
      monthly: Math.round(monthlyTotal),
      annual: Math.round(annualTotal)
    }
  }

  const savings = calculateSavings()

  const plans = [
    {
      name: "Standard",
      priceMonthly: 149,
      priceAnnual: 119,
      description: "Essential intelligence tools for growing subcontractors and general builders.",
      features: [
        "Up to 3 Active Projects",
        "Mobile App Offline Check-ins",
        "Standard Checklist Forms",
        "Email & Chat Support (24hr)",
        "Basic Scheduling Timeline"
      ],
      cta: "Start Free Trial",
      link: "/signup",
      popular: false
    },
    {
      name: "Professional",
      priceMonthly: 499,
      priceAnnual: 399,
      description: "Full AI Copilot capabilities and material volume scanning for active projects.",
      features: [
        "Unlimited Active Projects",
        "AI Copilot Chat Engine",
        "YOLOv11 Volumetric Material Checks",
        "Computer Vision Safety Hazards",
        "Next-Day Priority Support",
        "Full Caching & Custom WebSockets"
      ],
      cta: "Start Free Trial",
      link: "/signup",
      popular: true
    },
    {
      name: "Enterprise",
      priceMonthly: "Custom",
      priceAnnual: "Custom",
      description: "Dedicated isolated infrastructure, custom AI models, and deep security rules.",
      features: [
        "Isolated Tenant Data (MongoDB Atlas)",
        "Custom RBAC & ABAC Claims",
        "Custom YOLOv11 & SAM Model Tuning",
        "SLA Guarantee & Dedicated Support Manager",
        "Full API Access & Webhook Integrations"
      ],
      cta: "Contact Sales",
      link: "/contact",
      popular: false
    }
  ]

  return (
    <div className="space-y-20 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
          Flexible Pricing Built for{' '}
          <span className="bg-gradient-to-r from-brand-safety to-brand-accent bg-clip-text text-transparent">
            Every Scale
          </span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Choose a plan that matches your pipeline. Save 20% when choosing annual billing.
        </p>

        {/* Toggler */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-bold ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly billing</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 bg-brand-safety rounded-full relative p-0.5 focus:outline-none transition-colors"
          >
            <span className={`w-5 h-5 bg-white rounded-full block shadow-md transform transition-transform duration-200 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></span>
          </button>
          <span className={`text-xs font-bold ${isAnnual ? 'text-foreground' : 'text-muted-foreground'} flex items-center gap-1.5`}>
            Annual billing
            <span className="px-2 py-0.5 bg-brand-success/15 text-brand-success text-[10px] rounded-full">Save 20%</span>
          </span>
        </div>
      </section>

      {/* 2. CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-[#141B2D] border rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-raised relative ${
              plan.popular ? 'border-brand-safety scale-105 shadow-floating' : 'border-border'
            }`}
          >
            {plan.popular && (
              <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-brand-safety text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
                Most Popular
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-200">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 min-h-8">{plan.description}</p>
              </div>

              <div className="border-t border-b border-border py-4 flex items-baseline gap-1.5">
                {typeof plan.priceMonthly === 'number' ? (
                  <>
                    <span className="text-4xl font-heading font-extrabold">
                      ${isAnnual ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month, billed annually</span>
                  </>
                ) : (
                  <span className="text-3xl font-heading font-extrabold">{plan.priceMonthly}</span>
                )}
              </div>

              <ul className="space-y-3 text-xs">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-success flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-350">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to={plan.link}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                  plan.popular
                    ? 'bg-brand-safety text-white shadow-lg shadow-brand-safety/15 hover:bg-brand-safety/90'
                    : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* 3. ROI CALCULATOR */}
      <section className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 sm:p-8 shadow-floating max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl">
            Projected Return on Investment (ROI)
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Adjust the project metrics below to see how much BuildSpace AI can save your site.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Controls */}
          <div className="space-y-6">
            {/* Project Value slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Average Project Value</span>
                <span className="text-brand-accent">${projectValue}M</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={projectValue}
                onChange={(e) => setProjectValue(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-accent"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>$1M</span>
                <span>$100M+</span>
              </div>
            </div>

            {/* Delay Days slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Estimated Delay Days / Month</span>
                <span className="text-brand-safety">{delayDays} Days</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={delayDays}
                onChange={(e) => setDelayDays(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-safety"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>0 Days</span>
                <span>15 Days</span>
              </div>
            </div>

            {/* RFI Count slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>RFIs Logged / Month</span>
                <span className="text-brand-accent">{rfiCount} RFIs</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rfiCount}
                onChange={(e) => setRfiCount(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-accent"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>0</span>
                <span>100+</span>
              </div>
            </div>
          </div>

          {/* Savings Box */}
          <div className="p-6 bg-brand-obsidian text-slate-200 rounded-xl border border-slate-800 flex flex-col justify-between h-56 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <DollarSign className="w-40 h-40" />
            </div>

            <div className="space-y-1.5 z-10">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Projected Savings Summary
              </span>
              <p className="text-4xl font-heading font-extrabold text-brand-success">
                ${savings.annual.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> / year</span>
              </p>
              <p className="text-xs text-slate-400">
                Potential monthly savings: <strong className="text-white">${savings.monthly.toLocaleString()}</strong>
              </p>
            </div>

            <div className="border-t border-slate-800 pt-3 z-10 space-y-1.5 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5 text-brand-accent">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Estimated Payback Period: <strong>Immediate</strong></span>
              </div>
              <p>Based on operational labor efficiency & clash avoidance metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENTERPRISE BANNER */}
      <section className="bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left space-y-2">
          <h4 className="font-heading font-bold text-lg">Government & Large Infrastructure Needs?</h4>
          <p className="text-xs text-muted-foreground max-w-xl">
            We provide custom compliance matrices, FedRAMP isolation options, and enterprise SSO integrations.
          </p>
        </div>
        <Link
          to="/contact"
          className="px-5 py-2.5 bg-brand-obsidian text-white dark:bg-white dark:text-brand-obsidian text-xs font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          Contact Solutions Team
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  )
}
