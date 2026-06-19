import { create } from 'zustand'

export interface HazardRecord {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'Open' | 'Resolved'
  location: string
  timestamp: string
}

interface SafetyState {
  hazards: HazardRecord[]
  isSosTriggered: boolean
  triggerSos: (triggered: boolean) => void
  logHazard: (hazard: Omit<HazardRecord, 'id' | 'status' | 'timestamp'>) => void
  resolveHazard: (id: string) => void
}

const INITIAL_HAZARDS: HazardRecord[] = [
  { id: "haz_1", title: "Missing Scaffold Rails", description: "Floor 3 North scaffold missing toe-boards.", severity: "critical", status: "Open", location: "Building A - Floor 3", timestamp: "2026-06-18 09:12 AM" },
  { id: "haz_2", title: "Loose wiring in excavation pit", description: "Water accumulating around utility cables.", severity: "high", status: "Open", location: "Sector C pit", timestamp: "2026-06-18 02:40 PM" }
]

export const useSafetyStore = create<SafetyState>((set) => ({
  hazards: INITIAL_HAZARDS,
  isSosTriggered: false,

  triggerSos: (triggered) => set({ isSosTriggered: triggered }),

  logHazard: (newHazard) => set((state) => {
    const record: HazardRecord = {
      ...newHazard,
      id: `haz_${Date.now()}`,
      status: "Open",
      timestamp: new Date().toLocaleString()
    }
    return { hazards: [record, ...state.hazards] }
  }),

  resolveHazard: (id) => set((state) => ({
    hazards: state.hazards.map((h) => (h.id === id ? { ...h, status: "Resolved" } : h))
  }))
}))
