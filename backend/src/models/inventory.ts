import { Schema, model, Document } from 'mongoose'
import { z } from 'zod'
import { tenantIsolationPlugin } from '../database/plugins/tenantIsolation'
import { softDeletePlugin, SoftDeleteDocument } from '../database/plugins/softDelete'
import { auditLogPlugin, AuditLogDocument } from '../database/plugins/auditLog'

// ==========================================
// 1. MONGOOSE INTERFACES
// ==========================================
export interface IWarehouse extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  location: string
  capacitySqFt?: number
}

export interface IMaterial extends Document, SoftDeleteDocument, AuditLogDocument {
  sku: string
  name: string
  category: string
  currentStock: number
  maxStock: number
  unit: string
  status: 'Optimal' | 'Warning' | 'Reorder'
}

export interface IMaterialRequest extends Document, SoftDeleteDocument, AuditLogDocument {
  materialId: string
  projectId: string
  requestedQty: number
  status: 'Pending' | 'Approved' | 'Rejected' | 'Issued'
  neededByDate: Date
}

export interface IStockMovement extends Document, SoftDeleteDocument, AuditLogDocument {
  materialId: string
  type: 'Inbound' | 'Outbound' | 'Transfer' | 'Adjustment'
  qty: number
  fromLocation?: string
  toLocation?: string
  referenceId?: string
}

export interface IPurchaseRequest extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  materialId: string
  qty: number
  estimatedCost: number
  status: 'Pending' | 'Approved' | 'Rejected'
}

export interface IPurchaseOrder extends Document, SoftDeleteDocument, AuditLogDocument {
  supplierId: string
  purchaseRequestId?: string
  cost: number
  approvals: '1/2' | '2/2 Approved' | 'Rejected'
  status: 'Pending' | 'Approved' | 'Rejected'
  etaDate?: Date
}

export interface IDelivery extends Document, SoftDeleteDocument, AuditLogDocument {
  purchaseOrderId: string
  receivedQty: number
  carrierName?: string
  trackingNumber?: string
  status: 'En Route' | 'Delivered' | 'Delayed'
  deliveredAt?: Date
}

// ==========================================
// 2. MONGOOSE SCHEMAS
// ==========================================
const WarehouseSchema = new Schema<IWarehouse>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacitySqFt: { type: Number }
})
WarehouseSchema.plugin(tenantIsolationPlugin)
WarehouseSchema.plugin(softDeletePlugin)
WarehouseSchema.plugin(auditLogPlugin)

const MaterialSchema = new Schema<IMaterial>({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  currentStock: { type: Number, required: true },
  maxStock: { type: Number, required: true },
  unit: { type: String, required: true },
  status: { type: String, enum: ['Optimal', 'Warning', 'Reorder'], default: 'Optimal' }
})
MaterialSchema.plugin(tenantIsolationPlugin)
MaterialSchema.plugin(softDeletePlugin)
MaterialSchema.plugin(auditLogPlugin)
MaterialSchema.index({ tenantId: 1, sku: 1 }, { unique: true })

const MaterialRequestSchema = new Schema<IMaterialRequest>({
  materialId: { type: String, required: true, index: true },
  projectId: { type: String, required: true, index: true },
  requestedQty: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Issued'], default: 'Pending' },
  neededByDate: { type: Date, required: true }
})
MaterialRequestSchema.plugin(tenantIsolationPlugin)
MaterialRequestSchema.plugin(softDeletePlugin)
MaterialRequestSchema.plugin(auditLogPlugin)

const StockMovementSchema = new Schema<IStockMovement>({
  materialId: { type: String, required: true, index: true },
  type: { type: String, enum: ['Inbound', 'Outbound', 'Transfer', 'Adjustment'], required: true },
  qty: { type: Number, required: true },
  fromLocation: { type: String },
  toLocation: { type: String },
  referenceId: { type: String }
})
StockMovementSchema.plugin(tenantIsolationPlugin)
StockMovementSchema.plugin(softDeletePlugin)
StockMovementSchema.plugin(auditLogPlugin)

const PurchaseRequestSchema = new Schema<IPurchaseRequest>({
  projectId: { type: String, required: true, index: true },
  materialId: { type: String, required: true, index: true },
  qty: { type: Number, required: true },
  estimatedCost: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
})
PurchaseRequestSchema.plugin(tenantIsolationPlugin)
PurchaseRequestSchema.plugin(softDeletePlugin)
PurchaseRequestSchema.plugin(auditLogPlugin)

const PurchaseOrderSchema = new Schema<IPurchaseOrder>({
  supplierId: { type: String, required: true, index: true },
  purchaseRequestId: { type: String },
  cost: { type: Number, required: true },
  approvals: { type: String, enum: ['1/2', '2/2 Approved', 'Rejected'], default: '1/2' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  etaDate: { type: Date }
})
PurchaseOrderSchema.plugin(tenantIsolationPlugin)
PurchaseOrderSchema.plugin(softDeletePlugin)
PurchaseOrderSchema.plugin(auditLogPlugin)

const DeliverySchema = new Schema<IDelivery>({
  purchaseOrderId: { type: String, required: true, index: true },
  receivedQty: { type: Number, required: true },
  carrierName: { type: String },
  trackingNumber: { type: String },
  status: { type: String, enum: ['En Route', 'Delivered', 'Delayed'], default: 'En Route' },
  deliveredAt: { type: Date }
})
DeliverySchema.plugin(tenantIsolationPlugin)
DeliverySchema.plugin(softDeletePlugin)
DeliverySchema.plugin(auditLogPlugin)

// ==========================================
// 3. MODEL EXPORTS
// ==========================================
export const Warehouse = model<IWarehouse>('Warehouse', WarehouseSchema)
export const Material = model<IMaterial>('Material', MaterialSchema)
export const MaterialRequest = model<IMaterialRequest>('MaterialRequest', MaterialRequestSchema)
export const StockMovement = model<IStockMovement>('StockMovement', StockMovementSchema)
export const PurchaseRequest = model<IPurchaseRequest>('PurchaseRequest', PurchaseRequestSchema)
export const PurchaseOrder = model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema)
export const Delivery = model<IDelivery>('Delivery', DeliverySchema)
