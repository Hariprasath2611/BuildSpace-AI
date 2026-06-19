import { Schema, model, Document } from 'mongoose'
import { z } from 'zod'
import { tenantIsolationPlugin } from '../database/plugins/tenantIsolation'
import { softDeletePlugin, SoftDeleteDocument } from '../database/plugins/softDelete'
import { auditLogPlugin, AuditLogDocument } from '../database/plugins/auditLog'

// ==========================================
// 1. MONGOOSE INTERFACES
// ==========================================
export interface IPlatformAuditLog extends Document, SoftDeleteDocument, AuditLogDocument {
  userId: string
  action: string
  resourceName: string
  resourceId?: string
  ipAddress?: string
  userAgent?: string
}

export interface IApiLog extends Document, SoftDeleteDocument, AuditLogDocument {
  method: string
  url: string
  statusCode: number
  responseTimeMs: number
  userId?: string
  ipAddress?: string
  payloadSize?: number
}

export interface ISecurityLog extends Document, SoftDeleteDocument, AuditLogDocument {
  userId?: string
  eventType: 'LoginFailed' | 'MfaRequired' | 'PasswordChanged' | 'ApiKeyCreated'
  severity: 'Info' | 'Warning' | 'Critical'
  details: string
  ipAddress?: string
}

export interface IFeatureFlag extends Document, SoftDeleteDocument, AuditLogDocument {
  key: string
  description?: string
  isEnabled: boolean
  percentageRollout?: number // e.g. 50 for 50% user group rollout
}

export interface ISubscription extends Document, SoftDeleteDocument, AuditLogDocument {
  planName: 'Basic' | 'Enterprise' | 'Premium'
  status: 'active' | 'suspended' | 'trial_ended'
  trialStartsAt: Date
  trialEndsAt: Date
  stripeSubscriptionId?: string
}

export interface IBilling extends Document, SoftDeleteDocument, AuditLogDocument {
  subscriptionId: string
  invoiceId: string
  amount: number
  paidStatus: 'Paid' | 'Unpaid' | 'Failed'
  paidAtDate?: Date
}

export interface ICoupon extends Document, SoftDeleteDocument, AuditLogDocument {
  code: string
  discountPercentage: number // e.g. 20 for 20% off
  expiryDate: Date
  maxRedemptions?: number
}

export interface ILicense extends Document, SoftDeleteDocument, AuditLogDocument {
  licenseKey: string
  seatsAllocated: number
  seatsUsed: number
  expiresAt: Date
}

export interface IApiKey extends Document, SoftDeleteDocument, AuditLogDocument {
  name: string
  secretKeyHash: string
  scopes: string[] // e.g. ["read:projects", "write:workforce"]
  expiresAt?: Date
}

export interface IIntegration extends Document, SoftDeleteDocument, AuditLogDocument {
  serviceName: 'Stripe' | 'Firebase' | 'Cloudinary' | 'Pinecone' | 'Twilio'
  configParams: Record<string, any>
  status: 'Connected' | 'Disconnected' | 'Error'
}

export interface IWebhook extends Document, SoftDeleteDocument, AuditLogDocument {
  targetUrl: string
  events: string[] // e.g. ["project.created", "safety.observation"]
  secretToken: string
  status: 'Active' | 'Paused'
}

export interface ISystemSetting extends Document, SoftDeleteDocument, AuditLogDocument {
  settingKey: string
  settingValue: string
  description?: string
}

export interface IPlatformSetting extends Document, SoftDeleteDocument, AuditLogDocument {
  paramKey: string
  paramValue: string
  group: 'Security' | 'Billing' | 'Notifications'
}

// ==========================================
// 2. MONGOOSE SCHEMAS
// ==========================================
const PlatformAuditLogSchema = new Schema<IPlatformAuditLog>({
  userId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  resourceName: { type: String, required: true },
  resourceId: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
})
PlatformAuditLogSchema.plugin(tenantIsolationPlugin)
PlatformAuditLogSchema.plugin(softDeletePlugin)
PlatformAuditLogSchema.plugin(auditLogPlugin)
PlatformAuditLogSchema.index({ tenantId: 1, action: 1 })

const ApiLogSchema = new Schema<IApiLog>({
  method: { type: String, required: true },
  url: { type: String, required: true },
  statusCode: { type: Number, required: true },
  responseTimeMs: { type: Number, required: true },
  userId: { type: String },
  ipAddress: { type: String },
  payloadSize: { type: Number }
})
ApiLogSchema.plugin(tenantIsolationPlugin)
ApiLogSchema.plugin(softDeletePlugin)
ApiLogSchema.plugin(auditLogPlugin)
// TTL index to automatically prune historical API logs after 30 days
ApiLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 })

const SecurityLogSchema = new Schema<ISecurityLog>({
  userId: { type: String },
  eventType: { type: String, enum: ['LoginFailed', 'MfaRequired', 'PasswordChanged', 'ApiKeyCreated'], required: true },
  severity: { type: String, enum: ['Info', 'Warning', 'Critical'], required: true },
  details: { type: String, required: true },
  ipAddress: { type: String }
})
SecurityLogSchema.plugin(tenantIsolationPlugin)
SecurityLogSchema.plugin(softDeletePlugin)
SecurityLogSchema.plugin(auditLogPlugin)

const FeatureFlagSchema = new Schema<IFeatureFlag>({
  key: { type: String, required: true },
  description: { type: String },
  isEnabled: { type: Boolean, default: false },
  percentageRollout: { type: Number, default: 100 }
})
FeatureFlagSchema.plugin(tenantIsolationPlugin)
FeatureFlagSchema.plugin(softDeletePlugin)
FeatureFlagSchema.plugin(auditLogPlugin)
FeatureFlagSchema.index({ tenantId: 1, key: 1 }, { unique: true })

const SubscriptionSchema = new Schema<ISubscription>({
  planName: { type: String, enum: ['Basic', 'Enterprise', 'Premium'], required: true },
  status: { type: String, enum: ['active', 'suspended', 'trial_ended'], default: 'active' },
  trialStartsAt: { type: Date, default: Date.now },
  trialEndsAt: { type: Date, required: true },
  stripeSubscriptionId: { type: String }
})
SubscriptionSchema.plugin(tenantIsolationPlugin)
SubscriptionSchema.plugin(softDeletePlugin)
SubscriptionSchema.plugin(auditLogPlugin)

const BillingSchema = new Schema<IBilling>({
  subscriptionId: { type: String, required: true, index: true },
  invoiceId: { type: String, required: true },
  amount: { type: Number, required: true },
  paidStatus: { type: String, enum: ['Paid', 'Unpaid', 'Failed'], default: 'Unpaid' },
  paidAtDate: { type: Date }
})
BillingSchema.plugin(tenantIsolationPlugin)
BillingSchema.plugin(softDeletePlugin)
BillingSchema.plugin(auditLogPlugin)

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true },
  discountPercentage: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  maxRedemptions: { type: Number }
})
CouponSchema.plugin(tenantIsolationPlugin)
CouponSchema.plugin(softDeletePlugin)
CouponSchema.plugin(auditLogPlugin)

const LicenseSchema = new Schema<ILicense>({
  licenseKey: { type: String, required: true },
  seatsAllocated: { type: Number, required: true },
  seatsUsed: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true }
})
LicenseSchema.plugin(tenantIsolationPlugin)
LicenseSchema.plugin(softDeletePlugin)
LicenseSchema.plugin(auditLogPlugin)
LicenseSchema.index({ tenantId: 1, licenseKey: 1 }, { unique: true })

const ApiKeySchema = new Schema<IApiKey>({
  name: { type: String, required: true },
  secretKeyHash: { type: String, required: true },
  scopes: { type: [String], default: [] },
  expiresAt: { type: Date }
})
ApiKeySchema.plugin(tenantIsolationPlugin)
ApiKeySchema.plugin(softDeletePlugin)
ApiKeySchema.plugin(auditLogPlugin)
ApiKeySchema.index({ tenantId: 1, name: 1 }, { unique: true })

const IntegrationSchema = new Schema<IIntegration>({
  serviceName: { type: String, enum: ['Stripe', 'Firebase', 'Cloudinary', 'Pinecone', 'Twilio'], required: true },
  configParams: { type: Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['Connected', 'Disconnected', 'Error'], default: 'Connected' }
})
IntegrationSchema.plugin(tenantIsolationPlugin)
IntegrationSchema.plugin(softDeletePlugin)
IntegrationSchema.plugin(auditLogPlugin)

const WebhookSchema = new Schema<IWebhook>({
  targetUrl: { type: String, required: true },
  events: { type: [String], default: [] },
  secretToken: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Paused'], default: 'Active' }
})
WebhookSchema.plugin(tenantIsolationPlugin)
WebhookSchema.plugin(softDeletePlugin)
WebhookSchema.plugin(auditLogPlugin)

const SystemSettingSchema = new Schema<ISystemSetting>({
  settingKey: { type: String, required: true },
  settingValue: { type: String, required: true },
  description: { type: String }
})
SystemSettingSchema.plugin(tenantIsolationPlugin)
SystemSettingSchema.plugin(softDeletePlugin)
SystemSettingSchema.plugin(auditLogPlugin)
SystemSettingSchema.index({ tenantId: 1, settingKey: 1 }, { unique: true })

const PlatformSettingSchema = new Schema<IPlatformSetting>({
  paramKey: { type: String, required: true },
  paramValue: { type: String, required: true },
  group: { type: String, enum: ['Security', 'Billing', 'Notifications'], default: 'Security' }
})
PlatformSettingSchema.plugin(tenantIsolationPlugin)
PlatformSettingSchema.plugin(softDeletePlugin)
PlatformSettingSchema.plugin(auditLogPlugin)

// ==========================================
// 3. MODEL EXPORTS
// ==========================================
export const PlatformAuditLog = model<IPlatformAuditLog>('PlatformAuditLog', PlatformAuditLogSchema)
export const ApiLog = model<IApiLog>('ApiLog', ApiLogSchema)
export const SecurityLog = model<ISecurityLog>('SecurityLog', SecurityLogSchema)
export const FeatureFlag = model<IFeatureFlag>('FeatureFlag', FeatureFlagSchema)
export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema)
export const Billing = model<IBilling>('Billing', BillingSchema)
export const Coupon = model<ICoupon>('Coupon', CouponSchema)
export const License = model<ILicense>('License', LicenseSchema)
export const ApiKey = model<IApiKey>('ApiKey', ApiKeySchema)
export const Integration = model<IIntegration>('Integration', IntegrationSchema)
export const Webhook = model<IWebhook>('Webhook', WebhookSchema)
export const SystemSetting = model<ISystemSetting>('SystemSetting', SystemSettingSchema)
export const PlatformSetting = model<IPlatformSetting>('PlatformSetting', PlatformSettingSchema)
