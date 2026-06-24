---
id: security-model
title: Security Model
description: The secure-by-default protections in webauthn-server-buildkit — single-use challenges, algorithm pinning, cross-origin rejection, counter checks, and constant-time comparisons.
sidebar_position: 7
keywords:
  - webauthn security
  - secure by default
  - replay protection
  - algorithm pinning
  - constant-time comparison
---

# Security Model

**webauthn-server-buildkit is secure by default: the protections that matter are on without any configuration, and the few that could break an existing integration are documented switches you opt out of deliberately.** This page summarizes what the library protects against so you can reason about your threat model.

## Protections that are on by default

| Protection | What it stops | Related error code |
| --- | --- | --- |
| **Single-use challenges** | Replaying a captured ceremony — the stored challenge is consumed once and scoped to its operation. | `CHALLENGE_NOT_FOUND`, `CHALLENGE_EXPIRED`, `CHALLENGE_OPERATION_MISMATCH` |
| **Algorithm pinning** | Substituting a different/weaker COSE algorithm at authentication. | `ALGORITHM_MISMATCH` |
| **COSE key validation** | Malformed keys and `alg`↔`crv` mismatches used for digest/padding substitution. | `COSE_ALG_MISMATCH`, `COSE_EC2_INVALID`, … |
| **Cross-origin rejection** | Ceremonies smuggled through a cross-origin iframe. | `CROSS_ORIGIN_NOT_ALLOWED` |
| **Origin & RP-ID checks** | Credentials being used from the wrong origin or RP. | `ORIGIN_MISMATCH`, `RPID_MISMATCH` |
| **Signature counter regression** | Cloned authenticators (when the authenticator supports counters). | `COUNTER_ERROR` |
| **User-handle binding** | Logging in as the wrong user in usernameless flows. | `USER_HANDLE_MISMATCH` |
| **Constant-time comparisons** | Timing side channels on RP-ID-hash, attestation nonce, and buffer comparisons. | — |
| **Encrypted sessions** | Token forgery/tampering — AES-256-GCM with HKDF-SHA256, validated IV/tag/salt lengths. | `INVALID_TOKEN`, `SESSION_EXPIRED` |

## Algorithm support

Signature verification imports COSE keys as JWK through Node's built-in `crypto`, so the full set verifies correctly: **ES256 / ES384 / ES512** (including P-521), **RS256–RS512**, **PS256–PS512**, and **Ed25519**. The accepted set is gated by `supportedAlgorithms` (default `[ES256, RS256]`) at both registration and authentication.

## Switches you opt out of deliberately

These default to the secure value; change them only with a clear reason:

- `enforceChallengeStore` (default `true`) — turn off only if you manage challenge lifecycle yourself.
- `allowCrossOriginIframe` (default `false`) — turn on only if your product genuinely embeds the ceremony cross-origin.
- `requireTrustedAttestation` (default `false`) — turn **on** to harden attestation into a hard requirement.
- `enableMobileAttestation` (default `false`) — the opt-in JSON path below.

## The opt-in mobile JSON path

`enableMobileAttestation` enables a non-standard JSON registration path some native clients use. It is **off by default and intentionally so**: this path does **not** perform cryptographic WebAuthn attestation — it trusts a client-supplied `{ publicKey, credentialId }` payload without verifying a challenge signature. Enable it only when you fully control both the client and the transport, and enforce freshness/authenticity by other means. The standard WebAuthn (CBOR) path always runs when this is off, and the library actively rejects known fake/placeholder attestation values.

## Operational requirements you own

- **Secure context** — WebAuthn requires HTTPS (or `localhost`). The library cannot relax this.
- **`encryptionSecret`** — at least 32 characters, from a secret manager, rotated deliberately.
- **A real storage adapter** — needed for challenge enforcement and session revocation.
- **HTTP-layer hardening** — rate limiting, CSRF on your endpoints, and secure cookie flags are your responsibility; the library handles the WebAuthn cryptography, not your transport.

## Frequently asked questions

### Is the library safe against replay attacks?

Yes, when a storage adapter is configured and `enforceChallengeStore` is left on (the default). Each challenge is consumed exactly once and scoped to its operation, so a captured registration or authentication response cannot be replayed.

### What if my authenticator always reports counter 0?

That is common for synced platform passkeys. The library reports `counterSupported: false` so you know counter-based clone detection is a no-op for that credential, and surfaces `backupStateChanged` as an additional clone/migration signal to feed your risk engine.

### How are session tokens protected?

With authenticated encryption: AES-256-GCM and an HKDF-SHA256-derived key, plus per-token IV and validated IV/tag/salt lengths. A tampered or expired token fails validation rather than being silently trusted.
