import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSafetyStore } from '../store/safetyStore'
import {
  ArrowLeft,
  ShieldAlert,
  Send,
  Plus,
  Trash2,
  FileText,
  Activity,
  CheckCircle2
} from 'lucide-react'

export default function SafetyDetail() {
  const { incidentId } = useParams()
  const incidents = useSafetyStore((state) => state.incidents)
  
  const updateRca = useSafetyStore((state) => state.updateRca)
  const addWitnessStatement = useSafetyStore((state) => state.addWitnessStatement)

  const activeIncident = incidents.find(i => i.id === incidentId) || incidents[0]

  const [activeTab, setActiveTab] = useState<'rca' | 'witness' | 'actions'>('rca')

  // Five Whys input states
  const [why1, setWhy1] = useState(activeIncident.rootCause[0] || "")
  const [why2, setWhy2] = useState(activeIncident.rootCause[1] || "")
  const [why3, setWhy3] = useState(activeIncident.rootCause[2] || "")
  const [why4, setWhy4] = useState(activeIncident.rootCause[3] || "")
  const [why5, setWhy5] = useState(activeIncident.rootCause[4] || "")

  // Witness statement states
  const [witnessName, setWitnessName] = useState("")
  const [witnessText, setWitnessText] = useState("")

  const handleRcaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const whys = [why1, why2, why3, why4, why5].filter(Boolean)
    updateRca(activeIncident.id, whys)
    alert("Root Cause Analysis (5-Whys model) updated successfully.")
  }

  const handleWitnessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!witnessName || !witnessText) return
    addWitnessStatement(activeIncident.id, witnessName, witnessText)
    setWitnessName("")
    setWitnessText("")
  }

  const handleExportOsha = () => {
    alert(`OSHA Form 301 (Incident Report) compiled successfully for incident: ${activeIncident.id}. Dispatching to PDF...`)
  }

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/safety"
            className="p-2 hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all"
            title="Back to Safety Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-danger px-2 py-0.5 bg-brand-danger/10 rounded-full font-mono">
                ID: {activeIncident.id}
              </span>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-slate-800 dark:text-white">
                {activeIncident.title}
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Severity: {activeIncident.severity} • Logged: {activeIncident.loggedAt}
            </p>
          </div>
        </div>

        {/* OSHA Export Action */}
        <button
          onClick={handleExportOsha}
          className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border border-border/30"
        >
          <FileText className="w-4 h-4 text-brand-safety" />
          Export OSHA Form 301
        </button>
      </div>

      {/* Main split content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation & forms column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs Nav */}
          <div className="flex border-b border-border gap-1 bg-muted/40 p-1 rounded-xl">
            {(['rca', 'witness', 'actions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#141B2D] text-slate-800 dark:text-white shadow shadow-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab === 'rca' ? 'Root Cause Analysis' : tab === 'witness' ? 'Witness Statements' : 'Corrective Actions'}
              </button>
            ))}
          </div>

          {/* Root Cause Analysis Tab */}
          {activeTab === 'rca' && (
            <form onSubmit={handleRcaSubmit} className="bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-4">
              <div className="border-b border-border pb-2">
                <h3 className="font-heading font-extrabold text-sm">RCA Investigation: Five Whys Model</h3>
                <p className="text-[10px] text-muted-foreground">Enforcing chronological deduction steps for incident prevention.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">1. Why did the incident occur?</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Crane load cable clashed with beam"
                    value={why1}
                    onChange={(e) => setWhy1(e.target.value)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">2. Why did that happen?</label>
                  <input
                    type="text"
                    placeholder="e.g. Heavy wind gusts exceeded maximum safe limits, causing load sway"
                    value={why2}
                    onChange={(e) => setWhy2(e.target.value)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">3. Why was that not prevented?</label>
                  <input
                    type="text"
                    placeholder="e.g. Supervisor did not review the real-time wind speed telemetry alerts"
                    value={why3}
                    onChange={(e) => setWhy3(e.target.value)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">4. Why was it not reviewed?</label>
                  <input
                    type="text"
                    placeholder="e.g. Communications delay inside EHS field tablet notifications"
                    value={why4}
                    onChange={(e) => setWhy4(e.target.value)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">5. Why did the communication delay occur?</label>
                  <input
                    type="text"
                    placeholder="e.g. Offline sync resolution engine had queue conflicts"
                    value={why5}
                    onChange={(e) => setWhy5(e.target.value)}
                    className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-safety text-white hover:opacity-90 rounded-lg font-bold text-xs"
                >
                  Save RCA Analysis
                </button>
              </div>
            </form>
          )}

          {/* Witness Statements Tab */}
          {activeTab === 'witness' && (
            <div className="space-y-6 animate-fade-in">
              {/* Existing Statements */}
              <div className="bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-4">
                <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block border-b border-border pb-2 font-mono">
                  Recorded Witness Statements
                </span>

                {activeIncident.witnessStatements.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center py-6">No witness statements recorded.</p>
                ) : (
                  <div className="space-y-3">
                    {activeIncident.witnessStatements.map((ws, idx) => (
                      <div key={idx} className="p-3 border border-border rounded-xl text-xs space-y-1 bg-muted/20">
                        <p className="font-bold text-slate-800 dark:text-white">{ws.witness}</p>
                        <p className="text-muted-foreground leading-relaxed">"{ws.statement}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add statement form */}
              <form onSubmit={handleWitnessSubmit} className="bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-4">
                <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block border-b border-border pb-2">
                  Record Witness Statement
                </span>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Witness Name & Role</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe (Operator)"
                      value={witnessName}
                      onChange={(e) => setWitnessName(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Statement Testimony</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Input witness statement details..."
                      value={witnessText}
                      onChange={(e) => setWitnessText(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-safety text-white hover:opacity-90 rounded-lg font-bold text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Log Witness statement
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Corrective Actions Tab */}
          {activeTab === 'actions' && (
            <div className="bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-4 animate-fade-in">
              <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block border-b border-border pb-2">
                OSHA Mandated Corrective Action Tasks
              </span>

              <div className="space-y-3 text-xs">
                {[
                  { desc: "Enforce mandatory EHS crane wind limits safety training class", done: true },
                  { desc: "Calibrate meteorological digital wind gauges", done: false },
                  { desc: "Update weather notification guidelines for lift riggers", done: false }
                ].map((act, idx) => (
                  <div key={idx} className="p-3 border border-border rounded-xl flex items-center justify-between hover:bg-muted/10 transition-all">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{act.desc}</span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                      act.done ? 'bg-brand-success/15 text-brand-success' : 'bg-brand-safety/15 text-brand-safety'
                    }`}>
                      {act.done ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Info Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-5 text-xs text-left">
          <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider block border-b border-border pb-2">
            Investigation Status
          </span>

          <div className="space-y-3 font-mono text-[10px] text-muted-foreground">
            <p className="flex justify-between">
              <span>Incident ID:</span>
              <span className="font-bold text-foreground">{activeIncident.id}</span>
            </p>
            <p className="flex justify-between">
              <span>EHS Status:</span>
              <span className="font-bold text-brand-safety uppercase">{activeIncident.status}</span>
            </p>
            <p className="flex justify-between">
              <span>TRIR Score Flag:</span>
              <span className="font-bold text-brand-danger">⚠️ Yes</span>
            </p>
          </div>

          <div className="bg-brand-safety/5 border border-brand-safety/20 p-3.5 rounded-xl space-y-1.5">
            <span className="font-bold text-brand-safety block text-[11px]">EHS Supervisor Note:</span>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Ensure OSHA Form 301 is signed and uploaded to the compliance logs within 7 days of incident logging.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
