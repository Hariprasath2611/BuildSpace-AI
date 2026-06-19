import {
  Organization,
  Company,
  User,
  Project,
  Workforce,
  Material,
  SafetyObservation,
  Budget,
  Expense,
  Invoice,
  FeatureFlag,
  SystemSetting
} from '../models'

export async function runCompleteDatabaseSeeding(): Promise<void> {
  try {
    const orgCount = await Organization.countDocuments()
    if (orgCount > 0) return

    console.log('Commencing complete BuildSpace AI database layer seeding...')

    // 1. Seed Organizations
    const defaultOrg = new Organization({
      _id: 'tenant-org-01',
      name: 'Apex General Contractors',
      status: 'active',
      domain: 'apex.com'
    })
    await defaultOrg.save()

    const secondaryOrg = new Organization({
      _id: 'tenant-org-02',
      name: 'Matrix Development Corp',
      status: 'active',
      domain: 'matrix.com'
    })
    await secondaryOrg.save()

    // 2. Seed Companies
    const defaultCompany = new Company({
      _id: 'company-01',
      organizationId: 'tenant-org-01',
      name: 'Apex Construction Services LLC',
      taxId: 'TX-9090-AAA',
      industry: 'Infrastructure Construction',
      tenantId: 'tenant-org-01'
    })
    await defaultCompany.save()

    // 3. Seed Users
    await User.insertMany([
      {
        email: 'd.hariprasath@apex.com',
        name: 'D. Hariprasath',
        role: 'Admin',
        phone: '+919876543210',
        tenantId: 'tenant-org-01'
      },
      {
        email: 'robert.dow@apex.com',
        name: 'Robert Dow',
        role: 'Superintendent',
        tenantId: 'tenant-org-01'
      },
      {
        email: 'kyle.safety@apex.com',
        name: 'Officer Kyle',
        role: 'EHS Manager',
        tenantId: 'tenant-org-01'
      }
    ])

    // 4. Seed Projects
    await Project.insertMany([
      {
        _id: 'proj-01',
        name: 'Tower A Residences',
        location: 'Bengaluru, India',
        budget: '$45.2M',
        progress: 78,
        hazards: 0,
        tenantId: 'tenant-org-01'
      },
      {
        _id: 'proj-02',
        name: 'APEX Commercial Hub',
        location: 'San Jose, CA',
        budget: '$124.0M',
        progress: 45,
        hazards: 1,
        tenantId: 'tenant-org-01'
      },
      {
        _id: 'proj-03',
        name: 'Metro Line Underground',
        location: 'Mumbai, India',
        budget: '$210.5M',
        progress: 12,
        hazards: 4,
        tenantId: 'tenant-org-01'
      }
    ])

    // 5. Seed Workforce
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

    // 6. Seed Materials Inventory
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

    // 7. Seed Safety Observations
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

    // 8. Seed Finance (Budgets, Expenses, Invoices)
    await Budget.insertMany([
      {
        projectId: 'proj-01',
        totalBudget: 45200000,
        allocated: 35000000,
        spent: 31000000,
        contingency: 4000000,
        tenantId: 'tenant-org-01'
      },
      {
        projectId: 'proj-02',
        totalBudget: 124000000,
        allocated: 95000000,
        spent: 80000000,
        contingency: 10000000,
        tenantId: 'tenant-org-01'
      }
    ])

    await Expense.insertMany([
      {
        projectId: 'proj-01',
        category: 'Concrete Pouring Materials',
        amount: 850000,
        description: 'Ready-mix batch delivery to site sector A.',
        status: 'Paid',
        date: new Date('2026-06-01'),
        tenantId: 'tenant-org-01'
      },
      {
        projectId: 'proj-01',
        category: 'Crane Operator Equipment Hire',
        amount: 45000,
        description: 'Double shift crane lease charges.',
        status: 'Paid',
        date: new Date('2026-06-05'),
        tenantId: 'tenant-org-01'
      }
    ])

    await Invoice.insertMany([
      {
        projectId: 'proj-01',
        invoiceNumber: 'INV-2026-001',
        clientName: 'Downtown Highrise Authority',
        amount: 1500000,
        taxAmount: 270000,
        totalAmount: 1770000,
        status: 'Paid',
        dueDate: new Date('2026-06-15'),
        tenantId: 'tenant-org-01'
      }
    ])

    // 9. Seed System Configurations
    const defaultFlag = new FeatureFlag({
      key: 'digital-twin-rendering',
      description: 'Enables WebGL/ThreeJS digital twin blueprint rendering views.',
      isEnabled: true,
      tenantId: 'tenant-org-01'
    })
    await defaultFlag.save()

    const defaultSetting = new SystemSetting({
      settingKey: 'automatic-rca-generation',
      settingValue: 'enabled',
      description: 'Auto-analyze EHS incident reports and write five-whys transcripts via AI model.',
      tenantId: 'tenant-org-01'
    })
    await defaultSetting.save()

    console.log('BuildSpace AI database layer seeding successfully completed!')
  } catch (err) {
    console.error('Seeding process halted with unhandled exception:', err)
  }
}

export default runCompleteDatabaseSeeding
