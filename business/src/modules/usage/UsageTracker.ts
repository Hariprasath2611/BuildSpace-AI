import mongoose, { Schema, Document } from 'mongoose';
import { SubscriptionService } from '../subscriptions/SubscriptionService';

export interface IUsage extends Document {
  tenantId: string;
  monthYear: string; // e.g., '2026-06'
  metrics: {
    usersCount: number;
    projectsCount: number;
    storageUsedGB: number;
    aiTokensUsed: number;
    ocrCreditsUsed: number;
  };
}

const UsageSchema: Schema = new Schema({
  tenantId: { type: String, required: true },
  monthYear: { type: String, required: true },
  metrics: {
    usersCount: { type: Number, default: 0 },
    projectsCount: { type: Number, default: 0 },
    storageUsedGB: { type: Number, default: 0 },
    aiTokensUsed: { type: Number, default: 0 },
    ocrCreditsUsed: { type: Number, default: 0 },
  }
}, { timestamps: true });

UsageSchema.index({ tenantId: 1, monthYear: 1 }, { unique: true });

export const Usage = mongoose.model<IUsage>('Usage', UsageSchema);

export class UsageTracker {
  static async getCurrentUsage(tenantId: string): Promise<IUsage> {
    const date = new Date();
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    let usage = await Usage.findOne({ tenantId, monthYear });
    if (!usage) {
      usage = await Usage.create({ tenantId, monthYear });
    }
    return usage;
  }

  static async incrementMetric(tenantId: string, metric: keyof IUsage['metrics'], amount: number = 1): Promise<void> {
    const date = new Date();
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    await Usage.findOneAndUpdate(
      { tenantId, monthYear },
      { $inc: { [`metrics.${metric}`]: amount } },
      { upsert: true, new: true }
    );
  }

  static async verifyQuota(tenantId: string, metric: 'aiTokensMonthly' | 'ocrCreditsMonthly'): Promise<boolean> {
    const usage = await this.getCurrentUsage(tenantId);
    
    // Check against plan limit
    const limit = await SubscriptionService.checkFeatureAccess(tenantId, metric) as number;
    
    if (limit === -1) return true; // Unlimited
    
    const used = metric === 'aiTokensMonthly' ? usage.metrics.aiTokensUsed : usage.metrics.ocrCreditsUsed;
    
    return used < limit;
  }
}
