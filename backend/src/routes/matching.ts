import { Router } from 'express'
import { aiMatchingService, UserSoulProfile, BeaconData } from '../services/ai-matching'
import { getUserApiKey } from './ai'

const router = Router()

// Temporary in-memory storage for user profiles and beacons
// TODO: Replace with actual database
const userProfiles = new Map<string, UserSoulProfile>()
const beaconHistory = new Map<string, BeaconData[]>()

// POST /api/matching/find - Find potential matches for a beacon using AI
router.post('/find', async (req, res) => {
  try {
    const { 
      beaconId, 
      beaconContent, 
      beaconCategory, 
      userAddress,
      userId,
      userPreferences 
    } = req.body
    
    console.log(`🔍 Finding matches for user ${userAddress}, beacon: "${beaconContent}"`)
    
    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' })
    }
    
    // Create beacon data
    const beacon: BeaconData = {
      id: beaconId,
      content: beaconContent,
      category: beaconCategory,
      creatorAddress: userAddress,
      timestamp: new Date()
    }
    
    // Store beacon in user's history
    if (!beaconHistory.has(userAddress)) {
      beaconHistory.set(userAddress, [])
    }
    beaconHistory.get(userAddress)!.push(beacon)
    
    // Get or create user profile
    let userProfile = userProfiles.get(userAddress)
    if (!userProfile) {
      const userBeacons = beaconHistory.get(userAddress) || []
      userProfile = aiMatchingService.createUserProfile(userAddress, userBeacons)
      userProfiles.set(userAddress, userProfile)
      console.log(`✨ Created new soul profile for ${userAddress}:`, userProfile)
    }
    
    // Get all other user profiles for matching
    const allProfiles = Array.from(userProfiles.values())
    console.log(`🧠 Analyzing ${allProfiles.length} total profiles for matches`)
    
    // Get user's OpenAI API key for real AI analysis
    const userApiKey = userId ? getUserApiKey(userId) : undefined
    if (userApiKey) {
      console.log('🔑 Using user\'s OpenAI API key for real AI analysis')
    } else {
      console.log('🎭 No API key found, using mock AI analysis')
    }
    
    // Use AI to find matches (excludes self automatically)
    const matches = await aiMatchingService.findMatches(
      userAddress,
      beacon,
      userProfile,
      allProfiles,
      userApiKey
    )
    
    console.log(`💫 Found ${matches.length} compatible matches with resonance >= 70%`)
    
    // If no real users found, create demo matches for testing
    if (matches.length === 0) {
      console.log('🎪 No real matches found, creating demo matches for testing...')
      await createDemoUsers()
      
      const demoProfiles = Array.from(userProfiles.values())
      const demoMatches = await aiMatchingService.findMatches(
        userAddress,
        beacon,
        userProfile,
        demoProfiles
      )
      
      res.json({
        matches: demoMatches.map(match => ({
          id: match.matchId,
          beaconId: beacon.id,
          title: `${match.partnerName}'s Resonance`,
          description: `Soul connection through ${beacon.category}`,
          resonanceScore: match.resonanceScore,
          userAddress: match.partnerAddress,
          userName: match.partnerName,
          matchReasons: match.matchReasons,
          roomId: match.roomId
        })),
        total: demoMatches.length,
        algorithm: 'ai-soul-resonance-v1',
        userProfile: userProfile // Send back the user's analyzed profile
      })
    } else {
      res.json({
        matches: matches.map(match => ({
          id: match.matchId,
          beaconId: beacon.id,
          title: `${match.partnerName}'s Resonance`,
          description: `Soul connection through ${beacon.category}`,
          resonanceScore: match.resonanceScore,
          userAddress: match.partnerAddress,
          userName: match.partnerName,
          matchReasons: match.matchReasons,
          roomId: match.roomId
        })),
        total: matches.length,
        algorithm: 'ai-soul-resonance-v1',
        userProfile: userProfile
      })
    }
  } catch (error) {
    console.error('❌ Matching error:', error)
    res.status(500).json({ error: 'Failed to find matches' })
  }
})

// Helper function to create demo users for testing
async function createDemoUsers() {
  const demoUsers = [
    {
      address: 'DEMO_CREATIVE_USER_123',
      beacons: [
        { content: 'Looking for artistic collaboration on digital art project', category: 'Creative Collaboration' },
        { content: 'Seeking creative minds for music and visual storytelling', category: 'Creative Collaboration' }
      ]
    },
    {
      address: 'DEMO_INTELLECTUAL_USER_456', 
      beacons: [
        { content: 'Want to discuss philosophy and consciousness with deep thinkers', category: 'Intellectual Discussion' },
        { content: 'Exploring quantum physics and its implications for reality', category: 'Intellectual Discussion' }
      ]
    },
    {
      address: 'DEMO_SUPPORTIVE_USER_789',
      beacons: [
        { content: 'Here to provide emotional support during difficult times', category: 'Emotional Support' },
        { content: 'Looking for empathetic souls to share feelings and experiences', category: 'Emotional Support' }
      ]
    }
  ]
  
  for (const demo of demoUsers) {
    if (!userProfiles.has(demo.address)) {
      const beacons = demo.beacons.map((b, index) => ({
        id: `demo-beacon-${demo.address}-${index}`,
        content: b.content,
        category: b.category,
        creatorAddress: demo.address,
        timestamp: new Date()
      }))
      
      beaconHistory.set(demo.address, beacons)
      const profile = aiMatchingService.createUserProfile(demo.address, beacons)
      userProfiles.set(demo.address, profile)
      console.log(`👤 Created demo user profile: ${demo.address}`)
    }
  }
}

// POST /api/matching/connect - Initiate connection between matched users
router.post('/connect', async (req, res) => {
  try {
    const { beaconId, matchId, userAddress } = req.body
    
    // TODO: Create connection record in database
    // TODO: Trigger ASA token distribution (70/30 split)
    // TODO: Setup chat room for matched users
    
    const connection = {
      id: `connection-${Date.now()}`,
      beaconId,
      matchId,
      userAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
      tokenDistribution: {
        requestor: 70, // 70% to beacon creator
        matcher: 30    // 30% to matcher
      }
    }
    
    res.status(201).json({
      message: 'Connection initiated successfully',
      connection,
      nextStep: 'Waiting for other party to accept'
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate connection' })
  }
})

// GET /api/matching/connections - Get user's connections
router.get('/connections', async (req, res) => {
  try {
    const { userAddress } = req.query
    
    // TODO: Fetch connections from database
    const mockConnections = [
      {
        id: 'connection-1',
        beaconTitle: 'Photography Collaboration',
        partnerName: 'Alex Creative',
        partnerAddress: '0x789...',
        status: 'active',
        resonanceScore: 94,
        connectedAt: new Date().toISOString(),
        chatActive: true,
        tokenDistribution: {
          completed: true,
          yourShare: 70,
          partnerShare: 30
        }
      }
    ]
    
    res.json({
      connections: mockConnections,
      total: mockConnections.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch connections' })
  }
})

// PUT /api/matching/connections/:id - Update connection status
router.put('/connections/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status, action } = req.body
    
    // TODO: Update connection in database
    // TODO: Handle token distribution if connection is accepted
    
    res.json({
      message: `Connection ${action} successfully`,
      connectionId: id,
      newStatus: status
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update connection' })
  }
})

// POST /api/matching/ai-analyze - Analyze compatibility using AI
router.post('/ai-analyze', async (req, res) => {
  try {
    const { beacon1, beacon2, userProfiles } = req.body
    
    // TODO: Integrate with OpenAI API for deep compatibility analysis
    // TODO: Analyze text similarity, interests, communication styles
    
    const analysis = {
      overallCompatibility: 89,
      dimensionScores: {
        interests: 92,
        communicationStyle: 85,
        availability: 90,
        goals: 88
      },
      insights: [
        'Both users show strong creative tendencies',
        'Compatible communication preferences detected',
        'Shared interest in outdoor activities',
        'Complementary skill sets identified'
      ],
      recommendation: 'high-compatibility',
      confidence: 0.89
    }
    
    res.json({
      analysis,
      model: 'gpt-4-turbo',
      analyzedAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform AI analysis' })
  }
})

export default router
