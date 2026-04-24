# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-23

### Fixed
- TypeScript type error in `signingTime` attribute (Date to string mismatch).

### Updated
- `node-forge` dependency to v1.4.0.

## [1.0.0] - 2026-04-23

### Added
- Initial release of the Apple Wallet Pass Generator.
- Support for vCard, LinkedIn, Custom URL, and LeaveGen QR modes.
- Automatic contrast detection for foreground/background colors.
- PKCS#7 signing implementation.
