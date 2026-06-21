import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  ShieldAlert,
  Clock,
  Database,
  TrendingUp
} from 'lucide-react'

// Suggested chips for Sandbox
const SUGGESTED_PROMPTS = [
  { text: "Analyze rebar clashes on Level 3", type: "clash" },
  { text: "Predict formwork concrete delays", type: "delay" },
  { text: "Scan OSHA safety hazards in Tower B", type: "safety" }
]

// Simulated RAG outputs
const MOCK_ANSWERS: Record<string, {
  text: string;
  confidence: string;
  severity: "critical" | "warning" | "optimal";
  citations: string[];
  recommendation: string;
}> = {
  "clash": {
    text: "YOLOv11 Scans identified a spatial overlap between structural rebar columns and electrical conduit lines on Tower A Level 3 (Sector C).",
    confidence: "98% Confidence",
    severity: "critical",
    citations: ["drawing_sec3_rebar_v4.pdf", "conduit_electric_L3.dwg"],
    recommendation: "Flagged collision for site coordinator review. Re-routing recommended to avoid re-pour costs."
  },
  "delay": {
    text: "Material estimation models indicate a supply chain bottleneck for Level 4 concrete formwork components. Current ETA is delayed by 4.5 days.",
    confidence: "89% Confidence",
    severity: "warning",
    citations: ["vendor_invoice_8829.pdf", "schedule_critical_path.mpp"],
    recommendation: "Rearrange the sequence to pour Sector B first to keep subcontractor schedules aligned."
  },
  "safety": {
    text: "Computer Vision drone feed detected workers entering active loading zone boundary zones without hardhat and harness compliance.",
    confidence: "95% Confidence",
    severity: "critical",
    citations: ["site_cam_drone_04.mp4", "osha_rule_1926_100.pdf"],
    recommendation: "Pushed mobile notifications to Site Superintendent. Warning siren triggered in Sector D."
  }
}

export default function Home() {
  const [sandboxPrompt, setSandboxPrompt] = useState("")
  const [aiState, setAiState] = useState<"idle" | "typing" | "loading" | "answered">("idle")
  const [activePromptType, setActivePromptType] = useState("")
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({})

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const handleChipClick = (prompt: typeof SUGGESTED_PROMPTS[0]) => {
    if (aiState === "typing" || aiState === "loading") return
    setSandboxPrompt("")
    setActivePromptType(prompt.type)
    setAiState("typing")
    
    // Simulate typing character by character
    let index = 0
    const interval = setInterval(() => {
      setSandboxPrompt(prev => prev + prompt.text[index])
      index++
      if (index === prompt.text.length) {
        clearInterval(interval)
        // Trigger Loading
        setTimeout(() => {
          setAiState("loading")
          setTimeout(() => {
            setAiState("answered")
          }, 1200)
        }, 300)
      }
    }, 25)
  }

  const resetSandbox = () => {
    setSandboxPrompt("")
    setAiState("idle")
    setActivePromptType("")
  }

  return (
    <div className="space-y-20 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 pt-10 relative">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30">
          <div className="w-96 h-96 bg-brand-safety rounded-full filter blur-[120px]"></div>
          <div className="w-80 h-80 bg-brand-accent rounded-full filter blur-[100px] ml-40"></div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-safety/10 text-brand-safety text-xs font-semibold rounded-full border border-brand-safety/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LuminaryForge Tech Enterprise AI is Here</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          The AI Operating System for{' '}
          <span className="bg-gradient-to-r from-brand-safety to-brand-accent bg-clip-text text-transparent">
            Modern Construction
          </span>
        </h1>

        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Eliminate budget overruns, prevent schedules slippage, and protect site safety with real-time computer vision and RAG construction intelligence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-safety text-white font-semibold rounded-lg shadow-lg shadow-brand-safety/20 hover:bg-brand-safety/90 transition-all flex items-center justify-center gap-2"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-900 text-foreground border border-border font-semibold rounded-lg hover:bg-muted dark:hover:bg-slate-800 transition-all flex items-center justify-center"
          >
            Book Enterprise Demo
          </Link>
        </div>
      </section>

      {/* 2. INTERACTIVE AI SANDBOX */}
      <section className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-6 sm:p-8 shadow-floating max-w-4xl mx-auto space-y-6">
        <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg">Interactive AI Sandbox</h3>
            <p className="text-xs text-muted-foreground">Select a construction query to see BuildSpace AI in action</p>
          </div>
          {(aiState === "answered" || sandboxPrompt.length > 0) && (
            <button
              onClick={resetSandbox}
              className="text-xs font-semibold text-brand-safety hover:underline"
            >
              Clear Console
            </button>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(prompt)}
              disabled={aiState === "typing" || aiState === "loading"}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activePromptType === prompt.type
                  ? 'bg-brand-accent/15 border-brand-accent text-brand-accent'
                  : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {prompt.text}
            </button>
          ))}
        </div>

        {/* Console Display */}
        <div className="bg-brand-obsidian text-slate-200 font-mono p-4 rounded-xl text-xs sm:text-sm border border-slate-800 min-h-40 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-900 pb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Prompt Terminal Input</span>
            </div>
            
            <p className="text-brand-accent font-semibold">
              prompt&gt; {sandboxPrompt}
              {aiState === "typing" && <span className="animate-pulse">|</span>}
            </p>

            {/* AI Loading state */}
            {aiState === "loading" && (
              <div className="flex items-center gap-3 text-slate-400 py-2">
                <div className="w-4 h-4 rounded-full border-2 border-brand-accent border-t-transparent animate-spin"></div>
                <span>Querying RAG Vector Database & Scanning Site Feeds...</span>
              </div>
            )}

            {/* AI Answer state */}
            {aiState === "answered" && MOCK_ANSWERS[activePromptType] && (
              <div className="space-y-3 mt-4 border-t border-slate-900 pt-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2.5 py-0.5 rounded font-bold uppercase bg-brand-accent/25 text-brand-accent border border-brand-accent/30 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 animate-ai-pulse" />
                    Copilot Response
                  </span>
                  <span className="text-slate-400 text-xs font-bold">{MOCK_ANSWERS[activePromptType].confidence}</span>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {MOCK_ANSWERS[activePromptType].text}
                </p>

                {/* Recommendations */}
                <div className="p-3 bg-slate-900/60 rounded border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] text-brand-safety font-bold uppercase">System Recommendation</span>
                  <p className="text-slate-400 text-xs">{MOCK_ANSWERS[activePromptType].recommendation}</p>
                </div>

                {/* Citations */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 mt-1">
                  <span className="font-bold">Citations:</span>
                  {MOCK_ANSWERS[activePromptType].citations.map((c, i) => (
                    <span key={i} className="text-brand-accent hover:underline cursor-pointer">[{c}]</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {aiState === "idle" && (
            <p className="text-slate-500 italic py-6 text-center text-xs">
              Select one of the query suggestions above to simulate the RAG workflow...
            </p>
          )}
        </div>
      </section>

      {/* 3. TRUSTED BY / CLIENT LOGOS */}
      <section className="text-center space-y-6">
        <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">
          Trusted by Top General Contractors & Developers Worldwide
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center max-w-4xl mx-auto opacity-75 grayscale hover:grayscale-0 transition-all">
          <div className="font-heading font-extrabold text-xl text-slate-400 dark:text-slate-600">APEX INFRA</div>
          <div className="font-heading font-extrabold text-xl text-slate-400 dark:text-slate-600">VORTEX DEVELOPMENT</div>
          <div className="font-heading font-extrabold text-xl text-slate-400 dark:text-slate-600">TITAN CONSTRUCTORS</div>
          <div className="font-heading font-extrabold text-xl text-slate-400 dark:text-slate-600">MATRIX BUILDERS</div>
        </div>
      </section>

      {/* 4. STATISTICS CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto text-center">
        {[
          { label: "Cost Overrun Reduction", value: "32%", trend: "Based on active site cost codes", icon: TrendingUp },
          { label: "Critical Delay Prevention", value: "4.5 Days", trend: "Estimated savings per project", icon: Clock },
          { label: "Safety Score Improvement", value: "98/100", trend: "OSHA/WCAG standard audits", icon: ShieldAlert }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#141B2D] p-6 rounded-xl border border-border shadow-raised flex flex-col justify-center items-center space-y-2">
              <div className="p-3 bg-brand-safety/10 text-brand-safety rounded-full">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="text-4xl font-heading font-bold">{item.value}</h4>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.trend}</p>
            </div>
          )
        })}
      </section>

      {/* 5. FAQ SECTION */}
      <section className="max-w-3xl mx-auto space-y-6">
        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-center">
          Frequently Asked Questions
        </h3>

        <div className="space-y-4 divide-y divide-border">
          {[
            { q: "How does the AI predict construction delays?", a: "BuildSpace AI aggregates scheduling parameters, purchase orders, vector drawings, and real-time field drone logs. By comparing current statuses with historical delay matrices, it predicts bottleneck dates with up to 94% accuracy." },
            { q: "Is there offline support for active project sites?", a: "Yes, our mobile application compiles draft check-ins, safety checklists, and photo logs locally during zero connectivity. The sync engine automatically pushes drafts to MongoDB Atlas once internet signals return." },
            { q: "Can we integrate existing drawings (PDFs/CAD)?", a: "Absolutely. Our Document AI OCR engine parses CAD drawings, engineering PDFs, and cost code spreadsheets, converting physical layouts into neural connector index mappings." }
          ].map((faq, i) => (
            <div key={i} className="pt-4 first:pt-0">
              <button
                onClick={() => toggleFaq(i)}
                className="w-full flex justify-between items-center text-left py-2 focus:outline-none"
              >
                <span className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transform transition-transform duration-200 ${faqOpen[i] ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen[i] && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed pl-1">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION PANEL */}
      <section className="bg-gradient-to-r from-brand-safety to-orange-600 text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-floating max-w-5xl mx-auto">
        <h3 className="text-2xl sm:text-4xl font-heading font-bold leading-tight">
          Ready to Bring AI Intelligence to Your Site?
        </h3>
        <p className="text-sm sm:text-base opacity-90 max-w-2xl mx-auto">
          Start your 14-day free trial. Setup takes less than 10 minutes. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-obsidian text-white font-semibold rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            Start Free Trial
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center"
          >
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  )
}
