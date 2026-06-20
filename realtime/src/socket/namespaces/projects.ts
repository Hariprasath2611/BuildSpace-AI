import { Namespace } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import { activeConnectionsGauge } from '../../monitoring/metrics';

export const registerProjectsNamespace = (io: Namespace) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    const { tenantId, userId } = socket.user!;
    
    // Join tenant-specific room for project updates
    const tenantRoom = `tenant:${tenantId}:projects`;
    socket.join(tenantRoom);
    
    activeConnectionsGauge.inc({ namespace: '/projects' });

    console.log(`User ${userId} connected to projects namespace (Tenant: ${tenantId})`);

    socket.on('join_project', (projectId: string) => {
      const projectRoom = `project:${projectId}`;
      socket.join(projectRoom);
      console.log(`User ${userId} joined project room: ${projectRoom}`);
    });

    socket.on('leave_project', (projectId: string) => {
      const projectRoom = `project:${projectId}`;
      socket.leave(projectRoom);
    });

    // Real-time collaborative events
    socket.on('task_update', (data: { projectId: string, taskId: string, status: string }) => {
      // Broadcast to everyone in the project except sender
      socket.to(`project:${data.projectId}`).emit('task_updated', {
        ...data,
        updatedBy: userId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      activeConnectionsGauge.dec({ namespace: '/projects' });
      console.log(`User ${userId} disconnected from projects namespace`);
    });
  });
};
