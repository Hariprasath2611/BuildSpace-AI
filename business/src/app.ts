import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config/env';

const app = express();

app.use(cors());
// Crucial for webhook verification, we need raw body for stripe/razorpay webhooks
app.use(express.json({
  verify: (req: any, res, buf) => {
    if (req.originalUrl.startsWith('/api/webhooks')) {
      req.rawBody = buf.toString();
    }
  }
}));

// Basic Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'business-platform' });
});

// Database Connection & Server Start
const startServer = async () => {
  try {
    // Avoid actual connection failure in dry run
    if(process.env.NODE_ENV !== 'test') {
      await mongoose.connect(config.mongoUri);
      console.log('MongoDB connected for Business Platform');
    }
    
    app.listen(config.port, () => {
      console.log(`🚀 Enterprise Business Platform running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
