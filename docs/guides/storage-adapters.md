---
id: storage-adapters
title: Storage Adapters
description: Implement the StorageAdapter interface for webauthn-server-buildkit to persist users, credentials, challenges, and sessions in Postgres, Redis, MongoDB, or any backend.
sidebar_position: 5
keywords:
  - webauthn storage adapter
  - StorageAdapter
  - MemoryStorageAdapter
  - persist webauthn credentials
---

# Storage Adapters

**A storage adapter is the bridge between webauthn-server-buildkit and your database.** The library never assumes a particular store — it defines a small `StorageAdapter` interface with four sections (users, credentials, challenges, sessions) and ships an in-memory implementation for development.

## The built-in memory adapter

```typescript
import { MemoryStorageAdapter } from 'webauthn-server-buildkit';

const storage = new MemoryStorageAdapter();
```

`MemoryStorageAdapter` keeps everything in process memory. It is ideal for local development, examples, and tests, but state is lost on restart and is not shared across instances — so it is **not** for production.

## The `StorageAdapter` interface

You implement four groups of async methods:

```typescript
interface StorageAdapter {
  users: {
    findById(id: string | number): Promise<UserModel | null>;
    findByUsername(username: string): Promise<UserModel | null>;
    create(user: Omit<UserModel, 'id'>): Promise<UserModel>;
    update(id: string | number, updates: Partial<UserModel>): Promise<UserModel | null>;
    delete(id: string | number): Promise<boolean>;
  };
  credentials: {
    findById(id: Base64URLString): Promise<WebAuthnCredential | null>;
    findByUserId(userId: string | number): Promise<WebAuthnCredential[]>;
    findByWebAuthnUserId(webAuthnUserId: Base64URLString): Promise<WebAuthnCredential[]>;
    create(credential: Omit<WebAuthnCredential, 'createdAt'>): Promise<WebAuthnCredential>;
    updateCounter(id: Base64URLString, counter: number): Promise<boolean>;
    updateLastUsed(id: Base64URLString): Promise<boolean>;
    delete(id: Base64URLString): Promise<boolean>;
    deleteByUserId(userId: string | number): Promise<boolean>;
  };
  challenges: {
    create(challenge: ChallengeData): Promise<boolean>;
    find(challenge: string): Promise<ChallengeData | null>;
    delete(challenge: string): Promise<boolean>;
    deleteExpired(): Promise<boolean>;
  };
  sessions: {
    create(sessionId: string, data: SessionData): Promise<boolean>;
    find(sessionId: string): Promise<SessionData | null>;
    update(sessionId: string, data: Partial<SessionData>): Promise<boolean>;
    delete(sessionId: string): Promise<boolean>;
    deleteExpired(): Promise<boolean>;
    deleteByUserId(userId: string | number): Promise<boolean>;
  };
}
```

## Implementation notes

- **`credentials.findById`** is the hot path on authentication — index the credential ID column.
- **`credentials.findByWebAuthnUserId`** powers usernameless login — index `webAuthnUserID` too.
- **`challenges.find` / `challenges.delete`** back the single-use challenge enforcement. Storing an `expiresAt` and honoring it lets `deleteExpired` and `cleanup()` keep the table small.
- **`publicKey`** is a `Uint8Array` — store it as `bytea` (Postgres), a `Buffer`/binary field (MongoDB), or base64url text. Round-trip it exactly.
- Return `null` (not a thrown error) from `find*` methods when a record is absent; the library treats `null` as "not found".

## Reference adapter examples

The package repository ships full reference adapters you can adapt:

- **PostgreSQL** — `docs/examples/storage-adapters/postgresql-adapter.ts`
- **Redis** (sessions/challenges) — `docs/examples/storage-adapters/redis-session-adapter.ts`
- **MongoDB** — `docs/examples/storage-adapters/mongodb-adapter.ts`

See them in the [source repository](https://github.com/aoneahsan/webauthn-server-buildkit/tree/main/docs/examples/storage-adapters).

## Frequently asked questions

### Can I split storage across databases?

Yes. Nothing requires all four sections to live in one store — a common pattern is durable user/credential records in Postgres with ephemeral challenges and sessions in Redis. As long as each method honors its contract, mix freely.

### Do I have to implement every method?

Implement every method your flows actually call. The full ceremony plus sessions uses all of them; a registration-only prototype might leave session methods as simple stubs. The TypeScript interface lists the complete surface.

### How do I delete a user's data on account deletion?

Call `credentials.deleteByUserId` and `sessions.deleteByUserId`, then `users.delete`. This removes their passkeys and active sessions in one sweep.
