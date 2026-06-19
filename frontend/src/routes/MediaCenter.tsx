import React, { useState, useRef } from 'react'
import {
  Image,
  Sparkles,
  Layers,
  ArrowLeftRight,
  ZoomIn,
  Camera,
  Trash2,
  Clock,
  Compass,
  AlertTriangle,
  FileImage,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useMediaStore, type MediaItem } from '@/store/mediaStore'

export default function MediaCenter() {
  const mediaItems = useMediaStore((state) => state.mediaItems)
  const activeMediaId = useMediaStore((state) => state.activeMediaId)
  const setActiveMedia = useMediaStore((state) => state.setActiveMedia)
  const addMediaAnnotation = useMediaStore((state) => state.addMediaAnnotation)

  // Navigation states
  const [activeMediaCategory, setActiveMediaCategory] = useState<'All' | 'Progress' | '360' | 'Drone'>('All')

  // Image Comparison Slider local state
  const [comparisonProgress, setComparisonProgress] = useState(50) // percent split slider
  const comparisonContainerRef = useRef<HTMLDivElement>(null)

  // 360 Media Gallery annotation state
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const [showAddAnnotationModal, setShowAddAnnotationModal] = useState(false)
  const [clickCoords, setClickCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [newAnnotationText, setNewAnnotationText] = useState("")
  const [newAnnotationSeverity, setNewAnnotationSeverity] = useState<'Low' | 'Medium' | 'High'>('Low')

  // AI progress / safety detection state
  const [isAiScanning, setIsAiScanning] = useState(false)
  const [showAiBbox, setShowAiBbox] = useState(false)
  const [aiObservations, setAiObservations] = useState<string[]>([])

  const activeMedia = mediaItems.find(m => m.id === activeMediaId) || mediaItems[0]

  const filteredMedia = mediaItems.filter((item) => {
    return activeMediaCategory === 'All' || item.category === activeMediaCategory
  })

  // Comparison slider mouse move handler
  const handleComparisonMouseMove = (e: React.MouseEvent) => {
    if (!comparisonContainerRef.current) return
    const rect = comparisonContainerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percent = Math.round((x / rect.width) * 100)
    setComparisonProgress(percent)
  }

  // 360 canvas coordinates click handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setClickCoords({ x, y })
    setShowAddAnnotationModal(true)
  }

  // Submit annotation pin
  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAnnotationText) return

    addMediaAnnotation(activeMedia.id, {
      x: clickCoords.x,
      y: clickCoords.y,
      text: newAnnotationText,
      severity: newAnnotationSeverity
    })

    setNewAnnotationText('')
    setShowAddAnnotationModal(false)
  }

  // Run AI object detection
  const handleTriggerAiScan = () => {
    setIsAiScanning(true)
    setShowAiBbox(false)
    setTimeout(() => {
      setIsAiScanning(false)
      setShowAiBbox(true)
      setAiObservations([
        "✅ Hardhat safety compliance - Verified (confidence 98%)",
        "✅ Safety vest visibility - Verified (confidence 94%)",
        "⚠️ Safety warning: Trench edge guardrail missing at Sector C (confidence 87%)"
      ])
    }, 1500)
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight">Media & Progress Gallery</h1>
        <p className="text-xs text-muted-foreground">Trace construction progress over time using albums, interactive 360-photo annotations, drone scans, and comparative sliders.</p>
      </div>

      {/* Media Filter Tab controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex gap-1.5 bg-muted/40 p-1 border border-border rounded-xl">
          {(['All', 'Progress', '360', 'Drone'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveMediaCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                activeMediaCategory === cat ? 'bg-amber-500 text-slate-950' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground">{filteredMedia.length} media logs logged</span>
      </div>

      {/* Main progress gallery view */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column Album List */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-4 shadow-raised space-y-3">
            <span className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white block">Albums Catalog</span>
            
            <div className="grid grid-cols-1 gap-2.5">
              {filteredMedia.map((med) => (
                <div
                  key={med.id}
                  onClick={() => setActiveMedia(med.id)}
                  className={`p-2 border rounded-xl hover:border-amber-500/50 transition-colors flex items-center gap-3 cursor-pointer ${
                    activeMediaId === med.id ? 'border-amber-500 bg-amber-500/5 font-bold' : 'border-border'
                  }`}
                >
                  <div className="w-12 h-12 bg-slate-900 rounded-lg overflow-hidden border border-border/60 relative flex items-center justify-center text-slate-500">
                    <FileImage className="w-6 h-6 text-slate-500" />
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-850 dark:text-slate-200 block truncate w-36">{med.title}</span>
                    <span className="text-[10px] text-muted-foreground">{med.date} • {med.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center column media canvas viewer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-3xl p-4 shadow-raised text-left space-y-4">
            <div className="border-b border-border pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">{activeMedia.title}</h3>
                <span className="text-[10px] text-muted-foreground">{activeMedia.category} Album • Logged: {activeMedia.date}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleTriggerAiScan}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold uppercase rounded-lg shadow flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Safety Scan
                </button>
              </div>
            </div>

            {/* 360 / Photo Canvas Drawing Annotation */}
            <div
              ref={imageContainerRef}
              onClick={handleCanvasClick}
              className="w-full h-96 bg-slate-900 border border-border rounded-2xl relative overflow-hidden flex items-center justify-center cursor-crosshair group"
            >
              {/* Simulated 360 sphere panorama grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>
              
              {/* Fallback visual shape representing building framework */}
              <svg className="w-80 h-80 text-amber-500/20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <rect x="10" y="30" width="80" height="60" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <polygon points="50,5 95,30 5,30" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="50" y1="30" x2="50" y2="90" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="45" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* Bounding box AI highlights */}
              {showAiBbox && (
                <div className="absolute top-[80px] left-[150px] w-28 h-28 border-2 border-rose-500 bg-rose-500/5 animate-pulse rounded flex flex-col justify-between p-1 z-20">
                  <span className="bg-rose-500 text-white text-[8px] px-1 py-0.5 rounded font-bold uppercase leading-none self-start">Trench Danger</span>
                  <span className="text-rose-100 text-[8px] font-bold text-right">87% Conf</span>
                </div>
              )}

              {/* Annotation pins */}
              {activeMedia.annotations.map((an) => (
                <div
                  key={an.id}
                  className="absolute group/pin"
                  style={{ left: `${an.x}%`, top: `${an.y}%` }}
                >
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] text-slate-950 font-bold border border-white cursor-pointer ${
                    an.severity === 'High' ? 'bg-rose-500 text-white animate-pulse' :
                    an.severity === 'Medium' ? 'bg-amber-500 text-slate-950 animate-bounce' :
                    'bg-emerald-500 text-white'
                  }`}>
                    !
                  </div>
                  {/* Annotation card */}
                  <div className="hidden group-hover/pin:block absolute top-4 left-4 bg-slate-950 text-white text-[9px] p-2.5 rounded-xl border border-border shadow-2xl z-20 w-44 space-y-1">
                    <span className="font-bold block leading-tight">{an.text}</span>
                    <span className="text-slate-400 block">Severity: {an.severity}</span>
                  </div>
                </div>
              ))}

              {/* Click annotation Modal trigger indicator */}
              {showAddAnnotationModal && (
                <div
                  className="absolute w-4 h-4 rounded-full bg-amber-500 border border-white animate-ping"
                  style={{ left: `${clickCoords.x}%`, top: `${clickCoords.y}%` }}
                ></div>
              )}

              <div className="absolute bottom-3 right-3 bg-slate-950/80 text-[9px] p-2 rounded-lg border border-border space-y-1">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> Critical rebar spacing check</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Standard site photo annotation</div>
              </div>
            </div>

            {/* AI observations listing */}
            {isAiScanning && <div className="text-[10px] text-muted-foreground text-center animate-pulse">Scanning safety indicators...</div>}
            {showAiBbox && aiObservations.length > 0 && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-xs text-left animate-fade-in">
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> AI Progress Inspection Results:
                </span>
                <div className="space-y-1 text-[11px]">
                  {aiObservations.map((obs, idx) => (
                    <div key={idx} className="text-slate-350">{obs}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column comparison slider details */}
        <div className="space-y-6 text-xs text-left">
          {/* Comparison Slider */}
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-3.5">
            <h3 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white flex items-center gap-1.5">
              <ArrowLeftRight className="w-4 h-4 text-amber-500" /> Timeline Image Comparison
            </h3>
            <p className="text-[11px] text-muted-foreground">Hover and move mouse inside the canvas box below to slide between before and after site updates.</p>

            <div
              ref={comparisonContainerRef}
              onMouseMove={handleComparisonMouseMove}
              className="w-full h-44 bg-slate-950 rounded-xl overflow-hidden relative border border-border select-none"
            >
              {/* Before Layer (Ground level) */}
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">June 01: Excavation Grading</span>
              </div>

              {/* After Layer (Structural Columns) */}
              <div
                className="absolute inset-y-0 left-0 bg-slate-800 border-r-2 border-amber-500 overflow-hidden flex items-center justify-center"
                style={{ width: `${comparisonProgress}%` }}
              >
                <div className="absolute w-[300px] text-center text-[9px] text-amber-500 uppercase tracking-widest font-mono">
                  June 15: Column Pouring Done
                </div>
              </div>

              {/* Slider Indicator Handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 p-1.5 bg-amber-500 text-slate-950 rounded-full shadow pointer-events-none"
                style={{ left: `calc(${comparisonProgress}% - 14px)` }}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Add annotation Modal panel */}
          {showAddAnnotationModal && (
            <div className="bg-white dark:bg-[#141B2D] border border-amber-500 rounded-2xl p-5 shadow-floating animate-fade-in space-y-3">
              <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Add Annotation Pin
              </h4>
              <p className="text-[10px] text-muted-foreground">Click location coordinate X: {clickCoords.x}%, Y: {clickCoords.y}% on drawing canvas.</p>
              
              <form onSubmit={handleAddAnnotation} className="space-y-3.5">
                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Annotation Text</label>
                  <input
                    type="text"
                    required
                    value={newAnnotationText}
                    onChange={(e) => setNewAnnotationText(e.target.value)}
                    placeholder="e.g. Verify rebar overlaps"
                    className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Severity</label>
                  <select
                    value={newAnnotationSeverity}
                    onChange={(e) => setNewAnnotationSeverity(e.target.value as any)}
                    className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-[10px]"
                  >
                    Pin Tag
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAnnotationModal(false)}
                    className="px-3 py-1.5 bg-muted rounded-lg text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
