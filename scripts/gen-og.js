const fs = require("fs");
const sharp = require("sharp");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
      <path d="M 46 0 L 0 0 0 46" fill="none" stroke="#1e293b" stroke-width="1" opacity="0.35"/>
    </pattern>
    <radialGradient id="glow" cx="50%" cy="0%" r="65%">
      <stop offset="0%" stop-color="#5eead4" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#5eead4" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="#020617"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- merkle tree mark -->
  <g transform="translate(70,155) scale(1.9)">
    <g stroke="#5eead4" stroke-width="2.5" stroke-linecap="round">
      <line x1="60" y1="26" x2="26" y2="76"/>
      <line x1="60" y1="26" x2="94" y2="76"/>
      <line x1="26" y1="76" x2="10" y2="126"/>
      <line x1="26" y1="76" x2="42" y2="126"/>
      <line x1="94" y1="76" x2="78" y2="126"/>
      <line x1="94" y1="76" x2="110" y2="126"/>
    </g>
    <circle cx="60" cy="26" r="11" fill="#5eead4"/>
    <circle cx="26" cy="76" r="7.5" fill="#020617" stroke="#5eead4" stroke-width="2.5"/>
    <circle cx="94" cy="76" r="7.5" fill="#020617" stroke="#5eead4" stroke-width="2.5"/>
    <circle cx="10" cy="126" r="6" fill="#5eead4"/>
    <circle cx="42" cy="126" r="6" fill="#5eead4"/>
    <circle cx="78" cy="126" r="6" fill="#5eead4"/>
    <circle cx="110" cy="126" r="6" fill="#5eead4" opacity="0.3"/>
  </g>

  <!-- wordmark -->
  <text x="340" y="272" font-family="DejaVu Sans" font-weight="bold" font-size="88" letter-spacing="-2">
    <tspan fill="#ffffff">Yield</tspan><tspan fill="#5eead4">Stream</tspan>
  </text>

  <!-- tagline with teal arrow -->
  <text x="342" y="340" font-family="DejaVu Sans" font-size="36" fill="#94a3b8">
    <tspan fill="#5eead4">&#8594; </tspan>Airdrop to thousands. Commit 32 bytes.
  </text>

  <!-- footer bar -->
  <text x="342" y="452" font-family="DejaVu Sans Mono" font-size="24" fill="#5eead4">
    CC25&#8230;2FPG
  </text>
  <text x="560" y="452" font-family="DejaVu Sans" font-size="24" fill="#64748b">
    deployed &amp; lifecycle-verified on Stellar testnet
  </text>

  <g font-family="DejaVu Sans Mono" font-size="22" fill="#64748b">
    <rect x="342" y="498" width="260" height="4" fill="#5eead4" opacity="0.5"/>
    <text x="342" y="545">Soroban &#183; RFC 6962 &#183; MIT OR Apache-2.0</text>
  </g>
</svg>
`;

sharp(Buffer.from(svg), { density: 300 })
  .resize(1200, 630)
  .png()
  .toBuffer()
  .then((buf) => {
    fs.writeFileSync(process.argv[2], buf);
    console.log("wrote", process.argv[2], buf.length, "bytes");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
