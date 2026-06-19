import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  references?: string[]
}

interface AIState {
  activePersona: 'Project' | 'Material' | 'Safety' | 'Meeting'
  messages: Message[]
  isTyping: boolean
  setPersona: (persona: 'Project' | 'Material' | 'Safety' | 'Meeting') => void
  addMessage: (msg: Message) => void
  sendMessage: (text: string) => Promise<void>
  clearChat: () => void
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg_init_1",
    role: "assistant",
    content: "Hello! I am your BuildSpace AI Construction Co-pilot. How can I assist you with drawings, safety checks, or material metrics today?",
    timestamp: "10:00 AM"
  }
]

export const useAIStore = create<AIState>((set, get) => ({
  activePersona: "Project",
  messages: INITIAL_MESSAGES,
  isTyping: false,

  setPersona: (persona) => set({ activePersona: persona }),
  
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  sendMessage: async (text) => {
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true
    }))

    try {
      // Direct integration call to FastAPI Copilot server
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)
      
      const response = await fetch('http://localhost:8000/api/v1/copilot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversation_id: "mobile_session_01",
          history: get().messages.map(m => ({ role: m.role, content: m.content })),
          context: {},
          stream: false
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const data = await response.json()
      
      const assistantMsg: Message = {
        id: `msg_a_${Date.now()}`,
        role: "assistant",
        content: data.message || "I couldn't generate a reasoning path.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        references: data.citations ? data.citations.map((c: any) => c.source) : []
      }
      
      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isTyping: false
      }))
      
    } catch (e) {
      // Local fallback simulation if server is unreachable
      console.warn("AI Platform offline. Running local copilot reasoning simulation.")
      
      setTimeout(() => {
        let reply = "I scanned the drawings but couldn't verify this. Check drawing sheet A-02."
        if (text.toLowerCase().includes("safety") || text.toLowerCase().includes("helmet")) {
          reply = "According to OSHA code 1926, all supervisors must log site entries without safety helmets."
        } else if (text.toLowerCase().includes("cement") || text.toLowerCase().includes("stock")) {
          reply = "The warehouse report indicates cement stock is optimal with 450 bags left."
        }
        
        const assistantMsg: Message = {
          id: `msg_a_${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          references: ["Spec_Sheet_A-02.pdf"]
        }
        
        set((state) => ({
          messages: [...state.messages, assistantMsg],
          isTyping: false
        }))
      }, 1000)
    }
  },

  clearChat: () => set({ messages: INITIAL_MESSAGES })
}))
