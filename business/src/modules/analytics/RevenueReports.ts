import { Subscription } from '../subscriptions/SubscriptionService';
import { Plan } from '../plans/models/Plan';

export class RevenueReports {
  /**
   * Calculate Monthly Recurring Revenue (MRR)
   */
  static async calculateMRR(): Promise<number> {
    // Join subscriptions with plan to sum up the monthly prices of all active subscriptions
    const activeSubs = await Subscription.find({ status: 'active' }).populate('planId');
    
    let mrr = 0;
    activeSubs.forEach((sub: any) => {
      const plan = sub.planId;
      if (sub.billingCycle === 'monthly') {
        mrr += plan.priceMonthlyINR;
      } else if (sub.billingCycle === 'yearly') {
        mrr += (plan.priceYearlyINR / 12); // Amortize yearly over 12 months for MRR
      }
    });

    return mrr;
  }

  /**
   * Calculate Annual Recurring Revenue (ARR)
   */
  static async calculateARR(): Promise<number> {
    const mrr = await this.calculateMRR();
    return mrr * 12;
  }

  /**
   * Calculate basic churn rate (canceled subscriptions / total active at start of period)
   * A simplistic implementation.
   */
  static async calculateChurnRate(days: number = 30): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const totalActiveStart = await Subscription.countDocuments({ 
      status: 'active', 
      createdAt: { $lt: startDate } 
    });

    if (totalActiveStart === 0) return 0;

    const canceledInPeriod = await Subscription.countDocuments({ 
      status: 'canceled', 
      updatedAt: { $gte: startDate } 
    });

    return (canceledInPeriod / totalActiveStart) * 100; // Percentage
  }
}
