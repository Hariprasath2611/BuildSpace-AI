import express, { Request, Response, NextFunction } from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { connectDatabase } from './config/database'
import { initSocketServer } from './sockets/socket'
import { apiRouter } from './routes/routes'

// Load Environment Config variables
dotenv.config()

const app = express()
const server = http.createServer(app)

// Register Sockets handler
initSocketServer(server)

// 1. Basic Middlewares
app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(morgan('dev'))

// 2. Rate Limiting protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 1000, // Limit each IP to 1000 requests per window
  message: { error: 'Rate limit exceeded: Too many requests from this IP' }
})
app.use(limiter)

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// 3. Mount Routes Controller
app.use('/api/v1', apiRouter)
app.use('/_/backend/api/v1', apiRouter) // Fallback for Vercel experimentalServices route prefix

// 4. Global Error Boundary Middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled system exception caught:', err)
  res.status(500).json({
    error: 'Internal server error: Unhandled system exception',
    message: err.message
  })
})

const PORT = parseInt(process.env.PORT || '5000')

// Connect Database then Boot Server
async function startServer() {
  try {
    await connectDatabase()
    server.listen(PORT, () => {
      console.log(`BuildSpace AI Backend successfully booted on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start BuildSpace AI Backend server:', error)
    process.exit(1)
  }
}

if (!process.env.VERCEL) {
  startServer()
} else {
  // Connect to DB for serverless environment
  connectDatabase().catch(console.error)
}

export default app
module.exports = app
