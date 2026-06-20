import { Request, Response } from 'express';
import { razorpayAdapter } from '../payments/adapters/RazorpayAdapter';
import { SubscriptionService } from '../subscriptions/SubscriptionService';

export class PaymentWebhookHandler {
  static async handleRazorpayWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const rawBody = (req as any).rawBody; // Assumes raw body parser middleware is set

      if (!razorpayAdapter.verifyWebhookSignature(rawBody, signature)) {
        return res.status(400).send('Invalid signature');
      }

      const event = req.body.event;
      const payload = req.body.payload;

      switch (event) {
        case 'payment.captured':
          await PaymentWebhookHandler.processPaymentCaptured(payload.payment.entity);
          break;
        case 'subscription.charged':
          // Handle recurring subscription renewals
          await PaymentWebhookHandler.processSubscriptionCharged(payload.subscription.entity);
          break;
        case 'payment.failed':
          console.warn('Payment failed:', payload.payment.entity.id);
          break;
        default:
          console.log(`Unhandled event type: ${event}`);
      }

      res.status(200).send('Webhook processed');
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  private static async processPaymentCaptured(paymentEntity: any) {
    const tenantId = paymentEntity.notes?.tenantId;
    const planCode = paymentEntity.notes?.planCode;
    const cycle = paymentEntity.notes?.cycle;

    if (tenantId && planCode) {
      console.log(`Upgrading tenant ${tenantId} to ${planCode}`);
      await SubscriptionService.changeSubscription(tenantId, planCode, cycle || 'monthly');
      
      // We would also generate and send the invoice here.
    }
  }

  private static async processSubscriptionCharged(subscriptionEntity: any) {
    // Logic for auto-recurring payments (AutoPay/eMandate)
    console.log('Subscription auto-renewed:', subscriptionEntity.id);
  }
}
