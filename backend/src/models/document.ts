import { Schema, model, Document } from 'mongoose'
import { tenantIsolationPlugin } from '../database/plugins/tenantIsolation'
import { softDeletePlugin, SoftDeleteDocument } from '../database/plugins/softDelete'
import { auditLogPlugin, AuditLogDocument } from '../database/plugins/auditLog'

// ==========================================
// 1. MONGOOSE INTERFACES
// ==========================================
export interface IFolder extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId?: string
  name: string
  parentId?: string | null
}

export interface IFile extends Document, SoftDeleteDocument, AuditLogDocument {
  folderId?: string | null
  name: string
  url: string
  fileType: string
  fileSize: string // e.g. "385 KB"
}

export interface IBlueprint extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  title: string
  drawingNumber: string
  revisionNumber: string
  fileUrl: string
  thumbnailUrl?: string
}

export interface IContract extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  title: string
  partyName: string
  value: number
  status: 'Draft' | 'Active' | 'Expired' | 'Terminated'
  fileUrl: string
}

export interface IBoqItem extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  itemNumber: string
  description: string
  unit: string
  rate: number
  qty: number
  amount: number
}

export interface IPermit extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  title: string
  permitNumber: string
  authorityName: string
  status: 'Pending' | 'Approved' | 'Expired'
  expiryDate: Date
  fileUrl: string
}

export interface ICertificate extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  issuedTo: string
  issuedDate: Date
  expiryDate?: Date
  status: 'Active' | 'Warning' | 'Expired'
}

export interface IOcrResult extends Document, SoftDeleteDocument, AuditLogDocument {
  fileId: string
  rawText: string
  parsedMetadata: Record<string, any>
  processedAt: Date
}

// ==========================================
// 2. MONGOOSE SCHEMAS
// ==========================================
const FolderSchema = new Schema<IFolder>({
  projectId: { type: String, index: true },
  name: { type: String, required: true },
  parentId: { type: String, default: null }
})
FolderSchema.plugin(tenantIsolationPlugin)
FolderSchema.plugin(softDeletePlugin)
FolderSchema.plugin(auditLogPlugin)
FolderSchema.index({ tenantId: 1, projectId: 1, name: 1 })

const FileSchema = new Schema<IFile>({
  folderId: { type: String, default: null, index: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: String, required: true }
})
FileSchema.plugin(tenantIsolationPlugin)
FileSchema.plugin(softDeletePlugin)
FileSchema.plugin(auditLogPlugin)

const BlueprintSchema = new Schema<IBlueprint>({
  projectId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  drawingNumber: { type: String, required: true },
  revisionNumber: { type: String, default: "Rev 0" },
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String }
})
BlueprintSchema.plugin(tenantIsolationPlugin)
BlueprintSchema.plugin(softDeletePlugin)
BlueprintSchema.plugin(auditLogPlugin)
BlueprintSchema.index({ projectId: 1, drawingNumber: 1 }, { unique: true })

const ContractSchema = new Schema<IContract>({
  projectId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  partyName: { type: String, required: true },
  value: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Active', 'Expired', 'Terminated'], default: 'Draft' },
  fileUrl: { type: String, required: true }
})
ContractSchema.plugin(tenantIsolationPlugin)
ContractSchema.plugin(softDeletePlugin)
ContractSchema.plugin(auditLogPlugin)

const BoqItemSchema = new Schema<IBoqItem>({
  projectId: { type: String, required: true, index: true },
  itemNumber: { type: String, required: true },
  description: { type: String, required: true },
  unit: { type: String, required: true },
  rate: { type: Number, required: true },
  qty: { type: Number, required: true },
  amount: { type: Number, required: true }
})
BoqItemSchema.plugin(tenantIsolationPlugin)
BoqItemSchema.plugin(softDeletePlugin)
BoqItemSchema.plugin(auditLogPlugin)
BoqItemSchema.index({ projectId: 1, itemNumber: 1 }, { unique: true })

const PermitSchema = new Schema<IPermit>({
  projectId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  permitNumber: { type: String, required: true },
  authorityName: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Expired'], default: 'Pending' },
  expiryDate: { type: Date, required: true },
  fileUrl: { type: String, required: true }
})
PermitSchema.plugin(tenantIsolationPlugin)
PermitSchema.plugin(softDeletePlugin)
PermitSchema.plugin(auditLogPlugin)

const CertificateSchema = new Schema<ICertificate>({
  name: { type: String, required: true },
  issuedTo: { type: String, required: true },
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date },
  status: { type: String, enum: ['Active', 'Warning', 'Expired'], default: 'Active' }
})
CertificateSchema.plugin(tenantIsolationPlugin)
CertificateSchema.plugin(softDeletePlugin)
CertificateSchema.plugin(auditLogPlugin)

const OcrResultSchema = new Schema<IOcrResult>({
  fileId: { type: String, required: true, unique: true, index: true },
  rawText: { type: String, required: true },
  parsedMetadata: { type: Schema.Types.Mixed, default: {} },
  processedAt: { type: Date, default: Date.now }
})
OcrResultSchema.plugin(tenantIsolationPlugin)
OcrResultSchema.plugin(softDeletePlugin)
OcrResultSchema.plugin(auditLogPlugin)

// ==========================================
// 3. MODEL EXPORTS
// ==========================================
export const Folder = model<IFolder>('Folder', FolderSchema)
export const File = model<IFile>('File', FileSchema)
export const Blueprint = model<IBlueprint>('Blueprint', BlueprintSchema)
export const Contract = model<IContract>('Contract', ContractSchema)
export const BoqItem = model<IBoqItem>('BoqItem', BoqItemSchema)
export const Permit = model<IPermit>('Permit', PermitSchema)
export const Certificate = model<ICertificate>('Certificate', CertificateSchema)
export const OcrResult = model<IOcrResult>('OcrResult', OcrResultSchema)
