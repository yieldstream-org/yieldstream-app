import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protocol mechanics",
  description:
    "Leaf and node hashing, proof verification, campaign lifecycle, storage layout and TTL policy.",
};

export default function DocsMechanics() {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Protocol mechanics</h1>

      <h2>Leaf hashing</h2>
      <p>
        Every allocation is committed as one leaf. The hash binds four values
        together so a proof cannot be replayed across campaigns, positions, or
        amounts:
      </p>
      <pre>{`leaf = SHA256( 0x00
       || XDR(distribution_id)
       || XDR(index)
       || XDR(recipient)
       || XDR(amount) )`}</pre>
      <p>
        <code>distribution_id</code> is <code>u32</code>, <code>index</code> is{" "}
        <code>u32</code>, <code>recipient</code> is an <code>Address</code>, and{" "}
        <code>amount</code> is <code>i128</code> — all XDR-encoded by
        Soroban&apos;s <code>ToXdr</code>, not hand-rolled bytes. Including the
        campaign id means a leaf built for campaign 7 is invalid in campaign 8
        even with an identical address and amount.
      </p>

      <h3>Why the 0x00 prefix</h3>
      <p>
        It is RFC 6962 domain separation. Without a distinct prefix, a leaf hash
        and an interior node hash share the same shape, so a tree where an
        interior node happens to equal a leaf value allows a second-preimage
        attack: a &quot;proof&quot; for one structure verifies against another.
        Leaves are prefixed <code>0x00</code>, nodes <code>0x01</code>, and the
        two can never be confused.
      </p>

      <h2>Node hashing</h2>
      <pre>{`node = SHA256( 0x01 || min(a, b) || max(a, b) )`}</pre>
      <p>
        Siblings are sorted lexicographically before hashing. Two consequences:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          a proof is a flat list of 32-byte hashes with no left/right direction
          flags, so there is no direction bit to lie about;
        </li>
        <li>
          swapping a sibling pair cannot produce a different root — the classic
          malleability attack on naive Merkle trees.
        </li>
      </ul>

      <h2>Proof verification</h2>
      <pre>{`current = leaf
for sibling in proof:
    current = node(current, sibling)
return current == root`}</pre>
      <p>
        Verification is <code>O(log n)</code> hashes with no tree stored on
        chain. A recipient claiming from a 10,000-leaf tree submits 14 hashes —
        448 bytes of proof data.
      </p>
      <p>
        One caveat worth knowing before you build a client: the loop is
        currently unbounded, so a caller can pass an arbitrarily long proof and
        the contract will hash all of it before comparing to the root. That is
        tracked as{" "}
        <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/6">
          issue #6
        </a>
        . A correct implementation should reject proofs longer than the tree
        depth implied by <code>num_recipients</code>.
      </p>

      <h2>Campaign lifecycle</h2>
      <p>
        A campaign is a <code>Distribution</code> record with a status field.
        The transitions:
      </p>
      <pre>{`                  ┌──────────────────────┐
                  │  Active (0)          │
                  │  accepting claims    │
                  └───┬────────┬─────┬───┘
        all claimed   │        │     │  creator calls cancel
        OR budget     ▼        │     ▼
        exhausted  Completed   │   Cancelled (1)
             (2)               │      │
             ▲                 │      │ creator calls sweep
             │  end_time       │      ▼
             │  passed +       │   Completed (2)
             │  sweep          │
        Expired (3) ◄──────────
        (time-gated; claims rejected)`}</pre>
      <p>
        Note that <code>Expired</code> is not written by a timer — there is no
        cron on a ledger. Expiry is evaluated on read: <code>claim</code>{" "}
        rejects when <code>end_time &gt; 0</code> and the ledger timestamp has
        passed, and <code>sweep</code> allows recovery under the same test.
        A campaign past its deadline sits in <code>Active</code> until someone
        calls <code>sweep</code>.
      </p>
      <p>
        <code>end_time == 0</code> means no expiration. Such a campaign can only
        be closed by <code>cancel</code> then <code>sweep</code>.
      </p>

      <h2>Storage layout</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table>
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-4 py-2">Key</th>
              <th className="px-4 py-2">Scope</th>
              <th className="px-4 py-2">Contents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            <tr>
              <td className="px-4 py-2 font-mono text-accent">Admin</td>
              <td className="px-4 py-2">instance</td>
              <td className="px-4 py-2">administrator <code>Address</code></td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-accent">DistributionCount</td>
              <td className="px-4 py-2">instance</td>
              <td className="px-4 py-2">
                <code>u32</code> auto-incrementing campaign id
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-accent">Distribution(id)</td>
              <td className="px-4 py-2">persistent</td>
              <td className="px-4 py-2">full campaign record</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-accent">Claimed(id, index)</td>
              <td className="px-4 py-2">persistent</td>
              <td className="px-4 py-2">
                one entry per claimed leaf — see{" "}
                <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/13">
                  issue #13
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>TTL policy</h3>
      <p>
        Stellar ledger entries expire unless their time-to-live is extended.
        Soroban measures TTL in ledgers, roughly 5 seconds each, so 17,280
        ledgers ≈ 1 day. The contract bumps on access:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>instance</strong> — extended toward 30 days once it falls
          below a 29-day threshold;
        </li>
        <li>
          <strong>persistent</strong> — campaign and claimed records extended
          toward 120 days once below a 90-day threshold.
        </li>
      </ul>
      <p>
        The gap that matters: a campaign record is bumped whenever anyone reads
        it, but a <code>Claimed</code> entry is only touched by its own leaf
        index. If a campaign sits untouched past its TTL window, records can
        expire and rent reclaim. That is{" "}
        <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/14">
          issue #14
        </a>
        , and it is a fund-orphaning risk, not a cosmetic one.
      </p>

      <h2>Multi-tenancy</h2>
      <p>
        One deployed contract serves every issuer. Campaigns are namespaced by
        the auto-incremented <code>id</code>, each carries its own token
        address, root, budget, and deadline, and escrowed tokens sit under the
        contract address per campaign. No tenant writes another tenant&apos;s
        keys — the <code>Claimed</code> and <code>Distribution</code> keys both
        take the campaign id as their first component.
      </p>
      <p>
        The tradeoff: because the leaf hash includes <code>distribution_id</code>
        , proofs are not portable between campaigns. Re-running a list as a new
        campaign means rebuilding the tree.
      </p>

      <h2>What the contract does not do</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>No pause switch.</strong> <code>Admin</code> is stored and
          readable but no function checks it. The admin cannot halt claims. See{" "}
          <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/9">
            issue #9
          </a>
          .
        </li>
        <li>
          <strong>Soroban tokens only.</strong> Transfers go through{" "}
          <code>token::Client</code>, which speaks the Soroban token interface.
          Classic Stellar assets are not supported.
        </li>
        <li>
          <strong>No upgradeability.</strong> The WASM is not versioned or
          upgradable in this contract.
        </li>
      </ul>
    </>
  );
}
