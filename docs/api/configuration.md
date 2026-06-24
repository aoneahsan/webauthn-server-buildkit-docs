---
id: configuration
title: WebAuthnServerConfig
description: API reference for the WebAuthnServerConfig type in webauthn-server-buildkit — every field, type, and default.
sidebar_position: 2
keywords:
  - WebAuthnServerConfig
  - webauthn config reference
  - webauthn options type
---

# `WebAuthnServerConfig`

**`WebAuthnServerConfig` is the object you pass to the `WebAuthnServer` constructor.** This page is the field-by-field type reference; the [Configuration guide](../guides/configuration.md) explains the choices in prose.

## Required fields

| Field | Type | Description |
| --- | --- | --- |
| `rpName` | `string` | Human-readable relying party name. |
| `rpID` | `string` | Relying party ID (registrable domain). |
| `origin` | `string \| string[]` | Expected origin(s). |
| `encryptionSecret` | `string` | Session-key secret; **>= 32 characters**. |

## Optional fields

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `storageAdapter` | `StorageAdapter` | — | Persistence for users/credentials/challenges/sessions. |
| `sessionDuration` | `number` | `86400000` | Session lifetime (ms). |
| `attestationType` | `AttestationConveyancePreference` | `'none'` | Attestation preference. |
| `enableMobileAttestation` | `boolean` | `false` | Opt-in non-standard JSON attestation path. |
| `enforceChallengeStore` | `boolean` | `true` | Enforce + consume the stored challenge once. |
| `allowCrossOriginIframe` | `boolean` | `false` | Allow cross-origin iframe ceremonies. |
| `originVerifier` | `(origin: string) => boolean` | — | Custom origin matcher. |
| `userVerification` | `UserVerificationRequirement` | `'preferred'` | UV policy. |
| `authenticatorSelection` | `AuthenticatorSelectionCriteria` | `{ residentKey: 'preferred', userVerification: <userVerification> }` | Authenticator preferences. |
| `supportedAlgorithms` | `COSEAlgorithmIdentifier[]` | `[ES256, RS256]` | Allowed COSE algorithms. |
| `challengeSize` | `number` | `32` | Challenge size in bytes (16–64). |
| `timeout` | `number` | `60000` | Ceremony timeout (ms, min 10000). |
| `preferredAuthenticatorType` | `PreferredAuthenticatorType` | — | `'securityKey' \| 'localDevice' \| 'remoteDevice'`. |
| `metadataService` | `MetadataService` | — | FIDO MDS trust-anchor provider. |
| `requireTrustedAttestation` | `boolean` | `false` | Reject non-trust-anchored attestation. |
| `rpIcon` | `string` | — | Deprecated (WebAuthn L3). |
| `debug` | `boolean` | `false` | Enable debug logging via `logger`. |
| `logger` | `(level, message, data?) => void` | — | Custom logging function. |

## Validation

The constructor throws `ConfigurationError` when:

- `rpName`, `rpID`, `origin`, or `encryptionSecret` is missing;
- `encryptionSecret.length < 32`;
- `challengeSize` is set and outside `16`–`64`;
- `timeout` is set and below `10000`.

## Related types

- `PreferredAuthenticatorType` = `'securityKey' | 'localDevice' | 'remoteDevice'`
- `UserVerificationRequirement` = `'required' | 'preferred' | 'discouraged'`
- `AttestationConveyancePreference` = `'none' | 'indirect' | 'direct' | 'enterprise'`

See the [Types & Errors reference](./types-and-errors.md) for the complete exported type list.
