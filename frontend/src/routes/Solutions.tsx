import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  Hammer,
  TrendingUp,
  FileText,
  Check,
  ArrowRight
} from 'lucide-react'

const SOLUTIONS_DATA = [
  {
    role: "builders",
    title: "General Contractors & Builders",
    description: "Manage subcontractor timelines, coordinate drawing revisions, and eliminate field clash issues.",
    metric: "32% Cost Reductions",
    metricDesc: "In operational contingency re-pour budgets",
    icon: Compass,
    benefits: [
      "Real-time RAG drawing matching matches architectural revisions with structural layouts.",
      "Unified subcontractor communications with mobile-first check-ins.",
      "Automated critical path slack forecasting."
    ]
  },
  {
    role: "contractors",
    title: "Specialty Subcontractors",
    description: "Submit daily logs, scan incoming material quantities, and manage compliance checklist forms.",
    metric: "4.5hr Saved / Day",
    metricDesc: "On physical inspection and diary filing workflows",
    icon: Hammer,
    benefits: [
      "Offline mobile log capture syncs data once signal connectivity resumes.",
      "Volumetric delivery scanner matches mix parameters with invoice quantities.",
      "Instant compliance checklists conforming to OSHA/WCAG safety guidelines."
    ]
  },
  {
    role: "developers",
    title: "Developers & Owners",
    description: "Track progress metrics, monitor financial budgets, and receive automated risk alerts.",
    metric: "94% Forecast Accuracy",
    metricDesc: "Predicting delay bottlenecks before they impact schedules",
    icon: TrendingUp,
    benefits: [
      "Visual Gantt timelines update progress rings using drone scans.",
      "Automatic contingency alerts trigger if active delays exceed thresholds.",
      "Consolidated multi-tenant dashboard profiles for all active sites."
    ]
  },
  {
    role: "architects",
    title: "Architects & Engineers",
    description: "Resolve drawing discrepancies, clarify RFIs, and compare revision changes.",
    metric: "45% Faster RFIs",
    metricDesc: "Resolution cycles using OCR structural matches",
    icon: FileText,
    benefits: [
      "YOLOv11 scans identify drawing overlaps and coordinate clashes.",
      "Construction GPT aggregates spec catalogs for swift code searches.",
      "Interactive visual history audits track version adjustments."
    ]
  }
]

export default function Solutions() {
  const [activeRole, setActiveRole] = useState("builders")
  const current = SOLUTIONS_DATA.find(s => s.role === activeRole) || SOLUTIONS_DATA[0]

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
          Customized Solutions for{' '}
          <span className="bg-gradient-to-r from-brand-safety to-brand-accent bg-clip-text text-transparent">
            Every Stakeholder
          </span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Whether you manage trades in the field, analyze budgets in the office, or design layouts in the studio, BuildSpace AI tailors data to your workflows.
        </p>
      </section>

      {/* 2. ROLE CHIPS / CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {SOLUTIONS_DATA.map((item) => {
          const Icon = item.icon
          const isActive = activeRole === item.role
          return (
            <button
              key={item.role}
              onClick={() => setActiveRole(item.role)}
              className={`p-4 sm:p-6 rounded-xl border text-center flex flex-col items-center justify-center gap-3 transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#141B2D] border-brand-safety shadow-floating'
                  : 'bg-transparent border-border hover:bg-muted dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`p-2.5 rounded-lg ${isActive ? 'bg-brand-safety text-white' : 'bg-muted/80 text-muted-foreground'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xs sm:text-sm">{item.title.split(' ')[0]}</span>
            </button>
          )
        })}
      </section>

      {/* 3. DETAIL VIEW */}
      <section className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 sm:p-8 shadow-floating max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
        {/* Specs */}
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              {current.description}
            </p>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm">
            {current.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="p-1 bg-brand-success/10 text-brand-success rounded mt-0.5 flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-650 dark:text-slate-300">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-safety text-white text-xs font-semibold rounded-lg hover:bg-brand-safety/90 transition-all shadow-lg shadow-brand-safety/15"
            >
              Get Started for {current.title.split(' ')[0]}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric Card */}
        <div className="p-6 bg-brand-obsidian text-slate-200 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center h-52 relative overflow-hidden">
          <div className="w-2 h-12 bg-brand-accent rounded-full absolute left-0 top-1/2 -translate-y-1/2"></div>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
            Proven Performance Impact
          </span>
          <h4 className="text-4xl font-heading font-extrabold text-brand-accent">
            {current.metric}
          </h4>
          <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
            {current.metricDesc}
          </p>
        </div>
      </section>
    </div>
  )
}
