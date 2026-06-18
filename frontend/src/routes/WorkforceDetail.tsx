import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useWorkforceStore } from '../store/workforceStore'
import {
  ArrowLeft,
  Send,
  Sparkles,
  Building2,
  Clock,
  ShieldAlert,
  CalendarDays,
  Activity,
  X
} from 'lucide-react'

export default function WorkforceDetail() {
  const { employeeId } = useParams()
  const workers = useWorkforceStore((state) => state.workers)
  const attendance = useWorkforceStore((state) => state.attendance)
  const shifts = useWorkforceStore((state) => state.shifts)
  const certifications = useWorkforceStore((state) => state.certifications)

  const clockInWorker = useWorkforceStore((state) => state.clockInWorker)
  const clockOutWorker = useWorkforceStore((state) => state.clockOutWorker)
  const renewCertification = useWorkforceStore((state) => state.renewCertification)
  const assignShift = useWorkforceStore((state) => state.assignShift)

  const activeWorker = workers.find(w => w.id === employeeId) || workers[0]

  const [activeTab, setActiveTab] = useState<'overview' | 'certifications' | 'shifts' | 'attendance'>('overview')

  // Cert Form States
  const [activeCertId, setActiveCertId] = useState("")
  const [certExpiry, setCertExpiry] = useState("2027-12-31")
  const [isRenewOpen, setIsRenewOpen] = useState(false)

  // Shift assignment states
  const [shiftDay, setShiftDay] = useState("Mon")
  const [shiftType, setShiftType] = useState<'Day Shift' | 'Night Shift' | 'Off'>('Day Shift')

  // AI Assistant Chat Box State
  const [aiQuery, setAiQuery] = useState("")
  const [aiChatLog, setAiChatLog] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: `Hello! I am your AI Workforce Assistant. Ask me about certification compliance audits, shift optimization, or replacement operators for ${activeWorker.name}.` }
  ])

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiQuery.trim()) return
    const nextLog = [...aiChatLog, { sender: 'user' as const, text: aiQuery }]
    setAiChatLog(nextLog)
    setAiQuery("")

    setTimeout(() => {
      let reply = ""
      const lower = aiQuery.toLowerCase()
      if (lower.includes('cert') || lower.includes('license') || lower.includes('credential')) {
        reply = `For ${activeWorker.name}, active credentials include: NCCCO crane, OSHA 30. One license is warning expiry parameters soon.`
      } else if (lower.includes('shift') || lower.includes('schedule') || lower.includes('rotation')) {
        reply = `Shift rotations are mapped across Day vs Night intervals. If ${activeWorker.name} takes leave, I suggest Tom Harris (Heavy Operator, Available) as replacement.`
      } else {
        reply = `Analyzing logs... Workforce productivity score is optimal. Recommending regular rotation intervals.`
      }
      setAiChatLog(prev => [...prev, { sender: 'ai' as const, text: reply }])
    }, 800)
  }

  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeCertId || !certExpiry) return
    renewCertification(activeCertId, certExpiry)
    setIsRenewOpen(false)
    setActiveCertId("")
  }

  const handleAssignShift = (e: React.FormEvent) => {
    e.preventDefault()
    assignShift(activeWorker.id, shiftDay, shiftType)
  }

  // Filtered lists
  const workerCerts = certifications.filter(c => c.workerId === activeWorker.id)
  const workerShifts = shifts.filter(s => s.workerId === activeWorker.id)
  const workerAttendance = attendance.filter(att => att.workerId === activeWorker.id)

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const today = new Date().toISOString().split('T')[0]
  const isClockedInToday = attendance.some(att => att.workerId === activeWorker.id && att.date === today && att.clockOut === '---')

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/workforce"
            className="p-2 hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all"
            title="Back to Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-safety px-2 py-0.5 bg-brand-safety/10 rounded-full font-mono">
                ID: {activeWorker.id}
              </span>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-slate-800 dark:text-white">
                {activeWorker.name}
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Title: {activeWorker.role} • employment: {activeWorker.employmentType} ({activeWorker.department})</p>
          </div>
        </div>

        {/* Clock In / Out Triggers */}
        <div className="flex gap-2">
          {isClockedInToday ? (
            <button
              onClick={() => clockOutWorker(activeWorker.id)}
              className="px-4 py-2 bg-brand-danger text-white text-xs font-bold rounded-lg hover:opacity-95 shadow transition-all flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" /> Clock Out
            </button>
          ) : (
            <button
              onClick={() => clockInWorker(activeWorker.id, "Gate A (Main Yard)")}
              className="px-4 py-2 bg-brand-success text-white text-xs font-bold rounded-lg hover:opacity-95 shadow transition-all flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" /> Clock In
            </button>
          )}
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main tabs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Navigation tabs */}
          <div className="flex flex-wrap border-b border-border gap-1 bg-muted/40 p-1 rounded-xl">
            {(['overview', 'certifications', 'shifts', 'attendance'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-lg text-xs font-extrabold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#141B2D] text-slate-800 dark:text-white shadow shadow-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Safety compliance</span>
                  <p className="text-xl font-bold font-heading">{activeWorker.safetyRating}% index</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div
                      className="h-1.5 rounded-full bg-brand-success"
                      style={{ width: `${activeWorker.safetyRating}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Active Site Allocation</span>
                  <p className="text-sm font-bold pt-1">{activeWorker.allocation}</p>
                </div>

                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Active Credentials</span>
                  <p className="text-sm font-bold pt-1">{workerCerts.length} verified licenses</p>
                </div>
              </div>

              {/* Skills and details card */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm border-b border-border pb-2">Workforce Skills & Compliance</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <span className="font-bold text-slate-500 block">Assigned Trade Skills:</span>
                    <div className="flex flex-wrap gap-2">
                      {activeWorker.skills.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-muted rounded-lg font-bold font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-brand-safety/5 border border-brand-safety/20 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-brand-safety text-xs font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>AI Replacement warning</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {workerCerts.some(c => c.status === 'Warning')
                        ? "⚠️ Credential warning alert: NCCCO Crane operator license is expiring soon. Review certifications tab to renew."
                        : workerCerts.some(c => c.status === 'Expired')
                        ? "🔴 Credential breach alert: AWS Structural welding license has expired. Action required to renew."
                        : "🟢 All safety trade clearances verified active. No warnings."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised">
              <h3 className="font-heading font-extrabold text-sm border-b border-border pb-2">Safety Trade Credentials & Licenses</h3>
              
              {workerCerts.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-8">No certifications registered.</p>
              ) : (
                <div className="space-y-3 pt-2">
                  {workerCerts.map((c) => (
                    <div key={c.id} className="p-3 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4.5 h-4.5 text-brand-safety flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">Expires: {c.expiryDate} • ID: {c.id}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          c.status === 'Active' ? 'bg-brand-success/10 text-brand-success' :
                          c.status === 'Warning' ? 'bg-brand-safety/10 text-brand-safety' : 'bg-brand-danger/10 text-brand-danger'
                        }`}>
                          {c.status}
                        </span>
                        
                        <button
                          onClick={() => {
                            setActiveCertId(c.id)
                            setCertExpiry(c.expiryDate)
                            setIsRenewOpen(true)
                          }}
                          className="px-2.5 py-1 bg-muted hover:bg-slate-700 hover:text-white rounded font-bold text-[10px] transition-all"
                        >
                          Renew
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shifts Tab */}
          {activeTab === 'shifts' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Shift Schedule Table */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm border-b border-border pb-2">Weekly Shift Rotations</h3>
                
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {days.map((d) => {
                    const assignment = workerShifts.find(s => s.day === d)
                    const shiftType = assignment ? assignment.type : 'Off'
                    return (
                      <div key={d} className="p-3 border border-border rounded-xl bg-muted/20 space-y-1.5">
                        <span className="font-bold block text-muted-foreground">{d}</span>
                        <span className={`text-[10px] font-extrabold block uppercase ${
                          shiftType === 'Day Shift' ? 'text-brand-success' :
                          shiftType === 'Night Shift' ? 'text-brand-accent' : 'text-slate-400'
                        }`}>
                          {shiftType}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Assign Shift Form */}
              <form onSubmit={handleAssignShift} className="bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-4">
                <h4 className="font-heading font-extrabold text-xs border-b border-border pb-2 flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-brand-safety" />
                  Assign Shift Schedule
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Weekday</label>
                    <select
                      value={shiftDay}
                      onChange={(e) => setShiftDay(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                    >
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Shift rotation</label>
                    <select
                      value={shiftType}
                      onChange={(e) => setShiftType(e.target.value as any)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                    >
                      <option value="Day Shift">Day Shift</option>
                      <option value="Night Shift">Night Shift</option>
                      <option value="Off">Off (Roster Rest)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-safety text-white hover:opacity-90 rounded-lg font-bold text-xs flex items-center gap-1.5"
                >
                  Save Shift Roster
                </button>
              </form>

            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <h3 className="font-heading font-extrabold text-sm">Attendance Geofenced Clock Logs</h3>
                <span className="text-[10px] font-bold text-brand-success flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> Geofence Gate Validation Active
                </span>
              </div>
              
              {workerAttendance.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-8">No clock logs recorded.</p>
              ) : (
                <div className="space-y-2 pt-2 max-h-80 overflow-y-auto pr-1">
                  {workerAttendance.map((att) => (
                    <div key={att.id} className="p-3 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{att.geofence}</p>
                        <p className="text-[10px] text-muted-foreground">{att.date} • {att.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-brand-success font-semibold">In: {att.clockIn}</p>
                        <p className="text-slate-500">Out: {att.clockOut}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* AI Assistant Persistent Sidebar Drawer */}
        <div className="lg:col-span-4 bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-raised flex flex-col overflow-hidden max-h-[500px]">
          <div className="p-4 bg-muted/40 border-b border-border flex justify-between items-center">
            <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              AI Workforce Assistant
            </span>
            <span className="text-[9px] font-bold text-brand-success flex items-center gap-1">
              🟢 Live Planner
            </span>
          </div>

          {/* Conversation log */}
          <div className="p-4 flex-1 space-y-3 overflow-y-auto text-xs min-h-[300px] max-h-[350px]">
            {aiChatLog.map((chat, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                  chat.sender === 'user'
                    ? 'bg-brand-safety text-white ml-auto text-right'
                    : 'bg-muted dark:bg-slate-900/60 text-slate-700 dark:text-slate-350 mr-auto text-left border border-border/40'
                }`}
              >
                {chat.text}
              </div>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleAiSubmit} className="p-3 border-t border-border flex gap-2">
            <input
              type="text"
              placeholder="Ask AI replacement crew..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="flex-1 p-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg text-left"
            />
            <button
              type="submit"
              className="p-2 bg-brand-obsidian text-white dark:bg-white dark:text-brand-obsidian hover:opacity-90 rounded-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Renew Cert dialog modal */}
      {isRenewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsRenewOpen(false)}></div>
          
          <form onSubmit={handleRenewSubmit} className="w-full max-w-md bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Renew Safety Credential</h3>
                <p className="text-[10px] text-muted-foreground">Submit credential validation dates updates</p>
              </div>
              <button type="button" onClick={() => setIsRenewOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">New Certification Expiry Date</label>
                <input
                  type="date"
                  required
                  value={certExpiry}
                  onChange={(e) => setCertExpiry(e.target.value)}
                  className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button
                type="button"
                onClick={() => setIsRenewOpen(false)}
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

    </div>
  )
}
