import mongoose, { Schema, Document } from 'mongoose';

export interface IApprovalRequest extends Document {
  tenantId: string;
  requesterId: string;
  type: 'EXPENSE' | 'PURCHASE_ORDER' | 'LEAVE' | 'INVOICE' | 'MATERIAL';
  amountINR?: number;
  details: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approverHierarchy: string[]; // Array of User IDs who need to approve
  currentStep: number; // Index in approverHierarchy
  logs: { approverId: string, action: string, date: Date, comment: string }[];
}

const ApprovalRequestSchema: Schema = new Schema({
  tenantId: { type: String, required: true },
  requesterId: { type: String, required: true },
  type: { type: String, required: true },
  amountINR: { type: Number },
  details: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  approverHierarchy: [{ type: String }],
  currentStep: { type: Number, default: 0 },
  logs: [{
    approverId: String,
    action: String,
    date: { type: Date, default: Date.now },
    comment: String
  }]
}, { timestamps: true });

export const ApprovalRequest = mongoose.model<IApprovalRequest>('ApprovalRequest', ApprovalRequestSchema);

export class ApprovalWorkflow {
  static async requestApproval(tenantId: string, data: Partial<IApprovalRequest>): Promise<IApprovalRequest> {
    const req = new ApprovalRequest({ ...data, tenantId });
    return req.save();
  }

  static async reviewRequest(requestId: string, approverId: string, tenantId: string, action: 'APPROVE' | 'REJECT', comment?: string): Promise<IApprovalRequest> {
    const req = await ApprovalRequest.findOne({ _id: requestId, tenantId });
    if (!req) throw new Error('Request not found');
    if (req.status !== 'PENDING') throw new Error('Request is already processed');

    // Ensure it's this approver's turn
    if (req.approverHierarchy[req.currentStep] !== approverId) {
      throw new Error('Not authorized for current approval step');
    }

    req.logs.push({ approverId, action, comment: comment || '', date: new Date() });

    if (action === 'REJECT') {
      req.status = 'REJECTED';
    } else {
      req.currentStep += 1;
      // If we reached the end of the hierarchy, it's fully approved
      if (req.currentStep >= req.approverHierarchy.length) {
        req.status = 'APPROVED';
      }
    }

    return req.save();
  }
}
