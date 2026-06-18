import { create } from 'zustand'

export interface ProjectItem {
  id: string
  name: string
  location: string
  budget: string
  progress: number
  hazards: number
}

export interface WbsNode {
  id: string
  code: string
  name: string
  start: string
  end: string
  progress: number
  parentId: string | null
}

export interface RfiItem {
  id: string
  title: string
  status: 'Open' | 'Reviewing' | 'Resolved'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  assignee: string
  comments: string[]
}

export interface ProjectState {
  projects: ProjectItem[]
  wbsNodes: WbsNode[]
  rfis: RfiItem[]
  addProject: (project: Omit<ProjectItem, 'id'>) => void
  addWbsNode: (node: Omit<WbsNode, 'id'>) => void
  updateWbsNode: (id: string, start: string, end: string, progress: number) => void
  addRfiComment: (rfiId: string, comment: string) => void
}

const INITIAL_PROJECTS: ProjectItem[] = [
  { id: "1", name: "Tower A Residences", location: "Bengaluru, India", budget: "$45.2M", progress: 78, hazards: 0 },
  { id: "2", name: "APEX Commercial Hub", location: "San Jose, CA", budget: "$124.0M", progress: 45, hazards: 1 },
  { id: "3", name: "Metro Line Underground", location: "Mumbai, India", budget: "$210.5M", progress: 12, hazards: 4 }
]

const INITIAL_WBS_NODES: WbsNode[] = [
  { id: "w_1", code: "1.0", name: "Excavation & Substructure", start: "2026-06-01", end: "2026-06-15", progress: 100, parentId: null },
  { id: "w_1.1", code: "1.1", name: "Soil analysis and clearing", start: "2026-06-01", end: "2026-06-05", progress: 100, parentId: "w_1" },
  { id: "w_1.2", code: "1.2", name: "Slab Level 1 Foundation Pour", start: "2026-06-06", end: "2026-06-15", progress: 100, parentId: "w_1" },
  { id: "w_2", code: "2.0", name: "Superstructure Framing", start: "2026-06-16", end: "2026-07-10", progress: 30, parentId: null },
  { id: "w_2.1", code: "2.1", name: "Columns Rebar installation", start: "2026-06-16", end: "2026-06-25", progress: 65, parentId: "w_2" },
  { id: "w_2.2", code: "2.2", name: "Volumetric Concrete Pouring", start: "2026-06-26", end: "2026-07-10", progress: 0, parentId: "w_2" }
]

const INITIAL_RFIS: RfiItem[] = [
  { id: "rfi_1", title: "Rebar Spacing Conflict on Level 3", status: "Open", priority: "Critical", assignee: "Sarah Connor (SE)", comments: ["Superintendent: Can we shift rebar pitch by 2 inches east?", "Structural Engineer: Checking structural shear tolerance specs..."] },
  { id: "rfi_2", title: "Perimeter Safety Mesh Netting", status: "Reviewing", priority: "High", assignee: "Dave Miller (Safety)", comments: ["Safety: Mesh missing Sector B floor edge.", "Superintendent: Vendor dispatching reinforcements today."] }
]

export const useProjectStore = create<ProjectState>((set) => ({
  projects: INITIAL_PROJECTS,
  wbsNodes: INITIAL_WBS_NODES,
  rfis: INITIAL_RFIS,
  addProject: (proj) => set((state) => ({
    projects: [...state.projects, { ...proj, id: `p_${Date.now()}` }]
  })),
  addWbsNode: (node) => set((state) => ({
    wbsNodes: [...state.wbsNodes, { ...node, id: `w_${Date.now()}` }]
  })),
  updateWbsNode: (id, start, end, progress) => set((state) => ({
    wbsNodes: state.wbsNodes.map((w) =>
      w.id === id ? { ...w, start, end, progress } : w
    )
  })),
  addRfiComment: (rfiId, comment) => set((state) => ({
    rfis: state.rfis.map((rfi) =>
      rfi.id === rfiId ? { ...rfi, comments: [...rfi.comments, comment] } : rfi
    )
  }))
}))
export default useProjectStore
