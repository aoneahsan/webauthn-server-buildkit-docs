# webauthn-server-buildkit — Documentation site

Public documentation for [`webauthn-server-buildkit`](https://www.npmjs.com/package/webauthn-server-buildkit),
a framework-independent TypeScript WebAuthn / FIDO2 / passkeys **server** library for Node.js.

- **Live site:** https://webauthn-server-buildkit-docs.aoneahsan.com
- **Package source:** https://github.com/aoneahsan/webauthn-server-buildkit
- **npm:** https://www.npmjs.com/package/webauthn-server-buildkit

Built with [Docusaurus 3](https://docusaurus.io/). This is a **public** repository and
contains documentation only — no secrets.

## Local development

```bash
yarn install
yarn start      # dev server on http://localhost:5972
yarn build      # static build into ./build
yarn serve      # preview the production build on http://localhost:5973
yarn typecheck  # type-check the config + React pages
```

## Deployment (dual hosting)

The site is configured for two hosting targets. **Both deploys are owner/user-only**
(they need credentials or a one-time repo settings toggle).

### Firebase Hosting

```bash
yarn build
npx -y firebase-tools@latest login
npx -y firebase-tools@latest deploy --only hosting --project webauthn-server-buildkit-docs
```

`firebase.json` + `.firebaserc` are committed. Create a Firebase Hosting site named
`webauthn-server-buildkit-docs` and point the custom domain
`webauthn-server-buildkit-docs.aoneahsan.com` at it in the Firebase console.

### GitHub Pages

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to
`main`. One-time setup by the repo owner:

1. **Settings → Pages → Source:** "GitHub Actions".
2. Add the custom domain `webauthn-server-buildkit-docs.aoneahsan.com` (a `static/CNAME`
   is already committed and copied into the build output).
3. Add a DNS `CNAME` record for that subdomain at the registrar.

## Structure

```
docs/                 Markdown content (intro, getting-started, guides, api, examples)
src/                  React landing page + brand CSS
static/               robots.txt, llms.txt, CNAME, security.txt, brand SVGs
docusaurus.config.ts  Site config + SEO head tags + JSON-LD
sidebars.ts           Sidebar layout
firebase.json         Firebase Hosting config
.github/workflows/    GitHub Pages deploy workflow
```

## License

MIT © Ahsan Mahmood. Documentation for an MIT-licensed package.
