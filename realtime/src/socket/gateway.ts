import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from '../config/redis';
import { socketAuthMiddleware } from './middleware/auth';
import { registerProjectsNamespace } from './namespaces/projects';
import { registerChatNamespace } from './namespaces/chat';
import { registerNotificationsNamespace } from './namespaces/notifications';
import { registerTrackingNamespace } from './namespaces/tracking';
import { registerAiNamespace } from './namespaces/ai';

export const initializeSocketGateway = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Adjust for production environments
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Attach Redis adapter for horizontal scaling
  io.adapter(createAdapter(pubClient, subClient));

  // Namespaces definition
  const projectsNs = io.of('/projects');
  const chatNs = io.of('/chat');
  const notificationsNs = io.of('/notifications');
  const trackingNs = io.of('/tracking');
  const aiNs = io.of('/ai');

  // Apply Auth Middleware to all namespaces
  [projectsNs, chatNs, notificationsNs, trackingNs, aiNs].forEach(ns => {
    ns.use(socketAuthMiddleware as any);
  });

  // Register Handlers
  registerProjectsNamespace(projectsNs);
  registerChatNamespace(chatNs);
  registerNotificationsNamespace(notificationsNs);
  registerTrackingNamespace(trackingNs);
  registerAiNamespace(aiNs);

  console.log('Socket.io Gateway initialized with Redis adapter and Namespaces');

  return io;
};
