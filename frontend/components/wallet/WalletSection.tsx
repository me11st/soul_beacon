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
        // Check if Exodus is installed
        if (typeof window !== 'undefined' && window.exodus) {
          const accounts = await window.exodus.algorand.connect()
          if (accounts && accounts.length > 0) {
            walletAddress = accounts[0]
            connected = true
          }
        } else {
          throw new Error('Exodus wallet not detected. Please install the Exodus browser extension.')
        }
      } else if (walletType === 'Pera') {
        // Pera wallet connection (would use @perawallet/connect)
        // For now, simulate the connection
        await new Promise(resolve => setTimeout(resolve, 2000))
        walletAddress = 'SAMPLE' + Math.random().toString(36).substring(7).toUpperCase()
        connected = true
      } else {
        // Other wallets - simulate connection
        await new Promise(resolve => setTimeout(resolve, 2000))
        walletAddress = 'SAMPLE' + Math.random().toString(36).substring(7).toUpperCase()
        connected = true
      }
      
      if (connected && walletAddress) {
        // Show success message with wallet address
        const shortAddress = `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 4)}`
        setSuccess(`✅ Connected! Address: ${shortAddress}`)
        setTimeout(() => {
          onWalletConnected(true)
        }, 2000) // Show confirmation for 2 seconds before proceeding
      }
      
    } catch (err) {
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

      <motion.div 
        className="mt-12 max-w-2xl mx-auto"
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
      </motion.div>
    </div>
  )
}
