/**
 * Next.js API Route example for apple-wallet-pass-generator
 * 
 * Place this file in: app/api/wallet/route.ts (App Router)
 * or: pages/api/wallet.ts (Pages Router)
 */

import { type NextRequest, NextResponse } from 'next/server'
import { generateBusinessCardPass, BusinessCardData } from 'apple-wallet-pass-generator'

// App Router example (app/api/wallet/route.ts)
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const cardData = await request.json() as BusinessCardData

    // Validate required fields
    if (!cardData.firstName || !cardData.lastName || !cardData.email || !cardData.title) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, title' },
        { status: 400 }
      )
    }

    // Configure Apple Wallet credentials from environment variables
    const config = {
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
      teamIdentifier: process.env.APPLE_TEAM_ID!,
      certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
      certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
      wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
      organizationName: process.env.ORGANIZATION_NAME || 'Your Company'
    }

    // Check if certificates are configured
    if (!config.passTypeIdentifier || !config.teamIdentifier) {
      return NextResponse.json(
        { error: 'Apple Wallet passes are not configured. Missing environment variables.' },
        { status: 503 }
      )
    }

    console.log('Generating Apple Wallet pass for:', cardData.firstName, cardData.lastName)

    // Generate the pass
    const result = await generateBusinessCardPass(cardData, config)

    console.log('✅ Pass generated successfully, size:', result.buffer.length)

    // Return the pass file
    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': result.buffer.length.toString()
      }
    })
  } catch (error) {
    console.error('Error generating Apple Wallet pass:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        error: 'Failed to generate Apple Wallet pass',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

// Pages Router example (pages/api/wallet.ts)
/*
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const cardData = req.body

    // Validate required fields
    if (!cardData.firstName || !cardData.lastName || !cardData.email || !cardData.title) {
      return res.status(400).json({
        error: 'Missing required fields: firstName, lastName, email, title'
      })
    }

    // Configure Apple Wallet credentials
    const config = {
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
      teamIdentifier: process.env.APPLE_TEAM_ID!,
      certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
      certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
      wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
      organizationName: process.env.ORGANIZATION_NAME || 'Your Company'
    }

    // Generate the pass
    const result = await generateBusinessCardPass(cardData, config)

    // Set headers and send the pass
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass')
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`)
    res.send(result.buffer)
  } catch (error) {
    console.error('Error generating pass:', error)
    res.status(500).json({ error: 'Failed to generate pass' })
  }
}
*/
