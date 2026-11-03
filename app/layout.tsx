import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YieldStream — Merkle distribution protocol for Stellar",
  description:
    "Distribute airdrops, yield, and contributor payouts to thousands of wallets on Stellar with one on-chain commitment and zero per-recipient transactions.",
  applicationName: "YieldStream",
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
