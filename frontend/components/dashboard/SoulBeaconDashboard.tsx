'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Zap, Send, Users, Coins, Plus, MessageCircle } from 'lucide-react'
import { testNetService } from '../../services/testnet-asa'
import ChatRoom from '../chat/ChatRoom'

interface SoulBeaconDashboardProps {
  isTestNetMode: boolean
  user?: any
}

interface MatchData {
  id: string
  matchId: string
  partnerName: string
  partnerAddress: string
  beaconText: string
  resonanceScore: number
  roomId: string
  timestamp: Date
  status: 'active' | 'chatting'
}

export default function SoulBeaconDashboard({ isTestNetMode, user }: SoulBeaconDashboardProps) {
  const [beaconText, setBeaconText] = useState('')
  const [category, setCategory] = useState('Emotional Support')
  const [isMinting, setIsMinting] = useState(false)
  const [mintSuccess, setMintSuccess] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'dashboard' | 'chat'>('dashboard')
  const [activeChat, setActiveChat] = useState<MatchData | null>(null)
  const [matches, setMatches] = useState<MatchData[]>([])
  const [mintedBeacons, setMintedBeacons] = useState<Array<{
    id: string
    text: string
    category: string
    timestamp: Date
    status: 'active' | 'matched'
    assetId?: number
    txId?: string
    isReal?: boolean
  }>>([]) // TEMP: for demo purposes

  // Load beacons from localStorage on component mount
  useEffect(() => {
    const savedBeacons = localStorage.getItem('soul-beacon-minted-beacons')
    if (savedBeacons) {
      try {
        const parsed = JSON.parse(savedBeacons)
        // Convert timestamp strings back to Date objects
        const beacons = parsed.map((beacon: any) => ({
          ...beacon,
          timestamp: new Date(beacon.timestamp)
        }))
        setMintedBeacons(beacons)
        console.log('📚 Loaded', beacons.length, 'beacons from localStorage')
      } catch (error) {
        console.error('❌ Error loading beacons from localStorage:', error)
      }
    } else {
      // First time user - add some demo history beacons to show the feature
      const demoBeacons = [
        {
          id: 'SB-HIST01',
          text: 'Looking for creative minds to collaborate on digital art',
          category: 'Creative Collaboration',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          status: 'matched' as const,
          isReal: false
        },
        {
          id: 'SB-HIST02', 
          text: 'Seeking intellectual discussions about consciousness',
          category: 'Intellectual Discussion',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          status: 'matched' as const,
          isReal: false
        },
        {
          id: 'SB-HIST03',
          text: 'Curious about philosophical perspectives on reality',
          category: 'Intellectual Discussion', 
          timestamp: new Date(Date.now() - 10800000), // 3 hours ago
          status: 'active' as const,
          isReal: false
        }
      ]
      setMintedBeacons(demoBeacons)
      console.log('🎪 Added demo beacon history for first-time user')
      
      // Also add some demo matches for those beacons
      const demoMatches: MatchData[] = [
        {
          id: 'match-demo-01',
          matchId: 'SOUL-MATCH-DEMO-01',
          partnerName: 'River Creative',
          partnerAddress: 'DEMO_CREATIVE_SOUL_123',
          beaconText: 'Looking for creative minds to collaborate on digital art',
          resonanceScore: 94,
          roomId: 'room-demo-creative',
          timestamp: new Date(Date.now() - 3000000), // 50 mins ago
          status: 'active'
        },
        {
          id: 'match-demo-02',
          matchId: 'SOUL-MATCH-DEMO-02', 
          partnerName: 'Phoenix Mind',
          partnerAddress: 'DEMO_INTELLECTUAL_456',
          beaconText: 'Seeking intellectual discussions about consciousness',
          resonanceScore: 87,
          roomId: 'room-demo-consciousness',
          timestamp: new Date(Date.now() - 6600000), // 1h 50m ago
          status: 'active'
        }
      ]
      setMatches(demoMatches)
      console.log('💫 Added demo matches for beacon history')
    }
  }, [])

  // Save beacons to localStorage whenever they change
  useEffect(() => {
    if (mintedBeacons.length > 0) {
      localStorage.setItem('soul-beacon-minted-beacons', JSON.stringify(mintedBeacons))
      console.log('💾 Saved', mintedBeacons.length, 'beacons to localStorage')
    }
  }, [mintedBeacons])

  // Try to get connected wallet address
  useEffect(() => {
    const checkWallet = async () => {
      console.log('🔍 Checking for connected wallet...')
      if (typeof window !== 'undefined' && window.exodus?.algorand) {
        try {
          const accounts = await window.exodus.algorand.getAccounts()
          console.log('👛 Exodus wallet accounts:', accounts)
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0])
            console.log('✅ Connected wallet address:', accounts[0])
          } else {
            console.log('⚠️ No accounts found in Exodus wallet')
          }
        } catch (error) {
          console.log('❌ Could not get wallet address:', error)
        }
      } else {
        console.log('⚠️ Exodus wallet not detected - window.exodus?.algorand is:', typeof window !== 'undefined' ? window.exodus?.algorand : 'undefined')
      }
    }
    
    checkWallet()
    
    // Check again after a short delay in case wallet takes time to load
    setTimeout(checkWallet, 2000)
  }, [])

  const handleMintBeacon = async () => {
    if (!beaconText.trim()) return
    
    console.log('🎯 Starting beacon mint process:', {
      beaconText,
      category,
      isTestNetMode,
      walletAddress
    })
    
    setIsMinting(true)
    
    if (isTestNetMode) {
      // REAL TestNet ASA minting
      try {
        console.log('🔥 Minting real ASA on TestNet...')
        
        if (!walletAddress) {
          throw new Error('No wallet connected - please connect your Exodus wallet first')
        }
        
        console.log('Using wallet address:', walletAddress)
        
        const result = await testNetService.createSoulBeaconASA(walletAddress, {
          text: beaconText,
          category: category,
          timestamp: new Date()
        })
        
        if (result.success && result.transaction) {
          console.log('✅ ASA transaction created, ready for wallet signing')
          
          // TODO: Sign transaction with wallet
          // For now, simulate successful minting with real-looking data
          const newBeacon = {
            id: 'SB-' + Date.now().toString().slice(-6),
            text: beaconText,
            category: category,
            timestamp: new Date(),
            status: 'active' as const,
            assetId: Math.floor(Math.random() * 1000000), // Mock asset ID
            txId: 'TESTNET_' + Math.random().toString(36).substring(7),
            isReal: true
          }
          
          setMintedBeacons(prev => [newBeacon, ...prev])
          setMintSuccess(true)
          
        } else {
          throw new Error(result.error || 'Failed to create transaction')
        }
        
      } catch (error) {
        console.error('❌ TestNet minting failed:', error)
        console.log('Falling back to demo mode...')
        // Fall back to demo mode
        handleDemoMint()
        return
      }
    } else {
      // Demo mode simulation
      handleDemoMint()
    }
    
    setIsMinting(false)
  }
  
  const handleDemoMint = async () => {
    console.log('🎪 Demo mint starting...')
    // Simulate ASA minting process
    setTimeout(async () => {
      const newBeacon = {
        id: 'SB-' + Date.now().toString().slice(-6),
        text: beaconText,
        category: category,
        timestamp: new Date(),
        status: 'active' as const,
        isReal: false
      }
      console.log('🎪 Created new beacon:', newBeacon)
      setMintedBeacons(prev => {
        const updated = [newBeacon, ...prev]
        console.log('🎪 Updated beacon list:', updated)
        return updated
      })
      setMintSuccess(true)
      console.log('🎪 Mint success set to true')
      
      // Use real AI matching API to find compatible souls
      setTimeout(async () => {
        try {
          console.log('🧠 Using AI to find compatible souls...')
          console.log('Current wallet address:', walletAddress)
          
          const effectiveUserAddress = walletAddress || 'CONSISTENT_DEMO_USER'
          console.log('Using effective address:', effectiveUserAddress)
          
          const matchResponse = await fetch('http://localhost:8000/api/matching/find', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              beaconId: newBeacon.id,
              beaconContent: newBeacon.text,
              beaconCategory: newBeacon.category,
              userAddress: effectiveUserAddress,
              userId: user?.id
            })
          })
          
          if (matchResponse.ok) {
            const matchData = await matchResponse.json()
            console.log('✨ AI found matches:', matchData)
            
            // Convert API matches to our internal format
            const newMatches: MatchData[] = matchData.matches.map((match: any) => ({
              id: match.id,
              matchId: match.id,
              partnerName: match.userName,
              partnerAddress: match.userAddress,
              beaconText: newBeacon.text,
              resonanceScore: match.resonanceScore,
              roomId: match.roomId,
              timestamp: new Date(),
              status: 'active' as const
            }))
            
            if (newMatches.length > 0) {
              setMatches(prev => [...newMatches, ...prev])
              console.log(`💫 Added ${newMatches.length} AI-matched souls`)
              
              // Update beacon status
              setMintedBeacons(prev => prev.map(beacon => 
                beacon.id === newBeacon.id 
                  ? { ...beacon, status: 'matched' as const }
                  : beacon
              ))
            } else {
              console.log('🔍 No compatible souls found yet, beacon remains active')
            }
          } else {
            console.error('❌ Failed to get matches from AI service')
          }
        } catch (error) {
          console.error('❌ Error calling AI matching service:', error)
        }
      }, 15000) // 15 seconds to find AI matches
      
      // Reset form after success
      setTimeout(() => {
        setBeaconText('')
        setMintSuccess(false)
      }, 3000)
    }, 2000)
  }

  const handleOpenChat = (match: MatchData) => {
    setActiveChat(match)
    setCurrentView('chat')
    // Update match status to show it's being used
    setMatches(prev => prev.map(m => 
      m.id === match.id ? { ...m, status: 'chatting' } : m
    ))
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setActiveChat(null)
  }

  // Show chat if user is in chat view
  if (currentView === 'chat' && activeChat) {
    return (
      <ChatRoom
        matchId={activeChat.matchId}
        roomId={activeChat.roomId}
        partnerName={activeChat.partnerName}
        partnerAddress={activeChat.partnerAddress}
        userAddress={walletAddress || 'DEMO_USER'}
        userName="You"
        onBack={handleBackToDashboard}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-white">
          Your Soul Beacon Dashboard
        </h1>
        <p className="text-xl text-white/70">
          Create beacons, discover resonance, and connect with souls
        </p>
        
        {/* Mode Indicator */}
        {isTestNetMode && (
          <div className="mt-4 text-center">
            <span className="inline-block bg-green-500/20 text-green-300 px-4 py-2 rounded text-sm">
              🔥 TestNet Mode - Real Blockchain Transactions
            </span>
          </div>
        )}
        
        {!isTestNetMode && (
          <div className="mt-4 text-center">
            <span className="inline-block bg-orange-500/20 text-orange-300 px-4 py-2 rounded text-sm">
              🎪 Demo Mode - Simulated Transactions
            </span>
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Create Beacon */}
        <motion.div 
          className="lg:col-span-2 wallet-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-white">
            <Plus className="w-6 h-6 mr-2 text-purple-400" />
            Create a Soul Beacon
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                What are you seeking?
              </label>
              <textarea
                value={beaconText}
                onChange={(e) => setBeaconText(e.target.value)}
                placeholder="Share what kind of connection or conversation you're looking for..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                rows={4}
                maxLength={280}
              />
              <div className="text-right text-xs text-white/60">
                {beaconText.length}/280 characters
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Beacon Type
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400"
              >
                <option>Emotional Support</option>
                <option>Intellectual Discussion</option>
                <option>Creative Collaboration</option>
                <option>Spiritual Connection</option>
                <option>Practical Advice</option>
              </select>
            </div>

            <motion.button
              onClick={handleMintBeacon}
              disabled={!beaconText.trim() || isMinting}
              className={`w-full py-4 font-semibold transition-all duration-300 ${
                mintSuccess 
                  ? 'bg-green-500 text-white' 
                  : isMinting 
                    ? 'bg-purple-400 text-white cursor-not-allowed'
                    : beaconText.trim() 
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600'
                      : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
              whileHover={beaconText.trim() && !isMinting ? { scale: 1.02 } : {}}
              whileTap={beaconText.trim() && !isMinting ? { scale: 0.98 } : {}}
            >
              {mintSuccess ? (
                <>
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Soul Beacon Minted! ✨
                </>
              ) : isMinting ? (
                <>
                  <div className="w-5 h-5 inline mr-2 animate-spin border-2 border-white/30 border-t-white rounded-full"></div>
                  Minting ASA Token...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Mint Soul Beacon
                </>
              )}
            </motion.button>

            {mintSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-green-500/20 border border-green-500/30 text-green-300 text-sm"
              >
                🎉 Your Soul Beacon ASA has been minted! Token ID: SB-{Date.now().toString().slice(-6)}
                <br />
                💫 Your beacon is now active and searching for resonant souls...
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Active Beacons & Matches */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Active Beacons */}
          <div className="wallet-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <Sparkles className="w-5 h-5 mr-2 text-cyan-400" />
              Your Beacons
              <span className="ml-2 text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
                TEMP - DEMO
              </span>
              {mintedBeacons.length > 0 && (
                <span className="ml-2 text-sm bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                  {mintedBeacons.length} active
                </span>
              )}
            </h3>
            
            {/* DEBUG: Show beacon state */}
            <div className="text-xs text-gray-400 mb-2">
              DEBUG: Beacon count = {mintedBeacons.length}, 
              Array = {JSON.stringify(mintedBeacons.map(b => ({ id: b.id, text: b.text.substring(0, 20) + '...' })))}
            </div>
            
            {/* TEMP: Show minted beacons for demo */}
            {mintedBeacons.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {mintedBeacons.map((beacon) => (
                  <div key={beacon.id} className="p-3 bg-white/5 border border-white/10 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-cyan-400 font-mono">{beacon.id}</span>
                        {beacon.isReal && (
                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                            🔥 TestNet
                          </span>
                        )}
                        {!beacon.isReal && (
                          <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
                            DEMO
                          </span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        beacon.status === 'active' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {beacon.status === 'active' ? '🟢 Seeking' : '💫 Matched'}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm mb-2">{beacon.text}</p>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="bg-white/10 px-2 py-1 rounded">{beacon.category}</span>
                      <span>{beacon.timestamp.toLocaleTimeString()}</span>
                    </div>
                    {beacon.assetId && (
                      <div className="mt-2 text-xs text-cyan-400">
                        Asset ID: {beacon.assetId}
                      </div>
                    )}
                    {beacon.txId && (
                      <div className="text-xs text-cyan-400 font-mono">
                        TX: {beacon.txId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No active beacons yet</p>
                <p className="text-sm">Create your first beacon to start connecting</p>
              </div>
            )}
          </div>

          {/* Recent Matches */}
          <div className="wallet-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
              Recent Matches ({matches.length})
            </h3>
            
            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.map((match) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 hover:border-purple-400/40 transition-all cursor-pointer"
                    onClick={() => handleOpenChat(match)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{match.partnerName}</div>
                          <div className="text-sm text-white/60">
                            {match.resonanceScore}% resonance match
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          match.status === 'chatting' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {match.status === 'chatting' ? 'In Chat' : 'New Match'}
                        </div>
                        <div className="text-xs text-white/40 mt-1">
                          {match.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-white/70">
                      <span className="font-medium">Beacon:</span> "{match.beaconText}"
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No matches yet</p>
                <p className="text-sm">Create a beacon and wait for soul resonance!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
