import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Search,
  Eye,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react'

export default function AICenter() {
  const [sliderPercent, setSliderPercent] = useState(50)

  // Raw CAD Blueprint SVG
  const renderRawBlueprint = () => (
    <svg className="w-full h-full bg-slate-900 text-slate-500 p-4" viewBox="0 0 400 250">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {/* Structural Grids */}
      <line x1="50" y1="20" x2="50" y2="230" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      <line x1="200" y1="20" x2="200" y2="230" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      <line x1="350" y1="20" x2="350" y2="230" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      
      <line x1="20" y1="60" x2="380" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      <line x1="20" y1="180" x2="380" y2="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />

      {/* Grid Identifiers */}
      <circle cx="50" cy="235" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="47" y="238" fontSize="8" fill="currentColor">A</text>
      <circle cx="200" cy="235" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="197" y="238" fontSize="8" fill="currentColor">B</text>
      
      {/* Column Hubs */}
      <rect x="42" y="52" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="192" y="52" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="342" y="52" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
      
      <rect x="42" y="172" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="192" y="172" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Wall layouts */}
      <line x1="58" y1="60" x2="192" y2="60" stroke="currentColor" strokeWidth="3" />
      <line x1="208" y1="60" x2="342" y2="60" stroke="currentColor" strokeWidth="3" />
      <line x1="50" y1="68" x2="50" y2="172" stroke="currentColor" strokeWidth="3" />
      <line x1="200" y1="68" x2="200" y2="172" stroke="currentColor" strokeWidth="3" />
    </svg>
  )

  // AI Telemetry Overlay Blueprint SVG
  const renderAIScanBlueprint = () => (
    <svg className="w-full h-full bg-slate-900 text-slate-400 p-4" viewBox="0 0 400 250">
      <defs>
        <pattern id="grid-ai" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#64748B" strokeWidth="0.5" strokeOpacity="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-ai)" />
      
      {/* Structural Grids */}
      <line x1="50" y1="20" x2="50" y2="230" stroke="#64748B" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      <line x1="200" y1="20" x2="200" y2="230" stroke="#64748B" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      <line x1="350" y1="20" x2="350" y2="230" stroke="#64748B" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      
      <line x1="20" y1="60" x2="380" y2="60" stroke="#64748B" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      <line x1="20" y1="180" x2="380" y2="180" stroke="#64748B" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      
      {/* Column Hubs */}
      <rect x="42" y="52" width="16" height="16" fill="none" stroke="#64748B" strokeWidth="1.5" />
      <rect x="192" y="52" width="16" height="16" fill="none" stroke="#64748B" strokeWidth="1.5" />
      
      {/* Wall layouts */}
      <line x1="58" y1="60" x2="192" y2="60" stroke="#64748B" strokeWidth="3" />
      
      {/* YOLOv11 Safety Danger Alert overlay */}
      <rect x="38" y="48" width="24" height="24" fill="#FF1744" fillOpacity="0.15" stroke="#FF1744" strokeWidth="1.5" strokeDasharray="2 2" className="animate-pulse" />
      <circle cx="50" cy="35" r="4" fill="#FF1744" />
      <text x="60" y="38" fontSize="7" fill="#FF1744" fontWeight="bold">YOLOv11: Clash (98% Conf)</text>

      {/* Segment Anything Excavation Zone outline */}
      <polygon points="120,80 250,90 280,160 140,150" fill="#00C8FF" fillOpacity="0.1" stroke="#00C8FF" strokeWidth="1.5" />
      <text x="130" y="76" fontSize="7" fill="#00C8FF" fontWeight="bold">SAM: Pour boundary scan</text>
      
      {/* Volumetric Concrete Measurement Scan */}
      <rect x="180" y="165" width="40" height="30" fill="#00E676" fillOpacity="0.1" stroke="#00E676" strokeWidth="1.2" />
      <text x="180" y="160" fontSize="7" fill="#00E676" fontWeight="bold">Est: 14.2 Yd3 Concrete</text>
    </svg>
  )

  return (
    <div className="space-y-20 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
          Next-Gen AI Purpose-Built for{' '}
          <span className="bg-gradient-to-r from-brand-safety to-brand-accent bg-clip-text text-transparent">
            Physical Building Sites
          </span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          How our visual segmentation models, RAG vector catalogs, and automated volumetric calculations convert site scans into actionable schedules.
        </p>
      </section>

      {/* 2. SPLIT-SCREEN COMPARISON SLIDER */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h3 className="font-heading font-bold text-lg sm:text-xl">Volumetric & Clash Scrubber</h3>
          <p className="text-xs text-muted-foreground">Drag the slider to compare raw CAD sheets vs. AI telemetry scanning</p>
        </div>

        <div className="relative border border-border rounded-2xl overflow-hidden aspect-[8/5] shadow-floating bg-slate-900 select-none">
          {/* Background: AI Scan */}
          <div className="absolute inset-0 w-full h-full">
            {renderAIScanBlueprint()}
          </div>

          {/* Foreground: Raw Blueprint (clipped) */}
          <div
            className="absolute inset-0 h-full overflow-hidden"
            style={{ width: `${sliderPercent}%`, borderRight: '2.5px solid #FF7B00' }}
          >
            <div className="absolute inset-0 w-[896px] h-[560px] max-w-none">
              {renderRawBlueprint()}
            </div>
          </div>

          {/* Slider line handle */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center"
            style={{ left: `calc(${sliderPercent}% - 12px)` }}
          >
            <div className="w-6 h-6 rounded-full bg-brand-safety text-white flex items-center justify-center shadow-lg font-bold text-xs select-none">
              ↔
            </div>
          </div>

          {/* Scrubber control */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPercent}
            onChange={(e) => setSliderPercent(Number(e.target.value))}
            className="absolute inset-0 opacity-0 w-full h-full cursor-ew-resize z-20"
          />
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-2">
          <span>← Slide Left to Reveal AI Scan</span>
          <span>Slide Right to View Raw Blueprint →</span>
        </div>
      </section>

      {/* 3. CORE AI CAPABILITIES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          { title: "Construction GPT (RAG)", desc: "Searches schedules and technical specification checklists, referencing source page citations instantly.", icon: Search },
          { title: "Defect Detection (YOLOv11)", desc: "Scans active video streams and drone photos to flag structural steel anomalies and OSHA compliance hazards.", icon: Eye },
          { title: "Safety Warning Engine", desc: "Monitors site zone boundaries, triggering sirens and mobile superintendent pushes for hazard avoidance.", icon: AlertTriangle }
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="bg-white dark:bg-[#141B2D] p-6 rounded-xl border border-border shadow-raised space-y-3">
              <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-lg w-max">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-slate-800 dark:text-slate-200">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          )
        })}
      </section>

      {/* 4. TRIAL LINK */}
      <section className="bg-gradient-to-r from-brand-obsidian to-slate-900 text-slate-200 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-floating max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-xs font-bold text-brand-accent animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>94% Predicted Accuracy Index</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
          Begin Forecasting Project Risk Today
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Sign up to overlay our volumetric and RAG engines on top of your existing project parameters.
        </p>
        <div className="pt-2">
          <Link
            to="/signup"
            className="px-6 py-3 bg-brand-safety hover:bg-brand-safety/90 text-white font-semibold rounded-lg shadow-lg shadow-brand-safety/20 transition-all inline-flex items-center gap-2 text-xs sm:text-sm"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
