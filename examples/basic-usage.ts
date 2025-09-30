/**
 * Basic usage example for apple-wallet-pass-generator
 * 
 * This example shows how to generate a simple business card pass
 */

import { generateBusinessCardPass } from '../src/index'
import { writeFileSync } from 'fs'

async function main() {
  // Configure your Apple Wallet credentials
  // In production, load these from environment variables
  const config = {
    passTypeIdentifier: 'pass.com.yourcompany.businesscard',
    teamIdentifier: 'YOUR_TEAM_ID', // 10-character string from Apple
    certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64 || '',
    certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD || '',
    wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64 || '',
    organizationName: 'Your Company'
  }

  // Create business card data
  const cardData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    title: 'Software Engineer',
    company: 'Tech Corp',
    phone: '+1 (555) 123-4567',
    website: 'https://johndoe.com',
    linkedin: 'johndoe',
    brandColor: '#156741', // Green color
    qrCodeMode: 'vcard' as const // Generate vCard QR code
  }

  try {
    console.log('Generating Apple Wallet pass...')
    
    // Generate the pass
    const result = await generateBusinessCardPass(cardData, config)
    
    console.log(`✅ Pass generated successfully!`)
    console.log(`📦 File size: ${result.buffer.length} bytes`)
    console.log(`📄 Filename: ${result.filename}`)
    
    // Save to file
    writeFileSync(result.filename, result.buffer)
    console.log(`💾 Saved to: ${result.filename}`)
    
    console.log('\n📱 You can now add this pass to Apple Wallet!')
    
  } catch (error) {
    console.error('❌ Error generating pass:', error)
    process.exit(1)
  }
}

// Run the example
main()
