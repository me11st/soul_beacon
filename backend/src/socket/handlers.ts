import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'

export function setupSocketHandlers(io: SocketIOServer) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    // Join a room for specific beacon or match
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId)
      console.log(`User ${socket.id} joined room: ${roomId}`)
      socket.to(roomId).emit('user-joined', { userId: socket.id })
    })

    // Leave a room
    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId)
      console.log(`User ${socket.id} left room: ${roomId}`)
      socket.to(roomId).emit('user-left', { userId: socket.id })
    })

    // Handle chat messages
    socket.on('send-message', (data: {
      roomId: string
      message: string
      userId: string
      userName: string
      timestamp: string
    }) => {
      // Broadcast message to all users in the room
      io.to(data.roomId).emit('receive-message', {
        id: `msg-${Date.now()}`,
        message: data.message,
        userId: data.userId,
        userName: data.userName,
        timestamp: data.timestamp
      })
      
      console.log(`Message in room ${data.roomId}: ${data.message}`)
    })

    // Handle typing indicators
    socket.on('typing-start', (data: { roomId: string, userName: string }) => {
      socket.to(data.roomId).emit('user-typing', {
        userId: socket.id,
        userName: data.userName,
        isTyping: true
      })
    })

    socket.on('typing-stop', (data: { roomId: string }) => {
      socket.to(data.roomId).emit('user-typing', {
        userId: socket.id,
        isTyping: false
      })
    })

    // Handle beacon discovery notifications
    socket.on('beacon-created', (data: {
      beaconId: string
      title: string
      category: string
    }) => {
      // Notify all connected users about new beacon
      socket.broadcast.emit('new-beacon-available', {
        beaconId: data.beaconId,
        title: data.title,
        category: data.category,
        timestamp: new Date().toISOString()
      })
    })

    // Handle match notifications
    socket.on('match-found', (data: {
      matchId: string
      beaconId: string
      users: string[]
      resonanceScore: number
    }) => {
      // Notify matched users
      data.users.forEach(userId => {
        io.emit('match-notification', {
          matchId: data.matchId,
          beaconId: data.beaconId,
          resonanceScore: data.resonanceScore,
          timestamp: new Date().toISOString()
        })
      })
    })

    // Handle connection requests
    socket.on('connection-request', (data: {
      fromUser: string
      toUser: string
      beaconId: string
      message?: string
    }) => {
      io.emit('connection-request-received', {
        requestId: `req-${Date.now()}`,
        fromUser: data.fromUser,
        beaconId: data.beaconId,
        message: data.message,
        timestamp: new Date().toISOString()
      })
    })

    // Handle connection responses
    socket.on('connection-response', (data: {
      requestId: string
      accepted: boolean
      message?: string
    }) => {
      io.emit('connection-response-received', {
        requestId: data.requestId,
        accepted: data.accepted,
        message: data.message,
        timestamp: new Date().toISOString()
      })
    })

    // Handle real-time resonance updates
    socket.on('resonance-update', (data: {
      beaconId: string
      newScore: number
      factors: string[]
    }) => {
      socket.broadcast.emit('resonance-score-updated', {
        beaconId: data.beaconId,
        newScore: data.newScore,
        factors: data.factors,
        timestamp: new Date().toISOString()
      })
    })

    // Handle user presence
    socket.on('update-presence', (data: {
      userId: string
      status: 'online' | 'away' | 'busy' | 'offline'
    }) => {
      socket.broadcast.emit('user-presence-updated', {
        userId: data.userId,
        status: data.status,
        timestamp: new Date().toISOString()
      })
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
      
      // Notify all rooms that this user left
      socket.broadcast.emit('user-disconnected', {
        userId: socket.id,
        timestamp: new Date().toISOString()
      })
    })

    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error)
      socket.emit('error-response', {
        message: 'An error occurred',
        timestamp: new Date().toISOString()
      })
    })
  })

  return io
}
