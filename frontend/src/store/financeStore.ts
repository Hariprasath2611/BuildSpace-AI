import { create } from 'zustand'

export interface BudgetLine {
  id: string
  costCode: string
  description: string
  baseline: number
  revised: number
  spent: number
  status: 'Optimal' | 'Warning' | 'Overrun'
}

export interface ExpenseClaim {
  id: string
  claimant: string
  category: 'Travel' | 'Materials' | 'Safety' | 'Utilities' | 'Other'
  amount: number
  project: string
  receiptUrl: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export interface Invoice {
  id: string
  partner: string
  type: 'Customer' | 'Vendor'
  amount: number
  dueDate: string
  status: 'Paid' | 'Sent' | 'Overdue'
}

export interface MilestonePayment {
  id: string
  subcontractor: string
  milestone: string
  amount: number
  retained: number // 10%
  status: 'Locked' | 'Awaiting Sign-off' | 'Released'
}

export interface CashFlowPoint {
  label: string
  inflow: number
  outflow: number
}

export interface FinanceState {
  budgets: BudgetLine[]
  expenses: ExpenseClaim[]
  invoices: Invoice[]
  payments: MilestonePayment[]
  cashFlow: CashFlowPoint[]
  
  addBudgetRevision: (code: string, newAmount: number) => void
  addExpenseClaim: (claim: Omit<ExpenseClaim, 'id' | 'status'>) => void
  approveExpenseClaim: (id: string) => void
  rejectExpenseClaim: (id: string) => void
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void
  releaseRetention: (id: string) => void
}

const INITIAL_BUDGETS: BudgetLine[] = [
  { id: "b_1", costCode: "03-3000", description: "Concrete Foundations Pouring", baseline: 450000, revised: 480000, spent: 320000, status: "Optimal" },
  { id: "b_2", costCode: "05-1000", description: "Structural Steel Frame Hoisting", baseline: 1200000, revised: 1200000, spent: 900000, status: "Optimal" },
  { id: "b_3", costCode: "15-4000", description: "Plumbing Fixtures & Conduits", baseline: 950000, revised: 120000, spent: 115000, status: "Warning" },
  { id: "b_4", costCode: "26-1000", description: "Electrical Main Transformer Grid", baseline: 250000, revised: 250000, spent: 270000, status: "Overrun" }
]

const INITIAL_EXPENSES: ExpenseClaim[] = [
  { id: "EXP-092", claimant: "John Doe (PM)", category: "Travel", amount: 120, project: "Tower A Residences", receiptUrl: "receipt_pm_092.png", status: "Pending" },
  { id: "EXP-091", claimant: "Sarah Connor (SE)", category: "Materials", amount: 450, project: "APEX Commercial Hub", receiptUrl: "receipt_se_091.png", status: "Approved" },
  { id: "EXP-090", claimant: "Dave Miller (Safety)", category: "Safety", amount: 1500, project: "Metro Line Underground", receiptUrl: "receipt_saf_090.png", status: "Approved" }
]

const INITIAL_INVOICES: Invoice[] = [
  { id: "INV-802", partner: "Cemex Corp Ltd", type: "Vendor", amount: 45000, dueDate: "2026-06-15", status: "Overdue" },
  { id: "INV-803", partner: "Vulcan Steel Ltd", type: "Vendor", amount: 120000, dueDate: "2026-07-10", status: "Sent" },
  { id: "INV-C-42", partner: "Apex Hub Inc Developers", type: "Customer", amount: 250000, dueDate: "2026-06-18", status: "Paid" }
]

const INITIAL_PAYMENTS: MilestonePayment[] = [
  { id: "pay_1", subcontractor: "Apex Plumbing Ltd", milestone: "MS-01: Underground sewage completed", amount: 200000, retained: 20000, status: "Awaiting Sign-off" },
  { id: "pay_2", subcontractor: "Apex Plumbing Ltd", milestone: "MS-02: Framing level 1 plumbing", amount: 150000, retained: 15000, status: "Locked" },
  { id: "pay_3", subcontractor: "Vulcan Ironworks", milestone: "MS-03: Structural foundation columns", amount: 500000, retained: 50000, status: "Released" }
]

const INITIAL_CASH_FLOW: CashFlowPoint[] = [
  { label: "Feb", inflow: 1200000, outflow: 900000 },
  { label: "Mar", inflow: 1500000, outflow: 1100000 },
  { label: "Apr", inflow: 1800000, outflow: 1400000 },
  { label: "May", inflow: 1400000, outflow: 1500000 },
  { label: "Jun", inflow: 2400000, outflow: 1800000 },
  { label: "Jul", inflow: 1900000, outflow: 2100000 }
]

export const useFinanceStore = create<FinanceState>((set) => ({
  budgets: INITIAL_BUDGETS,
  expenses: INITIAL_EXPENSES,
  invoices: INITIAL_INVOICES,
  payments: INITIAL_PAYMENTS,
  cashFlow: INITIAL_CASH_FLOW,

  addBudgetRevision: (code, newAmount) => set((state) => ({
    budgets: state.budgets.map((b) => {
      if (b.costCode === code) {
        const nextStatus = b.spent > newAmount ? 'Overrun' : (b.spent > newAmount * 0.9 ? 'Warning' : 'Optimal')
        return {
          ...b,
          revised: newAmount,
          status: nextStatus as any
        }
      }
      return b
    })
  })),

  addExpenseClaim: (claim) => set((state) => ({
    expenses: [...state.expenses, {
      ...claim,
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending'
    }]
  })),

  approveExpenseClaim: (id) => set((state) => ({
    expenses: state.expenses.map((exp) =>
      exp.id === id ? { ...exp, status: 'Approved' } : exp
    )
  })),

  rejectExpenseClaim: (id) => set((state) => ({
    expenses: state.expenses.map((exp) =>
      exp.id === id ? { ...exp, status: 'Rejected' } : exp
    )
  })),

  addInvoice: (invoice) => set((state) => ({
    invoices: [...state.invoices, {
      ...invoice,
      id: `INV-${Math.floor(800 + Math.random() * 200)}`
    }]
  })),

  releaseRetention: (id) => set((state) => ({
    payments: state.payments.map((p) =>
      p.id === id ? { ...p, status: 'Released' } : p
    )
  }))
}))

export default useFinanceStore
