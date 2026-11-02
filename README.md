# YieldStream App

Web interface for the [YieldStream
protocol](https://github.com/yieldstream-org/yieldstream-contract) — a
multi-tenant Merkle distributor on Stellar/Soroban.

Two surfaces:

- **Landing / protocol docs** — how the root-commit + proof-claim model works
- **Issuer dashboard + claim UI** — campaign creation (recipient CSV →
  Merkle root → escrow) and wallet-connected claims via Freighter

**Status:** the landing page is live-built here; the dashboard is being
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

## License

Dual MIT / Apache-2.0, at your option.
