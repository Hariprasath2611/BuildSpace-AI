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

export interface Subcontractor {
  id: string
  name: string
  activeCount: number
  complianceScore: number
  projects: string[]
}

export interface SafetyViolation {
  id: string
  location: string
  hazardDescription: string
  violatorCrew: string
  severity: 'Minor' | 'Major' | 'Critical'
  loggedAt: string
}

export interface GpsLocation {
  id: string
  workerName: string
  role: string
  lat: number
  lng: number
  zone: string
}

export interface WorkforceState {
  workers: Worker[]
  attendance: AttendanceEntry[]
  shifts: ShiftAssignment[]
  certifications: Certification[]
  subcontractors: Subcontractor[]
  safetyViolations: SafetyViolation[]
  gpsLocations: GpsLocation[]
  
  onboardEmployee: (worker: Omit<Worker, 'id' | 'status' | 'safetyRating'>) => void
  clockInWorker: (workerId: string, geofence: string) => void
  clockOutWorker: (workerId: string) => void
  renewCertification: (id: string, nextExpiry: string) => void
  assignShift: (workerId: string, day: string, type: 'Day Shift' | 'Night Shift' | 'Off') => void
  logSafetyViolation: (violation: Omit<SafetyViolation, 'id' | 'loggedAt'>) => void
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

const INITIAL_SUBCONTRACTORS: Subcontractor[] = [
  { id: "sub_1", name: "Apex Plumbing", activeCount: 15, complianceScore: 100, projects: ["Sector B Plumb", "Tower A Residences"] },
  { id: "sub_2", name: "Heavy Ops Co", activeCount: 8, complianceScore: 85, projects: ["Zone A Excavation"] },
  { id: "sub_3", name: "Apex Masonry", activeCount: 12, complianceScore: 95, projects: ["Tower A Concrete"] }
]

const INITIAL_VIOLATIONS: SafetyViolation[] = [
  { id: "v_1", location: "Site Gate B", hazardDescription: "No Hardhat/Goggles detected", violatorCrew: "Apex Masonry", severity: "Major", loggedAt: "Today 10:15 AM" },
  { id: "v_2", location: "Zone A Crane 3", hazardDescription: "Harness Not Secured", violatorCrew: "Heavy Ops Co", severity: "Critical", loggedAt: "Yesterday 3:00 PM" }
]

const INITIAL_GPS_LOCATIONS: GpsLocation[] = [
  { id: "g_1", workerName: "John Doe", role: "Lead Crane Operator", lat: 37.7749, lng: -122.4194, zone: "Crane Operator Zone #3" },
  { id: "g_2", workerName: "Sarah Jones", role: "Structural Welder", lat: 37.7752, lng: -122.4182, zone: "Sector B Scaffolding" },
  { id: "g_3", workerName: "Dave Miller", role: "Safety Superintendent", lat: 37.7741, lng: -122.4201, zone: "Main Portal Gate A" }
]

export const useWorkforceStore = create<WorkforceState>((set) => ({
  workers: INITIAL_WORKERS,
  attendance: INITIAL_ATTENDANCE,
  shifts: INITIAL_SHIFTS,
  certifications: INITIAL_CERTS,
  subcontractors: INITIAL_SUBCONTRACTORS,
  safetyViolations: INITIAL_VIOLATIONS,
  gpsLocations: INITIAL_GPS_LOCATIONS,

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
  }),

  logSafetyViolation: (violation) => set((state) => ({
    safetyViolations: [...state.safetyViolations, {
      ...violation,
      id: `v_${Date.now()}`,
      loggedAt: "Just Now"
    }]
  }))
}))

export default useWorkforceStore

