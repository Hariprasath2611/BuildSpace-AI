import { io, Socket } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'

class SocketService {
  private socket: Socket | null = null

  public async connect(): Promise<void> {
    if (this.socket) return

    const token = await AsyncStorage.getItem('BS_TOKEN')
    
    // Connect to Node.js backend port
    this.socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true
    })

    this.socket.on('connect', () => {
      console.log('Socket.io connection successfully initialized.')
    })

    this.socket.on('disconnect', () => {
      console.log('Socket.io connection disconnected.')
    })
  }

  public subscribeToEvent(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  public unsubscribeFromEvent(event: string): void {
    if (this.socket) {
      this.socket.off(event)
    }
  }

  public emitEvent(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const socketService = new SocketService()
