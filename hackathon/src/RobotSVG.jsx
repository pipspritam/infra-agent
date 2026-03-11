/**
 * RobotSVG — light-theme palette.
 * Body: warm off-white (#f5f3f0) chassis, slate (#64748b) details
 * Accent driven by parent: indigo (Monitor) or sky (Worker)
 */

function Eyes({ act, ac }) {
  switch (act) {
    case 'Reading':
      return (
        <g>
          <circle cx="59" cy="44" r="7"  fill="none" stroke={ac} strokeWidth="1.8" />
          <circle cx="81" cy="44" r="7"  fill="none" stroke={ac} strokeWidth="1.8" />
          <circle cx="59" cy="44" r="3"  fill={ac} opacity="0.9" />
          <circle cx="81" cy="44" r="3"  fill={ac} opacity="0.9" />
          <line x1="66" y1="44" x2="74" y2="44" stroke={ac} strokeWidth="1.5" />
          <line x1="44" y1="44" x2="52" y2="44" stroke={ac} strokeWidth="1" opacity="0.5"/>
          <line x1="88" y1="44" x2="96" y2="44" stroke={ac} strokeWidth="1" opacity="0.5"/>
        </g>
      );
    case 'Thinking':
      return (
        <g>
          <ellipse cx="59" cy="44" rx="7" ry="3.2" fill={ac} opacity="0.85" />
          <ellipse cx="81" cy="44" rx="7" ry="3.2" fill={ac} opacity="0.85" />
          <ellipse cx="59" cy="44" rx="7" ry="3.2" fill="none" stroke={ac} strokeWidth="1" opacity="0.4"/>
          <ellipse cx="81" cy="44" rx="7" ry="3.2" fill="none" stroke={ac} strokeWidth="1" opacity="0.4"/>
        </g>
      );
    case 'Responding':
      return (
        <g>
          <circle cx="59" cy="44" r="8" fill={ac} opacity="0.95" />
          <circle cx="81" cy="44" r="8" fill={ac} opacity="0.95" />
          <circle cx="62" cy="41" r="3"  fill="white" opacity="0.7" />
          <circle cx="84" cy="41" r="3"  fill="white" opacity="0.7" />
        </g>
      );
    default: // Idle
      return (
        <g>
          <rect x="52" y="42" width="14" height="4" rx="2" fill={ac} opacity="0.9" />
          <rect x="74" y="42" width="14" height="4" rx="2" fill={ac} opacity="0.9" />
        </g>
      );
  }
}

function Arms({ act, ac }) {
  const armFill   = '#94a3b8'; // slate-400
  const handFill  = '#cbd5e1'; // slate-300

  switch (act) {
    case 'Reading':
      return (
        <g>
          <rect x="26" y="72" width="10" height="25" rx="5" fill={armFill} transform="rotate(-20,31,72)" />
          <rect x="104" y="72" width="10" height="25" rx="5" fill={armFill} transform="rotate(20,109,72)" />
          {/* Book */}
          <rect x="36" y="94" width="68" height="44" rx="3" fill="#f8f7f5" stroke={ac} strokeWidth="1.5" />
          <line x1="70" y1="94" x2="70" y2="138" stroke={ac} strokeWidth="1" opacity="0.5" />
          {[0, 1, 2].map(i => (
            <g key={i}>
              <rect x="40" y={102 + i * 9} width={22 + i * 2} height="2.5" rx="1" fill={ac} opacity="0.3" />
              <rect x="74" y={102 + i * 9} width={20 + i * 3} height="2.5" rx="1" fill={ac} opacity="0.3" />
            </g>
          ))}
        </g>
      );
    case 'Thinking':
      return (
        <g>
          <rect x="26" y="72" width="10" height="30" rx="5" fill={armFill} />
          <rect x="104" y="66" width="10" height="22" rx="5" fill={armFill} transform="rotate(-30,109,66)" />
          <circle cx="31"  cy="104" r="5" fill={handFill} />
          <circle cx="100" cy="75"  r="6" fill={handFill} />
        </g>
      );
    case 'Responding':
      return (
        <g>
          <rect x="22" y="58" width="10" height="28" rx="5" fill={armFill} transform="rotate(-38,27,70)" />
          <rect x="108" y="58" width="10" height="28" rx="5" fill={armFill} transform="rotate(38,113,70)" />
          <circle cx="14"  cy="50" r="6" fill={handFill} />
          <circle cx="126" cy="50" r="6" fill={handFill} />
        </g>
      );
    default: // Idle
      return (
        <g>
          <rect x="26" y="72" width="10" height="30" rx="5" fill={armFill} />
          <rect x="104" y="72" width="10" height="30" rx="5" fill={armFill} />
          <circle cx="31"  cy="104" r="5" fill={handFill} />
          <circle cx="109" cy="104" r="5" fill={handFill} />
        </g>
      );
  }
}

export default function RobotSVG({ act = 'Idle', accentColor = '#6366f1', size = 150 }) {
  const a  = ['Idle', 'Reading', 'Thinking', 'Responding'].includes(act) ? act : 'Idle';
  const ac = accentColor;

  // Light colours
  const bodyFill    = '#f0ede9';  // warm off-white body
  const bodyStroke  = '#d9d4cc';  // warm border
  const faceFill    = '#ffffff';  // faceplate
  const treadFill   = '#e2e0dc';  // treads
  const treadStroke = '#bfb8ae';
  const ventColor   = '#d1ccc6';

  // Status light colours per act
  const statusLights = {
    Idle:       [ac, '#e2e0dc', '#e2e0dc', '#e2e0dc'],
    Reading:    [ac, '#e2e0dc', '#e2e0dc', '#a78bfa'],
    Thinking:   [ac, '#e2e0dc', '#fbbf24', '#e2e0dc'],
    Responding: [ac, '#4ade80', '#e2e0dc', '#e2e0dc'],
  };
  const [l1, l2, l3, l4] = statusLights[a];

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 140 155"
      style={{ filter: `drop-shadow(0 6px 16px color-mix(in srgb, ${ac} 22%, transparent))` }}
    >
      {/* ── Treads ── */}
      <rect x="20" y="130" width="100" height="18" rx="9" fill={treadFill} stroke={treadStroke} strokeWidth="1.5" />
      {[35, 70, 105].map((cx, i) => (
        <ellipse key={i} cx={cx} cy="139" rx="8" ry="8" fill="#e8e5e0" stroke={treadStroke} strokeWidth="1" />
      ))}
      {[25,32,39,46,53,60,67,74,81,88,95,102].map((x, i) => (
        <rect key={i} x={x} y="136" width="4" height="6" rx="1" fill={treadStroke} opacity="0.5" />
      ))}

      {/* ── Chassis ── */}
      <rect x="30" y="72" width="80" height="60" rx="8" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
      {/* Chest panel */}
      <rect x="38" y="80" width="64" height="44" rx="5" fill={faceFill} stroke={ac} strokeWidth="0.75" opacity="0.4" />

      {/* Status lights */}
      <circle cx="46" cy="90" r="3.5" fill={l1} className="status-light-pulse" />
      <circle cx="58" cy="90" r="3.5" fill={l2} />
      <circle cx="70" cy="90" r="3.5" fill={l3} />
      <circle cx="82" cy="90" r="3.5" fill={l4} />

      {/* Vents */}
      <line x1="44" y1="108" x2="56" y2="108" stroke={ventColor} strokeWidth="1.5" />
      <line x1="44" y1="114" x2="56" y2="114" stroke={ventColor} strokeWidth="1.5" />
      <line x1="44" y1="120" x2="56" y2="120" stroke={ventColor} strokeWidth="1.5" />

      {/* Act badge */}
      <rect x="68" y="107" width="36" height="16" rx="3" fill={ac} opacity="0.1" stroke={ac} strokeWidth="0.75" />
      <text x="86" y="119" textAnchor="middle" fill={ac} fontSize="7"
        fontFamily="'DM Mono', monospace" fontWeight="500">
        {a.toUpperCase()}
      </text>

      {/* ── Arms ── */}
      <Arms act={a} ac={ac} />

      {/* ── Neck ── */}
      <rect x="56" y="60" width="28" height="14" rx="4" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
      <rect x="60" y="63" width="20" height="8"  rx="2" fill="#e8e5e0" />

      {/* ── Head ── */}
      <rect x="32" y="20" width="76" height="42" rx="10" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
      {/* Faceplate */}
      <rect x="36" y="24" width="68" height="34" rx="8" fill={faceFill} />
      <rect x="36" y="24" width="68" height="34" rx="8" fill="none" stroke={ac} strokeWidth="0.5" opacity="0.3" />

      {/* ── Eyes ── */}
      <Eyes act={a} ac={ac} />

      {/* ── Mouth ── */}
      {a === 'Responding'
        ? <path d="M 54 58 Q 70 65 86 58" fill="none" stroke={ac} strokeWidth="2.2" strokeLinecap="round" />
        : <rect x="56" y="56" width="28" height="3.5" rx="2" fill={bodyStroke} opacity="0.6" />}

      {/* ── Antenna ── */}
      <line x1="70" y1="20" x2="70" y2="5" stroke={bodyStroke} strokeWidth="2" />
      <circle cx="70" cy="3.5" r="4" fill={ac} className="antenna-pulse" />
      <circle cx="70" cy="3.5" r="2" fill="white" opacity="0.8" />

      {/* ── Ear panels ── */}
      <rect x="24" y="28" width="8" height="16" rx="3" fill={bodyFill} stroke={bodyStroke} strokeWidth="1" />
      <rect x="108" y="28" width="8" height="16" rx="3" fill={bodyFill} stroke={bodyStroke} strokeWidth="1" />
      <rect x="26" y="32" width="4" height="8" rx="1" fill={ac} opacity="0.4" />
      <rect x="110" y="32" width="4" height="8" rx="1" fill={ac} opacity="0.4" />
    </svg>
  );
}
