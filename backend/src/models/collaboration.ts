import { Schema, model, Document } from 'mongoose'
import { tenantIsolationPlugin } from '../database/plugins/tenantIsolation'
import { softDeletePlugin, SoftDeleteDocument } from '../database/plugins/softDelete'
import { auditLogPlugin, AuditLogDocument } from '../database/plugins/auditLog'

// ==========================================
// 1. MONGOOSE INTERFACES
// ==========================================
export interface IMeeting extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId?: string
  title: string
  agenda: string
  attendees: string[]
  scheduledAt: Date
  durationMinutes: number
}

export interface IMeetingMinute extends Document, SoftDeleteDocument, AuditLogDocument {
  meetingId: string
  decisions: string[]
  actionItems: Array<{ task: string; assigneeId: string; dueDate?: Date }>
}

export interface IChatChannel extends Document, SoftDeleteDocument, AuditLogDocument {
  projectId?: string
  name: string
  type: 'Project' | 'Team' | 'Announcements'
  description?: string
}

export interface IChatMessage extends Document, SoftDeleteDocument, AuditLogDocument {
  channelId: string
  senderId: string
  senderName: string
  senderRole: string
  message: string
  timestamp: Date
  attachment?: { name: string; url: string; size: string }
}

export interface IComment extends Document, SoftDeleteDocument, AuditLogDocument {
  targetId: string // ID of task, drawing, blueprint etc.
  targetType: 'Task' | 'Drawing' | 'Blueprint' | 'Incident'
  authorId: string
  content: string
}

export interface IMention extends Document, SoftDeleteDocument, AuditLogDocument {
  sourceType: 'Chat' | 'Comment'
  sourceId: string
  userId: string
  isRead: boolean
}

export interface INotification extends Document, SoftDeleteDocument, AuditLogDocument {
  userId: string
  title: string
  content: string
  category: 'Safety' | 'Task' | 'Finance' | 'General'
  isRead: boolean
}

export interface IActivity extends Document, SoftDeleteDocument, AuditLogDocument {
  userId: string
  action: string
  details: string
  targetId?: string
}

// ==========================================
// 2. MONGOOSE SCHEMAS
// ==========================================
const MeetingSchema = new Schema<IMeeting>({
  projectId: { type: String, index: true },
  title: { type: String, required: true },
  agenda: { type: String, required: true },
  attendees: { type: [String], default: [] },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 }
})
MeetingSchema.plugin(tenantIsolationPlugin)
MeetingSchema.plugin(softDeletePlugin)
MeetingSchema.plugin(auditLogPlugin)

const MeetingMinuteSchema = new Schema<IMeetingMinute>({
  meetingId: { type: String, required: true, unique: true, index: true },
  decisions: { type: [String], default: [] },
  actionItems: [
    {
      task: { type: String, required: true },
      assigneeId: { type: String, required: true },
      dueDate: { type: Date }
    }
  ]
})
MeetingMinuteSchema.plugin(tenantIsolationPlugin)
MeetingMinuteSchema.plugin(softDeletePlugin)
MeetingMinuteSchema.plugin(auditLogPlugin)

const ChatChannelSchema = new Schema<IChatChannel>({
  projectId: { type: String, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Project', 'Team', 'Announcements'], default: 'Project' },
  description: { type: String }
})
ChatChannelSchema.plugin(tenantIsolationPlugin)
ChatChannelSchema.plugin(softDeletePlugin)
ChatChannelSchema.plugin(auditLogPlugin)

const ChatMessageSchema = new Schema<IChatMessage>({
  channelId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  attachment: {
    name: { type: String },
    url: { type: String },
    size: { type: String }
  }
})
ChatMessageSchema.plugin(tenantIsolationPlugin)
ChatMessageSchema.plugin(softDeletePlugin)
ChatMessageSchema.plugin(auditLogPlugin)
// TTL index for chats versioning if needed
ChatMessageSchema.index({ channelId: 1, timestamp: -1 })

const CommentSchema = new Schema<IComment>({
  targetId: { type: String, required: true, index: true },
  targetType: { type: String, enum: ['Task', 'Drawing', 'Blueprint', 'Incident'], required: true },
  authorId: { type: String, required: true },
  content: { type: String, required: true }
})
CommentSchema.plugin(tenantIsolationPlugin)
CommentSchema.plugin(softDeletePlugin)
CommentSchema.plugin(auditLogPlugin)

const MentionSchema = new Schema<IMention>({
  sourceType: { type: String, enum: ['Chat', 'Comment'], required: true },
  sourceId: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  isRead: { type: Boolean, default: false }
})
MentionSchema.plugin(tenantIsolationPlugin)
MentionSchema.plugin(softDeletePlugin)
MentionSchema.plugin(auditLogPlugin)

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Safety', 'Task', 'Finance', 'General'], default: 'General' },
  isRead: { type: Boolean, default: false }
})
NotificationSchema.plugin(tenantIsolationPlugin)
NotificationSchema.plugin(softDeletePlugin)
NotificationSchema.plugin(auditLogPlugin)
NotificationSchema.index({ userId: 1, isRead: 1 })

const ActivitySchema = new Schema<IActivity>({
  userId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  targetId: { type: String }
})
ActivitySchema.plugin(tenantIsolationPlugin)
ActivitySchema.plugin(softDeletePlugin)
ActivitySchema.plugin(auditLogPlugin)

// ==========================================
// 3. MODEL EXPORTS
// ==========================================
export const Meeting = model<IMeeting>('Meeting', MeetingSchema)
export const MeetingMinute = model<IMeetingMinute>('MeetingMinute', MeetingMinuteSchema)
export const ChatChannel = model<IChatChannel>('ChatChannel', ChatChannelSchema)
export const ChatMessage = model<IChatMessage>('ChatMessage', ChatMessageSchema)
export const Comment = model<IComment>('Comment', CommentSchema)
export const Mention = model<IMention>('Mention', MentionSchema)
export const Notification = model<INotification>('Notification', NotificationSchema)
export const Activity = model<IActivity>('Activity', ActivitySchema)
