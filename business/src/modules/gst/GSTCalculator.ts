import { config } from '../../config/env';

export interface TaxBreakdown {
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  isInterState: boolean;
}

export class GSTCalculator {
  static readonly SOFTWARE_SAC_CODE = '997331';
  static readonly GST_RATE = 0.18; // 18%

  /**
   * Calculate GST based on the customer's state
   */
  static calculateTax(amount: number, customerStateCode?: string): TaxBreakdown {
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const isInterState = customerStateCode ? customerStateCode !== config.gst.companyStateCode : true;

    if (isInterState) {
      igst = amount * this.GST_RATE;
    } else {
      cgst = amount * (this.GST_RATE / 2);
      sgst = amount * (this.GST_RATE / 2);
    }

    const totalTax = cgst + sgst + igst;

    return {
      taxableAmount: amount,
      cgst: Number(cgst.toFixed(2)),
      sgst: Number(sgst.toFixed(2)),
      igst: Number(igst.toFixed(2)),
      totalTax: Number(totalTax.toFixed(2)),
      grandTotal: Number((amount + totalTax).toFixed(2)),
      isInterState
    };
  }

  /**
   * Basic validation for 15 digit Indian GSTIN
   */
  static validateGSTIN(gstin: string): boolean {
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return regex.test(gstin);
  }
}
