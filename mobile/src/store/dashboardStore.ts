import { create } from 'zustand'

export interface DashboardKPIs {
  progressPercentage: number
  activeWorkers: number
  budgetSpent: number
  openSafetyHazards: number
  reorderMaterialsCount: number
}

interface DashboardState {
  kpis: DashboardKPIs
  weatherTemp: string
  weatherCondition: string
  syncStatus: 'synced' | 'pending' | 'syncing'
  setSyncStatus: (status: 'synced' | 'pending' | 'syncing') => void
  fetchDashboardData: () => Promise<void>
}

export const useDashboardStore = create<DashboardState>((set) => ({
  kpis: {
    progressPercentage: 68.5,
    activeWorkers: 48,
    budgetSpent: 120000,
    openSafetyHazards: 2,
    reorderMaterialsCount: 1
  },
  weatherTemp: "32°C",
  weatherCondition: "Mostly Sunny",
  syncStatus: "synced",

  setSyncStatus: (status) => set({ syncStatus: status }),
  
  fetchDashboardData: async () => {
    // Sync data or update state
    set({
      kpis: {
        progressPercentage: 70.2,
        activeWorkers: 52,
        budgetSpent: 124500,
        openSafetyHazards: 1,
        reorderMaterialsCount: 2
      }
    })
  }
}))
