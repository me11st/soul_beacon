'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Key, Sparkles, ArrowRight } from 'lucide-react'

interface AuthSectionProps {
  onAuthSuccess: (userData: any) => void
}

export default function AuthSection({ onAuthSuccess }: AuthSectionProps) {
  const [authMethod, setAuthMethod] = useState<'openai' | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOpenAIAuth = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key')
      return
    }

    if (!apiKey.startsWith('sk-')) {
      setError('Invalid API key format. Should start with "sk-"')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // First, try to verify the API key with the backend
      const userId = `user-${Date.now()}`
      
      const response = await fetch('http://localhost:8000/api/ai/set-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          userId
        })
      })

      if (response.ok) {
        console.log('✅ OpenAI API key verified and connected to backend')
        
        const userData = {
          id: userId,
          apiKey: apiKey.substring(0, 20) + '...' + apiKey.slice(-4),
          authMethod: 'openai',
          authenticatedAt: new Date().toISOString()
        }

        onAuthSuccess(userData)
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to verify API key with OpenAI')
      }
    } catch (err) {
      console.warn('Backend not available, using demo mode')
      // Fallback to demo mode if backend is not available
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const userData = {
          id: `user-${Date.now()}`,
          apiKey: apiKey.substring(0, 20) + '...' + apiKey.slice(-4),
          authMethod: 'openai',
          authenticatedAt: new Date().toISOString()
        }

        onAuthSuccess(userData)
      } catch (fallbackErr) {
        setError('Failed to authenticate. Please check your API key.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-6 text-white">
          Welcome to Soul Beacon
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          An AI-driven platform that connects souls through meaningful resonance. 
          Create your digital soul shadow and discover meaningful connections on the Algorand blockchain.
        </p>
        
        <div className="flex items-center justify-center space-x-8 mb-12">
          <FeatureCard 
            icon={<Brain className="w-6 h-6" />}
            title="AI Matching"
            description="Advanced resonance algorithms"
          />
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6" />}
            title="Soul Beacons"
            description="Ephemeral ASA tokens"
          />
          <FeatureCard 
            icon={<Key className="w-6 h-6" />}
            title="Secure Identity"
            description="OpenAI-powered authentication"
          />
        </div>
      </motion.div>

      {/* Authentication Options */}
      <motion.div 
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-8 text-white">
          Create Your Soul Shadow
        </h2>

        <div className="grid gap-6">
          {/* OpenAI API Key */}
          <motion.button
            onClick={() => setAuthMethod('openai')}
            className="group relative p-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Brain className="w-6 h-6 text-white/90" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">Connect with OpenAI</h3>
                  <p className="text-white/60">Use your OpenAI API key for enhanced AI features</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors" />
            </div>
          </motion.button>
        </div>

        {/* OpenAI API Key Input */}
        {authMethod === 'openai' && (
          <motion.div
            className="mt-6 p-6 bg-white/10 backdrop-blur-sm border border-white/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Enter Your OpenAI API Key</h4>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 focus:border-white/40"
                disabled={isLoading}
              />
              
              {error && (
                <div className="text-red-300 text-sm">{error}</div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={handleOpenAIAuth}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-cyan-700 to-purple-700 text-white py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Connect'
                  )}
                </button>
                <button
                  onClick={() => setAuthMethod(null)}
                  disabled={isLoading}
                  className="px-6 py-3 border border-white/20 text-white/80 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div 
          className="mt-8 p-6 bg-white/10 backdrop-blur-sm border border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className="text-lg font-semibold mb-3 text-white">What is a Soul Shadow?</h4>
          <p className="text-white/70 mb-4">
            Your Soul Shadow is a secure, AI-enhanced profile that captures your unique resonance patterns, 
            preferences, and interaction history. It's used by our AI to find meaningful connections while 
            keeping your data private and secure.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400/80 rounded-full"></div>
              <span className="text-white/60">Encrypted data storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400/80 rounded-full"></div>
              <span className="text-white/60">AI-powered matching</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400/80 rounded-full"></div>
              <span className="text-white/60">Privacy-first design</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400/80 rounded-full"></div>
              <span className="text-white/60">Blockchain integration</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div 
      className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm border border-white/20"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center mb-3">
        <div className="text-white/90">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/60 text-center">{description}</p>
    </motion.div>
  )
}
