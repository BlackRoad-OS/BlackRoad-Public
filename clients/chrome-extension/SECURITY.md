# Security Policy - BlackRoad Chrome Extension

## No Credentials or Privileged APIs

This Chrome extension is **client-side only** and does not:
- Store credentials
- Access internal BlackRoad APIs
- Transmit data to external servers
- Require authentication

## What It Does

The extension provides:
- Quick links to public GitHub organizations
- Quick links to Cloudflare dashboards
- Quick links to BlackRoad public services
- Search functionality (local only)

All functionality operates entirely in the browser with no backend communication.

## Future Changes

If this extension is enhanced to include:
- Authentication mechanisms
- API key storage
- Backend communication
- Privileged operations

...it will be immediately moved to the private repository and this policy updated.

## Reporting Issues

If you discover a security concern, please report it to:
- Email: security@blackroad.io
- GitHub Issues: [BlackRoad-Public](https://github.com/BlackRoad-OS/BlackRoad-Public/issues)

---

**Last Updated**: 2026-02-13  
**Status**: Public, no credentials
