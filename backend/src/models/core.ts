import mongoose, { Schema, model, Document } from 'mongoose'
import { z } from 'zod'
import { tenantIsolationPlugin } from '../database/plugins/tenantIsolation'
import { softDeletePlugin, SoftDeleteDocument } from '../database/plugins/softDelete'
import { auditLogPlugin, AuditLogDocument } from '../database/plugins/auditLog'

// ==========================================
// 1. ZOD SCHEMAS (VALIDATORS)
// ==========================================
export const OrganizationValidation = z.object({
  name: z.string().min(2).max(100),
  status: z.enum(['active', 'suspended', 'trial']),
  domain: z.string().email().optional()
})

export const CompanyValidation = z.object({
  organizationId: z.string(),
  name: z.string().min(2).max(100),
  taxId: z.string().optional(),
  industry: z.string().optional()
})

export const UserValidation = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  role: z.string(),
  phone: z.string().optional()
})

// ==========================================
// 2. MONGOOSE INTERFACES
// ==========================================
export interface IOrganization extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  status: 'active' | 'suspended' | 'trial'
  domain?: string
}

export interface ICompany extends Document, SoftDeleteDocument, AuditLogDocument {
  organizationId: string
  name: string
  taxId?: string
  industry?: string
}

export interface IUser extends Document, SoftDeleteDocument, AuditLogDocument {
  email: string
  name: string
  role: string
  phone?: string
  isMfaEnabled: boolean
  mfaSecret?: string
}

export interface IRole extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  permissions: string[]
}

export interface ITeam extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  departmentId: string
  members: string[]
}

export interface IDepartment extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  managerId?: string
}

// ==========================================
// 3. MONGOOSE SCHEMAS
// ==========================================
const OrganizationSchema = new Schema<IOrganization>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true, unique: true, trim: true },
  status: { type: String, enum: ['active', 'suspended', 'trial'], default: 'active' },
  domain: { type: String, lowercase: true, trim: true }
})
OrganizationSchema.plugin(softDeletePlugin)
OrganizationSchema.plugin(auditLogPlugin)
// Indexing
OrganizationSchema.index({ name: 1 })

const CompanySchema = new Schema<ICompany>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  organizationId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  taxId: { type: String, sparse: true },
  industry: { type: String }
})
CompanySchema.plugin(tenantIsolationPlugin)
CompanySchema.plugin(softDeletePlugin)
CompanySchema.plugin(auditLogPlugin)
// Compound index
CompanySchema.index({ tenantId: 1, name: 1 }, { unique: true })

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true },
  phone: { type: String },
  isMfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String }
})
UserSchema.plugin(tenantIsolationPlugin)
UserSchema.plugin(softDeletePlugin)
UserSchema.plugin(auditLogPlugin)
UserSchema.index({ email: 1 })

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true },
  permissions: { type: [String], default: [] }
})
RoleSchema.plugin(tenantIsolationPlugin)
RoleSchema.plugin(softDeletePlugin)
RoleSchema.plugin(auditLogPlugin)
RoleSchema.index({ tenantId: 1, name: 1 }, { unique: true })

const DepartmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true },
  managerId: { type: String }
})
DepartmentSchema.plugin(tenantIsolationPlugin)
DepartmentSchema.plugin(softDeletePlugin)
DepartmentSchema.plugin(auditLogPlugin)

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  departmentId: { type: String, required: true },
  members: { type: [String], default: [] }
})
TeamSchema.plugin(tenantIsolationPlugin)
TeamSchema.plugin(softDeletePlugin)
TeamSchema.plugin(auditLogPlugin)

// ==========================================
// 4. MODEL EXPORTS
// ==========================================
export const Organization = model<IOrganization>('Organization', OrganizationSchema)
export const Company = model<ICompany>('Company', CompanySchema)
export const User = model<IUser>('User', UserSchema)
export const Role = model<IRole>('Role', RoleSchema)
export const Department = model<IDepartment>('Department', DepartmentSchema)
export const Team = model<ITeam>('Team', TeamSchema)
