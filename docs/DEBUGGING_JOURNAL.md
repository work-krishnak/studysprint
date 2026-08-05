# Debugging Journal — StudySprint

## Entry 1 — Missing/incorrect entry point in package.json
**What happened:** `npm run dev` and `npm start` failed with `Cannot find module '...\server\index.js'`. `package.json`'s `"main"` field pointed to a file that never existed.
**Failure pattern:** Stale/incorrect project configuration — likely a leftover from initial scaffolding before the real entry point was named `server.js`.
**Recovery:** Used `dir` to list actual files, `type server.js` to confirm the real entry point (calls `app.listen()`), then corrected `main`, `start`, and `dev` in `package.json` to point to `server.js`.
**Outcome:** Server boots cleanly on port 3001; `npm start`/`npm run dev` both work.

## Entry 2 — `npm audit fix --force` made things worse before better
**What happened:** Client-side audit found 6 high-severity vulnerabilities including one in production dependency `react-router-dom`. First `--force` fix landed on `react-router-dom@7.11.0`, which was then flagged for 14 separate high-severity CVEs (XSS, open redirect, DoS, RCE-adjacent).
**Failure pattern:** Blind trust in automated tooling — `npm audit fix --force` doesn't guarantee the safest version, just one that satisfies dependency constraints.
**Recovery:** Re-ran `npm audit` after the first fix instead of assuming success, saw the worse outcome, ran `npm audit fix --force` a second time to reach `7.18.2`, then confirmed with a non-forcing `npm audit fix` that no further safe fixes remained.
**Outcome:** Down to 2 low-impact issues (1 dev-only, 1 in an unused RSC feature). Manually verified the app (register → dashboard → assignments) still worked after the major version bump.

## Entry 3 — Railway deployment failed twice before finding the right approach
**What happened:** First deploy failed — Railpack couldn't detect the app type. Setting Root Directory to `/server` + a build command with `cd ../client` failed with `can't cd to ../client` (Root Directory sandboxes the build). Removing Root Directory and using `cd client && npm install...` from repo root failed with `npm: not found` (Railpack no longer detected Node.js without a root-level `package.json`).
**Failure pattern:** Fighting an auto-detection tool not designed for a two-package.json monorepo, instead of switching to an explicit, controlled build method.
**Recovery:** Switched to a Dockerfile-based build for full explicit control over both the frontend build and backend install steps.
**Outcome:** Build succeeded; Railway auto-detected the Dockerfile as the builder once pushed.

## Entry 4 — Production crash from Node version mismatch
**What happened:** After a successful Dockerfile build, the deployed container crashed immediately with `ERR_UNKNOWN_BUILTIN_MODULE` on `db.js`, which uses Node's built-in `node:sqlite` module.
**Failure pattern:** Environment mismatch between local dev (Node 24) and the Dockerfile's base image (`node:20-slim`) — `node:sqlite` doesn't exist in Node 20.
**Recovery:** Read the crash stack trace, traced it to the sqlite module import, matched it to the Node version requirement, and updated the Dockerfile to `node:24-slim`.
**Outcome:** Redeployed successfully; app confirmed working end-to-end on the live URL (register, dashboard, assignment creation, refresh on nested routes).