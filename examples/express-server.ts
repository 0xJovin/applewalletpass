/**
 * Express.js server example for apple-wallet-pass-generator
 * 
 * This example shows how to create a simple Express server
 * that generates Apple Wallet passes
 */

import express, { Request, Response, Express } from 'express'
import { generateBusinessCardPass } from '../src/index'

const app: Express = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json({ limit: '10mb' })) // Increased limit for base64 images
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'apple-wallet-pass-generator' })
})

// Generate pass endpoint
app.post('/api/wallet', async (req: Request, res: Response) => {
  try {
    const cardData = req.body

    // Validate required fields
    if (!cardData.firstName || !cardData.lastName || !cardData.email || !cardData.title) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email', 'title']
      })
    }

    // Configure Apple Wallet credentials from environment variables
    const config = {
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
      teamIdentifier: process.env.APPLE_TEAM_ID!,
      certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
      certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
      wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
      organizationName: process.env.ORGANIZATION_NAME || 'Business Card'
    }

    // Check if certificates are configured
    if (!config.passTypeIdentifier || !config.teamIdentifier) {
      return res.status(503).json({
        error: 'Apple Wallet passes are not configured',
        message: 'Missing required environment variables'
      })
    }

    console.log(`Generating pass for: ${cardData.firstName} ${cardData.lastName}`)

    // Generate the pass
    const result = await generateBusinessCardPass(cardData, config)

    console.log(`✅ Pass generated: ${result.filename} (${result.buffer.length} bytes)`)

    // Set headers and send the pass
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass')
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`)
    res.setHeader('Content-Length', result.buffer.length.toString())
    res.send(result.buffer)

  } catch (error) {
    console.error('Error generating pass:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    res.status(500).json({
      error: 'Failed to generate Apple Wallet pass',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    })
  }
})

// Example endpoint to show expected request format
app.get('/api/wallet/example', (req: Request, res: Response) => {
  res.json({
    method: 'POST',
    endpoint: '/api/wallet',
    contentType: 'application/json',
    exampleRequest: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      title: 'Software Engineer',
      company: 'Tech Corp',
      phone: '+1 (555) 123-4567',
      website: 'https://johndoe.com',
      linkedin: 'johndoe',
      brandColor: '#156741',
      qrCodeMode: 'vcard',
      profilePhoto: 'data:image/png;base64,...',
      companyLogo: 'data:image/png;base64,...'
    },
    requiredFields: ['firstName', 'lastName', 'email', 'title', 'brandColor'],
    optionalFields: [
      'company', 'phone', 'website', 'linkedin', 
      'profilePhoto', 'companyLogo', 'qrCodeMode',
      'customLink', 'customFields'
    ],
    qrCodeModes: ['vcard', 'linkedin', 'custom']
  })
})

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/wallet',
      'GET /api/wallet/example'
    ]
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📱 Apple Wallet pass generator ready`)
  console.log(`\nAvailable endpoints:`)
  console.log(`  GET  /health - Health check`)
  console.log(`  POST /api/wallet - Generate pass`)
  console.log(`  GET  /api/wallet/example - View example request`)
})

export default app
