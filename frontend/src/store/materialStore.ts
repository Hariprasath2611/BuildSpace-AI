import { create } from 'zustand'

export interface Material {
  id: string
  sku: string
  name: string
  category: string
  currentStock: number
  unit: string
  isFavorite: boolean
  minStock: number
  maxStock: number
  budget: string
  warehouseStock: number
  siteStock: number
  reserved: number
  status: 'Optimal' | 'Warning' | 'Reorder'
  brand: string
}

export interface Warehouse {
  id: string
  name: string
  location: string
  zones: {
    name: string
    rows: string[]
  }[]
}

export interface PurchaseOrder {
  id: string
  supplier: string
  project: string
  cost: string
  approvals: string
  status: 'Pending' | 'Approved' | 'Rejected'
  date: string
}

export interface Supplier {
  id: string
  name: string
  rating: number
  onTimeRate: string
  contact: string
  email: string
  activeContract: string
}

export interface Shipment {
  id: string
  eta: number // minutes
  speed: number // mph
  cargo: string
  driver: string
  status: 'En Route' | 'Delivered' | 'Delayed'
  lat: number
  lng: number
}

export interface ConsumptionLog {
  id: string
  materialId: string
  qty: number
  unit: string
  task: string
  date: string
  loggedBy: string
}

export interface QualityCheck {
  id: string
  materialId: string
  checkName: string
  slump: string
  temp: string
  certUploaded: boolean
  status: 'Approved' | 'Rejected'
  date: string
}

export interface MaterialState {
  materials: Material[]
  warehouses: Warehouse[]
  purchaseOrders: PurchaseOrder[]
  suppliers: Supplier[]
  shipments: Shipment[]
  consumptionLogs: ConsumptionLog[]
  qualityChecks: QualityCheck[]
  
  addMaterial: (material: Omit<Material, 'id' | 'isFavorite'>) => void
  toggleFavorite: (id: string) => void
  approveOrder: (id: string) => void
  addConsumptionLog: (log: Omit<ConsumptionLog, 'id' | 'date'>) => void
  addQualityCheck: (qc: Omit<QualityCheck, 'id' | 'date'>) => void
}

const INITIAL_MATERIALS: Material[] = [
  {
    id: "m_1",
    sku: "CEM-PL-042",
    name: "Portland Cement Grade 53",
    category: "Cement",
    currentStock: 1200,
    unit: "bags",
    isFavorite: true,
    minStock: 300,
    maxStock: 2000,
    budget: "$12,400",
    warehouseStock: 900,
    siteStock: 300,
    reserved: 150,
    status: "Optimal",
    brand: "Cemex Corp"
  },
  {
    id: "m_2",
    sku: "REB-ST-009",
    name: "Structural Rebar Steel Grade 60",
    category: "Steel",
    currentStock: 50,
    unit: "tons",
    isFavorite: true,
    minStock: 100,
    maxStock: 500,
    budget: "$78,000",
    warehouseStock: 40,
    siteStock: 10,
    reserved: 5,
    status: "Reorder",
    brand: "Vulcan Steel"
  },
  {
    id: "m_3",
    sku: "BEA-ST-881",
    name: "Flanged H-Beam structural steel",
    category: "Steel",
    currentStock: 95,
    unit: "pieces",
    isFavorite: false,
    minStock: 50,
    maxStock: 200,
    budget: "$43,500",
    warehouseStock: 75,
    siteStock: 20,
    reserved: 15,
    status: "Optimal",
    brand: "Apex Metals"
  },
  {
    id: "m_4",
    sku: "PVC-PI-011",
    name: "Schedule 40 PVC Conduit 4-inch",
    category: "Piping",
    currentStock: 250,
    unit: "meters",
    isFavorite: false,
    minStock: 300,
    maxStock: 1000,
    budget: "$5,200",
    warehouseStock: 200,
    siteStock: 50,
    reserved: 10,
    status: "Warning",
    brand: "IPEX Inc"
  }
]

const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: "wh_1",
    name: "Main Logistics Hub Alpha",
    location: "Gate 1, Industrial Area",
    zones: [
      { name: "Zone A: Structural Steel", rows: ["Row A1", "Row A2"] },
      { name: "Zone B: Dry Mix Powders", rows: ["Row B1", "Row B2"] }
    ]
  },
  {
    id: "wh_2",
    name: "Site Storage Yard Gamma",
    location: "Sector 4 Parking Grid",
    zones: [
      { name: "Zone C: Pipelines & Conduits", rows: ["Row C1"] },
      { name: "Zone D: Electrical Cabinets", rows: ["Row D1"] }
    ]
  }
]

const INITIAL_POS: PurchaseOrder[] = [
  { id: "PO-902", supplier: "Vulcan Steel Ltd.", project: "APEX Commercial Hub", cost: "$120,000", approvals: "1/2 Approved", status: "Pending", date: "2026-06-17" },
  { id: "PO-901", supplier: "Cemex Corp", project: "Tower A Residences", cost: "$45,000", approvals: "2/2 Approved", status: "Approved", date: "2026-06-16" },
  { id: "PO-900", supplier: "IPEX Inc", project: "Metro Line Underground", cost: "$12,400", approvals: "2/2 Approved", status: "Approved", date: "2026-06-14" }
]

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: "sup_1", name: "Vulcan Steel Ltd.", rating: 4.8, onTimeRate: "97%", contact: "Sarah Jones", email: "s.jones@vulcan.com", activeContract: "CON-2026-ST (Rebar pricing fix)" },
  { id: "sup_2", name: "Cemex Corp", rating: 4.5, onTimeRate: "94%", contact: "Robert Carter", email: "r.carter@cemex.com", activeContract: "CON-2026-CM (Cement bulk tier)" },
  { id: "sup_3", name: "IPEX Inc", rating: 4.2, onTimeRate: "89%", contact: "Linda Garcia", email: "l.garcia@ipex.com", activeContract: "CON-2026-PV (Pipe logistics standard)" }
]

const INITIAL_SHIPMENTS: Shipment[] = [
  { id: "SH-9012", eta: 12, speed: 42, cargo: "Portland Cement Grade 53 (20t)", driver: "Dave Miller (055-1200)", status: "En Route", lat: 12.9716, lng: 77.5946 },
  { id: "SH-8810", eta: 0, speed: 0, cargo: "Structural Rebar (10t)", driver: "Tom Harris (055-8811)", status: "Delivered", lat: 12.9722, lng: 77.5930 }
]

const INITIAL_CONSUMPTION: ConsumptionLog[] = [
  { id: "c_log_1", materialId: "m_1", qty: 200, unit: "bags", task: "Slab Level 1 Foundation Pour", date: "2026-06-17", loggedBy: "John Doe (Supt)" },
  { id: "c_log_2", materialId: "m_2", qty: 5, unit: "tons", task: "Columns Rebar installation", date: "2026-06-16", loggedBy: "John Doe (Supt)" }
]

const INITIAL_QC: QualityCheck[] = [
  { id: "qc_1", materialId: "m_1", checkName: "Slump test verification", slump: "120mm (Target: 100-150)", temp: "28.5°C", certUploaded: true, status: "Approved", date: "2026-06-17" },
  { id: "qc_2", materialId: "m_2", checkName: "Tensile yield strength inspection", slump: "N/A", temp: "N/A", certUploaded: false, status: "Approved", date: "2026-06-16" }
]

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: INITIAL_MATERIALS,
  warehouses: INITIAL_WAREHOUSES,
  purchaseOrders: INITIAL_POS,
  suppliers: INITIAL_SUPPLIERS,
  shipments: INITIAL_SHIPMENTS,
  consumptionLogs: INITIAL_CONSUMPTION,
  qualityChecks: INITIAL_QC,

  addMaterial: (mat) => set((state) => ({
    materials: [...state.materials, {
      ...mat,
      id: `m_${Date.now()}`,
      isFavorite: false
    }]
  })),

  toggleFavorite: (id) => set((state) => ({
    materials: state.materials.map((m) =>
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    )
  })),

  approveOrder: (id) => set((state) => ({
    purchaseOrders: state.purchaseOrders.map((po) =>
      po.id === id ? { ...po, approvals: "2/2 Approved", status: "Approved" } : po
    )
  })),

  addConsumptionLog: (log) => set((state) => {
    const logId = `c_log_${Date.now()}`
    const today = new Date().toISOString().split('T')[0]
    
    // Also deduct stock levels from material
    const updatedMaterials = state.materials.map((m) => {
      if (m.id === log.materialId) {
        const nextStock = Math.max(0, m.currentStock - log.qty)
        const nextStatus = nextStock <= m.minStock ? 'Reorder' : (nextStock <= m.minStock * 1.5 ? 'Warning' : 'Optimal')
        return {
          ...m,
          currentStock: nextStock,
          status: nextStatus as any
        }
      }
      return m
    })

    return {
      consumptionLogs: [...state.consumptionLogs, { ...log, id: logId, date: today }],
      materials: updatedMaterials
    }
  }),

  addQualityCheck: (qc) => set((state) => ({
    qualityChecks: [...state.qualityChecks, {
      ...qc,
      id: `qc_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    }]
  }))
}))

export default useMaterialStore
