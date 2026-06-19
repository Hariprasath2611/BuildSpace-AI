import { create } from 'zustand'

export interface MaterialItem {
  id: string
  sku: string
  name: string
  category: string
  currentStock: number
  unit: string
  status: 'Optimal' | 'Reorder'
}

export interface MaterialRequest {
  id: string
  materialName: string
  quantity: number
  unit: string
  status: 'Pending' | 'Approved' | 'Dispatched'
}

interface MaterialState {
  materials: MaterialItem[]
  requests: MaterialRequest[]
  requestMaterial: (name: string, quantity: number, unit: string) => void
  auditMaterialStock: (sku: string, actualQuantity: number) => void
}

const INITIAL_MATERIALS: MaterialItem[] = [
  { id: "mat_1", sku: "CMT-43N", name: "Grade 43 OPC Cement", category: "Concrete", currentStock: 450, unit: "bags", status: "Optimal" },
  { id: "mat_2", sku: "STL-12R", name: "12mm Deformed Steel Rebar", category: "Steel", currentStock: 12, unit: "tons", status: "Optimal" },
  { id: "mat_3", sku: "BRK-RED", name: "Solid Clay Red Bricks", category: "Masonry", currentStock: 8000, unit: "pcs", status: "Optimal" }
]

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: INITIAL_MATERIALS,
  requests: [
    { id: "req_1", materialName: "Grade 43 OPC Cement", quantity: 150, unit: "bags", status: "Approved" }
  ],

  requestMaterial: (name, quantity, unit) => set((state) => {
    const newRequest: MaterialRequest = {
      id: `req_${Date.now()}`,
      materialName: name,
      quantity,
      unit,
      status: "Pending"
    }
    return { requests: [newRequest, ...state.requests] }
  }),

  auditMaterialStock: (sku, actualQuantity) => set((state) => ({
    materials: state.materials.map((m) => {
      if (m.sku !== sku) return m
      return {
        ...m,
        currentStock: actualQuantity,
        status: actualQuantity < 50 ? 'Reorder' : 'Optimal'
      }
    })
  }))
}))
