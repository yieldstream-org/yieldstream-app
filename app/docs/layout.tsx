import Link from "next/link";
import Logo from "../../components/logo";

const SECTIONS = [
  ["/docs", "Introduction"],
  ["/docs/mechanics", "Protocol mechanics"],
  ["/docs/contract", "Contract reference"],
  ["/docs/issuer", "Issuer guide"],
  ["/docs/recipient", "Recipient guide"],
  ["/docs/developer", "Developer guide"],
  ["/docs/contributing", "Contributing"],
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24">
      <header className="flex items-center justify-between border-b border-slate-800 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            docs
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-ink transition hover:bg-accent-dim"
        >
          Launch app
        </Link>
      </header>

      <div className="mt-8 grid gap-10 md:grid-cols-[190px_1fr]">
        <nav className="md:sticky md:top-8 md:self-start">
          <ul className="space-y-1 text-sm">
            {SECTIONS.map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block rounded-md px-3 py-1.5 text-slate-400 transition hover:bg-slate-900 hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="min-w-0 max-w-3xl space-y-6 text-slate-300 [& a]:text-accent [& a]:underline-offset-4 [& a]:hover:underline [&_code]:rounded [&_code]:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-accent [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-white [&_li]:text-sm [&_li]:leading-relaxed [&_p]:text-sm [&_p]:leading-relaxed [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-slate-800 [&_pre]:bg-slate-900/70 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:text-slate-300 [&_table]:w-full [&_table]:text-left [&_table]:text-sm">{children}</article>
      </div>
    </main>
  );
}
