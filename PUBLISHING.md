# Publishing Guide

This guide will help you publish the `apple-wallet-pass-generator` package to npm.

## Prerequisites

1. **npm account** - Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **npm CLI** - Installed with Node.js
3. **Git repository** - Push your code to GitHub first

## Pre-Publishing Checklist

- [ ] All tests pass (if you have tests)
- [ ] Documentation is complete and accurate
- [ ] Version number is updated in `package.json`
- [ ] CHANGELOG.md is updated
- [ ] README.md has correct package name and repository URLs
- [ ] LICENSE file is present
- [ ] `.npmignore` is configured correctly
- [ ] Code is built successfully (`pnpm run build`)

## Step-by-Step Publishing Process

### 1. Update Package Information

Edit `package.json` and update:

```json
{
  "name": "apple-wallet-pass-generator",
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/apple-wallet-pass-generator.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/apple-wallet-pass-generator/issues"
  },
  "homepage": "https://github.com/yourusername/apple-wallet-pass-generator#readme"
}
```

### 2. Build the Package

```bash
pnpm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 3. Test the Package Locally

Before publishing, test your package locally:

```bash
# Create a tarball
pnpm pack

# This creates apple-wallet-pass-generator-1.0.0.tgz
# Install it in another project to test
cd /path/to/test-project
pnpm install /path/to/apple-wallet-pass-generator-1.0.0.tgz
```

### 4. Login to npm

```bash
npm login
```

Enter your npm credentials.

### 5. Publish to npm

For the first release:

```bash
npm publish
```

For scoped packages (e.g., `@yourorg/apple-wallet-pass-generator`):

```bash
npm publish --access public
```

### 6. Verify Publication

Check your package on npm:
```
https://www.npmjs.com/package/apple-wallet-pass-generator
```

### 7. Create a Git Tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 8. Create a GitHub Release

1. Go to https://github.com/0xJovin/applewalletpass/releases/new
2. Click "Choose a tag" → Create new tag: `v1.0.0`
3. Set release title: `v1.0.0 - Initial Release`
4. Add release notes from CHANGELOG.md
5. Publish the release

## Publishing Updates

### Patch Release (1.0.0 → 1.0.1)

Bug fixes and minor changes:

```bash
npm version patch
npm publish
git push && git push --tags
```

### Minor Release (1.0.0 → 1.1.0)

New features (backward compatible):

```bash
npm version minor
npm publish
git push && git push --tags
```

### Major Release (1.0.0 → 2.0.0)

Breaking changes:

```bash
npm version major
npm publish
git push && git push --tags
```

## Package Naming Considerations

If `apple-wallet-pass-generator` is taken, consider:

- `@yourorg/apple-wallet-pass-generator` (scoped package)
- `apple-pkpass-generator`
- `wallet-pass-generator`
- `pkpass-business-card`
- `apple-wallet-business-card`

Check availability:
```bash
npm search apple-wallet-pass-generator
```

## Best Practices

### Versioning

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible functionality
- **PATCH** version for backward-compatible bug fixes

### Documentation

- Keep README.md up to date
- Update CHANGELOG.md for every release
- Include migration guides for breaking changes
- Add examples for new features

### Testing

Before each release:
- Test in a real project
- Verify all examples work
- Check TypeScript types are correct
- Test with different Node versions

### Security

- Never commit certificates or private keys
- Use environment variables for sensitive data
- Review dependencies regularly
- Enable npm 2FA for your account

## Continuous Integration (Optional)

### GitHub Actions for Automated Publishing

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### "Package name already exists"

Choose a different name or use a scoped package.

### "You must be logged in to publish"

Run `npm login` and enter your credentials.

### "Missing required field"

Check `package.json` has all required fields:
- name
- version
- description
- main
- license

### "Files not included in package"

Check `.npmignore` - make sure `dist/` is not ignored.

### TypeScript types not working

Ensure:
- `"types": "dist/index.d.ts"` in package.json
- `"declaration": true` in tsconfig.json
- `.d.ts` files are in the `dist/` folder

## Post-Publishing

1. **Announce** - Share on Twitter, Reddit, etc.
2. **Monitor** - Watch for issues and questions
3. **Maintain** - Respond to issues and PRs
4. **Update** - Keep dependencies up to date

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [npm Package Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

---

Good luck with your open-source project! 🚀
