import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProjectStore, WbsNode } from '../store/projectStore'
import {
  FolderGit2,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Compass,
  DollarSign,
  Check,
  Plus,
  X,
  Send,
  Hammer
} from 'lucide-react'

export default function ProjectDetail() {
  const { projectId } = useParams()
  const projects = useProjectStore((state) => state.projects)
  const wbsNodes = useProjectStore((state) => state.wbsNodes)
  const addWbsNode = useProjectStore((state) => state.addWbsNode)
  const updateWbsNode = useProjectStore((state) => state.updateWbsNode)
  const rfis = useProjectStore((state) => state.rfis)
  const addRfiComment = useProjectStore((state) => state.addRfiComment)

  const activeProject = projects.find(p => p.id === projectId) || projects[0]

  const [activeTab, setActiveTab] = useState<'overview' | 'wbs' | 'gantt' | 'rfis' | 'resources'>('overview')

  // WBS Form States
  const [nodeName, setNodeName] = useState("")
  const [nodeCode, setNodeCode] = useState("")
  const [nodeStart, setNodeStart] = useState("2026-06-16")
  const [nodeEnd, setNodeEnd] = useState("2026-07-01")
  const [nodeParent, setNodeParent] = useState<string | null>(null)
  const [isWbsModalOpen, setIsWbsModalOpen] = useState(false)

  // Gantt editor states
  const [selectedGanttNode, setSelectedGanttNode] = useState<WbsNode | null>(null)
  const [ganttProgress, setGanttProgress] = useState(50)

  // RFI states
  const [selectedRfiId, setSelectedRfiId] = useState("rfi_1")
  const [newComment, setNewComment] = useState("")

  const activeRfi = rfis.find(r => r.id === selectedRfiId) || rfis[0]

  const handleAddWbsNode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nodeName || !nodeCode) return
    addWbsNode({
      code: nodeCode,
      name: nodeName,
      start: nodeStart,
      end: nodeEnd,
      progress: 0,
      parentId: nodeParent
    })
    setIsWbsModalOpen(false)
    setNodeName("")
    setNodeCode("")
    setNodeParent(null)
  }

  const handleGanttUpdate = () => {
    if (!selectedGanttNode) return
    updateWbsNode(selectedGanttNode.id, selectedGanttNode.start, selectedGanttNode.end, ganttProgress)
    setSelectedGanttNode(null)
  }

  const handleSendRfiComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment) return
    addRfiComment(activeRfi.id, `Superintendent: ${newComment}`)
    setNewComment("")
  }

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div className="text-left space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
            <Link to="/projects" className="hover:text-brand-safety">Projects</Link>
            <span>/</span>
            <span>{activeProject.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold flex items-center gap-2.5">
            <FolderGit2 className="w-6.5 h-6.5 text-brand-safety" />
            {activeProject.name} Workspace
          </h1>
          <p className="text-xs text-muted-foreground">{activeProject.location} • Authorized Budget: <strong>{activeProject.budget}</strong></p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-muted/40 p-1 rounded-xl border border-border text-xs font-semibold self-start sm:self-center">
          {([
            { id: 'overview', name: 'Overview' },
            { id: 'wbs', name: 'WBS' },
            { id: 'gantt', name: 'Gantt Chart' },
            { id: 'rfis', name: 'RFIs' },
            { id: 'resources', name: 'Resources' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-safety text-white shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TABBED CONTENTS */}
      <div className="animate-fade-in text-xs sm:text-sm">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-white dark:bg-[#141B2D] p-5 rounded-2xl border border-border shadow-raised flex flex-col items-center justify-center space-y-1">
                <CheckCircle2 className="w-7 h-7 text-brand-success" />
                <h4 className="text-xl font-heading font-extrabold">98%</h4>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Site Quality Index</p>
                <span className="text-[10px] text-muted-foreground">OSHA standard compliant</span>
              </div>
              <div className="bg-white dark:bg-[#141B2D] p-5 rounded-2xl border border-border shadow-raised flex flex-col items-center justify-center space-y-1">
                <ShieldAlert className="w-7 h-7 text-brand-safety" />
                <h4 className="text-xl font-heading font-extrabold">{activeProject.hazards} Active</h4>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Safety Incidents</p>
                <span className="text-[10px] text-muted-foreground">0 unresolved clashing issues</span>
              </div>
              <div className="bg-white dark:bg-[#141B2D] p-5 rounded-2xl border border-border shadow-raised flex flex-col items-center justify-center space-y-1">
                <DollarSign className="w-7 h-7 text-brand-accent" />
                <h4 className="text-xl font-heading font-extrabold">-${Number(projectId) === 3 ? '4.8K' : '12.0K'}</h4>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Cost Variance Index</p>
                <span className="text-[10px] text-muted-foreground">🟢 Under budget</span>
              </div>
            </div>

            {/* Weather / Site Map panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left space-y-3">
                <h3 className="font-heading font-bold text-sm">Site Weather Watch</h3>
                <div className="p-3 bg-brand-safety/5 border border-brand-safety/20 rounded-lg flex items-center gap-3">
                  <Clock className="w-8 h-8 text-brand-safety" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">Formwork Crane Operations Permitted</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Wind speed: 12 mph (Hoist threshold: 25 mph)</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised text-left space-y-3">
                <h3 className="font-heading font-bold text-sm">Geofencing & Map Coordinates</h3>
                <div className="p-3 bg-brand-accent/5 border border-brand-accent/20 rounded-lg flex items-center gap-3">
                  <Compass className="w-8 h-8 text-brand-accent" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">Site Fencing Grid: Active</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Pour Zone A coordinate boundary locked.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WBS */}
        {activeTab === 'wbs' && (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-sm sm:text-base">Work Breakdown Structure Nodes</h3>
              <button
                onClick={() => setIsWbsModalOpen(true)}
                className="px-3 py-1.5 bg-brand-safety text-white text-xs font-semibold rounded-lg flex items-center gap-1 hover:bg-brand-safety/90 transition-all shadow shadow-brand-safety/10"
              >
                <Plus className="w-3.5 h-3.5" />
                Add WBS Node
              </button>
            </div>

            {/* WBS Table */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl overflow-hidden shadow-raised">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-muted/50 dark:bg-slate-800/40 text-muted-foreground font-bold border-b border-border">
                      <th className="p-3">Code</th>
                      <th className="p-3">Deliverable / Phase Name</th>
                      <th className="p-3">Timeline Dates</th>
                      <th className="p-3 text-right">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {wbsNodes.map((node) => (
                      <tr key={node.id} className="hover:bg-muted/10 dark:hover:bg-slate-800/10">
                        <td className="p-3 font-mono text-xs">{node.code}</td>
                        <td className={`p-3 font-semibold ${node.parentId ? 'pl-8 text-slate-650 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                          {node.name}
                        </td>
                        <td className="p-3 text-muted-foreground text-xs">{node.start} to {node.end}</td>
                        <td className="p-3 text-right font-bold text-xs">{node.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* WBS Add Node Modal */}
            {isWbsModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div onClick={() => setIsWbsModalOpen(false)} className="fixed inset-0 bg-brand-obsidian/60 dark:bg-black/70 backdrop-blur-sm"></div>
                <div className="w-full max-w-sm bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 relative z-10 shadow-floating text-xs space-y-4">
                  <div className="border-b border-border pb-2 flex justify-between items-center">
                    <h3 className="font-heading font-bold text-sm">Add WBS Task / Phase</h3>
                    <button onClick={() => setIsWbsModalOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                  <form onSubmit={handleAddWbsNode} className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-350">WBS Code Code</label>
                      <input type="text" placeholder="e.g. 2.3" value={nodeCode} onChange={(e) => setNodeCode(e.target.value)} className="w-full p-2 rounded border border-border bg-transparent" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-350">Name / Description</label>
                      <input type="text" placeholder="e.g. Electrical Conduit routing" value={nodeName} onChange={(e) => setNodeName(e.target.value)} className="w-full p-2 rounded border border-border bg-transparent" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-350">Start Date</label>
                        <input type="date" value={nodeStart} onChange={(e) => setNodeStart(e.target.value)} className="w-full p-2 rounded border border-border bg-transparent" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-350">End Date</label>
                        <input type="date" value={nodeEnd} onChange={(e) => setNodeEnd(e.target.value)} className="w-full p-2 rounded border border-border bg-transparent" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-350">Parent Phase</label>
                      <select onChange={(e) => setNodeParent(e.target.value || null)} className="w-full p-2 rounded border border-border bg-white dark:bg-[#141B2D]">
                        <option value="">None (Top Level)</option>
                        {wbsNodes.filter(n => !n.parentId).map(n => (
                          <option key={n.id} value={n.id}>{n.code} {n.name}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="w-full py-2 bg-brand-safety text-white font-semibold rounded hover:bg-brand-safety/90 transition-all">
                      Insert WBS Task
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GANTT CHART */}
        {activeTab === 'gantt' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base">Interactive Gantt Timeline Schedule</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Click any WBS node task block to modify dates or update execution progress.</p>
            </div>

            {/* Gantt Interactive SVG Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden relative shadow-inner">
              <div className="grid grid-cols-12 border-b border-slate-800 pb-2 text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                <span className="col-span-4 pl-2">Task Roster</span>
                <span className="col-span-8 pr-2 text-right">June Timeline Sequence</span>
              </div>

              <div className="space-y-3 pt-2">
                {wbsNodes.map((node) => {
                  // Mock positions based on code levels
                  const isPhase = !node.parentId
                  const offset = isPhase ? 10 : 35
                  const width = isPhase ? 80 : 50
                  
                  return (
                    <button
                      key={node.id}
                      onClick={() => { setSelectedGanttNode(node); setGanttProgress(node.progress); }}
                      className="w-full grid grid-cols-12 items-center text-left hover:bg-slate-800/40 p-1.5 rounded transition-all group"
                    >
                      <div className="col-span-4 pl-2 font-mono text-slate-400 font-semibold truncate flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500">{node.code}</span>
                        <span className="text-xs text-slate-350">{node.name}</span>
                      </div>
                      
                      {/* Timeline Bar Graphics */}
                      <div className="col-span-8 relative h-6 bg-slate-950/40 rounded border border-slate-800/50">
                        {/* Target placeholder progress */}
                        <div
                          className={`absolute top-1.5 bottom-1.5 rounded transition-all ${
                            isPhase ? 'bg-brand-safety' : 'bg-brand-accent'
                          }`}
                          style={{ left: `${offset}%`, width: `${width}%` }}
                        >
                          {/* Inner actual progress bar */}
                          <div
                            className="bg-brand-success h-full opacity-65 transition-all"
                            style={{ width: `${node.progress}%` }}
                          ></div>
                        </div>

                        {/* Label shown on hover */}
                        <span className="absolute right-2 top-1 text-[9px] text-slate-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          {node.progress}% Complete
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Gantt Node Editor Modal */}
            {selectedGanttNode && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div onClick={() => setSelectedGanttNode(null)} className="fixed inset-0 bg-brand-obsidian/60 dark:bg-black/70 backdrop-blur-sm"></div>
                <div className="w-full max-w-sm bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 relative z-10 shadow-floating text-xs space-y-4">
                  <div className="border-b border-border pb-2 flex justify-between items-center">
                    <div>
                      <h3 className="font-heading font-bold text-sm">Gantt Task Scheduler</h3>
                      <p className="text-[10px] text-muted-foreground">{selectedGanttNode.code} {selectedGanttNode.name}</p>
                    </div>
                    <button onClick={() => setSelectedGanttNode(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-350">Start Date</label>
                        <input
                          type="date"
                          value={selectedGanttNode.start}
                          onChange={(e) => setSelectedGanttNode({ ...selectedGanttNode, start: e.target.value })}
                          className="w-full p-2 rounded border border-border bg-transparent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-350">End Date</label>
                        <input
                          type="date"
                          value={selectedGanttNode.end}
                          onChange={(e) => setSelectedGanttNode({ ...selectedGanttNode, end: e.target.value })}
                          className="w-full p-2 rounded border border-border bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between font-bold">
                        <span>Actual Task Progress</span>
                        <span className="text-brand-success">{ganttProgress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={ganttProgress}
                        onChange={(e) => setGanttProgress(Number(e.target.value))}
                        className="w-full accent-brand-success cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={handleGanttUpdate}
                      className="w-full py-2 bg-brand-safety text-white font-semibold rounded hover:bg-brand-safety/90 transition-all"
                    >
                      Update Gantt Schedule
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RFIS */}
        {activeTab === 'rfis' && (
          <div className="space-y-6 text-left grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* List side */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl overflow-hidden shadow-raised divide-y divide-border">
              <div className="p-4 bg-muted/20 dark:bg-slate-800/20 font-bold">
                Open Structural RFIs
              </div>
              {rfis.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRfiId(r.id)}
                  className={`w-full text-left p-3.5 text-xs flex flex-col gap-1.5 transition-all ${
                    selectedRfiId === r.id ? 'bg-brand-safety/5 border-l-2 border-brand-safety' : 'hover:bg-muted/40'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{r.title}</h4>
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${
                      r.priority === 'Critical' ? 'bg-brand-danger/10 text-brand-danger' : 'bg-brand-safety/10 text-brand-safety'
                    }`}>{r.priority}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Assignee: {r.assignee}</p>
                </button>
              ))}
            </div>

            {/* Chat board side */}
            <div className="md:col-span-2 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised flex flex-col justify-between h-96">
              <div className="space-y-4 overflow-y-auto">
                <div className="border-b border-border pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-heading font-extrabold text-sm">{activeRfi.title}</h3>
                    <span className="text-[10px] text-muted-foreground">Status: <strong className="text-brand-safety">{activeRfi.status}</strong></span>
                  </div>
                </div>

                {/* Comment thread list */}
                <div className="space-y-3 pr-2 text-xs">
                  {activeRfi.comments.map((comment, index) => {
                    const isSuper = comment.startsWith("Superintendent")
                    return (
                      <div
                        key={index}
                        className={`p-2.5 rounded-lg border max-w-sm ${
                          isSuper
                            ? 'bg-brand-safety/5 border-brand-safety/15 ml-auto text-right'
                            : 'bg-muted/40 border-border mr-auto text-left'
                        }`}
                      >
                        <span className="text-[9px] text-slate-400 block mb-1">
                          {isSuper ? "Site Superintendent" : "Consultant Engineer"}
                        </span>
                        <p className="text-slate-800 dark:text-slate-200">{comment.split(': ')[1] || comment}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendRfiComment} className="pt-4 border-t border-border flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Type a feedback comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-transparent p-2.5 rounded border border-border focus:outline-none focus:border-brand-safety"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-brand-safety text-white rounded hover:bg-brand-safety/90 transition-all flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: RESOURCES */}
        {activeTab === 'resources' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base">Resource Allocation & Load Matrix</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Roster of crew allocations. Cells exceeding 8.0hr threshold represent over-allocations.</p>
            </div>

            {/* Resources Grid */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl overflow-hidden shadow-raised text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 dark:bg-slate-800/40 text-muted-foreground font-bold border-b border-border">
                    <th className="p-3">Team / Asset</th>
                    <th className="p-3 text-center">Mon 16</th>
                    <th className="p-3 text-center">Tue 17</th>
                    <th className="p-3 text-center">Wed 18</th>
                    <th className="p-3 text-center">Thu 19</th>
                    <th className="p-3 text-center">Fri 20</th>
                    <th className="p-3 text-right">Load %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-semibold">
                  {[
                    { name: "Heavy Tower Crane A", d1: 8.0, d2: 8.0, d3: 8.0, d4: 8.0, d5: 8.0, load: 100, isMax: true },
                    { name: "Steel Rebar Crew", d1: 8.0, d2: 12.0, d3: 8.0, d4: 4.0, d5: 0.0, load: 90, isMax: false },
                    { name: "Concrete Pump Team", d1: 0.0, d2: 0.0, d3: 8.0, d4: 8.0, d5: 4.0, load: 50, isMax: false }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/10 dark:hover:bg-slate-800/10">
                      <td className="p-3 font-bold">{row.name}</td>
                      <td className="p-3 text-center">{row.d1}hr</td>
                      <td className={`p-3 text-center ${row.d2 > 8.0 && 'bg-brand-danger/10 text-brand-danger border border-brand-danger/20'}`}>
                        {row.d2}hr
                      </td>
                      <td className="p-3 text-center">{row.d3}hr</td>
                      <td className="p-3 text-center">{row.d4}hr</td>
                      <td className="p-3 text-center">{row.d5}hr</td>
                      <td className="p-3 text-right font-bold text-brand-accent">{row.load}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
