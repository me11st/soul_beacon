'use client'

import { motion } from 'framer-motion'
import { Sparkles, Plus, MessageCircle } from 'lucide-react'

export default function SoulBeaconDashboard() {
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
                placeholder="Share what kind of connection or conversation you're looking for..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Beacon Type
              </label>
              <select className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400">
                <option>Emotional Support</option>
                <option>Intellectual Discussion</option>
                <option>Creative Collaboration</option>
                <option>Spiritual Connection</option>
                <option>Practical Advice</option>
              </select>
            </div>

            <motion.button
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-4 font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Mint Soul Beacon
            </motion.button>
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
            </h3>
            <div className="text-center py-8 text-white/60">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No active beacons yet</p>
              <p className="text-sm">Create your first beacon to start connecting</p>
            </div>
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
