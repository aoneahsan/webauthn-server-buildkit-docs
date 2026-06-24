import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// ---------------------------------------------------------------------------
// webauthn-server-buildkit — Documentation site config
// Author: Ahsan Mahmood (https://aoneahsan.com)
// Source package: https://www.npmjs.com/package/webauthn-server-buildkit
// ---------------------------------------------------------------------------

const SITE_URL = 'https://webauthn-server-buildkit-docs.aoneahsan.com';
const NPM_URL = 'https://www.npmjs.com/package/webauthn-server-buildkit';
const REPO_URL = 'https://github.com/aoneahsan/webauthn-server-buildkit';
const DOCS_REPO_URL = 'https://github.com/aoneahsan/webauthn-server-buildkit-docs';

const config: Config = {
  title: 'WebAuthn Server Buildkit',
  tagline:
    'A framework-independent TypeScript WebAuthn / FIDO2 / passkeys server library — secure by default.',
  favicon: 'img/favicon.svg',

  // Production URL — served from Firebase Hosting + GitHub Pages.
  url: SITE_URL,
  baseUrl: '/',

  // GitHub metadata (drives OG tags + edit-this-page links)
  organizationName: 'aoneahsan',
  projectName: 'webauthn-server-buildkit-docs',

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  // SEO + AI-citability head tags injected into <head> of every page. The
  // JSON-LD payloads (WebSite, Organization, SoftwareSourceCode) help Google
  // Rich Results, Perplexity, ChatGPT, and Claude extract structured entity
  // data when citing this documentation.
  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'canonical', href: `${SITE_URL}/` },
    },
    {
      tagName: 'meta',
      attributes: { name: 'application-name', content: 'WebAuthn Server Buildkit Docs' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'apple-mobile-web-app-title', content: 'WebAuthn Server Buildkit' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'theme-color', content: '#4f46e5' },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'WebAuthn Server Buildkit Documentation',
        url: SITE_URL,
        description:
          'Documentation for webauthn-server-buildkit, a framework-independent TypeScript WebAuthn / FIDO2 server library: registration, authentication, attestation, encrypted sessions, and pluggable storage. Author: Ahsan Mahmood.',
        inLanguage: 'en',
        publisher: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
          email: 'aoneahsan@gmail.com',
          sameAs: [
            'https://linkedin.com/in/aoneahsan',
            'https://github.com/aoneahsan',
            'https://www.npmjs.com/~aoneahsan',
          ],
        },
        license: 'https://opensource.org/licenses/MIT',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'webauthn-server-buildkit',
        codeRepository: REPO_URL,
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Node.js',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform (Node.js)',
        url: NPM_URL,
        sameAs: NPM_URL,
        author: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
        },
        description:
          'A comprehensive WebAuthn server package for TypeScript that provides secure, type-safe, framework-independent biometric / passkey authentication: registration and authentication ceremony verification, full per-format attestation (apple, packed, fido-u2f, android-key, tpm, android-safetynet) with FIDO MDS trust anchoring, encrypted session tokens, and pluggable storage adapters.',
        license: 'https://opensource.org/licenses/MIT',
        keywords:
          'webauthn, fido2, passkeys, biometric authentication, typescript, node.js, attestation, cose, cbor, security',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ahsan Mahmood',
        alternateName: 'aoneahsan',
        url: 'https://aoneahsan.com',
        email: 'aoneahsan@gmail.com',
        sameAs: [
          'https://linkedin.com/in/aoneahsan',
          'https://github.com/aoneahsan',
          'https://www.npmjs.com/~aoneahsan',
          'https://aoneahsan.com',
        ],
        founder: { '@type': 'Person', name: 'Ahsan Mahmood' },
      }),
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  trailingSlash: false,

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: `${DOCS_REPO_URL}/edit/main/`,
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: 'date',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    metadata: [
      {
        name: 'description',
        content:
          'Documentation for webauthn-server-buildkit — a framework-independent TypeScript WebAuthn / FIDO2 / passkeys server library. Registration, authentication, attestation, encrypted sessions, and pluggable storage. Maintained by Ahsan Mahmood.',
      },
      {
        name: 'keywords',
        content:
          'webauthn, fido2, passkeys, biometric authentication, typescript webauthn, node webauthn server, webauthn server library, passkey server, attestation verification, fido mds, cose, cbor, webauthn registration, webauthn authentication, simplewebauthn alternative',
      },
      { name: 'author', content: 'Ahsan Mahmood' },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@aoneahsan' },
      { name: 'twitter:site', content: '@aoneahsan' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'WebAuthn Server Buildkit Docs' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'article:author', content: 'Ahsan Mahmood' },
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'WebAuthn Server Buildkit',
      logo: {
        alt: 'WebAuthn Server Buildkit logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/getting-started/quick-start',
          label: 'Quick Start',
          position: 'left',
        },
        {
          to: '/api/webauthn-server',
          label: 'API',
          position: 'left',
        },
        {
          to: '/about-the-author',
          label: 'Author',
          position: 'right',
        },
        {
          href: NPM_URL,
          label: 'npm',
          position: 'right',
        },
        {
          href: REPO_URL,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Introduction', to: '/intro' },
            { label: 'Installation', to: '/getting-started/installation' },
            { label: 'Quick Start', to: '/getting-started/quick-start' },
            { label: 'API Reference', to: '/api/webauthn-server' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'npm package', href: NPM_URL },
            { label: 'Source code', href: REPO_URL },
            { label: 'Docs source', href: DOCS_REPO_URL },
            { label: 'Capacitor biometric plugin', href: 'https://www.npmjs.com/package/capacitor-biometric-authentication' },
          ],
        },
        {
          title: 'Built by Ahsan Mahmood',
          items: [
            { label: 'aoneahsan.com', href: 'https://aoneahsan.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/aoneahsan' },
            { label: 'GitHub', href: 'https://github.com/aoneahsan' },
            { label: 'npm packages', href: 'https://www.npmjs.com/~aoneahsan' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ahsan Mahmood. Built with Docusaurus. webauthn-server-buildkit is MIT-licensed.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
