export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 64 64"
        className="h-8 w-8"
        aria-hidden="true"
      >
        <g stroke="#5eead4" strokeWidth="3" strokeLinecap="round">
          <line x1="32" y1="14" x2="18" y2="34" />
          <line x1="32" y1="14" x2="46" y2="34" />
          <line x1="18" y1="34" x2="12" y2="52" />
          <line x1="18" y1="34" x2="24" y2="52" />
          <line x1="46" y1="34" x2="40" y2="52" />
          <line x1="46" y1="34" x2="52" y2="52" />
        </g>
        <circle cx="32" cy="14" r="6" fill="#5eead4" />
        <circle cx="18" cy="34" r="4.5" fill="#020617" stroke="#5eead4" strokeWidth="2.5" />
        <circle cx="46" cy="34" r="4.5" fill="#020617" stroke="#5eead4" strokeWidth="2.5" />
        <circle cx="12" cy="52" r="3.5" fill="#5eead4" />
        <circle cx="24" cy="52" r="3.5" fill="#5eead4" />
        <circle cx="40" cy="52" r="3.5" fill="#5eead4" />
        <circle cx="52" cy="52" r="3.5" fill="#5eead4" opacity="0.3" />
      </svg>
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-white">
          Yield<span className="text-accent">Stream</span>
        </span>
      )}
    </span>
  );
}
