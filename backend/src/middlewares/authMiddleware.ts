import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export interface AuthenticatedUser {
  userId: string
  userName: string
  role: string
  tenantId: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
      tenantId?: string
    }
  }
}

// 1. JWT Validator
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access denied: Missing auth token' })
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret-jwt-key') as AuthenticatedUser
    req.user = verified
    req.tenantId = verified.tenantId

    // Dynamically inject tenant context into Mongoose schema prototypes for database isolation query filtering
    ;(mongoose.Schema.prototype as any)._tenantId = verified.tenantId

    next()
  } catch {
    return res.status(403).json({ error: 'Access denied: Invalid auth token' })
  }
}

// 2. RBAC Permissions Guard
export function authorizeRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access denied: User not authenticated' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: Insufficient role permissions' })
    }

    next()
  }
}
