import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  code: string;
  name: string;
  priceMonthlyINR: number;
  priceYearlyINR: number;
  features: {
    maxProjects: number;
    maxUsers: number;
    maxStorageGB: number;
    aiTokensMonthly: number;
    ocrCreditsMonthly: number;
    hasApiAccess: boolean;
    hasSSO: boolean;
    hasWhiteLabel: boolean;
  };
}

const PlanSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true }, // e.g., 'STARTER', 'PROFESSIONAL'
  name: { type: String, required: true },
  priceMonthlyINR: { type: Number, required: true },
  priceYearlyINR: { type: Number, required: true },
  features: {
    maxProjects: { type: Number, default: 0 }, // -1 for unlimited
    maxUsers: { type: Number, default: 0 },
    maxStorageGB: { type: Number, default: 0 },
    aiTokensMonthly: { type: Number, default: 0 },
    ocrCreditsMonthly: { type: Number, default: 0 },
    hasApiAccess: { type: Boolean, default: false },
    hasSSO: { type: Boolean, default: false },
    hasWhiteLabel: { type: Boolean, default: false },
  }
}, { timestamps: true });

export const Plan = mongoose.model<IPlan>('Plan', PlanSchema);

// Initial Seed Data representation
export const DEFAULT_PLANS = [
  {
    code: 'FREE_TRIAL',
    name: 'Free Trial',
    priceMonthlyINR: 0,
    priceYearlyINR: 0,
    features: { maxProjects: 1, maxUsers: 3, maxStorageGB: 5, aiTokensMonthly: 1000, ocrCreditsMonthly: 50, hasApiAccess: false, hasSSO: false, hasWhiteLabel: false }
  },
  {
    code: 'STARTER',
    name: 'Starter',
    priceMonthlyINR: 999,
    priceYearlyINR: 9999,
    features: { maxProjects: 5, maxUsers: 10, maxStorageGB: 50, aiTokensMonthly: 10000, ocrCreditsMonthly: 500, hasApiAccess: false, hasSSO: false, hasWhiteLabel: false }
  },
  {
    code: 'PROFESSIONAL',
    name: 'Professional',
    priceMonthlyINR: 2999,
    priceYearlyINR: 29999,
    features: { maxProjects: 25, maxUsers: 50, maxStorageGB: 500, aiTokensMonthly: 100000, ocrCreditsMonthly: 5000, hasApiAccess: true, hasSSO: false, hasWhiteLabel: false }
  },
  {
    code: 'BUSINESS',
    name: 'Business',
    priceMonthlyINR: 7999,
    priceYearlyINR: 79999,
    features: { maxProjects: -1, maxUsers: 250, maxStorageGB: 2000, aiTokensMonthly: 500000, ocrCreditsMonthly: 20000, hasApiAccess: true, hasSSO: true, hasWhiteLabel: false }
  },
  {
    code: 'ENTERPRISE',
    name: 'Enterprise',
    priceMonthlyINR: 24999,
    priceYearlyINR: 249990,
    features: { maxProjects: -1, maxUsers: -1, maxStorageGB: 10000, aiTokensMonthly: 5000000, ocrCreditsMonthly: 100000, hasApiAccess: true, hasSSO: true, hasWhiteLabel: true }
  }
];
