import { create } from 'zustand'
import { api } from '../utils/api'

export interface Hazard {
  id: string
  title: string
  category: 'Fall' | 'Electrical' | 'StruckBy' | 'CaughtInBetween' | 'Chemical' | 'Other'
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Open' | 'Resolved'
  location: string
  assignedTo: string
}

export interface Incident {
  id: string
  title: string
  severity: 'NearMiss' | 'Minor' | 'Major' | 'Fatal'
  loggedAt: string
  status: 'Investigating' | 'Closed'
  rootCause: string[]
  witnessStatements: Array<{ witness: string; statement: string }>
}

export interface Permit {
  id: string
  title: string
  crewName: string
  permitType: 'HotWork' | 'Electrical' | 'ConfinedSpace' | 'WorkingAtHeight' | 'Excavation'
  status: 'Approved' | 'Pending' | 'Expired'
  expiry: string
}

export interface SafetyState {
  hazards: Hazard[]
  incidents: Incident[]
  permits: Permit[]
  isSosTriggered: boolean
  
  fetchHazards: () => Promise<void>
  triggerSos: (status: boolean) => void
  logHazard: (hazard: Omit<Hazard, 'id' | 'status'>) => Promise<void>
  resolveHazard: (id: string) => void
  logIncident: (incident: Omit<Incident, 'id' | 'status' | 'rootCause' | 'witnessStatements'>) => void
  renewPermit: (id: string, nextExpiry: string) => void
  updateRca: (incidentId: string, fiveWhys: string[]) => void
  addWitnessStatement: (incidentId: string, witness: string, statement: string) => void
}

const INITIAL_HAZARDS: Hazard[] = [
  { id: "haz_1", title: "Exposed live wires at Gate B scaffolding", category: "Electrical", riskLevel: "Critical", status: "Open", location: "Site Gate B", assignedTo: "Dave Miller" },
  { id: "haz_2", title: "Unsecured high extension ladder", category: "Fall", riskLevel: "High", status: "Open", location: "Zone A Crane 3", assignedTo: "John Doe" },
  { id: "haz_3", title: "Excavation trench edge missing guardrails", category: "StruckBy", riskLevel: "Critical", status: "Resolved", location: "Zone B Trench", assignedTo: "Sarah Jones" }
]

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "inc_1",
    title: "Crane hook clash near-miss during lift",
    severity: "NearMiss",
    loggedAt: "2026-06-18 10:14 AM",
    status: "Investigating",
    rootCause: [
      "Heavy wind gusts exceeded maximum safe limitations",
      "Field weather telemetry forecast was not reviewed by lift supervisor",
      "Communication delay between rigger and crane operator"
    ],
    witnessStatements: [
      { witness: "John Doe (Operator)", statement: "I heard the wind sensor alert start chirping right as the hoist began. The load swayed and brushed the support beam." }
    ]
  },
  {
    id: "inc_2",
    title: "Trip hazard minor injury at scaffolding gate",
    severity: "Minor",
    loggedAt: "2026-06-17 02:30 PM",
    status: "Closed",
    rootCause: [
      "Loose scaffold pipes left inside access pathway"
    ],
    witnessStatements: []
  }
]

const INITIAL_PERMITS: Permit[] = [
  { id: "pmt_1", title: "Confined Space Welding Access", crewName: "Apex Plumbing", permitType: "ConfinedSpace", status: "Approved", expiry: "2026-06-18 04:00 PM" },
  { id: "pmt_2", title: "Hot Work Scaffolding Cutting", crewName: "Apex Masonry", permitType: "HotWork", status: "Pending", expiry: "2026-06-20 12:00 PM" },
  { id: "pmt_3", title: "Crane Heavy Lift Level 3", crewName: "Heavy Ops Co", permitType: "Excavation", status: "Approved", expiry: "2026-06-18 06:00 PM" }
]

export const useSafetyStore = create<SafetyState>((set) => ({
  hazards: INITIAL_HAZARDS,
  incidents: INITIAL_INCIDENTS,
  permits: INITIAL_PERMITS,
  isSosTriggered: false,

  triggerSos: (status) => set({ isSosTriggered: status }),

  fetchHazards: async () => {
    try {
      const response = await api.get('/safety')
      const formatted = response.data.map((h: any) => ({
        id: h._id || h.id,
        title: h.title,
        category: h.severity === 'High' ? 'Electrical' : 'Fall',
        riskLevel: h.severity === 'High' ? 'Critical' : (h.severity === 'Medium' ? 'High' : 'Low'),
        status: h.status,
        location: "Site Gate B",
        assignedTo: "Dave Miller"
      }))
      set({ hazards: formatted })
    } catch (err) {
      console.warn('Error fetching hazards from backend:', err)
    }
  },

  logHazard: async (hazard) => {
    try {
      const response = await api.post('/safety', {
        title: hazard.title,
        description: `Location: ${hazard.location}, Risk: ${hazard.riskLevel}`,
        severity: hazard.riskLevel === 'Critical' ? 'High' : (hazard.riskLevel === 'High' ? 'Medium' : 'Low')
      })
      const h = response.data
      const newObs: Hazard = {
        id: h._id || h.id,
        title: h.title,
        category: hazard.category,
        riskLevel: hazard.riskLevel,
        status: h.status,
        location: hazard.location,
        assignedTo: hazard.assignedTo || "Dave Miller"
      }
      set((state) => ({
        hazards: [...state.hazards, newObs]
      }))
    } catch (err) {
      console.warn('Error saving hazard observation to backend, adding locally:', err)
      set((state) => ({
        hazards: [...state.hazards, {
          ...hazard,
          id: `haz_${Date.now()}`,
          status: 'Open'
        }]
      }))
    }
  },

  resolveHazard: (id) => set((state) => ({
    hazards: state.hazards.map((h) =>
      h.id === id ? { ...h, status: 'Resolved' } : h
    )
  })),

  logIncident: (incident) => set((state) => ({
    incidents: [...state.incidents, {
      ...incident,
      id: `inc_${Date.now()}`,
      status: 'Investigating',
      rootCause: [],
      witnessStatements: []
    }]
  })),

  renewPermit: (id, nextExpiry) => set((state) => ({
    permits: state.permits.map((p) =>
      p.id === id ? { ...p, expiry: nextExpiry, status: 'Approved' } : p
    )
  })),

  updateRca: (incidentId, fiveWhys) => set((state) => ({
    incidents: state.incidents.map((inc) =>
      inc.id === incidentId ? { ...inc, rootCause: fiveWhys } : inc
    )
  })),

  addWitnessStatement: (incidentId, witness, statement) => set((state) => ({
    incidents: state.incidents.map((inc) =>
      inc.id === incidentId
        ? { ...inc, witnessStatements: [...inc.witnessStatements, { witness, statement }] }
        : inc
    )
  }))
}))

export default useSafetyStore
