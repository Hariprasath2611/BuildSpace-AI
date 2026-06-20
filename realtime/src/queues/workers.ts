import { Worker, Job } from 'bullmq';
import { redisClient } from '../config/redis';
import { jobsProcessedCounter, jobsFailedCounter } from '../monitoring/metrics';

const notificationWorker = new Worker(
  'notifications',
  async (job: Job) => {
    console.log(`Processing notification job ${job.id}`);
    // Simulate push notification dispatch
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Notification sent to ${job.data.userId}`);
  },
  { connection: redisClient as any }
);

const reportWorker = new Worker(
  'reports',
  async (job: Job) => {
    console.log(`Processing report generation job ${job.id}`);
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`Report generated for tenant ${job.data.tenantId}`);
  },
  { connection: redisClient as any }
);

const webhookWorker = new Worker(
  'webhooks',
  async (job: Job) => {
    console.log(`Processing webhook job ${job.id}`);
    // Simulate webhook POST request
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(`Webhook dispatched to ${job.data.url}`);
  },
  { connection: redisClient as any }
);

// Metrics and logging
[notificationWorker, reportWorker, webhookWorker].forEach(worker => {
  worker.on('completed', (job) => {
    jobsProcessedCounter.inc({ queue_name: worker.name });
  });

  worker.on('failed', (job, err) => {
    console.error(`${worker.name} job ${job?.id} failed:`, err.message);
    jobsFailedCounter.inc({ queue_name: worker.name });
  });
});

export const initializeWorkers = () => {
  console.log('BullMQ Workers initialized');
};
