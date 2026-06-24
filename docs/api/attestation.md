---
id: attestation
title: Attestation API
description: Exported attestation verifiers, MetadataService, X.509 helpers, and the minimal DER/ASN.1 reader in webauthn-server-buildkit.
sidebar_position: 4
keywords:
  - StaticMetadataService
  - verifyAppleAttestation
  - verifyCertChain
  - attestation api
---

# Attestation API

**webauthn-server-buildkit exports its attestation building blocks so you can verify statements, supply FIDO MDS trust anchors, and work with X.509 chains directly.** Most applications only need `StaticMetadataService` and `APPLE_WEBAUTHN_ROOT_CA_PEM`; the rest are available for advanced use. See the [Attestation guide](../guides/attestation.md) for the conceptual overview.

## Trust-anchor provider

```typescript
import { StaticMetadataService, APPLE_WEBAUTHN_ROOT_CA_PEM } from 'webauthn-server-buildkit';

const metadataService = new StaticMetadataService({
  defaultRoots: [APPLE_WEBAUTHN_ROOT_CA_PEM],
});
```

| Export | Kind | Purpose |
| --- | --- | --- |
| `StaticMetadataService` | class | A `MetadataService` backed by a fixed set of roots (`StaticMetadataServiceOptions`). |
| `APPLE_WEBAUTHN_ROOT_CA_PEM` | constant | The bundled Apple WebAuthn Root CA (PEM). |
| `MetadataService` | type | Interface for supplying roots and `MetadataStatement`s (implement for full FIDO MDS). |
| `MetadataRootQuery`, `MetadataStatement`, `MetadataStatusReport` | types | MDS lookup/query shapes. |

## Per-format verifiers

Each verifier takes an `AttestationVerifierInput` and returns an `AttestationVerificationResult` (`{ fmt, attestationVerified, ... }`).

| Function | Format |
| --- | --- |
| `verifyAppleAttestation` | `apple` (anchors to the bundled root) |
| `verifyPackedAttestation` | `packed` (self + x5c) |
| `verifyFidoU2fAttestation` | `fido-u2f` |
| `verifyAndroidKeyAttestation` | `android-key` |
| `verifyTpmAttestation` | `tpm` |
| `verifyAndroidSafetyNetAttestation` | `android-safetynet` (deprecated by Google) |

Related types: `AttestationVerifierInput`, `AttestationVerificationResult`, `AttestationFormatVerifier`.

## X.509 helpers

Thin wrappers over Node's built-in `crypto.X509Certificate`:

```typescript
import { parseCertPem, verifyCertChain, publicKeyMatchesCOSE } from 'webauthn-server-buildkit';
```

| Function | Purpose |
| --- | --- |
| `parseCert`, `parseCertPem` | Parse DER/PEM into a certificate object. |
| `derToX509`, `pemToDer` | Convert between encodings. |
| `isValidAt` | Check validity at a timestamp. |
| `isIssuedBy` | Check issuer relationship. |
| `verifyCertChain` | Verify a leaf-first chain to a trusted root. |
| `publicKeyMatchesCOSE` | Confirm a cert's public key matches a COSE key. |

## Minimal DER / ASN.1 reader

For parsing attestation extensions without a heavyweight dependency:

```typescript
import { readSequence, decodeOID, findExtension, ASN1_TAG } from 'webauthn-server-buildkit';
```

Exports: `ASN1_TAG`, `readTLV`, `readChildren`, `readSequence`, `readSet`, `decodeOID`, `readOctetString`, `readInteger`, `readBitString`, `findExtension`, and the `Asn1Node` type.

## Honesty contract

`attestationVerified` from any verifier is `true` only when the statement is both cryptographically verified **and** trust-anchored (apple via the bundled root, chain formats via your `metadataService`). There is no CRL/OCSP revocation checking — attestation is offline by design.
