import { useState, useRef, useEffect } from 'react'
import { useAIStore } from '@/store/aiStore'
import {
  Sparkles,
  Search,
  AlertTriangle,
  ArrowRight,
  Clock,
  Plus,
  Trash2,
  Pin,
  Check,
  X,
  Mic,
  Paperclip,
  TrendingUp,
  Play,
  Settings,
  Activity,
  FileText,
  Layers,
  ShieldAlert,
  DollarSign,
  Send,
  Workflow as WorkflowIcon,
  HelpCircle,
  ThumbsUp,
  CheckCircle2,
  PlusCircle,
  AlertCircle
} from 'lucide-react'

export default function AICenter() {
  // Zustand Store
  const currentPersona = useAIStore((state) => state.currentPersona)
  const threads = useAIStore((state) => state.threads)
  const activeThreadId = useAIStore((state) => state.activeThreadId)
  const messages = useAIStore((state) => state.messages)
  const prompts = useAIStore((state) => state.prompts)
  const risks = useAIStore((state) => state.risks)
  const workflows = useAIStore((state) => state.workflows)
  const systemStatus = useAIStore((state) => state.systemStatus)
  const responseLatencyMs = useAIStore((state) => state.responseLatencyMs)
  const tokensUsedToday = useAIStore((state) => state.tokensUsedToday)

  const setPersona = useAIStore((state) => state.setPersona)
  const createNewThread = useAIStore((state) => state.createNewThread)
  const setActiveThreadId = useAIStore((state) => state.setActiveThreadId)
  const sendMessage = useAIStore((state) => state.sendMessage)
  const togglePinThread = useAIStore((state) => state.togglePinThread)
  const deleteThread = useAIStore((state) => state.deleteThread)
  const approveActionCard = useAIStore((state) => state.approveActionCard)
  const rejectActionCard = useAIStore((state) => state.rejectActionCard)
  const addPromptTemplate = useAIStore((state) => state.addPromptTemplate)
  const toggleFavoritePrompt = useAIStore((state) => state.toggleFavoritePrompt)
  const addWorkflow = useAIStore((state) => state.addWorkflow)
  const toggleWorkflowEnabled = useAIStore((state) => state.toggleWorkflowEnabled)

  // Local UI States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'copilot' | 'commands' | 'workflows' | 'analytics' | 'prompts'>('dashboard')
  const [chatInput, setChatInput] = useState("")
  const [threadSearch, setThreadSearch] = useState("")
  const [promptSearch, setPromptSearch] = useState("")

  // Voice Simulator State
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const recordingTimer = useRef<number | null>(null)

  // File Upload Simulator State
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [showUploadList, setShowUploadList] = useState(false)

  // Command Center State
  const [commandInput, setCommandInput] = useState("")
  const [parsedCommand, setParsedCommand] = useState<{ command: string; args: Record<string, string>; confidence: number } | null>(null)
  const [isCommandExecuted, setIsCommandExecuted] = useState(false)

  // Add Custom Prompt State
  const [newPromptTitle, setNewPromptTitle] = useState("")
  const [newPromptText, setNewPromptText] = useState("")
  const [newPromptCat, setNewPromptCat] = useState<'Favorites' | 'Construction' | 'Organization'>('Construction')
  const [showAddPrompt, setShowAddPrompt] = useState(false)

  // Add Custom Workflow State
  const [newWfName, setNewWfName] = useState("")
  const [newWfTrigger, setNewWfTrigger] = useState("")
  const [newWfCondition, setNewWfCondition] = useState("")
  const [newWfAction, setNewWfAction] = useState("")
  const [showAddWf, setShowAddWf] = useState(false)

  // Active chat thread messages
  const activeMessages = activeThreadId ? (messages[activeThreadId] || []) : []

  // Voice recording simulation handler
  const handleVoiceRecordClick = () => {
    if (isRecording) {
      if (recordingTimer.current) window.clearInterval(recordingTimer.current)
      setIsRecording(false)
      setRecordingSeconds(0)
      // Auto-submit voice input command
      const voicePrompt = "Find safety certifications expiring in the next 30 days and suggest replacements."
      if (activeThreadId) {
        sendMessage(voicePrompt)
      } else {
        const newThreadId = createNewThread("Voice Assessment Scan")
        setActiveThreadId(newThreadId)
        sendMessage(voicePrompt)
      }
    } else {
      setIsRecording(true)
      setRecordingSeconds(0)
      recordingTimer.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)
    }
  }

  // File Upload Simulation handler
  const handleUploadFile = (fileName: string) => {
    setSelectedFile(fileName)
    setIsUploading(true)
    setUploadProgress(0)
    setShowUploadList(false)

    const uploadInterval = window.setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(uploadInterval)
          setIsUploading(false)
          // Send to chat
          const docPrompt = `I uploaded ${fileName}. Parse this document for key clauses and run a compliance audit.`
          if (activeThreadId) {
            sendMessage(docPrompt)
          } else {
            const newThreadId = createNewThread(`Audit: ${fileName}`)
            setActiveThreadId(newThreadId)
            sendMessage(docPrompt)
          }
          return 100
        }
        return prev + 20
      })
    }, 300)
  }

  // Command Parser Simulation
  const handleCommandChange = (val: string) => {
    setCommandInput(val)
    if (!val.startsWith('/')) {
      setParsedCommand(null)
      return
    }

    const parts = val.split(' ')
    const cmd = parts[0]
    const argsString = parts.slice(1).join(' ')

    if (cmd === '/create-project') {
      const budgetMatch = argsString.match(/\$?(\d+M|\d+)/i)
      const budget = budgetMatch ? budgetMatch[0] : "Not Specified"
      const name = argsString.replace(/\$?(\d+M|\d+)/i, '').trim() || "New Construction Hub"
      setParsedCommand({
        command: "Create Project",
        args: { "Project Name": name, "Budget Goal": budget, "Target Location": "Sector B" },
        confidence: 96
      })
    } else if (cmd === '/write-safety-log') {
      setParsedCommand({
        command: "Log Safety Incident",
        args: { "Hazard Detected": argsString || "Unsecured Scaffolding", "Logged By": "AI Scan Feed", "Severity": "Major" },
        confidence: 92
      })
    } else if (cmd === '/assign-workforce') {
      const workersMatch = argsString.match(/(\d+)/)
      const count = workersMatch ? workersMatch[0] : "5"
      const crew = argsString.replace(/(\d+)/, '').trim() || "Drywall Installers"
      setParsedCommand({
        command: "Assign Workforce Crew",
        args: { "Crew Type": crew, "Worker Count": count, "Destination Zone": "Sector C Framing" },
        confidence: 89
      })
    } else {
      setParsedCommand(null)
    }
  }

  const handleExecuteCommand = () => {
    if (!parsedCommand) return
    setIsCommandExecuted(true)
    setTimeout(() => {
      setIsCommandExecuted(false)
      setCommandInput("")
      setParsedCommand(null)
      // Open Copilot thread representing the command execution
      const thId = createNewThread(`Task: ${parsedCommand.command}`)
      setActiveThreadId(thId)
      sendMessage(`Command executed: ${parsedCommand.command} with parameters ${JSON.stringify(parsedCommand.args)}`)
      setActiveTab('copilot')
    }, 1500)
  }

  // Add Custom Prompt template
  const handleAddPrompt = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPromptTitle || !newPromptText) return
    addPromptTemplate({
      title: newPromptTitle,
      prompt: newPromptText,
      category: newPromptCat,
      isFavorite: newPromptCat === 'Favorites'
    })
    setNewPromptTitle("")
    setNewPromptText("")
    setShowAddPrompt(false)
  }

  // Add Custom Workflow handler
  const handleAddWorkflowSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWfName || !newWfTrigger || !newWfAction) return
    addWorkflow({
      name: newWfName,
      isEnabled: true,
      nodes: [
        { id: "n_trig", type: "trigger", label: newWfTrigger, details: "Auto-trigger scanner" },
        { id: "n_cond", type: "condition", label: newWfCondition || "Checks active zones", details: "Conditional routing parameters" },
        { id: "n_act", type: "action", label: newWfAction, details: "Executes target response" }
      ]
    })
    setNewWfName("")
    setNewWfTrigger("")
    setNewWfCondition("")
    setNewWfAction("")
    setShowAddWf(false)
  }

  // Filter threads by search
  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(threadSearch.toLowerCase())
  )

  // Filter prompts by search
  const filteredPrompts = prompts.filter((p) =>
    p.title.toLowerCase().includes(promptSearch.toLowerCase()) ||
    p.prompt.toLowerCase().includes(promptSearch.toLowerCase())
  )

  // Aggregate pending approvals across all messages
  const pendingApprovals: Array<{ threadId: string; messageId: string; action: any }> = []
  Object.keys(messages).forEach((thId) => {
    const threadMsgs = messages[thId] || []
    threadMsgs.forEach((msg) => {
      if (msg.actions) {
        msg.actions.forEach((act) => {
          if (act.status === 'pending') {
            pendingApprovals.push({ threadId: thId, messageId: msg.id, action: act })
          }
        })
      }
    })
  })

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer.current) window.clearInterval(recordingTimer.current)
    }
  }, [])

  return (
    <div className="space-y-6 py-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. CONTROL HEADER BAR */}
      <header className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-accent/10 text-brand-accent rounded-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight">
              AI Command & Operating System
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Multi-modal reasoning, predictive telemetry forecasts, and human-in-the-loop task routing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Persona selector widget */}
          <div className="flex items-center gap-2 bg-muted/20 border border-border p-1.5 rounded-xl w-full sm:w-auto">
            <span className="text-xs font-semibold text-muted-foreground px-2">Active Persona:</span>
            <select
              value={currentPersona}
              onChange={(e) => setPersona(e.target.value as any)}
              className="bg-white dark:bg-[#0B0F19] text-xs font-bold border border-border rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-brand-accent focus:outline-none"
            >
              <option value="Project Manager">Project Manager (Schedule & Cost)</option>
              <option value="Safety Officer">Safety Officer (OSHA & Haz)</option>
              <option value="Finance Analyst">Finance Analyst (Budget & Variance)</option>
            </select>
          </div>

          {/* Quick status bar widgets */}
          <div className="flex items-center gap-4 text-xs font-mono font-bold bg-muted/10 border border-border/50 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${systemStatus === 'online' ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`}></span>
              <span className="text-slate-700 dark:text-slate-300">System: {systemStatus}</span>
            </div>
            <div className="text-muted-foreground">Latency: {responseLatencyMs}ms</div>
            <div className="text-muted-foreground">Tokens: {(tokensUsedToday / 1000).toFixed(1)}k</div>
          </div>
        </div>
      </header>

      {/* 2. NAVIGATION TABS */}
      <div className="flex border-b border-border overflow-x-auto gap-2 scrollbar-none">
        {[
          { id: 'dashboard', label: 'AI Dashboard', icon: Layers },
          { id: 'copilot', label: 'AI Copilot Workspace', icon: Sparkles },
          { id: 'commands', label: 'NL Command Center', icon: Activity },
          { id: 'workflows', label: 'Autonomous Workflows', icon: WorkflowIcon },
          { id: 'analytics', label: 'Model Performance', icon: TrendingUp },
          { id: 'prompts', label: 'Prompt Library', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-brand-accent text-brand-accent bg-brand-accent/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 3. DYNAMIC CONTENT AREA */}
      <main className="min-h-[550px]">
        {/* TAB 1: AI DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left section: Health & Insights list */}
            <div className="space-y-6 lg:col-span-1">
              {/* Daily AI Insights */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Sparkles className="w-4 h-4 text-brand-accent" />
                    Daily AI Insights
                  </h3>
                  <span className="text-[10px] font-bold bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded">
                    Persona: {currentPersona}
                  </span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {risks.map((risk) => (
                    <div
                      key={risk.id}
                      className="border border-border/80 rounded-xl p-3.5 hover:border-brand-accent/50 transition-all bg-muted/5 space-y-2 cursor-pointer"
                      onClick={() => {
                        const thId = createNewThread(`Risk Audit: ${risk.title}`)
                        setActiveThreadId(thId)
                        sendMessage(`Run a detailed predictive audit on risk flag: "${risk.title}". Suggest mitigation and workflow logic.`)
                        setActiveTab('copilot')
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{risk.title}</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                          risk.severity === 'Critical'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {risk.severity} ({risk.probability}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{risk.description}</p>
                      <div className="text-[10px] font-bold text-brand-accent flex items-center gap-1 bg-brand-accent/5 p-1.5 rounded-lg">
                        <Sparkles className="w-3 h-3 flex-shrink-0" />
                        <span>AI suggestion: {risk.suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Delay risk map card */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Site Environment Geofence Alerts
                </h3>

                <div className="border border-border/60 rounded-xl p-4 bg-amber-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Impending Crane Hoist Interruption</span>
                    <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded">Zone C</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Lightning threats detected within 5 miles radius. Recommended safety stand-down is flagged for active crane crews.
                  </p>
                  <button
                    onClick={() => {
                      const thId = createNewThread("Lightning Geofence Stand-down")
                      setActiveThreadId(thId)
                      sendMessage("Dispatch safety warning to Sector C crane operators and file a weather interruption daily log.")
                      setActiveTab('copilot')
                    }}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Trigger Dispatch warnings
                  </button>
                </div>
              </div>
            </div>

            {/* Right section: Cost deviation & shortage SVG charts + Human in loop panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cost Variance Predictive Overlay */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Project Cost Deviation & Forecast Trend
                  </h3>
                  <span className="text-[10px] font-bold text-muted-foreground font-mono">
                    Solid: Predicted Deviation | Dashed: Real deviation limit
                  </span>
                </div>

                <div className="relative h-48 bg-muted/10 rounded-xl flex items-center justify-center">
                  <svg className="w-full h-full p-4" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                    
                    {/* Forecast path - cyan */}
                    <polyline
                      fill="none"
                      stroke="#00C8FF"
                      strokeWidth="3"
                      points="30,140 150,110 270,130 390,70 510,80 570,40"
                      strokeLinecap="round"
                    />
                    {/* Actual trend - Orange */}
                    <polyline
                      fill="none"
                      stroke="#FF7B00"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      points="30,140 150,115 270,135 390,80"
                      strokeLinecap="round"
                    />

                    {/* Interactive dots */}
                    <circle cx="390" cy="80" r="5" fill="#FF7B00" />
                    <circle cx="570" cy="40" r="5" fill="#00C8FF" className="animate-pulse" />
                  </svg>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-[9px] font-bold text-muted-foreground font-mono">
                    <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Week 5 (Est)</span><span>Week 6 (Est)</span>
                  </div>
                </div>
              </div>

              {/* Human-in-the-loop pending approval panel */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-accent" />
                  Human-in-the-Loop Actions Pending Approval
                </h3>

                {pendingApprovals.length === 0 ? (
                  <div className="border border-dashed border-border rounded-xl p-8 text-center text-xs text-muted-foreground">
                    All AI-generated actions are approved or dismissed. No pending triggers.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingApprovals.map(({ threadId, messageId, action }) => (
                      <div
                        key={action.id}
                        className="border border-border rounded-xl p-4 bg-muted/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-extrabold bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded uppercase">
                              {action.type}
                            </span>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{action.title}</h4>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{action.description}</p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => approveActionCard(messageId, action.id)}
                            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => rejectActionCard(messageId, action.id)}
                            className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-500/90 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI COPILOT WORKSPACE */}
        {activeTab === 'copilot' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-0 overflow-hidden shadow-raised">
            {/* Thread Navigation sidebar */}
            <div className="lg:col-span-1 border-r border-border p-4 space-y-4 bg-muted/5">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Conversations
                </h3>
                <button
                  onClick={() => createNewThread()}
                  className="p-1 text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-all"
                  title="New Thread"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Thread Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={threadSearch}
                  onChange={(e) => setThreadSearch(e.target.value)}
                  className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg pl-8 pr-3 py-2 focus:ring-1 focus:ring-brand-accent focus:outline-none"
                />
              </div>

              {/* Pinned & Recent threads lists */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {/* Pinned */}
                {filteredThreads.filter((t) => t.isPinned).length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">Pinned</span>
                    {filteredThreads.filter((t) => t.isPinned).map((t) => (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border ${
                          activeThreadId === t.id
                            ? 'bg-brand-accent/5 border-brand-accent text-brand-accent'
                            : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-muted/20'
                        }`}
                      >
                        <span
                          onClick={() => setActiveThreadId(t.id)}
                          className="text-xs font-semibold truncate flex-1 block"
                        >
                          {t.title}
                        </span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => togglePinThread(t.id)} className="p-0.5 text-slate-400 hover:text-brand-accent">
                            <Pin className="w-3 h-3 fill-current text-brand-accent" />
                          </button>
                          <button onClick={() => deleteThread(t.id)} className="p-0.5 text-slate-400 hover:text-rose-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recents */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">Recent Chats</span>
                  {filteredThreads.filter((t) => !t.isPinned).length === 0 ? (
                    <span className="text-[10px] text-muted-foreground block text-center py-2">No other threads</span>
                  ) : (
                    filteredThreads.filter((t) => !t.isPinned).map((t) => (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border ${
                          activeThreadId === t.id
                            ? 'bg-brand-accent/5 border-brand-accent text-brand-accent'
                            : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-muted/20'
                        }`}
                      >
                        <span
                          onClick={() => setActiveThreadId(t.id)}
                          className="text-xs font-semibold truncate flex-1 block"
                        >
                          {t.title}
                        </span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => togglePinThread(t.id)} className="p-0.5 text-slate-400 hover:text-brand-accent">
                            <Pin className="w-3 h-3" />
                          </button>
                          <button onClick={() => deleteThread(t.id)} className="p-0.5 text-slate-400 hover:text-rose-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Chat Stream main canvas */}
            <div className="lg:col-span-3 flex flex-col h-[550px]">
              {/* Messages container */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {activeMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
                    <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-full">
                      <Sparkles className="w-6 h-6 animate-bounce" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">Start new AI reasoning session</h4>
                    <p className="text-xs text-muted-foreground">
                      Ask a schedule query, upload blueprints, record site meetings, or write automated actions.
                    </p>
                  </div>
                ) : (
                  activeMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[10px] ${
                        msg.role === 'user' ? 'bg-brand-accent text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}>
                        {msg.role === 'user' ? 'U' : 'AI'}
                      </div>

                      {/* Content Card */}
                      <div className={`p-4 rounded-2xl border ${
                        msg.role === 'user'
                          ? 'bg-brand-accent/10 border-brand-accent/30 text-slate-900 dark:text-slate-100'
                          : 'bg-white dark:bg-[#0B0F19] border-border text-slate-800 dark:text-slate-200 shadow-sm'
                      } space-y-3`}>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                        {/* Rendering dynamic SVG charts if included in AI output */}
                        {msg.chartData && (
                          <div className="border border-border/80 rounded-xl p-3 bg-muted/5 space-y-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                              Concrete Supply drift curves
                            </span>
                            <div className="h-32 bg-slate-900/40 rounded-lg flex items-center justify-center">
                              <svg className="w-full h-full p-2 text-slate-500" viewBox="0 0 300 120" preserveAspectRatio="none">
                                <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
                                <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
                                <polyline
                                  fill="none"
                                  stroke="#00C8FF"
                                  strokeWidth="2.5"
                                  points="20,100 80,75 140,85 200,45 280,30"
                                  strokeLinecap="round"
                                />
                                {msg.chartData.map((d, i) => (
                                  <circle key={i} cx={20 + i * 60} cy={100 - (d.value / 160) * 80} r="4" className="fill-brand-accent" />
                                ))}
                              </svg>
                            </div>
                          </div>
                        )}

                        {/* References */}
                        {msg.references && msg.references.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/60">
                            <span className="text-[10px] text-muted-foreground font-semibold">Citations:</span>
                            {msg.references.map((ref, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border/60 hover:text-brand-accent cursor-pointer flex items-center gap-1"
                              >
                                <FileText className="w-2.5 h-2.5" />
                                {ref}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action cards */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-border/60">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase font-mono block">Suggested Actions:</span>
                            {msg.actions.map((act) => (
                              <div key={act.id} className="border border-border/80 rounded-xl p-3 bg-muted/10 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-extrabold bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded">{act.type}</span>
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{act.status}</span>
                                </div>
                                <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-100">{act.title}</h5>
                                <p className="text-[10px] text-muted-foreground">{act.description}</p>
                                
                                {act.status === 'pending' && (
                                  <div className="flex items-center gap-2 pt-1">
                                    <button
                                      onClick={() => approveActionCard(msg.id, act.id)}
                                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-md text-[9px] uppercase tracking-wider flex items-center gap-0.5"
                                    >
                                      <Check className="w-2.5 h-2.5" /> Approve
                                    </button>
                                    <button
                                      onClick={() => rejectActionCard(msg.id, act.id)}
                                      className="px-2.5 py-1 bg-rose-500 hover:bg-rose-500/90 text-white font-bold rounded-md text-[9px] uppercase tracking-wider flex items-center gap-0.5"
                                    >
                                      <X className="w-2.5 h-2.5" /> Dismiss
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Upload Loading Progress bar simulation */}
                {isUploading && (
                  <div className="max-w-[70%] mr-auto bg-white dark:bg-[#0B0F19] border border-border p-4 rounded-2xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 animate-spin" /> Ingesting document: {selectedFile}
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-brand-accent h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat bottom prompt input bar */}
              <div className="border-t border-border p-4 bg-muted/5 space-y-3 relative">
                {/* Voice record simulator display bar */}
                {isRecording && (
                  <div className="flex items-center justify-between bg-brand-accent/10 border border-brand-accent/30 rounded-xl p-3 text-xs text-brand-accent animate-pulse">
                    <span className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-rose-500 animate-bounce" />
                      Listening field recorder...Speak now (Auto-submits prompt on tap stop)
                    </span>
                    <span className="font-mono font-bold">00:{(recordingSeconds < 10 ? '0' : '') + recordingSeconds}</span>
                  </div>
                )}

                {/* Attached Document Quick List drawer */}
                {showUploadList && (
                  <div className="absolute bottom-16 left-4 bg-white dark:bg-[#141B2D] border border-border rounded-xl p-3 shadow-floating w-60 z-30 space-y-2">
                    <div className="flex items-center justify-between border-b border-border pb-1">
                      <span className="text-[10px] font-extrabold text-muted-foreground uppercase">Ingest Document Source</span>
                      <button onClick={() => setShowUploadList(false)} className="p-0.5 hover:bg-muted rounded text-muted-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {[
                      "OSHA_1926_Safety.pdf",
                      "Blueprint_Apex_Rev4.dwg",
                      "Invoice_Cement_Apex.xlsx"
                    ].map((f) => (
                      <button
                        key={f}
                        onClick={() => handleUploadFile(f)}
                        className="w-full text-left p-1.5 text-[11px] font-bold hover:bg-muted rounded text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border border-transparent hover:border-border"
                      >
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                        {f}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUploadList((prev) => !prev)}
                    className="p-3 bg-white dark:bg-[#0B0F19] border border-border hover:bg-muted text-slate-600 dark:text-slate-350 rounded-xl transition-all"
                    title="Upload source file"
                  >
                    <Paperclip className="w-4.5 h-4.5" />
                  </button>

                  <button
                    onClick={handleVoiceRecordClick}
                    className={`p-3 border rounded-xl transition-all ${
                      isRecording
                        ? 'bg-rose-500 border-rose-500 text-white animate-pulse'
                        : 'bg-white dark:bg-[#0B0F19] border-border hover:bg-muted text-slate-600 dark:text-slate-350'
                    }`}
                    title="Voice recorder prompt"
                  >
                    <Mic className="w-4.5 h-4.5" />
                  </button>

                  <textarea
                    rows={1}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (!chatInput.trim() || !activeThreadId) return
                        sendMessage(chatInput)
                        setChatInput("")
                      }
                    }}
                    placeholder="Type a schedule query, safety regulations search..."
                    className="flex-1 bg-white dark:bg-[#0B0F19] border border-border rounded-xl text-xs px-4 py-3 resize-none focus:ring-1 focus:ring-brand-accent focus:outline-none focus:border-brand-accent"
                  />

                  <button
                    onClick={() => {
                      if (!chatInput.trim() || !activeThreadId) return
                      sendMessage(chatInput)
                      setChatInput("")
                    }}
                    className="p-3 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl transition-all"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NL COMMAND CENTER */}
        {activeTab === 'commands' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <h2 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Natural Language Command Console
              </h2>
              <p className="text-xs text-muted-foreground">
                Type an direct instruction below. AI parses parameters dynamically with validation checks.
              </p>

              {/* Suggestions chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: "Create Project", text: "/create-project Apex Residences $12M" },
                  { label: "Assign Crew", text: "/assign-workforce 10 Drywall Installers" },
                  { label: "Log Safety Incident", text: "/write-safety-log Handrail missing at elevator hoist" }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleCommandChange(chip.text)}
                    className="px-3 py-1.5 bg-muted/20 hover:bg-brand-accent/10 border border-border rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-all uppercase tracking-wider"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Command text box input */}
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 font-mono text-xs text-brand-accent font-bold">&gt;</span>
                <input
                  type="text"
                  placeholder="e.g. /create-project Plaza Mall $15M"
                  value={commandInput}
                  onChange={(e) => handleCommandChange(e.target.value)}
                  className="w-full bg-[#0B0F19] text-emerald-400 font-mono text-xs border border-border rounded-xl pl-8 pr-4 py-3 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Parsing summary outputs */}
            {parsedCommand && (
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      AI Parameter Validation
                    </h3>
                  </div>

                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border/50 text-[10px] uppercase font-mono">
                        <th className="pb-2">Parameter</th>
                        <th className="pb-2">Parsed Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-semibold text-slate-700 dark:text-slate-200">
                      <tr>
                        <td className="py-2 text-[10px] uppercase text-muted-foreground">Action Type</td>
                        <td className="py-2 font-mono text-emerald-500">{parsedCommand.command}</td>
                      </tr>
                      {Object.keys(parsedCommand.args).map((k) => (
                        <tr key={k}>
                          <td className="py-2 text-[10px] uppercase text-muted-foreground">{k}</td>
                          <td className="py-2 font-mono">{parsedCommand.args[k]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Confidence dial gauge */}
                <div className="flex flex-col items-center justify-center p-4 border border-border/60 rounded-2xl bg-muted/5 space-y-4">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" className="text-border" strokeWidth="8" />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="none"
                        stroke="currentColor"
                        className="text-emerald-500"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - parsedCommand.confidence / 100)}
                      />
                    </svg>
                    <span className="absolute font-mono font-extrabold text-lg">{parsedCommand.confidence}%</span>
                  </div>

                  <div className="text-center space-y-2">
                    <span className="text-xs font-bold block">Parsing Confidence rating (High)</span>
                    <button
                      onClick={handleExecuteCommand}
                      disabled={isCommandExecuted}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5"
                    >
                      {isCommandExecuted ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          Executing database transaction...
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Approve Draft & Execute
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AUTONOMOUS WORKFLOWS */}
        {activeTab === 'workflows' && (
          <div className="space-y-6">
            {/* Workflows Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflows.map((wf) => (
                <div key={wf.id} className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="space-y-1">
                      <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        {wf.name}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">ID: {wf.id}</span>
                    </div>

                    <button
                      onClick={() => toggleWorkflowEnabled(wf.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        wf.isEnabled
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                          : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                      }`}
                    >
                      {wf.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {/* Nodes Sequence visualizer */}
                  <div className="space-y-3">
                    {wf.nodes.map((node, index) => (
                      <div key={node.id} className="relative">
                        <div className="border border-border/80 rounded-xl p-3 bg-muted/5 flex items-start gap-3">
                          <div className={`p-1 bg-brand-accent/10 text-brand-accent rounded-lg text-[10px] font-extrabold uppercase font-mono`}>
                            {node.type}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{node.label}</span>
                            <span className="text-[10px] text-muted-foreground">{node.details}</span>
                          </div>
                        </div>
                        {index < wf.nodes.length - 1 && (
                          <div className="w-0.5 h-4 bg-border/60 mx-8 my-1"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Add Custom Workflow Node Form */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised flex flex-col justify-center items-center text-center space-y-4">
                {!showAddWf ? (
                  <>
                    <div className="p-3.5 bg-brand-accent/10 text-brand-accent rounded-full">
                      <WorkflowIcon className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-slate-200">
                        Create Autonomous Agent Workflow
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Create triggers, check requirements conditional loops, and trigger autogenerated schedules/emails.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddWf(true)}
                      className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add custom automation
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleAddWorkflowSubmit} className="w-full space-y-3 text-left">
                    <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                      <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-250">New Automation parameters</span>
                      <button type="button" onClick={() => setShowAddWf(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Workflow Name</label>
                      <input
                        type="text"
                        value={newWfName}
                        onChange={(e) => setNewWfName(e.target.value)}
                        placeholder="e.g. Concrete Stock Dispatch limits"
                        className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Trigger Condition</label>
                      <input
                        type="text"
                        value={newWfTrigger}
                        onChange={(e) => setNewWfTrigger(e.target.value)}
                        placeholder="e.g. Concrete stock drops below 150 tons"
                        className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Check Conditions (Optional)</label>
                      <input
                        type="text"
                        value={newWfCondition}
                        onChange={(e) => setNewWfCondition(e.target.value)}
                        placeholder="e.g. Evaluate if rain predicted tomorrow"
                        className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Action Trigger</label>
                      <input
                        type="text"
                        value={newWfAction}
                        onChange={(e) => setNewWfAction(e.target.value)}
                        placeholder="e.g. Create draft Purchase Order"
                        className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Save Workflow path
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MODEL PERFORMANCE & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stat counts row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Average Prediction Accuracy", val: "91.2%", desc: "Cross-validation parameters check vs actual outcomes today", color: "text-brand-accent" },
                { title: "Accepted Recommendations", val: "84.5%", desc: "Ratio of AI decisions executed directly by project managers", color: "text-emerald-500" },
                { title: "Time Saved (Manual Hours)", val: "142.5 hrs", desc: "Automated logistics drafts, audits and shift dispatch times", color: "text-sky-500" }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono">{item.title}</span>
                  <div className={`text-2xl font-heading font-extrabold ${item.color}`}>{item.val}</div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Model Response Latency Custom SVG chart */}
            <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Model Response Latency over time
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground font-mono">
                  Latency limits (Target below 350ms)
                </span>
              </div>

              <div className="relative h-44 bg-muted/10 rounded-xl flex items-center justify-center">
                <svg className="w-full h-full p-4" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  
                  {/* Latency line */}
                  <polyline
                    fill="none"
                    stroke="#FF7B00"
                    strokeWidth="3"
                    points="30,150 100,120 180,135 260,95 340,110 420,70 470,85"
                    strokeLinecap="round"
                  />
                  
                  <circle cx="470" cy="85" r="5" fill="#FF7B00" />
                </svg>
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-[9px] font-bold text-muted-foreground font-mono">
                  <span>9:00 AM</span><span>10:00 AM</span><span>11:00 AM</span><span>12:00 PM</span><span>1:00 PM</span><span>2:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PROMPT LIBRARY */}
        {activeTab === 'prompts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={promptSearch}
                  onChange={(e) => setPromptSearch(e.target.value)}
                  className="w-full text-xs bg-white dark:bg-[#141B2D] border border-border rounded-xl pl-9 pr-4 py-2.5 focus:ring-1 focus:ring-brand-accent focus:outline-none"
                />
              </div>

              <button
                onClick={() => setShowAddPrompt(true)}
                className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add template
              </button>
            </div>

            {/* Modal for adding prompts */}
            {showAddPrompt && (
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-floating max-w-xl mx-auto animate-fadeIn">
                <form onSubmit={handleAddPrompt} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-heading font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Add Custom Prompt Template
                    </span>
                    <button type="button" onClick={() => setShowAddPrompt(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Prompt Title</label>
                    <input
                      type="text"
                      value={newPromptTitle}
                      onChange={(e) => setNewPromptTitle(e.target.value)}
                      placeholder="e.g. Schedule delay mitigations scanner"
                      className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Category</label>
                    <select
                      value={newPromptCat}
                      onChange={(e) => setNewPromptCat(e.target.value as any)}
                      className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="Favorites">Favorites</option>
                      <option value="Construction">Construction Templates</option>
                      <option value="Organization">Organization Prompts</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Prompt Instruction</label>
                    <textarea
                      rows={3}
                      value={newPromptText}
                      onChange={(e) => setNewPromptText(e.target.value)}
                      placeholder="Prompt text template instructions..."
                      className="w-full text-xs bg-white dark:bg-[#0B0F19] border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Save template
                  </button>
                </form>
              </div>
            )}

            {/* List prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((p) => (
                <div key={p.id} className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 shadow-raised flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold bg-brand-accent/15 text-brand-accent px-2 py-0.5 rounded uppercase font-mono">
                        {p.category}
                      </span>
                      <button
                        onClick={() => toggleFavoritePrompt(p.id)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground"
                      >
                        <Sparkles className={`w-4 h-4 ${p.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                      </button>
                    </div>

                    <h4 className="font-heading font-extrabold text-xs text-slate-800 dark:text-slate-200">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                      "{p.prompt}"
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const thId = createNewThread(p.title)
                      setActiveThreadId(thId)
                      sendMessage(p.prompt)
                      setActiveTab('copilot')
                    }}
                    className="w-full py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 4. FOOTER NOTE */}
      <footer className="text-center pt-8 border-t border-border/60">
        <p className="text-[10px] text-muted-foreground font-mono">
          BuildSpace AI Operating System Module. Version 1.0.0. Secured deep-learning inferences verified by OSHA-1926 parameters.
        </p>
      </footer>
    </div>
  )
}
