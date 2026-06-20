import { Queue } from 'bullmq';
import { redisClient } from '../config/redis';

// Define queues for background tasks
export const notificationQueue = new Queue('notifications', { connection: redisClient });
export const reportGenerationQueue = new Queue('reports', { connection: redisClient });
export const webhookQueue = new Queue('webhooks', { connection: redisClient });

export const enqueueNotification = async (data: any) => {
  await notificationQueue.add('send_push', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });
};

export const enqueueReport = async (data: any) => {
  await reportGenerationQueue.add('generate', data, {
    removeOnComplete: true,
  });
};

export const enqueueWebhook = async (data: any) => {
  await webhookQueue.add('dispatch', data, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
  });
};
