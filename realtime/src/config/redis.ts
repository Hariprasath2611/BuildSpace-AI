import { Redis } from 'ioredis';
import { config } from './env';

// Primary Redis client for caching and general operations
export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null, // Required by BullMQ
});

// Pub client for Socket.io Redis adapter
export const pubClient = redisClient.duplicate();

// Sub client for Socket.io Redis adapter
export const subClient = redisClient.duplicate();

redisClient.on('error', (err) => console.error('Redis Client Error', err));
pubClient.on('error', (err) => console.error('Redis Pub Client Error', err));
subClient.on('error', (err) => console.error('Redis Sub Client Error', err));

redisClient.on('connect', () => console.log('Redis connected successfully'));
