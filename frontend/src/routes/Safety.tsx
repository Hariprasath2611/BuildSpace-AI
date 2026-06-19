import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSafetyStore } from '../store/safetyStore'
import {
  Plus,
  Search,
  X,
  Sparkles,
  ClipboardCheck,
  Activity,
  Map,
  ShieldAlert,
  FileText,
  Camera,
  Thermometer,
  Wind,
  CheckCircle2,
  Lock
} from 'lucide-react'

export default function Safety() {
  const hazards = useSafetyStore((state) => state.hazards)
  const fetchHazards = useSafetyStore((state) => state.fetchHazards)

  useEffect(() => {
    fetchHazards()
  }, [fetchHazards])

  const incidents = useSafetyStore((state) => state.incidents)
  const permits = useSafetyStore((state) => state.permits)
  const isSosTriggered = useSafetyStore((state) => state.isSosTriggered)

  const triggerSos = useSafetyStore((state) => state.triggerSos)
  const logHazard = useSafetyStore((state) => state.logHazard)
  const resolveHazard = useSafetyStore((state) => state.resolveHazard)
  const logIncident = useSafetyStore((state) => state.logIncident)
  const renewPermit = useSafetyStore((state) => state.renewPermit)

  // Navigation Tabs
  const [activeSection, setActiveSection] = useState<'dashboard' | 'inspections' | 'hazards' | 'incidents' | 'ppe' | 'permits' | 'emergency'>('dashboard')
  const [searchQuery, setSearchQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("All")
  
  // Modals & Wizards States
  const [isHazardModalOpen, setIsHazardModalOpen] = useState(false)
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false)
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false)
  const [activePermitId, setActivePermitId] = useState("")

  // Form Fields
  // 1. Hazard form
  const [hazTitle, setHazTitle] = useState("")
  const [hazCat, setHazCat] = useState<'Fall' | 'Electrical' | 'StruckBy' | 'CaughtInBetween' | 'Chemical' | 'Other'>('Electrical')
  const [hazRisk, setHazRisk] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High')
  const [hazLoc, setHazLoc] = useState("Site Gate B")
  const [hazAssign, setHazAssign] = useState("Dave Miller")
  // 2. Incident form
  const [incTitle, setIncTitle] = useState("")
  const [incSeverity, setIncSeverity] = useState<'NearMiss' | 'Minor' | 'Major' | 'Fatal'>('NearMiss')
  // 3. Permit renewal form
  const [permitExpiry, setPermitExpiry] = useState("2026-06-25 04:00 PM")
  // 4. Audit Checklist form
  const [auditScore, setAuditScore] = useState(100)
  const [auditSignature, setAuditSignature] = useState("")
  const [auditTarget, setAuditTarget] = useState("Tower A Scaffolding")

  // Interactive AI PPE Video Simulator states
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraSource, setCameraSource] = useState("Gate A Checkpoint")
  const [isPpeAuditLogged, setIsPpeAuditLogged] = useState(false)

  // Weather Recommendations
  const heatIndex = 98 // 98F High heat
  const windSpeed = 28 // 28mph High wind crane limits
  
  // Bounding box options
  const detectedItems = [
    { label: "OSHA Hardhat", status: "Compliant", score: 99 },
    { label: "High-Vis Vest", status: "Compliant", score: 95 },
    { label: "Steel-Toe Boots", status: "Compliant", score: 96 }
  ]

  // Filtering
  const filteredHazards = hazards.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRisk = riskFilter === "All" || h.riskLevel === riskFilter
    return matchesSearch && matchesRisk
  })

  // Submit log hazard
  const handleHazardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hazTitle) return
    logHazard({
      title: hazTitle,
      category: hazCat,
      riskLevel: hazRisk,
      location: hazLoc,
      assignedTo: hazAssign
    })
    setIsHazardModalOpen(false)
    setHazTitle("")
  }

  // Submit log incident
  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!incTitle) return
    logIncident({
      title: incTitle,
      severity: incSeverity,
      loggedAt: new Date().toLocaleString()
    })
    setIsIncidentModalOpen(false)
    setIncTitle("")
  }

  // Submit permit renewal
  const handlePermitSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePermitId || !permitExpiry) return
    renewPermit(activePermitId, permitExpiry)
    setIsPermitModalOpen(false)
    setActivePermitId("")
  }

  // Submit audit signature pass
  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuditModalOpen(false)
    alert(`Audit checklist compiled successfully. Target: ${auditTarget} • Score: ${auditScore}% • Signed: ${auditSignature}.`)
    setAuditSignature("")
  }

  // Trigger manual EHS breach warning
  const triggerManualPpeWarning = () => {
    alert("AI PPE Breach Alert dispatched! Warning notified to site safety supervisor.")
    setIsPpeAuditLogged(true)
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

  const [hoveredData, setHoveredData] = useState<{ day: string; value: number } | null>(null)
  const [selectedMapPin, setSelectedMapPin] = useState<string | null>(null)

  const gpsLocations = [
    { id: "g_1", workerName: "John Doe", role: "Lead Crane Operator", lat: 37.7749, lng: -122.4194, zone: "Crane Operator Zone #3" },
    { id: "g_2", workerName: "Sarah Jones", role: "Structural Welder", lat: 37.7752, lng: -122.4182, zone: "Sector B Scaffolding" },
    { id: "g_3", workerName: "Dave Miller", role: "Safety Superintendent", lat: 37.7741, lng: -122.4201, zone: "Main Portal Gate A" }
  ]

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left relative">
      
      {/* Flashing SOS site shutdown overlay */}
      {isSosTriggered && (
        <div className="bg-brand-danger/10 border-2 border-brand-danger p-4 rounded-xl text-brand-danger animate-pulse flex justify-between items-center text-xs font-bold font-mono">
          <span>🚨 GLOBAL SOS SITE SHUTDOWN ACTIVE. ALL WORKERS DIRECTED TO EVACUATE TO ASSEMBLY POINTS.</span>
          <button
            onClick={() => triggerSos(false)}
            className="px-3 py-1.5 bg-brand-danger text-white rounded hover:opacity-90 font-bold"
          >
            Cancel Alarm
          </button>
        </div>
      )}

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-800 dark:text-white">
            Safety Control Center
          </h1>
          <p className="text-xs text-muted-foreground">
            AI-driven PPE inspections, Permit to Work authorization maps, and real-time site geofence warning alarms.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2.5 self-start sm:self-center">
          <button
            onClick={() => triggerSos(true)}
            className="px-4 py-2.5 bg-brand-danger text-white text-xs font-bold rounded-lg hover:bg-brand-danger/95 shadow shadow-brand-danger/20 animate-pulse flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            Trigger SOS Shutdown
          </button>
          <button
            onClick={() => setIsHazardModalOpen(true)}
            className="px-4 py-2 bg-brand-safety text-white text-xs font-bold rounded-lg hover:bg-brand-safety/90 shadow shadow-brand-safety/15 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Hazard
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap border-b border-border gap-1 bg-muted/40 p-1 rounded-xl">
        {([
          { id: 'dashboard', name: 'Dashboard', icon: Activity },
          { id: 'inspections', name: 'Checklists Audits', icon: ClipboardCheck },
          { id: 'hazards', name: 'Hazard Registry', icon: ShieldAlert },
          { id: 'incidents', name: 'Incident Logs', icon: FileText },
          { id: 'ppe', name: 'AI PPE Camera', icon: Camera },
          { id: 'permits', name: 'Permit to Work', icon: Lock },
          { id: 'emergency', name: 'SOS Assembly Map', icon: Map }
        ] as const).map((tab) => {
          const Icon = tab.icon
          const isActive = activeSection === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
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

      {/* SECTION VIEWPORTS */}

      {/* VIEWPORT 1: DASHBOARD */}
      {activeSection === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Safety Score</span>
              <p className="text-2xl font-bold font-heading text-brand-success">96.5% score</p>
              <span className="text-[10px] text-muted-foreground">🟢 OSHA Standard Compliant</span>
            </div>

            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Open Hazards</span>
              <p className="text-2xl font-bold font-heading">{hazards.filter(h => h.status === 'Open').length} Active</p>
              <span className="text-[10px] text-brand-safety font-bold">⚠️ HCV: 2.4 Hours Avg</span>
            </div>

            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Today's Incidents</span>
              <p className="text-2xl font-bold font-heading">{incidents.length} Reported</p>
              <span className="text-[10px] text-muted-foreground">0 Injuries logged today</span>
            </div>

            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Active Work Permits</span>
              <p className="text-2xl font-bold font-heading">
                {permits.filter(p => p.status === 'Approved').length} Approved
              </p>
              <span className="text-[10px] text-brand-safety font-bold">⚠️ 1 Pending Review</span>
            </div>
          </div>

          {/* Meteorological & Environmental Alarms */}
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
            <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block border-b border-border pb-2">
              Meteorological Crane limits & Environmental Safety
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="flex items-center gap-3 bg-brand-safety/5 border border-brand-safety/20 p-4 rounded-xl">
                <Thermometer className="w-8 h-8 text-brand-safety" />
                <div>
                  <p className="font-bold">Heat Index Alert</p>
                  <p className="text-[10px] text-muted-foreground">{heatIndex}°F - Enforce rest hydrations</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-brand-danger/5 border border-brand-danger/20 p-4 rounded-xl">
                <Wind className="w-8 h-8 text-brand-danger" />
                <div>
                  <p className="font-bold">Wind Limit Breached</p>
                  <p className="text-[10px] text-muted-foreground">{windSpeed} mph - Crane lock alert active</p>
                </div>
              </div>
              <div className="p-4 bg-muted/40 rounded-xl space-y-1.5 col-span-1 md:col-span-1">
                <span className="font-bold block">EHS Work restriction advice:</span>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-sans">
                  Heavy lifts at height must be stopped immediately. Scaffold ground crews should rotate shade breaks every 20 mins.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive SVG Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block">
                  Monthly Safety Incidents rate (TRIR Curve)
                </span>
                {hoveredData && (
                  <span className="text-[10px] font-bold bg-brand-safety/10 text-brand-safety px-2 py-0.5 rounded">
                    {hoveredData.day}: {hoveredData.value} Incidents
                  </span>
                )}
              </div>
              <div className="relative h-44 bg-muted/10 rounded-xl flex items-center justify-center">
                <svg className="w-full h-full p-4" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  <polyline
                    fill="none"
                    stroke="var(--brand-danger, #ef4444)"
                    strokeWidth="3.5"
                    points="30,130 120,90 210,120 300,70 390,140 470,110"
                    strokeLinecap="round"
                  />
                  {attendanceTrend.map((d, idx) => {
                    const x = 30 + idx * 70
                    const y = 200 - (d.value / 370) * 160
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="6"
                        className="fill-brand-danger hover:fill-brand-safety transition-all cursor-pointer"
                        onMouseEnter={() => setHoveredData(d)}
                        onMouseLeave={() => setHoveredData(null)}
                      />
                    )
                  })}
                </svg>
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-[9px] font-bold text-muted-foreground font-mono">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
              <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block border-b border-border pb-2">
                Today's PPE Compliance Checked Rates
              </span>
              <div className="relative h-44 bg-muted/10 rounded-xl flex items-center justify-center">
                <svg className="w-full h-full p-4" viewBox="0 0 500 200">
                  <rect x="50" y="30" width="30" height="150" fill="var(--brand-success)" rx="4" />
                  <text x="65" y="25" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">98%</text>
                  <text x="65" y="195" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">Helmet</text>

                  <rect x="180" y="60" width="30" height="120" fill="var(--brand-success)" rx="4" />
                  <text x="195" y="55" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">85%</text>
                  <text x="195" y="195" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">Vest</text>

                  <rect x="310" y="45" width="30" height="135" fill="var(--brand-success)" rx="4" />
                  <text x="325" y="40" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">92%</text>
                  <text x="325" y="195" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">Boots</text>

                  <rect x="430" y="80" width="30" height="100" fill="var(--brand-safety)" rx="4" />
                  <text x="445" y="75" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">65%</text>
                  <text x="445" y="195" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">Harness</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT 2: CHECKLISTS AUDITS */}
      {activeSection === 'inspections' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h3 className="font-heading font-extrabold text-sm">OSHA Field Inspections Checklists</h3>
              <p className="text-[10px] text-muted-foreground font-mono">Conduct scaffold safety checks, electrical parameters audits.</p>
            </div>
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="px-3.5 py-2 bg-brand-safety text-white text-xs font-bold rounded-lg hover:opacity-90 flex items-center gap-1 transition-all"
            >
              <ClipboardCheck className="w-4 h-4" /> Start Inspection Audit
            </button>
          </div>

          <div className="space-y-4">
            {[
              { target: "Tower A Scaffold Inspection", auditor: "Dave Miller", score: 98, date: "June 18, 2026", status: "Pass" },
              { target: "Excavation Zone B Trenches Check", auditor: "Sarah Jones", score: 82, date: "June 17, 2026", status: "Pass" },
              { target: "Sector C Electrical Panels Audit", auditor: "Tom Harris", score: 55, date: "June 15, 2026", status: "Fail" }
            ].map((audit, idx) => (
              <div key={idx} className="p-4 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{audit.target}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Auditor: {audit.auditor} • Date: {audit.date}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-slate-800 dark:text-white font-mono">{audit.score}% Score</p>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    audit.status === 'Pass' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-danger/10 text-brand-danger'
                  }`}>
                    {audit.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEWPORT 3: HAZARD REGISTRY */}
      {activeSection === 'hazards' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#141B2D] border border-border p-4 rounded-xl shadow-raised">
            <div className="flex flex-wrap gap-2">
              {["All", "Low", "Medium", "High", "Critical"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    riskFilter === r
                      ? 'bg-brand-safety text-white shadow shadow-brand-safety/15'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search by hazard name, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg text-left"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Registry Listing */}
          <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl overflow-hidden shadow-raised text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold font-mono">
                  <th className="p-4">Hazard Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Assigned Inspector</th>
                  <th className="p-4 text-center">Risk Tier</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredHazards.map((haz) => (
                  <tr key={haz.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${haz.status === 'Resolved' ? 'bg-brand-success' : 'bg-brand-safety'}`}></span>
                      {haz.title}
                    </td>
                    <td className="p-4 text-muted-foreground">{haz.category}</td>
                    <td className="p-4 font-mono">{haz.location}</td>
                    <td className="p-4">{haz.assignedTo}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        haz.riskLevel === 'Critical' ? 'bg-brand-danger/10 text-brand-danger' :
                        haz.riskLevel === 'High' ? 'bg-brand-safety/10 text-brand-safety' : 'bg-brand-success/10 text-brand-success'
                      }`}>
                        {haz.riskLevel}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {haz.status === 'Open' ? (
                        <button
                          onClick={() => resolveHazard(haz.id)}
                          className="px-2.5 py-1.5 bg-brand-success/10 text-brand-success hover:bg-brand-success hover:text-white rounded font-bold text-[10px] transition-all"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-brand-success flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEWPORT 4: INCIDENT LOGS */}
      {activeSection === 'incidents' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center bg-white dark:bg-[#141B2D] border border-border p-4 rounded-xl shadow-raised">
            <div>
              <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block">
                Workplace Accident & Incident Logs
              </span>
              <p className="text-[9px] text-muted-foreground mt-1 font-mono">Documenting structural near misses and injuries timeline history.</p>
            </div>
            <button
              onClick={() => setIsIncidentModalOpen(true)}
              className="px-3.5 py-2 bg-brand-danger text-white text-xs font-bold rounded hover:opacity-95 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Log Near-Miss/Incident
            </button>
          </div>

          <div className="space-y-4">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-5 bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-raised space-y-4 text-xs">
                <div className="flex justify-between items-start border-b border-border pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        inc.severity === 'NearMiss' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-danger/10 text-brand-danger'
                      }`}>
                        {inc.severity}
                      </span>
                      <Link
                        to={`/safety/${inc.id}`}
                        className="font-heading font-extrabold text-sm text-slate-800 dark:text-white hover:text-brand-safety transition-colors"
                      >
                        {inc.title}
                      </Link>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">Logged: {inc.loggedAt} • ID: {inc.id}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    inc.status === 'Closed' ? 'bg-brand-success/15 text-brand-success' : 'bg-brand-safety/15 text-brand-safety animate-pulse-slow'
                  }`}>
                    {inc.status}
                  </span>
                </div>

                {/* Root Cause Analysis (Five Whys) */}
                {inc.rootCause.length > 0 && (
                  <div className="p-3.5 bg-muted/30 border border-border/40 rounded-xl space-y-2">
                    <span className="font-bold text-slate-500 font-mono text-[10px] block text-left">Root Cause Investigation Summary:</span>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px] text-muted-foreground leading-relaxed text-left">
                      {inc.rootCause.map((why, idx) => <li key={idx}>{why}</li>)}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEWPORT 5: AI PPE DETECTOR SIMULATOR */}
      {activeSection === 'ppe' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h3 className="font-heading font-extrabold text-sm">AI Computer Vision PPE Checker</h3>
              <p className="text-[10px] text-muted-foreground">Live frame feed camera overlays scanning for site protective gear.</p>
            </div>
            
            <div className="flex gap-2">
              <select
                value={cameraSource}
                onChange={(e) => setCameraSource(e.target.value)}
                className="p-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-[10px] rounded-lg dark:bg-[#141B2D] font-bold font-mono"
              >
                <option value="Gate A Checkpoint">Gate A Checkpoint</option>
                <option value="Zone B Scaffolding Cam">Zone B Scaffolding Cam</option>
                <option value="Tower A Cranes Hook Cam">Tower A Cranes Hook Cam</option>
              </select>
              <button
                onClick={() => setIsCameraActive(!isCameraActive)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  isCameraActive ? 'bg-brand-danger text-white' : 'bg-brand-success text-white'
                }`}
              >
                {isCameraActive ? 'Stop Stream' : 'Start Live Stream'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Camera Viewport Canvas */}
            <div className="lg:col-span-8 relative h-96 bg-black border border-slate-700 rounded-xl overflow-hidden flex items-center justify-center select-none">
              {isCameraActive ? (
                <>
                  <div className="absolute top-12 left-24 border-2 border-brand-success p-2 rounded text-[10px] font-bold text-brand-success font-mono z-10 bg-black/40">
                    🟢 Helmet: 99% confidence
                  </div>
                  <div className="absolute top-36 left-24 border-2 border-brand-danger p-2 rounded text-[10px] font-bold text-brand-danger font-mono z-10 bg-black/40">
                    🔴 No Safety Vest: 15% confidence
                  </div>
                  
                  <div className="absolute inset-8 border border-brand-success/30 rounded-lg animate-pulse-slow"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-success animate-bounce"></div>
                  
                  <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1.5 z-10">
                    📷 Live Video Stream Active: {cameraSource}
                  </span>
                </>
              ) : (
                <div className="text-center text-xs text-slate-400 italic space-y-2">
                  <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                  <p>Video Feed Offline. Click Start Live Stream to verify camera permissions.</p>
                </div>
              )}
            </div>

            {/* AI checked metrics summary logs */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Live Bounding Boxes:</span>
              
              <div className="space-y-3">
                {detectedItems.map((item, idx) => (
                  <div key={idx} className="p-3.5 border border-border rounded-xl flex justify-between items-center text-xs bg-muted/10">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{item.label}</p>
                      <p className="text-[9px] text-muted-foreground font-mono">Accuracy: {item.score}% score</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-brand-success">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {isCameraActive && (
                <div className="pt-2 border-t border-border space-y-2.5">
                  <p className="text-[10px] text-brand-danger font-bold">⚠️ Warning: Missing reflective safety vest detected on target operator.</p>
                  <button
                    onClick={triggerManualPpeWarning}
                    disabled={isPpeAuditLogged}
                    className="w-full py-2 bg-brand-danger disabled:opacity-50 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1"
                  >
                    Dispatch Safety Violation Audit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT 6: PERMIT TO WORK */}
      {activeSection === 'permits' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="border-b border-border pb-4">
            <h3 className="font-heading font-extrabold text-sm">Working Permits Authorization Registry</h3>
            <p className="text-[10px] text-muted-foreground">Mandatory safety clearance validation rosters for hazardous work categories.</p>
          </div>

          <div className="space-y-4">
            {permits.map((pmt) => (
              <div key={pmt.id} className="p-4 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-brand-accent/15 text-brand-accent rounded-lg">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{pmt.title}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">Type: {pmt.permitType} • Crew: {pmt.crewName}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      pmt.status === 'Approved' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-safety/10 text-brand-safety'
                    }`}>
                      {pmt.status}
                    </span>
                    <p className="text-[9px] text-muted-foreground font-mono mt-1">Expiry: {pmt.expiry.split(' ')[1] || pmt.expiry}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActivePermitId(pmt.id)
                      setPermitExpiry(pmt.expiry)
                      setIsPermitModalOpen(true)
                    }}
                    className="px-2.5 py-1 bg-muted hover:bg-slate-700 hover:text-white rounded font-bold text-[10px] transition-all"
                  >
                    Renew
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEWPORT 7: SOS ASSEMBLY MAP */}
      {activeSection === 'emergency' && (
        <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-6 rounded-2xl shadow-raised">
          <div className="border-b border-border pb-4">
            <h3 className="font-heading font-extrabold text-sm">Site Emergency Corridors & Assembly Points</h3>
            <p className="text-[10px] text-muted-foreground">Evacuation paths routing guidelines and live operator locations map.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 relative h-96 bg-muted/20 border border-border/30 rounded-xl overflow-hidden flex items-center justify-center">
              
              <svg className="w-full h-full p-4" viewBox="0 0 500 300">
                <circle cx="120" cy="100" r="45" fill="rgba(34,197,94,0.08)" stroke="var(--brand-success)" strokeWidth="2" strokeDasharray="3" />
                <text x="120" y="103" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--brand-success)" className="font-mono">ASSEMBLY A</text>

                <path d="M 120 145 Q 200 180 320 180" fill="none" stroke="var(--brand-success)" strokeWidth="2.5" strokeDasharray="5" />
                <text x="210" y="170" fontSize="8" fill="var(--brand-success)" className="font-mono">EVAC CORRIDOR</text>

                <circle cx="370" cy="180" r="40" fill="rgba(239,68,68,0.05)" stroke="var(--brand-danger)" strokeWidth="1" />
                <text x="370" y="183" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--brand-danger)" className="font-mono">DANGER ZONE</text>
                
                {gpsLocations.map((loc, idx) => {
                  const isHovered = selectedMapPin === loc.id
                  const cx = 150 + (idx * 100)
                  const cy = 100 + (idx * 40)
                  return (
                    <g key={loc.id} className="cursor-pointer" onClick={() => setSelectedMapPin(loc.id)}>
                      <circle cx={cx} cy={cy} r={isHovered ? "10" : "7"} className={`${isHovered ? 'fill-brand-safety' : 'fill-brand-accent'} transition-all`} />
                    </g>
                  )
                })}
              </svg>

              <div className="absolute top-3 left-3 bg-[#101625]/85 border border-border p-2.5 rounded-lg text-[9px] font-bold text-slate-355 space-y-1 font-mono">
                <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-success"></span> Assembly Corridor</p>
                <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-danger"></span> High Risk Excavation</p>
              </div>

              {selectedMapPin && (() => {
                const loc = gpsLocations.find(l => l.id === selectedMapPin)
                if (!loc) return null
                return (
                  <div className="absolute bottom-4 left-4 right-4 bg-[#101625]/90 border border-brand-safety p-3 rounded-lg text-left text-xs animate-fade-in flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{loc.workerName} ({loc.role})</p>
                      <p className="text-[10px] text-slate-355 font-mono">Zone: {loc.zone} • Lat/Lng: {loc.lat}, {loc.lng}</p>
                    </div>
                    <button onClick={() => setSelectedMapPin(null)} className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              })()}
            </div>

            <div className="lg:col-span-4 space-y-4 text-xs">
              <div className="p-4 bg-brand-danger/5 border border-brand-danger/20 rounded-xl space-y-2">
                <span className="font-bold text-brand-danger block">SOS Assembly Contacts:</span>
                <p>🚑 Site Paramedics: (555) EHS-HELP</p>
                <p>🚒 Fire safety Marshall: (555) EHS-FIRE</p>
              </div>

              <div className="p-4 bg-muted/40 rounded-xl space-y-2">
                <span className="font-bold block">Evacuation Procedures:</span>
                <ol className="list-decimal pl-4 space-y-1.5 text-[10px] text-muted-foreground leading-relaxed">
                  <li>Leave heavy equipment anchored and shut down motor gears immediately.</li>
                  <li>Walk along green corridor arrows to Assembly Zone A.</li>
                  <li>Remain at assembly points for roll call checks validation.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: LOG HAZARD FORM */}
      {isHazardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsHazardModalOpen(false)}></div>
          
          <form onSubmit={handleHazardSubmit} className="w-full max-w-md bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Record Safety Hazard</h3>
                <p className="text-[10px] text-muted-foreground">Log site safety compliance hazards.</p>
              </div>
              <button type="button" onClick={() => setIsHazardModalOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">Hazard Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Loose scaffold pipes left inside access pathway"
                  value={hazTitle}
                  onChange={(e) => setHazTitle(e.target.value)}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">Category</label>
                  <select
                    value={hazCat}
                    onChange={(e) => setHazCat(e.target.value as 'Fall' | 'Electrical' | 'StruckBy' | 'CaughtInBetween' | 'Chemical' | 'Other')}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                  >
                    <option value="Fall">Fall Hazard</option>
                    <option value="Electrical">Electrical</option>
                    <option value="StruckBy">Struck By</option>
                    <option value="CaughtInBetween">Caught In-Between</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">Risk Level</label>
                  <select
                    value={hazRisk}
                    onChange={(e) => setHazRisk(e.target.value as 'Low' | 'Medium' | 'High' | 'Critical')}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">Site Location</label>
                  <input
                    type="text"
                    required
                    value={hazLoc}
                    onChange={(e) => setHazLoc(e.target.value)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">Assigned Inspector</label>
                  <input
                    type="text"
                    required
                    value={hazAssign}
                    onChange={(e) => setHazAssign(e.target.value)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button
                type="button"
                onClick={() => setIsHazardModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-safety text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all"
              >
                Submit Hazard Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: LOG INCIDENT FORM */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsIncidentModalOpen(false)}></div>
          
          <form onSubmit={handleIncidentSubmit} className="w-full max-w-md bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Log Accident / Incident</h3>
                <p className="text-[10px] text-muted-foreground">Register structural issues or safety near misses.</p>
              </div>
              <button type="button" onClick={() => setIsIncidentModalOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">Incident Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crane load cable sway clash hooks"
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">Severity Tier</label>
                <select
                  value={incSeverity}
                  onChange={(e) => setIncSeverity(e.target.value as 'NearMiss' | 'Minor' | 'Major' | 'Fatal')}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                >
                  <option value="NearMiss">Near Miss (No Injuries)</option>
                  <option value="Minor">Minor (First Aid)</option>
                  <option value="Major">Major (Lost Time / Hospitalized)</option>
                  <option value="Fatal">Fatal Incident</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button
                type="button"
                onClick={() => setIsIncidentModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-danger text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all"
              >
                Register Incident
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: PERMIT RENEWAL FORM */}
      {isPermitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsPermitModalOpen(false)}></div>
          
          <form onSubmit={handlePermitSubmit} className="w-full max-w-md bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Renew Permit Clearance</h3>
                <p className="text-[10px] text-muted-foreground">Submit safety authorization validation updates.</p>
              </div>
              <button type="button" onClick={() => setIsPermitModalOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">New Authorization Expiry Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-06-25 04:00 PM"
                  value={permitExpiry}
                  onChange={(e) => setPermitExpiry(e.target.value)}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button
                type="button"
                onClick={() => setIsPermitModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-safety text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Commit Renewal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: START AUDIT FORM */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsAuditModalOpen(false)}></div>
          
          <form onSubmit={handleAuditSubmit} className="w-full max-w-md bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Start Scaffolding/Trench Audit</h3>
                <p className="text-[10px] text-muted-foreground">Submit safety checks parameter passes.</p>
              </div>
              <button type="button" onClick={() => setIsAuditModalOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">Audit Target Scaffolding</label>
                <input
                  type="text"
                  required
                  value={auditTarget}
                  onChange={(e) => setAuditTarget(e.target.value)}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">Safety Score (%)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={auditScore}
                    onChange={(e) => setAuditScore(Number(e.target.value))}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-355 font-mono">Supervisor Signature</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dave Miller"
                    value={auditSignature}
                    onChange={(e) => setAuditSignature(e.target.value)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-success text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all"
              >
                Submit Audit pass
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
