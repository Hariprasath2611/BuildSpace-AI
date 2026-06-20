import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Organization, Company, User } from '../src/models/core';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildspace';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB for seeding...');

    // Clear existing
    await Organization.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({});

    // 1. Create Organizations (Tenants)
    const orgs = await Organization.insertMany([
      { name: 'Apex Builders', status: 'active', domain: 'apexbuilders.com' },
      { name: 'Larsen & Toubro Demo', status: 'active', domain: 'lntdemo.com' },
      { name: 'GMR Infra Mock', status: 'active', domain: 'gmrmock.com' }
    ]);

    console.log(`Created ${orgs.length} Organizations.`);

    // 2. Create Companies and Users for each Organization
    for (const org of orgs) {
      const orgId = org._id.toString();

      // Company
      await Company.create({
        organizationId: orgId,
        tenantId: orgId, // Injected by tenant plugin but good to be explicit
        name: `${org.name} Headquarters`,
        industry: 'Construction'
      });

      // Users
      await User.create([
        {
          email: `admin@${org.domain}`,
          name: `${org.name} Admin`,
          role: 'ADMIN',
          tenantId: orgId
        },
        {
          email: `pm@${org.domain}`,
          name: `Project Manager`,
          role: 'PROJECT_MANAGER',
          tenantId: orgId
        },
        {
          email: `safety@${org.domain}`,
          name: `Safety Officer`,
          role: 'SAFETY_OFFICER',
          tenantId: orgId
        }
      ]);
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
