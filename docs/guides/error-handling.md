---
id: error-handling
title: Error Handling
description: Handle webauthn-server-buildkit errors by stable code and HTTP status — WebAuthnError, RegistrationError, AuthenticationError, and the full WebAuthnErrorCode list.
sidebar_position: 8
keywords:
  - webauthn error codes
  - WebAuthnError
  - WebAuthnErrorCode
  - error handling
---

# Error Handling

**Every failure in webauthn-server-buildkit is a typed `WebAuthnError` subclass that carries a stable, machine-readable `code` and a suggested HTTP `statusCode`.** Branch on the `code` — never on the human-readable message, which may change.

## The error classes

All errors extend `WebAuthnError`:

| Class | Default `statusCode` | Thrown for |
| --- | --- | --- |
| `WebAuthnError` | 400 | Base class — catch this to handle everything. |
| `RegistrationError` | 400 | Registration ceremony failures. |
| `AuthenticationError` | 401 | Authentication ceremony failures. |
| `VerificationError` | 400 | Generic verification failures (challenge, client data). |
| `ConfigurationError` | 500 | Invalid configuration at construction time. |
| `StorageError` | 500 | Storage adapter problems. |
| `SessionError` | 401 | Session token failures. |

```typescript
import { WebAuthnError } from 'webauthn-server-buildkit';

try {
  await webauthn.verifyAuthentication(assertion, challenge, credential);
} catch (err) {
  if (err instanceof WebAuthnError) {
    res.status(err.statusCode).json({ error: err.code });
  } else {
    res.status(500).json({ error: 'INTERNAL' });
  }
}
```

Because each instance has a `statusCode`, you can map failures to HTTP responses generically without a big switch — `400` for bad input and most verification failures, `401` for auth/session failures, `500` for configuration/storage problems.

## Branching on `code`

`code` is typed as an **open union** (`WebAuthnErrorCode | (string & {})`), so known codes autocomplete while custom/future codes still compile.

```typescript
if (err instanceof WebAuthnError) {
  switch (err.code) {
    case 'CHALLENGE_EXPIRED':
    case 'CHALLENGE_NOT_FOUND':
      return promptRetry();
    case 'COUNTER_ERROR':
      return flagPossibleClone();
    case 'ALGORITHM_MISMATCH':
      return rejectHard();
    default:
      return genericFailure();
  }
}
```

## Notable error codes by category

| Category | Codes |
| --- | --- |
| Challenge lifecycle | `CHALLENGE_NOT_FOUND`, `CHALLENGE_OPERATION_MISMATCH`, `CHALLENGE_EXPIRED`, `CHALLENGE_MISMATCH` |
| Algorithm / COSE | `ALGORITHM_MISMATCH`, `UNSUPPORTED_ALGORITHM`, `UNSUPPORTED_CURVE`, `COSE_ALG_MISMATCH`, `COSE_DECODE_ERROR` |
| Client data / origin | `INVALID_CLIENT_DATA_TYPE`, `ORIGIN_MISMATCH`, `RPID_MISMATCH`, `CROSS_ORIGIN_NOT_ALLOWED` |
| Authenticator data | `USER_PRESENCE_REQUIRED`, `USER_VERIFICATION_REQUIRED`, `AUTHENTICATOR_DATA_TOO_SHORT` |
| Registration | `REGISTRATION_VERIFICATION_FAILED`, `CREDENTIAL_ALREADY_REGISTERED`, `ATTESTATION_SIGNATURE_INVALID` |
| Attestation trust | `ATTESTATION_INVALID`, `ATTESTATION_CHAIN_INVALID`, `ATTESTATION_NOT_TRUSTED`, `ATTESTATION_UNSUPPORTED_FORMAT` |
| Authentication | `AUTHENTICATION_VERIFICATION_FAILED`, `CREDENTIAL_ID_MISMATCH`, `USER_HANDLE_MISMATCH`, `COUNTER_ERROR`, `SIGNATURE_VERIFICATION_FAILED` |
| Session | `SESSION_EXPIRED`, `SESSION_NOT_FOUND`, `INVALID_TOKEN`, `TOKEN_CREATION_FAILED` |
| Config / storage | `CONFIGURATION_ERROR`, `STORAGE_ERROR`, `STORAGE_REQUIRED` |

See the [full list in the API reference](../api/types-and-errors.md).

## Frequently asked questions

### Should I show error codes to end users?

No — map them to friendly messages. Codes are for your logs and control flow. For example, present `CHALLENGE_EXPIRED` as "Your sign-in attempt timed out, please try again," and `COUNTER_ERROR` as a security alert you investigate.

### Why match on `code` instead of the message?

Messages are human-readable and may be reworded between versions; codes are a stable contract. Branching on `code` keeps your error handling resilient to copy changes.

### Which errors mean "let the user retry" vs "block"?

Lifecycle errors like `CHALLENGE_EXPIRED` / `CHALLENGE_NOT_FOUND` are retryable — issue a fresh challenge. Security errors like `COUNTER_ERROR`, `ALGORITHM_MISMATCH`, and `ATTESTATION_NOT_TRUSTED` indicate something is wrong with the credential or environment and should generally be blocked and investigated.
