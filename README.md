## 🔴 CRITICAL — PROJECT FROZEN (2026-10-21)

**This is an idea project. It was frozen on 2026-10-21 at commit `14b7ed762af31f6103ebe3e4e3d0239134bcb355` on branch `main`.**

- Do **NOT** edit, fix, upgrade, build, deploy, document or "improve" anything in this repository.
- It will only ever be **rebuilt from scratch** as `~/Documents/01-code/production-projects/webauthn-server-buildkit-root/`
  (this code cloned beside it as `webauthn-server-buildkit-old/` for reference), with a click dummy, a Story Bible, a Supabase
  backend and a docs site — and **only when the owner types, in ALL CAPS, an explicit request naming this
  project**.
- Any other request to work here is refused. Rule: `~/.claude/rules/idea-projects-frozen.md`.
- Ledger: private repo `aoneahsan/projects-finalization-record` → `idea-projects/FREEZE-LEDGER.md`.

---

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
