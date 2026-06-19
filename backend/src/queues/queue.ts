import { Queue, Worker, Job } from 'bullmq'
import IORedis from 'ioredis'

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = parseInt(process.env.REDIS_PORT || '6379')

// Create Redis Connection
const redisConnection = new IORedis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null
})

// Define Background Queue
export const backgroundQueue = new Queue('background-tasks', {
  connection: redisConnection
})

// Define Workers to process background tasks
export const backgroundWorker = new Worker(
  'background-tasks',
  async (job: Job) => {
    console.log(`Processing background job: ${job.id} [${job.name}]`)
    
    switch (job.name) {
      case 'email-dispatch':
        console.log(`Sending email to ${job.data.email}: ${job.data.subject}`)
        // Simulate SMTP delivery
        await new Promise((resolve) => setTimeout(resolve, 500))
        break
        
      case 'ocr-scan':
        console.log(`Scanning document layout for drawings... URL: ${job.data.fileUrl}`)
        // Simulate computer vision text extraction
        await new Promise((resolve) => setTimeout(resolve, 1500))
        return {
          ocrText: "Ground slab thickness set at 3-inches cover, rebar layout spacing at 12-inches center."
        }
        
      case 'delay-forecast':
        console.log(`Calculating predictive timeline delays for project ${job.data.projectId}`)
        // Simulate ML model delay forecasts
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return {
          predictedDelayDays: 2,
          reason: "Concrete curing delays due to overnight rain precipitation warnings"
        }
        
      default:
        console.log(`Unknown job type: ${job.name}`)
    }
    return {}
  },
  { connection: redisConnection }
)

backgroundWorker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} completed successfully.`)
})

backgroundWorker.on('failed', (job: Job | undefined, err: Error) => {
  console.error(`Job ${job?.id} failed with error:`, err)
})
