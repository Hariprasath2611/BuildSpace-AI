import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { config } from './config/env';
import { initializeSocketGateway } from './socket/gateway';
import { register } from './monitoring/metrics';
import { initializeWorkers } from './queues/workers';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Real-time Components
initializeSocketGateway(httpServer);
initializeWorkers();

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'realtime-gateway' });
});

// Prometheus Metrics Endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// Start Server
httpServer.listen(config.port, () => {
  console.log(`🚀 Real-time Gateway listening on port ${config.port} in ${config.environment} mode`);
  console.log(`📊 Metrics available at http://localhost:${config.port}/metrics`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
