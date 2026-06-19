import { Schema, model, Document } from 'mongoose'
import { tenantIsolationPlugin } from '../database/plugins/tenantIsolation'
import { softDeletePlugin, SoftDeleteDocument } from '../database/plugins/softDelete'
import { auditLogPlugin, AuditLogDocument } from '../database/plugins/auditLog'

// ==========================================
// 1. MONGOOSE INTERFACES
// ==========================================
export interface IInspection extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  inspectorId: string
  checklistName: string
  score: number
  status: 'Passed' | 'Failed' | 'Pending'
}

export interface IQualityReport extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  inspectorId: string
  materialId?: string
  checkName: string
  status: 'Approved' | 'Rejected'
  date: Date
}

export interface ISafetyObservation extends Document, SoftDeleteDocument, AuditLogDocument {
  title: string
  description: string
  severity: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'Resolved'
}

export interface ISafetyIncident extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  title: string
  severity: 'NearMiss' | 'Minor' | 'Major' | 'Fatal'
  status: 'Investigating' | 'Closed'
  loggedAt: Date
  witnessStatements?: Array<{ witness: string; statement: string }>
}

export interface IPpeRecord extends Document, SoftDeleteDocument, AuditLogDocument {
  employeeId: string
  itemType: string
  issueDate: Date
  expiryDate?: Date
  status: 'Assigned' | 'Returned' | 'Damaged'
}

export interface IRiskAssessment extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  taskName: string
  potentialHazards: string[]
  riskScore: number
  mitigationStrategy: string
}

// ==========================================
// 2. MONGOOSE SCHEMAS
// ==========================================
const InspectionSchema = new Schema<IInspection>({
  projectId: { type: String, required: true, index: true },
  inspectorId: { type: String, required: true },
  checklistName: { type: String, required: true },
  score: { type: Number, required: true },
  status: { type: String, enum: ['Passed', 'Failed', 'Pending'], default: 'Pending' }
})
InspectionSchema.plugin(tenantIsolationPlugin)
InspectionSchema.plugin(softDeletePlugin)
InspectionSchema.plugin(auditLogPlugin)

const QualityReportSchema = new Schema<IQualityReport>({
  projectId: { type: String, required: true, index: true },
  inspectorId: { type: String, required: true },
  materialId: { type: String },
  checkName: { type: String, required: true },
  status: { type: String, enum: ['Approved', 'Rejected'], required: true },
  date: { type: Date, default: Date.now }
})
QualityReportSchema.plugin(tenantIsolationPlugin)
QualityReportSchema.plugin(softDeletePlugin)
QualityReportSchema.plugin(auditLogPlugin)

const SafetyObservationSchema = new Schema<ISafetyObservation>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' }
})
SafetyObservationSchema.plugin(tenantIsolationPlugin)
SafetyObservationSchema.plugin(softDeletePlugin)
SafetyObservationSchema.plugin(auditLogPlugin)
SafetyObservationSchema.index({ tenantId: 1, status: 1 })

const SafetyIncidentSchema = new Schema<ISafetyIncident>({
  projectId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  severity: { type: String, enum: ['NearMiss', 'Minor', 'Major', 'Fatal'], required: true },
  status: { type: String, enum: ['Investigating', 'Closed'], default: 'Investigating' },
  loggedAt: { type: Date, default: Date.now },
  witnessStatements: [
    {
      witness: { type: String, required: true },
      statement: { type: String, required: true }
    }
  ]
})
SafetyIncidentSchema.plugin(tenantIsolationPlugin)
SafetyIncidentSchema.plugin(softDeletePlugin)
SafetyIncidentSchema.plugin(auditLogPlugin)

const PpeRecordSchema = new Schema<IPpeRecord>({
  employeeId: { type: String, required: true, index: true },
  itemType: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date },
  status: { type: String, enum: ['Assigned', 'Returned', 'Damaged'], default: 'Assigned' }
})
PpeRecordSchema.plugin(tenantIsolationPlugin)
PpeRecordSchema.plugin(softDeletePlugin)
PpeRecordSchema.plugin(auditLogPlugin)

const RiskAssessmentSchema = new Schema<IRiskAssessment>({
  projectId: { type: String, required: true, index: true },
  taskName: { type: String, required: true },
  potentialHazards: { type: [String], required: true },
  riskScore: { type: Number, required: true },
  mitigationStrategy: { type: String, required: true }
})
RiskAssessmentSchema.plugin(tenantIsolationPlugin)
RiskAssessmentSchema.plugin(softDeletePlugin)
RiskAssessmentSchema.plugin(auditLogPlugin)

// ==========================================
// 3. MODEL EXPORTS
// ==========================================
export const Inspection = model<IInspection>('Inspection', InspectionSchema)
export const QualityReport = model<IQualityReport>('QualityReport', QualityReportSchema)
export const SafetyObservation = model<ISafetyObservation>('SafetyObservation', SafetyObservationSchema)
export const SafetyIncident = model<ISafetyIncident>('SafetyIncident', SafetyIncidentSchema)
export const PpeRecord = model<IPpeRecord>('PpeRecord', PpeRecordSchema)
export const RiskAssessment = model<IRiskAssessment>('RiskAssessment', RiskAssessmentSchema)
