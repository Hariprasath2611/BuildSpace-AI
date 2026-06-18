import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWorkforceStore } from '../store/workforceStore'
import {
  Plus,
  Search,
  ArrowRight,
  X,
  Grid,
  List,
  Sparkles,
  Users,
  UserCheck,
  ClipboardCheck,
  Activity,
  Map,
  Calendar,
  TrendingUp,
  ShieldAlert,
  DollarSign,
  Building,
  QrCode,
  FileText
} from 'lucide-react'

export default function Workforce() {
  // Zustand Store States & Actions
  const workers = useWorkforceStore((state) => state.workers)
  const attendance = useWorkforceStore((state) => state.attendance)
  const certifications = useWorkforceStore((state) => state.certifications)
  const subcontractors = useWorkforceStore((state) => state.subcontractors)
  const safetyViolations = useWorkforceStore((state) => state.safetyViolations)
  const gpsLocations = useWorkforceStore((state) => state.gpsLocations)
  const shifts = useWorkforceStore((state) => state.shifts)

  const onboardEmployee = useWorkforceStore((state) => state.onboardEmployee)
  const clockInWorker = useWorkforceStore((state) => state.clockInWorker)
  const logSafetyViolation = useWorkforceStore((state) => state.logSafetyViolation)
  const assignShift = useWorkforceStore((state) => state.assignShift)

  // Local Component Nav & Filter States
  const [activeSection, setActiveSection] = useState<'dashboard' | 'directory' | 'attendance' | 'shifts' | 'assignments' | 'tracking' | 'productivity' | 'safety' | 'payroll' | 'subcontractors'>('dashboard')
  const [search, setSearch] = useState("")
  const [selectedDept, setSelectedDept] = useState<string>("All")
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  
  // Modals & Wizards States
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false)
  const [isAssignShiftOpen, setIsAssignShiftOpen] = useState(false)

  // Form Field States
  // 1. Onboarding Wizard Form
  const [onboardName, setOnboardName] = useState("")
  const [onboardRole, setOnboardRole] = useState("")
  const [onboardDept, setOnboardDept] = useState("Structure")
  const [onboardType, setOnboardType] = useState<'Direct' | 'Subcontractor' | 'Hourly'>('Direct')
  const [onboardSkills, setOnboardSkills] = useState("")
  const [onboardAlloc, setOnboardAlloc] = useState("")
  // 2. Safety Violation Form
  const [safetyLoc, setSafetyLoc] = useState("Site Gate B")
  const [safetyHazard, setSafetyHazard] = useState("")
  const [safetyCrew, setSafetyCrew] = useState("Apex Masonry")
  const [safetySeverity, setSafetySeverity] = useState<'Minor' | 'Major' | 'Critical'>('Major')
  // 3. Shift Planner Form
  const [selectedWorkerId, setSelectedWorkerId] = useState("")
  const [shiftDay, setShiftDay] = useState("Mon")
  const [shiftType, setShiftType] = useState<'Day Shift' | 'Night Shift' | 'Off'>('Day Shift')
  // 4. Scanner Simulation State
  const [scanWorkerId, setScanWorkerId] = useState("")
  const [scanGate, setScanGate] = useState("Gate A (Main Yard)")
  const [scanSuccessMessage, setScanSuccessMessage] = useState("")

  // Interactive Graph Hover States
  const [hoveredData, setHoveredData] = useState<{ day: string; value: number } | null>(null)
  const [selectedMapPin, setSelectedMapPin] = useState<string | null>(null)

  // Calculations
  const activeCount = workers.filter(w => w.status === 'Active').length
  const directCount = workers.filter(w => w.employmentType === 'Direct').length
  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = attendance.filter(att => att.date === today).length
  const expiringCerts = certifications.filter(c => c.status === 'Warning')
  const activeVioCount = safetyViolations.length

  const depts = ["All", "Structure", "Safety", "Excavation", "Mechanical"]

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || 
                          w.role.toLowerCase().includes(search.toLowerCase())
    const matchesDept = selectedDept === "All" || w.department === selectedDept
    return matchesSearch && matchesDept
  })

  // Submit Handler for Onboarding Wizard
  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!onboardName || !onboardRole) return
    const skills = onboardSkills.split(',').map(s => s.trim()).filter(Boolean)
    
    onboardEmployee({
      name: onboardName,
      role: onboardRole,
      department: onboardDept,
      skills,
      allocation: onboardAlloc || "Unassigned",
      employmentType: onboardType
    })

    setIsWizardOpen(false)
    setWizardStep(1)
    setOnboardName("")
    setOnboardRole("")
    setOnboardDept("Structure")
    setOnboardType('Direct')
    setOnboardSkills("")
    setOnboardAlloc("")
  }

  // Submit Handler for Safety Violation
  const handleSafetySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!safetyHazard) return
    logSafetyViolation({
      location: safetyLoc,
      hazardDescription: safetyHazard,
      violatorCrew: safetyCrew,
      severity: safetySeverity
    })
    setIsSafetyModalOpen(false)
    setSafetyHazard("")
  }

  // Submit Handler for Shift Assigning
  const handleShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkerId) return
    assignShift(selectedWorkerId, shiftDay, shiftType)
    setIsAssignShiftOpen(false)
  }

  // QR Checkin scan simulation trigger
  const handleScanSimulation = () => {
    if (!scanWorkerId) return
    clockInWorker(scanWorkerId, scanGate)
    const workerName = workers.find(w => w.id === scanWorkerId)?.name || "Worker"
    setScanSuccessMessage(`Success! QR check-in verified. ${workerName} clocked in at ${scanGate}.`)
    setTimeout(() => {
      setScanSuccessMessage("")
      setIsQrScannerOpen(false)
      setScanWorkerId("")
    }, 2000)
  }

  // Export payroll CSV simulation
  const handleExportPayroll = () => {
    alert("Exporting validated timesheets to Sage ERP (Format: CSV standard, UTF-8). Transmitting telemetry check logs...")
  }

  // Custom SVG Chart Data Definitions
  const attendanceTrend = [
    { day: "Mon", value: 340 },
    { day: "Tue", value: 350 },
    { day: "Wed", value: 335 },
    { day: "Thu", value: 345 },
    { day: "Fri", value: 350 },
    { day: "Sat", value: 120 },
    { day: "Sun", value: 95 }
  ]

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-800 dark:text-white">
            Workforce Control Center
          </h1>
          <p className="text-xs text-muted-foreground">
            Monitor real-time site geofences, dispatch shift rosters, audit safety certifications, and track productivity variance.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2.5 self-start sm:self-center">
          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="px-3 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border border-border/30 animate-pulse-slow"
          >
            <QrCode className="w-4 h-4 text-brand-safety" />
            Scan QR Badge
          </button>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2 bg-brand-safety text-white text-xs font-bold rounded-lg hover:bg-brand-safety/90 shadow shadow-brand-safety/15 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Onboard Worker
          </button>
        </div>
      </div>

      {/* 2. Primary Navigation Tabs */}
      <div className="flex flex-wrap border-b border-border gap-1 bg-muted/40 p-1 rounded-xl">
        {[
          { id: 'dashboard', name: 'Dashboard', icon: Activity },
          { id: 'directory', name: 'Directory', icon: Users },
          { id: 'attendance', name: 'Attendance Logs', icon: UserCheck },
          { id: 'shifts', name: 'Shift Rotations', icon: Calendar },
          { id: 'assignments', name: 'Capacity Planner', icon: ClipboardCheck },
          { id: 'tracking', name: 'Live GPS Map', icon: Map },
          { id: 'productivity', name: 'Productivity', icon: TrendingUp },
          { id: 'safety', name: 'Safety Audits', icon: ShieldAlert },
          { id: 'subcontractors', name: 'Subcontractors', icon: Building },
          { id: 'payroll', name: 'Payroll Compiler', icon: DollarSign }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSection === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[11px] font-extrabold capitalize transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#141B2D] text-slate-800 dark:text-white shadow shadow-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* 3. Render Section Dynamic Viewports */}

      {/* VIEWPORT A: DASHBOARD */}
      {activeSection === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          {/* Dashboard Metrics Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Today's Attendance</span>
              <p className="text-2xl font-bold font-heading">{todayAttendance} active / {workers.length} sched</p>
              <span className="text-[10px] font-bold text-brand-success">
                🟢 {activeCount} checked in inside geofenced zones
              </span>
            </div>

            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Active Shifts</span>
              <p className="text-2xl font-bold font-heading">
                {shifts.filter(s => s.type !== 'Off').length} Assigned
              </p>
              <span className="text-[10px] font-bold text-brand-success">🟢 {directCount} Direct Employees Active</span>
            </div>

            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Safety Violations</span>
              <p className="text-2xl font-bold font-heading">{activeVioCount} Open logs</p>
              <span className={`text-[10px] font-bold ${activeVioCount > 0 ? 'text-brand-safety' : 'text-brand-success'}`}>
                {activeVioCount > 0 ? '⚠️ Incidents recorded today' : '🟢 100% compliance rate'}
              </span>
            </div>

            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Expiring Credentials</span>
              <p className="text-2xl font-bold font-heading">{expiringCerts.length} Warnings</p>
              <span className="text-[10px] text-brand-safety font-bold">⚠️ Expiries within 30 days</span>
            </div>
          </div>

          {/* SVG Graphs & Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Attendance Trend */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block">
                  Workforce Attendance Trends (Weekly)
                </span>
                {hoveredData && (
                  <span className="text-[10px] font-bold bg-brand-safety/10 text-brand-safety px-2 py-0.5 rounded">
                    {hoveredData.day}: {hoveredData.value} workers
                  </span>
                )}
              </div>

              {/* Interactive SVG Line Graph */}
              <div className="relative h-48 flex items-center justify-center bg-muted/10 rounded-xl border border-border/30">
                <svg className="w-full h-full p-4" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" strokeDasharray="3" />
                  
                  {/* Trend Polyline */}
                  <polyline
                    fill="none"
                    stroke="var(--brand-safety, #ff8c00)"
                    strokeWidth="3.5"
                    points="30,140 100,130 170,145 240,135 310,130 380,180 450,190"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive Dot Triggers */}
                  {attendanceTrend.map((d, idx) => {
                    const x = 30 + idx * 70
                    const y = 200 - (d.value / 370) * 160
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="6"
                        className="fill-brand-safety hover:r-8 hover:fill-brand-accent transition-all cursor-pointer"
                        onMouseEnter={() => setHoveredData(d)}
                        onMouseLeave={() => setHoveredData(null)}
                      />
                    )
                  })}
                </svg>

                {/* X Axis labels */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-[9px] font-bold text-muted-foreground font-mono">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Productivity Curve */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
              <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block border-b border-border pb-2">
                Today's Task Completion Curve (Productivity vs Target)
              </span>

              {/* Custom SVG Area Chart */}
              <div className="relative h-48 flex items-center justify-center bg-muted/10 rounded-xl border border-border/30">
                <svg className="w-full h-full p-4" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Gradient Area Definition */}
                  <defs>
                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-accent, #00f2fe)" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="var(--brand-accent, #00f2fe)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area path */}
                  <path
                    d="M 30 180 L 100 130 L 170 160 L 240 110 L 310 90 L 380 190 L 450 195 L 450 200 L 30 200 Z"
                    fill="url(#prodGrad)"
                  />

                  {/* Overlay Line */}
                  <path
                    d="M 30 180 L 100 130 L 170 160 L 240 110 L 310 90 L 380 190 L 450 195"
                    fill="none"
                    stroke="var(--brand-accent, #00f2fe)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Target line indicator */}
                  <line x1="30" y1="110" x2="450" y2="110" stroke="rgba(255,140,0,0.5)" strokeWidth="1.5" strokeDasharray="4" />
                </svg>

                {/* X Axis labels */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-[9px] font-bold text-muted-foreground font-mono">
                  <span>08 AM</span>
                  <span>10 AM</span>
                  <span>12 PM</span>
                  <span>02 PM</span>
                  <span>04 PM</span>
                  <span>06 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Roster Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List A: Expiring Certifications */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
              <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block border-b border-border pb-2">
                Expiring Credentials Checklist (30 Days)
              </span>

              <div className="space-y-3">
                {expiringCerts.map((cert) => {
                  const workerName = workers.find(w => w.id === cert.workerId)?.name || "Worker"
                  return (
                    <div key={cert.id} className="p-3 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-all">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{cert.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">Operator: {workerName} • Expires: {cert.expiryDate}</p>
                      </div>
                      <Link
                        to={`/workforce/${cert.workerId}`}
                        className="px-2.5 py-1 bg-brand-safety/10 text-brand-safety font-bold text-[10px] rounded hover:bg-brand-safety hover:text-white transition-all"
                      >
                        Renew
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* List B: Active Subcontractors */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
              <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block border-b border-border pb-2">
                Subcontractor Activity Logs
              </span>

              <div className="space-y-3">
                {subcontractors.map((sub) => (
                  <div key={sub.id} className="p-3 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-all">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{sub.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">Active headcount: {sub.activeCount} workers • compliance: {sub.complianceScore}%</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      sub.complianceScore >= 95 ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-safety/10 text-brand-safety'
                    }`}>
                      {sub.complianceScore}% Score
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT B: DIRECTORY */}
      {activeSection === 'directory' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filters Control Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#141B2D] border border-border p-4 rounded-xl shadow-raised">
            <div className="flex flex-wrap gap-2">
              {depts.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDept(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDept === d
                      ? 'bg-brand-safety text-white shadow shadow-brand-safety/15'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Search by worker name, role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg text-left"
                />
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-white dark:bg-[#1e293b] text-foreground' : 'text-muted-foreground'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'table' ? 'bg-white dark:bg-[#1e293b] text-foreground' : 'text-muted-foreground'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Directory Rendering */}
          {filteredWorkers.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#141B2D] border border-border rounded-2xl text-xs text-muted-foreground italic space-y-2">
              <p>No workforce profiles matching search criteria found.</p>
              <button
                onClick={() => { setSearch(""); setSelectedDept("All"); }}
                className="text-xs text-brand-safety font-bold underline"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredWorkers.map((w) => (
                <div
                  key={w.id}
                  className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised relative flex flex-col justify-between gap-4 group hover:shadow-floating transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono ${
                        w.employmentType === 'Direct' ? 'bg-brand-success/10 text-brand-success' :
                        w.employmentType === 'Subcontractor' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-brand-safety/10 text-brand-safety'
                      }`}>
                        {w.employmentType}
                      </span>
                      <span className={`w-2.5 h-2.5 rounded-full ${w.status === 'Active' ? 'bg-brand-success' : 'bg-slate-400'}`}></span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">{w.name}</h3>
                      <p className="text-xs text-muted-foreground">{w.role}</p>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-[10px] text-muted-foreground font-mono">Dept: {w.department}</p>
                      <p className="text-[10px] text-muted-foreground truncate">Alloc: {w.allocation}</p>
                    </div>
                  </div>

                  <Link
                    to={`/workforce/${w.id}`}
                    className="w-full py-2 bg-muted hover:bg-slate-700 hover:text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    View Profile
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl overflow-hidden shadow-raised">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold font-mono">
                    <th className="p-4">Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Allocation</th>
                    <th className="p-4">Safety Score</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredWorkers.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${w.status === 'Active' ? 'bg-brand-success' : 'bg-slate-400'}`}></span>
                        {w.name}
                      </td>
                      <td className="p-4 text-muted-foreground">{w.role}</td>
                      <td className="p-4 font-mono">{w.department}</td>
                      <td className="p-4">{w.employmentType}</td>
                      <td className="p-4 text-muted-foreground">{w.allocation}</td>
                      <td className="p-4 font-bold text-brand-success">{w.safetyRating}%</td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/workforce/${w.id}`}
                          className="px-2.5 py-1.5 bg-muted hover:bg-slate-700 hover:text-white rounded font-bold text-[10px]"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEWPORT C: ATTENDANCE */}
      {activeSection === 'attendance' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h3 className="font-heading font-extrabold text-sm">Geofenced Live Attendance Logs</h3>
              <p className="text-[10px] text-muted-foreground">Real-time gate clock-ins and location validation tracking.</p>
            </div>
            <span className="text-[10px] font-bold text-brand-success flex items-center gap-1.5 font-mono">
              🟢 Active GPS Validator
            </span>
          </div>

          <div className="space-y-4">
            {attendance.map((att) => {
              const workerName = workers.find(w => w.id === att.workerId)?.name || "Worker"
              return (
                <div key={att.id} className="p-4 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-brand-success/15 text-brand-success rounded-lg">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{workerName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{att.date} • {att.geofence}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-success font-bold font-mono">Clock In: {att.clockIn}</p>
                    <p className="text-muted-foreground font-mono">Clock Out: {att.clockOut}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* VIEWPORT D: SHIFT ROTATIONS */}
      {activeSection === 'shifts' && (
        <div className="space-y-6 animate-fade-in">
          {/* Shift Matrix Header Controls */}
          <div className="flex justify-between items-center bg-white dark:bg-[#141B2D] border border-border p-4 rounded-xl shadow-raised">
            <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block">
              Active Shift Rotations Matrix (Weekly Planner)
            </span>
            <button
              onClick={() => setIsAssignShiftOpen(true)}
              className="px-3 py-1.5 bg-brand-safety text-white text-[10px] font-bold rounded hover:opacity-90 flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" /> Assign Shift
            </button>
          </div>

          {/* Roster Gantt Chart Grid */}
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl overflow-hidden shadow-raised">
            <div className="grid grid-cols-8 border-b border-border bg-muted/40 font-bold font-mono text-[10px] text-muted-foreground text-center p-3">
              <span className="text-left pl-2">Worker / Crew</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            <div className="divide-y divide-border text-center text-xs">
              {workers.map((w) => {
                const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                return (
                  <div key={w.id} className="grid grid-cols-8 items-center p-3 hover:bg-muted/10 transition-colors">
                    <span className="text-left font-bold pl-2 truncate">{w.name}</span>
                    {days.map((day) => {
                      const rotation = shifts.find(s => s.workerId === w.id && s.day === day)
                      const type = rotation ? rotation.type : 'Off'
                      return (
                        <span key={day} className={`font-extrabold text-[10px] py-1 rounded-lg mx-1 uppercase ${
                          type === 'Day Shift' ? 'bg-brand-success/15 text-brand-success' :
                          type === 'Night Shift' ? 'bg-brand-accent/15 text-brand-accent' : 'bg-muted text-slate-400'
                        }`}>
                          {type.split(' ')[0]}
                        </span>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT E: CAPACITY PLANNER */}
      {activeSection === 'assignments' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="border-b border-border pb-4">
            <h3 className="font-heading font-extrabold text-sm">Labor Capacity Allocation Matrix</h3>
            <p className="text-[10px] text-muted-foreground">Ensuring correct staffing density and warning of idle labor variance.</p>
          </div>

          <div className="space-y-6">
            {[
              { site: "Tower A Residences", allocated: 2, required: 2, efficiency: 100 },
              { site: "APEX Commercial Hub", allocated: 1, required: 2, efficiency: 50 },
              { site: "Metro Line Underground", allocated: 1, required: 1, efficiency: 100 }
            ].map((p, idx) => (
              <div key={idx} className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-white">{p.site}</span>
                  <span className={`font-bold font-mono ${p.efficiency < 80 ? 'text-brand-safety' : 'text-brand-success'}`}>
                    {p.allocated} / {p.required} Operators ({p.efficiency}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${p.efficiency < 80 ? 'bg-brand-safety animate-pulse-slow' : 'bg-brand-success'}`}
                    style={{ width: `${p.efficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEWPORT F: LIVE GPS TRACKING MAP */}
      {activeSection === 'tracking' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h3 className="font-heading font-extrabold text-sm">Site Boundary Geofencing coordinates</h3>
              <p className="text-[10px] text-muted-foreground">Interactive visual live location pins mapping for active operators.</p>
            </div>
            <span className="text-[9px] font-bold bg-brand-success/10 text-brand-success px-2 py-1 rounded font-mono">
              🟢 Google Maps Simulator Active
            </span>
          </div>

          {/* Interactive Simulated Map Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 relative h-96 bg-muted/20 border border-border/30 rounded-xl overflow-hidden flex items-center justify-center select-none">
              
              {/* Custom SVG Maps Overlay */}
              <svg className="w-full h-full p-4" viewBox="0 0 500 300">
                {/* Geofence Site Bounds Circular Dials */}
                <circle cx="250" cy="150" r="110" fill="rgba(0,242,254,0.05)" stroke="var(--brand-accent, #00f2fe)" strokeWidth="2" strokeDasharray="3" />
                <circle cx="250" cy="150" r="130" fill="none" stroke="rgba(255,140,0,0.2)" strokeWidth="1" />
                
                {/* Crane Zone Anchor */}
                <rect x="230" y="130" width="40" height="40" rx="6" fill="rgba(255,140,0,0.15)" stroke="var(--brand-safety)" strokeWidth="1" />
                <text x="250" y="153" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--brand-safety)" className="font-mono">CRANE</text>

                {/* Simulated Pins */}
                {gpsLocations.map((loc, idx) => {
                  const isHovered = selectedMapPin === loc.id
                  const cx = 150 + (idx * 100)
                  const cy = 100 + (idx * 40)
                  return (
                    <g key={loc.id} className="cursor-pointer" onClick={() => setSelectedMapPin(loc.id)}>
                      <circle cx={cx} cy={cy} r={isHovered ? "10" : "7"} className={`${isHovered ? 'fill-brand-safety' : 'fill-brand-accent'} transition-all`} />
                      <circle cx={cx} cy={cy} r={isHovered ? "22" : "15"} fill="none" className={`${isHovered ? 'stroke-brand-safety' : 'stroke-brand-accent/50'} stroke-1 animate-ping-slow`} />
                    </g>
                  )
                })}
              </svg>

              {/* Float Map Legend */}
              <div className="absolute top-3 left-3 bg-[#101625]/85 border border-border p-2.5 rounded-lg text-[9px] font-bold text-slate-350 space-y-1 font-mono">
                <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-accent"></span> Crew Active Location</p>
                <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-safety"></span> Crane Warning Geofence</p>
              </div>

              {/* Hover Pin Popup Info */}
              {selectedMapPin && (() => {
                const loc = gpsLocations.find(l => l.id === selectedMapPin)
                if (!loc) return null
                return (
                  <div className="absolute bottom-4 left-4 right-4 bg-[#101625]/90 border border-brand-safety p-3 rounded-lg text-left text-xs animate-fade-in flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{loc.workerName} ({loc.role})</p>
                      <p className="text-[10px] text-slate-350 font-mono">Zone: {loc.zone} • Lat/Lng: {loc.lat}, {loc.lng}</p>
                    </div>
                    <button onClick={() => setSelectedMapPin(null)} className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              })()}
            </div>

            {/* Live GPS tracks logs sidebar */}
            <div className="lg:col-span-4 space-y-3 max-h-96 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Geofenced Live Pins Feed:</span>
              {gpsLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedMapPin(loc.id)}
                  className={`w-full p-3 border rounded-xl text-left text-xs transition-all block space-y-1 ${
                    selectedMapPin === loc.id ? 'border-brand-safety bg-brand-safety/5' : 'border-border hover:bg-muted/10'
                  }`}
                >
                  <p className="font-bold text-slate-800 dark:text-white">{loc.workerName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{loc.zone}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT G: PRODUCTIVITY */}
      {activeSection === 'productivity' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="border-b border-border pb-4">
            <h3 className="font-heading font-extrabold text-sm">Productivity score indexes</h3>
            <p className="text-[10px] text-muted-foreground">Variance benchmarks correlation tracking comparing daily task outputs.</p>
          </div>

          <div className="space-y-4">
            {[
              { metric: "Scheduled labor output vs actuals", score: 94, status: "Optimal" },
              { metric: "Concrete pour velocity benchmark", score: 98, status: "Optimal" },
              { metric: "Trench excavation yards efficiency", score: 82, status: "Stable" }
            ].map((prod, idx) => (
              <div key={idx} className="p-4 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-all">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{prod.metric}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Status: {prod.status}</p>
                </div>
                <span className="text-xl font-black font-heading text-brand-success">{prod.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEWPORT H: SAFETY COMPLIANCE & PPE AUDITS */}
      {activeSection === 'safety' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h3 className="font-heading font-extrabold text-sm">PPE Safety Compliance logs</h3>
              <p className="text-[10px] text-muted-foreground">Documenting site incidents, checks warnings, and gear validations.</p>
            </div>
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="px-3 py-1.5 bg-brand-danger text-white text-[10px] font-bold rounded hover:opacity-90 flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Log Safety Incident
            </button>
          </div>

          <div className="space-y-3">
            {safetyViolations.map((vio) => (
              <div key={vio.id} className="p-4 border border-border rounded-xl flex justify-between items-start text-xs hover:bg-muted/10 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      vio.severity === 'Critical' ? 'bg-brand-danger/10 text-brand-danger' : 'bg-brand-safety/10 text-brand-safety'
                    }`}>
                      {vio.severity}
                    </span>
                    <p className="font-bold text-slate-800 dark:text-white">{vio.location}</p>
                  </div>
                  <p className="text-muted-foreground">{vio.hazardDescription}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Crew involved: {vio.violatorCrew} • Logged: {vio.loggedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEWPORT I: SUBCONTRACTORS */}
      {activeSection === 'subcontractors' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="border-b border-border pb-4">
            <h3 className="font-heading font-extrabold text-sm">Active Subcontractor Crews</h3>
            <p className="text-[10px] text-muted-foreground">Credential audits and headcounts mapping across subcontractor partners.</p>
          </div>

          <div className="space-y-4">
            {subcontractors.map((sub) => (
              <div key={sub.id} className="p-4 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{sub.name}</p>
                    <p className="text-[10px] text-muted-foreground">Projects: {sub.projects.join(', ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-white">{sub.activeCount} Workers active</p>
                  <p className="text-brand-success font-bold font-mono">{sub.complianceScore}% safety score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEWPORT J: PAYROLL & TIMESHEETS COMPILER */}
      {activeSection === 'payroll' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h3 className="font-heading font-extrabold text-sm">Timesheets & Allowances Compiler</h3>
              <p className="text-[10px] text-muted-foreground">Approved gross payroll logs compiles ready for Sage / SAP ERP exports.</p>
            </div>
            <button
              onClick={handleExportPayroll}
              className="px-3.5 py-2 bg-brand-success text-white text-xs font-bold rounded-lg hover:opacity-90 flex items-center gap-1.5 transition-all shadow shadow-brand-success/15"
            >
              <FileText className="w-4 h-4" /> Export ERP Payroll
            </button>
          </div>

          <div className="space-y-3">
            {[
              { name: "John Doe", hours: "40.0 hrs", ot: "8.5 hrs", allowance: "Travel", gross: "$1,850", erp: "Ready" },
              { name: "Sarah Jones", hours: "40.0 hrs", ot: "0.0 hrs", allowance: "N/A", gross: "$1,600", erp: "Synced" }
            ].map((pay, idx) => (
              <div key={idx} className="p-4 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-all">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{pay.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Base: {pay.hours} • OT: {pay.ot} • allowance: {pay.allowance}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-white">{pay.gross}</p>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    pay.erp === 'Synced' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-safety/10 text-brand-safety'
                  }`}>
                    {pay.erp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MODALS & POPUPS SIMULATORS */}

      {/* MODAL 1: ONBOARDING WIZARD */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsWizardOpen(false)}></div>
          
          <form onSubmit={handleOnboardSubmit} className="w-full max-w-lg bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Onboard New Worker</h3>
                <p className="text-[10px] text-muted-foreground">Multi-step wizard checklist registration.</p>
              </div>
              <button type="button" onClick={() => setIsWizardOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="px-5 py-3.5 bg-muted/30 border-b border-border flex justify-between text-[10px] font-bold text-muted-foreground font-mono">
              <span className={wizardStep >= 1 ? 'text-brand-safety' : ''}>1. GENERAL</span>
              <span className={wizardStep >= 2 ? 'text-brand-safety' : ''}>2. DETAILS</span>
              <span className={wizardStep >= 3 ? 'text-brand-safety' : ''}>3. LOGISTICS</span>
              <span className={wizardStep >= 4 ? 'text-brand-safety' : ''}>4. SUBMIT</span>
            </div>

            <div className="p-5 space-y-4 flex-1 max-h-[350px] overflow-y-auto">
              {wizardStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Worker Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={onboardName}
                      onChange={(e) => setOnboardName(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Role Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Crane Operator"
                      value={onboardRole}
                      onChange={(e) => setOnboardRole(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Department</label>
                    <select
                      value={onboardDept}
                      onChange={(e) => setOnboardDept(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                    >
                      <option value="Structure">Structure</option>
                      <option value="Safety">Safety</option>
                      <option value="Excavation">Excavation</option>
                      <option value="Mechanical">Mechanical</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Employment Classification</label>
                    <div className="flex gap-2">
                      {(['Direct', 'Subcontractor', 'Hourly'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setOnboardType(type)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                            onboardType === type ? 'border-brand-safety bg-brand-safety/5 text-brand-safety' : 'border-border hover:bg-muted'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Trade Skills (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Tower Crane Operation, Rigging Level II"
                      value={onboardSkills}
                      onChange={(e) => setOnboardSkills(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Active Site Allocation</label>
                    <input
                      type="text"
                      placeholder="e.g. Tower A Residences"
                      value={onboardAlloc}
                      onChange={(e) => setOnboardAlloc(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-xl space-y-2">
                    <span className="font-bold text-brand-success block">Summary Checklist:</span>
                    <p><strong>Name:</strong> {onboardName}</p>
                    <p><strong>Role:</strong> {onboardRole}</p>
                    <p><strong>Department:</strong> {onboardDept} ({onboardType})</p>
                    <p><strong>Skills:</strong> {onboardSkills || "None"}</p>
                    <p><strong>Allocation:</strong> {onboardAlloc || "Unassigned"}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">By submitting, you register this operator index to the global state cache.</p>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-border flex justify-between bg-muted/20">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(prev => prev - 1)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                Back
              </button>

              {wizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(prev => prev + 1)}
                  className="px-4 py-2 bg-brand-safety text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-success text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Commit Onboard
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: QR BADGE SCANNER SIMULATOR */}
      {isQrScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsQrScannerOpen(false)}></div>
          
          <div className="w-full max-w-md bg-[#101625] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center text-white">
              <div>
                <h3 className="font-heading font-extrabold text-base flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-brand-safety" />
                  QR Attendance Scanner
                </h3>
                <p className="text-[10px] text-slate-350">Simulating mobile scanner hardware interfaces.</p>
              </div>
              <button onClick={() => setIsQrScannerOpen(false)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Scan simulation screen */}
              <div className="relative h-44 bg-black border border-slate-700 rounded-xl overflow-hidden flex items-center justify-center">
                {scanSuccessMessage ? (
                  <p className="text-xs text-brand-success font-bold text-center px-4 animate-pulse-slow">
                    {scanSuccessMessage}
                  </p>
                ) : (
                  <>
                    <div className="absolute inset-4 border border-brand-safety/50 rounded-lg animate-pulse-slow"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-safety animate-bounce"></div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1.5 z-10">
                      ⌛ Scanning Device Camera bio-feed...
                    </span>
                  </>
                )}
              </div>

              {/* Selector configurations */}
              {!scanSuccessMessage && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-350 font-mono">Select worker badge</label>
                    <select
                      value={scanWorkerId}
                      onChange={(e) => setScanWorkerId(e.target.value)}
                      className="w-full p-2.5 border border-slate-700 bg-slate-900 focus:outline-none focus:border-brand-safety text-xs rounded-lg text-white"
                    >
                      <option value="">-- Choose Operator Badge --</option>
                      {workers.map(w => <option key={w.id} value={w.id}>{w.name} ({w.role})</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-355 font-mono">Scanning gate portal</label>
                    <select
                      value={scanGate}
                      onChange={(e) => setScanGate(e.target.value)}
                      className="w-full p-2.5 border border-slate-700 bg-slate-900 focus:outline-none focus:border-brand-safety text-xs rounded-lg text-white"
                    >
                      <option value="Gate A (Main Yard)">Gate A (Main Yard)</option>
                      <option value="Gate B (Sector A)">Gate B (Sector A)</option>
                      <option value="Main Portal">Main Portal</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-800 flex justify-end gap-2 bg-slate-900/60">
              <button
                onClick={() => setIsQrScannerOpen(false)}
                className="px-4 py-2 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              {!scanSuccessMessage && (
                <button
                  onClick={handleScanSimulation}
                  disabled={!scanWorkerId}
                  className="px-4 py-2 bg-brand-safety disabled:opacity-50 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1"
                >
                  Trigger Scan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SAFETY VIOLATION LOGGER */}
      {isSafetyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsSafetyModalOpen(false)}></div>
          
          <form onSubmit={handleSafetySubmit} className="w-full max-w-md bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Log PPE Audit Hazard</h3>
                <p className="text-[10px] text-muted-foreground">Record site safety compliance incidents.</p>
              </div>
              <button type="button" onClick={() => setIsSafetyModalOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Site Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Site Gate B"
                  value={safetyLoc}
                  onChange={(e) => setSafetyLoc(e.target.value)}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Hazard / Violation description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Workers detected working without goggles and hardhats at Gate B scaffolding."
                  value={safetyHazard}
                  onChange={(e) => setSafetyHazard(e.target.value)}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Violator Crew / firm</label>
                  <input
                    type="text"
                    required
                    value={safetyCrew}
                    onChange={(e) => setSafetyCrew(e.target.value)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Violation Severity</label>
                  <select
                    value={safetySeverity}
                    onChange={(e) => setSafetySeverity(e.target.value as any)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                  >
                    <option value="Minor">Minor</option>
                    <option value="Major">Major</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button
                type="button"
                onClick={() => setIsSafetyModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-danger text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all"
              >
                Submit Incident Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: ASSIGN SHIFT ROSTER */}
      {isAssignShiftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsAssignShiftOpen(false)}></div>
          
          <form onSubmit={handleShiftSubmit} className="w-full max-w-md bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Assign Shift Schedule</h3>
                <p className="text-[10px] text-muted-foreground">Configure weekly rotation matrix entries.</p>
              </div>
              <button type="button" onClick={() => setIsAssignShiftOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Select Operator / Crew member</label>
                <select
                  required
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                >
                  <option value="">-- Choose Operator --</option>
                  {workers.map(w => <option key={w.id} value={w.id}>{w.name} ({w.role})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350 font-mono">Weekday</label>
                  <select
                    value={shiftDay}
                    onChange={(e) => setShiftDay(e.target.value)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                  >
                    <option value="Mon">Mon</option>
                    <option value="Tue">Tue</option>
                    <option value="Wed">Wed</option>
                    <option value="Thu">Thu</option>
                    <option value="Fri">Fri</option>
                    <option value="Sat">Sat</option>
                    <option value="Sun">Sun</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350 font-mono">Shift rotation</label>
                  <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value as any)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                  >
                    <option value="Day Shift">Day Shift</option>
                    <option value="Night Shift">Night Shift</option>
                    <option value="Off">Off (Rest Roster)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button
                type="button"
                onClick={() => setIsAssignShiftOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedWorkerId}
                className="px-4 py-2 bg-brand-safety disabled:opacity-50 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
