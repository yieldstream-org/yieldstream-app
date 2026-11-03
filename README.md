<div align="center">
<img src="./app/icon.svg" alt="YieldStream logo" width="80" height="80" />

# YieldStream App

[![CI](https://github.com/yieldstream-org/yieldstream-app/actions/workflows/ci.yml/badge.svg)](https://github.com/yieldstream-org/yieldstream-app/actions/workflows/ci.yml)
[![Deployed](https://img.shields.io/badge/live-yieldstream--protocol.vercel.app-5eead4)](https://yieldstream-protocol.vercel.app)
[![License](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue.svg)](#license)

[Contract](https://github.com/yieldstream-org/yieldstream-contract) · [SDK](https://github.com/yieldstream-org/yieldstream-sdk) · [Issues](https://github.com/yieldstream-org/yieldstream-app/issues)

</div>

Web interface for the [YieldStream
protocol](https://github.com/yieldstream-org/yieldstream-contract) — a
multi-tenant Merkle distributor on Stellar/Soroban.

Two surfaces:

- **Landing / protocol docs** — how the root-commit + proof-claim model works
- **Issuer dashboard + claim UI** — campaign creation (recipient CSV →
  Merkle root → escrow) and wallet-connected claims via Freighter

**Status:** the landing page is live at
[yieldstream-protocol.vercel.app](https://yieldstream-protocol.vercel.app),
auto-deployed on push to `main`. The dashboard is being
assembled from the tiered issue backlog and consumes
[`@yieldstream/sdk`](https://github.com/yieldstream-org/yieldstream-sdk) once its
hashing core lands.

## Development

```bash
npm install
npm run dev         # http://localhost:3000
npm run typecheck
npm run build
```

## Contributing

Pick a labeled issue in this repo (tiers 100/150/200), comment for
assignment, open a PR against `main`. CI runs typecheck + build. Client-side
hashing must stay byte-identical with the contract — conformance is enforced
through the vendored test vectors in the SDK repo.

## Documentation

- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Open issues](https://github.com/yieldstream-org/yieldstream-app/issues)

## Maintainers

| | |
|---|---|
| Owner / lead | [@CHASE3020](https://github.com/CHASE3020) |
| Triage | Applications and PRs answered within 48h, review within 5 days |
| Security | [Private disclosure](https://github.com/yieldstream-org/yieldstream-app/security/advisories/new) — see [SECURITY.md](SECURITY.md) |

## Contributors

<a href="https://contrib.rocks/image?repo=yieldstream-org/yieldstream-app">
<img src="https://contrib.rocks/image?repo=yieldstream-org/yieldstream-app" alt="Contributors" />
</a>

## License

Dual MIT / Apache-2.0, at your option.
