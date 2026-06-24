---
id: sessions
title: Sessions
description: Create, validate, refresh, and revoke encrypted session tokens with webauthn-server-buildkit using AES-256-GCM and HKDF-SHA256.
sidebar_position: 4
keywords:
  - webauthn sessions
  - encrypted session token
  - createSession
  - validateSession
  - AES-256-GCM
---

# Sessions

**webauthn-server-buildkit includes an encrypted session-token system so you do not have to wire up a separate session library after authentication.** Tokens are encrypted with AES-256-GCM using a key derived from your `encryptionSecret` via HKDF-SHA256, and the token format stays internal — you only ever handle opaque strings.

## Creating a session

After a successful `verifyAuthentication`, mint a token:

```typescript
const token = await webauthn.createSession(
  credential.userId, // string | number
  credential.id, // Base64URL credential ID
  authenticationInfo!.userVerified, // boolean
  { role: 'admin' }, // optional additional data
);
```

Return `token` to the client however you prefer — an `HttpOnly` cookie or an `Authorization: Bearer` header. The token's lifetime is `sessionDuration` (default 24 hours).

## Validating a session

On each protected request, validate the incoming token:

```typescript
const { valid, sessionData, sessionId } = await webauthn.validateSession(token);

if (valid && sessionData) {
  // sessionData.userId, sessionData.credentialId, sessionData.userVerified
  // plus any additionalData you attached (e.g. sessionData.role)
}
```

An expired, tampered, or unknown token returns `{ valid: false }` rather than throwing for the common case, so you can branch cleanly.

## Refreshing and revoking

```typescript
// Issue a fresh token (e.g. sliding expiration)
const newToken = await webauthn.refreshSession(token);

// Revoke a single session (logout)
await webauthn.revokeSession(token);

// Revoke every session for a user (password reset, account compromise)
await webauthn.revokeUserSessions(userId);
```

## Cleaning up expired data

Run periodic cleanup (for example from a cron job) to purge expired challenges and sessions from your storage:

```typescript
await webauthn.cleanup();
```

## How the token is protected

| Property | Detail |
| --- | --- |
| Cipher | AES-256-GCM (authenticated encryption — detects tampering). |
| Key derivation | HKDF-SHA256 from `encryptionSecret`. |
| Per-token randomness | 12-byte GCM IV; iv/tag/salt lengths are validated on decrypt. |
| Storage | When a storage adapter is configured, sessions are also tracked server-side so they can be revoked. |

## Frequently asked questions

### Do I have to use the built-in sessions?

No. Sessions are optional. If you already have a session/JWT system, skip `createSession` and manage your own — the WebAuthn ceremony methods work independently.

### What happens if I rotate `encryptionSecret`?

Existing tokens can no longer be decrypted, so all users must re-authenticate. That is the safe outcome of a secret rotation and is sometimes done deliberately to force re-login.

### Can I store extra data in the session?

Yes — pass an `additionalData` object to `createSession`. It is encrypted into the token and returned in `sessionData` on validation. Keep it small; it lives in the token.
