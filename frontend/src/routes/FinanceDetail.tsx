import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useFinanceStore } from '../store/financeStore'
import {
  ArrowLeft,
  AlertTriangle,
  History,
  Send,
  Plus,
  Sparkles,
  ClipboardCheck,
  Building2,
  FileSignature,
  FileText,
  X,
  Receipt,
  Check
} from 'lucide-react'

export default function FinanceDetail() {
  const { budgetId } = useParams()
  const budgets = useFinanceStore((state) => state.budgets)
  const expenses = useFinanceStore((state) => state.expenses)
  const invoices = useFinanceStore((state) => state.invoices)
  const payments = useFinanceStore((state) => state.payments)

  const addExpenseClaim = useFinanceStore((state) => state.addExpenseClaim)
  const approveExpenseClaim = useFinanceStore((state) => state.approveExpenseClaim)
  const rejectExpenseClaim = useFinanceStore((state) => state.rejectExpenseClaim)
  const addInvoice = useFinanceStore((state) => state.addInvoice)
  const releaseRetention = useFinanceStore((state) => state.releaseRetention)

  const activeBudget = budgets.find(b => b.id === budgetId) || budgets[0]

  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'invoices' | 'payments'>('overview')

  // Claim Form States
  const [claimant, setClaimant] = useState("")
  const [expenseAmount, setExpenseAmount] = useState(150)
  const [expenseCategory, setExpenseCategory] = useState<'Travel' | 'Materials' | 'Safety' | 'Utilities' | 'Other'>('Travel')

  // Invoice Form States
  const [partner, setPartner] = useState("")
  const [invoiceAmount, setInvoiceAmount] = useState(2500)
  const [invoiceType, setInvoiceType] = useState<'Customer' | 'Vendor'>('Vendor')

  // AI Assistant States
  const [aiQuery, setAiQuery] = useState("")
  const [aiChatLog, setAiChatLog] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: `Hello! I am your AI Financial Copilot. Ask me about cost code overrun predictions, Plaid bank syncs, or tax compliance guidelines for cost code ${activeBudget.costCode}.` }
  ])

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiQuery.trim()) return
    const nextLog = [...aiChatLog, { sender: 'user' as const, text: aiQuery }]
    setAiChatLog(nextLog)
    setAiQuery("")

    setTimeout(() => {
      let reply = ""
      const lower = aiQuery.toLowerCase()
      if (lower.includes('spent') || lower.includes('baseline') || lower.includes('overrun')) {
        reply = `For cost code ${activeBudget.costCode} (${activeBudget.description}), baseline budget is $${activeBudget.baseline.toLocaleString()}, revised amount is $${activeBudget.revised.toLocaleString()}, and expended spent is $${activeBudget.spent.toLocaleString()}. Current status: ${activeBudget.status}.`
      } else if (lower.includes('invoice') || lower.includes('payment') || lower.includes('retention')) {
        reply = `I see ${invoices.length} invoices registered on the dashboard. Subcontractor retention releases require site verification checklist sign-offs.`
      } else {
        reply = `Analyzing Cost Code ledger... We project cost curves to remain stable over Q3. Let me know if you would like me to draft a P&L report for this portfolio.`
      }
      setAiChatLog(prev => [...prev, { sender: 'ai' as const, text: reply }])
    }, 800)
  }

  const handleAddClaim = (e: React.FormEvent) => {
    e.preventDefault()
    if (!claimant || expenseAmount <= 0) return
    addExpenseClaim({
      claimant,
      category: expenseCategory,
      amount: expenseAmount,
      project: "Tower A Residences",
      receiptUrl: "receipt_pm_092.png"
    })
    setClaimant("")
  }

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!partner || invoiceAmount <= 0) return
    const today = new Date().toISOString().split('T')[0]
    addInvoice({
      partner,
      type: invoiceType,
      amount: invoiceAmount,
      dueDate: today,
      status: 'Sent'
    })
    setPartner("")
  }

  // Filtered lists
  // Since mock budgets align loosely, we display global lists or context-dependent records
  
  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/finance"
            className="p-2 hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all"
            title="Back to Finance Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-safety px-2 py-0.5 bg-brand-safety/10 rounded-full font-mono">
                Code: {activeBudget.costCode}
              </span>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-slate-800 dark:text-white">
                {activeBudget.description}
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Project Scope Base Allocations • baseline Ledger Control</p>
          </div>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Workspace Tabs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs header */}
          <div className="flex flex-wrap border-b border-border gap-1 bg-muted/40 p-1 rounded-xl">
            {(['overview', 'expenses', 'invoices', 'payments'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-lg text-xs font-extrabold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#141B2D] text-slate-800 dark:text-white shadow shadow-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab === 'payments' ? 'Milestone Payments' : tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Allocated Baseline</span>
                  <p className="text-xl font-bold font-heading">${activeBudget.baseline.toLocaleString()}</p>
                </div>

                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Revised Budget</span>
                  <p className="text-xl font-bold font-heading">${activeBudget.revised.toLocaleString()}</p>
                </div>

                <div className="bg-white dark:bg-[#141B2D] border border-border rounded-xl p-5 shadow-raised space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Expended Amount</span>
                  <p className="text-xl font-bold font-heading">${activeBudget.spent.toLocaleString()}</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${activeBudget.status === 'Optimal' ? 'bg-brand-success' : activeBudget.status === 'Warning' ? 'bg-brand-safety' : 'bg-brand-danger'}`}
                      style={{ width: `${Math.min(100, (activeBudget.spent / activeBudget.revised) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Status advisory */}
              <div className="bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised space-y-4">
                <h3 className="font-heading font-extrabold text-sm border-b border-border pb-2">Financial Cost Assessment</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                  <div className="space-y-2">
                    <p>Current Status: 
                      <span className={`ml-2 px-2.5 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                        activeBudget.status === 'Optimal' ? 'bg-brand-success/10 text-brand-success' :
                        activeBudget.status === 'Warning' ? 'bg-brand-safety/10 text-brand-safety' : 'bg-brand-danger/10 text-brand-danger'
                      }`}>
                        {activeBudget.status}
                      </span>
                    </p>
                    <p>Baseline Baseline: <strong>${activeBudget.baseline.toLocaleString()}</strong></p>
                    <p>Total Consumed: <strong>${activeBudget.spent.toLocaleString()}</strong></p>
                  </div>

                  <div className="bg-brand-safety/5 border border-brand-safety/20 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-brand-safety text-xs font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Financial Risk advisory</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {activeBudget.status === 'Overrun'
                        ? "⚠️ Current expenditures exceed baseline allocations. Recommend immediately locking any unapproved purchase orders."
                        : activeBudget.status === 'Warning'
                        ? "⚠️ Baseline consumption has reached 90% of total allocation. Revise limits soon."
                        : "🟢 Spent trends within baseline guidelines. Cost variance safe."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Form */}
                <form onSubmit={handleAddClaim} className="md:col-span-5 bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-4">
                  <h4 className="font-heading font-extrabold text-xs border-b border-border pb-2 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-brand-safety" />
                    Log Employee Expense Claim
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-705 dark:text-slate-300">Claimant Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe (PM)"
                      value={claimant}
                      onChange={(e) => setClaimant(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-705 dark:text-slate-300">Amount ($)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(Number(e.target.value))}
                        className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-750 dark:text-slate-300">Category</label>
                      <select
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value as any)}
                        className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                      >
                        <option value="Travel">Travel</option>
                        <option value="Materials">Materials</option>
                        <option value="Safety">Safety</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 border border-dashed border-border rounded-xl text-center text-xs text-muted-foreground space-y-1 bg-muted/20">
                    <Receipt className="w-6 h-6 mx-auto text-slate-400" />
                    <span className="block font-bold">receipt_pm_092.png</span>
                    <span className="text-[10px]">Auto-uploaded on device scan</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-brand-safety hover:bg-brand-safety/90 text-white font-bold text-xs rounded-lg shadow shadow-brand-safety/10 flex items-center justify-center gap-1.5"
                  >
                    Submit Expense Claim
                  </button>
                </form>

                {/* Expenses list */}
                <div className="md:col-span-7 bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-3">
                  <h4 className="font-heading font-extrabold text-xs border-b border-border pb-2 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-brand-accent" />
                    Expense Claims Audit List
                  </h4>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {expenses.map((exp) => (
                      <div key={exp.id} className="p-3 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{exp.claimant} — {exp.category}</p>
                          <p className="text-[10px] text-muted-foreground">{exp.project} • {exp.id}</p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="font-bold text-slate-800 dark:text-white">${exp.amount.toLocaleString()}</span>
                          {exp.status === 'Pending' ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => approveExpenseClaim(exp.id)}
                                className="p-1.5 bg-brand-success/10 text-brand-success hover:bg-brand-success hover:text-white rounded transition-colors"
                                title="Approve"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => rejectExpenseClaim(exp.id)}
                                className="p-1.5 bg-brand-danger/10 text-brand-danger hover:bg-brand-danger hover:text-white rounded transition-colors"
                                title="Reject"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              exp.status === 'Approved' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-danger/10 text-brand-danger'
                            }`}>
                              {exp.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Form */}
                <form onSubmit={handleAddInvoice} className="md:col-span-5 bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-4">
                  <h4 className="font-heading font-extrabold text-xs border-b border-border pb-2 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-brand-safety" />
                    Register Invoice Entry
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-705 dark:text-slate-300">Partner / Vendor</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vulcan Steel Ltd"
                      value={partner}
                      onChange={(e) => setPartner(e.target.value)}
                      className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-705 dark:text-slate-300">Amount ($)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={invoiceAmount}
                        onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                        className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-705 dark:text-slate-300">Type</label>
                      <select
                        value={invoiceType}
                        onChange={(e) => setInvoiceType(e.target.value as any)}
                        className="w-full p-2.5 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg dark:bg-[#141B2D]"
                      >
                        <option value="Vendor">Vendor</option>
                        <option value="Customer">Customer</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-brand-safety hover:bg-brand-safety/90 text-white font-bold text-xs rounded-lg shadow shadow-brand-safety/10 flex items-center justify-center gap-1.5"
                  >
                    Log Invoice Entry
                  </button>
                </form>

                {/* Invoices list */}
                <div className="md:col-span-7 bg-white dark:bg-[#141B2D] border border-border p-5 rounded-2xl shadow-raised space-y-3">
                  <h4 className="font-heading font-extrabold text-xs border-b border-border pb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-accent" />
                    Customer & Vendor Invoices
                  </h4>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {invoices.map((inv) => (
                      <div key={inv.id} className="p-3 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{inv.partner}</p>
                          <p className="text-[10px] text-muted-foreground">{inv.type} • Due: {inv.dueDate} • {inv.id}</p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="font-bold text-slate-800 dark:text-white">${inv.amount.toLocaleString()}</span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            inv.status === 'Paid' ? 'bg-brand-success/10 text-brand-success' : inv.status === 'Sent' ? 'bg-brand-safety/10 text-brand-safety' : 'bg-brand-danger/10 text-brand-danger'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-fade-in bg-white dark:bg-[#141B2D] border border-border rounded-2xl p-5 shadow-raised">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <h3 className="font-heading font-extrabold text-sm">Milestone Subcontractor Retentions (10% standard lock)</h3>
                <span className="text-[10px] font-bold text-brand-success flex items-center gap-1">
                  <ClipboardCheck className="w-3.5 h-3.5" /> Retention Release Policy Active
                </span>
              </div>
              
              <div className="space-y-3 pt-2">
                {payments.map((p) => (
                  <div key={p.id} className="p-4 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-muted/10 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-brand-safety" />
                        {p.subcontractor}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{p.milestone} • {p.id}</p>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-center">
                      <div className="text-right">
                        <p className="text-slate-500">Milestone: <strong>${p.amount.toLocaleString()}</strong></p>
                        <p className="text-brand-accent font-semibold">Retained (10%): <strong>${p.retained.toLocaleString()}</strong></p>
                      </div>
                      
                      {p.status === 'Awaiting Sign-off' ? (
                        <button
                          onClick={() => releaseRetention(p.id)}
                          className="px-3 py-1.5 bg-brand-safety text-white hover:opacity-90 rounded-lg font-bold text-[10px] flex items-center gap-1"
                        >
                          <FileSignature className="w-3.5 h-3.5" /> Release
                        </button>
                      ) : (
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          p.status === 'Released' ? 'bg-brand-success/10 text-brand-success' : 'bg-slate-300 dark:bg-slate-800 text-muted-foreground'
                        }`}>
                          {p.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* AI Financial Copilot Persistent Sidebar Drawer */}
        <div className="lg:col-span-4 bg-white dark:bg-[#141B2D] border border-border rounded-2xl shadow-raised flex flex-col overflow-hidden max-h-[500px]">
          <div className="p-4 bg-muted/40 border-b border-border flex justify-between items-center">
            <span className="font-heading font-extrabold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              AI Financial Copilot
            </span>
            <span className="text-[9px] font-bold text-brand-success flex items-center gap-1">
              🟢 Copilot Active
            </span>
          </div>

          {/* Conversation logs */}
          <div className="p-4 flex-1 space-y-3 overflow-y-auto text-xs min-h-[300px] max-h-[350px]">
            {aiChatLog.map((chat, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                  chat.sender === 'user'
                    ? 'bg-brand-safety text-white ml-auto text-right'
                    : 'bg-muted dark:bg-slate-900/60 text-slate-700 dark:text-slate-350 mr-auto text-left border border-border/40'
                }`}
              >
                {chat.text}
              </div>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleAiSubmit} className="p-3 border-t border-border flex gap-2">
            <input
              type="text"
              placeholder="Ask AI budget overruns..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="flex-1 p-2 border border-border bg-transparent focus:outline-none focus:border-brand-safety text-xs rounded-lg text-left"
            />
            <button
              type="submit"
              className="p-2 bg-brand-obsidian text-white dark:bg-white dark:text-brand-obsidian hover:opacity-90 rounded-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
