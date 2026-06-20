import { Namespace } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import { activeConnectionsGauge } from '../../monitoring/metrics';

export const registerTrackingNamespace = (io: Namespace) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    const { tenantId, userId } = socket.user!;
    
    socket.join(`tenant:${tenantId}:tracking`);
    activeConnectionsGauge.inc({ namespace: '/tracking' });

    // Worker sending live GPS coords
    socket.on('location_update', (data: { lat: number, lng: number, accuracy: number, heading?: number }) => {
      // Broadcast to supervisors looking at the map
      socket.to(`tenant:${tenantId}:tracking`).emit('worker_location', {
        userId,
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('sos_alert', (data: { lat: number, lng: number, type: string }) => {
      // High priority alert broadcast
      socket.to(`tenant:${tenantId}:tracking`).emit('critical_sos', {
        userId,
        ...data,
        timestamp: new Date().toISOString()
      });
      // A BullMQ job should also be dispatched here to notify external services/SMS
    });

    socket.on('disconnect', () => {
      activeConnectionsGauge.dec({ namespace: '/tracking' });
    });
  });
};
