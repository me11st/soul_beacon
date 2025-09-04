import express from 'express'
import OpenAI from 'openai'

const router = express.Router()

// Store API keys temporarily (in production, use secure session storage)
const userApiKeys = new Map<string, string>()

// POST /api/ai/set-key - Set OpenAI API key for user session
router.post('/set-key', async (req, res) => {
  try {
    const { apiKey, userId } = req.body

    if (!apiKey || !apiKey.startsWith('sk-')) {
      return res.status(400).json({ error: 'Invalid API key format' })
    }

    // Verify API key by making a test call
    try {
      const openai = new OpenAI({ apiKey })
      await openai.models.list()
      
      // Store the API key for this user session
      userApiKeys.set(userId, apiKey)
      
      res.json({ 
        success: true, 
        message: 'API key verified and set successfully' 
      })
    } catch (error) {
      res.status(401).json({ 
        error: 'Invalid OpenAI API key - unable to authenticate with OpenAI' 
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to set API key' })
  }
})

// GET /api/ai/key-status/:userId - Check if user has valid API key
router.get('/key-status/:userId', (req, res) => {
  const { userId } = req.params
  const hasKey = userApiKeys.has(userId)
  
  res.json({ hasKey })
})

// Helper function to get API key for user (for use in other services)
export const getUserApiKey = (userId: string): string | undefined => {
  return userApiKeys.get(userId)
}

export default router
