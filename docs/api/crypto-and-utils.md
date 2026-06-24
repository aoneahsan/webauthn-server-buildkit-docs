---
id: crypto-and-utils
title: Crypto & Utilities
description: Exported crypto helpers (CBOR, COSE, challenge, signature) and base64url / buffer / hash utilities in webauthn-server-buildkit.
sidebar_position: 5
keywords:
  - webauthn cbor
  - cose public key
  - base64url
  - sha256 webauthn
---

# Crypto & Utilities

**webauthn-server-buildkit exposes its low-level crypto and encoding helpers so you can build custom flows or debug ceremony data.** These are the same primitives the high-level `WebAuthnServer` uses internally — all built on Node's standard `crypto`.

## Crypto functions

```typescript
import {
  generateChallenge,
  parseAuthenticatorData,
  parseCOSEPublicKey,
  verifySignature,
} from 'webauthn-server-buildkit';
```

| Function | Purpose |
| --- | --- |
| `generateChallenge` | Generate a cryptographically random challenge. |
| `generateRandomId` | Generate a random identifier. |
| `decodeCBOR`, `decodeCBORFirst`, `encodeCBOR` | CBOR decode/encode (via `cbor-x`). |
| `getCOSEAlgorithmIdentifier` | Map a key/alg to a `COSEAlgorithmIdentifier`. |
| `parseAuthenticatorData` | Parse raw authenticator data into `ParsedAuthenticatorData`. |
| `parseCOSEPublicKey` | Parse COSE key bytes into a typed key. |
| `validateAuthenticatorDataFlags` | Validate UP/UV/AT/ED flags. |
| `verifySignature` | Verify a signature against a COSE public key. |

COSE key types (type-only): `COSEEC2Key`, `COSEKeyCommon`, `COSEOKPKey`, `COSEPublicKey`, `COSERSAKey`.

## Utility functions

```typescript
import { bufferToBase64URL, base64URLToBuffer, sha256 } from 'webauthn-server-buildkit';
```

### Base64URL

`bufferToBase64URL`, `base64URLToBuffer`, `stringToBase64URL`, `base64URLToString`, `isBase64URL`.

### Buffers

`bufferToHex`, `hexToBuffer`, `bufferToNumber`, `numberToBuffer`, `buffersEqual`, `timingSafeEqualBytes`, `concatBuffers`.

`timingSafeEqualBytes` is a constant-time comparison — use it whenever you compare secret-dependent byte strings to avoid timing side channels.

### Hashing

`sha256`, `sha384`, `sha512`, and `verifyHash`.

## COSE enums (runtime values)

```typescript
import { COSEAlgorithmIdentifier, COSEEllipticCurve, COSEKeyType } from 'webauthn-server-buildkit';
```

These are real enums (runtime values), so you can reference members like `COSEAlgorithmIdentifier.ES256` in your `supportedAlgorithms` configuration.

## Version constant

```typescript
import { VERSION } from 'webauthn-server-buildkit';
// e.g. '2.3.0' (injected at build time)
```
