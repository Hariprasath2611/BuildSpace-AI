import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderGit2,
  Hammer,
  ShieldAlert,
  Sparkles,
  Check
} from 'lucide-react'

const MODULE_DATA = [
  {
    id: "projects",
    title: "Projects & Scheduling",
    subtitle: "Real-time field operations tracking and scheduling control center",
    icon: FolderGit2,
    bullets: [
      "Critical path delay forecasting using historical project parameters.",
      "Field check-ins and progress metrics directly synced from mobile devices.",
      "Gantt schedule tracking with automatic slack calculations.",
      "Active team assignments and field roster tracking."
    ],
    previewTitle: "Projects Control Center Dashboard",
    previewContent: (
      <div className="space-y-4 text-xs font-mono text-slate-300">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span>Active Project: Tower A Residences</span>
          <span className="text-brand-success font-semibold">🟢 In Progress</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="bg-slate-900 p-2 rounded">
            <span className="text-slate-500 block">Est. Completion</span>
            <span className="text-white text-xs font-bold">Nov 18, 2026</span>
          </div>
          <div className="bg-slate-900 p-2 rounded">
            <span className="text-slate-500 block">Schedule Variance</span>
            <span className="text-brand-safety text-xs font-bold">+0.5 Days</span>
          </div>
        </div>
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
          <div className="bg-brand-accent h-full w-[78%]"></div>
        </div>
        <span className="text-[10px] text-slate-500 block">78% Work Completed • Last updated 2m ago</span>
      </div>
    )
  },
  {
    id: "materials",
    title: "Materials & Supply Chain",
    subtitle: "End-to-end material tracking, estimations, and vendor billing management",
    icon: Hammer,
    bullets: [
      "YOLOv11 automated volumetric material checks on site uploads.",
      "Automatic purchase order verification against CAD delivery blueprints.",
      "Subcontractor pipeline tracking with supplier lead-time estimations.",
      "Cost code allocation mapping directly into financial ledgers."
    ],
    previewTitle: "Materials Verification Scanner",
    previewContent: (
      <div className="space-y-4 text-xs font-mono text-slate-300">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span>Delivery Check: Batch #8928</span>
          <span className="text-brand-accent font-semibold">Verified</span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="flex justify-between">
            <span>Product: Concrete Mix A</span>
            <span>Quantity: 450 Yd3</span>
          </div>
          <div className="flex justify-between">
            <span>Invoice Match: Yes</span>
            <span className="text-brand-success font-bold">100% Correct</span>
          </div>
        </div>
        <div className="p-2 bg-slate-900 rounded border border-brand-accent/20 text-[10px]">
          <span className="text-brand-accent font-bold block mb-1">Volumetric scan validation</span>
          <p className="text-slate-400">Scanners verified concrete quantity within 0.8% variance threshold.</p>
        </div>
      </div>
    )
  },
  {
    id: "safety",
    title: "Safety & Site Inspection",
    subtitle: "OSHA-compliant incident alerts and computer vision safety checks",
    icon: ShieldAlert,
    bullets: [
      "Real-time perimeter video feeds warning of missing safety nets.",
      "Automatic PPE checks using YOLOv11 smart camera triggers.",
      "OSHA checklist forms with offline support and draft saving.",
      "Instant push alerts for field hazard observations."
    ],
    previewTitle: "Computer Vision Telemetry Scan",
    previewContent: (
      <div className="space-y-4 text-xs font-mono text-slate-300">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-brand-danger">
          <span className="font-bold">⚠️ CRITICAL OBSERVATION</span>
          <span className="animate-pulse">Active Feed</span>
        </div>
        <div className="space-y-2 text-[10px]">
          <p className="text-slate-400">Area: Tower B East Wing Slab Boundary</p>
          <div className="p-2 bg-slate-900 border border-brand-danger/20 rounded">
            <span className="text-brand-danger font-bold block">Defect: Perimeter Scaffolding Open</span>
            <p className="text-slate-400 mt-1">Fall protection mesh missing. Risk rating: 92/100.</p>
          </div>
        </div>
        <button className="w-full py-1.5 bg-brand-danger text-white rounded text-[10px] font-bold">
          Send Supervisor Alert
        </button>
      </div>
    )
  },
  {
    id: "ai",
    title: "AI Copilot & OCR Document AI",
    subtitle: "RAG vector search scans structural specifications and schedules",
    icon: Sparkles,
    bullets: [
      "Construction GPT chatbot answers questions on specs instantly.",
      "Segment Anything Model (SAM) extracts drawing overlays dynamically.",
      "OCR matches drawings with cost codes and line-item schedules.",
      "Context citations link back to engineering source blueprints."
    ],
    previewTitle: "AI Copilot Chat Console",
    previewContent: (
      <div className="space-y-3 text-xs font-mono text-slate-300">
        <div className="p-2 bg-slate-950 rounded border border-slate-800">
          <span className="text-brand-accent block text-[9px] font-bold">USER PROMPT</span>
          <p className="text-[10px]">What is the concrete curing duration for Slab Level 3?</p>
        </div>
        <div className="p-2 bg-slate-900 rounded border border-brand-accent/20">
          <span className="text-brand-safety block text-[9px] font-bold">COPILOT ANSWER</span>
          <p className="text-[10px] text-slate-400">7 days wet-curing required before structural tension loading.</p>
          <div className="text-[9px] text-slate-500 mt-1">
            Source: <span className="text-brand-accent underline">spec_sec_033000.pdf#page=12</span>
          </div>
        </div>
      </div>
    )
  }
]

export default function Features() {
  const [activeModuleId, setActiveModuleId] = useState("projects")
  const activeModule = MODULE_DATA.find(m => m.id === activeModuleId) || MODULE_DATA[0]

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER SECTION */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
          Everything You Need to{' '}
          <span className="bg-gradient-to-r from-brand-safety to-brand-accent bg-clip-text text-transparent">
            Orchestrate Construction
          </span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Explore the professional modules that power BuildSpace AI. Grouped by capabilities, designed to work seamlessly in the field and the trailer.
        </p>
      </section>

      {/* 2. TAB SELECTION & CONTENT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          {MODULE_DATA.map((module) => {
            const Icon = module.icon
            const isActive = activeModuleId === module.id
            return (
              <button
                key={module.id}
                onClick={() => setActiveModuleId(module.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  isActive
                    ? 'bg-white dark:bg-[#141B2D] border-brand-safety shadow-raised'
                    : 'bg-transparent border-transparent hover:bg-muted dark:hover:bg-slate-800/50'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-brand-safety text-white' : 'bg-muted/80 text-muted-foreground'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">{module.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{module.subtitle}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Tab Detail Panel */}
        <div className="lg:col-span-8 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 sm:p-8 shadow-floating grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {/* Capability Bullets */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                {activeModule.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {activeModule.subtitle}
              </p>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm">
              {activeModule.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="p-1 bg-brand-success/10 text-brand-success rounded mt-0.5 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-350">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Screen Preview Frame */}
          <div className="bg-brand-obsidian rounded-xl border border-slate-800 overflow-hidden flex flex-col h-64 shadow-inner">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>{activeModule.previewTitle}</span>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-center">
              {activeModule.previewContent}
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRIAL FOOTER */}
      <section className="bg-muted/30 dark:bg-slate-900/30 border border-border rounded-xl p-8 text-center space-y-4 max-w-4xl mx-auto">
        <h4 className="font-heading font-bold text-lg">
          Want a Personalized Demonstration of These Features?
        </h4>
        <p className="text-xs text-muted-foreground max-w-xl mx-auto">
          Our solutions engineering team can configure a custom walkthrough with your drawings.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-safety text-white text-xs font-semibold rounded-lg hover:bg-brand-safety/90 transition-all shadow-lg shadow-brand-safety/15"
        >
          Book Custom RAG Demo
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  )
}
