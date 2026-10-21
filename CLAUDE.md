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

# WebAuthn Server Buildkit public docs guidance

**Last Updated:** 2026-10-20

**Last context pass:** 2026-10-20. **Next routine context pass:** 2026-11-19.

This public `aoneahsan/webauthn-server-buildkit-docs` repository documents npm package `webauthn-server-buildkit` from `/home/ahsan/Documents/01-code/projects/00-npm-packages-projects/01-biometrics-package/webauthn-server-buildkit`. GitHub Pages deploys `main` to `https://webauthn-server-buildkit-docs.aoneahsan.com`.

Use package `2.3.2` source, exports, security records, and open issues for every technical claim. Keep registration, authentication, challenge, origin/RP ID, algorithm, attestation, counter, storage, and session behavior exact. Never invent compatibility, security certification, test coverage, or production guarantees. Examples use synthetic values and must keep secrets and authenticator data out of the public repository.

`docs/` contains published pages and excluded maintenance records. `src/` contains the Docusaurus home and styles; `static/` contains public discovery and brand assets. Keep guide pairs and `docs/tracking/` excluded.

Use Yarn only and never install owner-created client packages. Run `yarn install --immutable`, `yarn typecheck`, and `yarn build`; inspect exact `build/` output in controlled desktop and mobile Chrome before pushing. After a `main` push, verify Pages, representative routes, `robots.txt`, `llms.txt`, `llms-full.txt`, and live mobile output.

Context optimization is complete for this pass. Do not repeat before 2026-11-19 unless the owner requests it, the tree changes materially, a hard cap is breached, or stale guidance can cause wrong work.

## Stop-work Git gate

<!-- RULE:stop-work-git-gate v2026-10-20 -->

Before stopping, commit every legitimate change and work-progress checkpoint in this repository and each independent nested repository, fetch and merge the designated upstream, push the documented working branch, then verify an empty worktree and `0 0` ahead/behind. Never stash, discard, reset, rebase, or force-push. If synchronization is blocked, report the exact repository, branch, blocker, and next action instead of calling the work complete. The full workflow remains authoritative in `~/.claude/rules/git-workflow.md`.
