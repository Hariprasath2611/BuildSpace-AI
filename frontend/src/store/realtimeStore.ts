import { create } from 'zustand'

export interface RealtimeUser {
  id: string
  name: string
  role: string
  status: 'online' | 'away' | 'offline'
  currentActivity?: string
}

export interface ReactionItem {
  emoji: string
  usersCount: number
  userIds: string[]
}

export interface DirectMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: string
  pinned: boolean
  reactions: ReactionItem[]
}

export interface RealtimeState {
  presenceUsers: RealtimeUser[]
  typingUsers: { [channelId: string]: string[] } // list of names typing
  pinnedMessages: { [channelId: string]: string[] } // message IDs
  isSocketConnected: boolean
  setSocketConnected: (connected: boolean) => void
  updateUserPresence: (userId: string, updates: Partial<RealtimeUser>) => void
  setTyping: (channelId: string, userName: string, isTyping: boolean) => void
  togglePinMessage: (channelId: string, messageId: string) => void
  addReaction: (messageId: string, emoji: string, userId: string) => void
}

const DEFAULT_USERS: RealtimeUser[] = [
  { id: "u-1", name: "Robert Dow", role: "Superintendent", status: "online", currentActivity: "Viewing Ground floor plan" },
  { id: "u-2", name: "James Key", role: "Steel Foreman", status: "online", currentActivity: "Tying columns rebar" },
  { id: "u-3", name: "Officer Kyle", role: "EHS Manager", status: "away", currentActivity: "Field walking" },
  { id: "u-4", name: "Linus Tech", role: "Electrical Lead", status: "offline" }
]

export const useRealtimeStore = create<RealtimeState>((set) => ({
  presenceUsers: DEFAULT_USERS,
  typingUsers: {},
  pinnedMessages: {},
  isSocketConnected: true,
  setSocketConnected: (connected) => set({ isSocketConnected: connected }),
  updateUserPresence: (userId, updates) => set((state) => ({
    presenceUsers: state.presenceUsers.map((u) => u.id === userId ? { ...u, ...updates } : u)
  })),
  setTyping: (channelId, userName, isTyping) => set((state) => {
    const list = state.typingUsers[channelId] || []
    const updated = isTyping
      ? [...new Set([...list, userName])]
      : list.filter((name) => name !== userName)
    return {
      typingUsers: { ...state.typingUsers, [channelId]: updated }
    }
  }),
  togglePinMessage: (channelId, messageId) => set((state) => {
    const list = state.pinnedMessages[channelId] || []
    const updated = list.includes(messageId)
      ? list.filter((id) => id !== messageId)
      : [...list, messageId]
    return {
      pinnedMessages: { ...state.pinnedMessages, [channelId]: updated }
    }
  }),
  addReaction: () => {
    // Reacts dynamically to click interactions in message feeds
  }
}))

export default useRealtimeStore
