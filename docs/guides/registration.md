---
id: registration
title: Registration
description: Generate WebAuthn registration options and verify the attestation response with webauthn-server-buildkit, including excludeCredentials and duplicate prevention.
sidebar_position: 2
keywords:
  - webauthn registration
  - createRegistrationOptions
  - verifyRegistration
  - excludeCredentials
  - credProps
---

# Registration

**Registration is the WebAuthn ceremony that creates a new credential (passkey) and binds it to a user.** With webauthn-server-buildkit you call `createRegistrationOptions` to start it and `verifyRegistration` to finish it, then store the verified credential.

## Generating options

```typescript
const { options, challenge, webAuthnUserId } = await webauthn.createRegistrationOptions(user, {
  excludeCredentials: existing.map((c) => ({ id: c.id, type: 'public-key', transports: c.transports })),
  authenticatorSelection: { residentKey: 'required', userVerification: 'preferred' },
  attestation: 'none',
  timeout: 60000,
});
```

The second argument is optional. Useful fields:

- **`excludeCredentials`** — the user's already-registered credentials. Passing them lets the authenticator refuse to create a second credential on the same device.
- **`authenticatorSelection`** — express resident-key (`'required'` for passkeys), attachment, and user-verification preferences.
- **`attestation`** — `'none'` (default), `'indirect'`, `'direct'`, or `'enterprise'`.
- **`extensions`**, **`timeout`**, **`rpIcon`**, **`preferredAuthenticatorType`** — additional fine-tuning.

The return value gives you three things: `options` to send to the browser, the `challenge` to remember for this user, and `webAuthnUserId` — the generated user handle you **must persist** on the credential to enable usernameless login later.

## Verifying the response

```typescript
const { verified, registrationInfo } = await webauthn.verifyRegistration(
  responseFromBrowser,
  challenge,
  expectedOrigin, // optional override; defaults to config.origin
  { existingCredentialIds: existing.map((c) => c.id) }, // optional duplicate guard
);
```

Verification checks, in order: the client-data type and challenge, the origin (and cross-origin policy), the RP-ID hash, the user-presence/verification flags, the attestation statement, and the COSE public key. If `existingCredentialIds` is supplied and the new credential's ID is already in it, verification throws `CREDENTIAL_ALREADY_REGISTERED`.

## What `registrationInfo` contains

On success, `registrationInfo` (a `VerifiedRegistrationInfo`) includes everything you need to persist:

| Field | Use |
| --- | --- |
| `credential.id` | Base64URL credential ID (primary key). |
| `credential.publicKey` | COSE public key bytes — store as-is. |
| `credential.counter` | Initial signature counter. |
| `credential.alg` | COSE algorithm — store on `WebAuthnCredential.alg` to pin it at authentication. |
| `credentialDeviceType` | `'singleDevice'` or `'multiDevice'` (a passkey synced across devices). |
| `credentialBackedUp` | Whether the credential is backed up / synced. |
| `userVerified` | Whether UV happened — store it to detect later downgrades. |
| `fmt` | Attestation format (`'none'`, `'packed'`, `'apple'`, …). |
| `attestationVerified` | `true` only when the attestation was trust-anchored. |
| `trustPath` | Verified certificate chain (PEM), for trust-anchored chain formats. |
| `clientExtensionResults` | Parsed client extensions, e.g. `credProps.rk`. |

## Persisting the credential

```typescript
await storage.credentials.create({
  id: registrationInfo.credential.id,
  publicKey: registrationInfo.credential.publicKey,
  counter: registrationInfo.credential.counter,
  transports: registrationInfo.credential.transports,
  alg: registrationInfo.credential.alg,
  deviceType: registrationInfo.credentialDeviceType,
  backedUp: registrationInfo.credentialBackedUp,
  userVerified: registrationInfo.userVerified,
  userId: user.id,
  webAuthnUserID: webAuthnUserId,
});
```

Storing `alg` and `userVerified` is what enables the library's authentication-time algorithm pinning and downgrade advisories.

## Challenge lifecycle

When a storage adapter is configured, `createRegistrationOptions` writes the challenge to storage scoped to `operation: 'registration'`, and `verifyRegistration` consumes it once — regardless of success or failure — so it can never be replayed. This is on by default; see [enforceChallengeStore](./configuration.md).

## Frequently asked questions

### How do I create passkeys (discoverable credentials)?

Set `authenticatorSelection.residentKey: 'required'` (or `'preferred'`) in the options, and persist the returned `webAuthnUserId`. The `clientExtensionResults.credProps.rk` flag in `registrationInfo` confirms whether a discoverable credential was actually created.

### How do I stop a user registering the same authenticator twice?

Pass their existing credentials in `excludeCredentials` (the authenticator refuses) **and** pass `existingCredentialIds` to `verifyRegistration` (the server enforces, throwing `CREDENTIAL_ALREADY_REGISTERED`). Use both for defense in depth.

### Do I have to verify attestation?

No. The default `attestationType: 'none'` is correct for the vast majority of consumer apps — you still get a cryptographically sound credential. Only require attestation when you need to assert the authenticator's make/model. See the [attestation guide](./attestation.md).
