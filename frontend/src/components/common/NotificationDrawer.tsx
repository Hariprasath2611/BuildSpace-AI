import { useUIStore } from '../../store/uiStore'
import {
  X,
  Bell,
  ShieldAlert,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react'

export default function NotificationDrawer() {
  const isOpen = useUIStore((state) => state.isNotificationOpen)
  const setOpen = useUIStore((state) => state.setNotificationOpen)

  if (!isOpen) return null

  const alerts = [
    { id: 1, type: "safety", title: "OSHA Warning: Perimeter Scaffolding Open", desc: "Slab boundary mesh missing on Level 3 East Wing. Immediate hazard rating: 92/100.", icon: ShieldAlert, color: "text-brand-danger bg-brand-danger/10 border-brand-danger/20" },
    { id: 2, type: "delay", title: "Delay Predict: Rebar supply chain lead-time", desc: "ETA delayed by 4.5 days. Pushes critical path concrete pour by 2 days.", icon: Clock, color: "text-brand-safety bg-brand-safety/10 border-brand-safety/20" },
    { id: 3, type: "info", title: "RFI Resolved: Conduit route redirection", desc: "RFI #108 approved by structural lead. Specs modified.", icon: Compass, color: "text-brand-accent bg-brand-accent/10 border-brand-accent/20" }
  ]

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-brand-obsidian/40 dark:bg-black/60 backdrop-blur-sm"
      ></div>

      {/* Drawer */}
      <div className="w-80 sm:w-96 bg-white dark:bg-[#141B2D] border-l border-border h-full relative z-10 flex flex-col pt-16 xl:pt-0 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-safety animate-pulse-slow" />
            <span className="font-heading font-bold text-sm text-slate-800 dark:text-white">
              Notification Center
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {alerts.map((alert) => {
            const Icon = alert.icon
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border flex items-start gap-3 ${alert.color}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold">{alert.title}</h4>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">{alert.desc}</p>
                </div>
              </div>
            )
          })}

          {alerts.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-brand-success mx-auto" />
              <p className="text-muted-foreground italic">All caught up! No unread notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
