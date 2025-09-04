// User and Authentication Types
export interface User {
  id: string
  auth0Id?: string
  openaiApiKey?: string
  email: string
  nickname: string
  avatar?: string
  soulShadow: SoulShadow
  walletAddress?: string
  createdAt: Date
  updatedAt: Date
}

export interface SoulShadow {
  userId: string
  resonanceData: ResonanceData
  interactionHistory: InteractionHistory[]
  preferences: UserPreferences
  tags: string[]
  moodWords: string[]
  updatedAt: Date
}

export interface ResonanceData {
  personalityVector: number[]
  interests: string[]
  values: string[]
  communicationStyle: 'direct' | 'empathetic' | 'analytical' | 'creative'
  preferredTopics: string[]
  energyLevel: number // 1-10
  introversion: number // 1-10 (1 = very introverted, 10 = very extroverted)
}

export interface UserPreferences {
  ageRange?: [number, number]
  genderPreference?: string[]
  locationRadius?: number
  languagePreference?: string[]
  connectionType: 'friendship' | 'romantic' | 'professional' | 'any'
  matchingCriteria: MatchingCriteria
}

export interface MatchingCriteria {
  personalityCompatibility: number // Weight 1-10
  interestOverlap: number // Weight 1-10
  valueAlignment: number // Weight 1-10
  communicationStyleCompat: number // Weight 1-10
  minimumResonanceScore: number // Threshold 0-1
}

// Beacon and ASA Types
export interface SoulBeacon {
  id: string
  userId: string
  asaId: number
  askContent: string
  askType: 'emotional' | 'intellectual' | 'creative' | 'spiritual' | 'practical'
  status: BeaconStatus
  resonanceScore?: number
  matchedWith?: string
  createdAt: Date
  expiresAt: Date
  isActive: boolean
  shimmerIntensity: number // 0-100
}

export type BeaconStatus = 'minted' | 'searching' | 'matched' | 'chatting' | 'distributed' | 'expired'

export interface BeaconMatch {
  id: string
  beacon1Id: string
  beacon2Id: string
  user1Id: string
  user2Id: string
  resonanceScore: number
  matchingReason: string
  chatRoomId: string
  status: MatchStatus
  createdAt: Date
  consentGiven: {
    user1: boolean
    user2: boolean
  }
}

export type MatchStatus = 'pending' | 'accepted' | 'active' | 'completed' | 'expired'

// Chat and Communication Types
export interface ChatRoom {
  id: string
  matchId: string
  participants: string[]
  messages: ChatMessage[]
  status: 'active' | 'paused' | 'ended'
  createdAt: Date
  lastActivity: Date
}

export interface ChatMessage {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'emotion' | 'system'
  isEncrypted: boolean
  resonanceImpact?: number // How this message affected resonance
}

// Interaction and Analytics Types
export interface InteractionHistory {
  type: 'message_sent' | 'message_received' | 'beacon_created' | 'match_made' | 'chat_started'
  timestamp: Date
  details: Record<string, any>
  resonanceImpact: number
}

export interface ResonanceAnalytics {
  userId: string
  totalBeaconsCreated: number
  successfulMatches: number
  averageResonanceScore: number
  preferredMatchingTimes: number[] // Hours of day
  mostSuccessfulAskTypes: string[]
  personalityGrowthVector: number[]
  lastUpdated: Date
}

// Algorand and Blockchain Types
export interface AlgorandTransaction {
  txId: string
  type: 'asa_creation' | 'asa_transfer' | 'app_call'
  assetId?: number
  appId?: number
  sender: string
  receiver?: string
  amount?: number
  note?: string
  confirmedRound?: number
  timestamp: Date
}

export interface ASAMetadata {
  assetId: number
  beaconId: string
  userId: string
  unitName: string
  assetName: string
  url: string
  decimals: number
  total: number
  frozen: boolean
  creator: string
  manager: string
  reserve: string
  freeze: string
  clawback: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: Date
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Socket.io Event Types
export interface SocketEvents {
  // Client to Server
  'join-room': (roomId: string) => void
  'leave-room': (roomId: string) => void
  'send-message': (data: { roomId: string; message: string }) => void
  'update-resonance': (data: { userId: string; resonanceData: Partial<ResonanceData> }) => void
  
  // Server to Client
  'message-received': (message: ChatMessage) => void
  'match-found': (match: BeaconMatch) => void
  'beacon-updated': (beacon: SoulBeacon) => void
  'resonance-updated': (data: { userId: string; newScore: number }) => void
  'user-typing': (data: { userId: string; roomId: string }) => void
  'user-stopped-typing': (data: { userId: string; roomId: string }) => void
}

// Utility Types
export interface NetworkConfig {
  name: 'mainnet' | 'testnet' | 'betanet' | 'localnet'
  algodUrl: string
  algodToken: string
  indexerUrl: string
  indexerToken: string
  port: number
}

export interface AppConfig {
  auth0: {
    domain: string
    clientId: string
    clientSecret: string
  }
  openai: {
    apiKey: string
    model: string
  }
  algorand: NetworkConfig
  database: {
    url: string
    name: string
  }
  redis: {
    url: string
  }
  server: {
    port: number
    corsOrigin: string
  }
}

// Error Types
export class SoulBeaconError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'SoulBeaconError'
  }
}

export class ValidationError extends SoulBeaconError {
  constructor(message: string, public field: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends SoulBeaconError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends SoulBeaconError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends SoulBeaconError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

// Constants
export const CONSTANTS = {
  BEACON_EXPIRY_MONTHS: 6,
  MAX_BEACONS_PER_USER: 3,
  MIN_RESONANCE_SCORE: 0.6,
  DEFAULT_SHIMMER_INTENSITY: 50,
  TOKEN_DISTRIBUTION: {
    MATCHED: { user: 0.5, protocol: 0.5 },
    UNMATCHED: { user: 0.7, protocol: 0.3 }
  },
  ASA: {
    DECIMALS: 6,
    TOTAL_SUPPLY: 1000000, // 1 token with 6 decimals
    UNIT_NAME: 'BEACON',
    ASSET_NAME: 'Soul Beacon'
  }
} as const
