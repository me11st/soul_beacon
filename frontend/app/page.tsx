'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Zap } from 'lucide-react'

import AuthSection from '../components/auth/AuthSection'
import WalletSection from '../components/wallet/WalletSection'
import SoulBeaconDashboard from '../components/dashboard/SoulBeaconDashboard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isTestNetMode, setIsTestNetMode] = useState(false)
  const [currentStep, setCurrentStep] = useState<'auth' | 'wallet' | 'dashboard'>('auth')

  useEffect(() => {
    console.log('Main page useEffect - user:', user, 'isWalletConnected:', isWalletConnected)
    if (user) {
      const nextStep = isWalletConnected ? 'dashboard' : 'wallet'
      console.log('Setting currentStep to:', nextStep)
      setCurrentStep(nextStep)
    } else {
      console.log('Setting currentStep to: auth')
      setCurrentStep('auth')
    }
  }, [user, isWalletConnected])

  const handleAuthSuccess = (userData: any) => {
    console.log('Auth success with user data:', userData)
    setUser(userData)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soul-50 to-beacon-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      {/* Fluid Marble Background */}
      <div className="fluid-marble-bg"></div>
      
      <main className="relative min-h-screen">
        {/* Header */}
        <header className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <Sparkles className="w-8 h-8 text-white" />
                <div className="absolute inset-0 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white/50" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Soul Beacon
              </h1>
            </motion.div>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-4">
              <StepIndicator 
                step={1} 
                active={currentStep === 'auth'} 
                completed={user !== undefined}
                icon={<Heart className="w-4 h-4" />}
                label="Identity"
              />
              <StepIndicator 
                step={2} 
                active={currentStep === 'wallet'} 
                completed={isWalletConnected}
                icon={<Zap className="w-4 h-4" />}
                label="Wallet"
              />
              <StepIndicator 
                step={3} 
                active={currentStep === 'dashboard'} 
                completed={false}
                icon={<Sparkles className="w-4 h-4" />}
                label="Beacon"
              />
            </div>
          </div>
        </header>      {/* Main Content */}
      <div className="relative z-0">
        <AnimatePresence mode="wait">
          {currentStep === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <AuthSection onAuthSuccess={handleAuthSuccess} />
            </motion.div>
          )}

          {currentStep === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <WalletSection onWalletConnected={(connected, isTestNet) => {
                console.log('onWalletConnected callback called with:', connected, 'TestNet:', isTestNet)
                setIsWalletConnected(connected)
                setIsTestNetMode(isTestNet || false)
              }} />
            </motion.div>
          )}

          {currentStep === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <SoulBeaconDashboard isTestNetMode={isTestNetMode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-soul-200 rounded-full opacity-20 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-beacon-200 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-soul-300 rounded-full opacity-30 animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>
      </main>
    </>
  )
}

interface StepIndicatorProps {
  step: number
  active: boolean
  completed: boolean
  icon: React.ReactNode
  label: string
}

function StepIndicator({ step, active, completed, icon, label }: StepIndicatorProps) {
  return (
    <motion.div 
      className="flex flex-col items-center space-y-1"
      whileHover={{ scale: 1.05 }}
    >
      <div className={`
        w-10 h-10 border border-white/30 flex items-center justify-center transition-all duration-300
        ${completed 
          ? 'bg-white/20 text-white border-white/50' 
          : active 
            ? 'bg-white/10 text-white border-white/50' 
            : 'bg-transparent text-white/50 border-white/20'
        }
      `}>
        {completed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-white"
          >
            ✓
          </motion.div>
        ) : (
          icon
        )}
      </div>
      <span className={`text-xs font-medium ${active ? 'text-white' : 'text-white/60'}`}>
        {label}
      </span>
    </motion.div>
  )
}
