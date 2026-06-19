import mongoose, { Schema } from 'mongoose'

// Multi-tenant isolation plugin
export function tenantIsolationPlugin(schema: Schema) {
  schema.add({
    tenantId: {
      type: String,
      required: true,
      index: true
    }
  })

  // Enforce query filters
  schema.pre('find', function(next) {
    const query = this.getQuery()
    if (query && !query.tenantId && (this as any)._tenantId) {
      this.where({ tenantId: (this as any)._tenantId })
    }
    next()
  })

  schema.pre('findOne', function(next) {
    const query = this.getQuery()
    if (query && !query.tenantId && (this as any)._tenantId) {
      this.where({ tenantId: (this as any)._tenantId })
    }
    next()
  })
}

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildspace-ai'
  
  mongoose.connection.on('connected', () => {
    console.log('MongoDB Atlas connection successfully established.')
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected.')
  })

  await mongoose.connect(mongoUri, {
    autoIndex: true,
  })
}

export default connectDatabase
