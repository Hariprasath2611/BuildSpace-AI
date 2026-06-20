import axios from 'axios';
import { config } from '../../../config/env';

// Wrapper for Cashfree PG integration
export class CashfreeAdapter {
  private baseURL: string;

  constructor() {
    this.baseURL = config.cashfree.env === 'PRODUCTION' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';
  }

  private getHeaders() {
    return {
      'x-client-id': config.cashfree.appId,
      'x-client-secret': config.cashfree.secretKey,
      'x-api-version': '2022-09-01',
      'Content-Type': 'application/json',
    };
  }

  async createOrder(orderId: string, amountINR: number, customerDetails: any): Promise<any> {
    const payload = {
      order_id: orderId,
      order_amount: amountINR,
      order_currency: 'INR',
      customer_details: customerDetails,
      order_meta: {
        return_url: `https://app.buildspace.ai/billing/cf-return?order_id=${orderId}`
      }
    };

    const response = await axios.post(`${this.baseURL}/orders`, payload, {
      headers: this.getHeaders()
    });

    return response.data;
  }

  async verifyOrder(orderId: string): Promise<any> {
    const response = await axios.get(`${this.baseURL}/orders/${orderId}`, {
      headers: this.getHeaders()
    });
    
    return response.data;
  }
}

export const cashfreeAdapter = new CashfreeAdapter();
