import { create } from 'zustand'

export interface EquipmentItem {
  id: string
  name: string
  type: string
  status: 'Available' | 'In Use' | 'Under Maintenance' | 'Downtime'
  modelNum: string
  hourlyRate: number
  fuelRate: number // gallons per hour
  lastServiceDate: string
  operatorName: string
  projectLink: string
}

export interface EquipmentReservation {
  id: string
  equipmentId: string
  equipmentName: string
  projectId: string
  projectName: string
  crewName: string
  startDate: string
  endDate: string
}

export interface FuelLog {
  id: string
  equipmentId: string
  equipmentName: string
  date: string
  gallons: number
  cost: number
  odometerHours: number
}

export interface MaintenanceLog {
  id: string
  equipmentId: string
  equipmentName: string
  date: string
  description: string
  cost: number
  status: 'Completed' | 'Pending'
}

export interface EquipmentState {
  equipment: EquipmentItem[]
  reservations: EquipmentReservation[]
  fuelLogs: FuelLog[]
  maintenanceLogs: MaintenanceLog[]
  addEquipment: (item: Omit<EquipmentItem, 'id'>) => void
  updateEquipment: (id: string, updates: Partial<EquipmentItem>) => void
  addReservation: (res: Omit<EquipmentReservation, 'id'>) => void
  addFuelLog: (log: Omit<FuelLog, 'id'>) => void
  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id'>) => void
}

const DEFAULT_EQUIPMENT: EquipmentItem[] = [
  {
    id: "eq-1",
    name: "CAT 320 Hydraulic Excavator",
    type: "Earthmoving",
    status: "In Use",
    modelNum: "CAT-320-2024",
    hourlyRate: 145,
    fuelRate: 4.8,
    lastServiceDate: "2026-05-15",
    operatorName: "Marcus Vance",
    projectLink: "Downtown Plaza"
  },
  {
    id: "eq-2",
    name: "Liebherr LTM 1050 Mobile Crane",
    type: "Lifting",
    status: "Available",
    modelNum: "LTM-1050-V2",
    hourlyRate: 310,
    fuelRate: 6.2,
    lastServiceDate: "2026-06-02",
    operatorName: "Sarah Connor",
    projectLink: "Apex Commercial Complex"
  },
  {
    id: "eq-3",
    name: "JLG 860SJ Telescopic Boom Lift",
    type: "Access",
    status: "Under Maintenance",
    modelNum: "JLG-860-2025",
    hourlyRate: 85,
    fuelRate: 1.5,
    lastServiceDate: "2026-06-18",
    operatorName: "None (Servicing)",
    projectLink: "Downtown Plaza"
  },
  {
    id: "eq-4",
    name: "Bobcat S76 Skid Steer Loader",
    type: "Earthmoving",
    status: "Downtime",
    modelNum: "BC-S76-XP",
    hourlyRate: 65,
    fuelRate: 2.1,
    lastServiceDate: "2026-04-10",
    operatorName: "David Miller",
    projectLink: "Apex Commercial Complex"
  }
]

const DEFAULT_RESERVATIONS: EquipmentReservation[] = [
  {
    id: "res-1",
    equipmentId: "eq-1",
    equipmentName: "CAT 320 Hydraulic Excavator",
    projectId: "proj-1",
    projectName: "Downtown Plaza Site",
    crewName: "Earthworks Team A",
    startDate: "2026-06-10",
    endDate: "2026-06-25"
  },
  {
    id: "res-2",
    equipmentId: "eq-2",
    equipmentName: "Liebherr LTM 1050 Mobile Crane",
    projectId: "proj-2",
    projectName: "Apex Commercial Complex",
    crewName: "Structural Steel Crew C",
    startDate: "2026-06-20",
    endDate: "2026-06-30"
  }
]

const DEFAULT_FUEL_LOGS: FuelLog[] = [
  {
    id: "fl-1",
    equipmentId: "eq-1",
    equipmentName: "CAT 320 Hydraulic Excavator",
    date: "2026-06-17",
    gallons: 38.5,
    cost: 165.55,
    odometerHours: 1245
  },
  {
    id: "fl-2",
    equipmentId: "eq-3",
    equipmentName: "JLG 860SJ Telescopic Boom Lift",
    date: "2026-06-15",
    gallons: 12.0,
    cost: 51.60,
    odometerHours: 852
  }
]

const DEFAULT_MAINTENANCE_LOGS: MaintenanceLog[] = [
  {
    id: "ml-1",
    equipmentId: "eq-3",
    equipmentName: "JLG 860SJ Telescopic Boom Lift",
    date: "2026-06-18",
    description: "Replace hydraulic seals, inspect basket toggle switch, and clean fuel lines.",
    cost: 1250,
    status: "Pending"
  },
  {
    id: "ml-2",
    equipmentId: "eq-1",
    equipmentName: "CAT 320 Hydraulic Excavator",
    date: "2026-05-15",
    description: "Standard 250-hour engine filter service, oil replacement, and track greasing.",
    cost: 620,
    status: "Completed"
  }
]

export const useEquipmentStore = create<EquipmentState>((set) => ({
  equipment: DEFAULT_EQUIPMENT,
  reservations: DEFAULT_RESERVATIONS,
  fuelLogs: DEFAULT_FUEL_LOGS,
  maintenanceLogs: DEFAULT_MAINTENANCE_LOGS,
  addEquipment: (item) => set((state) => ({
    equipment: [...state.equipment, { ...item, id: `eq-${Date.now()}` }]
  })),
  updateEquipment: (id, updates) => set((state) => ({
    equipment: state.equipment.map((eq) => eq.id === id ? { ...eq, ...updates } : eq)
  })),
  addReservation: (res) => set((state) => ({
    reservations: [...state.reservations, { ...res, id: `res-${Date.now()}` }]
  })),
  addFuelLog: (log) => set((state) => ({
    fuelLogs: [...state.fuelLogs, { ...log, id: `fl-${Date.now()}` }]
  })),
  addMaintenanceLog: (log) => set((state) => ({
    maintenanceLogs: [...state.maintenanceLogs, { ...log, id: `ml-${Date.now()}` }]
  }))
}))

export default useEquipmentStore
