import Link from "next/link";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#why", label: "Why it's cheap" },
  { href: "#interface", label: "Interface" },
  { href: "#build", label: "Contribute" },
];

const STEPS = [
  {
    n: "01",
    title: "Build the tree off-chain",
    body: "Compile your recipient list (address + amount) into a Merkle tree. One pass, any size — 10 or 100,000 recipients.",
  },
  {
    n: "02",
    title: "Commit one 32-byte root",
    body: "Publish just the root hash on-chain with your campaign budget and deadline. No recipient list is ever stored per-campaign in the ledger.",
  },
  {
    n: "03",
    title: "Fund the escrow",
    body: "The contract custody-locks your token pool. Multi-tenant by design: every project runs independent campaigns on one deployed contract.",
  },
  {
    n: "04",
    title: "Recipients claim with proofs",
    body: "Each claimer submits a tiny inclusion proof from their browser. The contract verifies it against the root and pays out — then unclaimed funds sweep back to you after expiry.",
  },
];

const INTERFACE = [
  ["initialize", "admin auth", "Set the contract administrator."],
  ["create_distribution", "creator auth", "Commit root, budget, recipients count, deadline; escrow funds."],
  ["claim", "recipient auth", "Verify inclusion proof; transfer allocation."],
  ["cancel", "creator auth", "Halt claims on an active campaign."],
  ["sweep", "creator auth", "Recover unclaimed funds after expiry or cancellation."],
  ["get_distribution / is_claimed", "view", "Read campaign state and claim status."],
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            Yield<span className="text-accent">Stream</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-slate-500 sm:inline">
            Soroban / Stellar
          </span>
        </div>
        <nav className="hidden gap-6 text-sm text-slate-400 md:flex">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-accent">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex gap-3 text-sm">
          <Link
            href="https://github.com/CHASE3020/yieldstream-contract"
            className="rounded-md border border-slate-700 px-3 py-1.5 text-slate-300 hover:border-accent hover:text-accent"
          >
            GitHub
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md bg-accent px-3 py-1.5 font-semibold text-ink hover:bg-accent-dim"
          >
            Launch app
          </Link>
        </div>
      </header>

      <section className="pt-16 pb-20 text-center md:text-left">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Token distribution protocol
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white md:mx-0 md:text-6xl">
          Airdrop to thousands.
          <br />
          <span className="text-accent">Commit 32 bytes.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 md:mx-0">
          YieldStream is a multi-tenant Merkle distributor for Stellar
          Soroban. Issuers lock a recipient list into one root hash, the
          contract escrows the pool, and every recipient claims with a
          cryptographic proof — no per-recipient transactions, no ledger bloat.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
          <Link
            href="/dashboard"
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-ink transition hover:bg-accent-dim"
          >
            Create a distribution
          </Link>
          <a
            href="#how"
            className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-accent hover:text-accent"
          >
            See how it works
          </a>
        </div>
        <p className="mt-8 font-mono text-xs text-slate-600">
          RFC 6962 domain separation · sorted-pair proofs · dual
          MIT/Apache-2.0 · 21 tests + pinned vectors
        </p>
      </section>

      <section id="how" className="scroll-mt-16">
        <h2 className="text-2xl font-bold text-white">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <span className="font-mono text-xs text-accent">{s.n}</span>
              <h3 className="mt-2 font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="mt-20">
        <h2 className="text-2xl font-bold text-white">Why it&apos;s cheap</h2>
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="px-6 py-3">Naive batch send</th>
                <th className="px-6 py-3">YieldStream claims</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-slate-400">
              <tr>
                <td className="px-6 py-3">
                  Issuer pays N transactions for N recipients.
                </td>
                <td className="px-6 py-3">
                  Issuer pays for 1 root commit; each claimer pays their own
                  claim.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3">
                  Full recipient list lives in the ledger.
                </td>
                <td className="px-6 py-3">
                  Recipients never touch the ledger until they claim; the
                  list stays off-chain.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3">
                  Unclaimed funds need manual reconciliation.
                </td>
                <td className="px-6 py-3">
                  Expired campaigns sweep back to the treasury in one call.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="interface" className="mt-20">
        <h2 className="text-2xl font-bold text-white">Contract interface</h2>
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="px-6 py-3">Entry point</th>
                <th className="px-6 py-3">Auth</th>
                <th className="px-6 py-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {INTERFACE.map(([fn, auth, desc]) => (
                <tr key={fn}>
                  <td className="px-6 py-3 font-mono text-accent">{fn}</td>
                  <td className="px-6 py-3 text-slate-400">{auth}</td>
                  <td className="px-6 py-3 text-slate-300">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="build" className="mt-20 rounded-2xl border border-accent/30 bg-accent/5 p-8">
        <h2 className="text-2xl font-bold text-white">
          Built in the open — funded by the wave
        </h2>
        <p className="mt-3 max-w-3xl text-slate-300">
          YieldStream is maintained as a three-repo system: the{" "}
          <a
            className="text-accent underline-offset-4 hover:underline"
            href="https://github.com/CHASE3020/yieldstream-contract"
          >
            Soroban contract
          </a>
          , this app, and a{" "}
          <a
            className="text-accent underline-offset-4 hover:underline"
            href="https://github.com/CHASE3020/yieldstream-sdk"
          >
            TypeScript SDK
          </a>
          . The protocol roadmap ships as tiered contributor issues — pick one,
          ship it, earn on the Drips Wave.
        </p>
        <a
          href="https://github.com/CHASE3020/yieldstream-contract/issues"
          className="mt-6 inline-block rounded-lg border border-accent px-5 py-2.5 font-semibold text-accent transition hover:bg-accent hover:text-ink"
        >
          Browse the issue backlog
        </a>
      </section>

      <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500">
        <span>© 2026 YieldStream Contributors · MIT OR Apache-2.0</span>
        <span className="font-mono text-xs">
          leaf = SHA256(0x00 ‖ XDR(id) ‖ XDR(index) ‖ XDR(recipient) ‖
          XDR(amount))
        </span>
      </footer>
    </main>
  );
}
