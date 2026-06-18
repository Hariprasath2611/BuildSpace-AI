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
  IdCard,
  UserPlus
} from 'lucide-react'

export default function Workforce() {
  const workers = useWorkforceStore((state) => state.workers)
  const attendance = useWorkforceStore((state) => state.attendance)
  const onboardEmployee = useWorkforceStore((state) => state.onboardEmployee)

  const [search, setSearch] = useState("")
  const [selectedDept, setSelectedDept] = useState<string>("All")
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)

  // Wizard Onboarding States
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [department, setDepartment] = useState("Structure")
  const [employmentType, setEmploymentType] = useState<'Direct' | 'Subcontractor' | 'Hourly'>('Direct')
  const [skillsText, setSkillsText] = useState("")
  const [allocation, setAllocation] = useState("")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !role) return
    const skills = skillsText.split(',').map(s => s.trim()).filter(Boolean)
    
    onboardEmployee({
      name,
      role,
      department,
      skills,
      allocation: allocation || "Unassigned",
      employmentType
    })

    // Reset wizard
    setIsWizardOpen(false)
    setWizardStep(1)
    setName("")
    setRole("")
    setDepartment("Structure")
    setEmploymentType('Direct')
    setSkillsText("")
    setAllocation("")
  }

  const depts = ["All", "Structure", "Safety", "Excavation", "Mechanical"]

  const filtered = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || 
                          w.role.toLowerCase().includes(search.toLowerCase())
    const matchesDept = selectedDept === "All" || w.department === selectedDept
    return matchesSearch && matchesDept
  })

  // Calculations
  const activeCount = workers.filter(w => w.status === 'Active').length
  const directCount = workers.filter(w => w.employmentType === 'Direct').length
  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = attendance.filter(att => att.date === today).length

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6 gap-4">
        <div className="text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">Workforce Control Center</h1>
          <p className="text-xs text-muted-foreground">Manage active direct workforce crews, approve subcontractor timesheets, and track site geofence entry cards.</p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="self-start sm:self-center px-4 py-2.5 bg-brand-safety text-white text-xs font-bold rounded-lg hover:bg-brand-safety/90 shadow shadow-brand-safety/15 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Onboard Worker
        </button>
      </div>

      {/* Telemetry metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised text-left space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total Workforce</span>
            <Users className="w-4 h-4 text-brand-safety" />
          </div>
          <p className="text-2xl font-bold font-heading">{workers.length} workers</p>
          <p className="text-[10px] text-muted-foreground">
            {directCount} Direct Employees • {workers.length - directCount} Contractors
          </p>
        </div>

        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised text-left space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Attendance</span>
            <UserCheck className="w-4 h-4 text-brand-success" />
          </div>
          <p className="text-2xl font-bold font-heading">{todayAttendance} active</p>
          <p className="text-[10px] text-brand-success font-semibold">
            🟢 {activeCount} checked in inside geofenced zones
          </p>
        </div>

        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised text-left space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Safety Compliance</span>
            <ClipboardCheck className="w-4 h-4 text-brand-accent" />
          </div>
          <p className="text-2xl font-bold font-heading">98% Score</p>
          <p className="text-[10px] text-brand-accent font-semibold flex items-center gap-1">
            ★ All active trade credentials verified
          </p>
        </div>
      </div>

      {/* Filters & Search bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#141B2D] border border-border p-4 rounded-xl shadow-raised text-left">
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

      {/* Directory Render */}
      {filtered.length === 0 ? (
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
          {filtered.map((w) => (
            <div
              key={w.id}
              className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised relative flex flex-col justify-between gap-4 group hover:shadow-floating transition-all duration-200"
            >
              <div className="text-left space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-safety px-2.5 py-0.5 bg-brand-safety/10 rounded-full">
                  {w.department}
                </span>
                <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white line-clamp-1 pt-1">
                  {w.name}
                </h3>
                <p className="text-[10px] font-semibold text-brand-accent">{w.role}</p>
                <p className="text-xs text-slate-500 line-clamp-1">Allocation: {w.allocation}</p>
              </div>

              <div className="border-t border-border pt-4 text-left flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Safety Score</span>
                  <span className="text-xs font-bold font-heading">{w.safetyRating}% index</span>
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    w.status === 'Active' ? 'bg-brand-success/10 text-brand-success' : 'bg-slate-300 dark:bg-slate-800 text-muted-foreground'
                  }`}>
                    {w.status}
                  </span>
                </div>
              </div>

              <Link
                to={`/workforce/${w.id}`}
                className="w-full py-2 bg-muted hover:bg-brand-safety hover:text-white text-center text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1"
              >
                View Profile Workspace
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl shadow-raised overflow-x-auto text-left">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase tracking-wider font-bold">
                <th className="p-4">Name / ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Role</th>
                <th className="p-4">Allocation Site</th>
                <th className="p-4">Employment Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{w.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">ID: {w.id}</p>
                    </div>
                  </td>
                  <td className="p-4">{w.department}</td>
                  <td className="p-4 font-semibold text-brand-accent">{w.role}</td>
                  <td className="p-4">{w.allocation}</td>
                  <td className="p-4">{w.employmentType}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      w.status === 'Active' ? 'bg-brand-success/10 text-brand-success' : 'bg-slate-300 dark:bg-slate-800 text-muted-foreground'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/workforce/${w.id}`}
                      className="inline-flex px-3 py-1.5 bg-muted hover:bg-brand-safety hover:text-white rounded-md transition-all font-bold"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Onboard Worker wizard dialog modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsWizardOpen(false)}></div>
          
          <div className="w-full max-w-lg bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Onboard Workforce Member</h3>
                <p className="text-[10px] text-muted-foreground">Step {wizardStep} of 3 — Verify identity & trade skills</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* steps indicator */}
            <div className="bg-muted/30 px-5 py-2.5 border-b border-border flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <span className={wizardStep >= 1 ? 'text-brand-safety' : ''}>1. Identity</span>
              <span className="text-slate-300">/</span>
              <span className={wizardStep >= 2 ? 'text-brand-safety' : ''}>2. Contract</span>
              <span className="text-slate-300">/</span>
              <span className={wizardStep >= 3 ? 'text-brand-safety' : ''}>3. Skills assignment</span>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate} className="p-5 flex-1 space-y-4">
              
              {wizardStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Worker Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <div className="p-3 border border-dashed border-border rounded-xl text-center text-xs text-muted-foreground space-y-1 bg-muted/20">
                    <IdCard className="w-6 h-6 mx-auto text-slate-400" />
                    <span className="block font-bold">Identity Verification required</span>
                    <span className="text-[10px]">Provide digital worker passport or ID card</span>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Designated Role / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Steel Structural Rigger"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                      >
                        <option value="Structure">Structure</option>
                        <option value="Safety">Safety</option>
                        <option value="Excavation">Excavation</option>
                        <option value="Mechanical">Mechanical</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Contract Type</label>
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value as any)}
                        className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                      >
                        <option value="Direct">Direct</option>
                        <option value="Subcontractor">Subcontractor</option>
                        <option value="Hourly">Hourly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350 flex justify-between items-center">
                      <span>Trade Skills (comma separated)</span>
                      <span className="text-[10px] text-brand-safety font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Auto-suggest skills
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tower Crane Operation, Rigging Level II"
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Initial Project Site Allocation</label>
                    <input
                      type="text"
                      placeholder="e.g. Tower A Residences"
                      value={allocation}
                      onChange={(e) => setAllocation(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Navigation controls */}
              <div className="pt-4 border-t border-border flex justify-between items-center">
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {wizardStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="px-4 py-2 bg-brand-safety text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1"
                  >
                    Continue <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-accent text-brand-obsidian text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Save & Onboard
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}
