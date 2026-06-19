import mongoose, { Schema } from 'mongoose'

export interface TenantDocument extends mongoose.Document {
  tenantId: string
  companyId?: string | null
}

export function tenantIsolationPlugin(schema: Schema) {
  // 1. Add fields to schema
  schema.add({
    tenantId: {
      type: String,
      required: true,
      index: true
    },
    companyId: {
      type: String,
      default: null,
      index: true
    }
  })

  // 2. Query Hooks - Inject tenantId from schema context
  const queryMethods = ['find', 'findOne', 'countDocuments', 'update', 'updateOne', 'updateMany', 'findOneAndUpdate', 'findOneAndDelete', 'deleteOne', 'deleteMany']

  queryMethods.forEach((method) => {
    schema.pre(method as any, function (this: any, next) {
      const query = this.getQuery()
      
      // Extract tenant context injected into schema prototype during request lifecycle
      const activeTenantId = (mongoose.Schema.prototype as any)._tenantId
      const activeCompanyId = (mongoose.Schema.prototype as any)._companyId

      if (activeTenantId && query && !query.tenantId) {
        this.where({ tenantId: activeTenantId })
      }

      if (activeCompanyId && query && !query.companyId && schema.paths.companyId) {
        this.where({ companyId: activeCompanyId })
      }

      next()
    })
  })

  // 3. Document Save Validation Hook
  schema.pre('save', function (this: any, next) {
    const activeTenantId = (mongoose.Schema.prototype as any)._tenantId
    const activeCompanyId = (mongoose.Schema.prototype as any)._companyId

    if (activeTenantId && !this.tenantId) {
      this.tenantId = activeTenantId
    }

    if (activeCompanyId && !this.companyId && schema.paths.companyId) {
      this.companyId = activeCompanyId
    }

    if (!this.tenantId) {
      return next(new Error('Multi-Tenant Protection Violation: tenantId is required to save document.'))
    }

    next()
  })
}

export default tenantIsolationPlugin
