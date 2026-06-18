import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjectStore } from '../store/projectStore'
import {
  Plus,
  Search,
  AlertTriangle,
  ArrowRight,
  X,
  DollarSign
} from 'lucide-react'

export default function Projects() {
  const projects = useProjectStore((state) => state.projects)
  const addProject = useProjectStore((state) => state.addProject)

  const [search, setSearch] = useState("")
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)

  // Wizard Form States
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [budget, setBudget] = useState("")
  const [progress, setProgress] = useState(0)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !location) return
    addProject({
      name,
      location,
      budget: `$${budget}M`,
      progress,
      hazards: 0
    })
    // Reset & Close
    setIsWizardOpen(false)
    setWizardStep(1)
    setName("")
    setLocation("")
    setBudget("")
    setProgress(0)
  }

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div className="text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold">Projects Directory</h1>
          <p className="text-xs text-muted-foreground">Monitor and manage all active construction project scopes.</p>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="px-4 py-2 bg-brand-safety text-white text-xs font-semibold rounded-lg hover:bg-brand-safety/90 shadow shadow-brand-safety/10 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Filters */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter projects by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border border-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-safety"
        />
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised hover:shadow-floating hover:border-brand-safety transition-all flex flex-col justify-between h-56 text-left group"
          >
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white group-hover:text-brand-safety transition-colors">
                  {p.name}
                </h3>
                {p.hazards > 0 && (
                  <span className="text-[9px] bg-brand-danger/10 text-brand-danger border border-brand-danger/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse-slow">
                    <AlertTriangle className="w-3 h-3" />
                    {p.hazards} Alerts
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{p.location}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-semibold">Budget Profile</span>
                <span className="font-bold">{p.budget}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>WBS Completion</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-accent h-full transition-all" style={{ width: `${p.progress}%` }}></div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-1 md:col-span-3 text-center py-12 border border-dashed border-border rounded-xl text-xs text-muted-foreground italic">
            No matching projects found.
          </div>
        )}
      </div>

      {/* 2-Step Project Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsWizardOpen(false)} className="fixed inset-0 bg-brand-obsidian/60 dark:bg-black/70 backdrop-blur-sm"></div>

          <div className="w-full max-w-md bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 sm:p-8 relative z-10 shadow-floating text-xs">
            <button
              onClick={() => setIsWizardOpen(false)}
              className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded absolute right-4 top-4"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4 text-left">
              <div className="border-b border-border pb-3">
                <h3 className="font-heading font-bold text-base">Create New Project Wizard</h3>
                <p className="text-[10px] text-muted-foreground">Step {wizardStep} of 2</p>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {wizardStep === 1 ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-350">Project Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tower B Structural Frame"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-350">Site Location (City, State)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Houston, TX"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      disabled={!name || !location}
                      className="w-full py-2.5 bg-brand-safety text-white font-semibold rounded hover:bg-brand-safety/90 transition-all flex items-center justify-center gap-1"
                    >
                      Next Step
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-350">Authorized Budget (Millions USD)</label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          placeholder="e.g. 45"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full p-2.5 pl-8 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
                        />
                        <DollarSign className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3.5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-350">Initial Progress (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="e.g. 0"
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        className="w-full p-2.5 rounded border border-border bg-transparent focus:outline-none focus:border-brand-safety"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setWizardStep(1)}
                        className="w-1/2 py-2.5 border border-border text-foreground hover:bg-muted dark:hover:bg-slate-800 rounded font-semibold transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 bg-brand-safety text-white font-semibold rounded hover:bg-brand-safety/90 transition-all"
                      >
                        Launch Project
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
