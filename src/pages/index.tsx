import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

type Feature = {
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    title: 'Registration & authentication',
    body: 'Generate WebAuthn ceremony options and verify the response end to end — challenge, origin, RP-ID hash, flags, signature counter, and signature — for ES256/384/512, RS/PS256-512, and Ed25519.',
  },
  {
    title: 'Full attestation verification',
    body: 'apple, packed (self + x5c), fido-u2f, android-key, tpm, and android-safetynet are cryptographically verified. attestationVerified is true only when trust-anchored to a real root (honest framing).',
  },
  {
    title: 'FIDO MDS trust anchoring',
    body: 'Bring your own FIDO Metadata Service blob via a pluggable MetadataService. The package never fetches it at import — apple ships with a bundled root, the rest are RP-supplied.',
  },
  {
    title: 'Encrypted session tokens',
    body: 'AES-256-GCM with HKDF-SHA256 key derivation, managed behind the WebAuthnServer API. Create, validate, refresh, and revoke sessions without exposing the token format.',
  },
  {
    title: 'Pluggable storage',
    body: 'A built-in in-memory adapter plus a small StorageAdapter interface for users, credentials, challenges, and sessions. Drop in Postgres, Redis, MongoDB, or your own backend.',
  },
  {
    title: 'Secure by default, framework-free',
    body: 'Single-use challenges, algorithm pinning, cross-origin rejection, and constant-time comparisons are on by default. No web framework required — one runtime dependency (cbor-x).',
  },
];

function HomepageHeader(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        <code className={styles.heroInstall}>npm i webauthn-server-buildkit</code>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/getting-started/quick-start">
            Quick Start — 5 min
          </Link>
          <Link className="button button--secondary button--lg" to="/getting-started/installation">
            Installation
          </Link>
          <Link
            className="button button--outline button--lg"
            href="https://www.npmjs.com/package/webauthn-server-buildkit"
          >
            View on npm
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.featuresWrap}>
      <div className="container">
        <div className="row">
          {FEATURES.map((f) => (
            <div key={f.title} className="col col--4" style={{ marginBottom: '1.5rem' }}>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthorStrip(): ReactNode {
  return (
    <section className={styles.authorStrip}>
      <div className="container">
        <p>
          Built and maintained by <Link href="https://aoneahsan.com">Ahsan Mahmood</Link> —{' '}
          <Link href="https://linkedin.com/in/aoneahsan">LinkedIn</Link> ·{' '}
          <Link href="https://github.com/aoneahsan">GitHub</Link> ·{' '}
          <Link href="https://www.npmjs.com/~aoneahsan">npm</Link>
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} — WebAuthn / FIDO2 / passkeys server library`}
      description="Documentation for webauthn-server-buildkit: a framework-independent TypeScript WebAuthn / FIDO2 server library with registration, authentication, full attestation verification, encrypted sessions, and pluggable storage."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <AuthorStrip />
      </main>
    </Layout>
  );
}
