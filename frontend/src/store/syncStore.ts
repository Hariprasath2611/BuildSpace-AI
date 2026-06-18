import { create } from 'zustand'

export interface SyncItem {
  id: string
  action: string
  payload: unknown
  timestamp: number
}

export interface SyncState {
  isOnline: boolean
  queue: SyncItem[]
  setOnline: (online: boolean) => void
  addToQueue: (action: string, payload: unknown) => void
  clearQueue: () => void
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: true,
  queue: [],
  setOnline: (isOnline) => set({ isOnline }),
  addToQueue: (action, payload) => set((state) => ({
    queue: [
      ...state.queue,
      { id: `sync_${Date.now()}`, action, payload, timestamp: Date.now() }
    ]
  })),
  clearQueue: () => set({ queue: [] }),
}))
export default useSyncStore
