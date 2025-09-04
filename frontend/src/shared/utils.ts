import { ResonanceData, SoulBeacon, BeaconMatch } from './types'

/**
 * Calculate resonance score between two users
 */
export function calculateResonance(
  user1Data: ResonanceData,
  user2Data: ResonanceData
): number {
  // Personality vector similarity (cosine similarity)
  const personalitySimilarity = cosineSimilarity(
    user1Data.personalityVector,
    user2Data.personalityVector
  )

  // Interest overlap
  const interestOverlap = calculateOverlap(
    user1Data.interests,
    user2Data.interests
  )

  // Value alignment
  const valueAlignment = calculateOverlap(
    user1Data.values,
    user2Data.values
  )

  // Communication style compatibility
  const commStyleCompat = user1Data.communicationStyle === user2Data.communicationStyle ? 1 : 0.5

  // Energy level compatibility (closer = better)
  const energyCompat = 1 - Math.abs(user1Data.energyLevel - user2Data.energyLevel) / 10

  // Introversion compatibility 
  const introversionCompat = 1 - Math.abs(user1Data.introversion - user2Data.introversion) / 10

  // Weighted average
  const resonanceScore = (
    personalitySimilarity * 0.3 +
    interestOverlap * 0.25 +
    valueAlignment * 0.25 +
    commStyleCompat * 0.1 +
    energyCompat * 0.05 +
    introversionCompat * 0.05
  )

  return Math.round(resonanceScore * 100) / 100 // Round to 2 decimal places
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Calculate overlap between two arrays (Jaccard similarity)
 */
export function calculateOverlap(arr1: string[], arr2: string[]): number {
  const set1 = new Set(arr1.map(item => item.toLowerCase()))
  const set2 = new Set(arr2.map(item => item.toLowerCase()))
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return union.size === 0 ? 0 : intersection.size / union.size
}

/**
 * Generate shimmer intensity based on resonance score and time
 */
export function calculateShimmerIntensity(
  baseResonance: number,
  timeSinceCreated: number,
  isMatched: boolean = false
): number {
  if (isMatched) {
    // Matched beacons glow brightly
    return Math.min(90 + Math.random() * 10, 100)
  }

  // Base shimmer from resonance
  let intensity = baseResonance * 60

  // Add time-based decay (slowly dims over time)
  const hoursSinceCreated = timeSinceCreated / (1000 * 60 * 60)
  const timeFactor = Math.max(0.3, 1 - (hoursSinceCreated / (24 * 30))) // Decay over 30 days

  intensity *= timeFactor

  // Add some randomness for organic feel
  intensity += (Math.random() - 0.5) * 10

  return Math.max(10, Math.min(intensity, 85))
}

/**
 * Format Algorand address for display
 */
export function formatAlgorandAddress(address: string, length: number = 8): string {
  if (!address || address.length < length * 2) return address
  
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

/**
 * Convert microAlgos to Algos
 */
export function microAlgosToAlgos(microAlgos: number): number {
  return microAlgos / 1_000_000
}

/**
 * Convert Algos to microAlgos
 */
export function algosToMicroAlgos(algos: number): number {
  return Math.round(algos * 1_000_000)
}

/**
 * Generate a random beacon ID
 */
export function generateBeaconId(): string {
  return `beacon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate a random match ID
 */
export function generateMatchId(): string {
  return `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate a random chat room ID
 */
export function generateChatRoomId(): string {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if a beacon has expired
 */
export function isBeaconExpired(beacon: SoulBeacon): boolean {
  return new Date() > beacon.expiresAt
}

/**
 * Calculate days until beacon expires
 */
export function daysUntilExpiry(expiresAt: Date): number {
  const now = new Date()
  const diffTime = expiresAt.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

/**
 * Generate personality vector based on user traits
 */
export function generatePersonalityVector(traits: {
  openness: number        // 1-10
  conscientiousness: number // 1-10
  extraversion: number    // 1-10
  agreeableness: number   // 1-10
  neuroticism: number     // 1-10
}): number[] {
  // Normalize to 0-1 range and add some derived dimensions
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = traits
  
  return [
    openness / 10,
    conscientiousness / 10,
    extraversion / 10,
    agreeableness / 10,
    (10 - neuroticism) / 10, // Emotional stability (inverse of neuroticism)
    (openness + extraversion) / 20, // Enthusiasm
    (conscientiousness + agreeableness) / 20, // Compassion
    (extraversion + agreeableness) / 20, // Social warmth
    (openness + (10 - neuroticism)) / 20, // Resilience
    (conscientiousness + (10 - neuroticism)) / 20, // Self-control
  ]
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce utility
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle utility
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
