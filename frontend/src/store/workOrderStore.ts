import { create } from 'zustand'

export interface WorkOrder {
  id: string
  projectId: string
  title: string
  description: string
  status: 'Backlog' | 'Scheduled' | 'In Progress' | 'Blocked' | 'Completed'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  dueDate: string
  startDate: string
  progress: number // 0 to 100
  assigneeId: string // worker or crew ID
  assigneeName: string
  dependencies: string[] // work order IDs
  attachments: { name: string; url: string; size: string }[]
}

export interface WorkOrderState {
  workOrders: WorkOrder[]
  selectedWorkOrderId: string | null
  addWorkOrder: (wo: Omit<WorkOrder, 'id'>) => void
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void
  deleteWorkOrder: (id: string) => void
  setSelectedWorkOrder: (id: string | null) => void
  addAttachment: (id: string, file: { name: string; url: string; size: string }) => void
}

const DEFAULT_WORK_ORDERS: WorkOrder[] = [
  {
    id: "wo-1",
    projectId: "proj-1",
    title: "Excavation and Site Grading",
    description: "Clear site rubble, grade slopes according to geotechnical designs, and prepare foundation footprints.",
    status: "Completed",
    priority: "High",
    startDate: "2026-06-01",
    dueDate: "2026-06-10",
    progress: 100,
    assigneeId: "crew-1",
    assigneeName: "Apex Earthworks Crew",
    dependencies: [],
    attachments: [
      { name: "soil_report.pdf", url: "#", size: "2.4 MB" },
      { name: "grading_plan.dwg", url: "#", size: "12.8 MB" }
    ]
  },
  {
    id: "wo-2",
    projectId: "proj-1",
    title: "Foundation Slab Rebar Install",
    description: "Tie grade 60 steel rebars as per reinforcement blueprint layout details.",
    status: "In Progress",
    priority: "Critical",
    startDate: "2026-06-12",
    dueDate: "2026-06-20",
    progress: 75,
    assigneeId: "crew-2",
    assigneeName: "Steel-Fixing Team B",
    dependencies: ["wo-1"],
    attachments: [
      { name: "slab_reinforcement.pdf", url: "#", size: "5.1 MB" }
    ]
  },
  {
    id: "wo-3",
    projectId: "proj-1",
    title: "Electrical Rough-Ins Conduit",
    description: "Install PVC conduits inside wall frameworks prior to concrete pouring.",
    status: "Scheduled",
    priority: "Medium",
    startDate: "2026-06-22",
    dueDate: "2026-06-28",
    progress: 0,
    assigneeId: "crew-3",
    assigneeName: "BrightWire Subcontractors",
    dependencies: ["wo-2"],
    attachments: []
  },
  {
    id: "wo-4",
    projectId: "proj-1",
    title: "Slab Concrete Pour",
    description: "Volumetric pour of 350 cubic meters of 4000 PSI concrete mix under inspection supervision.",
    status: "Blocked",
    priority: "Critical",
    startDate: "2026-06-25",
    dueDate: "2026-06-26",
    progress: 10,
    assigneeId: "crew-4",
    assigneeName: "Concrete Masonry Crew A",
    dependencies: ["wo-2", "wo-3"],
    attachments: [
      { name: "concrete_mix_design.pdf", url: "#", size: "1.1 MB" }
    ]
  }
]

export const useWorkOrderStore = create<WorkOrderState>((set) => ({
  workOrders: DEFAULT_WORK_ORDERS,
  selectedWorkOrderId: null,
  addWorkOrder: (wo) => set((state) => ({
    workOrders: [
      ...state.workOrders,
      { ...wo, id: `wo-${Date.now()}` }
    ]
  })),
  updateWorkOrder: (id, updates) => set((state) => ({
    workOrders: state.workOrders.map((wo) =>
      wo.id === id ? { ...wo, ...updates } : wo
    )
  })),
  deleteWorkOrder: (id) => set((state) => ({
    workOrders: state.workOrders.filter((wo) => wo.id !== id),
    selectedWorkOrderId: state.selectedWorkOrderId === id ? null : state.selectedWorkOrderId
  })),
  setSelectedWorkOrder: (id) => set({ selectedWorkOrderId: id }),
  addAttachment: (id, file) => set((state) => ({
    workOrders: state.workOrders.map((wo) =>
      wo.id === id ? { ...wo, attachments: [...wo.attachments, file] } : wo
    )
  }))
}))

export default useWorkOrderStore
