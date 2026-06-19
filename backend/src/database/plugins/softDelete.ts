import { Schema } from 'mongoose'

export interface SoftDeleteDocument {
  isDeleted: boolean
  deletedAt?: Date | null
  deletedBy?: string | null
  isArchived: boolean
  archivedAt?: Date | null
  softDelete(userId?: string): Promise<any>
  restore(): Promise<any>
  archive(): Promise<any>
}

export function softDeletePlugin(schema: Schema) {
  // 1. Add fields to schema
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    deletedBy: {
      type: String,
      default: null
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },
    archivedAt: {
      type: Date,
      default: null
    }
  })

  // 2. Query hooks - Filter out deleted items by default
  const queryMethods = ['find', 'findOne', 'countDocuments', 'estimatedDocumentCount', 'update', 'updateOne', 'updateMany', 'findOneAndUpdate']
  
  queryMethods.forEach((method) => {
    schema.pre(method as any, function (this: any, next) {
      const options = this.getOptions()
      if (options && (options.withDeleted || options.withArchived)) {
        return next()
      }
      
      const filter = this.getFilter()
      if (filter && (filter.isDeleted !== undefined || filter.isArchived !== undefined)) {
        return next()
      }
      
      this.where({ isDeleted: { $ne: true }, isArchived: { $ne: true } })
      next()
    })
  })

  // 3. Document methods
  schema.methods.softDelete = async function (this: any, userId?: string): Promise<any> {
    this.isDeleted = true
    this.deletedAt = new Date()
    if (userId) {
      this.deletedBy = userId
    }
    return this.save()
  }

  schema.methods.restore = async function (this: any): Promise<any> {
    this.isDeleted = false
    this.deletedAt = null
    this.deletedBy = null
    this.isArchived = false
    this.archivedAt = null
    return this.save()
  }

  schema.methods.archive = async function (this: any): Promise<any> {
    this.isArchived = true
    this.archivedAt = new Date()
    return this.save()
  }
}

export default softDeletePlugin
