---
id: intro
title: Introduction
description: webauthn-server-buildkit is a framework-independent TypeScript WebAuthn / FIDO2 / passkeys server library for Node.js — registration, authentication, attestation, encrypted sessions, and pluggable storage.
slug: /intro
sidebar_position: 1
keywords:
  - webauthn server
  - fido2 typescript
  - passkeys node
  - webauthn library
---

# webauthn-server-buildkit

**webauthn-server-buildkit is a framework-independent TypeScript library that implements the server (relying party) side of WebAuthn / FIDO2 / passkeys for Node.js.** It generates registration and authentication ceremony options, verifies the browser's response cryptographically, performs full per-format attestation verification with FIDO Metadata Service trust anchoring, mints encrypted session tokens, and persists data through pluggable storage adapters — all without depending on any web framework.

It is published on npm as [`webauthn-server-buildkit`](https://www.npmjs.com/package/webauthn-server-buildkit) and is MIT-licensed. The current version is **2.3.0**.

```bash
npm install webauthn-server-buildkit
```

## What it does

- **Registration ceremony** — generate `PublicKeyCredentialCreationOptions` for the browser and verify the returned attestation response: challenge, origin, RP-ID hash, authenticator flags, signature counter, and signature.
- **Authentication ceremony** — generate `PublicKeyCredentialRequestOptions` and verify the returned assertion, including signature, counter regression checks, user-handle binding, and algorithm pinning.
- **Attestation** — `none`, `packed` (self and x5c), `fido-u2f`, `android-key`, `tpm`, `android-safetynet`, and `apple` are cryptographically verified. The result reports `attestationVerified: true` only when the statement is also trust-anchored.
- **Sessions** — encrypted session tokens using AES-256-GCM with HKDF-SHA256 key derivation, created and validated entirely behind the `WebAuthnServer` API.
- **Storage** — a built-in in-memory adapter plus a small `StorageAdapter` interface so you can persist to Postgres, Redis, MongoDB, or any backend.

## What it is not

Being honest about scope saves you debugging time:

- **It is a server library, not a client.** The browser side (`navigator.credentials.create` / `.get`) and native mobile side are out of scope. Pair it with any WebAuthn client; on Capacitor, pair it with [`capacitor-biometric-authentication`](https://www.npmjs.com/package/capacitor-biometric-authentication).
- **It is not a framework or an HTTP server.** It exposes plain async methods. You wire them into Express, Fastify, Hono, Next.js route handlers, or anything else.
- **It does not provide a database.** The in-memory adapter is for development and tests; production needs a real adapter you implement against the `StorageAdapter` interface.
- **Attestation is offline by design.** There is no CRL/OCSP revocation checking. You supply FIDO MDS data through a `metadataService`; the package never fetches it.

## Why use it

| Concern | How webauthn-server-buildkit handles it |
| --- | --- |
| Type safety | Written in TypeScript; ships ESM, CommonJS, and `.d.ts`. Every public type is exported. |
| Security defaults | Single-use challenges, algorithm pinning, cross-origin rejection, and constant-time comparisons are **on by default**. |
| Dependencies | One runtime dependency (`cbor-x`). No framework lock-in, no heavyweight crypto bundle. |
| Honesty | `attestationVerified` is `true` only when actually trust-anchored — never an optimistic guess. |
| Algorithms | ES256/384/512, RS256-512, PS256-512, and Ed25519 all verify. |

## Next steps

- [Installation](./getting-started/installation.md) — install and meet the requirements.
- [Quick Start](./getting-started/quick-start.md) — a working registration + authentication flow in about five minutes.
- [Configuration](./guides/configuration.md) — every `WebAuthnServerConfig` option, with defaults.
- [API Reference](./api/webauthn-server.md) — the full `WebAuthnServer` method surface.

## Frequently asked questions

### Is webauthn-server-buildkit a passkeys library?

Yes. Passkeys are discoverable WebAuthn credentials. The library supports usernameless / discoverable-credential flows: `createRegistrationOptions` returns a `webAuthnUserId` you persist on the credential, and authentication verifies the authenticator's `userHandle` against it.

### Does it work with Express / Fastify / Next.js?

Yes — it is framework-independent. It returns plain objects and Promises, so it drops into any Node.js HTTP layer. See the [Express example](./examples/express.md).

### How is it different from simplewebauthn?

webauthn-server-buildkit is a custom, self-contained implementation (not a wrapper around another server library). It bundles full per-format attestation with pluggable FIDO MDS trust anchoring, encrypted session management, and a storage-adapter abstraction in one package. Choose whichever fits your stack; the WebAuthn ceremony concepts are identical.

### Which Node.js version is required?

Node.js **24.13.0 or newer** (`engines.node` in `package.json`). It uses Node's built-in `crypto` for all signature and session work.
