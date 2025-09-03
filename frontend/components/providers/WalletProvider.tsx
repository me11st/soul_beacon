'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { PeraWalletConnect } from '@perawallet/connect'
import algosdk from 'algosdk'

interface WalletContextType {
  peraWallet: PeraWalletConnect | null
  accountAddress: string | null
  isConnected: boolean
  balance: number
  connectWallet: (walletType: 'pera') => Promise<void>
  disconnectWallet: () => void
  signTransaction: (txn: algosdk.Transaction) => Promise<Uint8Array>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [peraWallet, setPeraWallet] = useState<PeraWalletConnect | null>(null)
  const [accountAddress, setAccountAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState(0)

  // Initialize wallets on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pera = new PeraWalletConnect()
      
      setPeraWallet(pera)

      // Check for existing connections
      pera.reconnectSession().then((accounts) => {
        if (accounts.length > 0) {
          setAccountAddress(accounts[0])
          setIsConnected(true)
          fetchBalance(accounts[0])
        }
      }).catch(console.error)
    }
  }, [])

  const fetchBalance = async (address: string) => {
    try {
      const algod = new algosdk.Algodv2(
        process.env.NEXT_PUBLIC_ALGOD_TOKEN || '',
        process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
        process.env.NEXT_PUBLIC_ALGOD_PORT || 443
      )
      
      const accountInfo = await algod.accountInformation(address).do()
      setBalance(Number(accountInfo.amount) / 1000000) // Convert microAlgos to Algos
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const connectWallet = async (walletType: 'pera') => {
    try {
      let accounts: string[] = []

      if (walletType === 'pera' && peraWallet) {
        accounts = await peraWallet.connect()
      }

      if (accounts.length > 0) {
        setAccountAddress(accounts[0])
        setIsConnected(true)
        await fetchBalance(accounts[0])
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }

  const disconnectWallet = () => {
    if (peraWallet) {
      peraWallet.disconnect()
    }
    
    setAccountAddress(null)
    setIsConnected(false)
    setBalance(0)
  }

  const signTransaction = async (txn: algosdk.Transaction): Promise<Uint8Array> => {
    if (!accountAddress) {
      throw new Error('No account connected')
    }

    try {
      if (peraWallet) {
        const signedTxns = await peraWallet.signTransaction([[{ txn }]])
        return signedTxns[0]
      }
      throw new Error('No wallet available')
    } catch (error) {
      console.error('Error signing transaction:', error)
      throw error
    }
  }

  const value: WalletContextType = {
    peraWallet,
    accountAddress,
    isConnected,
    balance,
    connectWallet,
    disconnectWallet,
    signTransaction,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
