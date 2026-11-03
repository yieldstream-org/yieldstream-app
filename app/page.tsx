import Link from "next/link";
import Logo from "../components/logo";
import HeroDiagram from "../components/hero-diagram";

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

const STATS = [
  { value: "32 bytes", label: "committed on-chain per campaign" },
  { value: "log₂N", label: "proof size — 14 hashes for 10,000 recipients" },
  { value: "21", label: "contract tests + pinned vectors" },
  { value: "LIVE", label: "deployed & audited on testnet" },
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
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-slate-500 sm:inline">
            Soroban / Stellar
          </span>
        </div>
        <nav className="hidden gap-6 text-sm text-slate-400 md:flex">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-accent">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex gap-3 text-sm">
          <Link
            href="https://github.com/yieldstream-org/yieldstream-contract"
            className="rounded-md border border-slate-700 px-3 py-1.5 text-slate-300 transition hover:border-accent hover:text-accent"
          >
            GitHub
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md bg-accent px-3 py-1.5 font-semibold text-ink transition hover:bg-accent-dim"
          >
            Launch app
          </Link>
        </div>
      </header>

      <section className="grid items-center gap-12 pt-16 pb-20 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Token distribution protocol
          </p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Airdrop to thousands.
            <br />
            <span className="text-accent">Commit 32 bytes.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            YieldStream is a multi-tenant Merkle distributor for Stellar
            Soroban. Issuers lock a recipient list into one root hash, the
            contract escrows the pool, and every recipient claims with a
            cryptographic proof — no per-recipient transactions, no ledger
            bloat.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
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
            MIT/Apache-2.0
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <HeroDiagram />
        </div>
      </section>

      <section className="grid gap-px overflow-hidden rounded-xl border border-slate-800 bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.value} className="bg-slate-900/70 p-6 text-center">
            <p className="font-mono text-2xl font-bold text-accent">{s.value}</p>
            <p className="mt-1 text-xs leading-snug text-slate-400">{s.label}</p>
          </div>
        ))}
      </section>

      <section id="how" className="mt-24 scroll-mt-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          The mechanism
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-accent/40"
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

      <section id="why" className="mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          The math
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">Why it&apos;s cheap</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [
              "Issuer pays once",
              "A naive batch send costs N transactions for N recipients. YieldStream commits one root; each claimer pays for their own claim.",
            ],
            [
              "List never touches the ledger",
              "Recipients stay off-chain until they claim. A 10,000-person campaign stores one root and a claim bitmap — not 10,000 records.",
            ],
            [
              "Nothing is stranded",
              "Unclaimed funds aren't a reconciliation chore: after expiry or cancellation, one sweep call returns the remainder to your treasury.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/30 p-6 transition hover:border-accent/40"
            >
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="interface" className="mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          For builders
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">Contract interface</h2>
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
                <tr key={fn} className="transition hover:bg-slate-800/40">
                  <td className="px-6 py-3 font-mono text-accent">{fn}</td>
                  <td className="px-6 py-3 text-slate-400">{auth}</td>
                  <td className="px-6 py-3 text-slate-300">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        id="build"
        className="mt-24 rounded-2xl border border-accent/30 bg-accent/5 p-8"
      >
        <h2 className="text-2xl font-bold text-white">
          Built in the open — funded by the wave
        </h2>
        <p className="mt-3 max-w-3xl text-slate-300">
          YieldStream is maintained as a three-repo system: the{" "}
          <a
            className="text-accent underline-offset-4 hover:underline"
            href="https://github.com/yieldstream-org/yieldstream-contract"
          >
            Soroban contract
          </a>
          , this app, and a{" "}
          <a
            className="text-accent underline-offset-4 hover:underline"
            href="https://github.com/yieldstream-org/yieldstream-sdk"
          >
            TypeScript SDK
          </a>
          . The roadmap ships as 31 tiered contributor issues — from a
          256-leaf claim bitmap that shrinks 10,000 ledger entries to about
          40, up to threshold-signature custody. Pick one, ship it, earn on
          the Drips Wave.
        </p>
        <a
          href="https://github.com/yieldstream-org/yieldstream-contract/issues"
          className="mt-6 inline-block rounded-lg border border-accent px-5 py-2.5 font-semibold text-accent transition hover:bg-accent hover:text-ink"
        >
          Browse the issue backlog
        </a>
      </section>

      <footer className="mt-24 border-t border-slate-800 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <Logo compact />
            <span>© 2026 YieldStream Contributors · MIT OR Apache-2.0</span>
          </div>
          <span className="font-mono text-xs">
            contract CC25…2FPG · testnet
          </span>
        </div>
        <p className="mt-4 font-mono text-xs text-slate-600">
          leaf = SHA256(0x00 ‖ XDR(id) ‖ XDR(index) ‖ XDR(recipient) ‖
          XDR(amount))
        </p>
      </footer>
    </main>
  );
}
