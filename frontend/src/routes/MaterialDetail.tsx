import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMaterialStore } from '../store/materialStore'
import {
  ArrowLeft,
  Star,
  MapPin,
  AlertTriangle,
  History,
  Send,
  User,
  Plus,
  Sparkles,
  ClipboardCheck,
  Building2,
  Mail,
  FileSignature
} from 'lucide-react'

export default function MaterialDetail() {
  const { materialId } = useParams()
  const materials = useMaterialStore((state) => state.materials)
  const warehouses = useMaterialStore((state) => state.warehouses)
  const purchaseOrders = useMaterialStore((state) => state.purchaseOrders)
  const suppliers = useMaterialStore((state) => state.suppliers)
  const consumptionLogs = useMaterialStore((state) => state.consumptionLogs)
  const qualityChecks = useMaterialStore((state) => state.qualityChecks)

  const toggleFavorite = useMaterialStore((state) => state.toggleFavorite)
  const approveOrder = useMaterialStore((state) => state.approveOrder)
  const addConsumptionLog = useMaterialStore((state) => state.addConsumptionLog)
  const addQualityCheck = useMaterialStore((state) => state.addQualityCheck)

  const activeMaterial = materials.find(m => m.id === materialId) || materials[0]

  const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'history' | 'consumption' | 'suppliers' | 'qc'>('overview')

  // Form States
  const [consumptionQty, setConsumptionQty] = useState(10)
  const [consumptionTask, setConsumptionTask] = useState("")
  
  const [qcCheckName, setQcCheckName] = useState("Visual moisture inspection")
  const [qcSlump, setQcSlump] = useState("130mm")
  const [qcTemp, setQcTemp] = useState("29.0°C")
  const [qcStatus, setQcStatus] = useState<'Approved' | 'Rejected'>('Approved')

  // AI Assistant Chat Box State
  const [aiQuery, setAiQuery] = useState("")
  const [aiChatLog, setAiChatLog] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: `Hello! I am your BuildSpace AI Logistics Assistant. Ask me about reorders, cost optimization, or supplier contracts for ${activeMaterial.name}.` }
  ])

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiQuery.trim()) return
    const nextLog = [...aiChatLog, { sender: 'user' as const, text: aiQuery }]
    setAiChatLog(nextLog)
    setAiQuery("")

    // Simple AI mockup responses
    setTimeout(() => {
      let reply = ""
      const lower = aiQuery.toLowerCase()
      if (lower.includes('stock') || lower.includes('safety') || lower.includes('reorder')) {
        reply = `For ${activeMaterial.name}, current stock is ${activeMaterial.currentStock} ${activeMaterial.unit}. The safety limit is set to ${activeMaterial.minStock} ${activeMaterial.unit}. Current health status is ${activeMaterial.status}.`
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('contract')) {
        reply = `The active contract for this material is managed with ${activeMaterial.brand}. We have baseline allocation budget of ${activeMaterial.budget} in place.`
      } else {
        reply = `Analyzing logs... I recommend keeping consumption stable. Let me know if you would like me to draft an RFQ or cross-check compliance certifications for ${activeMaterial.name}.`
      }
      setAiChatLog(prev => [...prev, { sender: 'ai' as const, text: reply }])
    }, 800)
  }

  const handleLogConsumption = (e: React.FormEvent) => {
    e.preventDefault()
    if (consumptionQty <= 0 || !consumptionTask) return
    addConsumptionLog({
      materialId: activeMaterial.id,
      qty: consumptionQty,
      unit: activeMaterial.unit,
      task: consumptionTask,
      loggedBy: "John Doe (Supt)"
    })
    setConsumptionTask("")
  }

  const handleLogQc = (e: React.FormEvent) => {
    e.preventDefault()
    addQualityCheck({
      materialId: activeMaterial.id,
      checkName: qcCheckName,
      slump: qcSlump,
      temp: qcTemp,
      certUploaded: true,
      status: qcStatus
    })
    setQcCheckName("Visual moisture inspection")
    setQcSlump("130mm")
    setQcTemp("29.0°C")
  }

  // Related lists filtered by active material
  const materialLogs = consumptionLogs.filter(log => log.materialId === activeMaterial.id)
  const materialQc = qualityChecks.filter(check => check.materialId === activeMaterial.id)
  
  // Consumption historical data for SVG area graph
  // Map recent logs or fallback to mock points
  const points = [
    { label: "Jun 12", val: 80 },
    { label: "Jun 13", val: 120 },
    { label: "Jun 14", val: 95 },
    { label: "Jun 15", val: 150 },
    { label: "Jun 16", val: 110 },
    { label: "Jun 17", val: 130 },
    { label: "Jun 18", val: 200 }
  ]
  const maxVal = Math.max(...points.map(p => p.val))
  const svgWidth = 500
  const svgHeight = 150
  
  // Calculate SVG line coordinate points
  const linePath = points.map((p, idx) => {
    const x = (idx / (points.length - 1)) * svgWidth
    const y = svgHeight - (p.val / maxVal) * (svgHeight - 30) - 15
    return `${x},${y}`
  }).join(" ")

  const areaPath = `${linePath} ${svgWidth},${svgHeight} 0,${svgHeight}`

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/materials"
            className="p-2 hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-safety px-2 py-0.5 bg-brand-safety/10 rounded-full">
                {activeMaterial.sku}
              </span>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-slate-800 dark:text-white">
                {activeMaterial.name}
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Asset Group: {activeMaterial.category} • Supplier: {activeMaterial.brand}</p>
          </div>
        </div>

        <button
          onClick={() => toggleFavorite(activeMaterial.id)}
          className="self-start sm:self-center px-4 py-2 border border-border hover:bg-muted rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <Star className={`w-4 h-4 ${activeMaterial.isFavorite ? 'fill-brand-accent text-brand-accent' : 'text-slate-350'}`} />
          {activeMaterial.isFavorite ? 'Favorited' : 'Add to Favorites'}
        </button>
      </div>

      {/* Workspace Split Layout (Main content vs AI Assistant Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main tabs area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Navigation tabs */}
          <div className="flex flex-wrap border-b border-border gap-1 bg-muted/40 p-1 rounded-xl">
            {(['overview', 'stock', 'history', 'consumption', 'suppliers', 'qc'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-lg text-xs font-extrabold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#141B2D] text-slate-800 dark:text-white shadow shadow-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab === 'qc' ? 'Quality checks' : tab}
              </button>
            ))}
          </div>

          {/* Tab Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* stock gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Available Quantity</span>
                  <p className="text-xl font-bold font-heading">{activeMaterial.currentStock} {activeMaterial.unit}</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${activeMaterial.status === 'Optimal' ? 'bg-brand-success' : activeMaterial.status === 'Warning' ? 'bg-brand-safety' : 'bg-brand-danger'}`}
                      style={{ width: `${Math.min(100, (activeMaterial.currentStock / activeMaterial.maxStock) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Allocated Reserves</span>
                  <p className="text-xl font-bold font-heading">{activeMaterial.reserved} {activeMaterial.unit}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Locked for foundation tasks</p>
                </div>

                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Limit threshold</span>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Min Safety: <strong>{activeMaterial.minStock} {activeMaterial.unit}</strong></p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Max Baseline: <strong>{activeMaterial.maxStock} {activeMaterial.unit}</strong></p>
                </div>
              </div>

              {/* Status details card */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm border-b border-border pb-2">Material Health Assessment</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                  <div className="space-y-2">
                    <p>Current Status: 
                      <span className={`ml-2 px-2.5 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                        activeMaterial.status === 'Optimal' ? 'bg-brand-success/10 text-brand-success' :
                        activeMaterial.status === 'Warning' ? 'bg-brand-safety/10 text-brand-safety' : 'bg-brand-danger/10 text-brand-danger'
                      }`}>
                        {activeMaterial.status}
                      </span>
                    </p>
                    <p>Purchase Budget: <strong>{activeMaterial.budget}</strong></p>
                    <p>Manufacturing Brand: <strong>{activeMaterial.brand}</strong></p>
                  </div>

                  <div className="bg-brand-safety/5 border border-brand-safety/20 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-brand-safety text-xs font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>AI Advisory warning</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {activeMaterial.status === 'Reorder'
                        ? "⚠️ Current stock is below safety limit. Recommended reorder count: 500 bags to balance price baseline parameters."
                        : "🟢 Inventory is within green safety metrics. No immediate purchase requisitions required."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Stock */}
          {activeTab === 'stock' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm border-b border-border pb-2">Storage & Location Allocation</h3>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-muted/40 rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Warehouse Stores</span>
                    <span className="text-lg font-bold">{activeMaterial.warehouseStock} {activeMaterial.unit}</span>
                  </div>
                  <div className="p-4 bg-muted/40 rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Active Site Storage</span>
                    <span className="text-lg font-bold">{activeMaterial.siteStock} {activeMaterial.unit}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="font-bold text-xs block">Assigned Shelf & Bin coordinates:</span>
                  {warehouses.map((wh) => (
                    <div key={wh.id} className="p-3 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4.5 h-4.5 text-brand-safety flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{wh.name}</p>
                          <p className="text-[10px] text-muted-foreground">{wh.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 bg-muted rounded font-mono font-bold text-[10px]">
                          {"Zone B -> Row B1"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab History */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised">
              <h3 className="font-heading font-extrabold text-sm border-b border-border pb-2">Active Purchase Orders & Contracts</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase tracking-wider font-semibold">
                      <th className="py-3 text-left">Order ID</th>
                      <th className="py-3 text-left">Supplier</th>
                      <th className="py-3 text-left">Project Assigned</th>
                      <th className="py-3 text-right">Cost</th>
                      <th className="py-3 text-left">Approvals</th>
                      <th className="py-3 text-left">Status</th>
                      <th className="py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.map((po) => (
                      <tr key={po.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                        <td className="py-4 font-mono font-bold">{po.id}</td>
                        <td className="py-4">{po.supplier}</td>
                        <td className="py-4">{po.project}</td>
                        <td className="py-4 text-right font-bold">{po.cost}</td>
                        <td className="py-4">{po.approvals}</td>
                        <td className="py-4">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            po.status === 'Approved' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-safety/10 text-brand-safety'
                          }`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {po.status === 'Pending' ? (
                            <button
                              onClick={() => approveOrder(po.id)}
                              className="px-3 py-1 bg-brand-safety text-white hover:opacity-90 rounded font-bold text-[10px]"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Settled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Consumption */}
          {activeTab === 'consumption' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Consumption Area Chart */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm border-b border-border pb-2">MoM Consumption Trend (Bags)</h3>
                
                {/* Custom Interactive SVG Chart */}
                <div className="relative w-full aspect-[16/6] bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
                  <svg className="w-full h-full text-slate-800" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <line x1="0" y1="35" x2="500" y2="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="0" y1="105" x2="500" y2="105" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />

                    {/* Gradient Fill under area */}
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#00C8FF" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <path d={`M 0,${svgHeight} L ${areaPath}`} fill="url(#chartGrad)" />
                    <path d={`M ${linePath}`} fill="none" stroke="#00C8FF" strokeWidth="2" />
                    
                    {/* Data pins */}
                    {points.map((p, idx) => {
                      const x = (idx / (points.length - 1)) * svgWidth
                      const y = svgHeight - (p.val / maxVal) * (svgHeight - 30) - 15
                      return (
                        <g key={idx} className="group/dot cursor-pointer">
                          <circle cx={x} cy={y} r="3.5" fill="#00C8FF" />
                          <circle cx={x} cy={y} r="7" fill="#00C8FF" fillOpacity="0" className="hover:fill-opacity-20 transition-all" />
                        </g>
                      )
                    })}
                  </svg>

                  {/* Horizontal Labels */}
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono pt-2 border-t border-slate-900 mt-2">
                    {points.map((p, idx) => <span key={idx}>{p.label}</span>)}
                  </div>
                </div>
              </div>

              {/* Log Consumption Form & History */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Form */}
                <form onSubmit={handleLogConsumption} className="md:col-span-5 bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-4">
                  <h4 className="font-heading font-extrabold text-xs border-b border-border pb-2 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-brand-safety" />
                    Log Field Consumption
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">
                      Dispatched Quantity ({activeMaterial.unit})
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={consumptionQty}
                      onChange={(e) => setConsumptionQty(Number(e.target.value))}
                      className="w-full p-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">
                      Assigned Construction Task / Scope
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Slab foundation Level 3"
                      value={consumptionTask}
                      onChange={(e) => setConsumptionTask(e.target.value)}
                      className="w-full p-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-brand-safety hover:bg-brand-safety/90 text-white font-bold text-xs rounded-lg shadow shadow-brand-safety/10 flex items-center justify-center gap-1.5"
                  >
                    Deduct & Log Stock
                  </button>
                </form>

                {/* History table */}
                <div className="md:col-span-7 bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-3">
                  <h4 className="font-heading font-extrabold text-xs border-b border-border pb-2 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-brand-accent" />
                    Recent Logs History
                  </h4>

                  {materialLogs.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-8">No consumption logs recorded.</p>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {materialLogs.map((log) => (
                        <div key={log.id} className="p-3 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white">{log.task}</p>
                            <p className="text-[10px] text-muted-foreground">Logged by: {log.loggedBy} • {log.date}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-brand-danger">-{log.qty} {log.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* Tab Suppliers */}
          {activeTab === 'suppliers' && (
            <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised">
              <h3 className="font-heading font-extrabold text-sm border-b border-border pb-2">Active Procurement Suppliers Contracts</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {suppliers.map((sup) => (
                  <div key={sup.id} className="p-4 border border-border rounded-xl space-y-4 hover:shadow-raised transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                          <Building2 className="w-4.5 h-4.5 text-brand-safety" />
                          {sup.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground">On-Time Performance Score: {sup.onTimeRate}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-brand-accent/10 text-brand-accent rounded font-bold text-[10px]">
                        ★ {sup.rating}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 border-t border-border pt-3">
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <User className="w-3.5 h-3.5" /> Contact: {sup.contact}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="w-3.5 h-3.5" /> {sup.email}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-700 dark:text-slate-350 font-medium">
                        <FileSignature className="w-3.5 h-3.5 text-brand-safety" /> {sup.activeContract}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab QC */}
          {activeTab === 'qc' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Form */}
                <form onSubmit={handleLogQc} className="md:col-span-5 bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-4">
                  <h4 className="font-heading font-extrabold text-xs border-b border-border pb-2 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-brand-safety" />
                    New Inspection Check
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Check name</label>
                    <input
                      type="text"
                      required
                      value={qcCheckName}
                      onChange={(e) => setQcCheckName(e.target.value)}
                      className="w-full p-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Slump Test</label>
                      <input
                        type="text"
                        value={qcSlump}
                        onChange={(e) => setQcSlump(e.target.value)}
                        className="w-full p-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Temperature</label>
                      <input
                        type="text"
                        value={qcTemp}
                        onChange={(e) => setQcTemp(e.target.value)}
                        className="w-full p-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-350">Status</label>
                    <select
                      value={qcStatus}
                      onChange={(e) => setQcStatus(e.target.value as any)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-brand-safety hover:bg-brand-safety/90 text-white font-bold text-xs rounded-lg shadow shadow-brand-safety/10 flex items-center justify-center gap-1.5"
                  >
                    Log QC Verification
                  </button>
                </form>

                {/* Audit Grid */}
                <div className="md:col-span-7 bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-3">
                  <h4 className="font-heading font-extrabold text-xs border-b border-border pb-2 flex items-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4 text-brand-success" />
                    Quality Checklist Verifications
                  </h4>

                  {materialQc.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-8">No inspections logged.</p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {materialQc.map((check) => (
                        <div key={check.id} className="p-3 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white">{check.checkName}</p>
                            <p className="text-[10px] text-muted-foreground">Slump: {check.slump} • Temp: {check.temp} • {check.date}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              check.status === 'Approved' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-danger/10 text-brand-danger'
                            }`}>
                              {check.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

        {/* AI Assistant Persistent Sidebar Drawer */}
        <div className="lg:col-span-4 bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-raised flex flex-col overflow-hidden max-h-[500px]">
          <div className="p-4 bg-muted/40 border-b border-border flex justify-between items-center">
            <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              AI Assistant Chat Box
            </span>
            <span className="text-[9px] font-bold text-brand-success flex items-center gap-1">
              🟢 Logistics Agent
            </span>
          </div>

          {/* Conversation feeds */}
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
              placeholder="Ask AI material limits..."
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
    </div>
  )
}
