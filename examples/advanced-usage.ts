/**
 * Advanced usage example for apple-wallet-pass-generator
 * 
 * This example shows advanced features like:
 * - Custom QR code modes
 * - Profile photos and company logos
 * - Custom fields
 * - Different brand colors
 */

import { generateBusinessCardPass } from '../src/index'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

async function generateWithLinkedInQR() {
  console.log('\n📱 Example 1: LinkedIn QR Code')
  console.log('─'.repeat(50))

  const config = {
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
    teamIdentifier: process.env.APPLE_TEAM_ID!,
    certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
    certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
    wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
    organizationName: 'Tech Corp'
  }

  const cardData = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techcorp.com',
    title: 'Senior Product Manager',
    company: 'Tech Corp',
    phone: '+1 (555) 987-6543',
    linkedin: 'janesmith',
    brandColor: '#0077B5', // LinkedIn blue
    qrCodeMode: 'linkedin' as const
  }

  const result = await generateBusinessCardPass(cardData, config)
  writeFileSync(result.filename, result.buffer)
  console.log(`✅ Generated: ${result.filename}`)
  console.log(`   QR Code: LinkedIn profile`)
}

async function generateWithCustomURL() {
  console.log('\n🔗 Example 2: Custom URL QR Code')
  console.log('─'.repeat(50))

  const config = {
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
    teamIdentifier: process.env.APPLE_TEAM_ID!,
    certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
    certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
    wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
    organizationName: 'Design Studio'
  }

  const cardData = {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex@designstudio.com',
    title: 'Creative Director',
    company: 'Design Studio',
    website: 'https://designstudio.com',
    brandColor: '#FF6B6B', // Coral red
    qrCodeMode: 'custom' as const,
    customLink: 'https://designstudio.com/alex-portfolio'
  }

  const result = await generateBusinessCardPass(cardData, config)
  writeFileSync(result.filename, result.buffer)
  console.log(`✅ Generated: ${result.filename}`)
  console.log(`   QR Code: Custom portfolio URL`)
}

async function generateWithCustomFields() {
  console.log('\n📝 Example 3: Custom Fields')
  console.log('─'.repeat(50))

  const config = {
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
    teamIdentifier: process.env.APPLE_TEAM_ID!,
    certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
    certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
    wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
    organizationName: 'Consulting Group'
  }

  const cardData = {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@consulting.com',
    title: 'Management Consultant',
    company: 'Consulting Group',
    phone: '+1 (555) 234-5678',
    website: 'https://consulting.com',
    linkedin: 'michaelchen',
    brandColor: '#2C3E50', // Dark blue-gray
    qrCodeMode: 'vcard' as const,
    customFields: [
      { id: 'field1', label: 'Specialization', value: 'Digital Transformation' },
      { id: 'field2', label: 'Languages', value: 'English, Mandarin, Spanish' },
      { id: 'field3', label: 'Office', value: 'San Francisco, CA' }
    ]
  }

  const result = await generateBusinessCardPass(cardData, config)
  writeFileSync(result.filename, result.buffer)
  console.log(`✅ Generated: ${result.filename}`)
  console.log(`   Custom fields: ${cardData.customFields.length}`)
}

async function generateWithImages() {
  console.log('\n🖼️  Example 4: With Profile Photo & Company Logo')
  console.log('─'.repeat(50))

  const config = {
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
    teamIdentifier: process.env.APPLE_TEAM_ID!,
    certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
    certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
    wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
    organizationName: 'Startup Inc'
  }

  // In a real application, you would load actual images
  // For this example, we'll use placeholder data URLs
  const profilePhotoDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  const companyLogoDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

  const cardData = {
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah@startup.io',
    title: 'Founder & CEO',
    company: 'Startup Inc',
    phone: '+1 (555) 345-6789',
    website: 'https://startup.io',
    linkedin: 'sarahwilliams',
    brandColor: '#8E44AD', // Purple
    qrCodeMode: 'vcard' as const,
    profilePhoto: profilePhotoDataUrl,
    companyLogo: companyLogoDataUrl
  }

  const result = await generateBusinessCardPass(cardData, config)
  writeFileSync(result.filename, result.buffer)
  console.log(`✅ Generated: ${result.filename}`)
  console.log(`   Includes: Profile photo & company logo`)
}

async function generateMultiplePasses() {
  console.log('\n👥 Example 5: Batch Generation')
  console.log('─'.repeat(50))

  const config = {
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
    teamIdentifier: process.env.APPLE_TEAM_ID!,
    certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
    certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
    wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
    organizationName: 'Conference 2025'
  }

  const attendees = [
    { firstName: 'David', lastName: 'Brown', email: 'david@example.com', title: 'Software Engineer', brandColor: '#3498DB' },
    { firstName: 'Emily', lastName: 'Davis', email: 'emily@example.com', title: 'UX Designer', brandColor: '#E74C3C' },
    { firstName: 'James', lastName: 'Wilson', email: 'james@example.com', title: 'Data Scientist', brandColor: '#2ECC71' }
  ]

  console.log(`Generating ${attendees.length} passes...`)

  for (const attendee of attendees) {
    const result = await generateBusinessCardPass(
      {
        ...attendee,
        company: 'Conference 2025',
        qrCodeMode: 'vcard' as const
      },
      config
    )
    writeFileSync(result.filename, result.buffer)
    console.log(`  ✅ ${result.filename}`)
  }

  console.log(`\n✅ Generated ${attendees.length} passes successfully!`)
}

async function main() {
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║   Advanced Apple Wallet Pass Examples         ║')
  console.log('╚════════════════════════════════════════════════╝')

  // Check environment variables
  const required = [
    'APPLE_PASS_TYPE_ID',
    'APPLE_TEAM_ID',
    'APPLE_PASS_CERTIFICATE_BASE64',
    'APPLE_PASS_CERTIFICATE_PASSWORD',
    'APPLE_WWDR_CERTIFICATE_BASE64'
  ]

  const missing = required.filter(key => !process.env[key])
  if (missing.length > 0) {
    console.error('\n❌ Missing environment variables:')
    missing.forEach(key => console.error(`   - ${key}`))
    console.error('\nPlease set up your .env file. See SETUP.md for details.')
    process.exit(1)
  }

  try {
    await generateWithLinkedInQR()
    await generateWithCustomURL()
    await generateWithCustomFields()
    await generateWithImages()
    await generateMultiplePasses()

    console.log('\n╔════════════════════════════════════════════════╗')
    console.log('║   ✅ All examples completed successfully!      ║')
    console.log('╚════════════════════════════════════════════════╝')
    console.log('\n📱 You can now add these passes to Apple Wallet!')
    console.log('💡 Tip: AirDrop them to your iPhone or email them to yourself\n')

  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

// Run all examples
main()
