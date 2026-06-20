import mongoose, { Schema, Document } from 'mongoose';
import { Plan, IPlan } from '../plans/models/Plan';

export interface ISubscription extends Document {
  tenantId: string;
  planId: mongoose.Types.ObjectId | IPlan;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  billingCycle: 'monthly' | 'yearly';
  startDate: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

const SubscriptionSchema: Schema = new Schema({
  tenantId: { type: String, required: true, unique: true },
  planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  status: { type: String, enum: ['active', 'trialing', 'past_due', 'canceled', 'unpaid'], default: 'trialing' },
  billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  startDate: { type: Date, default: Date.now },
  currentPeriodEnd: { type: Date, required: true },
  cancelAtPeriodEnd: { type: Boolean, default: false }
}, { timestamps: true });

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export class SubscriptionService {
  /**
   * Start a 14-day free trial for a new tenant
   */
  static async startFreeTrial(tenantId: string): Promise<ISubscription> {
    const trialPlan = await Plan.findOne({ code: 'FREE_TRIAL' });
    if (!trialPlan) throw new Error('Trial plan not configured');

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 14 Days free trial

    const sub = new Subscription({
      tenantId,
      planId: trialPlan._id,
      status: 'trialing',
      billingCycle: 'monthly',
      currentPeriodEnd: endDate,
    });
    
    return sub.save();
  }

  /**
   * Upgrade or downgrade subscription
   */
  static async changeSubscription(tenantId: string, planCode: string, cycle: 'monthly' | 'yearly'): Promise<ISubscription> {
    const newPlan = await Plan.findOne({ code: planCode });
    if (!newPlan) throw new Error('Invalid plan code');

    let sub = await Subscription.findOne({ tenantId });
    if (!sub) throw new Error('Subscription not found');

    sub.planId = newPlan._id;
    sub.billingCycle = cycle;
    sub.status = 'active';
    
    const endDate = new Date();
    if (cycle === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);
    else endDate.setMonth(endDate.getMonth() + 1);
    
    sub.currentPeriodEnd = endDate;

    return sub.save();
  }

  /**
   * Check if tenant has access to a specific feature based on their plan
   */
  static async checkFeatureAccess(tenantId: string, featureKey: keyof IPlan['features']): Promise<boolean | number> {
    const sub = await Subscription.findOne({ tenantId }).populate('planId');
    if (!sub || sub.status !== 'active' && sub.status !== 'trialing') {
      return false;
    }
    const plan = sub.planId as IPlan;
    return plan.features[featureKey];
  }
}
