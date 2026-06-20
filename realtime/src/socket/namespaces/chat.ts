import { Namespace } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import { activeConnectionsGauge } from '../../monitoring/metrics';

export const registerChatNamespace = (io: Namespace) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    const { tenantId, userId } = socket.user!;
    
    socket.join(`tenant:${tenantId}:chat`);
    activeConnectionsGauge.inc({ namespace: '/chat' });

    // Presence: User is online
    socket.to(`tenant:${tenantId}:chat`).emit('presence_update', {
      userId,
      status: 'online',
    });

    socket.on('join_chat_room', (roomId: string) => {
      socket.join(`chat_room:${roomId}`);
    });

    socket.on('send_message', (data: { roomId: string, message: string, tempId: string }) => {
      // Emit back to sender as 'message_sent' for optimistic UI resolution
      socket.emit('message_sent', { tempId: data.tempId, status: 'delivered' });
      
      // Broadcast to room
      socket.to(`chat_room:${data.roomId}`).emit('new_message', {
        roomId: data.roomId,
        senderId: userId,
        message: data.message,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('typing', (data: { roomId: string, isTyping: boolean }) => {
      socket.to(`chat_room:${data.roomId}`).emit('user_typing', {
        userId,
        isTyping: data.isTyping
      });
    });

    socket.on('disconnect', () => {
      socket.to(`tenant:${tenantId}:chat`).emit('presence_update', {
        userId,
        status: 'offline',
      });
      activeConnectionsGauge.dec({ namespace: '/chat' });
    });
  });
};
