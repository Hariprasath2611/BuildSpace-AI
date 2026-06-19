import { Schema, model, Document } from 'mongoose'
import { tenantIsolationPlugin } from '../config/database'

// 1. ORGANIZATION MODEL
export interface IOrganization extends Document {
  name: string
  status: 'active' | 'suspended'
  createdAt: Date
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
})

export const Organization = model<IOrganization>('Organization', OrganizationSchema)

// 2. PROJECT MODEL
export interface IProject extends Document {
  name: string
  location: string
  budget: string
  progress: number
  hazards: number
  tenantId: string
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  budget: { type: String, required: true },
  progress: { type: Number, default: 0 },
  hazards: { type: Number, default: 0 }
})

ProjectSchema.plugin(tenantIsolationPlugin)
export const Project = model<IProject>('Project', ProjectSchema)

// 3. WORKFORCE MODEL
export interface IWorkforce extends Document {
  name: string
  trade: string
  status: 'active' | 'inactive'
  tenantId: string
}

const WorkforceSchema = new Schema<IWorkforce>({
  name: { type: String, required: true },
  trade: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
})

WorkforceSchema.plugin(tenantIsolationPlugin)
export const Workforce = model<IWorkforce>('Workforce', WorkforceSchema)

// 4. MATERIAL MODEL
export interface IMaterial extends Document {
  sku: string
  name: string
  category: string
  currentStock: number
  maxStock: number
  unit: string
  status: 'Optimal' | 'Warning' | 'Reorder'
  tenantId: string
}

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
export const Material = model<IMaterial>('Material', MaterialSchema)

// 5. SAFETY OBSERVATION MODEL
export interface ISafetyObservation extends Document {
  title: string
  description: string
  severity: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'Resolved'
  tenantId: string
}

const SafetyObservationSchema = new Schema<ISafetyObservation>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' }
})

SafetyObservationSchema.plugin(tenantIsolationPlugin)
export const SafetyObservation = model<ISafetyObservation>('SafetyObservation', SafetyObservationSchema)
