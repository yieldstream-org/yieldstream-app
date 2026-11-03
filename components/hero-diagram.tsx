export default function HeroDiagram() {
  return (
    <svg
      viewBox="0 0 460 360"
      className="w-full max-w-md"
      role="img"
      aria-label="A Merkle tree: one 32-byte root at the top, recipient leaves at the bottom, and one leaf proving its path up to the root"
    >
      <defs>
        <radialGradient id="rootGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* faint grid */}
      <g stroke="#1e293b" strokeWidth="1">
        {[60, 120, 180, 240, 300].map((y) => (
          <line key={y} x1="20" y1={y} x2="440" y2={y} />
        ))}
      </g>

      {/* static edges */}
      <g stroke="#334155" strokeWidth="2">
        <line x1="230" y1="60" x2="120" y2="150" />
        <line x1="230" y1="60" x2="340" y2="150" />
        <line x1="120" y1="150" x2="65" y2="250" />
        <line x1="120" y1="150" x2="175" y2="250" />
        <line x1="340" y1="150" x2="285" y2="250" />
        <line x1="340" y1="150" x2="395" y2="250" />
      </g>

      {/* proof path: highlighted leaf -> node -> root */}
      <g className="ys-proof-path" stroke="#5eead4" strokeWidth="2.5">
        <line x1="340" y1="150" x2="395" y2="250" />
        <line x1="230" y1="60" x2="340" y2="150" />
      </g>

      {/* root */}
      <circle cx="230" cy="60" r="34" fill="url(#rootGlow)" />
      <circle cx="230" cy="60" r="13" fill="#5eead4" />
      <text x="230" y="26" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">
        32-byte root
      </text>

      {/* internal nodes */}
      <circle cx="120" cy="150" r="8" fill="#020617" stroke="#5eead4" strokeWidth="2" />
      <circle cx="340" cy="150" r="8" fill="#020617" stroke="#5eead4" strokeWidth="2" />

      {/* leaves */}
      <g>
        <circle cx="65" cy="250" r="7" fill="#475569" />
        <circle cx="175" cy="250" r="7" fill="#475569" />
        <circle cx="285" cy="250" r="7" fill="#475569" />
        <circle cx="395" cy="250" r="9" fill="#5eead4" />
      </g>

      {/* claimed leaf callout */}
      <g>
        <text x="395" y="292" textAnchor="middle" fill="#5eead4" fontSize="12" fontFamily="monospace">
          recipient
        </text>
        <text x="395" y="310" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="monospace">
          proof ✓ · paid out
        </text>
      </g>
      <text x="65" y="292" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="monospace">
        unclaimed
      </text>

      <text x="230" y="345" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="monospace">
        the list stays off-chain — only this root lives on the ledger
      </text>
    </svg>
  );
}
