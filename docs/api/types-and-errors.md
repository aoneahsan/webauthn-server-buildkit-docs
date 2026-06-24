---
id: types-and-errors
title: Types & Errors
description: Exported TypeScript types, models, error classes, and the full WebAuthnErrorCode list in webauthn-server-buildkit.
sidebar_position: 6
keywords:
  - WebAuthnErrorCode
  - VerifiedRegistrationInfo
  - WebAuthnCredential
  - webauthn typescript types
---

# Types & Errors

**Every public type in webauthn-server-buildkit is exported, so your code stays fully typed end to end.** This page lists the model types, the verified-result types, the error classes, and the complete error-code union.

## Core models

| Type | Shape |
| --- | --- |
| `UserModel` | `{ id: string \| number; username: string; displayName?: string }` |
| `WebAuthnCredential` | `{ id, publicKey: Uint8Array, counter, transports?, deviceType, backedUp, alg?, userVerified?, userId, webAuthnUserID, createdAt, lastUsedAt?, aaguid?, userAgent? }` |
| `SessionData` | `{ userId, credentialId, expiresAt, userVerified, [key]: unknown }` |
| `ChallengeData` | `{ challenge, userId?, operation: 'registration' \| 'authentication', createdAt, expiresAt }` |

## Verified-result types

### `VerifiedRegistrationInfo`

Returned in `verifyRegistration`'s `registrationInfo`. Key fields: `credential` (`{ id, publicKey, counter, transports?, alg? }`), `credentialDeviceType`, `credentialBackedUp`, `origin`, `rpID?`, `aaguid?`, `userVerified`, `fmt?`, `attestationVerified?`, `trustPath?`, `clientExtensionResults?`.

### `VerifiedAuthenticationInfo`

Returned in `verifyAuthentication`'s `authenticationInfo`. Key fields: `newCounter`, `origin`, `rpID?`, `userVerified`, `credentialID`, `userHandle?`, `backupStateChanged?`, `userVerificationDowngraded?`, `counterSupported?`, `clientExtensionResults?`.

## Options & response types

Exported for typing your request/response payloads: `PublicKeyCredentialCreationOptionsJSON`, `PublicKeyCredentialRequestOptionsJSON`, `RegistrationCredentialJSON`, `AuthenticationCredentialJSON`, `AuthenticatorAttestationResponseJSON`, `AuthenticatorAssertionResponseJSON`, `AuthenticationExtensionsClientOutputs`, plus the descriptor/entity/criteria types.

## Base types

`Base64URLString`, `AttestationConveyancePreference`, `UserVerificationRequirement`, `AuthenticatorAttachment`, `ResidentKeyRequirement`, `AuthenticatorTransportFuture`, `CredentialDeviceType`, `AttestationFormat`, `PublicKeyCredentialType`, `ClientDataType`, `AuthenticatorDataFlags`, `ParsedAuthenticatorData`, `ParsedClientDataJSON`.

## Error classes

All extend `WebAuthnError`, which carries `code: WebAuthnErrorCode | (string & {})` and `statusCode: number`.

| Class | `statusCode` |
| --- | --- |
| `WebAuthnError` | 400 |
| `RegistrationError` | 400 |
| `AuthenticationError` | 401 |
| `VerificationError` | 400 |
| `ConfigurationError` | 500 |
| `StorageError` | 500 |
| `SessionError` | 401 |

See [Error handling](../guides/error-handling.md) for usage patterns.

## `WebAuthnErrorCode` (full list)

The `code` field is an **open union** — known codes autocomplete, custom codes still compile.

**Challenge:** `CHALLENGE_NOT_FOUND`, `CHALLENGE_OPERATION_MISMATCH`, `CHALLENGE_EXPIRED`, `CHALLENGE_MISMATCH`

**Algorithm / COSE:** `ALGORITHM_MISMATCH`, `UNSUPPORTED_CREDENTIAL_ALGORITHM`, `UNSUPPORTED_ALGORITHM`, `UNSUPPORTED_OKP_ALGORITHM`, `UNSUPPORTED_CURVE`, `UNSUPPORTED_KEY_TYPE`, `COSE_ALG_MISMATCH`, `COSE_EC2_INVALID`, `COSE_RSA_INVALID`, `COSE_OKP_INVALID`, `COSE_DECODE_ERROR`, `COSE_INVALID_FORMAT`, `COSE_MISSING_KTY`, `COSE_UNSUPPORTED_KEY_TYPE`, `COSE_UNKNOWN_ALGORITHM`

**CBOR:** `CBOR_DECODE_ERROR`, `CBOR_DECODE_FIRST_ERROR`, `CBOR_ENCODE_ERROR`

**Client data / origin:** `INVALID_CLIENT_DATA_TYPE`, `ORIGIN_MISMATCH`, `RPID_MISMATCH`, `CROSS_ORIGIN_NOT_ALLOWED`

**Authenticator data:** `AUTHENTICATOR_DATA_TOO_SHORT`, `AUTHENTICATOR_DATA_TRAILING_BYTES`, `AUTHENTICATOR_DATA_INVALID_CREDENTIAL_ID`, `AUTHENTICATOR_DATA_INVALID_CREDENTIAL_DATA`, `USER_PRESENCE_REQUIRED`, `USER_VERIFICATION_REQUIRED`, `MISSING_CREDENTIAL_DATA`

**Registration:** `REGISTRATION_ERROR`, `REGISTRATION_VERIFICATION_FAILED`, `CREDENTIAL_ALREADY_REGISTERED`, `ATTESTATION_PARSE_ERROR`, `ATTESTATION_SIGNATURE_INVALID`

**Attestation trust:** `ATTESTATION_INVALID`, `ATTESTATION_NONCE_MISMATCH`, `ATTESTATION_KEY_MISMATCH`, `ATTESTATION_CHALLENGE_MISMATCH`, `ATTESTATION_CHAIN_INVALID`, `ATTESTATION_CERT_INVALID`, `ATTESTATION_NOT_TRUSTED`, `ATTESTATION_UNSUPPORTED_FORMAT`

**Mobile attestation (opt-in):** `INVALID_MOBILE_ATTESTATION`, `INVALID_PLACEHOLDER_ATTESTATION`, `MOBILE_CREDENTIAL_INVALID_ATTESTATION`, `MOBILE_ATTESTATION_MISSING_CREDENTIAL_ID`, `MOBILE_ATTESTATION_INVALID_PUBLIC_KEY`, `MOBILE_ATTESTATION_INVALID_PUBLIC_KEY_FORMAT`

**Authentication:** `AUTHENTICATION_ERROR`, `AUTHENTICATION_VERIFICATION_FAILED`, `CREDENTIAL_ID_MISMATCH`, `USER_HANDLE_MISMATCH`, `COUNTER_ERROR`, `SIGNATURE_VERIFICATION_FAILED`

**Verification / config / storage / session:** `VERIFICATION_ERROR`, `CONFIGURATION_ERROR`, `STORAGE_ERROR`, `STORAGE_REQUIRED`, `SESSION_ERROR`, `SESSION_EXPIRED`, `SESSION_NOT_FOUND`, `INVALID_SESSION`, `INVALID_TOKEN`, `TOKEN_CREATION_FAILED`
