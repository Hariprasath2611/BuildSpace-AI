import axios from 'axios';

// Adapter for Meta WhatsApp Cloud API
export class WhatsAppAdapter {
  private static readonly API_URL = 'https://graph.facebook.com/v19.0';
  private token: string;
  private phoneNumberId: string;

  constructor() {
    this.token = process.env.WHATSAPP_TOKEN || 'mock_whatsapp_token';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_ID || 'mock_phone_id';
  }

  async sendInvoiceNotification(toNumber: string, invoiceUrl: string, customerName: string): Promise<any> {
    const payload = {
      messaging_product: 'whatsapp',
      to: toNumber,
      type: 'template',
      template: {
        name: 'invoice_ready',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: customerName }
            ]
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [
              { type: 'text', text: invoiceUrl } // Deep link to invoice PDF
            ]
          }
        ]
      }
    };

    try {
      if (process.env.NODE_ENV !== 'test') {
        const response = await axios.post(`${WhatsAppAdapter.API_URL}/${this.phoneNumberId}/messages`, payload, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      }
      console.log(`[MOCK] WhatsApp invoice sent to ${toNumber}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to send WhatsApp message', error);
      throw error;
    }
  }
}

export const whatsappAdapter = new WhatsAppAdapter();
