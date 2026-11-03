# Security Policy

## Reporting a vulnerability

Report security issues in the YieldStream app **privately** via
[GitHub private vulnerability disclosure](https://github.com/yieldstream-org/yieldstream-app/security/advisories/new).
Please do not open a public issue.

## Scope

This is a client-side application. It holds no server secrets and no user
funds, but it sits between a wallet and a contract that escrows tokens, so the
interesting surfaces are:

- **Transaction construction** — a UI that lets an issuer commit the wrong root,
  the wrong budget, or the wrong deadline has real cost even though the contract
  behaves correctly
- **Wallet interaction** — connection handling, network mismatch
  (testnet vs. pubnet), and signature requests
- **Untrusted input** — recipient CSVs and Merkle proofs are attacker-controlled;
  anything rendered from them must not become an injection vector
- **Dependency surface** — lockfile integrity and pinned versions

## Audit status

The contract this app talks to is **not externally audited** and is deployed to
Stellar testnet only. The dashboard and claim flow are unimplemented; the live
site is the protocol landing page.

Do not point this frontend at mainnet funds.

## Response window

Acknowledge within 72 hours; ship a fix within 14 days for anything that can
mislead a user into signing a wrong transaction.
