import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware'
import { Organization, Project, Workforce, Material, SafetyObservation } from '../models'
import { backgroundQueue } from '../queues/queue'

export const apiRouter = Router()

// ==========================================
// 1. AUTHENTICATION MODULE ENDPOINTS
// ==========================================
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  const { username, tenantId } = req.body

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
