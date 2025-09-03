import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '../components/providers/WalletProvider'
import { SocketProvider } from '../components/providers/SocketProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Soul Beacon - Find Your Resonance',
  description: 'AI-driven resonance matching platform connecting souls through meaningful interactions on Algorand',
  keywords: ['AI', 'blockchain', 'Algorand', 'soul', 'matching', 'resonance'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
