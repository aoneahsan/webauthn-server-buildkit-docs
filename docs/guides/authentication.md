---
id: authentication
title: Authentication
description: Generate WebAuthn authentication options and verify the assertion with webauthn-server-buildkit, including counters, downgrade advisories, and discoverable credentials.
sidebar_position: 3
keywords:
  - webauthn authentication
  - createAuthenticationOptions
  - verifyAuthentication
  - signature counter
  - userHandle
---

# Authentication

**Authentication is the WebAuthn ceremony that proves a user controls a previously registered credential.** You call `createAuthenticationOptions` to issue a challenge and `verifyAuthentication` to verify the authenticator's signed assertion.

## Generating options

```typescript
const { options, challenge } = await webauthn.createAuthenticationOptions({
  allowCredentials: userCredentials.map((c) => ({ id: c.id, type: 'public-key', transports: c.transports })),
  userVerification: 'preferred',
});
```

All fields are optional:

- **`allowCredentials`** — restrict the assertion to specific credentials. Omit it for a usernameless / discoverable-credential ("passkey") flow where the user picks any credential for your RP ID.
- **`userVerification`**, **`rpId`**, **`extensions`**, **`timeout`** — override the configured defaults for this ceremony.

## Verifying the assertion

You must load the stored credential first (by its ID), because verification needs the stored public key, counter, and pinned algorithm.

```typescript
const credential = await storage.credentials.findById(assertion.id);
if (!credential) throw new Error('Unknown credential');

const { verified, authenticationInfo } = await webauthn.verifyAuthentication(
  assertion,
  challenge,
  credential,
  expectedOrigin, // optional override
);
```

Verification checks the client-data type and challenge, origin and RP-ID hash, user-presence/verification flags, the **signature** against the stored public key, the **algorithm** (pinned when `credential.alg` is set), the **signature counter**, and the **user handle** (for discoverable credentials, against `credential.webAuthnUserID`).

On success, if a storage adapter is configured, the library **automatically updates** the stored signature counter and `lastUsedAt`.

## What `authenticationInfo` contains

`authenticationInfo` (a `VerifiedAuthenticationInfo`) carries the verified result plus several advisory signals you decide policy on:

| Field | Meaning |
| --- | --- |
| `newCounter` | The authenticator's new signature counter (already persisted for you). |
| `userVerified` | Whether UV happened on this assertion. |
| `credentialID` | The asserted credential ID. |
| `userHandle` | The returned user handle (discoverable credentials). |
| `counterSupported` | `false` when both counters are 0 — clone detection is effectively a no-op (common for platform passkeys). |
| `userVerificationDowngraded` | Advisory: the credential registered with UV but this assertion presented UV=false. |
| `backupStateChanged` | Advisory: the backup-state flag differs from the stored value — a possible clone/migration signal. |
| `clientExtensionResults` | Parsed client extensions (`appid`, `prf`, `largeBlob`, …). |

## Signature counters and clone detection

WebAuthn authenticators may increment a signature counter on each use. The library rejects a counter that goes **backwards** (a clone signal) via `COUNTER_ERROR`. Many modern platform passkeys always report `0`; when both the stored and asserted counters are `0`, `counterSupported` is `false`, telling you that counter-based clone detection cannot help for that credential — rely on the backup-state advisory and your own risk signals instead.

## Frequently asked questions

### How do usernameless / passkey logins work?

Call `createAuthenticationOptions()` with no `allowCredentials`. The browser lets the user choose any discoverable credential for your RP ID and returns a `userHandle`. The library verifies that handle against the stored `credential.webAuthnUserID`, so you resolve the user from the credential the authenticator selected.

### What should I do with `userVerificationDowngraded`?

It is an advisory, not an automatic failure — the relying party sets policy. For a high-value action you might step up (require UV or re-auth); for a low-risk read you might allow it. If you want hard enforcement everywhere, set `userVerification: 'required'` in config so UV is enforced at the protocol level.

### Why did verification fail with `ALGORITHM_MISMATCH`?

The asserted key used a different COSE algorithm than the one stored on `credential.alg`. This is the algorithm-pinning protection: an attacker cannot substitute a weaker or different algorithm at authentication time. Make sure you persisted `registrationInfo.credential.alg` at registration.
