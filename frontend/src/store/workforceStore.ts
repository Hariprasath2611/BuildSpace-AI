import { create } from 'zustand'

export interface Worker {
  id: string
  name: string
  role: string
  department: string
  skills: string[]
  allocation: string
  status: 'Active' | 'Break' | 'Leave' | 'Inactive'
  safetyRating: number
  employmentType: 'Direct' | 'Subcontractor' | 'Hourly'
}

export interface AttendanceEntry {
  id: string
  workerId: string
  clockIn: string
  clockOut: string
  geofence: string
  date: string
}

export interface ShiftAssignment {
  id: string
  workerId: string
  day: string // 'Mon', 'Tue', etc.
  type: 'Day Shift' | 'Night Shift' | 'Off'
}

export interface Certification {
  id: string
  workerId: string
  name: string
  expiryDate: string
  status: 'Active' | 'Warning' | 'Expired'
}

export interface WorkforceState {
  workers: Worker[]
  attendance: AttendanceEntry[]
  shifts: ShiftAssignment[]
  certifications: Certification[]
  
  onboardEmployee: (worker: Omit<Worker, 'id' | 'status' | 'safetyRating'>) => void
  clockInWorker: (workerId: string, geofence: string) => void
  clockOutWorker: (workerId: string) => void
  renewCertification: (id: string, nextExpiry: string) => void
  assignShift: (workerId: string, day: string, type: 'Day Shift' | 'Night Shift' | 'Off') => void
}

const INITIAL_WORKERS: Worker[] = [
  { id: "w_1", name: "John Doe", role: "Lead Crane Operator", department: "Structure", skills: ["Tower Crane Operation", "Rigging Level II"], allocation: "Tower A Residences", status: "Active", safetyRating: 98, employmentType: "Direct" },
  { id: "w_2", name: "Sarah Jones", role: "Structural Welder", department: "Structure", skills: ["3G Structural Welding", "Flux-Cored Arc Welding"], allocation: "APEX Commercial Hub", status: "Active", safetyRating: 100, employmentType: "Subcontractor" },
  { id: "w_3", name: "Dave Miller", role: "Safety Superintendent", department: "Safety", skills: ["OSHA 30 Construction", "First Aid / CPR Certified"], allocation: "Metro Line Underground", status: "Active", safetyRating: 100, employmentType: "Direct" },
  { id: "w_4", name: "Tom Harris", role: "Heavy Equipment Operator", department: "Excavation", skills: ["Excavator Operation", "Trenching safety"], allocation: "Tower A Residences", status: "Inactive", safetyRating: 92, employmentType: "Hourly" }
]

const INITIAL_ATTENDANCE: AttendanceEntry[] = [
  { id: "att_1", workerId: "w_1", clockIn: "07:58 AM", clockOut: "---", geofence: "Gate A (Main Yard)", date: "2026-06-18" },
  { id: "att_2", workerId: "w_2", clockIn: "08:02 AM", clockOut: "---", geofence: "Gate B (Sector A)", date: "2026-06-18" },
  { id: "att_3", workerId: "w_3", clockIn: "07:45 AM", clockOut: "04:30 PM", geofence: "Main Portal", date: "2026-06-17" }
]

const INITIAL_SHIFTS: ShiftAssignment[] = [
  { id: "s_1", workerId: "w_1", day: "Mon", type: "Day Shift" },
  { id: "s_2", workerId: "w_1", day: "Tue", type: "Day Shift" },
  { id: "s_3", workerId: "w_1", day: "Wed", type: "Day Shift" },
  { id: "s_4", workerId: "w_1", day: "Thu", type: "Night Shift" },
  { id: "s_5", workerId: "w_1", day: "Fri", type: "Night Shift" },
  { id: "s_6", workerId: "w_1", day: "Sat", type: "Off" },
  { id: "s_7", workerId: "w_1", day: "Sun", type: "Off" },

  { id: "s_8", workerId: "w_2", day: "Mon", type: "Night Shift" },
  { id: "s_9", workerId: "w_2", day: "Tue", type: "Night Shift" },
  { id: "s_10", workerId: "w_2", day: "Wed", type: "Off" },
  { id: "s_11", workerId: "w_2", day: "Thu", type: "Off" },
  { id: "s_12", workerId: "w_2", day: "Fri", type: "Day Shift" },
  { id: "s_13", workerId: "w_2", day: "Sat", type: "Day Shift" },
  { id: "s_14", workerId: "w_2", day: "Sun", type: "Day Shift" }
]

const INITIAL_CERTS: Certification[] = [
  { id: "c_1", workerId: "w_1", name: "NCCCO Crane Operator License", expiryDate: "2026-07-20", status: "Warning" },
  { id: "c_2", workerId: "w_1", name: "OSHA 30 Construction safety", expiryDate: "2026-12-12", status: "Active" },
  { id: "c_3", workerId: "w_2", name: "AWS 3G Structural Welding cert", expiryDate: "2026-06-15", status: "Expired" }
]

export const useWorkforceStore = create<WorkforceState>((set) => ({
  workers: INITIAL_WORKERS,
  attendance: INITIAL_ATTENDANCE,
  shifts: INITIAL_SHIFTS,
  certifications: INITIAL_CERTS,

  onboardEmployee: (worker) => set((state) => ({
    workers: [...state.workers, {
      ...worker,
      id: `w_${Date.now()}`,
      status: 'Inactive',
      safetyRating: 100
    }]
  })),

  clockInWorker: (workerId, geofence) => set((state) => {
    const today = new Date().toISOString().split('T')[0]
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const nextEntry: AttendanceEntry = {
      id: `att_${Date.now()}`,
      workerId,
      clockIn: nowTime,
      clockOut: '---',
      geofence,
      date: today
    }
    return {
      attendance: [...state.attendance, nextEntry],
      workers: state.workers.map((w) =>
        w.id === workerId ? { ...w, status: 'Active' } : w
      )
    }
  }),

  clockOutWorker: (workerId) => set((state) => {
    const today = new Date().toISOString().split('T')[0]
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return {
      attendance: state.attendance.map((att) =>
        att.workerId === workerId && att.date === today && att.clockOut === '---'
          ? { ...att, clockOut: nowTime }
          : att
      ),
      workers: state.workers.map((w) =>
        w.id === workerId ? { ...w, status: 'Inactive' } : w
      )
    }
  }),

  renewCertification: (id, nextExpiry) => set((state) => ({
    certifications: state.certifications.map((c) => {
      if (c.id === id) {
        const nextStatus = new Date(nextExpiry) > new Date() ? 'Active' : 'Expired'
        return {
          ...c,
          expiryDate: nextExpiry,
          status: nextStatus as any
        }
      }
      return c
    })
  })),

  assignShift: (workerId, day, type) => set((state) => {
    const exists = state.shifts.some(s => s.workerId === workerId && s.day === day)
    const nextShifts = exists
      ? state.shifts.map(s => s.workerId === workerId && s.day === day ? { ...s, type } : s)
      : [...state.shifts, { id: `s_${Date.now()}`, workerId, day, type }]
    return { shifts: nextShifts }
  })
}))

export default useWorkforceStore
