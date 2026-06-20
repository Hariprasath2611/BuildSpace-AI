import client from 'prom-client';

// Create a Registry
export const register = new client.Registry();

// Add default metrics (e.g. memory, CPU)
client.collectDefaultMetrics({ register });

// Custom metrics for real-time infrastructure
export const activeConnectionsGauge = new client.Gauge({
  name: 'socket_active_connections',
  help: 'Total number of active socket connections',
  labelNames: ['namespace'],
});
register.registerMetric(activeConnectionsGauge);

export const messageLatencyHistogram = new client.Histogram({
  name: 'socket_message_latency_seconds',
  help: 'Latency of message processing in seconds',
  labelNames: ['namespace', 'event'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
});
register.registerMetric(messageLatencyHistogram);

export const jobsProcessedCounter = new client.Counter({
  name: 'bullmq_jobs_processed_total',
  help: 'Total number of BullMQ jobs processed successfully',
  labelNames: ['queue_name'],
});
register.registerMetric(jobsProcessedCounter);

export const jobsFailedCounter = new client.Counter({
  name: 'bullmq_jobs_failed_total',
  help: 'Total number of BullMQ jobs failed',
  labelNames: ['queue_name'],
});
register.registerMetric(jobsFailedCounter);
