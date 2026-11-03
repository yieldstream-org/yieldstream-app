# Contributing to the YieldStream app

## What this repo is

Next.js 14 (App Router) + Tailwind + TypeScript strict. It currently ships the
protocol landing page. The issuer dashboard and the wallet-connected claim UI
are open work in the issue backlog — those are the contributions that move this
repo forward fastest.

## Before you start

1. Pick an issue from [the backlog](https://github.com/yieldstream-org/yieldstream-app/issues).
   Each one lists acceptance criteria; that list is the definition of done.
2. Comment to request assignment before writing code.
3. If the work depends on the contract or the SDK, say so in the issue before
   you build against an interface that does not exist yet. The dashboard's tree
   building depends on the SDK hashing core (sdk issues #1 and #2).

## Setup

```bash
npm install
npm run dev         # http://localhost:3000
```

No environment variables are required for the landing page. Anything the
dashboard needs will be named in its issue.

## Checks that must pass

```bash
npm run typecheck
npm run build
```

These are the two CI jobs, and they are required status checks on `main`.

## Conventions

- App Router under `app/`, shared pieces under `components/`
- TypeScript strict mode stays on; no `any` without a comment explaining why
- Tailwind utility classes over custom CSS; brand colors are `ink` and `accent`
  in `tailwind.config.ts`
- Conventional commits: `feat(scope): description`, `fix(scope): description`
- Stage specific files, not `git add .`
- One logical change per PR — a UI tweak and a data-layer change don't belong
  together

## Design rules

- The landing page makes one claim: one 32-byte root, no per-recipient
  transactions. Don't add sections that don't serve it.
- State capability honestly. Nothing is "audited", "production-ready", or
  "seamless" here — the contract is unaudited and testnet-only, and the copy
  should say so.
- Respect `prefers-reduced-motion` for anything animated.

## PRs

Fill in what changed, which issue it closes, and how you verified it. Screenshots
for visual changes. Expect review within five days; ping if it stalls longer.

## Code of conduct

Participation in this repository and every other `yieldstream-org`
space is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Reporting
concerns is described there.
