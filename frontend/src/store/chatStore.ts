import { create } from 'zustand'

export interface ChatMessage {
  id: string
  channelId: string
  senderId: string
  senderName: string
  senderRole: string
  message: string
  timestamp: string
  attachment?: { name: string; url: string; size: string }
}

export interface ChatChannel {
  id: string
  name: string
  type: 'Project' | 'Team' | 'Announcements'
  description: string
}

export interface ChatState {
  channels: ChatChannel[]
  messages: ChatMessage[]
  activeChannelId: string
  sendMessage: (channelId: string, message: string, sender: { id: string; name: string; role: string }, attachment?: ChatMessage['attachment']) => void
  addChannel: (c: Omit<ChatChannel, 'id'>) => void
  setActiveChannel: (id: string) => void
}

const DEFAULT_CHANNELS: ChatChannel[] = [
  { id: "ch-1", name: "Downtown Plaza Site Chat", type: "Project", description: "General project discussions, coordination updates, and crane bookings." },
  { id: "ch-2", name: "Apex Commercial Steel Team", type: "Team", description: "Ironworker shift align, steel reinforcement detailing." },
  { id: "ch-3", name: "Safety Board Alerts", type: "Announcements", description: "Official safety bulletins, incident reporting, and wind limit warnings." }
]

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: "m-1",
    channelId: "ch-1",
    senderId: "u-1",
    senderName: "Robert Dow",
    senderRole: "General Contractor Superintendent",
    message: "Hey teams, remember that concrete pour for Slab B is scheduled for tomorrow at 10 AM. We need electrical PVC conduits verified by tonight.",
    timestamp: "2026-06-18T08:30:00Z"
  },
  {
    id: "m-2",
    channelId: "ch-1",
    senderId: "u-2",
    senderName: "Linus Tech",
    senderRole: "Electrical Foreman",
    message: "Conduit layout is 90% completed in room 102. Temporary splice concerns have been rectified. Checking south wall next.",
    timestamp: "2026-06-18T08:35:00Z"
  },
  {
    id: "m-3",
    channelId: "ch-3",
    senderId: "u-3",
    senderName: "Officer Kyle",
    senderRole: "EHS Safety Director",
    message: "⚠️ WIND WARNING: Wind gusts are predicted to reach 26 knots tomorrow between 1 PM and 4 PM. Prepare to pause all crane picks if gusts exceed 20 knots.",
    timestamp: "2026-06-18T10:15:00Z",
    attachment: { name: "wind_limits_checklist.pdf", url: "#", size: "385 KB" }
  }
]

export const useChatStore = create<ChatState>((set) => ({
  channels: DEFAULT_CHANNELS,
  messages: DEFAULT_MESSAGES,
  activeChannelId: "ch-1",
  sendMessage: (channelId, message, sender, attachment) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: `msg-${Date.now()}`,
        channelId,
        senderId: sender.id,
        senderName: sender.name,
        senderRole: sender.role,
        message,
        timestamp: new Date().toISOString(),
        attachment
      }
    ]
  })),
  addChannel: (c) => set((state) => ({
    channels: [...state.channels, { ...c, id: `ch-${Date.now()}` }]
  })),
  setActiveChannel: (id) => set({ activeChannelId: id })
}))

export default useChatStore
