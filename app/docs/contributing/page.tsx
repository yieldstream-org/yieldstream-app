import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contributing",
  description:
    "How to pick up work across the three repos, what each tier is worth, and the standard a PR has to meet.",
};

export default function DocsContributing() {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Contributing</h1>

      <p>
        YieldStream is built as paid contributor work through the Drips Wave
        program. Every unit of remaining work is already written up as an issue
        with acceptance criteria — the backlog is the roadmap.
      </p>

      <h2>Where the work lives</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table>
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-4 py-2">Repo</th>
              <th className="px-4 py-2">Stack</th>
              <th className="px-4 py-2">Open work</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-xs">
            {[
              ["yieldstream-contract", "Rust / Soroban", "18 issues — proof bounds, storage redesign, admin controls, upgradeability"],
              ["yieldstream-sdk", "TypeScript", "6 issues — leaf hashing, tree builder, proof generation, contract clients"],
              ["yieldstream-app", "Next.js / Tailwind", "7 issues — dashboard, CSV upload, claim UI, wallet connection"],
            ].map(([repo, stack, work]) => (
              <tr key={repo}>
                <td className="px-4 py-2">
                  <a href={`https://github.com/yieldstream-org/${repo}`} className="font-mono text-accent">
                    {repo}
                  </a>
                </td>
                <td className="px-4 py-2 text-slate-400">{stack}</td>
                <td className="px-4 py-2 text-slate-300">{work}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Tiers</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Trivial (100)</strong> — label{" "}
          <a href="https://github.com/yieldstream-org/yieldstream-contract/labels/tier-100">
            <code>tier-100</code>
          </a>
          . A doc fix, one validation check, UI copy, a single test vector.
        </li>
        <li>
          <strong>Medium (150)</strong> — label{" "}
          <a href="https://github.com/yieldstream-org/yieldstream-contract/labels/tier-150">
            <code>tier-150</code>
          </a>
          . A bounded feature inside one module.
        </li>
        <li>
          <strong>High (200)</strong> — label{" "}
          <a href="https://github.com/yieldstream-org/yieldstream-contract/labels/tier-200">
            <code>tier-200</code>
          </a>
          . Storage redesign, cross-repo features, new subsystems.
        </li>
      </ul>

      <h2>Process</h2>
      <ol className="list-decimal space-y-1 pl-5 text-sm">
        <li>Read the issue. Its acceptance criteria are the definition of done.</li>
        <li>
          Comment to request assignment <em>before</em> writing code. Two people
          on one issue wastes a cycle.
        </li>
        <li>
          Branch, build, and open a PR against <code>main</code>. Stage specific
          files — not <code>git add .</code> — and use conventional commits (
          <code>feat(scope): description</code>).
        </li>
        <li>
          Cross-repo work: if your app change depends on an SDK function that
          does not exist yet, say so on the issue first. Shipping a frontend
          against an unbuilt dependency reads as a regression.
        </li>
      </ol>

      <h2>The bar</h2>
      <p>Required status checks must pass — these are enforced on <code>main</code>:</p>
      <pre>{`# contract
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test --workspace

# sdk and app
npm run typecheck
npm test          # sdk
npm run build     # app`}</pre>
      <p>
        Beyond the green checks, a review looks for: the RFC 6962 format
        preserved byte-for-byte, any storage change justified with a before and
        after ledger count, and no new claim in the docs that the code cannot
        back up.
      </p>

      <h2>Review time</h2>
      <p>
        Triage and first response within 48 hours; review within 5 days of the
        PR opening. If it stalls past that, ping on the PR — the maintainer
        commitment is written down precisely so you can hold it to it.
      </p>

      <h2>Good first picks</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/6">
            contract #6
          </a>{" "}
          — bound the Merkle proof loop to tree depth. Small, well-specified,
          and it closes a real cost-amplification path.
        </li>
        <li>
          <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/8">
            contract #8
          </a>{" "}
          — stop <code>sweep</code> from corrupting campaign stats.
        </li>
        <li>
          <a href="https://github.com/yieldstream-org/yieldstream-sdk/issues/1">
            sdk #1
          </a>{" "}
          — leaf hashing conformance. Un-skip the pinned suites and make them
          pass.
        </li>
      </ul>

      <h2>Security work</h2>
      <p>
        Do not open public issues for vulnerabilities. Use{" "}
        <a href="https://github.com/yieldstream-org/yieldstream-contract/security/advisories/new">
          private disclosure
        </a>
        . The contract is unaudited; if you are a security reviewer, that is the
        most valuable contribution of all and it is not on the backlog yet.
      </p>

      <h2>Conduct</h2>
      <p>
        Every repo in the org is covered by the same{" "}
        <a href="https://github.com/yieldstream-org/yieldstream-contract/blob/main/CODE_OF_CONDUCT.md">
          code of conduct
        </a>
        : reasons over verdicts, critique the code and not the person, and report
        concerns privately so you never have to confront anyone to resolve them.
      </p>
    </>
  );
}
