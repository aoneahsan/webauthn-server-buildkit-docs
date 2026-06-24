import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Sidebar layout for webauthn-server-buildkit docs.
 *
 * Every page documents real, shipping API surface read from the package
 * source (src/). No placeholders.
 */
const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['getting-started/installation', 'getting-started/quick-start'],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/configuration',
        'guides/registration',
        'guides/authentication',
        'guides/sessions',
        'guides/storage-adapters',
        'guides/attestation',
        'guides/security-model',
        'guides/error-handling',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'api/webauthn-server',
        'api/configuration',
        'api/storage-adapter',
        'api/attestation',
        'api/crypto-and-utils',
        'api/types-and-errors',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      collapsed: true,
      items: ['examples/express'],
    },
    {
      type: 'category',
      label: 'About',
      collapsed: true,
      items: ['about-the-author'],
    },
  ],
};

export default sidebars;
