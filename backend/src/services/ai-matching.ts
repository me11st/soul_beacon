import OpenAI from 'openai'

interface UserSoulProfile {
  walletAddress: string
  interests: string[]
  values: string[]
  communicationStyle: 'direct' | 'empathetic' | 'analytical' | 'creative'
  energyLevel: 'high' | 'medium' | 'low'
  recentBeacons: Array<{
    content: string
    category: string
    timestamp: Date
  }>
  interactionHistory: Array<{
    type: string
    content: string
    resonanceScore: number
    timestamp: Date
  }>
}

interface BeaconData {
  id: string
  content: string
  category: string
  creatorAddress: string
  timestamp: Date
}

interface MatchResult {
  matchId: string
  partnerAddress: string
  partnerName: string
  resonanceScore: number
  matchReasons: string[]
  roomId: string
}

class AIMatchingService {
  private openai: OpenAI | null = null
  
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey) {
      this.openai = new OpenAI({ apiKey })
    } else {
      console.warn('⚠️ OpenAI API key not found - using mock AI responses')
    }
  }

  /**
   * Find compatible matches for a user's beacon, excluding self
   */
  async findMatches(
    userAddress: string,
    beacon: BeaconData,
    userProfile: UserSoulProfile,
    availableProfiles: UserSoulProfile[],
    userApiKey?: string
  ): Promise<MatchResult[]> {
    
    // CRITICAL: Prevent self-matching
    const othersProfiles = availableProfiles.filter(
      profile => profile.walletAddress.toLowerCase() !== userAddress.toLowerCase()
    )
    
    if (othersProfiles.length === 0) {
      console.log('🔍 No other users available for matching')
      return []
    }
    
    console.log(`🧠 AI analyzing ${othersProfiles.length} potential matches for ${userAddress}`)
    
    const matches: MatchResult[] = []
    
    for (const candidateProfile of othersProfiles) {
      try {
        const resonanceAnalysis = await this.analyzeResonance(
          userProfile,
          candidateProfile,
          beacon,
          userApiKey
        )
        
        if (resonanceAnalysis.resonanceScore >= 70) { // Minimum threshold
          const match: MatchResult = {
            matchId: `SOUL-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            partnerAddress: candidateProfile.walletAddress,
            partnerName: this.generatePersonaName(candidateProfile),
            resonanceScore: resonanceAnalysis.resonanceScore,
            matchReasons: resonanceAnalysis.reasons,
            roomId: `room-${Date.now()}-${Math.random().toString(36).substring(7)}`
          }
          
          matches.push(match)
        }
      } catch (error) {
        console.error('❌ Error analyzing candidate:', error)
      }
    }
    
    // Sort by resonance score (highest first)
    return matches.sort((a, b) => b.resonanceScore - a.resonanceScore)
  }

  /**
   * Use AI to analyze soul resonance between two profiles
   */
  private async analyzeResonance(
    userProfile: UserSoulProfile,
    candidateProfile: UserSoulProfile,
    beacon: BeaconData,
    userApiKey?: string
  ): Promise<{ resonanceScore: number; reasons: string[] }> {
    
    // Use provided API key if available, otherwise fall back to environment or mock
    if (userApiKey) {
      const tempOpenAI = new OpenAI({ apiKey: userApiKey })
      return this.aiResonanceAnalysisWithInstance(userProfile, candidateProfile, beacon, tempOpenAI)
    } else if (this.openai) {
      return this.aiResonanceAnalysis(userProfile, candidateProfile, beacon)
    } else {
      return this.mockResonanceAnalysis(userProfile, candidateProfile, beacon)
    }
  }

  /**
   * Real AI analysis using OpenAI
   */
  private async aiResonanceAnalysis(
    userProfile: UserSoulProfile,
    candidateProfile: UserSoulProfile,
    beacon: BeaconData
  ): Promise<{ resonanceScore: number; reasons: string[] }> {
    
    const prompt = `
Analyze the soul resonance between two users for a meaningful connection:

USER 1 (Beacon Creator):
- Interests: ${userProfile.interests.join(', ')}
- Values: ${userProfile.values.join(', ')}
- Communication: ${userProfile.communicationStyle}
- Energy: ${userProfile.energyLevel}
- Recent Beacon: "${beacon.content}" (${beacon.category})

USER 2 (Potential Match):
- Interests: ${candidateProfile.interests.join(', ')}
- Values: ${candidateProfile.values.join(', ')}
- Communication: ${candidateProfile.communicationStyle}
- Energy: ${candidateProfile.energyLevel}

Calculate resonance compatibility (0-100) and provide 2-3 specific reasons.
Focus on: shared values, complementary strengths, communication compatibility, and mutual growth potential.

Respond in JSON format:
{
  "resonanceScore": <number>,
  "reasons": ["reason 1", "reason 2", "reason 3"]
}
`

    try {
      const response = await this.openai!.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })

      const result = JSON.parse(response.choices[0].message.content || '{}')
      return {
        resonanceScore: result.resonanceScore || 0,
        reasons: result.reasons || []
      }
    } catch (error) {
      console.error('❌ OpenAI analysis failed:', error)
      // Fallback to mock analysis
      return this.mockResonanceAnalysis(userProfile, candidateProfile, beacon)
    }
  }

  /**
   * Real AI analysis using provided OpenAI instance
   */
  private async aiResonanceAnalysisWithInstance(
    userProfile: UserSoulProfile,
    candidateProfile: UserSoulProfile,
    beacon: BeaconData,
    openaiInstance: OpenAI
  ): Promise<{ resonanceScore: number; reasons: string[] }> {
    
    const prompt = `
Analyze the soul resonance between two users for a meaningful connection:

USER 1 (Beacon Creator):
- Interests: ${userProfile.interests.join(', ')}
- Values: ${userProfile.values.join(', ')}
- Communication: ${userProfile.communicationStyle}
- Energy: ${userProfile.energyLevel}
- Recent Beacon: "${beacon.content}" (${beacon.category})

USER 2 (Potential Match):
- Interests: ${candidateProfile.interests.join(', ')}
- Values: ${candidateProfile.values.join(', ')}
- Communication: ${candidateProfile.communicationStyle}
- Energy: ${candidateProfile.energyLevel}

Calculate resonance compatibility (0-100) and provide 2-3 specific reasons.
Focus on: shared values, complementary strengths, communication compatibility, and mutual growth potential.

Respond in JSON format:
{
  "resonanceScore": <number>,
  "reasons": ["reason 1", "reason 2", "reason 3"]
}
`

    try {
      console.log('🤖 Using user\'s OpenAI API key for real AI analysis')
      const response = await openaiInstance.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })

      const result = JSON.parse(response.choices[0].message.content || '{}')
      return {
        resonanceScore: result.resonanceScore || 0,
        reasons: result.reasons || []
      }
    } catch (error) {
      console.error('❌ User OpenAI API key analysis failed:', error)
      // Fallback to mock analysis
      return this.mockResonanceAnalysis(userProfile, candidateProfile, beacon)
    }
  }

  /**
   * Sophisticated mock analysis when AI is not available
   */
  private mockResonanceAnalysis(
    userProfile: UserSoulProfile,
    candidateProfile: UserSoulProfile,
    beacon: BeaconData
  ): Promise<{ resonanceScore: number; reasons: string[] }> {
    
    let score = 50 // Base compatibility
    const reasons: string[] = []
    
    // Interest alignment
    const sharedInterests = userProfile.interests.filter(interest =>
      candidateProfile.interests.includes(interest)
    )
    if (sharedInterests.length > 0) {
      score += sharedInterests.length * 10
      reasons.push(`Shared interests in ${sharedInterests.join(' and ')}`)
    }
    
    // Values resonance
    const sharedValues = userProfile.values.filter(value =>
      candidateProfile.values.includes(value)
    )
    if (sharedValues.length > 0) {
      score += sharedValues.length * 15
      reasons.push(`Aligned values around ${sharedValues.join(' and ')}`)
    }
    
    // Communication compatibility
    const communicationMatch = userProfile.communicationStyle === candidateProfile.communicationStyle
    if (communicationMatch) {
      score += 10
      reasons.push(`Compatible ${userProfile.communicationStyle} communication styles`)
    }
    
    // Energy balance
    const energyCompatible = this.isEnergyCompatible(userProfile.energyLevel, candidateProfile.energyLevel)
    if (energyCompatible) {
      score += 8
      reasons.push('Complementary energy levels for balanced connection')
    }
    
    // Category relevance to beacon
    if (this.isCategoryRelevant(beacon.category, candidateProfile)) {
      score += 12
      reasons.push(`Strong alignment with ${beacon.category.toLowerCase()} interests`)
    }
    
    // Cap at 100
    score = Math.min(score, 99)
    
    return Promise.resolve({ 
      resonanceScore: score, 
      reasons: reasons.slice(0, 3) // Top 3 reasons
    })
  }

  private isEnergyCompatible(energy1: string, energy2: string): boolean {
    // High energy works with medium/high, medium works with all, low works with low/medium
    const compatibility = {
      'high': ['high', 'medium'],
      'medium': ['high', 'medium', 'low'],
      'low': ['medium', 'low']
    }
    return compatibility[energy1 as keyof typeof compatibility]?.includes(energy2) || false
  }

  private isCategoryRelevant(category: string, profile: UserSoulProfile): boolean {
    const categoryKeywords = {
      'Emotional Support': ['empathy', 'support', 'emotional', 'caring'],
      'Intellectual Discussion': ['learning', 'philosophy', 'science', 'analysis'],
      'Creative Collaboration': ['art', 'music', 'creativity', 'design'],
      'Spiritual Growth': ['spirituality', 'mindfulness', 'growth', 'meditation'],
      'Practical Help': ['skills', 'practical', 'problem-solving', 'assistance']
    }
    
    const keywords = categoryKeywords[category as keyof typeof categoryKeywords] || []
    return profile.interests.some(interest => 
      keywords.some(keyword => interest.toLowerCase().includes(keyword))
    )
  }

  private generatePersonaName(profile: UserSoulProfile): string {
    const creativeNames = ['River Soul', 'Luna Mind', 'Phoenix Heart', 'Sage Walker', 'Nova Dream']
    const analyticalNames = ['Alex Logic', 'Sam Insight', 'Morgan Data', 'Casey System', 'Quinn Method']
    const empatheticNames = ['Jordan Care', 'Avery Heart', 'Riley Support', 'Cameron Love', 'Drew Kindness']
    const directNames = ['Taylor Direct', 'Blake Clear', 'Reese Focus', 'Sage Honest', 'River Truth']
    
    const namesByStyle = {
      'creative': creativeNames,
      'analytical': analyticalNames,
      'empathetic': empatheticNames,
      'direct': directNames
    }
    
    const names = namesByStyle[profile.communicationStyle] || creativeNames
    return names[Math.floor(Math.random() * names.length)]
  }

  /**
   * Create a user profile from wallet interactions and beacon history
   */
  createUserProfile(
    walletAddress: string,
    beaconHistory: Array<{ content: string; category: string; timestamp: Date }>,
    interactionData?: any
  ): UserSoulProfile {
    
    // Analyze beacon content to infer interests and values
    const interests = this.extractInterests(beaconHistory)
    const values = this.extractValues(beaconHistory)
    const communicationStyle = this.inferCommunicationStyle(beaconHistory)
    const energyLevel = this.inferEnergyLevel(beaconHistory)
    
    return {
      walletAddress,
      interests,
      values,
      communicationStyle,
      energyLevel,
      recentBeacons: beaconHistory.slice(0, 5), // Last 5 beacons
      interactionHistory: [] // TODO: Implement interaction tracking
    }
  }

  private extractInterests(beacons: Array<{ content: string; category: string }>): string[] {
    const interests = new Set<string>()
    
    beacons.forEach(beacon => {
      // Add category as an interest
      interests.add(beacon.category.toLowerCase())
      
      // Extract keywords from content
      const keywords = this.extractKeywords(beacon.content)
      keywords.forEach(keyword => interests.add(keyword))
    })
    
    return Array.from(interests).slice(0, 8) // Top 8 interests
  }

  private extractValues(beacons: Array<{ content: string; category: string }>): string[] {
    const valueKeywords = {
      'authenticity': ['genuine', 'real', 'authentic', 'honest'],
      'growth': ['learn', 'grow', 'develop', 'improve'],
      'connection': ['connect', 'relationship', 'bond', 'together'],
      'creativity': ['create', 'art', 'creative', 'imagination'],
      'compassion': ['help', 'care', 'support', 'empathy'],
      'adventure': ['explore', 'adventure', 'discover', 'new']
    }
    
    const values = new Set<string>()
    
    beacons.forEach(beacon => {
      const content = beacon.content.toLowerCase()
      Object.entries(valueKeywords).forEach(([value, keywords]) => {
        if (keywords.some(keyword => content.includes(keyword))) {
          values.add(value)
        }
      })
    })
    
    return Array.from(values).slice(0, 5)
  }

  private extractKeywords(content: string): string[] {
    // Simple keyword extraction - could be enhanced with NLP
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
    
    return [...new Set(words)].slice(0, 5)
  }

  private inferCommunicationStyle(beacons: Array<{ content: string }>): 'direct' | 'empathetic' | 'analytical' | 'creative' {
    let directScore = 0
    let empatheticScore = 0
    let analyticalScore = 0
    let creativeScore = 0
    
    beacons.forEach(beacon => {
      const content = beacon.content.toLowerCase()
      
      // Direct indicators
      if (/\b(need|want|looking for|seeking)\b/.test(content)) directScore++
      
      // Empathetic indicators
      if (/\b(feel|emotion|support|care|understand)\b/.test(content)) empatheticScore++
      
      // Analytical indicators
      if (/\b(analyze|think|logic|system|method)\b/.test(content)) analyticalScore++
      
      // Creative indicators
      if (/\b(create|art|imagine|design|expression)\b/.test(content)) creativeScore++
    })
    
    const scores = { direct: directScore, empathetic: empatheticScore, analytical: analyticalScore, creative: creativeScore }
    const maxEntry = Object.entries(scores).reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b)
    return maxEntry[0] as 'direct' | 'empathetic' | 'analytical' | 'creative'
  }

  private inferEnergyLevel(beacons: Array<{ content: string }>): 'high' | 'medium' | 'low' {
    let energyScore = 0
    
    beacons.forEach(beacon => {
      const content = beacon.content.toLowerCase()
      
      // High energy indicators
      if (/\b(exciting|adventure|active|energy|passionate)\b/.test(content)) energyScore += 2
      
      // Medium energy indicators
      if (/\b(explore|learn|discover|connect)\b/.test(content)) energyScore += 1
      
      // Low energy indicators (doesn't reduce score, just doesn't add)
      if (/\b(calm|peaceful|quiet|reflect|meditate)\b/.test(content)) energyScore += 0
    })
    
    if (energyScore >= 4) return 'high'
    if (energyScore >= 2) return 'medium'
    return 'low'
  }
}

export const aiMatchingService = new AIMatchingService()
export { UserSoulProfile, BeaconData, MatchResult }
