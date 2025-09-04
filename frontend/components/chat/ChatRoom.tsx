'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, Sparkles, Heart } from 'lucide-react'
import { useSocket } from '../providers/SocketProvider'

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: 'text' | 'system'
}

interface ChatRoomProps {
  matchId: string
  roomId: string
  partnerName: string
  partnerAddress: string
  userAddress: string
  userName: string
  onBack: () => void
}

export default function ChatRoom({
  matchId,
  roomId,
  partnerName,
  partnerAddress,
  userAddress,
  userName,
  onBack
}: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [partnerTyping, setPartnerTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { socket, isConnected, joinRoom, sendMessage } = useSocket()

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Join the chat room when component mounts
  useEffect(() => {
    if (socket && roomId) {
      joinRoom(roomId)
      console.log(`Joined chat room: ${roomId}`)

      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        senderId: 'system',
        senderName: 'Soul Beacon',
        content: `✨ Soul resonance detected! You and ${partnerName} have been connected. Start your conversation below.`,
        timestamp: new Date().toISOString(),
        type: 'system'
      }
      setMessages([welcomeMessage])
    }

    return () => {
      if (socket && roomId) {
        socket.emit('leave-room', roomId)
      }
    }
  }, [socket, roomId, partnerName, joinRoom])

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return

    const handleMessage = (data: any) => {
      console.log('Received message:', data)
      const message: ChatMessage = {
        id: data.id || `msg-${Date.now()}`,
        senderId: data.userId,
        senderName: data.userName,
        content: data.message,
        timestamp: data.timestamp,
        type: 'text'
      }
      setMessages(prev => [...prev, message])
    }

    const handleTyping = (data: any) => {
      if (data.userId !== userAddress) {
        setPartnerTyping(data.isTyping)
      }
    }

    socket.on('receive-message', handleMessage)
    socket.on('user-typing', handleTyping)

    return () => {
      socket.off('receive-message', handleMessage)
      socket.off('user-typing', handleTyping)
    }
  }, [socket, userAddress])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return

    const messageData = {
      roomId,
      message: newMessage.trim(),
      userId: userAddress,
      userName: userName,
      timestamp: new Date().toISOString()
    }

    // Add message to local state immediately
    const localMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      senderId: userAddress,
      senderName: userName,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    }
    setMessages(prev => [...prev, localMessage])

    // Send through socket
    socket.emit('send-message', messageData)
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="wallet-card mb-6"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <Heart className="w-5 h-5 mr-2 text-pink-400" />
                <span className="text-white">Connected with</span>
              </div>
              <div className="text-lg font-semibold text-white">{partnerName}</div>
              <div className="w-3 h-3 bg-green-400 rounded-full ml-2 animate-pulse"></div>
            </div>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="wallet-card mb-6 h-96 overflow-y-auto"
        >
          <div className="p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${
                    message.type === 'system'
                      ? 'justify-center'
                      : message.senderId === userAddress
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.type === 'system'
                        ? 'bg-purple-500/20 text-purple-200 text-sm text-center'
                        : message.senderId === userAddress
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <div className="break-words">{message.content}</div>
                    {message.type !== 'system' && (
                      <div className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {partnerTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-700 text-white px-4 py-2 rounded-2xl max-w-xs">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{partnerName} is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </motion.div>

        {/* Message Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="wallet-card"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Send a message to ${partnerName}...`}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 transition-colors"
                rows={2}
                disabled={!isConnected}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {!isConnected && (
            <div className="text-center text-yellow-400 text-sm mt-2">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Reconnecting to Soul Beacon network...
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
