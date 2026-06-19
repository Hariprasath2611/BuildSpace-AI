import React, { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Layers,
  Activity,
  AlertTriangle,
  Users,
  HardHat,
  CloudSun,
  FileText,
  Send,
  Plus,
  Trash2,
  FileDown,
  ArrowRight,
  Mic,
  Camera,
  Download,
  Search,
  Filter,
  Check,
  X
} from 'lucide-react'

// Import Zustand stores using @ alias
import { useProjectStore } from '@/store/projectStore'
import { useMaterialStore } from '@/store/materialStore'
import { useWorkOrderStore, type WorkOrder } from '@/store/workOrderStore'
import { useEquipmentStore } from '@/store/equipmentStore'
import { useQualityStore } from '@/store/qualityStore'
import { useMeetingStore } from '@/store/meetingStore'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'

export default function ContractorPortal() {
  const currentOrgId = useAuthStore((state) => state.currentOrgId)

  // Zustand Store states
  const projects = useProjectStore((state) => state.projects)
  const materials = useMaterialStore((state) => state.materials)
  const workOrders = useWorkOrderStore((state) => state.workOrders)
  const addWorkOrder = useWorkOrderStore((state) => state.addWorkOrder)
  const updateWorkOrder = useWorkOrderStore((state) => state.updateWorkOrder)
  const deleteWorkOrder = useWorkOrderStore((state) => state.deleteWorkOrder)
  
  const equipment = useEquipmentStore((state) => state.equipment)
  const reservations = useEquipmentStore((state) => state.reservations)
  const addReservation = useEquipmentStore((state) => state.addReservation)
  const addFuelLog = useEquipmentStore((state) => state.addFuelLog)

  const checklists = useQualityStore((state) => state.checklists)
  const snags = useQualityStore((state) => state.snags)
  const addSnag = useQualityStore((state) => state.addSnag)

  const channels = useChatStore((state) => state.channels)
  const messages = useChatStore((state) => state.messages)
  const activeChannelId = useChatStore((state) => state.activeChannelId)
  const setActiveChannel = useChatStore((state) => state.setActiveChannel)
  const sendMessage = useChatStore((state) => state.sendMessage)

  // Local navigation tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workorders' | 'equipment' | 'labor' | 'procurement' | 'quality' | 'daily' | 'ai'>('dashboard')

  // Search & Filter local states
  const [woSearchQuery, setWoSearchQuery] = useState('')
  const [woPriorityFilter, setWoPriorityFilter] = useState<'All' | 'Low' | 'Medium' | 'High' | 'Critical'>('All')

  // Form states
  const [showAddWoModal, setShowAddWoModal] = useState(false)
  const [newWoTitle, setNewWoTitle] = useState('')
  const [newWoDesc, setNewWoDesc] = useState('')
  const [newWoPriority, setNewWoPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium')
  const [newWoDueDate, setNewWoDueDate] = useState('2026-06-25')
  const [newWoAssignee, setNewWoAssignee] = useState('Steel-Fixing Team B')

  // Equipment reservation states
  const [eqIdToReserve, setEqIdToReserve] = useState('')
  const [resCrew, setResCrew] = useState('')
  const [resStart, setResStart] = useState('2026-06-20')
  const [resEnd, setResEnd] = useState('2026-06-25')

  // Equipment fuel log states
  const [fuelEqId, setFuelEqId] = useState('')
  const [fuelGallons, setFuelGallons] = useState('')
  const [fuelCost, setFuelCost] = useState('')
  const [fuelOdo, setFuelOdo] = useState('')

  // Subcontractor compliance states
  const [subcontractorList] = useState([
    { name: "Apex Earthworks Ltd", trade: "Excavation", crewsCount: 14, compliance: "Valid", coisExpiry: "2027-01-15", rating: 4.8 },
    { name: "Steel-Fixing Solutions B.V.", trade: "Rebar Reinforcement", crewsCount: 8, compliance: "Valid", coisExpiry: "2026-12-05", rating: 4.6 },
    { name: "BrightWire Contractors Inc", trade: "Electrical Infrastructure", crewsCount: 5, compliance: "Warning (COI expires soon)", coisExpiry: "2026-07-02", rating: 4.2 },
    { name: "QuickPour Concrete Supply", trade: "Structural Pouring", crewsCount: 12, compliance: "Valid", coisExpiry: "2026-11-20", rating: 4.9 }
  ])

  // floorplan snag states
  const drawingRef = useRef<HTMLDivElement>(null)
  const [defectTitle, setDefectTitle] = useState('')
  const [defectDesc, setDefectDesc] = useState('')
  const [defectPriority, setDefectPriority] = useState<'Low' | 'Medium' | 'High'>('High')
  const [defectCoords, setDefectCoords] = useState<{ x: number; y: number } | null>(null)

  // Daily progress log states
  const [logNotes, setLogNotes] = useState('')
  const [weatherStatus, setWeatherStatus] = useState<'Optimal' | 'Rain Delay' | 'Wind Restriction'>('Optimal')
  const [dailyLogs, setDailyLogs] = useState<Array<{ id: string; date: string; weather: string; logs: string; status: string }>>([
    { id: "d-1", date: "2026-06-18", weather: "Sunny, 28°C, Wind 8 kts", logs: "Earthworks completed for main vault. Commenced rebar tying for columns.", status: "Verified" },
    { id: "d-2", date: "2026-06-17", weather: "Showers, 22°C, Wind 14 kts", logs: "Rain delay of 2.5 hours. Covered structural steel beds. Resumed slab grading.", status: "Verified" }
  ])

  // Chat message state
  const [chatMessageText, setChatMessageText] = useState('')

  // AI Copilot state
  const [aiChatPrompt, setAiChatPrompt] = useState('')
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ role: 'user' | 'assistant'; text: string; action?: { label: string; actionText: string } }>>([
    {
      role: 'assistant',
      text: "Hello, Superintendent. I am your Contractor Copilot. I can forecast weather delays, query material lists, suggest safety replacements, and draft daily log briefs. What operational detail should we look at?"
    }
  ])
  const [isAiProcessing, setIsAiProcessing] = useState(false)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)

  // Calculations for dashboard
  const activeProject = projects[0] || { name: 'Downtown Plaza', budget: '$45.2M', progress: 78 }
  const totalOpenWorkOrders = workOrders.filter(w => w.status !== 'Completed').length
  const totalCompletedWorkOrders = workOrders.filter(w => w.status === 'Completed').length
  const blockedWorkOrders = workOrders.filter(w => w.status === 'Blocked')
  
  // Custom SVG Chart Data
  const budgetCodes = [
    { code: "02-Site Prep", budgeted: 150000, actual: 138000, color: "#f59e0b" },
    { code: "03-Concrete", budgeted: 420000, actual: 395000, color: "#3b82f6" },
    { code: "05-Steel Work", budgeted: 680000, actual: 520000, color: "#10b981" },
    { code: "26-Electrical", budgeted: 280000, actual: 198000, color: "#8b5cf6" }
  ]

  const maxBudgeted = Math.max(...budgetCodes.map(b => b.budgeted))

  // Work Order Filters
  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter((wo) => {
      const matchSearch = wo.title.toLowerCase().includes(woSearchQuery.toLowerCase()) || 
                          wo.description.toLowerCase().includes(woSearchQuery.toLowerCase())
      const matchPriority = woPriorityFilter === 'All' || wo.priority === woPriorityFilter
      return matchSearch && matchPriority
    })
  }, [workOrders, woSearchQuery, woPriorityFilter])

  // Handle Work Order Status Change Simulation (Kanban columns click toggle)
  const handleMoveWo = (id: string, newStatus: WorkOrder['status']) => {
    updateWorkOrder(id, { status: newStatus })
  }

  // Work Order Submit
  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWoTitle.trim()) return

    addWorkOrder({
      projectId: "proj-1",
      title: newWoTitle,
      description: newWoDesc,
      status: "Scheduled",
      priority: newWoPriority,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: newWoDueDate,
      progress: 0,
      assigneeId: `crew-${Date.now()}`,
      assigneeName: newWoAssignee,
      dependencies: [],
      attachments: []
    })

    setNewWoTitle('')
    setNewWoDesc('')
    setShowAddWoModal(false)
  }

  // Equipment reservation submit
  const handleReserveEquipment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!eqIdToReserve || !resCrew) return
    const item = equipment.find(e => e.id === eqIdToReserve)
    if (!item) return

    addReservation({
      equipmentId: eqIdToReserve,
      equipmentName: item.name,
      projectId: "proj-1",
      projectName: "Downtown Plaza Site",
      crewName: resCrew,
      startDate: resStart,
      endDate: resEnd
    })

    setResCrew('')
  }

  // Equipment fuel logs submit
  const handleAddFuelLog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fuelEqId || !fuelGallons || !fuelCost) return
    const item = equipment.find(eq => eq.id === fuelEqId)
    if (!item) return

    addFuelLog({
      equipmentId: fuelEqId,
      equipmentName: item.name,
      date: new Date().toISOString().split('T')[0],
      gallons: parseFloat(fuelGallons),
      cost: parseFloat(fuelCost),
      odometerHours: parseInt(fuelOdo) || 0
    })

    setFuelGallons('')
    setFuelCost('')
    setFuelOdo('')
  }

  // Drawing canvas click handler
  const handleDrawingClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingRef.current) return
    const rect = drawingRef.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setDefectCoords({ x, y })
  }

  // Snag submission
  const handleCreateSnag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!defectTitle || !defectCoords) return

    addSnag({
      projectId: "proj-1",
      title: defectTitle,
      description: defectDesc,
      drawingName: "Level_1_Floorplan.pdf",
      x: defectCoords.x,
      y: defectCoords.y,
      status: "Open",
      priority: defectPriority,
      assignedTo: "Subcontractor Foreman",
      dueDate: "2026-06-25",
      comments: []
    })

    setDefectTitle('')
    setDefectDesc('')
    setDefectCoords(null)
  }

  // Daily log compile submit
  const handleAddDailyLog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!logNotes.trim()) return

    const newLogItem = {
      id: `d-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weather: weatherStatus === 'Optimal' ? "Optimal Sunny, 26°C" : weatherStatus === 'Rain Delay' ? "Wet weather delays" : "High winds restricting high lifts",
      logs: logNotes,
      status: "Draft"
    }

    setDailyLogs([newLogItem, ...dailyLogs])
    setLogNotes('')
  }

  // Compile daily log summary using simulated AI
  const handleAiDailySummarize = () => {
    setLogNotes("AI Compiled Site Brief: Completed steel mesh grid placement for Column B3. Excavation teams signed off foundations. 1 hour weather downtime noted due to afternoon showers. Minor defect log SN-4 added regarding ground slab void. Total active labor crew: 27 workers.")
  }

  // Chat message submit
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessageText.trim()) return

    sendMessage(
      activeChannelId,
      chatMessageText,
      { id: "u-gc", name: "Superintendent Robert", role: "General Contractor" }
    )

    setChatMessageText('')
  }

  // AI Copilot prompt submit
  const handleAiCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiChatPrompt.trim()) return

    const userPrompt = aiChatPrompt
    const updatedLogs = [...aiChatLogs, { role: 'user' as const, text: userPrompt }]
    setAiChatLogs(updatedLogs)
    setAiChatPrompt('')
    setIsAiProcessing(true)

    setTimeout(() => {
      let responseText = ""
      let actionObj: { label: string; actionText: string } | undefined

      const promptLower = userPrompt.toLowerCase()
      if (promptLower.includes("weather") || promptLower.includes("rain") || promptLower.includes("wind")) {
        responseText = "Based on local meteo feeds, we forecast a high probability of **rain precipitation between 2 PM and 5 PM tomorrow**. Suggest concrete pouring is adjusted to early morning shifts starting at 06:00 AM."
        actionObj = { label: "Reschedule Concrete Pour", actionText: "Shift Slab pour from 10:00 AM to 06:00 AM" }
      } else if (promptLower.includes("material") || promptLower.includes("cement") || promptLower.includes("rebar")) {
        responseText = "Current warehouse levels: Rebar stock has dropped to **9.5 tons**, which is below your safety minimum threshold of 10 tons. Suppliers are quoting a 3-day lead time."
        actionObj = { label: "Auto-order 5 tons of Rebar", actionText: "Create PO to Apex Steel Suppliers" }
      } else if (promptLower.includes("safety") || promptLower.includes("hazard")) {
        responseText = "Safety observation logged: 1 critical hazard remains unresolved regarding Column B4 honeycomb voids, posing a stress rating risk if loading commences. PPE inspections verify 100% hardhat compliance today."
      } else if (promptLower.includes("delay") || promptLower.includes("forecast")) {
        responseText = "Predictive Timeline Model: Foundation milestones are currently 1 day ahead of schedule. However, potential electrical rough-in conduit delays in Zone B could cause a **2-day drift** next week if not resolved by tomorrow."
      } else {
        responseText = "I have indexed the general specifications, BOQ ledger, and daily diaries. All concrete mix logs conform to the standard 4000 PSI requirements. Let me know if you would like me to compile the client-facing progress report."
      }

      setAiChatLogs((prev) => [...prev, { role: 'assistant' as const, text: responseText, action: actionObj }])
      setIsAiProcessing(false)
    }, 1500)
  }

  // Voice recording simulation
  const handleMicClick = () => {
    if (isRecordingAudio) {
      setIsRecordingAudio(false)
      setAiChatPrompt("Check material stock levels for steel rebar.")
    } else {
      setIsRecordingAudio(true)
      setTimeout(() => {
        setIsRecordingAudio(false)
        setAiChatPrompt("Check material stock levels for steel rebar.")
      }, 2500)
    }
  }

  return (
    <div className="space-y-6 text-left">
      {/* 1. Header Banner & Org indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1 animate-pulse-slow">
              <HardHat className="w-3 h-3" /> Field Operations Console
            </span>
            <span className="text-xs text-muted-foreground">• Workspace ID: {currentOrgId || 'org-gc-01'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight">Contractor Portal</h1>
          <p className="text-xs text-muted-foreground">Manage crew scheduling, material POs, heavy fleet telemetry, quality snag lists, and daily logs.</p>
        </div>

        {/* Tab Selector Controls */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl">
          {(['dashboard', 'workorders', 'equipment', 'labor', 'procurement', 'quality', 'daily', 'ai'] as const).map((tab) => {
            const label = tab.charAt(0).toUpperCase() + tab.slice(1)
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main tab components */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.18 }}
          className="space-y-6"
        >
          {/* TAB 1: OPERATIONS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Telemetry Widgets Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-4 shadow-raised flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Active Task Progress</span>
                    <span className="text-lg font-extrabold text-slate-800 dark:text-white">{activeProject.progress}% Done</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-4 shadow-raised flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Pending Work Orders</span>
                    <span className="text-lg font-extrabold text-slate-800 dark:text-white">{totalOpenWorkOrders} Open</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-4 shadow-raised flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Crew Attendance</span>
                    <span className="text-lg font-extrabold text-slate-800 dark:text-white">27 Active Workers</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-4 shadow-raised flex items-center gap-3">
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Safety Alerts</span>
                    <span className="text-lg font-extrabold text-slate-800 dark:text-white">1 Open Observation</span>
                  </div>
                </div>
              </div>

              {/* Weather Warn & AI briefing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-[#1b2238] to-[#121727] border border-amber-500/20 rounded-2xl p-5 shadow-floating relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="w-36 h-36 text-amber-400" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">AI Superintendent Daily Briefing</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-2">Downtown Plaza Site Operations</h3>
                  <p className="text-xs text-slate-350 leading-relaxed mb-4">
                    Good morning, Superintendent. Structural Steel placement is currently 75% complete. Excavation sign-off is finished. Rebar tying is underway. Weather feeds indicate high probability of rain showers between 2 PM and 5 PM tomorrow, which might cause concrete pour delays. 
                    We recommend ordering 5 tons of steel rebar since inventory has dropped to 9.5 tons.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab('ai')}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold uppercase rounded-lg shadow transition-all flex items-center gap-1.5"
                    >
                      Ask Copilot <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleAiDailySummarize}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold uppercase rounded-lg border border-slate-700 transition-all"
                    >
                      Pre-fill Daily Progress Log
                    </button>
                  </div>
                </div>

                {/* Weather widget */}
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised flex flex-col justify-between text-left">
                  <div>
                    <div className="flex justify-between items-start border-b border-border pb-3 mb-3">
                      <span className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white">Site Conditions</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-bold rounded">Optimal</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <CloudSun className="w-10 h-10 text-amber-500" />
                      <div>
                        <span className="text-2xl font-extrabold">26°C</span>
                        <span className="text-xs text-muted-foreground block">San Jose, CA • Clear Sky</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border space-y-2 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Wind speed</span>
                      <span className="font-semibold text-slate-800 dark:text-white">12 kts (Safe)</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Humidity</span>
                      <span className="font-semibold text-slate-800 dark:text-white">45%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget codes comparison charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                  <div className="border-b border-border pb-3 mb-4">
                    <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">Project Cost Code Variance (Actual vs. Budget)</h3>
                  </div>
                  {/* Custom SVG bars */}
                  <div className="space-y-4">
                    {budgetCodes.map((code) => {
                      const budgetedPercent = 100
                      const actualPercent = (code.actual / code.budgeted) * 100
                      return (
                        <div key={code.code} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{code.code}</span>
                            <span className="text-muted-foreground">
                              Actual: <strong className="text-slate-800 dark:text-white">${(code.actual / 1000).toFixed(0)}k</strong> / Budget: ${code.budgeted / 1000}k
                            </span>
                          </div>
                          {/* Outer container */}
                          <div className="h-3 w-full bg-muted dark:bg-slate-800 rounded-full overflow-hidden relative">
                            {/* Budget background line bar */}
                            <div className="h-full absolute top-0 left-0 bg-slate-400 dark:bg-slate-650 opacity-20" style={{ width: '100%' }}></div>
                            {/* Actual cost fill bar */}
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${actualPercent}%`,
                                backgroundColor: code.color
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Subcontractor compliance */}
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                  <div className="border-b border-border pb-3 mb-3 flex justify-between items-center">
                    <span className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white">Subcontractor Status</span>
                    <button onClick={() => setActiveTab('labor')} className="text-amber-500 hover:underline text-[10px] font-bold uppercase">View all</button>
                  </div>
                  <div className="divide-y divide-border">
                    {subcontractorList.slice(0, 3).map((sub, i) => (
                      <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-white block">{sub.name}</span>
                          <span className="text-[10px] text-muted-foreground">{sub.trade} • {sub.crewsCount} crew</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          sub.compliance === 'Valid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {sub.compliance === 'Valid' ? 'Compliant' : 'Warning'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORK ORDERS */}
          {activeTab === 'workorders' && (
            <div className="space-y-6">
              {/* Filter / Search bars */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-4 shadow-raised flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search work orders..."
                    value={woSearchQuery}
                    onChange={(e) => setWoSearchQuery(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-xs">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Priority:</span>
                    <select
                      value={woPriorityFilter}
                      onChange={(e) => setWoPriorityFilter(e.target.value as any)}
                      className="bg-muted dark:bg-slate-800 border border-border rounded-lg p-1.5 text-xs text-foreground focus:outline-none"
                    >
                      <option value="All">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setShowAddWoModal(true)}
                    className="ml-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Create Work Order
                  </button>
                </div>
              </div>

              {/* Work Order Modal */}
              {showAddWoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
                  >
                    <button
                      onClick={() => setShowAddWoModal(false)}
                      className="absolute top-4 right-4 p-1 hover:bg-muted dark:hover:bg-slate-850 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-4">Create New Work Order</h3>
                    <form onSubmit={handleCreateWorkOrder} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-muted-foreground mb-1">Work Order Title</label>
                        <input
                          type="text"
                          required
                          value={newWoTitle}
                          onChange={(e) => setNewWoTitle(e.target.value)}
                          placeholder="e.g. Excavate sector D foundation beds"
                          className="w-full bg-muted/50 border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-muted-foreground mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={newWoDesc}
                          onChange={(e) => setNewWoDesc(e.target.value)}
                          placeholder="Provide structural, excavation or electrical specs..."
                          className="w-full bg-muted/50 border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-muted-foreground mb-1">Priority</label>
                          <select
                            value={newWoPriority}
                            onChange={(e) => setNewWoPriority(e.target.value as any)}
                            className="w-full bg-muted/50 border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-muted-foreground mb-1">Due Date</label>
                          <input
                            type="date"
                            value={newWoDueDate}
                            onChange={(e) => setNewWoDueDate(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-muted-foreground mb-1">Assign Crew</label>
                        <select
                          value={newWoAssignee}
                          onChange={(e) => setNewWoAssignee(e.target.value)}
                          className="w-full bg-muted/50 border border-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                        >
                          <option value="Steel-Fixing Team B">Steel-Fixing Team B</option>
                          <option value="Apex Earthworks Crew">Apex Earthworks Crew</option>
                          <option value="BrightWire Subcontractors">BrightWire Subcontractors</option>
                          <option value="Concrete Masonry Crew A">Concrete Masonry Crew A</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow transition-all"
                      >
                        Add Work Order to Scheduled
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}

              {/* Kanban Column View */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {(['Backlog', 'Scheduled', 'In Progress', 'Blocked', 'Completed'] as const).map((col) => {
                  const columnOrders = filteredWorkOrders.filter(w => w.status === col)
                  return (
                    <div key={col} className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-4 shadow-raised flex flex-col min-h-120">
                      <div className="flex justify-between items-center border-b border-border pb-2 mb-3">
                        <span className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white">{col}</span>
                        <span className="px-2 py-0.5 bg-muted dark:bg-slate-800 text-[10px] font-bold rounded-full">{columnOrders.length}</span>
                      </div>

                      <div className="flex-1 space-y-3 overflow-y-auto">
                        {columnOrders.map((wo) => (
                          <div
                            key={wo.id}
                            className="bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl p-3 text-left space-y-2 group hover:border-amber-500/50 transition-colors relative"
                          >
                            <div className="flex justify-between items-start">
                              <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full ${
                                wo.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' :
                                wo.priority === 'High' ? 'bg-amber-500/10 text-amber-500' :
                                wo.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-slate-500/10 text-slate-500'
                              }`}>
                                {wo.priority}
                              </span>
                              
                              <button
                                onClick={() => deleteWorkOrder(wo.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-450 hover:text-red-500 transition-opacity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="font-bold text-xs text-slate-800 dark:text-white block leading-tight">{wo.title}</span>
                            <p className="text-[10px] text-muted-foreground line-clamp-2">{wo.description}</p>
                            
                            <div className="text-[9px] text-muted-foreground space-y-1">
                              <div>📅 Due: {wo.dueDate}</div>
                              <div>👷 Assignee: {wo.assigneeName}</div>
                            </div>

                            {/* Status Quick Movers */}
                            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                              <select
                                value={wo.status}
                                onChange={(e) => handleMoveWo(wo.id, e.target.value as any)}
                                className="bg-white dark:bg-slate-800 border border-border rounded p-0.5 text-[9px] text-muted-foreground focus:outline-none"
                              >
                                <option value="Backlog">Backlog</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Blocked">Blocked</option>
                                <option value="Completed">Completed</option>
                              </select>

                              {wo.progress > 0 && (
                                <span className="text-[9px] font-bold text-amber-500">{wo.progress}%</span>
                              )}
                            </div>
                          </div>
                        ))}

                        {columnOrders.length === 0 && (
                          <div className="py-8 text-center text-[10px] text-muted-foreground italic border border-dashed border-border/60 rounded-xl">
                            Empty
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 3: EQUIPMENT */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Equipment List */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                    <div className="border-b border-border pb-3 mb-4 flex justify-between items-center">
                      <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">Machinery Telemetry & Status</h3>
                      <span className="text-[10px] text-muted-foreground">4 machinery items registered</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {equipment.map((eq) => (
                        <div key={eq.id} className="bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl p-4 text-left space-y-3 relative group">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-xs text-slate-800 dark:text-white block">{eq.name}</span>
                              <span className="text-[10px] text-muted-foreground">{eq.modelNum} • {eq.type}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              eq.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' :
                              eq.status === 'In Use' ? 'bg-blue-500/10 text-blue-500' :
                              eq.status === 'Under Maintenance' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-rose-500/10 text-rose-500'
                            }`}>
                              {eq.status}
                            </span>
                          </div>

                          <div className="text-[10px] space-y-1.5 pt-2 border-t border-border/60">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Operational Cost:</span>
                              <span className="font-bold">${eq.hourlyRate}/hr</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Fuel Rate:</span>
                              <span className="font-bold">{eq.fuelRate} gal/hr</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Assigned operator:</span>
                              <span className="font-bold">{eq.operatorName}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Reservations Calendar Grid */}
                  <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                    <div className="border-b border-border pb-3 mb-4">
                      <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">Upcoming Equipment Bookings</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground font-semibold">
                            <th className="pb-2">Equipment</th>
                            <th className="pb-2">Reserve Crew</th>
                            <th className="pb-2">Start Date</th>
                            <th className="pb-2">End Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {reservations.map((res) => (
                            <tr key={res.id} className="hover:bg-muted/35">
                              <td className="py-2.5 font-semibold text-slate-850 dark:text-slate-250">{res.equipmentName}</td>
                              <td className="py-2.5">{res.crewName}</td>
                              <td className="py-2.5">{res.startDate}</td>
                              <td className="py-2.5">{res.endDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Reservation / Fuel logging form side column */}
                <div className="space-y-6">
                  {/* Reservation Booking form */}
                  <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                    <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white mb-3">Book Reservation</h4>
                    <form onSubmit={handleReserveEquipment} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-muted-foreground font-bold mb-1">Select Machinery</label>
                        <select
                          value={eqIdToReserve}
                          onChange={(e) => setEqIdToReserve(e.target.value)}
                          className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                          required
                        >
                          <option value="">-- Choose Equipment --</option>
                          {equipment.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-muted-foreground font-bold mb-1">Requesting Crew</label>
                        <input
                          type="text"
                          required
                          value={resCrew}
                          onChange={(e) => setResCrew(e.target.value)}
                          placeholder="e.g. Framing Team C"
                          className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Start Date</label>
                          <input
                            type="date"
                            value={resStart}
                            onChange={(e) => setResStart(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">End Date</label>
                          <input
                            type="date"
                            value={resEnd}
                            onChange={(e) => setResEnd(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow transition-all"
                      >
                        Submit Reservation Request
                      </button>
                    </form>
                  </div>

                  {/* Fuel cost logger */}
                  <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                    <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white mb-3">Log Fuel Refill</h4>
                    <form onSubmit={handleAddFuelLog} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-muted-foreground font-bold mb-1">Select Machinery</label>
                        <select
                          value={fuelEqId}
                          onChange={(e) => setFuelEqId(e.target.value)}
                          className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                          required
                        >
                          <option value="">-- Choose Equipment --</option>
                          {equipment.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Gallons</label>
                          <input
                            type="number"
                            required
                            value={fuelGallons}
                            onChange={(e) => setFuelGallons(e.target.value)}
                            placeholder="35.5"
                            className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Total Cost ($)</label>
                          <input
                            type="number"
                            required
                            value={fuelCost}
                            onChange={(e) => setFuelCost(e.target.value)}
                            placeholder="145"
                            className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-muted-foreground font-bold mb-1">Engine Odometer Hours</label>
                        <input
                          type="number"
                          value={fuelOdo}
                          onChange={(e) => setFuelOdo(e.target.value)}
                          placeholder="1245"
                          className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-white rounded-xl shadow transition-all"
                      >
                        Submit Fuel slip Entry
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LABOR & SUBS */}
          {activeTab === 'labor' && (
            <div className="space-y-6">
              {/* GPS tracked worker map coordinates & Organisation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                  <div className="border-b border-border pb-3 mb-4 flex justify-between items-center">
                    <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">Site Geofenced Workforce Coordinates</h3>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded">Geofence Active</span>
                  </div>

                  {/* SVG Geofence map */}
                  <div className="w-full h-80 bg-muted/40 dark:bg-slate-900/40 rounded-xl relative overflow-hidden border border-border flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full text-slate-300 dark:text-slate-700" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      {/* Geofence polygon limit */}
                      <polygon points="100,50 350,70 420,220 180,260 80,180" fill="rgba(245, 158, 11, 0.05)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
                      {/* Excavator zone circle */}
                      <circle cx="210" cy="140" r="45" fill="rgba(59, 130, 246, 0.06)" stroke="#3b82f6" strokeWidth="1" />
                      {/* Crane placements */}
                      <circle cx="340" cy="110" r="30" fill="rgba(244, 63, 94, 0.06)" stroke="#f43f5e" strokeWidth="1" />
                    </svg>

                    {/* Geofenced Dots overlay */}
                    <div className="absolute top-[80px] left-[150px] group cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white animate-pulse"></div>
                      <span className="hidden group-hover:block absolute bg-slate-950 text-white text-[9px] p-1 rounded whitespace-nowrap z-10">M. Vance (Excavator)</span>
                    </div>

                    <div className="absolute top-[200px] left-[220px] group cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
                      <span className="hidden group-hover:block absolute bg-slate-950 text-white text-[9px] p-1 rounded whitespace-nowrap z-10">S. Connor (Steel Fix)</span>
                    </div>

                    <div className="absolute top-[160px] left-[320px] group cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
                      <span className="hidden group-hover:block absolute bg-slate-950 text-white text-[9px] p-1 rounded whitespace-nowrap z-10">T. Brady (Electrical)</span>
                    </div>

                    <div className="absolute top-[120px] left-[350px] group cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
                      <span className="hidden group-hover:block absolute bg-slate-950 text-white text-[9px] p-1 rounded whitespace-nowrap z-10">K. Thompson (Concrete)</span>
                    </div>

                    {/* Offgeofence Alert dot */}
                    <div className="absolute top-[210px] left-[430px] group cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-rose-500 border border-white animate-bounce"></div>
                      <span className="absolute bg-rose-950 text-rose-100 text-[8px] px-1 py-0.5 rounded whitespace-nowrap z-10">OUT OF BOUNDS: Driver</span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-[10px] p-2 rounded border border-border flex flex-col gap-1">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Inside Site Boundary</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Out of Geofence (Alert)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Heavy Machinery Radio</div>
                    </div>
                  </div>
                </div>

                {/* Subcontractor scorecard list */}
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left flex flex-col justify-between">
                  <div>
                    <div className="border-b border-border pb-3 mb-4">
                      <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">Subcontractor Register</h3>
                    </div>

                    <div className="space-y-4">
                      {subcontractorList.map((sub, i) => (
                        <div key={i} className="border-b border-border/60 pb-3 last:border-b-0 last:pb-0 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-850 dark:text-slate-200">{sub.name}</span>
                            <span className="text-amber-500">★ {sub.rating}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                            <span>{sub.trade}</span>
                            <span>COI Expires: {sub.coisExpiry}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border mt-4">
                    <button className="w-full py-2 bg-muted text-slate-800 dark:text-slate-200 border border-border text-xs font-bold rounded-xl hover:bg-muted/80 transition-all flex items-center justify-center gap-1">
                      <FileDown className="w-4 h-4" /> Export Timesheets to Sage CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROCUREMENT & MATERIALS */}
          {activeTab === 'procurement' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                  <div className="border-b border-border pb-3 mb-4">
                    <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">Inventory Stocks & Material Consumption</h3>
                  </div>

                  <div className="space-y-4.5">
                    {materials.slice(0, 4).map((m) => {
                      const percentage = Math.min((m.currentStock / m.maxStock) * 100, 100)
                      return (
                        <div key={m.id} className="space-y-1 text-xs">
                          <div className="flex justify-between items-center font-semibold">
                            <span className="text-slate-850 dark:text-slate-250">{m.name} ({m.sku})</span>
                            <div className="space-x-2">
                              <span className="text-muted-foreground">Stock: {m.currentStock} / {m.maxStock} {m.unit}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                m.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-500' :
                                m.status === 'Warning' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-rose-500/10 text-rose-500'
                              }`}>
                                {m.status}
                              </span>
                            </div>
                          </div>
                          <div className="h-2 w-full bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                m.status === 'Optimal' ? 'bg-emerald-500' :
                                m.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* RFQ and Purchase Order trigger form */}
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                  <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white mb-3">Material Procurement RFQ</h4>
                  <p className="text-[11px] text-muted-foreground mb-3">Instantly compare quotes from multiple suppliers and generate PO draft approvals.</p>
                  
                  <div className="space-y-3.5 text-xs">
                    <div className="p-3 bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl space-y-2">
                      <div className="flex justify-between font-bold">
                        <span>Steel Rebar Quote</span>
                        <span className="text-emerald-500">$950 / ton</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground space-y-1">
                        <div>Supplier: Apex Metals Ltd</div>
                        <div>Shipping ETA: 3 Days</div>
                        <div>On-time rate: 98%</div>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl space-y-2 opacity-60">
                      <div className="flex justify-between font-bold">
                        <span>Steel Rebar Quote B</span>
                        <span className="text-amber-500">$1,050 / ton</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground space-y-1">
                        <div>Supplier: Global Ironworks Corp</div>
                        <div>Shipping ETA: 2 Days</div>
                        <div>On-time rate: 94%</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        alert("Purchase Order Draft PO-2026-104 generated for Apex Metals Ltd. Sent to client portal for approval.")
                      }}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow transition-all text-xs"
                    >
                      Authorize PO (Apex Metals)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SAFETY & QUALITY QC */}
          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2D Blueprint Floorplan and Tagging */}
                <div className="lg:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left space-y-4">
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">Interactive Blueprint Defect Tagging</h3>
                    <p className="text-[11px] text-muted-foreground">Click anywhere on the building floorplan drawing to place a defect snag pin, then submit the details below.</p>
                  </div>

                  <div
                    ref={drawingRef}
                    onClick={handleDrawingClick}
                    className="w-full h-96 bg-slate-900 border border-slate-700 rounded-xl relative overflow-hidden flex items-center justify-center cursor-crosshair group"
                  >
                    {/* Architectural grid simulation */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                    {/* Simulated wall outline paths */}
                    <svg className="absolute inset-0 w-full h-full text-blue-500 opacity-60" xmlns="http://www.w3.org/2000/svg">
                      <rect x="50" y="50" width="300" height="200" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="200" y1="50" x2="200" y2="250" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="50" y1="150" x2="350" y2="150" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="400" y="80" width="200" height="150" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>

                    {/* Extant Snag Pins */}
                    {snags.map((sn) => (
                      <div
                        key={sn.id}
                        className="absolute group/pin"
                        style={{ left: `${sn.x}%`, top: `${sn.y}%` }}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] text-white font-extrabold border border-white cursor-pointer ${
                          sn.status === 'Resolved' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
                        }`}>
                          !
                        </div>
                        {/* Hover card */}
                        <div className="hidden group-hover/pin:block absolute top-4 left-4 bg-slate-950 text-white text-[9px] p-2 rounded-lg border border-border shadow-2xl z-20 w-44 space-y-1">
                          <span className="font-bold block leading-tight">{sn.title}</span>
                          <span className="text-slate-400 block">{sn.description}</span>
                          <span className="text-slate-400 block">Assigned: {sn.assignedTo}</span>
                          <span className="text-amber-400 font-bold block">{sn.status}</span>
                        </div>
                      </div>
                    ))}

                    {/* Pending Click Coords indicator */}
                    {defectCoords && (
                      <div
                        className="absolute w-4 h-4 rounded-full bg-amber-500 border border-white animate-ping"
                        style={{ left: `${defectCoords.x}%`, top: `${defectCoords.y}%` }}
                      ></div>
                    )}

                    <div className="absolute top-2 right-2 bg-slate-950/80 text-[10px] p-2 rounded border border-border space-y-1">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Active QC Snag</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved Check</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Click coordinates indicator</div>
                    </div>
                  </div>
                </div>

                {/* Checklist Inspection Form Side Column */}
                <div className="space-y-6">
                  {defectCoords ? (
                    <div className="bg-white dark:bg-[#141B2D] border border-amber-500 rounded-2xl p-5 shadow-raised text-left animate-fade-in">
                      <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> Log Snag Defect
                      </h4>
                      <p className="text-[10px] text-muted-foreground mb-3">Defect location: X: {defectCoords.x}%, Y: {defectCoords.y}% on floorplan drawing.</p>
                      
                      <form onSubmit={handleCreateSnag} className="space-y-3.5 text-xs">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Issue Title</label>
                          <input
                            type="text"
                            required
                            value={defectTitle}
                            onChange={(e) => setDefectTitle(e.target.value)}
                            placeholder="e.g. Concrete honeycomb columns voids"
                            className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={defectDesc}
                            onChange={(e) => setDefectDesc(e.target.value)}
                            placeholder="Describe severity, required remediation..."
                            className="w-full bg-muted/50 border border-border rounded-xl p-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Priority</label>
                          <select
                            value={defectPriority}
                            onChange={(e) => setDefectPriority(e.target.value as any)}
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
                            className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow transition-all"
                          >
                            Log Snag Tag
                          </button>
                          <button
                            type="button"
                            onClick={() => setDefectCoords(null)}
                            className="px-3 py-2 bg-muted border border-border rounded-xl hover:bg-muted/80"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                      <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white mb-3">Inspections Checklist</h4>
                      <div className="space-y-4">
                        {checklists.map((check) => (
                          <div key={check.id} className="p-3 bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-xs text-slate-800 dark:text-white leading-tight">{check.title}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                check.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {check.status}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {check.items.map((item) => (
                                <div key={item.id} className="flex items-start gap-1.5 text-[10px]">
                                  {item.checked ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                  ) : (
                                    <X className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                  )}
                                  <span className="text-slate-700 dark:text-slate-350">{item.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OSHA 5-Whys root cause form */}
                  <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left text-xs">
                    <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white mb-2">Safety Hazard RCA Auditing</h4>
                    <p className="text-[10px] text-muted-foreground mb-3">Conduct OSHA-compliant 5-Whys analysis on incidents to log systemic site preventions.</p>
                    <button
                      onClick={() => {
                        alert("OSHA 5-Whys Safety Auditor template ready inside Safety module details.")
                      }}
                      className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-white rounded-xl shadow transition-all"
                    >
                      Conduct OSHA Audit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DAILY PROGRESS LOG */}
          {activeTab === 'daily' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  {/* Daily logs entries catalog */}
                  <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                    <div className="border-b border-border pb-3 mb-4">
                      <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">Daily Field Journals</h3>
                    </div>

                    <div className="space-y-4">
                      {dailyLogs.map((log) => (
                        <div key={log.id} className="p-4 bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl text-xs space-y-2">
                          <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
                            <span className="font-bold text-slate-800 dark:text-white">{log.date}</span>
                            <div className="flex gap-2">
                              <span className="text-[10px] text-muted-foreground">{log.weather}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                log.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                              }`}>
                                {log.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{log.logs}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Drawings vault and versioning database */}
                  <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                    <div className="border-b border-border pb-3 mb-3 flex justify-between items-center">
                      <span className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white">Drawings Vault</span>
                      <span className="text-[10px] text-muted-foreground">3 blueprints verified</span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="p-2.5 border border-border rounded-xl hover:border-amber-500 transition-colors flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-500/10 text-blue-500 rounded">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-white block">Ground_Floor_Plan_v3.pdf</span>
                            <span className="text-[9px] text-muted-foreground">Architectural • Updated June 12 • 12.8 MB</span>
                          </div>
                        </div>
                        <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-2.5 border border-border rounded-xl hover:border-amber-500 transition-colors flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-500/10 text-blue-500 rounded">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-white block">Level_1_Electrical_v1.pdf</span>
                            <span className="text-[9px] text-muted-foreground">Electrical • Updated June 08 • 5.4 MB</span>
                          </div>
                        </div>
                        <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Log Submission Form */}
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
                  <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white mb-3">Record Daily Log</h4>
                  
                  <form onSubmit={handleAddDailyLog} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-muted-foreground font-bold mb-1">Weather Impact</label>
                      <select
                        value={weatherStatus}
                        onChange={(e) => setWeatherStatus(e.target.value as any)}
                        className="w-full bg-muted/50 border border-border rounded-xl p-2.5 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                      >
                        <option value="Optimal">Optimal (Clear / Overcast)</option>
                        <option value="Rain Delay">Rain Delay (Suspended concrete/earthworks)</option>
                        <option value="Wind Restriction">Wind Restriction (Crane lifts paused)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-muted-foreground font-bold">Activity Log Notes</label>
                        <button
                          type="button"
                          onClick={handleAiDailySummarize}
                          className="text-[10px] font-bold text-amber-500 hover:underline flex items-center gap-0.5"
                        >
                          <Sparkles className="w-3 h-3" /> Auto-compile notes
                        </button>
                      </div>
                      <textarea
                        rows={6}
                        required
                        value={logNotes}
                        onChange={(e) => setLogNotes(e.target.value)}
                        placeholder="Log active crew size, structural pour milestones, subcontractor handovers..."
                        className="w-full bg-muted/50 border border-border rounded-xl p-2.5 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow transition-all"
                    >
                      Save Daily Log Entry
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: AI CONTRACTOR COPILOT */}
          {activeTab === 'ai' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column Chat panel */}
              <div className="lg:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-floating flex flex-col h-140">
                <div className="border-b border-border pb-3 mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">AI Contractor Copilot</h3>
                      <span className="text-[10px] text-muted-foreground block">Trained on OSHA rules, site blueprints, and construction schedule logs</span>
                    </div>
                  </div>
                </div>

                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin text-xs">
                  {aiChatLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 max-w-[85%] ${log.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <div className={`p-2.5 rounded-2xl leading-relaxed text-[11px] ${
                        log.role === 'user'
                          ? 'bg-amber-500 text-slate-950 rounded-tr-none'
                          : 'bg-muted/65 dark:bg-slate-900/65 border border-border text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}>
                        <strong>{log.role === 'user' ? 'Superintendent' : 'Copilot'}:</strong>
                        <p className="mt-1">{log.text}</p>
                        
                        {log.action && (
                          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
                            <span className="text-[9px] uppercase font-bold text-amber-500">{log.action.label}</span>
                            <button
                              onClick={() => {
                                alert(`Executing suggestion: ${log.action?.actionText}`)
                              }}
                              className="px-2 py-1 bg-amber-500 text-slate-950 text-[9px] font-bold rounded hover:opacity-90 transition-opacity"
                            >
                              Execute Action
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isAiProcessing && (
                    <div className="flex gap-3 text-left">
                      <div className="p-2.5 bg-muted dark:bg-slate-900 border border-border rounded-2xl rounded-tl-none text-[11px] text-muted-foreground animate-pulse">
                        Copilot is scanning site manuals and weather forecasts...
                      </div>
                    </div>
                  )}
                </div>

                {/* Inputs prompt form */}
                <form onSubmit={handleAiCopilotSubmit} className="pt-3 border-t border-border flex gap-2 items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={aiChatPrompt}
                      onChange={(e) => setAiChatPrompt(e.target.value)}
                      placeholder="e.g. Will weather rain delay concrete pour tomorrow?"
                      className="w-full bg-muted/50 border border-border rounded-xl pl-3 pr-9 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
                    />
                    
                    {/* Microphone input simulation */}
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className={`absolute right-2 top-2 p-0.5 rounded transition-all ${
                        isRecordingAudio ? 'text-rose-500 animate-pulse bg-rose-500/10' : 'text-slate-400 hover:text-slate-250'
                      }`}
                      title={isRecordingAudio ? "Recording... (Click to stop)" : "Trigger Speech Commands"}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="p-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {isRecordingAudio && (
                  <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] rounded-lg flex items-center justify-between animate-pulse">
                    <span>🎙️ Listening for speech instructions... Say 'Check rebar stock'</span>
                    <div className="flex gap-0.5">
                      <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce"></span>
                      <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column copilot tools/predictions */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left space-y-4">
                  <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white">Predictive Delay Forecast</h4>
                  
                  {/* Custom delay forecast visualizer */}
                  <div className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Foundation Curing</span>
                        <span className="text-emerald-500">No Delay Risks</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '10%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Concrete Pouring Weather</span>
                        <span className="text-amber-500">Moderate Risk (Rain)</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '45%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Rebar Supply Inventory</span>
                        <span className="text-rose-500">High Risk (Low Stock)</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subcontractor scorecard comparison quick details */}
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left text-xs space-y-3">
                  <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white">Auto-matching Subcontractor recommendation</h4>
                  <p className="text-[11px] text-muted-foreground">If ironworkers face bottlenecks, AI suggesting alternative compliance-verified subcontractors in the region.</p>
                  
                  <div className="p-2.5 bg-muted/40 dark:bg-slate-900/40 border border-border rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 dark:text-white block">Apex Steel fixing (Alt Match)</span>
                    <span className="text-[10px] text-muted-foreground">Rating: ★ 4.9 • Verified COIs • Located 5 miles from site</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 2. Chat messaging side channel overlay drawer */}
      <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left">
          <div className="border-b border-border pb-3 mb-4 flex justify-between items-center">
            <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">Active Channel: {channels.find(c => c.id === activeChannelId)?.name || 'General Site Chat'}</h3>
            {/* Channel selectors dropdown */}
            <select
              value={activeChannelId}
              onChange={(e) => setActiveChannel(e.target.value)}
              className="bg-muted dark:bg-slate-800 border border-border rounded p-1 text-xs text-foreground focus:outline-none"
            >
              {channels.map(ch => (
                <option key={ch.id} value={ch.id}>{ch.name}</option>
              ))}
            </select>
          </div>

          {/* Message registry */}
          <div className="h-52 overflow-y-auto space-y-3.5 pr-2 text-xs scrollbar-thin mb-4">
            {messages.filter(m => m.channelId === activeChannelId).map((msg) => (
              <div key={msg.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-850 dark:text-slate-200">{msg.senderName}</span>
                    <span className="text-[9px] text-muted-foreground ml-2">({msg.senderRole})</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-350 bg-muted/20 dark:bg-slate-900/20 p-2 rounded-xl border border-border/50">{msg.message}</p>
                {msg.attachment && (
                  <div className="p-2 border border-dashed border-border rounded-lg flex items-center justify-between text-[10px] bg-muted/10">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{msg.attachment.name} ({msg.attachment.size})</span>
                    <a href={msg.attachment.url} className="text-amber-500 hover:underline">Download</a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Form message sender */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2 text-xs">
            <input
              type="text"
              value={chatMessageText}
              onChange={(e) => setChatMessageText(e.target.value)}
              placeholder="Send message to channel crews..."
              className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 text-slate-800 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow transition-all flex items-center gap-1"
            >
              Send <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Quick actions Panel right */}
        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left text-xs flex flex-col justify-between">
          <div>
            <h4 className="font-heading font-extrabold text-xs uppercase text-slate-800 dark:text-white mb-3">Field Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab('workorders')
                  setShowAddWoModal(true)
                }}
                className="w-full text-left p-2.5 rounded-xl bg-muted/40 dark:bg-slate-900/40 hover:bg-amber-500/10 border border-border hover:border-amber-500/30 transition-all font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-amber-500" /> Dispatch Work Order
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('quality')
                  setDefectCoords({ x: 50, y: 50 })
                }}
                className="w-full text-left p-2.5 rounded-xl bg-muted/40 dark:bg-slate-900/40 hover:bg-amber-500/10 border border-border hover:border-amber-500/30 transition-all font-semibold flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-amber-500" /> Log Quality Snag
              </button>

              <button
                onClick={() => {
                  setActiveTab('daily')
                  handleAiDailySummarize()
                }}
                className="w-full text-left p-2.5 rounded-xl bg-muted/40 dark:bg-slate-900/40 hover:bg-amber-500/10 border border-border hover:border-amber-500/30 transition-all font-semibold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Progress Summary
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 text-[10px] text-muted-foreground text-center">
            🔒 Field Encryption Enabled (AES-256)
          </div>
        </div>
      </div>
    </div>
  )
}
