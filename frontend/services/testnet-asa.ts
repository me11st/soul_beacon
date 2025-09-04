// TestNet ASA Minting Service
import algosdk from 'algosdk'

// TestNet configuration
const ALGOD_TOKEN = ''
const ALGOD_SERVER = 'https://testnet-api.algonode.cloud'
const ALGOD_PORT = 443

export class TestNetASAService {
  private algod: algosdk.Algodv2

  constructor() {
    this.algod = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT)
  }

  /**
   * Create a Soul Beacon ASA on TestNet
   * @param walletAddress - The creator's wallet address
   * @param beaconData - The beacon content and metadata
   * @returns Transaction ID of the created ASA
   */
  async createSoulBeaconASA(
    walletAddress: string, 
    beaconData: {
      text: string
      category: string
      timestamp: Date
    }
  ): Promise<{
    txId: string
    assetId: number
    success: boolean
    error?: string
    transaction?: algosdk.Transaction
  }> {
    try {
      console.log('🔥 Creating real ASA on TestNet for:', walletAddress)
      
      // Get suggested transaction parameters
      const suggestedParams = await this.algod.getTransactionParams().do()
      
      // Create ASA creation transaction
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        sender: walletAddress,
        suggestedParams,
        total: 1,                        // total supply (1 for unique beacon)
        decimals: 0,                     // no decimal places
        defaultFrozen: false,            // not frozen by default
        unitName: `SB-${Date.now().toString().slice(-6)}`, // unit name
        assetName: 'Soul Beacon',        // asset name
        assetURL: `https://soulbeacon.app/beacon`, // URL
      })

      // Note: Transaction needs to be signed by the wallet
      // This returns the unsigned transaction that the frontend will sign
      return {
        txId: '',  // Will be filled after signing
        assetId: 0, // Will be filled after confirmation
        success: true,
        transaction: txn // Return transaction for wallet signing
      }
      
    } catch (error) {
      console.error('❌ TestNet ASA creation failed:', error)
      return {
        txId: '',
        assetId: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Wait for transaction confirmation and get asset ID
   */
  async waitForConfirmation(txId: string): Promise<{
    assetId: number
    confirmed: boolean
  }> {
    try {
      const response = await algosdk.waitForConfirmation(this.algod, txId, 4)
      
      // Extract asset ID from transaction response
      const assetId = response.assetIndex
      
      return {
        assetId: Number(assetId) || 0,
        confirmed: true
      }
    } catch (error) {
      console.error('❌ Transaction confirmation failed:', error)
      return {
        assetId: 0,
        confirmed: false
      }
    }
  }

  /**
   * Get account information for wallet
   */
  async getAccountInfo(address: string) {
    try {
      const accountInfo = await this.algod.accountInformation(address).do()
      return {
        balance: Number(accountInfo.amount) / 1000000, // Convert microAlgos to Algos
        assets: accountInfo.assets || [],
        success: true
      }
    } catch (error) {
      return {
        balance: 0,
        assets: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export const testNetService = new TestNetASAService()
