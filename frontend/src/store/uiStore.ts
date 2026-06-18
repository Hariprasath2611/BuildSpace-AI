import { create } from 'zustand'

export interface UIState {
  isSidebarExpanded: boolean
  isCommandPaletteOpen: boolean
  isNotificationOpen: boolean
  toggleSidebar: () => void
  setSidebarExpanded: (expanded: boolean) => void
  toggleCommandPalette: () => void
  setCommandPaletteOpen: (open: boolean) => void
  toggleNotification: () => void
  setNotificationOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarExpanded: true,
  isCommandPaletteOpen: false,
  isNotificationOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
  setSidebarExpanded: (expanded) => set({ isSidebarExpanded: expanded }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleNotification: () => set((state) => ({ isNotificationOpen: !state.isNotificationOpen })),
  setNotificationOpen: (open) => set({ isNotificationOpen: open }),
}))
export default useUIStore
