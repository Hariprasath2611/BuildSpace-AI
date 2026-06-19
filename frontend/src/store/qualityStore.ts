import { create } from 'zustand'

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
  notes: string
}

export interface QualityChecklist {
  id: string
  title: string
  projectId: string
  projectName: string
  inspectorName: string
  date: string
  items: ChecklistItem[]
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
}

export interface SnagItem {
  id: string
  projectId: string
  title: string
  description: string
  drawingName: string
  x: number // percent coordinate on drawing (0-100)
  y: number // percent coordinate on drawing (0-100)
  status: 'Open' | 'Pending Verification' | 'Resolved' | 'Approved'
  priority: 'Low' | 'Medium' | 'High'
  assignedTo: string
  dueDate: string
  comments: string[]
}

export interface QualityState {
  checklists: QualityChecklist[]
  snags: SnagItem[]
  addChecklist: (c: Omit<QualityChecklist, 'id'>) => void
  updateChecklist: (id: string, updates: Partial<QualityChecklist>) => void
  addSnag: (snag: Omit<SnagItem, 'id'>) => void
  updateSnag: (id: string, updates: Partial<SnagItem>) => void
  addSnagComment: (id: string, comment: string) => void
}

const DEFAULT_CHECKLISTS: QualityChecklist[] = [
  {
    id: "qc-1",
    title: "Pre-Pour Reinforcement Inspection",
    projectId: "proj-1",
    projectName: "Downtown Plaza Site",
    inspectorName: "Robert Dow",
    date: "2026-06-15",
    status: "Approved",
    items: [
      { id: "ci-1", label: "Rebar diameter matches blueprints structural drawings", checked: true, notes: "Grade 60 steel verified." },
      { id: "ci-2", label: "Concrete covers are properly positioned on chairs", checked: true, notes: "3-inch clearance verified." },
      { id: "ci-3", label: "Formwork is clear of soil, sawdust, and debris", checked: true, notes: "Vacuumed before pouring." },
      { id: "ci-4", label: "Conduit layouts match electrical schedule specifications", checked: true, notes: "PVC fittings glued." }
    ]
  },
  {
    id: "qc-2",
    title: "Drywall Framing Quality Check",
    projectId: "proj-1",
    projectName: "Downtown Plaza Site",
    inspectorName: "Robert Dow",
    date: "2026-06-18",
    status: "Submitted",
    items: [
      { id: "ci-5", label: "Metal studs are spaced exactly 16 inches on center", checked: true, notes: "" },
      { id: "ci-6", label: "Door frame reinforcements are double-studded", checked: false, notes: "Needs double header on south lobby entrance." },
      { id: "ci-7", label: "Expansion joint layouts conform to fire code", checked: true, notes: "" }
    ]
  }
]

const DEFAULT_SNAGS: SnagItem[] = [
  {
    id: "sn-1",
    projectId: "proj-1",
    title: "Concrete honeycomb voids near Column B4",
    description: "Surface honeycomb voids visible after formwork removal. Requires mortar patching and structural review.",
    drawingName: "Ground_Floor_Plan_v3.pdf",
    x: 42.5,
    y: 68.2,
    status: "Open",
    priority: "High",
    assignedTo: "Apex Concrete Crew",
    dueDate: "2026-06-22",
    comments: [
      "Vibrator failure during concrete pour caused structural segregation.",
      "Structural engineer notified. Patching with high-strength mortar approved."
    ]
  },
  {
    id: "sn-2",
    projectId: "proj-1",
    title: "Exposed electrical wire splices in Room 102",
    description: "Temporary wire splice lacks wire nut and junction box cover. Safety violation.",
    drawingName: "Level_1_Electrical_v1.pdf",
    x: 75.1,
    y: 28.4,
    status: "Pending Verification",
    priority: "High",
    assignedTo: "BrightWire Subcontractors",
    dueDate: "2026-06-19",
    comments: [
      "Junction box fitted with wire nuts. Waiting for supervisor approval."
    ]
  }
]

export const useQualityStore = create<QualityState>((set) => ({
  checklists: DEFAULT_CHECKLISTS,
  snags: DEFAULT_SNAGS,
  addChecklist: (c) => set((state) => ({
    checklists: [...state.checklists, { ...c, id: `qc-${Date.now()}` }]
  })),
  updateChecklist: (id, updates) => set((state) => ({
    checklists: state.checklists.map((c) => c.id === id ? { ...c, ...updates } : c)
  })),
  addSnag: (snag) => set((state) => ({
    snags: [...state.snags, { ...snag, id: `sn-${Date.now()}` }]
  })),
  updateSnag: (id, updates) => set((state) => ({
    snags: state.snags.map((sn) => sn.id === id ? { ...sn, ...updates } : sn)
  })),
  addSnagComment: (id, comment) => set((state) => ({
    snags: state.snags.map((sn) =>
      sn.id === id ? { ...sn, comments: [...sn.comments, comment] } : sn
    )
  }))
}))

export default useQualityStore
