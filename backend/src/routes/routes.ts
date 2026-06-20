import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware'
import { Organization, Project, Workforce, Material, SafetyObservation } from '../models'
import { backgroundQueue } from '../queues/queue'

export const apiRouter = Router()

const otpStore = new Map<string, string>()

// ==========================================
// 1. AUTHENTICATION MODULE ENDPOINTS
// ==========================================
apiRouter.post('/auth/send-verification', async (req: Request, res: Response) => {
  const { email } = req.body
  if (!email) {
    res.status(400).json({ error: 'Email is required' })
    return
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  otpStore.set(email, otp)

  try {
    let transporter;
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    } else {
      // Fallback to test account if no SMTP provided (does not send real emails)
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
      console.log('WARNING: Using test email account. Emails will NOT be delivered to real inboxes.')
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BuildSpace AI" <noreply@buildspace.ai>',
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${otp}`,
      html: `<b>Your verification code is: ${otp}</b>`,
    })

    console.log("Verification email sent: %s", info.messageId)
    if (!process.env.SMTP_USER) {
      console.log("Test Mail URL: %s", nodemailer.getTestMessageUrl(info))
    }

    res.json({ message: 'Verification email sent' })
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).json({ error: 'Failed to send verification email' })
  }
})

apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  const { username, tenantId, email, otp } = req.body

  if (email && otp) {
    const storedOtp = otpStore.get(email)
    if (!storedOtp || storedOtp !== otp) {
      res.status(401).json({ error: 'Invalid or expired verification code' })
      return
    }
    otpStore.delete(email)
  }

  // Check tenant validity
  if (tenantId) {
    const org = await Organization.findById(tenantId)
    if (!org || org.status === 'suspended') {
      res.status(403).json({ error: 'Tenant organization suspended or invalid' })
      return
    }
  }

  // Mint local JWT session token
  const token = jwt.sign(
    {
      userId: `usr-${Date.now()}`,
      userName: username || 'GuestUser',
      role: req.body.role || 'General Contractor',
      tenantId: tenantId || 'tenant-org-01'
    },
    process.env.JWT_SECRET || 'secret-jwt-key',
    { expiresIn: '1d' }
  )

  res.json({ token, user: { name: username, tenantId } })
  return
})

// ==========================================
// 2. MULTI-TENANT PROJECTS DIRECTORY
// ==========================================
apiRouter.get('/projects', authenticateToken, async (_req: Request, res: Response) => {
  const list = await Project.find()
  res.json(list)
})

apiRouter.post('/projects', authenticateToken, authorizeRoles('General Contractor', 'Admin'), async (req: Request, res: Response) => {
  const { name, location, budget } = req.body
  const newProj = new Project({
    name,
    location,
    budget,
    tenantId: req.tenantId
  })
  await newProj.save()

  // Dispatch background timeline delay forecast task via BullMQ
  await backgroundQueue.add('delay-forecast', { projectId: newProj.id })

  res.status(201).json(newProj)
})

// ==========================================
// 3. WORKFORCE REGISTER OPERATIONS
// ==========================================
apiRouter.get('/workforce', authenticateToken, async (_req: Request, res: Response) => {
  const list = await Workforce.find()
  res.json(list)
})

apiRouter.post('/workforce', authenticateToken, authorizeRoles('General Contractor', 'Admin'), async (req: Request, res: Response) => {
  const { name, trade } = req.body
  const newWorker = new Workforce({
    name,
    trade,
    tenantId: req.tenantId
  })
  await newWorker.save()
  res.status(201).json(newWorker)
})

// ==========================================
// 4. WAREHOUSE MATERIALS INVENTORY
// ==========================================
apiRouter.get('/materials', authenticateToken, async (_req: Request, res: Response) => {
  const list = await Material.find()
  res.json(list)
})

apiRouter.post('/materials', authenticateToken, authorizeRoles('General Contractor', 'Admin'), async (req: Request, res: Response) => {
  const { sku, name, category, currentStock, maxStock, unit } = req.body
  const newMaterial = new Material({
    sku,
    name,
    category,
    currentStock,
    maxStock,
    unit,
    status: currentStock < maxStock * 0.15 ? 'Reorder' : 'Optimal',
    tenantId: req.tenantId
  })
  await newMaterial.save()
  res.status(201).json(newMaterial)
})

// ==========================================
// 5. SAFETY EHS OBSERVATIONS AUDITS
// ==========================================
apiRouter.get('/safety', authenticateToken, async (_req: Request, res: Response) => {
  const list = await SafetyObservation.find()
  res.json(list)
})

apiRouter.post('/safety', authenticateToken, async (req: Request, res: Response) => {
  const { title, description, severity } = req.body
  const newObs = new SafetyObservation({
    title,
    description,
    severity,
    status: 'Open',
    tenantId: req.tenantId
  })
  await newObs.save()
  res.status(201).json(newObs)
})

export default apiRouter
