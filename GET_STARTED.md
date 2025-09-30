# 🚀 Get Started - Apple Wallet Pass Generator

Welcome! This guide will help you get your open-source library ready for publication.

## ✅ What You Have

Your complete npm package includes:

- ✅ **Core library** (`src/index.ts`) - Fully functional pass generator
- ✅ **TypeScript configuration** - Ready for compilation
- ✅ **Package configuration** - npm-ready `package.json`
- ✅ **Comprehensive documentation** - README, guides, and examples
- ✅ **Multiple examples** - Next.js, Express, basic, and advanced
- ✅ **License** - MIT open-source license
- ✅ **Git configuration** - `.gitignore` and `.npmignore`

## 📋 Quick Checklist

### Step 1: Install Dependencies (2 minutes)

```bash
pnpm install
```

This will install:
- `node-forge` - For PKCS#7 signing
- `typescript` - For compilation
- `@types/node` and `@types/node-forge` - Type definitions
- `dotenv` - For environment variables

### Step 2: Set Up Environment (5-10 minutes)

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Apple Developer credentials
# See SETUP.md for detailed instructions
```

**Need Apple certificates?** Follow [SETUP.md](SETUP.md) for complete instructions.

### Step 3: Verify Setup (1 minute)

```bash
pnpm run check-setup
```

This script will verify:
- All required environment variables are set
- Certificates are in correct format
- Pass Type ID and Team ID are valid

### Step 4: Build the Library (1 minute)

```bash
pnpm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Step 5: Test It (2 minutes)

```bash
# Run basic example
npx ts-node examples/basic-usage.ts

# Or run advanced examples
npx ts-node examples/advanced-usage.ts
```

This will generate `.pkpass` files you can test on your iPhone!

## 🎯 Before Publishing

### 1. Customize Package Information

Edit `package.json`:

```json
{
  "name": "apple-wallet-pass-generator",  // Check npm availability
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/apple-wallet-pass-generator.git"
  }
}
```

### 2. Check Package Name Availability

```bash
npm search apple-wallet-pass-generator
```

If taken, consider alternatives:
- `@yourorg/apple-wallet-pass-generator` (scoped)
- `apple-pkpass-generator`
- `wallet-pass-generator`
- `pkpass-business-card`

### 3. GitHub Repository

Your code is already on GitHub:
https://github.com/0xJovin/applewalletpass

```bash
# Already completed ✅
git remote add origin https://github.com/0xJovin/applewalletpass.git
git push -u origin main
```

### 4. Test Package Locally

```bash
# Create a tarball
pnpm pack

# This creates: apple-wallet-pass-generator-1.0.0.tgz

# Test in another project
cd /path/to/test-project
pnpm install /path/to/apple-wallet-pass-generator-1.0.0.tgz
```

## 📤 Publishing to npm

### First Time Setup

```bash
# Create npm account at npmjs.com
# Then login
npm login
```

### Publish

```bash
# Make sure everything is built
pnpm run build

# Publish to npm
npm publish

# For scoped packages:
npm publish --access public
```

### After Publishing

```bash
# Create git tag
git tag v1.0.0
git push origin v1.0.0

# Create GitHub release
# Go to: https://github.com/YOUR_USERNAME/REPO_NAME/releases/new
```

## 📚 Documentation Files

Your project includes these guides:

| File | Purpose |
|------|---------|
| `README.md` | Main documentation with API reference |
| `QUICKSTART.md` | 5-minute quick start guide |
| `SETUP.md` | Detailed certificate setup instructions |
| `PUBLISHING.md` | Step-by-step publishing guide |
| `CONTRIBUTING.md` | Guidelines for contributors |
| `PROJECT_SUMMARY.md` | Complete project overview |
| `CHANGELOG.md` | Version history |
| `examples/README.md` | Examples documentation |

## 🔧 Available Commands

```bash
# Install dependencies
pnpm install

# Build the library
pnpm run build

# Check environment setup
pnpm run check-setup

# Run examples
npx ts-node examples/basic-usage.ts
npx ts-node examples/advanced-usage.ts
npx ts-node examples/express-server.ts

# Create package tarball for testing
pnpm pack

# Publish to npm
npm publish
```

## 📱 Testing Generated Passes

### On iPhone

**Method 1: AirDrop**
1. Generate a pass
2. AirDrop the `.pkpass` file to your iPhone
3. Tap to add to Wallet

**Method 2: Email**
1. Email the `.pkpass` file to yourself
2. Open on iPhone
3. Tap attachment → Add

**Method 3: Web**
1. Host the file on a web server
2. Open URL in Safari on iPhone
3. Tap to download and add

## 🎨 Customization Tips

### Change Package Name

1. Update `name` in `package.json`
2. Update imports in examples
3. Update README installation instructions

### Add Your Branding

1. Update `organizationName` in config
2. Customize `logoText` in pass JSON
3. Add your company logo to passes
4. Update documentation with your info

### Add More Features

Consider adding:
- Unit tests (Jest, Vitest)
- CLI tool for command-line usage
- Image optimization
- Pass validation
- Support for other pass types

## 🆘 Troubleshooting

### Lint Errors About Missing Types

**Solution:** Run `pnpm install` to install `@types/node`

### "Cannot find module"

**Solution:** Make sure you've run `pnpm install` and `pnpm run build`

### Certificate Errors

**Solution:** Follow [SETUP.md](SETUP.md) carefully. Common issues:
- Certificate doesn't include private key
- Wrong password
- Expired certificates
- Incorrect Base64 encoding

### Pass Won't Install on iPhone

**Solution:**
- Verify Pass Type ID matches your Apple Developer account
- Check Team ID is correct (10 characters)
- Ensure certificates are valid and not expired
- Test on a physical device (not simulator)

## 📞 Need Help?

1. **Read the docs** - Check README.md, SETUP.md, QUICKSTART.md
2. **Run check-setup** - `pnpm run check-setup`
3. **Check examples** - See working code in `examples/`
4. **GitHub Issues** - Report bugs or ask questions
5. **Email support** - (add your email)

## 🎉 You're Ready!

Your open-source library is complete and ready to share! Here's what to do next:

1. ✅ Install dependencies (`pnpm install`)
2. ✅ Set up environment (`.env` file)
3. ✅ Verify setup (`pnpm run check-setup`)
4. ✅ Build library (`pnpm run build`)
5. ✅ Test locally (run examples)
6. ✅ Customize package info
7. ✅ Create GitHub repo
8. ✅ Publish to npm
9. ✅ Share with the community!

## 🌟 Promote Your Library

After publishing:

- 📢 Share on Twitter, Reddit, Dev.to
- 📝 Write a blog post about it
- 🎥 Create a demo video
- 📚 Submit to awesome lists
- 💬 Enable GitHub Discussions
- ⭐ Ask for stars on GitHub

---

**Good luck with your open-source project!** 🚀

Made with ❤️ for the developer community
