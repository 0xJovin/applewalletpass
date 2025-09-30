# Quick Start Guide

Get up and running with Apple Wallet Pass Generator in 5 minutes!

## 1. Install

```bash
pnpm install apple-wallet-pass-generator
```

## 2. Get Apple Certificates

You need an Apple Developer account ($99/year). Then:

1. Create a **Pass Type ID** at [developer.apple.com](https://developer.apple.com/account/resources/identifiers/list)
2. Generate a **Pass Type ID Certificate**
3. Download the **WWDR Certificate**
4. Convert to PEM format and Base64 encode

**Detailed instructions:** See [SETUP.md](SETUP.md)

## 3. Configure Environment

Create `.env`:

```env
APPLE_PASS_TYPE_ID=pass.com.yourcompany.businesscard
APPLE_TEAM_ID=ABCDE12345
APPLE_PASS_CERTIFICATE_BASE64=LS0tLS1CRUdJTi...
APPLE_PASS_CERTIFICATE_PASSWORD=your_password
APPLE_WWDR_CERTIFICATE_BASE64=LS0tLS1CRUdJTi...
```

## 4. Generate Your First Pass

```typescript
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'

const config = {
  passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
  teamIdentifier: process.env.APPLE_TEAM_ID!,
  certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
  certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
  wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
  organizationName: 'Your Company'
}

const cardData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  title: 'Software Engineer',
  brandColor: '#156741'
}

const result = await generateBusinessCardPass(cardData, config)

// result.buffer contains the .pkpass file
// result.filename is "John_Doe.pkpass"
```

## 5. Use in Your App

### Next.js API Route

```typescript
// app/api/wallet/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'

export async function POST(request: NextRequest) {
  const cardData = await request.json()
  
  const config = {
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID!,
    teamIdentifier: process.env.APPLE_TEAM_ID!,
    certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
    certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
    wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
  }

  const result = await generateBusinessCardPass(cardData, config)

  return new NextResponse(result.buffer, {
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="${result.filename}"`
    }
  })
}
```

### Express.js

```typescript
import express from 'express'
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'

const app = express()
app.use(express.json())

app.post('/api/wallet', async (req, res) => {
  const config = { /* ... */ }
  const result = await generateBusinessCardPass(req.body, config)
  
  res.setHeader('Content-Type', 'application/vnd.apple.pkpass')
  res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`)
  res.send(result.buffer)
})

app.listen(3000)
```

## 6. Test on iPhone

1. Generate a pass
2. AirDrop to your iPhone (or email it)
3. Tap the `.pkpass` file
4. Tap "Add" to add to Apple Wallet

## Common Options

### Add Profile Photo

```typescript
const cardData = {
  // ... other fields
  profilePhoto: 'data:image/png;base64,iVBORw0KGgo...'
}
```

### Add Company Logo

```typescript
const cardData = {
  // ... other fields
  companyLogo: 'data:image/png;base64,iVBORw0KGgo...'
}
```

### LinkedIn QR Code

```typescript
const cardData = {
  // ... other fields
  linkedin: 'yourprofile',
  qrCodeMode: 'linkedin'
}
```

### Custom URL QR Code

```typescript
const cardData = {
  // ... other fields
  qrCodeMode: 'custom',
  customLink: 'https://your-website.com'
}
```

### Add Custom Fields

```typescript
const cardData = {
  // ... other fields
  customFields: [
    { id: '1', label: 'Department', value: 'Engineering' },
    { id: '2', label: 'Location', value: 'San Francisco' }
  ]
}
```

## Troubleshooting

### "Missing required fields"
Make sure you provide: `firstName`, `lastName`, `email`, `title`, `brandColor`

### "Certificate not found"
- Check your Base64 encoding is correct
- Ensure certificate includes private key
- Verify PEM format

### Pass won't install on iPhone
- Verify Pass Type ID matches your Apple Developer account
- Check Team ID is correct (10 characters)
- Ensure certificates are not expired
- Test on a physical device (not simulator)

## Next Steps

- 📖 Read the full [README.md](README.md)
- 🔧 Complete [SETUP.md](SETUP.md) for certificate details
- 💡 Check [examples/](examples/) for more use cases
- 🚀 See [PUBLISHING.md](PUBLISHING.md) to publish your own version

## Need Help?

- 🐛 [Report Issues](https://github.com/0xJovin/applewalletpass/issues)
- 📖 [Documentation](https://github.com/0xJovin/applewalletpass)

---

Happy coding! 🎉
