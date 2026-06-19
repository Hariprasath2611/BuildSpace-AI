import { useState, useRef } from 'react'
import { useClientStore, ClientAnnotation } from '@/store/clientStore'
import {
  Sparkles,
  TrendingUp,
  FileText,
  Calendar,
  Layers,
  Activity,
  Plus,
  Trash2,
  Check,
  X,
  ChevronRight,
  Download,
  Mail,
  Camera,
  MessageSquare,
  Mic,
  Paperclip,
  Play
} from 'lucide-react'

export default function ClientPortal() {
  // Zustand Store binding
  const progressPercentage = useClientStore((state) => state.progressPercentage)
  const milestones = useClientStore((state) => state.milestones)
  const mediaGallery = useClientStore((state) => state.mediaGallery)
  const documents = useClientStore((state) => state.documents)
  const invoices = useClientStore((state) => state.invoices)
  const changeOrders = useClientStore((state) => state.changeOrders)
  const meetings = useClientStore((state) => state.meetings)
  const activeMediaId = useClientStore((state) => state.activeMediaId)

  const addAnnotation = useClientStore((state) => state.addAnnotation)
  const approveChangeOrder = useClientStore((state) => state.approveChangeOrder)
  const rejectChangeOrder = useClientStore((state) => state.rejectChangeOrder)
  const approveInvoice = useClientStore((state) => state.approveInvoice)
  const rejectInvoice = useClientStore((state) => state.rejectInvoice)

  // Local navigation states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'timeline' | 'gallery' | 'docs' | 'finance' | 'collaboration' | 'ai'>('dashboard')

  // 360 Media Gallery states
  const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null)
  const [showAddAnnotationModal, setShowAddAnnotationModal] = useState(false)
  const [clickCoords, setClickCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [newAnnotationLabel, setNewAnnotationLabel] = useState("")
  const [newAnnotationSeverity, setNewAnnotationSeverity] = useState<'Low' | 'Medium' | 'High'>('Low')
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Client AI Chat assistant states
  const [chatPrompt, setChatPrompt] = useState("")
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: "Hello! I am your BuildSpace Client Assistant. I can help you review progress photos, milestone projections, change order records, and invoice status. What would you like to check?" }
  ])
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Voice recording simulator states
  const [isRecording, setIsRecording] = useState(false)

  // File upload simulator states
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Retrieve active media info
  const activeMedia = mediaGallery.find((m) => m.id === activeMediaId) || mediaGallery[0]

  // Photo Canvas coordinate click handler
  const handlePhotoCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    // Convert click position to percentage within container
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setClickCoords({ x, y })
    setShowAddAnnotationModal(true)
  }

  // Submit coordinate annotation
  const handleAddAnnotationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAnnotationLabel) return
    addAnnotation(activeMedia.id, {
      x: clickCoords.x,
      y: clickCoords.y,
      label: newAnnotationLabel,
      severity: newAnnotationSeverity
    })
    setNewAnnotationLabel("")
    setShowAddAnnotationModal(false)
  }

  // Client Chat Submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatPrompt.trim()) return

    const newLog = [...chatLog, { role: 'user' as const, text: chatPrompt }]
    setChatLog(newLog)
    setChatPrompt("")
    setIsAiLoading(true)

    setTimeout(() => {
      let aiText = "Analyzing project details..."
      const lower = chatPrompt.toLowerCase()
      if (lower.includes("progress") || lower.includes("timeline")) {
        aiText = `The current project completion progress stands at **${progressPercentage}%**. The structural framing milestone is active and projected to finish by August 14. Excavation and foundations are completely verified.`
      } else if (lower.includes("cost") || lower.includes("invoice") || lower.includes("money")) {
        aiText = `You have **1 pending invoice** (INV-2026-092 for $120,000 due June 25) and **1 pending change order** (CO-02 for $14,500) under review.`
      } else if (lower.includes("meeting") || lower.includes("sync")) {
        aiText = "Your next weekly progress sync meeting is scheduled for June 20 at 10:00 AM. The AI agenda outlines steel supply review."
      } else {
        aiText = "I have scanned the blueprints vault and progress gallery. Framing progress checks in Zone B show optimal alignment."
      }
      setChatLog((prev) => [...prev, { role: 'assistant' as const, text: aiText }])
      setIsAiLoading(false)
    }, 1200)
  }

  // Voice recording simulator trigger
  const handleVoiceTrigger = () => {
    if (isRecording) {
      setIsRecording(false)
      const prompt = "Explain the cost impact of framing change order CO-02."
      setChatPrompt(prompt)
    } else {
      setIsRecording(true)
      setTimeout(() => {
        setIsRecording(false)
        const prompt = "Explain the cost impact of framing change order CO-02."
        setChatPrompt(prompt)
      }, 2500)
    }
  }

  // Attachment upload simulator trigger
  const handleAttachmentTrigger = () => {
    setIsFileUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsFileUploading(false)
          setChatPrompt("Summarize key clauses from the attached quality audit brief.")
          return 100
        }
        return prev + 25
      })
    }, 250)
  }

  return (
    <div className="space-y-6 py-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. TOP STATS BAR */}
      <header className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#FF7B00]/10 text-[#FF7B00] rounded-lg">
              <Camera className="w-5 h-5 text-[#FF7B00]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight">
              BuildSpace Client Gateway Portal
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Project status overview, 360 annotations canvas, invoicing approvals, and client AI assistant.
          </p>
        </div>

        {/* Dashboard parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
          {/* Progress widget */}
          <div className="bg-muted/10 border border-border/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Project progress</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{progressPercentage}%</span>
            </div>
          </div>

          {/* Pending approvals widget */}
          <div className="bg-muted/10 border border-border/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Layers className="w-4 h-4 text-amber-500" />
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Pending approvals</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                {changeOrders.filter(co => co.status === 'pending').length + invoices.filter(i => i.status === 'Pending Approval').length} Actions
              </span>
            </div>
          </div>

          {/* Next sync */}
          <div className="bg-muted/10 border border-border/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-sky-500" />
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Next Progress Sync</span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{meetings[0]?.dateTime || 'Schedule Open'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. TAB SWITCHER */}
      <div className="flex border-b border-border overflow-x-auto gap-2 scrollbar-none">
        {[
          { id: 'dashboard', label: 'Client Dashboard', icon: Layers },
          { id: 'timeline', label: 'Milestone Timelines', icon: Calendar },
          { id: 'gallery', label: '360 Progress Photos', icon: Camera },
          { id: 'docs', label: 'Documents Vault', icon: FileText },
          { id: 'finance', label: 'Invoices & COs', icon: TrendingUp },
          { id: 'collaboration', label: 'Meeting Schedules', icon: Mail },
          { id: 'ai', label: 'Client AI Assistant', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-brand-primary text-brand-primary bg-brand-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10'
              }`}
              style={isActive ? { borderBottomColor: '#FF7B00', color: '#FF7B00' } : {}}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 3. DYNAMIC CONTENT SPLIT PANELS */}
      <main className="min-h-[500px]">
        {/* TAB 1: CLIENT DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left section: Milestone nodes & recent files */}
            <div className="space-y-6 lg:col-span-1">
              {/* Milestones nodes */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-border pb-3">
                  Progress Milestone Nodes
                </h3>

                <div className="space-y-3">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className="border border-border/85 rounded-xl p-3 bg-muted/5 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                        <span className="text-[10px] text-muted-foreground block">Planned: {m.plannedDate}</span>
                      </div>

                      <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        m.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : m.status === 'Active'
                            ? 'bg-amber-500/10 text-amber-500 animate-pulse'
                            : 'bg-slate-500/10 text-slate-500'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right section: Invoices, change orders & 360 photo widgets */}
            <div className="lg:col-span-2 space-y-6">
              {/* Change orders list */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Change Orders Pending Signature
                </h3>

                {changeOrders.filter(co => co.status === 'pending').length === 0 ? (
                  <div className="border border-dashed border-border rounded-xl p-8 text-center text-xs text-muted-foreground">
                    All change orders have been signed off. No pending approvals.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {changeOrders.filter(co => co.status === 'pending').map((co) => (
                      <div
                        key={co.id}
                        className="border border-border rounded-xl p-4 bg-muted/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{co.title}</h4>
                          <p className="text-[11px] text-muted-foreground">{co.reason}</p>
                          <span className="text-xs font-mono font-bold text-[#FF7B00] block">+${co.amount.toLocaleString()} USD</span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => approveChangeOrder(co.id)}
                            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Sign
                          </button>
                          <button
                            onClick={() => rejectChangeOrder(co.id)}
                            className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-500/90 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Claims Invoices list */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Project Invoices Summary
                </h3>

                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="border border-border rounded-xl p-4 bg-muted/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{inv.title}</h4>
                        <span className="text-[10px] text-muted-foreground block">Due Date: {inv.dueDate}</span>
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">${inv.amount.toLocaleString()} USD</span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : inv.status === 'Pending Approval'
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {inv.status}
                        </span>

                        {inv.status === 'Pending Approval' && (
                          <div className="flex items-center gap-1.5 ml-2">
                            <button
                              onClick={() => approveInvoice(inv.id)}
                              className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all"
                              title="Approve Invoice"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => rejectInvoice(inv.id)}
                              className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all"
                              title="Request Invoice Revision"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MILESTONES SCHEDULE TIMELINES */}
        {activeTab === 'timeline' && (
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Interactive Milestone Schedule
            </h3>

            <div className="relative h-44 bg-muted/10 rounded-xl flex items-center justify-center">
              <svg className="w-full h-full p-4" viewBox="0 0 500 200" preserveAspectRatio="none">
                <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                
                {/* SVG Gantt milestones segments */}
                <rect x="30" y="30" width="120" height="25" fill="#00E676" rx="4" fillOpacity="0.8" />
                <text x="40" y="46" fontSize="8" fill="#FFF" fontWeight="bold">Excavation (100%)</text>

                <rect x="160" y="70" width="140" height="25" fill="#00E676" rx="4" fillOpacity="0.8" />
                <text x="170" y="86" fontSize="8" fill="#FFF" fontWeight="bold">Foundation Pour (100%)</text>

                <rect x="310" y="110" width="160" height="25" fill="#FFC107" rx="4" fillOpacity="0.8" className="animate-pulse" />
                <text x="320" y="126" fontSize="8" fill="#FFF" fontWeight="bold">Steel Framing (65%)</text>
              </svg>
              <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-[9px] font-bold text-muted-foreground font-mono">
                <span>Q1 2026</span><span>Q2 2026</span><span>Q3 2026 (Est)</span><span>Q4 2026 (Est)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 360 PROGRESS PHOTO CANVASES */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coordinate Canvas mapping */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Progress Photo Canvas: {activeMedia.fileName}
                  </h3>
                  <span className="text-[10px] font-bold text-muted-foreground font-mono">
                    Click anywhere on image to log quality/construction annotations.
                  </span>
                </div>

                {/* Annotation coordinate canvas */}
                <div
                  ref={imageContainerRef}
                  onClick={handlePhotoCanvasClick}
                  className="relative overflow-hidden rounded-xl border border-border aspect-[8/5] bg-slate-900 cursor-crosshair select-none flex items-center justify-center text-slate-600"
                >
                  {/* Mock Photo layout grid */}
                  <svg className="absolute inset-0 w-full h-full text-slate-500 opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="25" y1="0" x2="25" y2="100" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="75" y1="0" x2="75" y2="100" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="0" y1="33" x2="100" y2="33" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="0" y1="66" x2="100" y2="66" stroke="currentColor" strokeWidth="0.5" />
                  </svg>

                  <div className="space-y-2 text-center pointer-events-none z-10 p-4">
                    <Camera className="w-10 h-10 mx-auto text-slate-500" />
                    <span className="font-heading font-bold text-xs block text-slate-400">360 Progress Image: {activeMedia.fileName}</span>
                    <span className="text-[10px] text-slate-500 block">Logged on: {activeMedia.uploadDate}</span>
                  </div>

                  {/* Render Annotations coordinates */}
                  {activeMedia.annotations.map((ann) => (
                    <div
                      key={ann.id}
                      onMouseEnter={() => setHoveredAnnotation(ann.id)}
                      onMouseLeave={() => setHoveredAnnotation(null)}
                      className={`absolute w-6.5 h-6.5 rounded-full flex items-center justify-center font-bold text-[9px] text-white shadow-lg cursor-pointer transition-all transform -translate-x-1/2 -translate-y-1/2 ${
                        ann.severity === 'High'
                          ? 'bg-rose-500'
                          : ann.severity === 'Medium'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      }`}
                      style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                    >
                      {ann.severity === 'High' ? '!' : '✓'}

                      {/* Tooltip */}
                      {hoveredAnnotation === ann.id && (
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-[10px] font-semibold w-40 z-30 pointer-events-none shadow-floating">
                          <span className="block text-slate-400 uppercase text-[8px] font-bold">Severity: {ann.severity}</span>
                          {ann.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right section: Annotations list & Add Form modal */}
            <div className="space-y-6">
              {/* Annotations List */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Image Annotation Logs
                </h3>

                {activeMedia.annotations.length === 0 ? (
                  <div className="border border-dashed border-border rounded-xl p-8 text-center text-xs text-muted-foreground">
                    No annotations logged on this progress media. Click canvas to add.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeMedia.annotations.map((ann) => (
                      <div
                        key={ann.id}
                        className="border border-border/70 rounded-xl p-3 bg-muted/5 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">{ann.label}</span>
                          <span className="text-[9px] text-muted-foreground">Coordinates: X:{ann.x} Y:{ann.y}</span>
                        </div>

                        <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          ann.severity === 'High'
                            ? 'bg-rose-500/10 text-rose-500'
                            : ann.severity === 'Medium'
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {ann.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Annotation form (renders when image canvas click triggers) */}
              {showAddAnnotationModal && (
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised animate-fadeIn">
                  <form onSubmit={handleAddAnnotationSubmit} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-200">
                        Create Annotation Tag (X:{clickCoords.x} Y:{clickCoords.y})
                      </span>
                      <button type="button" onClick={() => setShowAddAnnotationModal(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Issue Label Description</label>
                      <input
                        type="text"
                        value={newAnnotationLabel}
                        onChange={(e) => setNewAnnotationLabel(e.target.value)}
                        placeholder="e.g. Structural steel corrosion spots"
                        className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Severity Risk</label>
                      <select
                        value={newAnnotationSeverity}
                        onChange={(e) => setNewAnnotationSeverity(e.target.value as any)}
                        className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                      >
                        <option value="Low">Low severity</option>
                        <option value="Medium">Medium warning</option>
                        <option value="High">High critical</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#FF7B00] hover:bg-[#FF7B00]/90 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Tag
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENTS VAULT */}
        {activeTab === 'docs' && (
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Blueprints & Contract Vault
            </h3>

            <div className="border border-border/60 rounded-xl overflow-hidden bg-muted/5">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/30 border-b border-border/80 text-[10px] uppercase font-mono text-muted-foreground">
                  <tr>
                    <th className="p-3">File Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Upload Date</th>
                    <th className="p-3 text-right">Size</th>
                    <th className="p-3 text-right">Version</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-semibold text-slate-700 dark:text-slate-200">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="p-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        {doc.name}
                      </td>
                      <td className="p-3 text-muted-foreground">{doc.category}</td>
                      <td className="p-3">{doc.uploadDate}</td>
                      <td className="p-3 text-right font-mono">{doc.size}</td>
                      <td className="p-3 text-right font-mono">v{doc.version}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => alert(`Downloading: ${doc.name}`)}
                          className="p-1 bg-muted hover:bg-[#FF7B00]/10 border border-border hover:border-[#FF7B00]/40 rounded-lg text-slate-655 dark:text-slate-350 hover:text-[#FF7B00] transition-all"
                          title="Download blueprint file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: FINANCIAL INVOICES & CHANGE ORDERS */}
        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Claims Invoices list */}
            <div className="lg:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Aged Invoice Ledgers
              </h3>

              <div className="border border-border/60 rounded-xl overflow-hidden bg-muted/5">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/30 border-b border-border/80 text-[10px] uppercase font-mono text-muted-foreground">
                    <tr>
                      <th className="p-3">Invoice details</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-semibold text-slate-700 dark:text-slate-200">
                    {invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="p-3">{inv.title}</td>
                        <td className="p-3">{inv.dueDate}</td>
                        <td className="p-3 text-right font-mono">${inv.amount.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Change Orders Signatures panel */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Change Order Approval Panel
              </h3>

              {changeOrders.map((co) => (
                <div
                  key={co.id}
                  className="border border-border rounded-xl p-4 bg-muted/5 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{co.title}</span>
                    <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      co.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : co.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-500 animate-pulse'
                          : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {co.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">{co.reason}</p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-foreground text-[10px]">Impact Cost</span>
                    <span className="font-mono font-bold text-[#FF7B00]">+${co.amount.toLocaleString()} USD</span>
                  </div>

                  {co.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => approveChangeOrder(co.id)}
                        className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider flex items-center justify-center gap-0.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Sign-off
                      </button>
                      <button
                        onClick={() => rejectChangeOrder(co.id)}
                        className="flex-1 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider flex items-center justify-center gap-0.5"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COLLABORATION HUB & MEETING SUMMARIES */}
        {activeTab === 'collaboration' && (
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-border pb-3">
              Meeting Records & AI Summaries
            </h3>

            <div className="space-y-4">
              {meetings.map((meet) => (
                <div
                  key={meet.id}
                  className="border border-border/80 rounded-xl p-4 bg-muted/5 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="md:col-span-1 space-y-1.5">
                    <span className="text-[10px] font-mono text-muted-foreground block">{meet.dateTime}</span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{meet.title}</h4>
                    <p className="text-[11px] text-slate-700 dark:text-slate-350"><span className="font-bold text-[10px] uppercase text-muted-foreground">Agenda:</span> {meet.agenda}</p>
                  </div>

                  <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-4 space-y-2">
                    <span className="text-[9px] font-extrabold bg-[#FF7B00]/10 text-[#FF7B00] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 w-max">
                      <Sparkles className="w-3 h-3" /> AI Meeting Summary
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                      "{meet.summary}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CLIENT AI ASSISTANT COPILOT */}
        {activeTab === 'ai' && (
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-0 overflow-hidden shadow-raised flex flex-col h-[520px]">
            {/* Conversation Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatLog.map((log, index) => (
                <div
                  key={index}
                  className={`flex gap-3 max-w-[85%] ${log.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    log.role === 'user' ? 'bg-[#FF7B00] text-white' : 'bg-slate-850 text-slate-200 border border-slate-700'
                  }`}>
                    {log.role === 'user' ? 'C' : 'AI'}
                  </div>

                  <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                    log.role === 'user'
                      ? 'bg-[#FF7B00]/10 border-[#FF7B00]/30 text-slate-900 dark:text-slate-100'
                      : 'bg-white dark:bg-[#0B0F19] border-border text-slate-800 dark:text-slate-250 shadow-sm'
                  } space-y-2`}
                  style={log.role === 'user' ? { backgroundColor: 'rgba(255, 123, 0, 0.1)' } : {}}
                  >
                    <p className="whitespace-pre-wrap">{log.text}</p>
                    
                    {/* Simulated visual charts inside AI reply */}
                    {log.text.includes("Framing") && (
                      <div className="border border-border/60 rounded-xl p-3 bg-slate-900/30">
                        <svg className="w-full h-16 text-slate-500" viewBox="0 0 300 80" preserveAspectRatio="none">
                          <polyline fill="none" stroke="#00C8FF" strokeWidth="2" points="10,60 80,45 150,50 220,30 290,20" />
                          <circle cx="220" cy="30" r="3" fill="#FF7B00" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex gap-3 max-w-[85%] mr-auto items-center animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-200 border border-slate-700">AI</div>
                  <div className="p-3 border border-border bg-muted/5 rounded-2xl text-xs text-muted-foreground">
                    Analyzing cost code baselines...
                  </div>
                </div>
              )}

              {/* Upload loading state simulation */}
              {isFileUploading && (
                <div className="max-w-[70%] mr-auto bg-white dark:bg-[#0B0F19] border border-border p-4 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 animate-spin" /> Ingesting file: Quality_Audit_Briefing.pdf
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1">
                    <div className="bg-[#FF7B00] h-1 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input Area */}
            <form onSubmit={handleChatSubmit} className="border-t border-border p-4 bg-muted/5 space-y-2">
              {/* Voice simulator recording warning banner */}
              {isRecording && (
                <div className="flex items-center gap-2 bg-[#FF7B00]/10 border border-[#FF7B00]/30 rounded-lg p-2 text-xs text-[#FF7B00] animate-pulse">
                  <Mic className="w-4 h-4 text-rose-500 animate-bounce" />
                  Recording microphone transcription buffer... (Auto-submits prompt on tap stop)
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAttachmentTrigger}
                  className="p-2.5 bg-white dark:bg-[#0B0F19] border border-border hover:bg-muted text-slate-600 dark:text-slate-350 rounded-xl transition-all"
                  title="Attach file to chat"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>

                <button
                  type="button"
                  onClick={handleVoiceTrigger}
                  className={`p-2.5 border rounded-xl transition-all ${
                    isRecording
                      ? 'bg-rose-500 border-rose-500 text-white animate-pulse'
                      : 'bg-white dark:bg-[#0B0F19] border-border hover:bg-muted text-slate-600 dark:text-slate-350'
                  }`}
                  title="Voice mic input"
                >
                  <Mic className="w-4.5 h-4.5" />
                </button>

                <input
                  type="text"
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                  placeholder="Ask about Framing completion date, cost order CO-02 impact..."
                  className="flex-1 bg-white dark:bg-[#0B0F19] border border-border rounded-xl text-xs px-4 focus:ring-1 focus:ring-[#FF7B00] focus:outline-none"
                />

                <button
                  type="submit"
                  className="p-2.5 bg-[#FF7B00] hover:bg-[#FF7B00]/90 text-white rounded-xl transition-all"
                >
                  <Play className="w-4.5 h-4.5 fill-current" />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* 4. FOOTER NOTE */}
      <footer className="text-center pt-8 border-t border-border/60">
        <p className="text-[10px] text-muted-foreground font-mono">
          BuildSpace Client Gateway Portal. Secured endpoints verified by standard GAAP/OSHA specifications.
        </p>
      </footer>
    </div>
  )
}
