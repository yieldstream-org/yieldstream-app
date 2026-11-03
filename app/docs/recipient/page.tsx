import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipient guide — YieldStream docs",
  description:
    "You were told you have a claim. What that means and how to take it, in plain language.",
};

export default function DocsRecipient() {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Recipient guide</h1>

      <p>
        Someone running a distribution — a project, a DAO, a protocol — included
        your Stellar address in their recipient list. This page explains what
        happens next.
      </p>

      <h2>What you should have received</h2>
      <p>
        Four values. If the sender gave you a claim link, they have handled
        these for you; if they sent you details to enter yourself, you need all
        four:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Campaign id</strong> — a number identifying which distribution
          you are claiming from.
        </li>
        <li>
          <strong>Your index</strong> — your position in their list. Yours alone;
          you do not need anyone else&apos;s.
        </li>
        <li>
          <strong>Your amount</strong> — how many tokens, and how many decimal
          places the token uses. 10,000 units of a token with 7 decimals is 1
          token.
        </li>
        <li>
          <strong>Your proof</strong> — a short list of hashes. Roughly 14 for a
          10,000-person campaign.
        </li>
      </ul>

      <h2>What happens when you claim</h2>
      <ol className="list-decimal space-y-1 pl-5 text-sm">
        <li>Your wallet signs one transaction.</li>
        <li>
          The contract recomputes your leaf from your address, index, and amount,
          and checks that your proof leads to the root the issuer committed.
        </li>
        <li>
          If it matches, tokens move from escrow to your address, and your index
          is marked spent.
        </li>
      </ol>
      <p>
        You pay your own transaction fee. The issuer is not involved and cannot
        block an individual claim once the campaign is open.
      </p>

      <h2>Why your address is part of the math</h2>
      <p>
        The proof commits to your specific address and amount. You cannot change
        the destination to a different wallet, and nobody else can submit your
        proof for their own address — the recomputed leaf would not match the
        root. If you want the tokens to land somewhere other than the address you
        were given, that address has to be the one that signs the claim.
      </p>

      <h2>Common rejections and what they mean</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table>
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-4 py-2">You see</th>
              <th className="px-4 py-2">It means</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {[
              ["AlreadyClaimed (#11)", "This index was already used. If that was not you, the sender handed out a duplicate proof — ask them."],
              ["InvalidProof (#12)", "One of the four values does not match what the issuer committed. Usually a wrong amount or a stale index after the list was edited."],
              ["DistributionExpired (#9)", "The deadline passed. The issuer can still sweep the rest; your window is closed."],
              ["DistributionCancelled (#8)", "The issuer stopped the campaign."],
              ["DistributionNotFound (#6)", "Wrong campaign id, or the contract you are talking to is not the one the campaign lives on."],
            ].map(([see, means]) => (
              <tr key={see}>
                <td className="px-4 py-2 font-mono text-xs text-accent">{see}</td>
                <td className="px-4 py-2 text-xs text-slate-400">{means}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Check for a claim without a dashboard</h2>
      <p>
        The claim UI is not built. Until it is, verification is a read call:{" "}
        <code>is_claimed(campaign_id, your_index)</code> returns whether your
        slot is spent, and <code>get_distribution(campaign_id)</code> shows the
        status, deadline, and how much has been claimed.
      </p>

      <h2>Two things to be careful about</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Network.</strong> Everything live today is on Stellar{" "}
          <em>testnet</em>. A claim pointed at pubnet will fail, and a sender
          asking you to claim real tokens on a contract that is only deployed to
          testnet is a red flag.
        </li>
        <li>
          <strong>The contract is unaudited.</strong> Claims move tokens from
          escrow, and the code is public — but no external firm has reviewed it.
          Treat large or high-stakes distributions accordingly.
        </li>
      </ul>
    </>
  );
}
