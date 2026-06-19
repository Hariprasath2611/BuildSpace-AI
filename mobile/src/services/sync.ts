import * as SQLite from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from './api'

interface SyncItem {
  id: number
  endpoint: string
  method: 'POST' | 'PUT' | 'DELETE'
  payload: string
  timestamp: string
}

class SyncService {
  private db: any = null

  constructor() {
    try {
      this.db = SQLite.openDatabase('buildspace_sync.db')
      this.initTable()
    } catch (e) {
      console.warn("SQLite not available in current runtime. Falling back to AsyncStorage queue.")
    }
  }

  private initTable() {
    if (this.db) {
      this.db.transaction((tx: any) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS sync_queue (id INTEGER PRIMARY KEY AUTOINCREMENT, endpoint TEXT, method TEXT, payload TEXT, timestamp TEXT)'
        )
      })
    }
  }

  public async queueRequest(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', payload: any): Promise<void> {
    const timestamp = new Date().toISOString()
    const payloadStr = JSON.stringify(payload)

    // Try SQLite first
    if (this.db) {
      this.db.transaction((tx: any) => {
        tx.executeSql(
          'INSERT INTO sync_queue (endpoint, method, payload, timestamp) VALUES (?, ?, ?, ?)',
          [endpoint, method, payloadStr, timestamp],
          () => console.log(`Enqueued offline action: ${method} ${endpoint}`),
          (_: any, error: any) => console.error("SQLite insertion failed:", error)
        )
      })
      return
    }

    // AsyncStorage fallback queue
    try {
      const currentQueueStr = await AsyncStorage.getItem('BS_SYNC_QUEUE')
      const queue: Omit<SyncItem, 'id'>[] = currentQueueStr ? JSON.parse(currentQueueStr) : []
      queue.push({ endpoint, method, payload: payloadStr, timestamp })
      await AsyncStorage.setItem('BS_SYNC_QUEUE', JSON.stringify(queue))
      console.log(`Enqueued offline action (AsyncStorage): ${method} ${endpoint}`)
    } catch (e) {
      console.error("AsyncStorage enqueue failure:", e)
    }
  }

  public async processSyncQueue(): Promise<void> {
    console.log("Commencing offline sync queue flush...")
    
    // SQLite sync path
    if (this.db) {
      this.db.transaction((tx: any) => {
        tx.executeSql('SELECT * FROM sync_queue', [], async (_: any, results: any) => {
          const rows: SyncItem[] = []
          for (let i = 0; i < results.rows.length; i++) {
            rows.push(results.rows.item(i))
          }

          for (const item of rows) {
            try {
              const body = JSON.parse(item.payload)
              if (item.method === 'POST') {
                await api.post(item.endpoint, body)
              } else if (item.method === 'PUT') {
                await api.put(item.endpoint, body)
              } else if (item.method === 'DELETE') {
                await api.delete(item.endpoint, { data: body })
              }

              // Remove from SQLite queue on success
              this.db.transaction((deleteTx: any) => {
                deleteTx.executeSql('DELETE FROM sync_queue WHERE id = ?', [item.id])
              })
              console.log(`Successfully synced offline action: ${item.endpoint}`)
            } catch (e) {
              console.error(`Offline sync retry failed for ${item.endpoint}:`, e)
            }
          }
        })
      })
      return
    }

    // AsyncStorage sync fallback path
    try {
      const currentQueueStr = await AsyncStorage.getItem('BS_SYNC_QUEUE')
      if (!currentQueueStr) return

      const queue: SyncItem[] = JSON.parse(currentQueueStr)
      const failedItems: SyncItem[] = []

      for (const item of queue) {
        try {
          const body = JSON.parse(item.payload)
          if (item.method === 'POST') {
            await api.post(item.endpoint, body)
          } else if (item.method === 'PUT') {
            await api.put(item.endpoint, body)
          } else if (item.method === 'DELETE') {
            await api.delete(item.endpoint, { data: body })
          }
          console.log(`Successfully synced (AsyncStorage): ${item.endpoint}`)
        } catch (e) {
          failedItems.push(item)
          console.error(`Offline sync retry failed (AsyncStorage) for ${item.endpoint}:`, e)
        }
      }

      if (failedItems.length > 0) {
        await AsyncStorage.setItem('BS_SYNC_QUEUE', JSON.stringify(failedItems))
      } else {
        await AsyncStorage.removeItem('BS_SYNC_QUEUE')
      }
    } catch (e) {
      console.error("AsyncStorage queue flush failure:", e)
    }
  }
}

export const syncService = new SyncService()
