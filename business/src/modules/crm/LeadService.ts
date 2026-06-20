import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  tenantId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';
  valueINR: number;
  assignedTo: string;
  followUpDate?: Date;
  notes: string[];
}

const LeadSchema: Schema = new Schema({
  tenantId: { type: String, required: true },
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  stage: { type: String, enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'], default: 'NEW' },
  valueINR: { type: Number, default: 0 },
  assignedTo: { type: String },
  followUpDate: { type: Date },
  notes: [{ type: String }]
}, { timestamps: true });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);

export class LeadService {
  static async createLead(tenantId: string, data: Partial<ILead>): Promise<ILead> {
    const lead = new Lead({ ...data, tenantId });
    return lead.save();
  }

  static async updateLeadStage(leadId: string, tenantId: string, stage: ILead['stage']): Promise<ILead | null> {
    return Lead.findOneAndUpdate(
      { _id: leadId, tenantId },
      { stage },
      { new: true }
    );
  }

  static async addNote(leadId: string, tenantId: string, note: string): Promise<ILead | null> {
    return Lead.findOneAndUpdate(
      { _id: leadId, tenantId },
      { $push: { notes: note } },
      { new: true }
    );
  }

  static async getLeadsByStage(tenantId: string): Promise<any> {
    const leads = await Lead.find({ tenantId });
    // Group by stage for Kanban board view
    const pipeline: Record<string, ILead[]> = {
      NEW: [], CONTACTED: [], QUALIFIED: [], PROPOSAL: [], WON: [], LOST: []
    };
    leads.forEach(l => pipeline[l.stage].push(l));
    return pipeline;
  }
}
