import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Issuer guide — YieldStream docs",
  description:
    "Run a distribution campaign end to end: build the list, commit the root, fund escrow, let recipients claim, recover what is left.",
};

export default function DocsIssuer() {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Issuer guide</h1>

      <p>
        This is the path from a spreadsheet of wallets to tokens in them. It
        assumes you have a Stellar testnet account and a Soroban token to
        distribute. The dashboard that automates this is not built yet — today
        you drive the contract directly.
      </p>

      <h2>Worked example</h2>
      <p>
        Four recipients sharing 120,000 units. These are the pinned values from{" "}
        <a href="https://github.com/yieldstream-org/yieldstream-contract/blob/main/test-vectors/merkle_v1.json">
          <code>merkle_v1.json</code>
        </a>
        , so you can check your own tree math against them.
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table>
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-4 py-2">index</th>
              <th className="px-4 py-2">recipient</th>
              <th className="px-4 py-2">amount</th>
              <th className="px-4 py-2">proof steps</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {[
              ["0", "…MDR4", "10,000", "2"],
              ["1", "…OLZM", "25,000", "2"],
              ["2", "…RQG5", "35,000", "2"],
              ["3", "…TYON", "50,000", "2"],
            ].map((r) => (
              <tr key={r[0]}>
                <td className="px-4 py-2 font-mono text-accent">{r[0]}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-400">{r[1]}</td>
                <td className="px-4 py-2 text-slate-300">{r[2]}</td>
                <td className="px-4 py-2 text-slate-400">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">
        Allocations sum to 120,000 — exactly the escrow. The resulting root is{" "}
        <code>627e65c5…153a</code>. A 4-leaf tree gives a 2-step proof, which is
        log₂(4).
      </p>

      <h2>The steps</h2>

      <h3>1. Build the recipient list</h3>
      <p>
        Two columns: recipient address and amount. Decide the index for each row
        now and never reorder the file afterwards — the index is part of the
        leaf hash, so a reshuffled list invalidates every proof you already
        handed out.
      </p>

      <h3>2. Compute the Merkle root</h3>
      <p>
        Hash each row into a leaf, then fold pairs up to a single root. The
        exact format is on the{" "}
        <a href="/docs/mechanics">mechanics page</a>; the important part is that
        the leaf includes the <strong>campaign id</strong>, which you do not know
        until the campaign is created.
      </p>
      <p>
        This is the step with no turnkey tool today. <code>computeLeaf</code> and{" "}
        <code>buildTree</code> in the SDK are unimplemented (
        <a href="https://github.com/yieldstream-org/yieldstream-sdk/issues">
          sdk #1, #2
        </a>
        ). Two workable routes right now:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          call the contract&apos;s own <code>compute_leaf</code> view for each row
          and fold the pairs yourself — the contract is the reference
          implementation, so it cannot disagree with itself;
        </li>
        <li>
          implement the format in your own script against the pinned vectors and
          verify your output matches <code>merkle_v1.json</code> before touching
          a campaign.
        </li>
      </ul>

      <h3>3. Commit the root and fund escrow</h3>
      <p>
        Call <code>create_distribution</code> with your address, the token
        address, the root, the total, the recipient count, and a deadline. It
        transfers the tokens to the contract and returns the campaign id.
      </p>
      <p>
        Order matters: because the leaf hash commits to <code>distribution_id</code>
        , you must know the id before you can build proofs. The practical
        sequence is create the campaign first, read the id it returns, then build
        the tree and verify the root matches what you committed — or create it
        with a root you computed for a known next id. On a fresh contract the
        first campaign is id 1, which is why the vectors use 1 and 2.
      </p>

      <h3>4. Hand each recipient their proof</h3>
      <p>
        A recipient needs four things: the campaign id, their index, their
        amount, and their list of sibling hashes. They do not need the rest of
        the list, and you should not send it to them.
      </p>

      <h3>5. Claims happen on their schedule</h3>
      <p>
        Each claimer signs and pays their own transaction fee. You are not in the
        loop. Check progress with <code>get_distribution</code> —{" "}
        <code>claimed_count</code> and <code>claimed_amount</code> — or listen
        for <code>claimed</code> events.
      </p>

      <h3>6. Recover what nobody claimed</h3>
      <p>
        After the deadline passes, or immediately after you call{" "}
        <code>cancel</code>, call <code>sweep(distribution_id, to)</code>. It
        returns the remaining balance to the address you name — use a treasury
        address, not the creator&apos;s hot wallet.
      </p>

      <h2>Before you do this with real money</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>The contract is unaudited</strong> and deployed to testnet
          only. Treat mainnet use as unsupported.
        </li>
        <li>
          <strong>Verify your root against your list before funding.</strong>{" "}
          The contract will not check that allocations sum to your escrow. If
          they do not, you either strand tokens or reject legitimate claims.
        </li>
        <li>
          <strong>Keep the list and every proof.</strong> If you lose them,
          nobody can claim, and the funds become recoverable only by cancel and
          sweep.
        </li>
        <li>
          <strong>Set a deadline.</strong> <code>end_time = 0</code> means the
          campaign never expires on its own — the escrow sits until you cancel
          it.
        </li>
        <li>
          <strong>Read the stats with care.</strong> After a sweep,{" "}
          <code>claimed_amount</code> is written as the full total regardless of
          what was actually claimed (
          <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/8">
            issue #8
          </a>
          ). Count <code>claimed</code> events if you need true figures.
        </li>
      </ul>
    </>
  );
}
