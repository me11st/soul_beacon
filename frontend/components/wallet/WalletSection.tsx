'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, ChevronRight, AlertCircle } from 'lucide-react'

interface WalletSectionProps {
  onWalletConnected: (connected: boolean) => void
}

// Add wallet detection types
declare global {
  interface Window {
    exodus?: {
      algorand: {
        connect(): Promise<string[]>
        disconnect(): Promise<void>
        getAccounts(): Promise<string[]>
      }
    }
  }
}

export default function WalletSection({ onWalletConnected }: WalletSectionProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleConnectWallet = async (walletType: string) => {
    setConnecting(walletType)
    setError(null)
    setSuccess(null)
    
    try {
      let connected = false
      let walletAddress = ''
      
      if (walletType === 'Exodus') {
        // Real Exodus wallet connection
        if (typeof window !== 'undefined' && window.exodus) {
          try {
            console.log('Exodus detected, attempting connection...')
            
            // First check if Algorand is available
            if (!window.exodus.algorand) {
              throw new Error('Algorand support not available in Exodus. Please enable Algorand in your Exodus wallet.')
            }
            
            const accounts = await window.exodus.algorand.connect()
            console.log('Exodus connection result:', accounts)
            
            if (accounts && accounts.length > 0) {
              walletAddress = accounts[0]
              connected = true
              console.log('Successfully connected to Exodus wallet:', walletAddress)
            } else {
              // Fallback to demo mode if no accounts returned
              console.log('No accounts returned, using demo mode for hackathon...')
              walletAddress = 'EXODUS_DEMO_' + Math.random().toString(36).substring(7).toUpperCase()
              connected = true
            }
          } catch (exodusError) {
            console.error('Exodus connection error:', exodusError)
            
            // For hackathon demo, fall back to simulation instead of failing
            console.log('Exodus connection failed, using demo mode for hackathon...')
            await new Promise(resolve => setTimeout(resolve, 1000))
            walletAddress = 'EXODUS_DEMO_' + Math.random().toString(36).substring(7).toUpperCase()
            connected = true
          }
        } else {
          // Exodus not installed - use demo mode for hackathon
          console.log('Exodus not detected, using demo mode for hackathon...')
          await new Promise(resolve => setTimeout(resolve, 1000))
          walletAddress = 'EXODUS_DEMO_' + Math.random().toString(36).substring(7).toUpperCase()
          connected = true
        }
      } else if (walletType === 'Pera') {
        // Pera wallet connection (would use @perawallet/connect)
        // For now, simulate the connection
        await new Promise(resolve => setTimeout(resolve, 2000))
        walletAddress = 'PERA' + Math.random().toString(36).substring(7).toUpperCase()
        connected = true
      } else {
        // Other wallets - simulate connection
        await new Promise(resolve => setTimeout(resolve, 2000))
        walletAddress = 'SAMPLE' + Math.random().toString(36).substring(7).toUpperCase()
        connected = true
      }
      
      if (connected && walletAddress) {
        console.log('Wallet connected successfully, proceeding to dashboard...')
        // Skip the success message display and go directly to dashboard
        onWalletConnected(true)
      }
      
    } catch (err) {
      console.error('Wallet connection error:', err)
      setError(err instanceof Error ? err.message : `Failed to connect to ${walletType}`)
    } finally {
      setConnecting(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-white">
          Choose Your Algorand Wallet
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Connect your Algorand wallet to mint Soul Beacon tokens and participate in the resonance matching.
        </p>
      </motion.div>

      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exodus Wallet - PRIMARY CHOICE */}
          <motion.button
            onClick={() => handleConnectWallet('Exodus')}
            disabled={connecting !== null}
            className="wallet-card"
            whileHover={{ scale: connecting !== null ? 1 : 1.02 }}
            whileTap={{ scale: connecting !== null ? 1 : 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="wallet-icon bg-gradient-to-br from-blue-500 to-purple-600">
                  <span className="text-2xl">🌟</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">
                    {connecting === 'Exodus' ? 'Connecting...' : 'Exodus Wallet'}
                  </h3>
                  <p className="text-white/70">Multi-platform • Desktop • Browser • Mobile</p>
                  <p className="text-xs text-cyan-400 mt-1">
                    💡 Make sure Algorand is enabled in Exodus settings
                  </p>
                </div>
              </div>
              {connecting === 'Exodus' ? (
                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
              ) : (
                <ChevronRight className="w-6 h-6 text-white/60" />
              )}
            </div>
          </motion.button>

          {/* Pera Wallet - Official Option */}
          <motion.button
            onClick={() => handleConnectWallet('Pera')}
            disabled={connecting !== null}
            className="wallet-card"
            whileHover={{ scale: connecting !== null ? 1 : 1.02 }}
            whileTap={{ scale: connecting !== null ? 1 : 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="wallet-icon bg-white/20">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">
                    {connecting === 'Pera' ? 'Connecting...' : 'Pera Wallet'}
                  </h3>
                  <p className="text-white/70">Official Algorand wallet</p>
                </div>
              </div>
              {connecting === 'Pera' ? (
                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
              ) : (
                <ChevronRight className="w-6 h-6 text-white/60" />
              )}
            </div>
          </motion.button>

          {/* Defly Wallet - Mobile Option */}
          <motion.button
            onClick={() => handleConnectWallet('Defly')}
            disabled={connecting !== null}
            className="wallet-card"
            whileHover={{ scale: connecting !== null ? 1 : 1.02 }}
            whileTap={{ scale: connecting !== null ? 1 : 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="wallet-icon bg-gradient-to-br from-purple-400 to-blue-500">
                  <span className="text-2xl">🦋</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">
                    {connecting === 'Defly' ? 'Connecting...' : 'Defly Wallet'}
                  </h3>
                  <p className="text-white/70">Mobile-first • Beautiful UX</p>
                </div>
              </div>
              {connecting === 'Defly' ? (
                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
              ) : (
                <ChevronRight className="w-6 h-6 text-white/60" />
              )}
            </div>
          </motion.button>
        </div>

        {error && (
          <motion.div
            className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center space-x-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <span className="text-2xl">✅</span>
            <span className="text-green-300">{success}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Exodus Setup Help */}
      <motion.div 
        className="mt-8 max-w-2xl mx-auto p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h4 className="text-sm font-semibold mb-2 text-blue-300 flex items-center">
          <span className="text-lg mr-2">💡</span>
          Exodus Wallet Setup for Algorand
        </h4>
        <div className="text-xs text-blue-200/80 space-y-1">
          <p>1. Open your Exodus desktop app or browser extension</p>
          <p>2. Go to Settings → Assets → Search for "Algorand"</p>
          <p>3. Enable Algorand (ALGO) if it's not already enabled</p>
          <p>4. Refresh this page and try connecting again</p>
          <p className="text-cyan-300 mt-2">
            🚀 <strong>For demo:</strong> The app will work in demo mode even if setup fails!
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="mt-8 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h4 className="text-lg font-semibold mb-3 text-white">Why Connect a Wallet?</h4>
        <ul className="space-y-2 text-white/70">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Mint Soul Beacon ASA tokens for your asks</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Receive token distributions when matched</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Participate in the Soul Beacon ecosystem</span>
          </li>
        </ul>
        
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
          <h5 className="font-semibold mb-2">🔧 Exodus Setup Tips:</h5>
          <ul className="space-y-1 text-xs">
            <li>• Make sure Algorand is enabled in Exodus settings</li>
            <li>• Refresh this page if connection fails</li>
            <li>• Demo mode activates automatically for hackathon testing</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}
