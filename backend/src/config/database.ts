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

export async function seedDefaultData() {
  try {
    const { Organization, Project, Workforce, Material, SafetyObservation } = await import('../models/tenantModels')
    const count = await Organization.countDocuments()
    if (count > 0) return

    console.log('Seeding initial BuildSpace AI database collections...')

    // Seed default Org
    const defaultOrg = new Organization({
      _id: 'tenant-org-01',
      name: 'Apex General Contractors',
      status: 'active'
    })
    await defaultOrg.save()

    const altOrg = new Organization({
      _id: 'tenant-org-02',
      name: 'Matrix Industrial Development',
      status: 'active'
    })
    await altOrg.save()

    // Seed projects
    await Project.insertMany([
      {
        name: 'Tower A Residences',
        location: 'Bengaluru, India',
        budget: '$45.2M',
        progress: 78,
        hazards: 0,
        tenantId: 'tenant-org-01'
      },
      {
        name: 'APEX Commercial Hub',
        location: 'San Jose, CA',
        budget: '$124.0M',
        progress: 45,
        hazards: 1,
        tenantId: 'tenant-org-01'
      },
      {
        name: 'Metro Line Underground',
        location: 'Mumbai, India',
        budget: '$210.5M',
        progress: 12,
        hazards: 4,
        tenantId: 'tenant-org-01'
      }
    ])

    // Seed workers
    await Workforce.insertMany([
      {
        name: 'Robert Dow',
        trade: 'Superintendent',
        status: 'active',
        tenantId: 'tenant-org-01'
      },
      {
        name: 'James Key',
        trade: 'Steel Foreman',
        status: 'active',
        tenantId: 'tenant-org-01'
      },
      {
        name: 'Officer Kyle',
        trade: 'EHS Manager',
        status: 'active',
        tenantId: 'tenant-org-01'
      },
      {
        name: 'Linus Tech',
        trade: 'Electrical Lead',
        status: 'active',
        tenantId: 'tenant-org-01'
      }
    ])

    // Seed materials
    await Material.insertMany([
      {
        sku: 'CON-4000',
        name: 'Volumetric Concrete 4000 PSI',
        category: 'Concrete',
        currentStock: 450,
        maxStock: 2000,
        unit: 'CY',
        status: 'Optimal',
        tenantId: 'tenant-org-01'
      },
      {
        sku: 'STL-REBAR',
        name: 'Grade 60 Structural Rebar #4',
        category: 'Steel',
        currentStock: 12,
        maxStock: 150,
        unit: 'Tons',
        status: 'Reorder',
        tenantId: 'tenant-org-01'
      },
      {
        sku: 'SAF-NETTING',
        name: 'Perimeter Safety Mesh Orange',
        category: 'Safety PPE',
        currentStock: 85,
        maxStock: 100,
        unit: 'Rolls',
        status: 'Optimal',
        tenantId: 'tenant-org-01'
      }
    ])

    // Seed safety observations
    await SafetyObservation.insertMany([
      {
        title: 'Exposed live wires at Gate B scaffolding',
        description: 'Temporary scaffolding power line lacks insulation wrap.',
        severity: 'High',
        status: 'Open',
        tenantId: 'tenant-org-01'
      },
      {
        title: 'Unsecured high extension ladder',
        description: 'Scaffolding ladder in Zone A lacks anchoring pegs.',
        severity: 'Medium',
        status: 'Open',
        tenantId: 'tenant-org-01'
      }
    ])

    console.log('Database seeding successfully completed!')
  } catch (err) {
    console.error('Failed to seed default database records:', err)
  }
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

  // Trigger database auto-seeding
  await seedDefaultData()
}

export default connectDatabase
