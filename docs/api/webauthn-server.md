---
id: webauthn-server
title: WebAuthnServer
description: API reference for the WebAuthnServer class in webauthn-server-buildkit — every method, parameter, and return type.
sidebar_position: 1
keywords:
  - WebAuthnServer api
  - createRegistrationOptions
  - verifyRegistration
  - createAuthenticationOptions
  - verifyAuthentication
---

# `WebAuthnServer`

**`WebAuthnServer` is the single entry point of webauthn-server-buildkit.** You construct it once with a [`WebAuthnServerConfig`](./configuration.md) and call its async methods to run WebAuthn ceremonies and manage sessions.

```typescript
import { WebAuthnServer, MemoryStorageAdapter } from 'webauthn-server-buildkit';

const webauthn = new WebAuthnServer({
  rpName: 'My App',
  rpID: 'example.com',
  origin: 'https://example.com',
  encryptionSecret: process.env.WEBAUTHN_SECRET!,
  storageAdapter: new MemoryStorageAdapter(),
});
```

The constructor validates the config and throws `ConfigurationError` on missing required fields, a short `encryptionSecret`, or out-of-range `challengeSize` / `timeout`.

## Registration

### `createRegistrationOptions(user, params?)`

Generates `PublicKeyCredentialCreationOptions` and a challenge. When a storage adapter is configured, the challenge is persisted (scoped to `registration`).

- **`user`**: `UserModel` — `{ id, username, displayName? }`.
- **`params?`**: optional `excludeCredentials`, `authenticatorSelection`, `preferredAuthenticatorType`, `extensions`, `timeout`, `attestation`, `rpIcon`.
- **Returns**: `Promise<{ options, challenge, webAuthnUserId }>`. Persist `webAuthnUserId` on the credential for usernameless login.

### `verifyRegistration(response, expectedChallenge, expectedOrigin?, options?)`

Verifies the browser's attestation response and (when storage is configured) consumes the challenge once.

- **`response`**: `RegistrationCredentialJSON`.
- **`expectedChallenge`**: the challenge from `createRegistrationOptions`.
- **`expectedOrigin?`**: `string | string[]` override (defaults to config `origin`).
- **`options?.existingCredentialIds`**: when supplied and the new credential ID is already present, throws `CREDENTIAL_ALREADY_REGISTERED`.
- **Returns**: `Promise<{ verified, registrationInfo? }>`.

## Authentication

### `createAuthenticationOptions(params?)`

Generates `PublicKeyCredentialRequestOptions` and a challenge (persisted scoped to `authentication` when storage is configured).

- **`params?`**: optional `allowCredentials`, `userVerification`, `rpId`, `extensions`, `timeout`. Omit `allowCredentials` for usernameless flows.
- **Returns**: `Promise<{ options, challenge }>`.

### `verifyAuthentication(response, expectedChallenge, credential, expectedOrigin?)`

Verifies the assertion against the stored credential. On success, updates the stored counter and `lastUsedAt`.

- **`response`**: `AuthenticationCredentialJSON`.
- **`expectedChallenge`**: the challenge from `createAuthenticationOptions`.
- **`credential`**: the stored `WebAuthnCredential` (load it by ID first).
- **`expectedOrigin?`**: `string | string[]` override.
- **Returns**: `Promise<{ verified, authenticationInfo? }>`.

## Sessions

### `createSession(userId, credentialId, userVerified, additionalData?)`

Mints an encrypted session token (AES-256-GCM, HKDF-SHA256). Returns `Promise<string>`.

### `validateSession(token)`

Returns `Promise<{ valid, sessionData?, sessionId? }>`. Invalid/expired/tampered tokens return `{ valid: false }`.

### `refreshSession(token)`

Returns a fresh token (`Promise<string>`).

### `revokeSession(token)`

Revokes a single session (`Promise<void>`).

### `revokeUserSessions(userId)`

Revokes all sessions for a user (`Promise<void>`).

## Maintenance

### `cleanup()`

Purges expired challenges and sessions when a storage adapter is configured (`Promise<void>`). Call from a periodic job.

### `getStorageAdapter()`

Returns the configured `StorageAdapter | undefined`.

## Method summary

| Method | Returns |
| --- | --- |
| `createRegistrationOptions(user, params?)` | `{ options, challenge, webAuthnUserId }` |
| `verifyRegistration(response, challenge, origin?, options?)` | `{ verified, registrationInfo? }` |
| `createAuthenticationOptions(params?)` | `{ options, challenge }` |
| `verifyAuthentication(response, challenge, credential, origin?)` | `{ verified, authenticationInfo? }` |
| `createSession(userId, credentialId, userVerified, data?)` | `string` (token) |
| `validateSession(token)` | `{ valid, sessionData?, sessionId? }` |
| `refreshSession(token)` | `string` (token) |
| `revokeSession(token)` | `void` |
| `revokeUserSessions(userId)` | `void` |
| `cleanup()` | `void` |
| `getStorageAdapter()` | `StorageAdapter \| undefined` |
