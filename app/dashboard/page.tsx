export default function Dashboard() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
        Issuer dashboard
      </p>
      <h1 className="text-3xl font-bold text-white">Under active development</h1>
      <p className="max-w-xl leading-relaxed text-slate-400">
        The dashboard is being rebuilt as part of the open contributor
        backlog: wallet connect, recipient CSV → Merkle tree upload, campaign
        escrow, and the proof-based claim UI. Pick up a task and ship it with
        us.
      </p>
      <a
        href="https://github.com/yieldstream-org/yieldstream-app/issues"
        className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-ink hover:bg-accent-dim"
      >
        View open issues
      </a>
      <a href="/" className="text-sm text-slate-500 hover:text-accent">
        ← Back to protocol overview
      </a>
    </main>
  );
}
