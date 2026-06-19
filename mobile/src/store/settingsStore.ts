import { create } from 'zustand'

interface SettingsState {
  isDarkMode: boolean
  isOfflineSyncEnabled: boolean
  language: 'en' | 'es' | 'hi'
  toggleDarkMode: () => void
  toggleOfflineSync: () => void
  setLanguage: (lang: 'en' | 'es' | 'hi') => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isDarkMode: true,
  isOfflineSyncEnabled: true,
  language: "en",

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  toggleOfflineSync: () => set((state) => ({ isOfflineSyncEnabled: !state.isOfflineSyncEnabled })),
  
  setLanguage: (lang) => set({ language: lang })
}))
