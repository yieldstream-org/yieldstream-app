import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "What YieldStream does, the problem it solves on Stellar, and what is actually built today.",
};

export default function DocsIntro() {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Introduction</h1>

      <p>
        YieldStream is a token distribution contract for Stellar&apos;s Soroban
        virtual machine. A project uses it to pay many wallets from one pool of
        tokens without sending a transaction per wallet.
      </p>

      <h2>The problem</h2>
      <p>
        Say a protocol owes 10,000 people a payout — an airdrop, retroactive
        yield, a contributor round. The direct approach is a loop of transfers.
        That means:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>the issuer funds and signs 10,000 transactions;</li>
        <li>the full recipient roster becomes on-chain data;</li>
        <li>the issuer pays in full up front, whether or not anyone claims;</li>
        <li>unclaimed balances become a manual reconciliation task.</li>
      </ul>

      <h2>The mechanism</h2>
      <p>
        YieldStream moves the list off-chain and keeps only a commitment on
        chain. The issuer hashes their recipient list into a Merkle tree and
        publishes the single 32-byte root. Each recipient then proves they are
        in that list by submitting a short path of sibling hashes — 14 hashes
        for a 10,000-person list — and the contract checks the path against the
        stored root and pays out.
      </p>
      <p>
        The issuer commits once. Recipients pay for their own claims. Tokens
        nobody claims sweep back to the issuer after the campaign ends, in one
        call.
      </p>

      <h2>What is real today</h2>
      <p>
        Stated plainly, because the rest of these docs assume it:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Contract:</strong> complete and deployed to Stellar testnet at{" "}
          <code>CC25…2FPG</code>. 21 tests pass, CI runs <code>cargo fmt
          --check</code>, <code>clippy -D warnings</code>, the test suite, and a
          WASM build on every push. <strong>It has not been externally
          audited.</strong> Do not custody mainnet funds with it.
        </li>
        <li>
          <strong>SDK:</strong> scaffold. The leaf-hashing and tree-building
          functions throw — that is deliberate, tracked as{" "}
          <a href="https://github.com/yieldstream-org/yieldstream-sdk/issues">
            sdk issues #1 and #2
          </a>
          , and the acceptance criteria are written as skipped conformance tests
          against the contract&apos;s pinned vectors.
        </li>
        <li>
          <strong>App:</strong> this landing page and docs. The issuer dashboard
          and claim UI are open contributor work.
        </li>
        <li>
          <strong>Mainnet:</strong> not deployed.
        </li>
      </ul>

      <h2>Ledger footprint, honestly</h2>
      <p>
        A common pitch for Merkle distributors is that they remove on-chain
        storage entirely. That is not true here, and the docs won&apos;t pretend
        otherwise. What the contract stores today:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>one persistent entry per campaign (root, budget, counters, status);</li>
        <li>
          one persistent entry per <em>claimed</em> leaf — so a fully claimed
          10,000-person campaign currently occupies about 10,000 entries.
        </li>
      </ul>
      <p>
        The recipient list itself never lands on the ledger, and unclaimed
        recipients cost nothing. Claimed-state packing into 256-leaf bitmaps
        (≈40 entries for 10,000 claims) is{" "}
        <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/13">
          open issue #13
        </a>
        , and it is the highest-impact item in the backlog.
      </p>

      <h2>Where to go next</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <a href="/docs/mechanics">Protocol mechanics</a> — hashing format,
          proof verification, lifecycle, storage and TTL.
        </li>
        <li>
          <a href="/docs/contract">Contract reference</a> — every function,
          parameter, auth requirement, event and error code.
        </li>
        <li>
          <a href="/docs/developer">Developer guide</a> — building against it.
        </li>
      </ul>
    </>
  );
}
