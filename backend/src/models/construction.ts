import mongoose, { Schema, model, Document } from 'mongoose'
import { z } from 'zod'
import { tenantIsolationPlugin } from '../database/plugins/tenantIsolation'
import { softDeletePlugin, SoftDeleteDocument } from '../database/plugins/softDelete'
import { auditLogPlugin, AuditLogDocument } from '../database/plugins/auditLog'

// ==========================================
// 1. VALIDATORS
// ==========================================
export const ProjectValidation = z.object({
  name: z.string().min(2).max(100),
  location: z.string(),
  budget: z.string(),
  progress: z.number().min(0).max(100).optional(),
  hazards: z.number().optional()
})

// ==========================================
// 2. MONGOOSE INTERFACES
// ==========================================
export interface IProject extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  location: string
  budget: string
  progress: number
  hazards: number
}

export interface ISite extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  name: string
  address: string
  geoCoordinates?: { lat: number; lng: number }
}

export interface IBuilding extends Document, SoftDeleteDocument, AuditLogDocument {
  siteId: string
  name: string
  totalFloors: number
}

export interface IFloor extends Document, SoftDeleteDocument, AuditLogDocument {
  buildingId: string
  floorNumber: number
  status: 'In Progress' | 'Completed' | 'Pending'
}

export interface IUnit extends Document, SoftDeleteDocument, AuditLogDocument {
  floorId: string
  unitNumber: string
  areaSqFt: number
  status: 'Draft' | 'Framing' | 'Finished' | 'Inspected'
}

export interface IMilestone extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  title: string
  dueDate: Date
  isCompleted: boolean
}

export interface ITask extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  milestoneId?: string
  title: string
  assigneeId?: string
  status: 'Todo' | 'In Progress' | 'Blocked' | 'Done'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  startDate?: Date
  endDate?: Date
}

export interface ISchedule extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  name: string
  tasks: string[]
}

export interface ICalendar extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  title: string
  eventDate: Date
}

// ==========================================
// 3. MONGOOSE SCHEMAS
// ==========================================
const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  budget: { type: String, required: true },
  progress: { type: Number, default: 0 },
  hazards: { type: Number, default: 0 }
})
ProjectSchema.plugin(tenantIsolationPlugin)
ProjectSchema.plugin(softDeletePlugin)
ProjectSchema.plugin(auditLogPlugin)
ProjectSchema.index({ tenantId: 1, name: 1 })

const SiteSchema = new Schema<ISite>({
  projectId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  geoCoordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
})
SiteSchema.plugin(tenantIsolationPlugin)
SiteSchema.plugin(softDeletePlugin)
SiteSchema.plugin(auditLogPlugin)

const BuildingSchema = new Schema<IBuilding>({
  siteId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  totalFloors: { type: Number, required: true }
})
BuildingSchema.plugin(tenantIsolationPlugin)
BuildingSchema.plugin(softDeletePlugin)
BuildingSchema.plugin(auditLogPlugin)

const FloorSchema = new Schema<IFloor>({
  buildingId: { type: String, required: true, index: true },
  floorNumber: { type: Number, required: true },
  status: { type: String, enum: ['In Progress', 'Completed', 'Pending'], default: 'Pending' }
})
FloorSchema.plugin(tenantIsolationPlugin)
FloorSchema.plugin(softDeletePlugin)
FloorSchema.plugin(auditLogPlugin)

const UnitSchema = new Schema<IUnit>({
  floorId: { type: String, required: true, index: true },
  unitNumber: { type: String, required: true },
  areaSqFt: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Framing', 'Finished', 'Inspected'], default: 'Draft' }
})
UnitSchema.plugin(tenantIsolationPlugin)
UnitSchema.plugin(softDeletePlugin)
UnitSchema.plugin(auditLogPlugin)

const MilestoneSchema = new Schema<IMilestone>({
  projectId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false }
})
MilestoneSchema.plugin(tenantIsolationPlugin)
MilestoneSchema.plugin(softDeletePlugin)
MilestoneSchema.plugin(auditLogPlugin)

const TaskSchema = new Schema<ITask>({
  projectId: { type: String, required: true, index: true },
  milestoneId: { type: String },
  title: { type: String, required: true },
  assigneeId: { type: String },
  status: { type: String, enum: ['Todo', 'In Progress', 'Blocked', 'Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  startDate: { type: Date },
  endDate: { type: Date }
})
TaskSchema.plugin(tenantIsolationPlugin)
TaskSchema.plugin(softDeletePlugin)
TaskSchema.plugin(auditLogPlugin)
TaskSchema.index({ projectId: 1, status: 1 })

const ScheduleSchema = new Schema<ISchedule>({
  projectId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  tasks: { type: [String], default: [] }
})
ScheduleSchema.plugin(tenantIsolationPlugin)
ScheduleSchema.plugin(softDeletePlugin)
ScheduleSchema.plugin(auditLogPlugin)

const CalendarSchema = new Schema<ICalendar>({
  projectId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  eventDate: { type: Date, required: true }
})
CalendarSchema.plugin(tenantIsolationPlugin)
CalendarSchema.plugin(softDeletePlugin)
CalendarSchema.plugin(auditLogPlugin)

// ==========================================
// 4. MODEL EXPORTS
// ==========================================
export const Project = model<IProject>('Project', ProjectSchema)
export const Site = model<ISite>('Site', SiteSchema)
export const Building = model<IBuilding>('Building', BuildingSchema)
export const Floor = model<IFloor>('Floor', FloorSchema)
export const Unit = model<IUnit>('Unit', UnitSchema)
export const Milestone = model<IMilestone>('Milestone', MilestoneSchema)
export const Task = model<ITask>('Task', TaskSchema)
export const Schedule = model<ISchedule>('Schedule', ScheduleSchema)
export const Calendar = model<ICalendar>('Calendar', CalendarSchema)
