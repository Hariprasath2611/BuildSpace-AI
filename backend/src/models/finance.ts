import { Schema, model, Document } from 'mongoose'
import { tenantIsolationPlugin } from '../database/plugins/tenantIsolation'
import { softDeletePlugin, SoftDeleteDocument } from '../database/plugins/softDelete'
import { auditLogPlugin, AuditLogDocument } from '../database/plugins/auditLog'

// ==========================================
// 1. MONGOOSE INTERFACES
// ==========================================
export interface IBudget extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  totalBudget: number
  allocated: number
  spent: number
  contingency: number
}

export interface IExpense extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  category: string
  amount: number
  date: Date
  description: string
  status: 'Draft' | 'Approved' | 'Paid'
}

export interface IInvoice extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  invoiceNumber: string
  clientName: string
  amount: number
  taxAmount: number
  totalAmount: number
  status: 'Unpaid' | 'Paid' | 'Overdue' | 'PartiallyPaid'
  dueDate: Date
}

export interface IPayment extends Document, SoftDeleteDocument, AuditLogDocument {
  invoiceId: string
  amount: number
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'Check' | 'Cash'
  referenceNumber?: string
  paidAt: Date
}

export interface IGstTax extends Document, SoftDeleteDocument, AuditLogDocument {
  taxName: string
  rate: number // e.g. 18 for 18% GST
  taxType: 'GST' | 'VAT' | 'ServiceTax'
}

export interface IRevenue extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  sourceName: string
  amount: number
  dateDate: Date
}

export interface ICashFlow extends Document, SoftDeleteDocument, AuditLogDocument {
  monthYear: string // '2026-06'
  inflow: number
  outflow: number
  netFlow: number
}

export interface IForecast extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  targetMonth: string // '2026-07'
  projectedCost: number
  projectedRevenue: number
}

// ==========================================
// 2. MONGOOSE SCHEMAS
// ==========================================
const BudgetSchema = new Schema<IBudget>({
  projectId: { type: String, required: true, unique: true, index: true },
  totalBudget: { type: Number, required: true },
  allocated: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  contingency: { type: Number, default: 0 }
})
BudgetSchema.plugin(tenantIsolationPlugin)
BudgetSchema.plugin(softDeletePlugin)
BudgetSchema.plugin(auditLogPlugin)

const ExpenseSchema = new Schema<IExpense>({
  projectId: { type: String, required: true, index: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Approved', 'Paid'], default: 'Draft' }
})
ExpenseSchema.plugin(tenantIsolationPlugin)
ExpenseSchema.plugin(softDeletePlugin)
ExpenseSchema.plugin(auditLogPlugin)

const InvoiceSchema = new Schema<IInvoice>({
  projectId: { type: String, required: true, index: true },
  invoiceNumber: { type: String, required: true },
  clientName: { type: String, required: true },
  amount: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Unpaid', 'Paid', 'Overdue', 'PartiallyPaid'], default: 'Unpaid' },
  dueDate: { type: Date, required: true }
})
InvoiceSchema.plugin(tenantIsolationPlugin)
InvoiceSchema.plugin(softDeletePlugin)
InvoiceSchema.plugin(auditLogPlugin)
InvoiceSchema.index({ tenantId: 1, invoiceNumber: 1 }, { unique: true })

const PaymentSchema = new Schema<IPayment>({
  invoiceId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Bank Transfer', 'Credit Card', 'Check', 'Cash'], required: true },
  referenceNumber: { type: String },
  paidAt: { type: Date, default: Date.now }
})
PaymentSchema.plugin(tenantIsolationPlugin)
PaymentSchema.plugin(softDeletePlugin)
PaymentSchema.plugin(auditLogPlugin)

const GstTaxSchema = new Schema<IGstTax>({
  taxName: { type: String, required: true },
  rate: { type: Number, required: true },
  taxType: { type: String, enum: ['GST', 'VAT', 'ServiceTax'], default: 'GST' }
})
GstTaxSchema.plugin(tenantIsolationPlugin)
GstTaxSchema.plugin(softDeletePlugin)
GstTaxSchema.plugin(auditLogPlugin)

const RevenueSchema = new Schema<IRevenue>({
  projectId: { type: String, required: true, index: true },
  sourceName: { type: String, required: true },
  amount: { type: Number, required: true },
  dateDate: { type: Date, default: Date.now }
})
RevenueSchema.plugin(tenantIsolationPlugin)
RevenueSchema.plugin(softDeletePlugin)
RevenueSchema.plugin(auditLogPlugin)

const CashFlowSchema = new Schema<ICashFlow>({
  monthYear: { type: String, required: true },
  inflow: { type: Number, default: 0 },
  outflow: { type: Number, default: 0 },
  netFlow: { type: Number, default: 0 }
})
CashFlowSchema.plugin(tenantIsolationPlugin)
CashFlowSchema.plugin(softDeletePlugin)
CashFlowSchema.plugin(auditLogPlugin)
CashFlowSchema.index({ tenantId: 1, monthYear: 1 }, { unique: true })

const ForecastSchema = new Schema<IForecast>({
  projectId: { type: String, required: true, index: true },
  targetMonth: { type: String, required: true },
  projectedCost: { type: Number, required: true },
  projectedRevenue: { type: Number, required: true }
})
ForecastSchema.plugin(tenantIsolationPlugin)
ForecastSchema.plugin(softDeletePlugin)
ForecastSchema.plugin(auditLogPlugin)
ForecastSchema.index({ projectId: 1, targetMonth: 1 }, { unique: true })

// ==========================================
// 3. MODEL EXPORTS
// ==========================================
export const Budget = model<IBudget>('Budget', BudgetSchema)
export const Expense = model<IExpense>('Expense', ExpenseSchema)
export const Invoice = model<IInvoice>('Invoice', InvoiceSchema)
export const Payment = model<IPayment>('Payment', PaymentSchema)
export const GstTax = model<IGstTax>('GstTax', GstTaxSchema)
export const Revenue = model<IRevenue>('Revenue', RevenueSchema)
export const CashFlow = model<ICashFlow>('CashFlow', CashFlowSchema)
export const Forecast = model<IForecast>('Forecast', ForecastSchema)
