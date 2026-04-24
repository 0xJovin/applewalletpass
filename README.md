<div align="center">
  # Apple Wallet Pass Generator

  [![npm version](https://img.shields.io/npm/v/apple-wallet-pass-generator.svg)](https://www.npmjs.com/package/apple-wallet-pass-generator)
  [![npm downloads](https://img.shields.io/npm/dt/apple-wallet-pass-generator.svg)](https://www.npmjs.com/package/apple-wallet-pass-generator)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![GitHub stars](https://img.shields.io/github/stars/0xJovin/applewalletpass.svg)](https://github.com/0xJovin/applewalletpass/stargazers)
  [![GitHub issues](https://img.shields.io/github/issues/0xJovin/applewalletpass.svg)](https://github.com/0xJovin/applewalletpass/issues)

  **A sleek, type-safe library for generating professional Apple Wallet business card passes with vCard support.**
</div>

---

## 📖 Table of Contents

- [Motivation](#-motivation)
- [Features](#-features)
- [Installation](#-installation)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Project Status](#-project-status)
- [License](#-license)

---

## 💡 Motivation

I built this library because I couldn't find a "plug and play" solution for generating Apple Wallet passes that just worked out of the box. 

While building my digital business card product, [Cardova](https://getcardova.com), I had to spend a significant amount of time deep-diving into Apple's PassKit documentation, PKCS#7 signing, and manifest creation. Once I figured it out, I decided to package the logic into a clean, easy-to-use library so others wouldn't have to go through the same struggle. This is my first contribution to the open-source community!

---

## ✨ Features

- ✅ **Type-Safe** - Built with TypeScript for full IntelliSense and type safety.
- 📇 **vCard Support** - Automatically generate QR codes that allow users to save your contact info with one tap.
- 🎨 **Dynamic Branding** - Custom colors, profile photos, and company logos with automatic contrast detection.
- 🔗 **Versatile QR Modes** - Support for vCard, LinkedIn, custom URLs, and lead generation forms.
- 🔒 **Secure Signing** - Handles complex PKCS#7 signing and manifest creation out of the box.
- 📱 **Native Experience** - Generates standard `.pkpass` files compatible with iOS Wallet.

---

## 🚀 Installation

```bash
# Using pnpm
pnpm add apple-wallet-pass-generator

# Using npm
npm install apple-wallet-pass-generator

# Using yarn
yarn add apple-wallet-pass-generator
```

---

## 🔑 Prerequisites

To use this library, you must have an **Apple Developer Program** account. You will need:

1.  **Pass Type ID**: Created in your [Apple Developer Account](https://developer.apple.com/account/resources/identifiers/list/passTypeId).
2.  **Certificates**:
    - **Pass Type ID Certificate**: Downloaded from Apple and converted to PEM.
    - **WWDR Certificate**: The Apple Worldwide Developer Relations certificate.

> [!TIP]
> See [SETUP.md](SETUP.md) for a detailed step-by-step guide on how to export and convert your certificates.

---

## ⚡ Quick Start

### 1. Basic Generation

```typescript
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'
import { writeFileSync } from 'fs'

async function createPass() {
  const config = {
    passTypeIdentifier: 'pass.com.yourcompany.businesscard',
    teamIdentifier: 'YOUR_TEAM_ID',
    certificateBase64: process.env.APPLE_PASS_CERTIFICATE_BASE64!,
    certificatePassword: process.env.APPLE_PASS_CERTIFICATE_PASSWORD!,
    wwdrCertificateBase64: process.env.APPLE_WWDR_CERTIFICATE_BASE64!,
    organizationName: 'Your Company'
  }

  const cardData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    title: 'Software Engineer',
    brandColor: '#156741',
    qrCodeMode: 'vcard'
  }

  const { buffer, filename } = await generateBusinessCardPass(cardData, config)
  writeFileSync(filename, buffer)
}
```

### 2. Next.js Integration

```typescript
// app/api/wallet/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateBusinessCardPass } from 'apple-wallet-pass-generator'

export async function POST(req: NextRequest) {
  const cardData = await req.json()
  const result = await generateBusinessCardPass(cardData, {
    /* your config */
  })

  return new NextResponse(result.buffer, {
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="${result.filename}"`
    }
  })
}
```

---

## 🛠 API Reference

### `generateBusinessCardPass(cardData, config)`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `cardData` | `BusinessCardData` | Information about the person/company on the pass. |
| `config` | `AppleWalletConfig` | Your Apple Wallet credentials and certificates. |

#### `BusinessCardData` Options

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `firstName` | `string` | ✅ | User's first name |
| `lastName` | `string` | ✅ | User's last name |
| `email` | `string` | ✅ | Contact email address |
| `title` | `string` | ✅ | Job title |
| `brandColor` | `string` | ✅ | Hex color (e.g., `#156741`) |
| `company` | `string` | ❌ | Company name |
| `profilePhoto` | `string` | ❌ | Base64 Data URL (recommended 150x150px) |
| `qrCodeMode` | `string` | ❌ | `vcard`, `linkedin`, `custom`, or `leavegen` |

---

## 🛠 Project Status

This project is currently **stable and feature-complete**. While I use it for my own needs and will try to fix critical bugs, I am not actively looking for new features or accepting Pull Requests at this time. Feel free to fork the repository if you need to make custom modifications!

---

## 🛡 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">
  Made with ❤️ for the open-source community
</div>
