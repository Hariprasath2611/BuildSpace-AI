import { Schema, model, Document } from 'mongoose'
import { tenantIsolationPlugin } from '../database/plugins/tenantIsolation'
import { softDeletePlugin, SoftDeleteDocument } from '../database/plugins/softDelete'
import { auditLogPlugin, AuditLogDocument } from '../database/plugins/auditLog'

// ==========================================
// 1. MONGOOSE INTERFACES
// ==========================================
export interface IEmployee extends Document, SoftDeleteDocument, AuditLogDocument {
  userId: string
  name: string
  jobTitle: string
  salary: number
  dateJoined: Date
}

export interface IWorkforce extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  trade: string
  status: 'active' | 'inactive'
}

export interface ISubcontractor extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  trade: string
  complianceScore: number
  activeWorkers: number
}

export interface IVendor extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  category: string
  rating: number
}

export interface ISupplier extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  rating: number
  onTimeRate: string
  contact: string
  email: string
  activeContract: string
}

export interface IEquipment extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  type: string
  status: 'Available' | 'Maintenance' | 'Rented' | 'Inactive'
  fuelLevel: number
  engineHours: number
}

export interface IMaintenance extends Document, SoftDeleteDocument, AuditLogDocument {
  equipmentId: string
  serviceName: string
  maintenanceDate: Date
  details: string
  cost: number
}

export interface IFuelLog extends Document, SoftDeleteDocument, AuditLogDocument {
  equipmentId: string
  gallonsFilled: number
  costPerGallon: number
  totalCost: number
  loggedBy: string
}

export interface IReservation extends Document, SoftDeleteDocument, AuditLogDocument {
  resourceId: string
  resourceType: 'Equipment' | 'Space' | 'Vehicle'
  reservedBy: string
  startDate: Date
  endDate: Date
  status: 'Confirmed' | 'Pending' | 'Cancelled'
}

// ==========================================
// 2. MONGOOSE SCHEMAS
// ==========================================
const EmployeeSchema = new Schema<IEmployee>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  jobTitle: { type: String, required: true },
  salary: { type: Number, required: true },
  dateJoined: { type: Date, default: Date.now }
})
EmployeeSchema.plugin(tenantIsolationPlugin)
EmployeeSchema.plugin(softDeletePlugin)
EmployeeSchema.plugin(auditLogPlugin)

const WorkforceSchema = new Schema<IWorkforce>({
  name: { type: String, required: true },
  trade: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
})
WorkforceSchema.plugin(tenantIsolationPlugin)
WorkforceSchema.plugin(softDeletePlugin)
WorkforceSchema.plugin(auditLogPlugin)
WorkforceSchema.index({ tenantId: 1, name: 1 })

const SubcontractorSchema = new Schema<ISubcontractor>({
  name: { type: String, required: true },
  trade: { type: String, required: true },
  complianceScore: { type: Number, default: 100 },
  activeWorkers: { type: Number, default: 0 }
})
SubcontractorSchema.plugin(tenantIsolationPlugin)
SubcontractorSchema.plugin(softDeletePlugin)
SubcontractorSchema.plugin(auditLogPlugin)

const VendorSchema = new Schema<IVendor>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 5 }
})
VendorSchema.plugin(tenantIsolationPlugin)
VendorSchema.plugin(softDeletePlugin)
VendorSchema.plugin(auditLogPlugin)

const SupplierSchema = new Schema<ISupplier>({
  name: { type: String, required: true },
  rating: { type: Number, default: 5 },
  onTimeRate: { type: String, default: "100%" },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  activeContract: { type: String, required: true }
})
SupplierSchema.plugin(tenantIsolationPlugin)
SupplierSchema.plugin(softDeletePlugin)
SupplierSchema.plugin(auditLogPlugin)

const EquipmentSchema = new Schema<IEquipment>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Maintenance', 'Rented', 'Inactive'], default: 'Available' },
  fuelLevel: { type: Number, default: 100 },
  engineHours: { type: Number, default: 0 }
})
EquipmentSchema.plugin(tenantIsolationPlugin)
EquipmentSchema.plugin(softDeletePlugin)
EquipmentSchema.plugin(auditLogPlugin)
EquipmentSchema.index({ tenantId: 1, type: 1 })

const MaintenanceSchema = new Schema<IMaintenance>({
  equipmentId: { type: String, required: true, index: true },
  serviceName: { type: String, required: true },
  maintenanceDate: { type: Date, required: true },
  details: { type: String, required: true },
  cost: { type: Number, required: true }
})
MaintenanceSchema.plugin(tenantIsolationPlugin)
MaintenanceSchema.plugin(softDeletePlugin)
MaintenanceSchema.plugin(auditLogPlugin)

const FuelLogSchema = new Schema<IFuelLog>({
  equipmentId: { type: String, required: true, index: true },
  gallonsFilled: { type: Number, required: true },
  costPerGallon: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  loggedBy: { type: String, required: true }
})
FuelLogSchema.plugin(tenantIsolationPlugin)
FuelLogSchema.plugin(softDeletePlugin)
FuelLogSchema.plugin(auditLogPlugin)

const ReservationSchema = new Schema<IReservation>({
  resourceId: { type: String, required: true, index: true },
  resourceType: { type: String, enum: ['Equipment', 'Space', 'Vehicle'], required: true },
  reservedBy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Pending' }
})
ReservationSchema.plugin(tenantIsolationPlugin)
ReservationSchema.plugin(softDeletePlugin)
ReservationSchema.plugin(auditLogPlugin)

// ==========================================
// 3. MODEL EXPORTS
// ==========================================
export const Employee = model<IEmployee>('Employee', EmployeeSchema)
export const Workforce = model<IWorkforce>('Workforce', WorkforceSchema)
export const Subcontractor = model<ISubcontractor>('Subcontractor', SubcontractorSchema)
export const Vendor = model<IVendor>('Vendor', VendorSchema)
export const Supplier = model<ISupplier>('Supplier', SupplierSchema)
export const Equipment = model<IEquipment>('Equipment', EquipmentSchema)
export const Maintenance = model<IMaintenance>('Maintenance', MaintenanceSchema)
export const FuelLog = model<IFuelLog>('FuelLog', FuelLogSchema)
export const Reservation = model<IReservation>('Reservation', ReservationSchema)
