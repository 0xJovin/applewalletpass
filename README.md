# Apple Wallet Pass Generator

A TypeScript library for generating Apple Wallet business card passes with vCard support. Create beautiful, professional digital business cards that can be added directly to Apple Wallet.

## Features

- ✅ **Easy to use** - Simple API for generating Apple Wallet passes
- 📇 **vCard support** - Generate QR codes with vCard data for easy contact saving
- 🎨 **Customizable** - Brand colors, logos, and profile photos
- 🔗 **Multiple QR modes** - vCard, LinkedIn, custom URLs, or LeaveGen forms
- 🔒 **Secure** - Proper PKCS#7 signing with Apple certificates
- 📱 **iOS compatible** - Works seamlessly with Apple Wallet
- 🚀 **TypeScript** - Full type safety and IntelliSense support

## Installation

```bash
pnpm install apple-wallet-pass-generator
```

or

```bash
npm install apple-wallet-pass-generator
```

or

```bash
yarn add apple-wallet-pass-generator
```

## Prerequisites

Before using this library, you need to:

1. **Enroll in the Apple Developer Program** ($99/year)
2. **Create a Pass Type ID** in your Apple Developer account
3. **Generate certificates**:
   - Pass Type ID Certificate
   - Apple Worldwide Developer Relations (WWDR) Certificate

### Getting Your Certificates

1. Go to [Apple Developer Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Create a new "Pass Type ID Certificate"
3. Download your certificate (.cer file)
4. Download the [WWDR Certificate](https://www.apple.com/certificateauthority/)
5. Convert certificates to PEM format:

```bash
# Convert Pass Type ID certificate to PEM (with private key)
openssl pkcs12 -in YourCertificate.p12 -out certificate.pem -nodes

# Convert WWDR certificate to PEM
openssl x509 -inform DER -in AppleWWDRCA.cer -out wwdr.pem

# Base64 encode for use in your app
cat certificate.pem | base64 > certificate.base64.txt
cat wwdr.pem | base64 > wwdr.base64.txt
```

## Usage

### Basic Example

```typescript
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'

// Configure your Apple Wallet credentials
const config = {
  passTypeIdentifier: 'pass.com.yourcompany.businesscard',
  teamIdentifier: 'YOUR_TEAM_ID', // 10-character string from Apple
  certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
  certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
  wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
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
  brandColor: '#156741', // Hex color for the pass
  qrCodeMode: 'vcard' // Generate vCard QR code
}

// Generate the pass
const result = await generateBusinessCardPass(cardData, config)

// result.buffer contains the .pkpass file
// result.filename is the suggested filename (e.g., "John_Doe.pkpass")

// Example: Save to file
import { writeFileSync } from 'fs'
writeFileSync(result.filename, result.buffer)
```

### Next.js API Route Example

```typescript
// app/api/wallet/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'

export async function POST(request: NextRequest) {
  try {
    const cardData = await request.json()

    const config = {
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
      teamIdentifier: process.env.APPLE_TEAM_ID!,
      certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
      certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
      wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
      organizationName: 'Your Company'
    }

    const result = await generateBusinessCardPass(cardData, config)

    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${result.filename}"`
      }
    })
  } catch (error) {
    console.error('Error generating pass:', error)
    return NextResponse.json(
      { error: 'Failed to generate pass' },
      { status: 500 }
    )
  }
}
```

### Express.js Example

```typescript
import express from 'express'
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'

const app = express()
app.use(express.json())

app.post('/api/wallet', async (req, res) => {
  try {
    const config = {
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
      teamIdentifier: process.env.APPLE_TEAM_ID!,
      certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
      certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
      wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
      organizationName: 'Your Company'
    }

    const result = await generateBusinessCardPass(req.body, config)

    res.setHeader('Content-Type', 'application/vnd.apple.pkpass')
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`)
    res.send(result.buffer)
  } catch (error) {
    console.error('Error generating pass:', error)
    res.status(500).json({ error: 'Failed to generate pass' })
  }
})

app.listen(3000)
```

## API Reference

### `generateBusinessCardPass(cardData, config)`

Generates an Apple Wallet pass file (.pkpass) for a business card.

#### Parameters

**`cardData: BusinessCardData`** - Business card information

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `firstName` | `string` | ✅ | First name |
| `lastName` | `string` | ✅ | Last name |
| `email` | `string` | ✅ | Email address |
| `title` | `string` | ✅ | Job title |
| `company` | `string` | ❌ | Company name |
| `phone` | `string` | ❌ | Phone number |
| `website` | `string` | ❌ | Website URL |
| `linkedin` | `string` | ❌ | LinkedIn profile (URL or username) |
| `brandColor` | `string` | ✅ | Brand color in hex format (e.g., `#156741`) |
| `profilePhoto` | `string` | ❌ | Profile photo as base64 data URL |
| `companyLogo` | `string` | ❌ | Company logo as base64 data URL |
| `qrCodeBase64` | `string` | ❌ | Custom QR code icon as base64 (without data URL prefix) |
| `qrCodeMode` | `'vcard' \| 'linkedin' \| 'custom' \| 'leavegen'` | ❌ | QR code content type (default: `'vcard'`) |
| `customLink` | `string` | ❌ | Custom URL when `qrCodeMode` is `'custom'` |
| `leavegenFormId` | `string` | ❌ | LeaveGen form ID when `qrCodeMode` is `'leavegen'` |
| `customFields` | `Array<{id, label, value}>` | ❌ | Additional fields to include in vCard |

**`config: AppleWalletConfig`** - Apple Wallet configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `passTypeIdentifier` | `string` | ✅ | Apple Pass Type Identifier |
| `teamIdentifier` | `string` | ✅ | Apple Team Identifier (10 characters) |
| `certificateBase64` | `string` | ✅ | Base64-encoded certificate and private key (PEM) |
| `certificatePassword` | `string` | ✅ | Certificate password |
| `wwdrCertificateBase64` | `string` | ✅ | Base64-encoded WWDR certificate (PEM) |
| `organizationName` | `string` | ❌ | Organization name (default: "Business Card") |

#### Returns

**`Promise<PassGenerationResult>`**

```typescript
{
  buffer: Buffer,    // The .pkpass file as a Buffer
  filename: string   // Suggested filename (e.g., "John_Doe.pkpass")
}
```

## QR Code Modes

The library supports multiple QR code content types:

### 1. vCard (Default)
Generates a vCard with all contact information. When scanned, allows users to save the contact directly.

```typescript
const cardData = {
  // ... other fields
  qrCodeMode: 'vcard'
}
```

### 2. LinkedIn
QR code links directly to LinkedIn profile.

```typescript
const cardData = {
  // ... other fields
  linkedin: 'johndoe',
  qrCodeMode: 'linkedin'
}
```

### 3. Custom URL
QR code links to any custom URL.

```typescript
const cardData = {
  // ... other fields
  customLink: 'https://example.com/contact',
  qrCodeMode: 'custom'
}
```

### 4. LeaveGen Form
QR code links to a LeaveGen form.

```typescript
const cardData = {
  // ... other fields
  leavegenFormId: 'your-form-id',
  qrCodeMode: 'leavegen'
}
```

## Environment Variables

For security, store your certificates as environment variables:

```env
APPLE_PASS_TYPE_ID=pass.com.yourcompany.businesscard
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_PASS_CERTIFICATE_BASE64=<base64-encoded-certificate-pem>
APPLE_PASS_CERTIFICATE_PASSWORD=<your-certificate-password>
APPLE_WWDR_CERTIFICATE_BASE64=<base64-encoded-wwdr-pem>
```

## Image Requirements

- **Profile Photo**: Recommended 150x150px or larger, PNG/JPG
- **Company Logo**: Recommended 160x50px, PNG with transparency
- **QR Code Icon**: 29x29px for standard, 87x87px for @2x, PNG

All images should be provided as base64 data URLs:
```typescript
profilePhoto: 'data:image/png;base64,iVBORw0KGgo...'
```

## Error Handling

The library throws descriptive errors for common issues:

```typescript
try {
  const result = await generateBusinessCardPass(cardData, config)
} catch (error) {
  if (error.message.includes('Missing required fields')) {
    // Handle missing required fields
  } else if (error.message.includes('Certificate not found')) {
    // Handle certificate issues
  } else {
    // Handle other errors
  }
}
```

## Common Issues

### Certificate Errors
- Ensure certificates are in PEM format
- Verify the certificate includes both the certificate and private key
- Check that the password is correct
- Make sure WWDR certificate is up to date

### Pass Not Installing
- Verify Pass Type ID matches your Apple Developer account
- Check that Team ID is correct (10 characters)
- Ensure all required fields are provided
- Test on a physical iOS device (Simulator has limitations)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 Issues: [GitHub Issues](https://github.com/0xJovin/applewalletpass/issues)
- 📖 Documentation: [GitHub Repository](https://github.com/0xJovin/applewalletpass)

## Acknowledgments

- Built with [node-forge](https://github.com/digitalbazaar/forge) for PKCS#7 signing
- Inspired by the need for easy digital business card generation
- Thanks to the Apple Wallet developer community

## Related Projects

- [passkit-generator](https://github.com/alexandercerutti/passkit-generator) - Another Apple Wallet pass generator
- [passgenerator](https://github.com/walletpass/pass-js) - Pass generation library

---

Made with ❤️ for the open-source community
