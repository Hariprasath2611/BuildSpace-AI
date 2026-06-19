import { create } from 'zustand'

export interface MeetingActionItem {
  id: string
  task: string
  assignee: string
  dueDate: string
  done: boolean
}

export interface Meeting {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: string[]
  agenda: string[]
  minutes: string[]
  actionItems: MeetingActionItem[]
  aiSummary: string
}

export interface MeetingState {
  meetings: Meeting[]
  addMeeting: (m: Omit<Meeting, 'id'>) => void
  updateMeeting: (id: string, updates: Partial<Meeting>) => void
  toggleActionItem: (meetingId: string, itemId: string) => void
  addActionItem: (meetingId: string, item: Omit<MeetingActionItem, 'id'>) => void
}

const DEFAULT_MEETINGS: Meeting[] = [
  {
    id: "meet-1",
    title: "Weekly Subcontractor Progress Align",
    date: "2026-06-18",
    time: "09:00 AM",
    location: "Conference Room A / Zoom",
    attendees: ["Robert Dow (GC)", "James Key (Steel)", "Linus Tech (Electrical)", "Sarah Connor (Crane)"],
    agenda: [
      "Confirm foundation curing times and rebar sign-off.",
      "Sync crane bookings for level 2 structural column placements.",
      "Review material delivery routes and geofence boundary warnings."
    ],
    minutes: [
      "James reports Steel-Fixing is 75% complete, concrete pour scheduled for June 20.",
      "Crane booking confirmed for Liebherr crane on June 20 at 10 AM.",
      "Wind limits checked; safe under 22 knots."
    ],
    actionItems: [
      { id: "act-1", task: "Submit concrete mix delivery slips to Document Center", assignee: "James Key", dueDate: "2026-06-19", done: true },
      { id: "act-2", task: "Secure municipal crane clearance permits", assignee: "Robert Dow", dueDate: "2026-06-19", done: false }
    ],
    aiSummary: "The meeting successfully aligned structural steel scheduling with crane availability. Key action points focus on concrete mix slips submittal and crane permit approvals by general contractors to prevent delay hours."
  },
  {
    id: "meet-2",
    title: "Site Safety Committee Review",
    date: "2026-06-15",
    time: "02:00 PM",
    location: "Site Trailer Office",
    attendees: ["Robert Dow (GC)", "Officer Kyle (Safety)", "Alex Crew (Labor)"],
    agenda: [
      "Review OSHA 5-Whys report on Honeycomb Column B4.",
      "Confirm heat exhaustion shade area coordinates.",
      "PPE compliance checks for subcontractors."
    ],
    minutes: [
      "Officer Kyle flagged temporary electrical splice hazards in Room 102.",
      "Alex confirmed shade tents and hydration crates are distributed.",
      "PPE checklist verified for steel crews."
    ],
    actionItems: [
      { id: "act-3", task: "Fix Room 102 electrical splice hazard", assignee: "Linus Tech", dueDate: "2026-06-16", done: true },
      { id: "act-4", task: "Distribute daily safety logs to sub foremen", assignee: "Officer Kyle", dueDate: "2026-06-17", done: true }
    ],
    aiSummary: "Safety committee addressed minor electrical compliance issues in Room 102 and reviewed heat safety checklists. All urgent hazards have been mitigated."
  }
]

export const useMeetingStore = create<MeetingState>((set) => ({
  meetings: DEFAULT_MEETINGS,
  addMeeting: (m) => set((state) => ({
    meetings: [...state.meetings, { ...m, id: `meet-${Date.now()}` }]
  })),
  updateMeeting: (id, updates) => set((state) => ({
    meetings: state.meetings.map((m) => m.id === id ? { ...m, ...updates } : m)
  })),
  toggleActionItem: (meetingId, itemId) => set((state) => ({
    meetings: state.meetings.map((m) =>
      m.id === meetingId
        ? {
            ...m,
            actionItems: m.actionItems.map((item) =>
              item.id === itemId ? { ...item, done: !item.done } : item
            )
          }
        : m
    )
  })),
  addActionItem: (meetingId, item) => set((state) => ({
    meetings: state.meetings.map((m) =>
      m.id === meetingId
        ? {
            ...m,
            actionItems: [...m.actionItems, { ...item, id: `act-${Date.now()}` }]
          }
        : m
    )
  }))
}))

export default useMeetingStore
