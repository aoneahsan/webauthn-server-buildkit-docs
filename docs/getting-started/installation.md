---
id: installation
title: Installation
description: Install webauthn-server-buildkit from npm, meet the Node.js requirement, and import it in ESM or CommonJS.
sidebar_position: 1
keywords:
  - install webauthn server
  - webauthn-server-buildkit install
  - node webauthn setup
---

# Installation

**Install webauthn-server-buildkit from npm with a single command.** It is a pure Node.js library with one runtime dependency (`cbor-x`) and no native build step.

```bash
# yarn (recommended)
yarn add webauthn-server-buildkit

# npm
npm install webauthn-server-buildkit

# pnpm
pnpm add webauthn-server-buildkit
```

## Requirements

| Requirement | Detail |
| --- | --- |
| Node.js | **>= 24.13.0** (`engines.node`). The library relies on modern Node `crypto` (JWK key import, Ed25519, AES-256-GCM, HKDF). |
| TypeScript | Optional but recommended. Types ship in the package; no `@types/*` needed. |
| Secure context | WebAuthn requires HTTPS in production (or `http://localhost` during development). This is a browser/transport requirement, not something the library can relax. |

## Importing

The package ships both ESM and CommonJS builds plus full type declarations, so either module system works.

```typescript
// ESM / TypeScript
import { WebAuthnServer, MemoryStorageAdapter } from 'webauthn-server-buildkit';
```

```javascript
// CommonJS
const { WebAuthnServer, MemoryStorageAdapter } = require('webauthn-server-buildkit');
```

## Verifying the install

A minimal sanity check — constructing a server with the in-memory adapter — confirms the package resolves and your config is valid:

```typescript
import { WebAuthnServer, MemoryStorageAdapter } from 'webauthn-server-buildkit';

const webauthn = new WebAuthnServer({
  rpName: 'My App',
  rpID: 'localhost',
  origin: 'http://localhost:3000',
  encryptionSecret: 'dev-secret-at-least-32-characters-long',
  storageAdapter: new MemoryStorageAdapter(),
});

console.log('WebAuthn server ready');
```

If `encryptionSecret` is shorter than 32 characters, or `rpName` / `rpID` / `origin` are missing, the constructor throws a `ConfigurationError` immediately — fail-fast by design.

## Next steps

- [Quick Start](./quick-start.md) — a complete registration + authentication round trip.
- [Configuration](../guides/configuration.md) — all configuration options and their defaults.
