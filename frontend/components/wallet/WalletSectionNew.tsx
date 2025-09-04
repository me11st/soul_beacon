'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, ChevronRight, AlertCircle } from 'lucide-react'

interface WalletSectionProps {
  onWalletConnected: (connected: boolean) => void
}

export default function WalletSection({ onWalletConnected }: WalletSectionProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConnectWallet = async (walletType: string) => {
    setConnecting(walletType)
    setError(null)
    
    try {
      // Simulate wallet connection for now - replace with real integration tomorrow
      await new Promise(resolve => setTimeout(resolve, 2000))
      onWalletConnected(true)
    } catch (err) {
      setError(`Failed to connect to ${walletType}`)
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
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="space-y-4">
          {/* Defly Wallet */}
          <motion.button
            onClick={() => handleConnectWallet('Defly')}
            disabled={connecting !== null}
            className="w-full p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            whileHover={{ scale: connecting !== null ? 1 : 1.02 }}
            whileTap={{ scale: connecting !== null ? 1 : 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🦋</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">
                    {connecting === 'Defly' ? 'Connecting...' : 'Defly Wallet'}
                  </h3>
                  <p className="text-white/70">Beautiful animations & smooth UX</p>
                </div>
              </div>
              {connecting === 'Defly' ? (
                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
              ) : (
                <ChevronRight className="w-6 h-6 text-white/60" />
              )}
            </div>
          </motion.button>

          {/* Lute Wallet */}
          <motion.button
            onClick={() => handleConnectWallet('Lute')}
            disabled={connecting !== null}
            className="w-full p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            whileHover={{ scale: connecting !== null ? 1 : 1.02 }}
            whileTap={{ scale: connecting !== null ? 1 : 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">
                    {connecting === 'Lute' ? 'Connecting...' : 'Lute Wallet'}
                  </h3>
                  <p className="text-white/70">Modern design & WalletConnect</p>
                </div>
              </div>
              {connecting === 'Lute' ? (
                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
              ) : (
                <ChevronRight className="w-6 h-6 text-white/60" />
              )}
            </div>
          </motion.button>

          {/* MyAlgo Wallet */}
          <motion.button
            onClick={() => handleConnectWallet('MyAlgo')}
            disabled={connecting !== null}
            className="w-full p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            whileHover={{ scale: connecting !== null ? 1 : 1.02 }}
            whileTap={{ scale: connecting !== null ? 1 : 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">
                    {connecting === 'MyAlgo' ? 'Connecting...' : 'MyAlgo Wallet'}
                  </h3>
                  <p className="text-white/70">Browser-based, no download needed</p>
                </div>
              </div>
              {connecting === 'MyAlgo' ? (
                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
              ) : (
                <ChevronRight className="w-6 h-6 text-white/60" />
              )}
            </div>
          </motion.button>

          {/* Pera Wallet (legacy support) */}
          <motion.button
            onClick={() => handleConnectWallet('Pera')}
            disabled={connecting !== null}
            className="w-full p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            whileHover={{ scale: connecting !== null ? 1 : 1.02 }}
            whileTap={{ scale: connecting !== null ? 1 : 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
