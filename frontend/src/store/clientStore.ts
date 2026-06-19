import { create } from 'zustand'

export interface ClientMilestone {
  id: string
  name: string
  status: 'Completed' | 'Active' | 'Planned'
  plannedDate: string
  actualDate: string
  progress: number
}

export interface ClientAnnotation {
  id: string
  x: number
  y: number
  label: string
  severity: 'Low' | 'Medium' | 'High'
}

export interface ClientMedia {
  id: string
  fileName: string
  uploadDate: string
  annotations: ClientAnnotation[]
}

export interface ClientDocument {
  id: string
  name: string
  size: string
  uploadDate: string
  category: 'Contract' | 'CAD Drawing' | 'OSHA Log'
  version: number
}

export interface ClientInvoice {
  id: string
  title: string
  amount: number
  dueDate: string
  status: 'Paid' | 'Pending Approval' | 'Rejected'
}

export interface ClientChangeOrder {
  id: string
  title: string
  amount: number
  reason: string
  status: 'approved' | 'pending' | 'rejected'
}

export interface ClientMeeting {
  id: string
  title: string
  dateTime: string
  agenda: string
  summary: string
}

export interface ClientState {
  progressPercentage: number
  milestones: ClientMilestone[]
  mediaGallery: ClientMedia[]
  documents: ClientDocument[]
  invoices: ClientInvoice[]
  changeOrders: ClientChangeOrder[]
  meetings: ClientMeeting[]
  activeMediaId: string | null
  
  // Actions
  addAnnotation: (mediaId: string, annotation: Omit<ClientAnnotation, 'id'>) => void
  approveChangeOrder: (id: string) => void
  rejectChangeOrder: (id: string) => void
  approveInvoice: (id: string) => void
  rejectInvoice: (id: string) => void
}

const INITIAL_MILESTONES: ClientMilestone[] = [
  { id: "m_1", name: "Excavation Works", status: "Completed", plannedDate: "2026-02-10", actualDate: "2026-02-08", progress: 100 },
  { id: "m_2", name: "Foundation & Footings Pour", status: "Completed", plannedDate: "2026-04-12", actualDate: "2026-04-15", progress: 100 },
  { id: "m_3", name: "Structural Framing Phase", status: "Active", plannedDate: "2026-08-14", actualDate: "---", progress: 65 },
  { id: "m_4", name: "Gypsum Drywalling", status: "Planned", plannedDate: "2026-10-20", actualDate: "---", progress: 0 }
]

const INITIAL_MEDIA: ClientMedia[] = [
  {
    id: "med_1",
    fileName: "Zone_B_Drywalling.jpg",
    uploadDate: "June 14, 2026",
    annotations: [
      { id: "an_1", x: 45, y: 35, label: "Concrete surface rebar crack", severity: "High" },
      { id: "an_2", x: 75, y: 65, label: "Framing layout checks completed", severity: "Low" }
    ]
  },
  {
    id: "med_2",
    fileName: "Sector_C_Foundations.jpg",
    uploadDate: "June 02, 2026",
    annotations: []
  }
]

const INITIAL_DOCS: ClientDocument[] = [
  { id: "doc_1", name: "Contract_Apex_Plaza_SaaS.pdf", size: "4.2 MB", uploadDate: "2026-01-10", category: "Contract", version: 1 },
  { id: "doc_2", name: "Drawing_Arch_Sector_B_Rev2.dwg", size: "18.5 MB", uploadDate: "2026-05-20", category: "CAD Drawing", version: 2 },
  { id: "doc_3", name: "OSHA_Scaffold_Compliance_Checklist.pdf", size: "1.2 MB", uploadDate: "2026-06-12", category: "OSHA Log", version: 1 }
]

const INITIAL_INVOICES: ClientInvoice[] = [
  { id: "inv_1", title: "Milestone Invoice - Excavation Works", amount: 42500, dueDate: "2026-03-01", status: "Paid" },
  { id: "inv_2", title: "Milestone Invoice - Concrete Foundation Pour", amount: 120000, dueDate: "2026-06-25", status: "Pending Approval" }
]

const INITIAL_CHANGE_ORDERS: ClientChangeOrder[] = [
  { id: "co_1", title: "Structural Metal Framing Beam Substitutes", amount: 14500, reason: "Supplier steel size unavailability requires alternate structural load distribution layout", status: "pending" }
]

const INITIAL_MEETINGS: ClientMeeting[] = [
  { id: "meet_1", title: "Weekly Progress Sync Meeting", dateTime: "June 20, 10:00 AM", agenda: "Steel supply substitutions reviews and milestone schedule projections", summary: "Superintendent approved Supplier B steel beam specification. Milestone schedule for Framing is forecast to complete on time." }
]

export const useClientStore = create<ClientState>((set) => ({
  progressPercentage: 78.4,
  milestones: INITIAL_MILESTONES,
  mediaGallery: INITIAL_MEDIA,
  documents: INITIAL_DOCS,
  invoices: INITIAL_INVOICES,
  changeOrders: INITIAL_CHANGE_ORDERS,
  meetings: INITIAL_MEETINGS,
  activeMediaId: "med_1",

  addAnnotation: (mediaId, annotation) => {
    set((state) => ({
      mediaGallery: state.mediaGallery.map((m) => {
        if (m.id !== mediaId) return m
        const newAnn: ClientAnnotation = {
          ...annotation,
          id: `an_${Date.now()}`
        }
        return {
          ...m,
          annotations: [...m.annotations, newAnn]
        }
      })
    }))
  },

  approveChangeOrder: (id) => {
    set((state) => ({
      changeOrders: state.changeOrders.map((co) => (co.id === id ? { ...co, status: 'approved' as const } : co))
    }))
  },

  rejectChangeOrder: (id) => {
    set((state) => ({
      changeOrders: state.changeOrders.map((co) => (co.id === id ? { ...co, status: 'rejected' as const } : co))
    }))
  },

  approveInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, status: 'Paid' as const } : inv))
    }))
  },

  rejectInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, status: 'Rejected' as const } : inv))
    }))
  }
}))
