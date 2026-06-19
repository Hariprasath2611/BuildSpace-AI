import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMaterialStore } from '../store/materialStore'
import {
  Plus,
  Search,
  AlertTriangle,
  ArrowRight,
  X,
  DollarSign,
  Grid,
  List,
  Star,
  Sparkles,
  Barcode,
  Package,
  Layers
} from 'lucide-react'

export default function Materials() {
  const materials = useMaterialStore((state) => state.materials)
  const addMaterial = useMaterialStore((state) => state.addMaterial)
  const toggleFavorite = useMaterialStore((state) => state.toggleFavorite)
  const fetchMaterials = useMaterialStore((state) => state.fetchMaterials)

  useEffect(() => {
    fetchMaterials()
  }, [fetchMaterials])

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)

  // Wizard States
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Cement")
  const [brand, setBrand] = useState("")
  const [sku, setSku] = useState("")
  const [unit, setUnit] = useState("bags")
  const [minStock, setMinStock] = useState(100)
  const [maxStock, setMaxStock] = useState(1000)
  const [budget, setBudget] = useState(5000)

  // AI SKU Generator
  const generateSku = () => {
    const catCode = category.slice(0, 3).toUpperCase()
    const randNum = Math.floor(100 + Math.random() * 900)
    setSku(`${catCode}-ST-${randNum}`)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !sku) return
    
    addMaterial({
      sku,
      name,
      category,
      brand,
      currentStock: 0,
      unit,
      minStock,
      maxStock,
      budget: `$${budget.toLocaleString()}`,
      warehouseStock: 0,
      siteStock: 0,
      reserved: 0,
      status: 'Reorder'
    })

    // Reset & Close
    setIsWizardOpen(false)
    setWizardStep(1)
    setName("")
    setCategory("Cement")
    setBrand("")
    setSku("")
    setUnit("bags")
    setMinStock(100)
    setMaxStock(1000)
    setBudget(5000)
  }

  const categories = ["All", "Cement", "Steel", "Piping", "Electrical"]

  const filtered = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.sku.toLowerCase().includes(search.toLowerCase()) ||
                          m.brand.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Telemetry Metrics for top of Catalog
  const totalValue = materials.reduce((acc, m) => acc + (parseInt(m.budget.replace(/[^0-9]/g, '')) || 0), 0)
  const lowStockCount = materials.filter(m => m.status === 'Reorder' || m.status === 'Warning').length

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6 gap-4">
        <div className="text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">Material Catalog</h1>
          <p className="text-xs text-muted-foreground">Monitor inventory status, dispatch requisitions, and track active supply fleets.</p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="self-start sm:self-center px-4 py-2.5 bg-brand-safety text-white text-xs font-bold rounded-lg hover:bg-brand-safety/90 shadow shadow-brand-safety/15 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Material
        </button>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised text-left space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Value</span>
            <DollarSign className="w-4 h-4 text-brand-safety" />
          </div>
          <p className="text-2xl font-bold font-heading">${totalValue.toLocaleString()}</p>
          <p className="text-[10px] text-brand-success font-semibold flex items-center gap-1">
            🟢 Active procurement baseline allocation
          </p>
        </div>

        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised text-left space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Alerts & Reorders</span>
            <AlertTriangle className="w-4 h-4 text-brand-danger" />
          </div>
          <p className="text-2xl font-bold font-heading">{lowStockCount} items</p>
          <p className="text-[10px] text-brand-danger font-semibold flex items-center gap-1">
            ⚠️ Stock levels below safety threshold
          </p>
        </div>

        <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised text-left space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total SKUs</span>
            <Package className="w-4 h-4 text-brand-accent" />
          </div>
          <p className="text-2xl font-bold font-heading">{materials.length} items</p>
          <p className="text-[10px] text-muted-foreground font-semibold">
            Categorized across {categories.length - 1} operational groups
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#141B2D] border border-border p-4 rounded-xl shadow-raised">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-safety text-white shadow shadow-brand-safety/15'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search SKU, name, brand..."
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

      {/* Catalog Render */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#141B2D] border border-border rounded-2xl text-xs text-muted-foreground italic space-y-2">
          <p>No materials matching search criteria found.</p>
          <button
            onClick={() => { setSearch(""); setSelectedCategory("All"); }}
            className="text-xs text-brand-safety font-bold underline"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised relative flex flex-col justify-between gap-4 group hover:shadow-floating transition-all duration-200"
            >
              <button
                onClick={() => toggleFavorite(m.id)}
                className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-brand-accent rounded-lg transition-colors"
                title={m.isFavorite ? "Remove Favorite" : "Favorite Material"}
              >
                <Star className={`w-4 h-4 ${m.isFavorite ? 'fill-brand-accent text-brand-accent' : ''}`} />
              </button>

              <div className="text-left space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-safety px-2.5 py-0.5 bg-brand-safety/10 rounded-full">
                  {m.category}
                </span>
                <h3 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white line-clamp-1 pt-1">
                  {m.name}
                </h3>
                <p className="text-[10px] font-mono text-muted-foreground">SKU: {m.sku}</p>
                <p className="text-xs text-slate-500">Brand: {m.brand}</p>
              </div>

              <div className="border-t border-border pt-4 text-left flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Stock Level</span>
                  <span className="text-sm font-bold font-heading">{m.currentStock} {m.unit}</span>
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    m.status === 'Optimal' ? 'bg-brand-success/10 text-brand-success' :
                    m.status === 'Warning' ? 'bg-brand-safety/10 text-brand-safety' : 'bg-brand-danger/10 text-brand-danger'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </div>

              <Link
                to={`/materials/${m.id}`}
                className="w-full py-2 bg-muted hover:bg-brand-safety hover:text-white text-center text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1"
              >
                Manage Inventory
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
                <th className="p-4">SKU / Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Brand</th>
                <th className="p-4 text-right">Available Stock</th>
                <th className="p-4">Safety Limit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleFavorite(m.id)}>
                        <Star className={`w-3.5 h-3.5 ${m.isFavorite ? 'fill-brand-accent text-brand-accent' : 'text-slate-300'}`} />
                      </button>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{m.name}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{m.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{m.category}</td>
                  <td className="p-4">{m.brand}</td>
                  <td className="p-4 text-right font-bold">{m.currentStock} {m.unit}</td>
                  <td className="p-4">Min: {m.minStock} / Max: {m.maxStock}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      m.status === 'Optimal' ? 'bg-brand-success/10 text-brand-success' :
                      m.status === 'Warning' ? 'bg-brand-safety/10 text-brand-safety' : 'bg-brand-danger/10 text-brand-danger'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/materials/${m.id}`}
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

      {/* Multi-Step Add Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-obsidian/75 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsWizardOpen(false)}></div>
          
          <div className="w-full max-w-lg bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-floating relative z-10 overflow-hidden text-left flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base">Register New Material Asset</h3>
                <p className="text-[10px] text-muted-foreground">Step {wizardStep} of 3 — Provide compliance schemas</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="p-1 hover:bg-muted rounded text-slate-400 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Steps Progress */}
            <div className="bg-muted/30 px-5 py-2.5 border-b border-border flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <span className={wizardStep >= 1 ? 'text-brand-safety' : ''}>1. General</span>
              <span className="text-slate-300">/</span>
              <span className={wizardStep >= 2 ? 'text-brand-safety' : ''}>2. Brand & SKU</span>
              <span className="text-slate-300">/</span>
              <span className={wizardStep >= 3 ? 'text-brand-safety' : ''}>3. Budget & Safety</span>
            </div>

            {/* Wizard Form */}
            <form onSubmit={handleCreate} className="p-5 flex-1 space-y-4">
              
              {wizardStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      Material Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Portland Cement Grade 53"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      Category Group
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                    >
                      <option value="Cement">Cement</option>
                      <option value="Steel">Steel</option>
                      <option value="Piping">Piping</option>
                      <option value="Electrical">Electrical</option>
                    </select>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Brand / Supplier Org</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vulcan Steel Suppliers"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350 flex justify-between items-center">
                      <span className="flex items-center gap-1"><Barcode className="w-3.5 h-3.5" /> SKU Code</span>
                      <button
                        type="button"
                        onClick={generateSku}
                        className="text-[10px] text-brand-safety font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Auto-Generate
                      </button>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CEM-ST-101"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Unit of Measure</label>
                    <input
                      type="text"
                      required
                      placeholder="bags, tons, meters, pieces"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Min Stock (Safety)</label>
                      <input
                        type="number"
                        value={minStock}
                        onChange={(e) => setMinStock(Number(e.target.value))}
                        className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Max Stock</label>
                      <input
                        type="number"
                        value={maxStock}
                        onChange={(e) => setMaxStock(Number(e.target.value))}
                        className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Baseline Allocation Budget ($)</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
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
                    className="px-4 py-2 bg-brand-safety text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-accent text-brand-obsidian text-xs font-bold rounded-lg hover:opacity-90 transition-all"
                  >
                    Save & Initialize SKU
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
