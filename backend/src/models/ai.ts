import { Schema, model, Document } from 'mongoose'
import { z } from 'zod'
import { tenantIsolationPlugin } from '../database/plugins/tenantIsolation'
import { softDeletePlugin, SoftDeleteDocument } from '../database/plugins/softDelete'
import { auditLogPlugin, AuditLogDocument } from '../database/plugins/auditLog'

// ==========================================
// 1. MONGOOSE INTERFACES
// ==========================================
export interface IAiPrediction extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId: string
  modelName: string
  targetField: string // e.g. "delayDays" or "contingencyBudget"
  predictionValue: string
  confidenceScore: number // e.g. 0.92 for 92% confidence
  inputParameters: Record<string, any>
  createdAtDate: Date
}

export interface IAiConversation extends Document, SoftDeleteDocument, AuditLogDocument {
  userId: string
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
  }>
}

export interface IAiPrompt extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  promptTemplate: string
  variables: string[]
  category: 'Safety' | 'Contracts' | 'Scheduling' | 'Finance'
}

export interface IAiEmbedding extends Document, SoftDeleteDocument, AuditLogDocument {
  sourceId: string // Reference ID to blueprint, contract, files, drawing etc.
  sourceType: 'Blueprint' | 'Contract' | 'File' | 'QnA'
  vector: number[] // Vector embedding array (e.g. size 1536 for OpenAI text-embedding-3-small)
  textChunk: string // raw text fragment corresponding to vector
}

export interface IKnowledgeBase extends Document, SoftDeleteDocument, AuditLogDocument {
  category: string // e.g. "OSHA Safety Code", "IS Standards"
  title: string
  content: string
  sourceUrl?: string
}

// ==========================================
// 2. MONGOOSE SCHEMAS
// ==========================================
const AiPredictionSchema = new Schema<IAiPrediction>({
  projectId: { type: String, required: true, index: true },
  modelName: { type: String, required: true },
  targetField: { type: String, required: true },
  predictionValue: { type: String, required: true },
  confidenceScore: { type: Number, required: true },
  inputParameters: { type: Schema.Types.Mixed, default: {} },
  createdAtDate: { type: Date, default: Date.now }
})
AiPredictionSchema.plugin(tenantIsolationPlugin)
AiPredictionSchema.plugin(softDeletePlugin)
AiPredictionSchema.plugin(auditLogPlugin)

const AiConversationSchema = new Schema<IAiConversation>({
  userId: { type: String, required: true, index: true },
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
})
AiConversationSchema.plugin(tenantIsolationPlugin)
AiConversationSchema.plugin(softDeletePlugin)
AiConversationSchema.plugin(auditLogPlugin)

const AiPromptSchema = new Schema<IAiPrompt>({
  name: { type: String, required: true },
  promptTemplate: { type: String, required: true },
  variables: { type: [String], default: [] },
  category: { type: String, enum: ['Safety', 'Contracts', 'Scheduling', 'Finance'], required: true }
})
AiPromptSchema.plugin(tenantIsolationPlugin)
AiPromptSchema.plugin(softDeletePlugin)
AiPromptSchema.plugin(auditLogPlugin)
AiPromptSchema.index({ name: 1 }, { unique: true })

const AiEmbeddingSchema = new Schema<IAiEmbedding>({
  sourceId: { type: String, required: true, index: true },
  sourceType: { type: String, enum: ['Blueprint', 'Contract', 'File', 'QnA'], required: true },
  vector: { type: [Number], required: true },
  textChunk: { type: String, required: true }
})
AiEmbeddingSchema.plugin(tenantIsolationPlugin)
AiEmbeddingSchema.plugin(softDeletePlugin)
AiEmbeddingSchema.plugin(auditLogPlugin)
// Indexing vector search coordinates (MongoDB Atlas Vector Search setup helper)
AiEmbeddingSchema.index({ sourceType: 1, sourceId: 1 })

const KnowledgeBaseSchema = new Schema<IKnowledgeBase>({
  category: { type: String, required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sourceUrl: { type: String }
})
KnowledgeBaseSchema.plugin(tenantIsolationPlugin)
KnowledgeBaseSchema.plugin(softDeletePlugin)
KnowledgeBaseSchema.plugin(auditLogPlugin)
KnowledgeBaseSchema.index({ category: 1, title: 'text' })

// ==========================================
// 3. MODEL EXPORTS
// ==========================================
export const AiPrediction = model<IAiPrediction>('AiPrediction', AiPredictionSchema)
export const AiConversation = model<IAiConversation>('AiConversation', AiConversationSchema)
export const AiPrompt = model<IAiPrompt>('AiPrompt', AiPromptSchema)
export const AiEmbedding = model<IAiEmbedding>('AiEmbedding', AiEmbeddingSchema)
export const KnowledgeBase = model<IKnowledgeBase>('KnowledgeBase', KnowledgeBaseSchema)
