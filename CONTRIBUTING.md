# Contributing to Apple Wallet Pass Generator

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/0xJovin/applewalletpass.git
   cd applewalletpass
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Building the Project

```bash
pnpm run build
```

This compiles TypeScript files from `src/` to `dist/`.

### Testing Your Changes

Currently, the project doesn't have automated tests. When testing:

1. Set up your Apple Developer certificates
2. Create a test script in `examples/`
3. Run your test script to verify functionality

### Code Style

- Use TypeScript for all code
- Follow existing code style and conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and single-purpose

### Commit Messages

Use clear, descriptive commit messages:

- ✅ Good: `feat: add support for custom QR code colors`
- ✅ Good: `fix: resolve certificate parsing issue`
- ❌ Bad: `update code`
- ❌ Bad: `fix bug`

Format:
```
<type>: <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Update the README** if you're adding features
3. **Ensure your code builds** without errors
4. **Test your changes** thoroughly
5. **Create a pull request** with a clear description:
   - What problem does it solve?
   - How does it solve it?
   - Any breaking changes?
   - Screenshots (if applicable)

### PR Title Format

```
<type>: <description>
```

Example: `feat: add support for custom background images`

## What to Contribute

### Ideas for Contributions

- 🐛 **Bug fixes** - Fix issues or edge cases
- ✨ **New features** - Add new functionality
- 📚 **Documentation** - Improve README, add examples
- 🧪 **Tests** - Add unit or integration tests
- 🎨 **Examples** - Add more usage examples
- ⚡ **Performance** - Optimize code
- 🔒 **Security** - Improve security practices

### Areas That Need Help

- [ ] Unit tests for core functionality
- [ ] Integration tests
- [ ] More comprehensive error handling
- [ ] Support for other pass types (event tickets, coupons, etc.)
- [ ] CLI tool for generating passes
- [ ] Better image processing (resizing, optimization)
- [ ] Pass validation before signing
- [ ] Support for pass updates
- [ ] Localization support

## Code Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, a maintainer will merge your PR

## Reporting Bugs

When reporting bugs, please include:

1. **Description** - Clear description of the issue
2. **Steps to reproduce** - How to reproduce the bug
3. **Expected behavior** - What should happen
4. **Actual behavior** - What actually happens
5. **Environment** - Node version, OS, etc.
6. **Code sample** - Minimal code to reproduce (if applicable)

Use the GitHub issue tracker to report bugs.

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists or is planned
2. Clearly describe the feature and its use case
3. Explain why it would be valuable
4. Provide examples of how it would be used

## Security Issues

**Do not** report security vulnerabilities publicly. Instead:

1. Email security@example.com (replace with actual email)
2. Include a description of the vulnerability
3. Include steps to reproduce
4. Allow time for the issue to be fixed before public disclosure

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to:
- Open an issue for questions: https://github.com/0xJovin/applewalletpass/issues
- Reach out to maintainers

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Being respectful and inclusive
- Accepting constructive criticism gracefully
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Harassment, trolling, or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement

Violations may result in temporary or permanent ban from the project.

---

Thank you for contributing! 🎉
