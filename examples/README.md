# Examples

This directory contains example implementations of the Apple Wallet Pass Generator library.

## Available Examples

### 1. Basic Usage (`basic-usage.ts`)

Simple example showing how to generate a basic business card pass with minimal configuration.

**Features:**
- Basic contact information
- vCard QR code
- Simple configuration

**Run:**
```bash
npx ts-node examples/basic-usage.ts
```

### 2. Next.js API Route (`nextjs-api-route.ts`)

Complete example of integrating the library into a Next.js application.

**Features:**
- App Router example (Next.js 13+)
- Pages Router example (Next.js 12)
- Error handling
- Environment variable configuration

**Usage:**
- Copy to `app/api/wallet/route.ts` (App Router)
- Or `pages/api/wallet.ts` (Pages Router)

### 3. Express Server (`express-server.ts`)

Full Express.js server implementation with multiple endpoints.

**Features:**
- Health check endpoint
- Pass generation endpoint
- Example request endpoint
- Error handling middleware
- Request validation

**Run:**
```bash
npx ts-node examples/express-server.ts
```

Then test with:
```bash
curl -X POST http://localhost:3000/api/wallet \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "title": "Software Engineer",
    "brandColor": "#156741"
  }' \
  --output john_doe.pkpass
```

### 4. Advanced Usage (`advanced-usage.ts`)

Comprehensive examples showing all library features.

**Features:**
- LinkedIn QR code mode
- Custom URL QR code mode
- Custom fields
- Profile photos and company logos
- Batch generation
- Multiple brand colors

**Run:**
```bash
npx ts-node examples/advanced-usage.ts
```

## Prerequisites

Before running examples, ensure you have:

1. **Environment variables configured** (see `.env.example`)
2. **Apple Developer certificates** set up (see `SETUP.md`)
3. **Dependencies installed**:
   ```bash
   pnpm install
   ```
4. **TypeScript and ts-node** (for running .ts files directly):
   ```bash
   pnpm add -D typescript ts-node @types/node
   ```

## Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your Apple Developer credentials:

```env
APPLE_PASS_TYPE_ID=pass.com.yourcompany.businesscard
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_PASS_CERTIFICATE_BASE64=...
APPLE_PASS_CERTIFICATE_PASSWORD=...
APPLE_WWDR_CERTIFICATE_BASE64=...
ORGANIZATION_NAME=Your Company
```

See [SETUP.md](../SETUP.md) for detailed instructions.

## Running Examples

### Using ts-node (Development)

```bash
npx ts-node examples/basic-usage.ts
```

### Using compiled JavaScript

```bash
# Build the library first
pnpm run build

# Compile examples
npx tsc examples/basic-usage.ts --outDir dist/examples

# Run compiled version
node dist/examples/basic-usage.js
```

## Testing Generated Passes

### On macOS

Double-click the `.pkpass` file - it will open in Preview or prompt to add to Wallet.

### On iPhone

**Method 1: AirDrop**
1. AirDrop the `.pkpass` file to your iPhone
2. Tap the file
3. Tap "Add" to add to Apple Wallet

**Method 2: Email**
1. Email the `.pkpass` file to yourself
2. Open email on iPhone
3. Tap the attachment
4. Tap "Add"

**Method 3: Web Server**
1. Host the file on a web server
2. Open the URL on iPhone Safari
3. Tap to download
4. Tap "Add"

### Troubleshooting

**Pass doesn't open:**
- Verify certificates are correctly configured
- Check Pass Type ID matches your Apple Developer account
- Ensure Team ID is correct

**"Unable to Add Pass":**
- Certificate may be expired
- Pass Type ID may not exist in your account
- WWDR certificate may be outdated

**Pass opens but looks wrong:**
- Check brand color format (must be hex: `#RRGGBB`)
- Verify all required fields are provided
- Check image formats (PNG/JPG for photos)

## Example Output

When you run an example successfully, you'll see:

```
✅ Pass generated successfully!
📦 File size: 12345 bytes
📄 Filename: John_Doe.pkpass
💾 Saved to: John_Doe.pkpass

📱 You can now add this pass to Apple Wallet!
```

## Customization Ideas

### Custom Branding

```typescript
const cardData = {
  // ... other fields
  brandColor: '#FF6B6B',  // Your brand color
  companyLogo: 'data:image/png;base64,...',  // Your logo
  organizationName: 'Your Company'
}
```

### Different QR Modes

```typescript
// vCard (default) - Full contact info
qrCodeMode: 'vcard'

// LinkedIn profile
qrCodeMode: 'linkedin',
linkedin: 'yourprofile'

// Custom URL
qrCodeMode: 'custom',
customLink: 'https://your-website.com/contact'
```

### Additional Contact Info

```typescript
const cardData = {
  // ... required fields
  phone: '+1 (555) 123-4567',
  website: 'https://example.com',
  linkedin: 'yourprofile',
  customFields: [
    { id: '1', label: 'Department', value: 'Engineering' },
    { id: '2', label: 'Location', value: 'San Francisco' }
  ]
}
```

## Integration Examples

### React Component

```typescript
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'

async function downloadPass(userData) {
  const config = {
    passTypeIdentifier: process.env.NEXT_PUBLIC_PASS_TYPE_ID,
    // ... other config
  }

  const result = await generateBusinessCardPass(userData, config)
  
  // Create download link
  const blob = new Blob([result.buffer], { type: 'application/vnd.apple.pkpass' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = result.filename
  a.click()
}
```

### Vue Component

```typescript
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'

export default {
  methods: {
    async generatePass() {
      const config = { /* ... */ }
      const result = await generateBusinessCardPass(this.userData, config)
      
      const blob = new Blob([result.buffer], { 
        type: 'application/vnd.apple.pkpass' 
      })
      const url = URL.createObjectURL(blob)
      window.open(url)
    }
  }
}
```

## Need Help?

- 📖 Read the [main README](../README.md)
- 🔧 Check the [Setup Guide](../SETUP.md)
- 🐛 Report issues on [GitHub](https://github.com/yourusername/apple-wallet-pass-generator/issues)
- 💬 Ask questions in [Discussions](https://github.com/yourusername/apple-wallet-pass-generator/discussions)

## Contributing

Have a great example to share? Please contribute!

1. Create your example file
2. Add documentation
3. Test thoroughly
4. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
