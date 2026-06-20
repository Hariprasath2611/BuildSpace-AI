import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';

export interface AuthenticatedSocket extends Socket {
  user?: {
    userId: string;
    tenantId: string;
    role: string;
  };
}

export const socketAuthMiddleware = (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    // Inject user info into socket
    socket.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      role: decoded.role || 'user',
    };
    
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token'));
  }
};
