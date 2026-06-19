import IORedis from 'ioredis'

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = parseInt(process.env.REDIS_PORT || '6379')

let redisClient: IORedis | null = null

try {
  redisClient = new IORedis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      if (times > 3) {
        console.warn('Redis cache connection refused. In-memory fallback active.')
        return null // Terminate reconnect attempts
      }
      return Math.min(times * 100, 2000)
    }
  })

  redisClient.on('error', (err) => {
    // Silence error to keep logs clean
    console.log(`Redis Cache Notification (suppressed): ${err.message}`)
  })
} catch (e) {
  console.warn('Failed to initialize Redis cache connection client:', e)
}

export const cacheSet = async (key: string, value: any, ttlSeconds = 300): Promise<void> => {
  if (!redisClient || redisClient.status !== 'ready') return
  try {
    const stringVal = JSON.stringify(value)
    await redisClient.set(key, stringVal, 'EX', ttlSeconds)
  } catch (err) {
    console.warn(`Redis set key failed: ${key}`, err)
  }
}

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  if (!redisClient || redisClient.status !== 'ready') return null
  try {
    const raw = await redisClient.get(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch (err) {
    console.warn(`Redis get key failed: ${key}`, err)
    return null
  }
}

export const cacheDel = async (key: string): Promise<void> => {
  if (!redisClient || redisClient.status !== 'ready') return
  try {
    await redisClient.del(key)
  } catch (err) {
    console.warn(`Redis delete key failed: ${key}`, err)
  }
}

export const getOrSetCache = async <T>(key: string, fetchFn: () => Promise<T>, ttlSeconds = 300): Promise<T> => {
  const cached = await cacheGet<T>(key)
  if (cached !== null) {
    return cached
  }
  const freshData = await fetchFn()
  await cacheSet(key, freshData, ttlSeconds)
  return freshData
}

export default redisClient
