import { Schema, Document } from 'mongoose'

export interface AuditLogDocument extends Document {
  createdBy?: string | null
  updatedBy?: string | null
  deletedBy?: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  versionHistory?: Array<{
    version: number
    updatedBy?: string | null
    updatedAt: Date
    changes: Record<string, any>
  }>
}

export function auditLogPlugin(schema: Schema) {
  // 1. Add fields to schema
  schema.add({
    createdBy: {
      type: String,
      default: null,
      index: true
    },
    updatedBy: {
      type: String,
      default: null,
      index: true
    },
    deletedBy: {
      type: String,
      default: null,
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    deletedAt: {
      type: Date,
      default: null
    },
    versionHistory: {
      type: [
        {
          version: { type: Number, required: true },
          updatedBy: { type: String, default: null },
          updatedAt: { type: Date, default: Date.now },
          changes: { type: Schema.Types.Mixed, required: true }
        }
      ],
      default: []
    }
  })

  // 2. Pre-save hook to update timestamps and log history changes
  schema.pre('save', function (this: any, next) {
    const isNew = this.isNew
    this.updatedAt = new Date()

    if (!isNew) {
      const modifiedPaths = this.modifiedPaths()
      if (modifiedPaths.length > 0) {
        const changes: Record<string, any> = {}
        modifiedPaths.forEach((path: string) => {
          if (path !== 'updatedAt' && path !== 'versionHistory') {
            changes[path] = this.get(path)
          }
        })

        if (Object.keys(changes).length > 0) {
          const nextVersion = (this.versionHistory?.length || 0) + 1
          this.versionHistory.push({
            version: nextVersion,
            updatedBy: this.updatedBy || 'system',
            updatedAt: new Date(),
            changes
          })
        }
      }
    }
    next()
  })
}

export default auditLogPlugin
