#!/usr/bin/env node

/**
 * Setup Verification Script
 * 
 * This script checks if your environment is properly configured
 * for generating Apple Wallet passes.
 */

require('dotenv').config()

const requiredEnvVars = [
  'APPLE_PASS_TYPE_ID',
  'APPLE_TEAM_ID',
  'APPLE_PASS_CERTIFICATE_BASE64',
  'APPLE_PASS_CERTIFICATE_PASSWORD',
  'APPLE_WWDR_CERTIFICATE_BASE64'
]

const optionalEnvVars = [
  'ORGANIZATION_NAME',
  'NODE_ENV'
]

console.log('╔════════════════════════════════════════════════╗')
console.log('║   Apple Wallet Pass Generator - Setup Check   ║')
console.log('╚════════════════════════════════════════════════╝\n')

console.log('📋 Checking required environment variables...\n')

let allPresent = true
let warnings = []

// Check required variables
for (const key of requiredEnvVars) {
  const value = process.env[key]
  if (value) {
    const preview = value.length > 40 ? value.substring(0, 40) + '...' : value
    console.log(`✅ ${key}`)
    console.log(`   ${preview}\n`)
  } else {
    console.log(`❌ ${key}: MISSING\n`)
    allPresent = false
  }
}

// Check optional variables
console.log('📋 Checking optional environment variables...\n')

for (const key of optionalEnvVars) {
  const value = process.env[key]
  if (value) {
    console.log(`✅ ${key}: ${value}`)
  } else {
    console.log(`⚠️  ${key}: Not set (optional)`)
  }
}

console.log('\n' + '─'.repeat(50) + '\n')

// Validate certificate format
if (process.env.APPLE_PASS_CERTIFICATE_BASE64) {
  try {
    const certPem = Buffer.from(process.env.APPLE_PASS_CERTIFICATE_BASE64, 'base64').toString('utf8')
    
    const hasCert = certPem.includes('-----BEGIN CERTIFICATE-----')
    const hasKey = certPem.includes('-----BEGIN PRIVATE KEY-----') || 
                   certPem.includes('-----BEGIN ENCRYPTED PRIVATE KEY-----')
    
    if (hasCert && hasKey) {
      console.log('✅ Certificate format: Valid (contains certificate and private key)')
    } else if (hasCert && !hasKey) {
      console.log('⚠️  Certificate format: Missing private key')
      warnings.push('Certificate does not contain private key. Make sure to export with -nodes flag.')
    } else {
      console.log('❌ Certificate format: Invalid')
      allPresent = false
    }
  } catch (error) {
    console.log('❌ Certificate format: Invalid Base64 encoding')
    allPresent = false
  }
}

if (process.env.APPLE_WWDR_CERTIFICATE_BASE64) {
  try {
    const wwdrPem = Buffer.from(process.env.APPLE_WWDR_CERTIFICATE_BASE64, 'base64').toString('utf8')
    
    if (wwdrPem.includes('-----BEGIN CERTIFICATE-----')) {
      console.log('✅ WWDR Certificate format: Valid')
    } else {
      console.log('❌ WWDR Certificate format: Invalid')
      allPresent = false
    }
  } catch (error) {
    console.log('❌ WWDR Certificate format: Invalid Base64 encoding')
    allPresent = false
  }
}

// Validate Pass Type ID format
if (process.env.APPLE_PASS_TYPE_ID) {
  const passTypeId = process.env.APPLE_PASS_TYPE_ID
  if (passTypeId.startsWith('pass.')) {
    console.log('✅ Pass Type ID format: Valid')
  } else {
    console.log('⚠️  Pass Type ID format: Should start with "pass."')
    warnings.push('Pass Type ID should start with "pass." (e.g., pass.com.yourcompany.businesscard)')
  }
}

// Validate Team ID format
if (process.env.APPLE_TEAM_ID) {
  const teamId = process.env.APPLE_TEAM_ID
  if (teamId.length === 10) {
    console.log('✅ Team ID format: Valid (10 characters)')
  } else {
    console.log('⚠️  Team ID format: Should be 10 characters')
    warnings.push('Team ID should be exactly 10 characters')
  }
}

console.log('\n' + '─'.repeat(50) + '\n')

// Final summary
if (allPresent && warnings.length === 0) {
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║   ✅ Setup Complete! You\'re ready to go!       ║')
  console.log('╚════════════════════════════════════════════════╝\n')
  console.log('Next steps:')
  console.log('  1. Run: pnpm run build')
  console.log('  2. Try: npx ts-node examples/basic-usage.ts')
  console.log('  3. Read: README.md for usage instructions\n')
  process.exit(0)
} else if (allPresent && warnings.length > 0) {
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║   ⚠️  Setup Complete with Warnings             ║')
  console.log('╚════════════════════════════════════════════════╝\n')
  console.log('Warnings:')
  warnings.forEach((warning, i) => {
    console.log(`  ${i + 1}. ${warning}`)
  })
  console.log('\nYou can proceed, but review the warnings above.\n')
  process.exit(0)
} else {
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║   ❌ Setup Incomplete                          ║')
  console.log('╚════════════════════════════════════════════════╝\n')
  console.log('Please fix the issues above and try again.\n')
  console.log('For help, see:')
  console.log('  - SETUP.md for certificate setup instructions')
  console.log('  - .env.example for environment variable template')
  console.log('  - QUICKSTART.md for quick start guide\n')
  process.exit(1)
}
