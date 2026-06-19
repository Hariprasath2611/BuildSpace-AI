import { Server, Socket } from 'socket.io'
import http from 'http'
import jwt from 'jsonwebtoken'

interface SocketUser {
  userId: string
  userName: string
  role: string
  tenantId: string
}

export function initSocketServer(httpServer: http.Server) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  // Middleware to authenticate socket connections
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1]
    if (!token) {
      return next(new Error('Authentication failed: Missing socket handshake token'))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-jwt-key') as SocketUser
      socket.data.user = decoded
      next()
    } catch {
      return next(new Error('Authentication failed: Invalid socket token'))
    }
  })

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as SocketUser
    console.log(`Realtime socket user connected: ${user.userName} (${user.role})`)

    // Join tenant-specific rooms
    socket.join(`tenant:${user.tenantId}`)

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId)
      console.log(`Socket user ${user.userName} joined room: ${roomId}`)
      
      // Broadcast presence joining update
      socket.to(`tenant:${user.tenantId}`).emit('presence-update', {
        userId: user.userId,
        userName: user.userName,
        status: 'online',
        activity: `Viewing room ${roomId}`
      })
    })

    socket.on('typing-status', (data: { roomId: string; isTyping: boolean }) => {
      socket.to(data.roomId).emit('typing-update', {
        roomId: data.roomId,
        userName: user.userName,
        isTyping: data.isTyping
      })
    })

    socket.on('chat-message', (data: { roomId: string; message: string; attachment?: any }) => {
      io.to(data.roomId).emit('chat-broadcast', {
        id: `msg-${Date.now()}`,
        roomId: data.roomId,
        senderId: user.userId,
        senderName: user.userName,
        senderRole: user.role,
        message: data.message,
        timestamp: new Date().toISOString(),
        attachment: data.attachment
      })
    })

    socket.on('geofence-breach', (data: { projectId: string; entityName: string; geofenceName: string; status: 'inside' | 'outside' }) => {
      socket.to(`tenant:${user.tenantId}`).emit('geofence-alert', {
        projectId: data.projectId,
        entityName: data.entityName,
        geofenceName: data.geofenceName,
        status: data.status,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('disconnect', () => {
      console.log(`Realtime socket user disconnected: ${user.userName}`)
      socket.to(`tenant:${user.tenantId}`).emit('presence-update', {
        userId: user.userId,
        userName: user.userName,
        status: 'offline'
      })
    })
  })

  return io
}
