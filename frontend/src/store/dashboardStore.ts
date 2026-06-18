import { create } from 'zustand'

export interface WidgetItem {
  id: string
  type: 'stats' | 'progress' | 'weather' | 'safety' | 'budget'
  title: string
}

export interface DashboardState {
  widgets: WidgetItem[]
  addWidget: (type: WidgetItem['type'], title: string) => void
  removeWidget: (id: string) => void
  resetWidgets: () => void
}

const DEFAULT_WIDGETS: WidgetItem[] = [
  { id: "w1", type: "stats", title: "Volumetric Progress Overview" },
  { id: "w2", type: "weather", title: "Site Weather Limits Warning" },
  { id: "w3", type: "progress", title: "Critical Path Pour Progress" },
  { id: "w4", type: "safety", title: "Active Safety Observations" }
]

export const useDashboardStore = create<DashboardState>((set) => ({
  widgets: DEFAULT_WIDGETS,
  addWidget: (type, title) => set((state) => ({
    widgets: [...state.widgets, { id: `w_${Date.now()}`, type, title }]
  })),
  removeWidget: (id) => set((state) => ({
    widgets: state.widgets.filter((w) => w.id !== id)
  })),
  resetWidgets: () => set({ widgets: DEFAULT_WIDGETS })
}))
export default useDashboardStore
