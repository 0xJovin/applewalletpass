# Setup Guide for Apple Wallet Pass Generator

This guide will help you set up Apple Developer certificates and configure the library.

## Table of Contents

1. [Apple Developer Account Setup](#apple-developer-account-setup)
2. [Creating Pass Type ID](#creating-pass-type-id)
3. [Generating Certificates](#generating-certificates)
4. [Converting Certificates](#converting-certificates)
5. [Configuration](#configuration)
6. [Testing](#testing)

## Apple Developer Account Setup

### 1. Enroll in Apple Developer Program

1. Go to [Apple Developer Program](https://developer.apple.com/programs/)
2. Click "Enroll"
3. Complete enrollment ($99/year)
4. Wait for approval (usually 24-48 hours)

### 2. Find Your Team ID

1. Go to [Apple Developer Account](https://developer.apple.com/account)
2. Click "Membership" in the sidebar
3. Your **Team ID** is shown (10-character string like `ABCDE12345`)
4. Save this - you'll need it for configuration

## Creating Pass Type ID

### 1. Register a Pass Type ID

1. Go to [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list)
2. Click the **+** button
3. Select **Pass Type IDs** and click Continue
4. Enter a description: `Business Card Pass`
5. Enter an identifier: `pass.com.yourcompany.businesscard`
   - Use reverse domain notation
   - Must start with `pass.`
   - Example: `pass.com.acme.businesscard`
6. Click Continue, then Register

### 2. Note Your Pass Type ID

Save the identifier you created (e.g., `pass.com.yourcompany.businesscard`). You'll need this for configuration.

## Generating Certificates

### 1. Create Certificate Signing Request (CSR)

On macOS:

1. Open **Keychain Access** (Applications → Utilities → Keychain Access)
2. Menu: **Keychain Access** → **Certificate Assistant** → **Request a Certificate From a Certificate Authority**
3. Enter your email address
4. Common Name: `Apple Wallet Pass Certificate`
5. Select **Saved to disk**
6. Click Continue and save the file (`CertificateSigningRequest.certSigningRequest`)

### 2. Create Pass Type ID Certificate

1. Go to [Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Click the **+** button
3. Select **Pass Type ID Certificate**
4. Click Continue
5. Select your Pass Type ID from the dropdown
6. Click Continue
7. Upload your CSR file
8. Click Continue
9. Download the certificate (`pass.cer`)

### 3. Download WWDR Certificate

1. Go to [Apple PKI](https://www.apple.com/certificateauthority/)
2. Download **Worldwide Developer Relations - G4** certificate
3. Save as `AppleWWDRCAG4.cer`

Alternatively, download directly:
```bash
curl -O https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer
```

### 4. Install Certificates in Keychain (macOS)

1. Double-click `pass.cer` to install in Keychain
2. Double-click `AppleWWDRCAG4.cer` to install in Keychain
3. Open Keychain Access
4. Find your certificate (named after your Pass Type ID)
5. Expand it - you should see a private key underneath

### 5. Export Certificate with Private Key

1. In Keychain Access, select your Pass Type ID certificate
2. Right-click → **Export**
3. Save as: `PassCertificate.p12`
4. Set a password (remember this!)
5. Click Save
6. Enter your Mac password to allow export

## Converting Certificates

You need to convert certificates to PEM format and encode them as Base64.

### Method 1: Using OpenSSL (Recommended)

```bash
# Convert Pass Type ID certificate to PEM (includes private key)
openssl pkcs12 -in PassCertificate.p12 -out certificate.pem -nodes

# Convert WWDR certificate to PEM
openssl x509 -inform DER -in AppleWWDRCAG4.cer -out wwdr.pem

# Encode certificates as Base64 (single line)
cat certificate.pem | base64 > certificate.base64.txt
cat wwdr.pem | base64 > wwdr.base64.txt
```

### Method 2: Using Node.js

```javascript
const fs = require('fs')

// Read PEM files
const cert = fs.readFileSync('certificate.pem', 'utf8')
const wwdr = fs.readFileSync('wwdr.pem', 'utf8')

// Convert to Base64
const certBase64 = Buffer.from(cert).toString('base64')
const wwdrBase64 = Buffer.from(wwdr).toString('base64')

// Save to files
fs.writeFileSync('certificate.base64.txt', certBase64)
fs.writeFileSync('wwdr.base64.txt', wwdrBase64)

console.log('✅ Certificates converted to Base64')
```

### Verify Your Certificates

Your `certificate.pem` should contain:
```
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

Your `wwdr.pem` should contain:
```
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```

## Configuration

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Fill in Environment Variables

Edit `.env`:

```env
# Your Pass Type ID (from Apple Developer Portal)
APPLE_PASS_TYPE_ID=pass.com.yourcompany.businesscard

# Your Team ID (from Apple Developer Portal - 10 characters)
APPLE_TEAM_ID=ABCDE12345

# Base64-encoded certificate with private key
# Copy the entire content from certificate.base64.txt
APPLE_PASS_CERTIFICATE_BASE64=LS0tLS1CRUdJTi...

# Password you set when exporting the .p12 file
APPLE_PASS_CERTIFICATE_PASSWORD=your_password_here

# Base64-encoded WWDR certificate
# Copy the entire content from wwdr.base64.txt
APPLE_WWDR_CERTIFICATE_BASE64=LS0tLS1CRUdJTi...

# Your organization name (optional)
ORGANIZATION_NAME=Your Company
```

### 3. Verify Configuration

Create a test script `test-config.js`:

```javascript
require('dotenv').config()

const required = [
  'APPLE_PASS_TYPE_ID',
  'APPLE_TEAM_ID',
  'APPLE_PASS_CERTIFICATE_BASE64',
  'APPLE_PASS_CERTIFICATE_PASSWORD',
  'APPLE_WWDR_CERTIFICATE_BASE64'
]

console.log('Checking environment variables...\n')

let allPresent = true
for (const key of required) {
  const value = process.env[key]
  if (value) {
    console.log(`✅ ${key}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`❌ ${key}: MISSING`)
    allPresent = false
  }
}

if (allPresent) {
  console.log('\n✅ All required environment variables are set!')
} else {
  console.log('\n❌ Some environment variables are missing')
  process.exit(1)
}
```

Run it:
```bash
node test-config.js
```

## Testing

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build the Library

```bash
pnpm run build
```

### 3. Run Example

```bash
node examples/basic-usage.js
```

This should generate a `.pkpass` file.

### 4. Test the Pass

#### On macOS:
- Double-click the `.pkpass` file
- It should open in Preview or prompt to add to Wallet (if you have an iPhone connected)

#### On iPhone:
- AirDrop the `.pkpass` file to your iPhone
- Tap the file
- Tap "Add" to add to Apple Wallet

#### Via Email:
- Email the `.pkpass` file to yourself
- Open on iPhone
- Tap the attachment
- Tap "Add"

## Troubleshooting

### "Certificate not found in PEM content"

- Ensure you exported the certificate with private key
- Verify `certificate.pem` contains both certificate and private key
- Try exporting from Keychain again with `-nodes` flag

### "Failed to decrypt private key"

- Check that `APPLE_PASS_CERTIFICATE_PASSWORD` matches the password you set
- Try converting the certificate again

### "WWDR certificate not found"

- Ensure you downloaded the correct WWDR certificate (G4)
- Verify `wwdr.pem` contains a valid certificate

### Pass doesn't install on iPhone

- Verify Pass Type ID matches exactly
- Check Team ID is correct
- Ensure certificates are not expired
- Test on a physical device (not simulator)

### "Invalid signature"

- Ensure WWDR certificate is up to date
- Verify all certificates are properly formatted
- Check that private key is included in certificate

## Security Best Practices

1. **Never commit certificates** to version control
2. **Use environment variables** for sensitive data
3. **Rotate certificates** before they expire
4. **Use different certificates** for development and production
5. **Enable 2FA** on your Apple Developer account
6. **Restrict access** to certificate files
7. **Use secrets management** in production (e.g., AWS Secrets Manager, HashiCorp Vault)

## Certificate Expiration

Apple certificates expire after **1-2 years**. To renew:

1. Go to [Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Find your expired certificate
3. Click "Revoke" (if not already expired)
4. Create a new certificate following the same steps above
5. Update your environment variables with the new certificate

## Next Steps

- Read the [README.md](README.md) for usage examples

## Resources

- [Apple Wallet Developer Guide](https://developer.apple.com/wallet/)
- [PassKit Package Format Reference](https://developer.apple.com/library/archive/documentation/UserExperience/Reference/PassKit_Bundle/Chapters/Introduction.html)
- [Apple PKI](https://www.apple.com/certificateauthority/)

---

Need help? Open an issue: https://github.com/0xJovin/applewalletpass/issues
