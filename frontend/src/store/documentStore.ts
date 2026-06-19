import { create } from 'zustand'

export interface DocumentItem {
  id: string
  name: string
  folderId: string | null
  category: 'Drawing' | 'Contract' | 'Method Statement' | 'Invoice' | 'Permit'
  version: number
  uploadedBy: string
  dateUploaded: string
  size: string
  locked: boolean
  lockedBy?: string
  approvalStatus: 'Pending' | 'Approved' | 'Rejected'
  tags: string[]
  isDeleted: boolean
}

export interface FolderItem {
  id: string
  name: string
  parentId: string | null
}

export interface DocumentState {
  documents: DocumentItem[]
  folders: FolderItem[]
  selectedFolderId: string | null
  uploadDocument: (doc: Omit<DocumentItem, 'id' | 'version' | 'locked' | 'isDeleted'>) => void
  lockDocument: (id: string, userName: string) => void
  unlockDocument: (id: string) => void
  approveDocument: (id: string, status: DocumentItem['approvalStatus']) => void
  createFolder: (name: string, parentId: string | null) => void
  deleteDocument: (id: string) => void
  restoreDocument: (id: string) => void
  setSelectedFolder: (id: string | null) => void
}

const DEFAULT_FOLDERS: FolderItem[] = [
  { id: "fol-1", name: "Architectural Drawings", parentId: null },
  { id: "fol-2", name: "Structural Calculations", parentId: null },
  { id: "fol-3", name: "Legal Contracts", parentId: null },
  { id: "fol-4", name: "Vendor Invoices", parentId: null }
]

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    name: "Ground_Floor_Plan_v3.pdf",
    folderId: "fol-1",
    category: "Drawing",
    version: 3,
    uploadedBy: "Robert Dow",
    dateUploaded: "2026-06-12",
    size: "12.8 MB",
    locked: false,
    approvalStatus: "Approved",
    tags: ["Ground Floor", "Layout"],
    isDeleted: false
  },
  {
    id: "doc-2",
    name: "Level_1_Electrical_v1.pdf",
    folderId: "fol-1",
    category: "Drawing",
    version: 1,
    uploadedBy: "Linus Tech",
    dateUploaded: "2026-06-08",
    size: "5.4 MB",
    locked: true,
    lockedBy: "Linus Tech",
    approvalStatus: "Pending",
    tags: ["Level 1", "Electrical", "Conduits"],
    isDeleted: false
  },
  {
    id: "doc-3",
    name: "Subcontractor_Framework_Agreement.pdf",
    folderId: "fol-3",
    category: "Contract",
    version: 1,
    uploadedBy: "Robert Dow",
    dateUploaded: "2026-05-20",
    size: "1.2 MB",
    locked: false,
    approvalStatus: "Approved",
    tags: ["Subcontractor", "Apex Earthworks"],
    isDeleted: false
  }
]

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: DEFAULT_DOCUMENTS,
  folders: DEFAULT_FOLDERS,
  selectedFolderId: null,
  uploadDocument: (doc) => set((state) => ({
    documents: [
      ...state.documents,
      { ...doc, id: `doc-${Date.now()}`, version: 1, locked: false, isDeleted: false }
    ]
  })),
  lockDocument: (id, userName) => set((state) => ({
    documents: state.documents.map((d) => d.id === id ? { ...d, locked: true, lockedBy: userName } : d)
  })),
  unlockDocument: (id) => set((state) => ({
    documents: state.documents.map((d) => d.id === id ? { ...d, locked: false, lockedBy: undefined } : d)
  })),
  approveDocument: (id, status) => set((state) => ({
    documents: state.documents.map((d) => d.id === id ? { ...d, approvalStatus: status } : d)
  })),
  createFolder: (name, parentId) => set((state) => ({
    folders: [...state.folders, { id: `fol-${Date.now()}`, name, parentId }]
  })),
  deleteDocument: (id) => set((state) => ({
    documents: state.documents.map((d) => d.id === id ? { ...d, isDeleted: true } : d)
  })),
  restoreDocument: (id) => set((state) => ({
    documents: state.documents.map((d) => d.id === id ? { ...d, isDeleted: false } : d)
  })),
  setSelectedFolder: (id) => set({ selectedFolderId: id })
}))

export default useDocumentStore
