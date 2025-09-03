'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  sendMessage: (roomId: string, message: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

interface SocketProviderProps {
  children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000'
      const newSocket = io(socketUrl)

      newSocket.on('connect', () => {
        setIsConnected(true)
        console.log('Socket connected:', newSocket.id)
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
        console.log('Socket disconnected')
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [])

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('join-room', roomId)
    }
  }

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leave-room', roomId)
    }
  }

  const sendMessage = (roomId: string, message: string) => {
    if (socket) {
      socket.emit('send-message', { roomId, message })
    }
  }

  const value: SocketContextType = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
