import { Namespace } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import { activeConnectionsGauge } from '../../monitoring/metrics';

export const registerNotificationsNamespace = (io: Namespace) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    const { tenantId, userId, role } = socket.user!;
    
    // User-specific room
    socket.join(`user:${userId}`);
    // Tenant-wide broadcast room
    socket.join(`tenant:${tenantId}:notifications`);
    // Role-specific room
    socket.join(`tenant:${tenantId}:role:${role}`);
    
    activeConnectionsGauge.inc({ namespace: '/notifications' });

    socket.on('mark_as_read', (notificationIds: string[]) => {
      // In a real app, this would trigger a BullMQ job or HTTP call to backend
      // to mark notifications as read in the DB.
      console.log(`User ${userId} marked notifications as read:`, notificationIds);
    });

    socket.on('disconnect', () => {
      activeConnectionsGauge.dec({ namespace: '/notifications' });
    });
  });
};
