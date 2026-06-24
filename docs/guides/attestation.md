---
id: attestation
title: Attestation
description: How webauthn-server-buildkit verifies WebAuthn attestation formats (apple, packed, fido-u2f, android-key, tpm, android-safetynet) and trust-anchors them with FIDO MDS.
sidebar_position: 6
keywords:
  - webauthn attestation
  - fido mds
  - metadataService
  - apple attestation
  - android key attestation
  - tpm attestation
---

# Attestation

**Attestation is the part of WebAuthn registration where the authenticator proves its make and model with a cryptographic statement.** webauthn-server-buildkit verifies every supported attestation format and tells you honestly whether the statement was also **trust-anchored** to a root you trust.

Most consumer applications do not need attestation at all — the default `attestationType: 'none'` still produces a cryptographically sound credential. Use attestation when you must assert which authenticator created the credential (regulated environments, enterprise device allow-lists).

## Supported formats

| Format | Cryptographically verified | Trust-anchored via |
| --- | --- | --- |
| `none` | n/a (no statement) | — |
| `packed` (self) | Yes | n/a — no chain to anchor (`attestationVerified: false`) |
| `packed` (x5c) | Yes | `metadataService` roots |
| `fido-u2f` | Yes | `metadataService` roots |
| `android-key` | Yes | `metadataService` roots |
| `tpm` | Yes | `metadataService` roots |
| `android-safetynet` | Yes | `metadataService` roots (deprecated — see below) |
| `apple` | Yes | **bundled** Apple WebAuthn Root CA |

## The honesty rule

`registrationInfo.attestationVerified` is `true` **only** when the statement was both cryptographically verified **and** trust-anchored to a root. It is `false` for `none`, for `packed` self-attestation (there is no chain), and for certificate-chain formats when no matching trust anchor is available. The library never reports an optimistic `true` — so you can branch on it safely.

When a chain format is trust-anchored, `registrationInfo.trustPath` carries the verified certificate chain (leaf-first, PEM).

## Supplying FIDO MDS trust anchors

Apple's root is bundled, so `apple` trust-anchors out of the box. Every other certificate-chain format needs roots that you supply through a `MetadataService`. The library never downloads the (large, frequently updated) FIDO Metadata Service blob — you bring it.

For a fixed set of roots, use the built-in `StaticMetadataService`:

```typescript
import {
  WebAuthnServer,
  StaticMetadataService,
  APPLE_WEBAUTHN_ROOT_CA_PEM,
} from 'webauthn-server-buildkit';

const metadataService = new StaticMetadataService({
  defaultRoots: [APPLE_WEBAUTHN_ROOT_CA_PEM /* , ...your authenticator roots */],
});

const webauthn = new WebAuthnServer({
  rpName: 'My App',
  rpID: 'example.com',
  origin: 'https://example.com',
  encryptionSecret: process.env.WEBAUTHN_SECRET!,
  attestationType: 'direct',
  metadataService,
  requireTrustedAttestation: true, // reject non-trust-anchored attestations
});
```

You can also implement the `MetadataService` interface yourself to look up roots and `MetadataStatement`s dynamically from a full FIDO MDS blob.

## Requiring trusted attestation

By default a non-trust-anchored attestation is allowed but logged. Set `requireTrustedAttestation: true` to **reject** registration (`ATTESTATION_NOT_TRUSTED`) whenever attestation was requested but the statement could not be trust-anchored. With this enabled, every chain format other than `apple` requires a `metadataService` that supplies the authenticator's roots — otherwise those registrations fail by design.

## Honest limitations

- **No revocation checking.** Attestation is offline by design — there is no CRL or OCSP lookup. If you need revocation, check out-of-band.
- **`android-safetynet` is deprecated** by Google in favor of Play Integrity. The library verifies it for completeness, but new Android integrations should prefer Play Integrity.
- **TPM AIK SAN and android-key Keymaster authorization lists are not additionally asserted.** The security-critical bindings (nonce, public key, certificate chain) are verified; these extra fields are not separately enforced.

## Frequently asked questions

### Do I need attestation for passkeys?

No. Passkeys for consumer sign-in work perfectly with `attestationType: 'none'`. Attestation adds friction and privacy considerations; only require it when you genuinely need device provenance.

### Why is `attestationVerified` false even though registration succeeded?

Because the statement was not trust-anchored — either it was `none`/self-attestation, or no matching root was available in your `metadataService`. Registration still succeeds (the credential is valid); the flag just reports that you have no attestation *trust*. Supply the roots, or set `requireTrustedAttestation` if you want a hard failure instead.

### Where do I get authenticator root certificates?

From the FIDO Alliance Metadata Service (MDS) and from vendor documentation. Load the roots you trust into `StaticMetadataService`, or implement `MetadataService` over the full MDS blob.
