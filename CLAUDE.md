# WebAuthn Server Buildkit public docs guidance

**Last context pass:** 2026-10-20. **Next routine context pass:** 2026-11-19.

This public `aoneahsan/webauthn-server-buildkit-docs` repository documents npm package `webauthn-server-buildkit` from `/home/ahsan/Documents/01-code/projects/00-npm-packages-projects/01-biometrics-package/webauthn-server-buildkit`. GitHub Pages deploys `main` to `https://webauthn-server-buildkit-docs.aoneahsan.com`.

Use package `2.3.2` source, exports, security records, and open issues for every technical claim. Keep registration, authentication, challenge, origin/RP ID, algorithm, attestation, counter, storage, and session behavior exact. Never invent compatibility, security certification, test coverage, or production guarantees. Examples use synthetic values and must keep secrets and authenticator data out of the public repository.

`docs/` contains published pages and excluded maintenance records. `src/` contains the Docusaurus home and styles; `static/` contains public discovery and brand assets. Keep guide pairs and `docs/tracking/` excluded.

Use Yarn only and never install owner-created client packages. Run `yarn install --immutable`, `yarn typecheck`, and `yarn build`; inspect exact `build/` output in controlled desktop and mobile Chrome before pushing. After a `main` push, verify Pages, representative routes, `robots.txt`, `llms.txt`, `llms-full.txt`, and live mobile output.

Context optimization is complete for this pass. Do not repeat before 2026-11-19 unless the owner requests it, the tree changes materially, a hard cap is breached, or stale guidance can cause wrong work.
