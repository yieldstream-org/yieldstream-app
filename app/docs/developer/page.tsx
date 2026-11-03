import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer guide",
  description:
    "Local toolchain, contract addresses, calling the distributor from TypeScript, the leaf format, and the test vectors that define correctness.",
};

export default function DocsDeveloper() {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Developer guide</h1>

      <h2>Prerequisites</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Rust 1.84 or newer (<code>rustup</code>)</li>
        <li>WASM target: <code>rustup target add wasm32v1-none</code></li>
        <li>Stellar CLI v22 or newer</li>
        <li>Node 20+ for the SDK and app</li>
      </ul>

      <h2>Addresses and links</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table>
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-4 py-2">What</th>
              <th className="px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-xs">
            <tr>
              <td className="px-4 py-2">Distributor, testnet</td>
              <td className="px-4 py-2 font-mono text-accent">
                CC25WDHZ7SQC2UMZJHIPYM2U5ROYFXVDZMP3THMIL3IJY6HOCGGX2FPG
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">Distributor, pubnet</td>
              <td className="px-4 py-2 text-slate-500">not deployed</td>
            </tr>
            <tr>
              <td className="px-4 py-2">WASM artifact</td>
              <td className="px-4 py-2 font-mono text-slate-400">
                target/wasm32v1-none/release/yieldstream_distributor.wasm
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">Test vectors</td>
              <td className="px-4 py-2 font-mono text-slate-400">
                test-vectors/merkle_v1.json
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Build and test</h2>
      <pre>{`cd yieldstream-contract
cargo test                 # 21 tests
stellar contract build     # optimized WASM`}</pre>

      <h2>Deploy to testnet</h2>
      <pre>{`stellar keys generate --network testnet --fund
stellar contract deploy \\
  --network testnet \\
  --source-account <IDENTITY> \\
  --wasm target/wasm32v1-none/release/yieldstream_distributor.wasm

stellar contract invoke \\
  --network testnet --source-account <IDENTITY> \\
  --id <CONTRACT> \\
  -- initialize --admin <ADDRESS>`}</pre>
      <p>
        <code>--source-account</code> selects the signing identity. The short
        flag <code>-i</code> means <code>--ignore-checks</code>, not identity —
        mixing them up is a fast way to submit the wrong payload.
      </p>

      <h2>The leaf format, precisely</h2>
      <pre>{`leaf = SHA256( 0x00
       || XDR(distribution_id : u32)
       || XDR(index           : u32)
       || XDR(recipient       : Address)
       || XDR(amount          : i128) )

node = SHA256( 0x01 || min(a,b) || max(a,b) )`}</pre>
      <p>
        Three details that break implementations when guessed:
      </p>
      <ol className="list-decimal space-y-1 pl-5 text-sm">
        <li>
          <strong>XDR, not raw bytes.</strong> <code>u32</code> is 4 big-endian
          bytes. <code>i128</code> is 16 big-endian bytes. <code>Address</code>{" "}
          is the ScVal account form with a 32-byte payload and its discriminating
          prefix — not the base-32 <code>G…</code>/<code>C…</code> string.
        </li>
        <li>
          <strong>Field order is fixed</strong> as written above. Any permutation
          gives a different root.
        </li>
        <li>
          <strong>Siblings are sorted before hashing</strong>, so a proof needs
          no direction flags.
        </li>
      </ol>

      <h2>Conformance: the vectors are the spec</h2>
      <p>
        <code>merkle_v1.json</code> pins two trees — a 4-leaf campaign (id 1,
        120,000 total, root <code>627e65c5…153a</code>) and a 2-leaf campaign (id
        2, 1,250,000 total, root <code>8d5de42b…c8ff</code>) — with every leaf
        hash and proof path. Any client that disagrees with these files is wrong,
        regardless of how reasonable its own output looks.
      </p>
      <p>
        The Rust test suite regenerates and re-verifies them,{" "}
        <a href="https://github.com/yieldstream-org/yieldstream-sdk/blob/main/src/conformance.test.ts">
          the SDK&apos;s skipped suites
        </a>{" "}
        are the acceptance criteria for whoever implements the hashing core.
      </p>

      <h2>Calling from TypeScript</h2>
      <p>
        The SDK does not do this yet. The shape of a claim call against the
        deployed contract, using <code>@stellar/sdk</code> and a Freighter
        signer:
      </p>
      <pre>{`import { Contract, SorobanRpc, xdr } from "@stellar/sdk";

const contract = new Contract(CONTRACT_ID);

const proof = proofHexList.map((h) =>
  xdr.ScVal.scvBytes(Buffer.from(h, "hex"))
);

const tx = await contract.call(
  "claim",
  xdr.ScVal.scvU32(distributionId),
  xdr.ScVal.scvU32(index),
  Address.fromString(recipient).toScVal(),
  xdr.ScVal.scvI128(amount),
  xdr.ScVal.scvVec(proof),
);`}</pre>
      <p>
        <code>BytesN&lt;32&gt;</code> arguments — the root and each proof element
        — arrive as <code>scvBytes</code>, and hex passed on the CLI must have no{" "}
        <code>0x</code> prefix. <code>Vec</code> arguments are JSON arrays of hex
        strings when you go through the CLI.
      </p>

      <h2>Reading state</h2>
      <pre>{`get_distribution(id)      -> Distribution
is_claimed(id, index)     -> bool
get_distribution_count()  -> u32
get_admin()               -> Address`}</pre>

      <h2>Environment variables for this app</h2>
      <p>
        None are required today — the landing page and docs are static. The
        dashboard, when built, will need at minimum the contract id and network
        passphrase; those will be named in its issue rather than guessed here.
      </p>

      <h2>Known traps in the current contract</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <code>sweep</code> overwrites <code>claimed_amount</code> with{" "}
          <code>total_amount</code> — count <code>claimed</code> events for real
          figures (
          <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/8">
            #8
          </a>
          ).
        </li>
        <li>
          proof length is not bounded against tree depth (
          <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/6">
            #6
          </a>
          ).
        </li>
        <li>
          campaign stats are not validated against the root at creation (
          <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/7">
            #7
          </a>
          ).
        </li>
        <li>
          persistent TTLs are only bumped on touched keys (
          <a href="https://github.com/yieldstream-org/yieldstream-contract/issues/14">
            #14
          </a>
          ).
        </li>
      </ul>
    </>
  );
}
