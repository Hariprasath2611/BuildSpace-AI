import { create } from 'zustand'

export interface ActionCard {
  id: string
  type: 'PO' | 'Safety' | 'Schedule' | 'Workflow'
  title: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  isStreaming?: boolean
  actions?: ActionCard[]
  references?: string[]
  chartData?: Array<{ name: string; value: number; forecast?: number }>
}

export interface Thread {
  id: string
  title: string
  isPinned: boolean
  lastActive: string
}

export interface PromptTemplate {
  id: string
  title: string
  prompt: string
  category: 'Favorites' | 'Construction' | 'Organization'
  isFavorite: boolean
}

export interface PredictiveRisk {
  id: string
  type: 'Cost' | 'Labor' | 'Weather' | 'Safety' | 'Equipment'
  title: string
  probability: number
  severity: 'Minor' | 'Major' | 'Critical'
  description: string
  suggestion: string
}

export interface WorkflowNode {
  id: string
  type: 'trigger' | 'condition' | 'action'
  label: string
  details: string
}

export interface Workflow {
  id: string
  name: string
  isEnabled: boolean
  nodes: WorkflowNode[]
}

export interface AIState {
  currentPersona: 'Project Manager' | 'Safety Officer' | 'Finance Analyst'
  threads: Thread[]
  activeThreadId: string | null
  messages: Record<string, Message[]>
  prompts: PromptTemplate[]
  risks: PredictiveRisk[]
  workflows: Workflow[]
  systemStatus: 'online' | 'offline' | 'degraded'
  responseLatencyMs: number
  tokensUsedToday: number
  
  // Actions
  setPersona: (persona: 'Project Manager' | 'Safety Officer' | 'Finance Analyst') => void
  createNewThread: (title?: string) => string
  setActiveThreadId: (id: string | null) => void
  sendMessage: (content: string) => void
  togglePinThread: (id: string) => void
  deleteThread: (id: string) => void
  approveActionCard: (messageId: string, actionId: string) => void
  rejectActionCard: (messageId: string, actionId: string) => void
  addPromptTemplate: (prompt: Omit<PromptTemplate, 'id'>) => void
  toggleFavoritePrompt: (id: string) => void
  addWorkflow: (workflow: Omit<Workflow, 'id'>) => void
  toggleWorkflowEnabled: (id: string) => void
  triggerSimulationResponse: (prompt: string, threadId: string) => void
}

const INITIAL_THREADS: Thread[] = [
  { id: "th_1", title: "Apex Tower Material Drift", isPinned: true, lastActive: "10:30 AM" },
  { id: "th_2", title: "Site B Safety Evacuation Plan", isPinned: true, lastActive: "Yesterday" },
  { id: "th_3", title: "Drywall Installers Rotation", isPinned: false, lastActive: "June 17" }
]

const INITIAL_MESSAGES: Record<string, Message[]> = {
  th_1: [
    {
      id: "msg_1_1",
      role: "user",
      content: "Analyze Apex Tower concrete supply and forecast drift based on schedule delays.",
      timestamp: "10:28 AM"
    },
    {
      id: "msg_1_2",
      role: "assistant",
      content: "Based on recent concrete pouring logs and upcoming rain forecasted for Friday, concrete demand is lagging scheduled delivery dates by **14.2%**. This creates a high risk of schedule delay on the 'Structural Framing' milestone.\n\nHere is the Concrete Supply & Cost Deviation Forecast Chart:",
      timestamp: "10:30 AM",
      chartData: [
        { name: "Week 1", value: 120, forecast: 120 },
        { name: "Week 2", value: 140, forecast: 140 },
        { name: "Week 3", value: 105, forecast: 150 },
        { name: "Week 4", value: 95, forecast: 160 }
      ],
      references: ["PO_Cement_Apex_v2.pdf", "Apex_Schedule_Gantt.json", "Weather_API_Lightning.json"],
      actions: [
        {
          id: "act_1",
          type: "PO",
          title: "Adjust Cement Purchase Order",
          description: "Reduce immediate Cement shipment by 150 tons to align with delayed dry dates.",
          status: "pending"
        },
        {
          id: "act_2",
          type: "Schedule",
          title: "Optimize Crew Shift Rotations",
          description: "Shift 5 structural crew members to internal drywall framing.",
          status: "pending"
        }
      ]
    }
  ],
  th_2: [
    {
      id: "msg_2_1",
      role: "user",
      content: "OSHA safety checklist for Tower A scaffold setup.",
      timestamp: "Yesterday"
    },
    {
      id: "msg_2_2",
      role: "assistant",
      content: "Scaffolding safety checklists under OSHA 1926.451:\n\n1. **Guardrails:** Must be installed at 38 to 45 inches above platform level.\n2. **Planking:** Fully planked with no gaps greater than 1 inch.\n3. **Capacity:** Must support its own weight and 4x max intended load.\n\nDo you want me to pre-fill a scaffold inspection audit sheet in the Safety Module?",
      timestamp: "Yesterday",
      references: ["OSHA_1926.451_Scaffolds.pdf"]
    }
  ]
}

const INITIAL_PROMPTS: PromptTemplate[] = [
  { id: "pr_1", title: "OSHA Scaffold Audit Generator", prompt: "Draft a safety audit checklist for a 5-story scaffold system based on OSHA 1926 regulations.", category: "Favorites", isFavorite: true },
  { id: "pr_2", title: "Weather Cost Anomaly Scanner", prompt: "Evaluate cost variance reports against local lightning delay events in the past 30 days.", category: "Construction", isFavorite: false },
  { id: "pr_3", title: "Autogenerated Daily Log Briefing", prompt: "Compile yesterday's subcontractor active crew attendance logs and safety warning counts into a formal email brief.", category: "Organization", isFavorite: true }
]

const INITIAL_RISKS: PredictiveRisk[] = [
  {
    id: "risk_1",
    type: "Cost",
    title: "Drywall Cost Overruns Risk",
    probability: 84,
    severity: "Critical",
    description: "Concrete delivery delays are cascading into drywall scheduling, risking daily contractor standby penalty charges.",
    suggestion: "Reallocate 4 direct welders to structure lock-in to accelerate ready state."
  },
  {
    id: "risk_2",
    type: "Weather",
    title: "Lightning Delays Warning",
    probability: 72,
    severity: "Major",
    description: "Lightning strikes forecasted within 5 miles of Sector C during tomorrow's crane operation shift.",
    suggestion: "Schedule crane rigging work for morning hours; suspend high hoist operations by 1:00 PM."
  },
  {
    id: "risk_3",
    type: "Equipment",
    title: "Crane Tower #2 Anomaly Alert",
    probability: 60,
    severity: "Major",
    description: "Hydraulic temperature telemetry reports regular spikes above normal operating limits.",
    suggestion: "Flag hydraulic check for scheduled inspection during lunch break maintenance window."
  }
]

const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: "wf_1",
    name: "Autosubmit Weather Interruption log",
    isEnabled: true,
    nodes: [
      { id: "node_1", type: "trigger", label: "Lightning alert active", details: "Forecast matches within 2 miles of active site geofences." },
      { id: "node_2", type: "condition", label: "Crane hoist scheduled?", details: "Checks active workforce assignments." },
      { id: "node_3", type: "action", label: "Dispatch safety stand-down", details: "Sends real-time SMS to crane supervisors." }
    ]
  }
]

export const useAIStore = create<AIState>((set, get) => ({
  currentPersona: "Project Manager",
  threads: INITIAL_THREADS,
  activeThreadId: "th_1",
  messages: INITIAL_MESSAGES,
  prompts: INITIAL_PROMPTS,
  risks: INITIAL_RISKS,
  workflows: INITIAL_WORKFLOWS,
  systemStatus: "online",
  responseLatencyMs: 120,
  tokensUsedToday: 84250,

  setPersona: (persona) => set({ currentPersona: persona }),

  createNewThread: (title) => {
    const newId = `th_${Date.now()}`
    const newThread: Thread = {
      id: newId,
      title: title || "New Conversation",
      isPinned: false,
      lastActive: "Just now"
    }
    set((state) => ({
      threads: [newThread, ...state.threads],
      activeThreadId: newId,
      messages: { ...state.messages, [newId]: [] }
    }))
    return newId
  },

  setActiveThreadId: (id) => set({ activeThreadId: id }),

  sendMessage: (content) => {
    const { activeThreadId, triggerSimulationResponse } = get()
    if (!activeThreadId) return

    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    set((state) => {
      const threadMsgs = state.messages[activeThreadId] || []
      return {
        messages: {
          ...state.messages,
          [activeThreadId]: [...threadMsgs, userMsg]
        }
      }
    })

    // Simulate Streaming LLM Reply
    triggerSimulationResponse(content, activeThreadId)
  },

  togglePinThread: (id) => {
    set((state) => ({
      threads: state.threads.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    }))
  },

  deleteThread: (id) => {
    set((state) => {
      const nextThreads = state.threads.filter((t) => t.id !== id)
      const nextActiveId = state.activeThreadId === id ? (nextThreads[0]?.id || null) : state.activeThreadId
      const nextMessages = { ...state.messages }
      delete nextMessages[id]
      return {
        threads: nextThreads,
        activeThreadId: nextActiveId,
        messages: nextMessages
      }
    })
  },

  approveActionCard: (messageId, actionId) => {
    const { activeThreadId } = get()
    if (!activeThreadId) return
    set((state) => {
      const threadMsgs = state.messages[activeThreadId] || []
      const nextMsgs = threadMsgs.map((m) => {
        if (m.id !== messageId || !m.actions) return m
        return {
          ...m,
          actions: m.actions.map((a) => (a.id === actionId ? { ...a, status: 'approved' as const } : a))
        }
      })
      return {
        messages: { ...state.messages, [activeThreadId]: nextMsgs }
      }
    })
  },

  rejectActionCard: (messageId, actionId) => {
    const { activeThreadId } = get()
    if (!activeThreadId) return
    set((state) => {
      const threadMsgs = state.messages[activeThreadId] || []
      const nextMsgs = threadMsgs.map((m) => {
        if (m.id !== messageId || !m.actions) return m
        return {
          ...m,
          actions: m.actions.map((a) => (a.id === actionId ? { ...a, status: 'rejected' as const } : a))
        }
      })
      return {
        messages: { ...state.messages, [activeThreadId]: nextMsgs }
      }
    })
  },

  addPromptTemplate: (newPrompt) => {
    const promptWithId: PromptTemplate = {
      ...newPrompt,
      id: `pr_${Date.now()}`
    }
    set((state) => ({
      prompts: [...state.prompts, promptWithId]
    }))
  },

  toggleFavoritePrompt: (id) => {
    set((state) => ({
      prompts: state.prompts.map((p) => {
        if (p.id !== id) return p
        const nextFav = !p.isFavorite
        return {
          ...p,
          isFavorite: nextFav,
          category: nextFav ? 'Favorites' : 'Construction'
        }
      })
    }))
  },

  addWorkflow: (newWorkflow) => {
    const workflowWithId: Workflow = {
      ...newWorkflow,
      id: `wf_${Date.now()}`
    }
    set((state) => ({
      workflows: [...state.workflows, workflowWithId]
    }))
  },

  toggleWorkflowEnabled: (id) => {
    set((state) => ({
      workflows: state.workflows.map((w) => (w.id === id ? { ...w, isEnabled: !w.isEnabled } : w))
    }))
  },

  triggerSimulationResponse: (prompt, threadId) => {
    const assistantMsgId = `msg_a_${Date.now()}`
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    }

    set((state) => {
      const threadMsgs = state.messages[threadId] || []
      return {
        messages: {
          ...state.messages,
          [threadId]: [...threadMsgs, initialAssistantMsg]
        }
      }
    })

    // Simulate word streaming
    let currentWordIdx = 0
    let simulatedText = ""

    // Context-sensitive simulated responses
    let tokens = [
      "Analyzing", "the", "system", "database", "and", "recent", "logs.",
      "Based", "on", "your", "request,", "I", "have", "scanned", "all", "active", "files.",
      "Here", "is", "the", "current", "projection:", "weather", "forecasts", "indicate", "stable", "conditions,",
      "but", "labor", "availability", "flags", "potential", "capacity", "risks."
    ]

    const lowerPrompt = prompt.toLowerCase()
    if (lowerPrompt.includes("create project") || lowerPrompt.includes("/create-project")) {
      tokens = [
        "PARSING COMMAND:", "`/create-project`", "\n\n",
        "Detected Parameters:\n",
        "- **Name:** Apex Residences\n",
        "- **Budget:** $12,000,000\n\n",
        "Executing autonomous database transaction...", "Success.", "Project entry has been drafted. I have attached an approval card below."
      ]
    } else if (lowerPrompt.includes("safety") || lowerPrompt.includes("accident") || lowerPrompt.includes("osha")) {
      tokens = [
        "Scanning OSHA compliance manuals...", "\n\n",
        "According to standard Section 1926.501, Fall Protection systems must be fully certified for active crews above 6 feet.",
        "Scaffolding inspection records on site note that scaffolding safety checklists must be completed before shift sign-on."
      ]
    }

    const interval = setInterval(() => {
      if (currentWordIdx >= tokens.length) {
        clearInterval(interval)
        // Complete streaming
        set((state) => {
          const threadMsgs = state.messages[threadId] || []
          const nextMsgs = threadMsgs.map((m) => {
            if (m.id !== assistantMsgId) return m
            // Inject actions for commands
            const actions: ActionCard[] | undefined = lowerPrompt.includes("create")
              ? [{ id: `act_${Date.now()}`, type: "PO", title: "Approve Project Creation", description: "Save 'Apex Residences' with $12M budget to projects list.", status: "pending" }]
              : undefined

            return {
              ...m,
              content: simulatedText,
              isStreaming: false,
              actions
            }
          })
          return {
            messages: { ...state.messages, [threadId]: nextMsgs }
          }
        })
        return
      }

      simulatedText += (tokens[currentWordIdx] + " ")
      currentWordIdx++

      set((state) => {
        const threadMsgs = state.messages[threadId] || []
        const nextMsgs = threadMsgs.map((m) => {
          if (m.id !== assistantMsgId) return m
          return {
            ...m,
            content: simulatedText
          }
        })
        return {
          messages: { ...state.messages, [threadId]: nextMsgs }
        }
      })
    }, 70)
  }
}))
