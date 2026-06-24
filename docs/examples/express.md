---
id: express
title: Express Example
description: Wire webauthn-server-buildkit into an Express server with four endpoints for registration and authentication.
sidebar_position: 1
keywords:
  - webauthn express
  - express passkeys
  - webauthn node example
---

# Express Example

**This example wires webauthn-server-buildkit into an Express app with four endpoints** — two for registration, two for authentication. It mirrors the runnable example in the package repository at [`examples/express/`](https://github.com/aoneahsan/webauthn-server-buildkit/tree/main/examples/express).

```typescript
import express from 'express';
import { WebAuthnServer, MemoryStorageAdapter } from 'webauthn-server-buildkit';

const app = express();
app.use(express.json());

const storage = new MemoryStorageAdapter();
const webauthn = new WebAuthnServer({
  rpName: 'Express Demo',
  rpID: 'localhost',
  origin: 'http://localhost:3000',
  encryptionSecret: process.env.WEBAUTHN_SECRET ?? 'dev-secret-at-least-32-characters!!',
  storageAdapter: storage,
});

// In-memory per-user challenge map for the demo (use sessions in production).
const challenges = new Map<string, string>();
```

## Registration endpoints

```typescript
// 1. Start registration
app.post('/register/options', async (req, res) => {
  const user = { id: req.body.userId, username: req.body.username, displayName: req.body.username };
  await storage.users.create(user).catch(() => undefined);

  const { options, challenge, webAuthnUserId } = await webauthn.createRegistrationOptions(user);
  challenges.set(user.id, challenge);
  (user as any).webAuthnUserId = webAuthnUserId;
  res.json(options);
});

// 2. Finish registration
app.post('/register/verify', async (req, res) => {
  const challenge = challenges.get(req.body.userId);
  if (!challenge) return res.status(400).json({ error: 'CHALLENGE_NOT_FOUND' });

  try {
    const { verified, registrationInfo } = await webauthn.verifyRegistration(
      req.body.credential,
      challenge,
    );
    if (verified && registrationInfo) {
      await storage.credentials.create({
        id: registrationInfo.credential.id,
        publicKey: registrationInfo.credential.publicKey,
        counter: registrationInfo.credential.counter,
        transports: registrationInfo.credential.transports,
        alg: registrationInfo.credential.alg,
        deviceType: registrationInfo.credentialDeviceType,
        backedUp: registrationInfo.credentialBackedUp,
        userVerified: registrationInfo.userVerified,
        userId: req.body.userId,
        webAuthnUserID: req.body.webAuthnUserId,
      });
    }
    res.json({ verified });
  } catch (err: any) {
    res.status(err.statusCode ?? 400).json({ error: err.code ?? 'REGISTRATION_ERROR' });
  }
});
```

## Authentication endpoints

```typescript
// 3. Start authentication
app.post('/login/options', async (req, res) => {
  const creds = await storage.credentials.findByUserId(req.body.userId);
  const { options, challenge } = await webauthn.createAuthenticationOptions({
    allowCredentials: creds.map((c) => ({ id: c.id, type: 'public-key', transports: c.transports })),
  });
  challenges.set(req.body.userId, challenge);
  res.json(options);
});

// 4. Finish authentication
app.post('/login/verify', async (req, res) => {
  const challenge = challenges.get(req.body.userId);
  if (!challenge) return res.status(400).json({ error: 'CHALLENGE_NOT_FOUND' });

  const credential = await storage.credentials.findById(req.body.credential.id);
  if (!credential) return res.status(404).json({ error: 'CREDENTIAL_ID_MISMATCH' });

  try {
    const { verified, authenticationInfo } = await webauthn.verifyAuthentication(
      req.body.credential,
      challenge,
      credential,
    );
    if (verified) {
      const token = await webauthn.createSession(
        credential.userId,
        credential.id,
        authenticationInfo!.userVerified,
      );
      return res.json({ verified, token });
    }
    res.json({ verified });
  } catch (err: any) {
    res.status(err.statusCode ?? 401).json({ error: err.code ?? 'AUTHENTICATION_ERROR' });
  }
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

## Notes

- The browser side calls `navigator.credentials.create({ publicKey: options })` and `navigator.credentials.get({ publicKey: options })`, then POSTs the serialized credential back to the verify endpoints.
- This demo stores the per-user challenge in a `Map`; a real app keeps it in the user's session and relies on the library's stored single-use challenge for replay protection.
- Swap `MemoryStorageAdapter` for a [production adapter](../guides/storage-adapters.md) before deploying.
