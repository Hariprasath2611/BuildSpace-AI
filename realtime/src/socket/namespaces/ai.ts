import { Namespace } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import { activeConnectionsGauge } from '../../monitoring/metrics';

export const registerAiNamespace = (io: Namespace) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    const { tenantId, userId } = socket.user!;
    
    socket.join(`user:${userId}:ai`);
    activeConnectionsGauge.inc({ namespace: '/ai' });

    // User prompts the AI Copilot
    socket.on('prompt_copilot', (data: { prompt: string, contextId?: string, threadId: string }) => {
      console.log(`User ${userId} prompted AI in thread ${data.threadId}: ${data.prompt}`);
      
      // Emit a processing state
      socket.emit('copilot_status', { threadId: data.threadId, status: 'processing' });
      
      // In production, this would drop a message to a Redis queue that the FastAPI 
      // microservice picks up. The FastAPI microservice would then stream the response 
      // back via Redis Pub/Sub, which the Socket Gateway relays back to the user.
      
      // Mock streaming response for demonstration:
      let mockTokens = ["I'm ", "analyzing ", "the ", "project ", "schedule. "];
      let i = 0;
      const interval = setInterval(() => {
        if (i < mockTokens.length) {
          socket.emit('copilot_stream', { threadId: data.threadId, token: mockTokens[i] });
          i++;
        } else {
          clearInterval(interval);
          socket.emit('copilot_status', { threadId: data.threadId, status: 'done' });
        }
      }, 300);
    });

    socket.on('disconnect', () => {
      activeConnectionsGauge.dec({ namespace: '/ai' });
    });
  });
};
