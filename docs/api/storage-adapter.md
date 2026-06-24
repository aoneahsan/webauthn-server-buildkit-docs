---
id: storage-adapter
title: StorageAdapter
description: API reference for the StorageAdapter interface and MemoryStorageAdapter in webauthn-server-buildkit.
sidebar_position: 3
keywords:
  - StorageAdapter interface
  - MemoryStorageAdapter
  - webauthn persistence api
---

# `StorageAdapter`

**`StorageAdapter` is the interface webauthn-server-buildkit uses to read and write all persistent data.** It has four sections — `users`, `credentials`, `challenges`, and `sessions` — each a set of async methods. See the [Storage adapters guide](../guides/storage-adapters.md) for implementation notes.

## `MemoryStorageAdapter`

A ready-made in-memory implementation, exported for development and tests:

```typescript
import { MemoryStorageAdapter } from 'webauthn-server-buildkit';
const storage = new MemoryStorageAdapter();
```

State is per-process and lost on restart — not for production.

## `users`

| Method | Signature |
| --- | --- |
| `findById` | `(id: string \| number) => Promise<UserModel \| null>` |
| `findByUsername` | `(username: string) => Promise<UserModel \| null>` |
| `create` | `(user: Omit<UserModel, 'id'>) => Promise<UserModel>` |
| `update` | `(id, updates: Partial<UserModel>) => Promise<UserModel \| null>` |
| `delete` | `(id) => Promise<boolean>` |

## `credentials`

| Method | Signature |
| --- | --- |
| `findById` | `(id: Base64URLString) => Promise<WebAuthnCredential \| null>` |
| `findByUserId` | `(userId) => Promise<WebAuthnCredential[]>` |
| `findByWebAuthnUserId` | `(webAuthnUserId: Base64URLString) => Promise<WebAuthnCredential[]>` |
| `create` | `(credential: Omit<WebAuthnCredential, 'createdAt'>) => Promise<WebAuthnCredential>` |
| `updateCounter` | `(id, counter: number) => Promise<boolean>` |
| `updateLastUsed` | `(id) => Promise<boolean>` |
| `delete` | `(id) => Promise<boolean>` |
| `deleteByUserId` | `(userId) => Promise<boolean>` |

## `challenges`

| Method | Signature |
| --- | --- |
| `create` | `(challenge: ChallengeData) => Promise<boolean>` |
| `find` | `(challenge: string) => Promise<ChallengeData \| null>` |
| `delete` | `(challenge: string) => Promise<boolean>` |
| `deleteExpired` | `() => Promise<boolean>` |

## `sessions`

| Method | Signature |
| --- | --- |
| `create` | `(sessionId: string, data: SessionData) => Promise<boolean>` |
| `find` | `(sessionId: string) => Promise<SessionData \| null>` |
| `update` | `(sessionId, data: Partial<SessionData>) => Promise<boolean>` |
| `delete` | `(sessionId) => Promise<boolean>` |
| `deleteExpired` | `() => Promise<boolean>` |
| `deleteByUserId` | `(userId) => Promise<boolean>` |

## Contracts

- `find*` methods return `null` (never throw) when a record is absent.
- `WebAuthnCredential.publicKey` is a `Uint8Array` — round-trip it byte-for-byte.
- Index `credentials.id` and `credentials.webAuthnUserID` for ceremony performance.
