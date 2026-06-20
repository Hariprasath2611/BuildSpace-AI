import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../../../config/env';

export class RazorpayAdapter {
  private instance: Razorpay;

  constructor() {
    this.instance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }

  async createOrder(amountINR: number, receiptId: string, notes: any = {}): Promise<any> {
    const options = {
      amount: Math.round(amountINR * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: receiptId,
      notes,
    };
    
    return this.instance.orders.create(options);
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
      
    return generatedSignature === signature;
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', config.razorpay.webhookSecret)
      .update(payload)
      .digest('hex');
      
    return generatedSignature === signature;
  }

  async fetchPaymentDetails(paymentId: string): Promise<any> {
    return this.instance.payments.fetch(paymentId);
  }
}

export const razorpayAdapter = new RazorpayAdapter();
