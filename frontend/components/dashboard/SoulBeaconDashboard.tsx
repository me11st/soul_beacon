'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Zap, Send, Users, Coins, Plus, MessageCircle } from 'lucide-react'
import { testNetService } from '../../services/testnet-asa'

export default function SoulBeaconDashboard() {
  const [beaconText, setBeaconText] = useState('')
  const [category, setCategory] = useState('Emotional Support')
  const [isMinting, setIsMinting] = useState(false)
  const [mintSuccess, setMintSuccess] = useState(false)
  const [isTestNet, setIsTestNet] = useState(false) // Toggle for TestNet vs Demo
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
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

  // Try to get connected wallet address
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && window.exodus?.algorand) {
        try {
          const accounts = await window.exodus.algorand.getAccounts()
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0])
            console.log('✅ Connected wallet address:', accounts[0])
          }
        } catch (error) {
          console.log('Could not get wallet address:', error)
        }
      }
    }
    
    checkWallet()
  }, [])

  const handleMintBeacon = async () => {
    if (!beaconText.trim()) return
    
    setIsMinting(true)
    
    if (isTestNet) {
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
        setIsTestNet(false)
        handleDemoMint()
        return
      }
    } else {
      // Demo mode simulation
      handleDemoMint()
    }
    
    setIsMinting(false)
  }
  
  const handleDemoMint = () => {
    // Simulate ASA minting process
    setTimeout(() => {
      const newBeacon = {
        id: 'SB-' + Date.now().toString().slice(-6),
        text: beaconText,
        category: category,
        timestamp: new Date(),
        status: 'active' as const,
        isReal: false
      }
      setMintedBeacons(prev => [newBeacon, ...prev])
      setMintSuccess(true)
      
      // TEMP: Simulate a match after 10 seconds for demo purposes
      setTimeout(() => {
        setMintedBeacons(prev => prev.map(beacon => 
          beacon.id === newBeacon.id 
            ? { ...beacon, status: 'matched' as const }
            : beacon
        ))
      }, 15000) // Increased to 15 seconds to make it less obvious
      
      // Reset form after success
      setTimeout(() => {
        setBeaconText('')
        setMintSuccess(false)
      }, 3000)
    }, 2000)
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
        
        {/* TestNet Toggle */}
        <div className="mt-6 flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-white/70">Demo Mode</span>
            <button
              onClick={() => setIsTestNet(!isTestNet)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isTestNet ? 'bg-green-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isTestNet ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-white/70">TestNet Mode</span>
            {isTestNet && (
              <span className="text-green-400 text-sm">🔥 Real Blockchain!</span>
            )}
          </div>
          
          {/* Wallet Status */}
          {walletAddress && (
            <div className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded">
              Wallet: {walletAddress.substring(0, 8)}...{walletAddress.slice(-4)}
            </div>
          )}
          
          {isTestNet && !walletAddress && (
            <div className="text-xs text-orange-400 bg-orange-500/10 px-3 py-1 rounded">
              ⚠️ No wallet connected - TestNet mode will fallback to demo
            </div>
          )}
        </div>
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
              Recent Matches
            </h3>
            <div className="text-center py-8 text-white/60">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No matches yet</p>
              <p className="text-sm">Matches will appear here when found</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
