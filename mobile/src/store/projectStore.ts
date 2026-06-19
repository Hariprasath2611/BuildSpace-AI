import { create } from 'zustand'
import { api } from '../services/api'


export interface Project {
  id: string
  name: string
  location: string
  budget: number
  progress: number
  milestones: Array<{ id: string; name: string; date: string; status: 'completed' | 'pending' }>
  media: Array<{ id: string; type: 'image' | 'video'; url: string; timestamp: string }>
}

interface ProjectState {
  projects: Project[]
  activeProjectId: string | null
  setActiveProjectId: (id: string | null) => void
  fetchProjects: () => Promise<void>
  addProjectMedia: (projectId: string, type: 'image' | 'video', url: string) => void
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj_1",
    name: "Apex Commercial Tower",
    location: "Sector 14, Bengaluru",
    budget: 15000000,
    progress: 68.5,
    milestones: [
      { id: "m_1", name: "Excavation & Shoring", date: "2026-04-15", status: "completed" },
      { id: "m_2", name: "Sub-grade Slab Pour", date: "2026-05-30", status: "completed" },
      { id: "m_3", name: "Floor 2 Columns Assembly", date: "2026-06-25", status: "pending" }
    ],
    media: [
      { id: "med_1", type: "image", url: "https://example.com/construction1.jpg", timestamp: "2026-06-18 09:30 AM" }
    ]
  },
  {
    id: "proj_2",
    name: "Metro Station Geotech",
    location: "MG Road, Pune",
    budget: 8500000,
    progress: 32.0,
    milestones: [
      { id: "m_2_1", name: "Soil Core Boring Test", date: "2026-05-10", status: "completed" },
      { id: "m_2_2", name: "Drilling Support Piles", date: "2026-07-10", status: "pending" }
    ],
    media: []
  }
]

export const useProjectStore = create<ProjectState>((set) => ({
  projects: INITIAL_PROJECTS,
  activeProjectId: "proj_1",

  setActiveProjectId: (id) => set({ activeProjectId: id }),

  fetchProjects: async () => {
    // In production, sync from server.
    // For now we keep initial state.
  },

  addProjectMedia: (projectId, type, url) => set((state) => ({
    projects: state.projects.map((p) => {
      if (p.id !== projectId) return p
      return {
        ...p,
        media: [
          {
            id: `med_${Date.now()}`,
            type,
            url,
            timestamp: new Date().toLocaleString()
          },
          ...p.media
        ]
      }
    })
  }))
}))
