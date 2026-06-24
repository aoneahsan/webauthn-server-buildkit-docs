---
id: configuration
title: Configuration
description: Every WebAuthnServerConfig option for webauthn-server-buildkit, with defaults, validation rules, and security implications.
sidebar_position: 1
keywords:
  - webauthn config
  - WebAuthnServerConfig
  - relying party id
  - encryptionSecret
---

# Configuration

**A `WebAuthnServer` is configured once with a `WebAuthnServerConfig` object that declares your relying party identity, an encryption secret, and a set of secure-by-default behavior switches.** Four fields are required; everything else has a sensible default.

```typescript
const webauthn = new WebAuthnServer({
  rpName: 'My App',
  rpID: 'example.com',
  origin: 'https://example.com',
  encryptionSecret: process.env.WEBAUTHN_SECRET!,
  storageAdapter: new MemoryStorageAdapter(),
});
```

## Required options

| Option | Type | Notes |
| --- | --- | --- |
| `rpName` | `string` | Human-readable relying party name shown by some authenticators. |
| `rpID` | `string` | Your registrable domain, e.g. `example.com`. The credential is scoped to it. |
| `origin` | `string \| string[]` | The exact expected origin(s), e.g. `https://example.com`. An array supports multiple front ends. |
| `encryptionSecret` | `string` | Secret used to derive session-token encryption keys. **Must be at least 32 characters.** |

The constructor validates these immediately. A missing required field, an `encryptionSecret` shorter than 32 characters, a `challengeSize` outside 16–64, or a `timeout` under 10000 ms each throw a `ConfigurationError`.

## Security & behavior options (secure by default)

| Option | Default | What it does |
| --- | --- | --- |
| `enforceChallengeStore` | `true` (when a storage adapter is set) | Requires the verification challenge to exist in storage, be unexpired, and match the operation; consumes it once so it can never be replayed. |
| `allowCrossOriginIframe` | `false` | When `false`, ceremonies performed in a cross-origin iframe (`clientData.crossOrigin === true`) are rejected. |
| `requireTrustedAttestation` | `false` | When `true` and attestation was requested, registration is rejected unless the attestation is trust-anchored. |
| `userVerification` | `'preferred'` | `'required'`, `'preferred'`, or `'discouraged'`. `'required'` enforces the UV flag on verify. |
| `supportedAlgorithms` | `[ES256, RS256]` | Allowlist of COSE algorithms accepted at both registration and authentication. |
| `attestationType` | `'none'` | Attestation conveyance preference advertised to the authenticator. |
| `enableMobileAttestation` | `false` | Opt-in non-standard JSON attestation path for some native clients. Leave off unless you fully control client + transport. |

## Tuning options

| Option | Default | What it does |
| --- | --- | --- |
| `challengeSize` | `32` | Challenge length in bytes (16–64). |
| `timeout` | `60000` | Ceremony timeout in milliseconds (minimum 10000). Also drives stored-challenge expiry. |
| `sessionDuration` | `86400000` (24h) | Session-token lifetime in milliseconds. |
| `authenticatorSelection` | `{ residentKey: 'preferred', userVerification: <userVerification> }` | Passed to the authenticator to express resident-key / attachment preferences. |
| `preferredAuthenticatorType` | — | `'securityKey'`, `'localDevice'`, or `'remoteDevice'` hint for registration. |
| `rpIcon` | — | Deprecated in WebAuthn Level 3; included for completeness. |

## Integration options

| Option | Type | What it does |
| --- | --- | --- |
| `storageAdapter` | `StorageAdapter` | Persists users, credentials, challenges, and sessions. Optional, but required for challenge enforcement and session storage. |
| `metadataService` | `MetadataService` | Supplies FIDO MDS trust anchors for certificate-chain attestation. See the [attestation guide](./attestation.md). |
| `originVerifier` | `(origin: string) => boolean` | Custom origin matcher that replaces the default exact-string compare (useful for native `android:apk-key-hash:` origins). |
| `logger` | `(level, message, data?) => void` | Your logging function. Combined with `debug: true`, the server logs lifecycle events through it. |
| `debug` | `false` | Enables debug logging through `logger`. |

## Choosing a `userVerification` policy

- `'required'` — the authenticator must verify the user (biometric / PIN). The library enforces the UV flag and fails otherwise. Strongest, but excludes UV-incapable security keys.
- `'preferred'` (default) — UV is requested but not enforced. Authentication still surfaces a `userVerificationDowngraded` advisory if a credential registered with UV later asserts without it.
- `'discouraged'` — UV is not requested; fastest UX, weakest assurance.

## Frequently asked questions

### Where should `encryptionSecret` come from?

From a secret manager or environment variable — never hard-coded. It must be at least 32 characters. Rotating it invalidates existing session tokens (re-authentication required), which is the safe behavior.

### Do I need a storage adapter?

For a real application, yes. Without one, challenge enforcement and session persistence are no-ops, and you must manage challenge lifecycle yourself. The `MemoryStorageAdapter` is fine for development and tests.

### Can I support multiple front-end origins?

Yes — set `origin` to an array, or pass an `expectedOrigin` override to `verifyRegistration` / `verifyAuthentication`. For dynamic matching, supply an `originVerifier`.
