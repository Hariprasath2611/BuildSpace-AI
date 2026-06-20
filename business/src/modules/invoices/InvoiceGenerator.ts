import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { TaxBreakdown } from '../gst/GSTCalculator';

export class InvoiceGenerator {
  static async generateGSTInvoice(
    invoiceNo: string,
    customerDetails: { name: string, gstin: string, address: string, stateCode: string },
    lineItems: { description: string, hsnSac: string, amount: number }[],
    taxBreakdown: TaxBreakdown,
    outputPath: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Header
      doc.fontSize(20).text('TAX INVOICE', { align: 'center' }).moveDown();
      doc.fontSize(10).text(`Invoice No: ${invoiceNo}`, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, { align: 'right' });

      // Company Info (Seller)
      doc.moveDown();
      doc.fontSize(12).text('BuildSpace AI Private Limited');
      doc.fontSize(10).text('GSTIN: 29XXXXXXXXXX1Z5');
      doc.text('Bangalore, Karnataka, India');

      // Customer Info
      doc.moveDown();
      doc.fontSize(12).text('Billed To:');
      doc.fontSize(10).text(customerDetails.name);
      if (customerDetails.gstin) {
        doc.text(`GSTIN/UIN: ${customerDetails.gstin}`);
      }
      doc.text(`State Code: ${customerDetails.stateCode}`);
      doc.text(customerDetails.address);

      // Line Items Table Header
      doc.moveDown(2);
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Description', 50, tableTop);
      doc.text('SAC/HSN', 250, tableTop);
      doc.text('Amount (INR)', 400, tableTop, { align: 'right' });
      doc.font('Helvetica');

      let yPos = tableTop + 20;

      // Items
      lineItems.forEach(item => {
        doc.text(item.description, 50, yPos);
        doc.text(item.hsnSac, 250, yPos);
        doc.text(item.amount.toFixed(2), 400, yPos, { align: 'right' });
        yPos += 20;
      });

      // Taxes
      doc.moveDown(2);
      yPos = doc.y;
      doc.text('Taxable Amount:', 250, yPos);
      doc.text(taxBreakdown.taxableAmount.toFixed(2), 400, yPos, { align: 'right' });
      
      yPos += 15;
      if (taxBreakdown.isInterState) {
        doc.text('IGST (18%):', 250, yPos);
        doc.text(taxBreakdown.igst.toFixed(2), 400, yPos, { align: 'right' });
      } else {
        doc.text('CGST (9%):', 250, yPos);
        doc.text(taxBreakdown.cgst.toFixed(2), 400, yPos, { align: 'right' });
        yPos += 15;
        doc.text('SGST (9%):', 250, yPos);
        doc.text(taxBreakdown.sgst.toFixed(2), 400, yPos, { align: 'right' });
      }

      yPos += 20;
      doc.font('Helvetica-Bold');
      doc.text('Grand Total:', 250, yPos);
      doc.text(`INR ${taxBreakdown.grandTotal.toFixed(2)}`, 400, yPos, { align: 'right' });

      // Footer
      doc.font('Helvetica');
      doc.moveDown(4);
      doc.text('This is a computer-generated invoice and does not require a physical signature.', { align: 'center', fontSize: 8 });

      doc.end();

      writeStream.on('finish', () => resolve(outputPath));
      writeStream.on('error', reject);
    });
  }
}
