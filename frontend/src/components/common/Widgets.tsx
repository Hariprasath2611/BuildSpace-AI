import {
  TrendingUp,
  CloudRain,
  ShieldAlert,
  Clock,
  Check,
  AlertTriangle,
  Compass,
  Database
} from 'lucide-react'

// 1. STATS WIDGET
export function StatsWidget() {
  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/30 dark:bg-slate-900/40 p-3.5 rounded-xl border border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Rebar Clashing</span>
          <span className="text-2xl font-bold text-slate-800 dark:text-white">0 Alerts</span>
          <span className="text-[10px] text-brand-success font-semibold flex items-center gap-0.5 mt-1">
            <Check className="w-3 h-3" /> Resolved
          </span>
        </div>
        <div className="bg-muted/30 dark:bg-slate-900/40 p-3.5 rounded-xl border border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Pour Compliance</span>
          <span className="text-2xl font-bold text-slate-800 dark:text-white">98.2%</span>
          <span className="text-[10px] text-brand-accent font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +1.2%
          </span>
        </div>
      </div>
    </div>
  )
}

// 2. WEATHER WIDGET (Crane threshold safety lock indicator)
export function WeatherWidget() {
  const windSpeed = 28 // wind exceeds 25mph limits
  const isCraneLocked = windSpeed > 25

  return (
    <div className={`p-4 rounded-xl border text-left flex items-start gap-4 transition-all ${
      isCraneLocked ? 'border-brand-danger bg-brand-danger/5' : 'border-border'
    }`}>
      <div className={`p-3 rounded-lg ${isCraneLocked ? 'bg-brand-danger/10 text-brand-danger' : 'bg-muted/80 text-muted-foreground'}`}>
        <CloudRain className="w-6 h-6" />
      </div>
      <div className="space-y-1.5 flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-heading font-bold text-sm">Site Meteorological Telemetry</h4>
          {isCraneLocked && (
            <span className="px-2 py-0.5 bg-brand-danger text-white text-[9px] font-bold uppercase tracking-wider rounded animate-pulse-slow">
              Crane Locked
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Wind speed: <strong>{windSpeed} mph</strong> (Crane limit: 25 mph)</p>
        <p className="text-[10px] text-muted-foreground leading-normal">
          {isCraneLocked ? "⚠️ Operational Warning: Suspend high-elevation hoisting immediately." : "🟢 Operational status optimal for all heavy equipment lifting."}
        </p>
      </div>
    </div>
  )
}

// 3. PROGRESS GRAPH WIDGET (SVG-based Volumetric Progress Chart)
export function ProgressWidget() {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-800 dark:text-slate-200">Volumetric Progress (Target vs Actual)</span>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[10px] text-brand-accent">
            <span className="w-2 h-2 bg-brand-accent rounded-full"></span> Scanned
          </span>
          <span className="flex items-center gap-1 text-[10px] text-brand-safety">
            <span className="w-2.5 h-0.5 bg-brand-safety block border-t border-dashed"></span> Target
          </span>
        </div>
      </div>

      <div className="relative aspect-[16/7] w-full bg-slate-950 border border-slate-900 rounded-xl overflow-hidden p-2">
        <svg className="w-full h-full text-slate-800" viewBox="0 0 300 120" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="30" x2="300" y2="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="0" y1="60" x2="300" y2="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="0" y1="90" x2="300" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />

          {/* Target concrete curve */}
          <path d="M 0 110 L 60 95 L 120 70 L 180 50 L 240 30 L 300 15" fill="none" stroke="#FF7B00" strokeWidth="1.2" strokeDasharray="4 4" />

          {/* Scanned concrete curve */}
          <path d="M 0 112 L 60 98 L 120 85 L 180 58 L 240 33 L 300 22" fill="none" stroke="#00C8FF" strokeWidth="2" />
          
          {/* Data point indicators */}
          <circle cx="180" cy="58" r="3" fill="#00C8FF" className="animate-ping" />
          <circle cx="180" cy="58" r="2.5" fill="#00C8FF" />
        </svg>
      </div>
      <p className="text-[10px] text-muted-foreground">Variance: <strong>-1.8%</strong> (Awaiting curing compression approvals on Level 3)</p>
    </div>
  )
}

// 4. SAFETY CHECKLIST WIDGET
export function SafetyWidget() {
  const checklists = [
    { name: "Tower A Harness Audit", status: "Pass", color: "text-brand-success" },
    { name: "Excavation Wall Mesh Check", status: "Review", color: "text-brand-safety" },
    { name: "Scaffolding Rigger Sign-off", status: "Pending", color: "text-muted-foreground" }
  ]

  return (
    <div className="space-y-3 text-left text-xs">
      <h4 className="font-heading font-bold text-sm">OSHA Compliance Checklist</h4>
      <div className="space-y-2">
        {checklists.map((c, i) => (
          <div key={i} className="flex justify-between items-center p-2.5 bg-muted/20 dark:bg-slate-900/20 border border-border rounded-lg">
            <span className="font-medium text-slate-705 dark:text-slate-300">{c.name}</span>
            <span className={`font-bold text-[10px] uppercase ${c.color}`}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 5. BUDGET SUMMARY WIDGET
export function BudgetWidget() {
  return (
    <div className="space-y-3 text-left text-xs">
      <div className="flex justify-between items-center">
        <h4 className="font-heading font-bold text-sm">Contingency Budget</h4>
        <span className="text-brand-success font-semibold">Under Budget</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Expended: $2.4M</span>
          <span>Budget: $3.0M</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-brand-success h-2 rounded-full w-[80%]"></div>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground">Estimated savings predicted by AI cost codes: <strong>$14,500 this cycle</strong></p>
    </div>
  )
}
