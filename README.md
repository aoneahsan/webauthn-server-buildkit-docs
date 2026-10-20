# WebAuthn Server Buildkit Documentation

Public documentation for [`webauthn-server-buildkit`](https://www.npmjs.com/package/webauthn-server-buildkit), a framework-independent TypeScript WebAuthn server library for Node.js.

- [Live documentation](https://webauthn-server-buildkit-docs.aoneahsan.com)
- [Package source](https://github.com/aoneahsan/webauthn-server-buildkit)
- [Docs source](https://github.com/aoneahsan/webauthn-server-buildkit-docs)
- [npm package](https://www.npmjs.com/package/webauthn-server-buildkit)

## Local verification

```bash
yarn install --immutable
yarn typecheck
yarn build
yarn serve
```

Inspect the generated `build/` site at desktop and mobile widths. Security, API, and compatibility claims must be checked against the maintained package source.

## Deployment

Pushing `main` runs `.github/workflows/deploy-pages.yml`. GitHub Pages serves the custom domain declared in `static/CNAME`. Verify the workflow, representative pages, discovery files, and the live mobile layout after deployment.

## License

Documentation is maintained by [Ahsan Mahmood](https://aoneahsan.com). Package licensing is recorded in the package repository.
