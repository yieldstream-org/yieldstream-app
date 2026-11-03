import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yieldstream-protocol.vercel.app"),
  title: {
    default: "YieldStream — Merkle distribution protocol for Stellar",
    template: "%s — YieldStream docs",
  },
  description:
    "Distribute airdrops, yield, and contributor payouts to thousands of wallets on Stellar with one on-chain commitment and zero per-recipient transactions.",
  applicationName: "YieldStream",
  openGraph: {
    title: "YieldStream — Merkle distribution protocol for Stellar",
    description:
      "Airdrop to thousands. Commit 32 bytes. Multi-tenant Merkle distributor on Soroban — live on testnet.",
    type: "website",
    siteName: "YieldStream",
    url: "https://yieldstream-protocol.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "YieldStream — Merkle distribution protocol for Stellar",
    description:
      "Airdrop to thousands. Commit 32 bytes. Multi-tenant Merkle distributor on Soroban — live on testnet.",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
