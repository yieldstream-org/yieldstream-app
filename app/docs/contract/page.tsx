import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contract reference — YieldStream docs",
  description:
    "Every public function on the YieldStream distributor: parameters, return types, auth requirements, events and error codes.",
};

const ADDR = "CC25WDHZ7SQC2UMZJHIPYM2U5ROYFXVDZMP3THMIL3IJY6HOCGGX2FPG";

export default function DocsContract() {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Contract reference</h1>

      <p>
        Contract: <code>YieldStreamDistributor</code> · source:{" "}
        <a href="https://github.com/yieldstream-org/yieldstream-contract/blob/main/contracts/distributor/src/lib.rs">
          contracts/distributor/src/lib.rs
        </a>{" "}
        · testnet: <code>{ADDR}</code>
      </p>

      <h2>Signatures</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table>
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-4 py-2">Function</th>
              <th className="px-4 py-2">Returns</th>
              <th className="px-4 py-2">Authorized by</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {[
              ["initialize(admin: Address)", "()", "admin"],
              ["create_distribution(creator, token, merkle_root, total_amount, num_recipients, end_time)", "u32 (new id)", "creator"],
              ["claim(distribution_id, index, recipient, amount, proof)", "()", "recipient"],
              ["cancel(distribution_id)", "()", "campaign creator"],
              ["sweep(distribution_id, to)", "i128 (swept)", "campaign creator"],
              ["get_distribution(distribution_id)", "Distribution", "— view"],
              ["is_claimed(distribution_id, index)", "bool", "— view"],
              ["get_distribution_count()", "u32", "— view"],
              ["get_admin()", "Address", "— view"],
              ["compute_leaf(distribution_id, index, recipient, amount)", "BytesN<32>", "— pure"],
              ["verify_proof(proof, root, leaf)", "bool", "— pure"],
            ].map(([sig, ret, auth]) => (
              <tr key={sig}>
                <td className="px-4 py-2 font-mono text-xs text-accent">{sig}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-300">{ret}</td>
                <td className="px-4 py-2 text-xs text-slate-400">{auth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Types</h2>
      <pre>{`struct Distribution {
  id:             u32
  creator:        Address
  token:          Address
  merkle_root:    BytesN<32>
  total_amount:   i128
  claimed_amount: i128
  num_recipients: u32
  claimed_count:  u32
  created_at:     u64   // ledger timestamp
  end_time:       u64   // 0 = no expiration
  status:         DistributionStatus
}

enum DistributionStatus { Active = 0, Cancelled = 1, Completed = 2, Expired = 3 }`}</pre>

      <h2>Write functions</h2>

      <h3>initialize(admin)</h3>
      <p>
        Stores the administrator address. Callable once; a second call returns{" "}
        <code>AlreadyInitialized</code>. The stored admin is readable by{" "}
        <code>get_admin</code> but is not consulted by any other function —
        there is no admin-only behaviour yet (
        <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/9">
          issue #9
        </a>
        ).
      </p>

      <h3>create_distribution(creator, token, merkle_root, total_amount, num_recipients, end_time) → u32</h3>
      <p>
        Allocates the next sequential id, pulls <code>total_amount</code> of{" "}
        <code>token</code> from <code>creator</code> into the contract, and
        writes an <code>Active</code> campaign record. Returns the new id.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li><code>total_amount</code> must be &gt; 0 → else <code>InvalidAmount</code></li>
        <li><code>num_recipients</code> must be &gt; 0 → else <code>InvalidRecipientCount</code></li>
        <li>
          <code>end_time</code> may be 0 (no expiry) or a future timestamp → a
          past value returns <code>InvalidEndTime</code>
        </li>
      </ul>
      <p>
        The contract does <strong>not</strong> verify that the root commits to{" "}
        <code>num_recipients</code> leaves, that allocations sum to{" "}
        <code>total_amount</code>, or that <code>token</code> is a real token
        contract. Those are issuer responsibilities today and the subject of{" "}
        <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/7">
          issue #7
        </a>
        . A root that under-commits the budget leaves tokens stranded; one that
        over-commits lets claims exceed escrow and later claimers get reverted
        transfers.
      </p>

      <h3>claim(distribution_id, index, recipient, amount, proof)</h3>
      <p>
        The core path. Checks run in this order, and the order is what you will
        debug against:
      </p>
      <ol className="list-decimal space-y-1 pl-5 text-sm">
        <li><code>recipient.require_auth()</code> — the claimer signs</li>
        <li>campaign must exist → <code>DistributionNotFound</code></li>
        <li><code>amount &gt; 0</code> → <code>InvalidAmount</code></li>
        <li>
          <code>index &lt; num_recipients</code> → <code>InvalidLeafIndex</code>
        </li>
        <li>leaf not already claimed → <code>AlreadyClaimed</code></li>
        <li>
          status not <code>Cancelled</code> → <code>DistributionCancelled</code>;
          status must be <code>Active</code> → <code>DistributionNotActive</code>
        </li>
        <li>
          <code>end_time == 0</code> or not yet passed →{" "}
          <code>DistributionExpired</code>
        </li>
        <li>
          recompute the leaf from the arguments and walk the proof to the root →{" "}
          <code>InvalidProof</code>
        </li>
      </ol>
      <p>
        On success it marks the leaf claimed, increments{" "}
        <code>claimed_amount</code> and <code>claimed_count</code>, flips status
        to <code>Completed</code> when every leaf or every token is accounted
        for, transfers <code>amount</code> to the recipient, and emits{" "}
        <code>claimed</code>.
      </p>
      <p>
        Note that <code>(distribution_id, index, recipient, amount)</code> is
        what the leaf commits to — the recipient cannot substitute a different{" "}
        <code>recipient</code> or <code>amount</code> than the issuer encoded,
        because the recomputed leaf would not reach the root.
      </p>

      <h3>cancel(distribution_id)</h3>
      <p>
        Creator-only. Requires status <code>Active</code>, sets{" "}
        <code>Cancelled</code>, and emits <code>cancel</code> with the remaining
        amount. It does <strong>not</strong> move tokens — recovery is a
        separate <code>sweep</code> call.
      </p>

      <h3>sweep(distribution_id, to) → i128</h3>
      <p>
        Creator-only. Allowed when the campaign is <code>Cancelled</code> or its{" "}
        <code>end_time</code> has passed; otherwise <code>DistributionNotExpired</code>
        . Transfers the remaining balance to <code>to</code> and returns the
        amount. Sweeping a <code>Completed</code> campaign, or one with nothing
        left, returns <code>NothingToSweep</code>.
      </p>
      <p>
        Known defect at this version: sweep writes{" "}
        <code>claimed_amount = total_amount</code>, so a campaign that was
        cancelled with 80% unclaimed reads back as 100% claimed. The tokens are
        correct; the reported statistics are not. Tracked as{" "}
        <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/8">
          issue #8
        </a>
        .
      </p>

      <h2>Events</h2>
      <p>
        Topics are short symbols; the campaign id and the acting address are in
        the topic list, the payload follows as data.
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table>
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-4 py-2">Topic</th>
              <th className="px-4 py-2">Topics</th>
              <th className="px-4 py-2">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {[
              ["created", "(\"created\", id, creator)", "(token, merkle_root, total_amount, end_time)"],
              ["claimed", "(\"claimed\", id, recipient)", "(index, amount)"],
              ["cancel", "(\"cancel\", id, creator)", "remaining_amount"],
              ["swept", "(\"swept\", id, creator)", "(to, swept_amount)"],
            ].map(([t, topics, data]) => (
              <tr key={t}>
                <td className="px-4 py-2 font-mono text-accent">{t}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-300">{topics}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-300">{data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Error codes</h2>
      <p>
        Returned as <code>ContractError</code> and surfaced on-chain as{" "}
        <code>Contract error #N</code> in transaction results.
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table>
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Raised when</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {[
              [1, "NotInitialized", "get_admin before initialize"],
              [2, "AlreadyInitialized", "second initialize call"],
              [3, "Unauthorized", "reserved — not currently raised"],
              [4, "InvalidAmount", "amount ≤ 0 on create or claim"],
              [5, "InvalidLeafIndex", "index ≥ num_recipients"],
              [6, "DistributionNotFound", "unknown campaign id"],
              [7, "DistributionNotActive", "status is not Active"],
              [8, "DistributionCancelled", "claim against a cancelled campaign"],
              [9, "DistributionExpired", "claim after end_time"],
              [10, "DistributionNotExpired", "sweep before cancel or expiry"],
              [11, "AlreadyClaimed", "leaf index already spent"],
              [12, "InvalidProof", "proof does not reach the root"],
              [13, "ArithmeticOverflow", "checked add/sub failed"],
              [14, "InvalidEndTime", "end_time in the past"],
              [15, "NothingToSweep", "completed, or zero remaining"],
              [16, "InvalidRecipientCount", "num_recipients == 0"],
              [17, "ZeroAddress", "reserved — not currently raised"],
            ].map(([n, name, when]) => (
              <tr key={n as number}>
                <td className="px-4 py-2 font-mono text-accent">{n}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-200">{name}</td>
                <td className="px-4 py-2 text-xs text-slate-400">{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        Codes 3 and 17 are defined but never returned by the current code — auth
        failures come from <code>require_auth</code> itself, not the error enum.
      </p>
    </>
  );
}
