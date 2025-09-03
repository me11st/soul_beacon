import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { connectDatabase } from './config/database'
import { logger } from './utils/logger'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import beaconRoutes from './routes/beacons'
import matchingRoutes from './routes/matching'
import { setupSocketHandlers } from './socket/handlers'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 8000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/beacons', beaconRoutes)
app.use('/api/matching', matchingRoutes)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Socket.io initialization
setupSocketHandlers(io)

// Error handling
app.use(errorHandler)

// Database connection and server start
async function startServer() {
  try {
    await connectDatabase()
    
    server.listen(PORT, () => {
      logger.info(`🚀 Soul Beacon Backend running on port ${PORT}`)
      logger.info(`📡 Socket.io enabled with CORS origin: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export { app, io }
