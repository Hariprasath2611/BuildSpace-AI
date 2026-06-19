import { create } from 'zustand'

export interface ClockRecord {
  id: string
  type: 'in' | 'out'
  timestamp: string
  latitude: number
  longitude: number
  method: 'GPS' | 'QR' | 'Face'
}

interface AttendanceState {
  isClockedIn: boolean
  lastClockRecord: ClockRecord | null
  history: ClockRecord[]
  clockIn: (lat: number, lng: number, method: 'GPS' | 'QR' | 'Face') => Promise<void>
  clockOut: (lat: number, lng: number, method: 'GPS' | 'QR' | 'Face') => Promise<void>
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  isClockedIn: false,
  lastClockRecord: null,
  history: [
    { id: "att_1", type: "in", timestamp: "2026-06-18 08:02 AM", latitude: 12.9716, longitude: 77.5946, method: "GPS" },
    { id: "att_2", type: "out", timestamp: "2026-06-18 05:14 PM", latitude: 12.9718, longitude: 77.5948, method: "GPS" }
  ],

  clockIn: async (lat, lng, method) => {
    const newRecord: ClockRecord = {
      id: `att_${Date.now()}`,
      type: "in",
      timestamp: new Date().toLocaleString(),
      latitude: lat,
      longitude: lng,
      method
    }
    set((state) => ({
      isClockedIn: true,
      lastClockRecord: newRecord,
      history: [newRecord, ...state.history]
    }))
  },

  clockOut: async (lat, lng, method) => {
    const newRecord: ClockRecord = {
      id: `att_${Date.now()}`,
      type: "out",
      timestamp: new Date().toLocaleString(),
      latitude: lat,
      longitude: lng,
      method
    }
    set((state) => ({
      isClockedIn: false,
      lastClockRecord: newRecord,
      history: [newRecord, ...state.history]
    }))
  }
}))
