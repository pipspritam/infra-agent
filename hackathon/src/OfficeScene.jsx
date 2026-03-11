import RobotSVG from './RobotSVG';
import SpeechBubble from './SpeechBubble';

/* ── Agent accent colours ── */
const MC = '#6366f1';   // indigo-500  — Monitor
const WC = '#0ea5e9';   // sky-500     — Worker

/* ─── Light-theme palette for SVG ─── */
const C = {
  pageBg:       '#f8f7f5',  // surface-1
  cardBg:       '#ffffff',  // surface-0
  panelBg:      '#f0ede9',  // surface-2
  border:       '#e6e2dc',  // border-faint
  borderMid:    '#d9d4cc',  // border-soft
  borderStrong: '#bfb8ae',  // border-medium
  wallBg:       '#f5f3f0',  // warm wall
  floorBg:      '#ede9e4',  // warm floor
  deskBg:       '#e8e4de',  // desk surface
  text:         '#1c1917',  // text-primary
  textMuted:    '#57534e',  // text-secondary
  textFaint:    '#a8a29e',  // text-tertiary
  shadow:       'rgba(0,0,0,0.08)',
};

/* ─── Decorations ─── */

function Plant({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="7" y="40" width="14" height="18" rx="3" fill={C.deskBg} stroke={C.borderMid} strokeWidth="1" />
      <ellipse cx="14" cy="30" rx="12" ry="16" fill="#bbf7d0" opacity="0.85" />
      <ellipse cx="8"  cy="25" rx="7"  ry="11" fill="#86efac" opacity="0.75" />
      <ellipse cx="20" cy="26" rx="6"  ry="10" fill="#4ade80" opacity="0.6"  />
      <line x1="14" y1="40" x2="14" y2="28" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
    </g>
  );
}

function MonitorScreen({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="78" height="52" rx="4" fill={C.cardBg} stroke={C.borderMid} strokeWidth="1.5" />
      <rect x="4" y="4" width="70" height="44" rx="2" fill="#f8f7f5" />
      {[8, 14, 20, 26, 32, 38].map((ry, i) => (
        <rect key={i} x="8" y={ry}
          width={28 + (i % 3) * 14} height="2.5" rx="1"
          fill={i % 3 === 0 ? MC : i % 3 === 1 ? WC : '#a78bfa'}
          opacity="0.45"
        />
      ))}
      <rect x="32" y="52" width="14" height="5" rx="1" fill={C.borderMid} />
      <rect x="14" y="57" width="50" height="2" rx="1" fill={C.borderMid} />
    </g>
  );
}

function FilingCabinet({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="32" height="62" rx="2"
        fill={C.panelBg} stroke={C.borderMid} strokeWidth="1" />
      {[5, 24, 44].map((ry, i) => (
        <g key={i}>
          <rect x="3"  y={ry} width="26" height="16" rx="2"
            fill={C.cardBg} stroke={C.border} strokeWidth="1" />
          <rect x="10" y={ry + 6} width="12" height="4" rx="1" fill={C.borderMid} />
          <circle cx="25" cy={ry + 8} r="2" fill={C.borderStrong} />
        </g>
      ))}
    </g>
  );
}

function PinboardNote({ x, y, w, color }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="18" rx="2"
        fill={color} opacity="0.18" stroke={color} strokeWidth="0.75" />
      <rect x={x + 3} y={y + 4}  width={w - 6}  height="2" rx="1" fill={color} opacity="0.5" />
      <rect x={x + 3} y={y + 10} width={w - 10} height="2" rx="1" fill={color} opacity="0.35" />
      <circle cx={x + w / 2} cy={y} r="2.5" fill={color} opacity="0.7" />
    </g>
  );
}

/* ─── Cubicle ─── */

function Cubicle({ x, y, width, height, accentColor, label, side, hasAgent }) {
  const deskY = y + height - 86;

  return (
    <g>
      {/* Back wall — warm white */}
      <rect x={x} y={y} width={width} height={height - 40} fill={C.wallBg} />
      {/* Subtle grid texture */}
      {[...Array(11)].map((_, i) => (
        <line key={`h${i}`}
          x1={x} y1={y + i * 20}
          x2={x + width} y2={y + i * 20}
          stroke={C.border} strokeWidth="0.5" opacity="0.6" />
      ))}
      {[...Array(Math.ceil(width / 40) + 1)].map((_, i) => (
        <line key={`v${i}`}
          x1={x + i * 40} y1={y}
          x2={x + i * 40} y2={y + height - 40}
          stroke={C.border} strokeWidth="0.5" opacity="0.4" />
      ))}

      {/* Top label strip */}
      <rect x={x} y={y} width={width} height="24"
        fill={`color-mix(in srgb, ${accentColor} 6%, #ffffff)`} />
      <line x1={x} y1={y + 24} x2={x + width} y2={y + 24}
        stroke={accentColor} strokeWidth="0.75" opacity="0.4" />
      <text x={x + width / 2} y={y + 15}
        textAnchor="middle"
        fill={accentColor}
        fontSize="9"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="600"
        letterSpacing="0.06em"
        opacity="0.85"
      >
        {label}
      </text>

      {/* Pinboard */}
      <rect x={x + 14} y={y + 28} width={width - 28} height={52} rx="4"
        fill="#fef9f0" stroke={C.borderMid} strokeWidth="1" />
      <rect x={x + 14} y={y + 28} width={width - 28} height="52" rx="4"
        fill="none" stroke={accentColor} strokeWidth="0.5" opacity="0.3" />
      {[
        { nx: x + 18, ny: y + 32, w: 30, c: '#f59e0b' },
        { nx: x + 56, ny: y + 33, w: 24, c: WC        },
        { nx: x + 90, ny: y + 30, w: 26, c: '#a78bfa' },
        { nx: x + 20, ny: y + 56, w: 38, c: '#4ade80' },
        { nx: x + 68, ny: y + 57, w: 22, c: '#f472b6' },
      ].slice(0, width > 200 ? 5 : 3).map((n, i) => (
        <PinboardNote key={i} x={n.nx} y={n.ny} w={n.w} color={n.c} />
      ))}

      {/* Side partition */}
      {side === 'left'
        ? <rect x={x + width - 6} y={y} width="6" height={height - 35}
            fill={C.panelBg} stroke={C.borderMid} strokeWidth="1" />
        : <rect x={x} y={y} width="6" height={height - 35}
            fill={C.panelBg} stroke={C.borderMid} strokeWidth="1" />}

      {/* Monitor */}
      {hasAgent && (
        <MonitorScreen
          x={x + (side === 'left' ? 32 : width - 110)}
          y={deskY - 55}
        />
      )}

      {/* Desk surface — card-like with shadow */}
      <rect x={x + 9}  y={deskY + 1} width={width - 18} height="13" rx="4"
        fill={C.shadow} />
      <rect x={x + 10} y={deskY}     width={width - 20} height="13" rx="4"
        fill={C.cardBg} stroke={accentColor} strokeWidth="1" opacity="0.9" />
      <rect x={x + 10} y={deskY + 13} width={width - 20} height="5" rx="0"
        fill={C.deskBg} />
      {/* Legs */}
      <rect x={x + 16}         y={deskY + 18} width="5" height={height - (deskY - y) - 42} rx="2" fill={C.deskBg} stroke={C.borderMid} strokeWidth="0.5" />
      <rect x={x + width - 21} y={deskY + 18} width="5" height={height - (deskY - y) - 42} rx="2" fill={C.deskBg} stroke={C.borderMid} strokeWidth="0.5" />

      {/* Coffee mug */}
      <g transform={`translate(${x + (side === 'right' ? 20 : width - 40)}, ${deskY - 22})`}>
        <rect x="0" y="8" width="16" height="14" rx="3"
          fill={C.cardBg} stroke={C.borderMid} strokeWidth="1" />
        <path d="M16 11 Q22 11 22 16 Q22 21 16 21"
          fill="none" stroke={C.borderMid} strokeWidth="1.5" />
        <ellipse cx="8" cy="8" rx="8" ry="2.5" fill="#7c3aed" opacity="0.3" />
        <path d="M5 4 Q8 1 11 4"
          fill="none" stroke={C.textFaint} strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Floor — subtle warm tone */}
      <rect x={x} y={y + height - 40} width={width} height="40" fill={C.floorBg} />
      {[...Array(Math.ceil(width / 40) + 1)].map((_, i) => (
        <line key={i}
          x1={x + i * 40} y1={y + height - 40}
          x2={x + i * 40} y2={y + height}
          stroke={C.border} strokeWidth="1" />
      ))}

      {/* Outer accent edge */}
      <rect x={x} y={y} width={width} height={height - 40}
        fill="none" stroke={accentColor} strokeWidth="0.5" opacity="0.12" />
    </g>
  );
}

/* ─── Idle scene ─── */

function IdleScene({ W, H }) {
  return (
    <g>
      {/* Warm page background */}
      <rect x="0" y="0" width={W} height={H} fill={C.pageBg} />

      {/* Very subtle vignette */}
      <defs>
        <radialGradient id="vig" cx="50%" cy="40%">
          <stop offset="60%" stopColor={C.pageBg} stopOpacity="0" />
          <stop offset="100%" stopColor="#d9d4cc" stopOpacity="0.25" />
        </radialGradient>
        <radialGradient id="glow" cx="20%" cy="30%">
          <stop offset="0%"   stopColor="#e0e7ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor={C.pageBg} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill="url(#glow)" />
      <rect x="0" y="0" width={W} height={H} fill="url(#vig)" />

      {/* Ceiling — white strip */}
      <rect x="0" y="0" width={W} height="20" fill={C.cardBg} />
      <line x1="0" y1="20" x2={W} y2="20" stroke={C.borderMid} strokeWidth="1" />

      {/* Ceiling light fixtures */}
      {[0.2, 0.5, 0.8].map((p, i) => (
        <g key={i}>
          <rect x={W * p - 34} y="0" width="68" height="8" rx="2"
            fill={C.panelBg} stroke={C.borderMid} strokeWidth="1" />
          <rect x={W * p - 30} y="8" width="60" height="4" rx="1"
            fill="#fef9e7" opacity="0.9" className="ceil-light" />
          <rect x={W * p - 1} y="8" width="2" height="30"
            fill="#fef9e7" opacity="0.12" className="ceil-light" />
        </g>
      ))}

      {/* Window */}
      <g transform="translate(24, 28)">
        <rect x="0" y="0" width="100" height="140" rx="6"
          fill="#dbeafe" stroke={C.borderMid} strokeWidth="2" />
        {/* Frame bars */}
        <line x1="50" y1="0" x2="50" y2="140" stroke={C.borderMid} strokeWidth="2" />
        <line x1="0" y1="70" x2="100" y2="70" stroke={C.borderMid} strokeWidth="2" />
        {/* Sky gradient inside */}
        <rect x="2" y="2" width="46" height="66" rx="3" fill="#bfdbfe" opacity="0.5" />
        <rect x="52" y="2" width="46" height="66" rx="3" fill="#bfdbfe" opacity="0.5" />
        {/* Buildings outside */}
        {[10, 25, 60, 78].map((wx, i) => (
          <rect key={i} x={wx} y={15 + (i % 2) * 12} width="10"
            height={50 + (i % 3) * 18} rx="1"
            fill="#93c5fd" opacity="0.55" />
        ))}
        {/* Windows in buildings */}
        {[10, 25, 60, 78].flatMap((bx, bi) =>
          [22, 32, 42].map((wy, wi) => (
            <rect key={`${bi}-${wi}`}
              x={bx + 2} y={wy + (bi % 2) * 12 + 15}
              width="6" height="5" rx="1"
              fill="#fbbf24" opacity="0.6" className="city-light" />
          ))
        )}
        {/* Sunbeam lines */}
        <line x1="50" y1="0" x2="0"   y2="140" stroke="white" strokeWidth="1" opacity="0.15" />
        <line x1="50" y1="0" x2="100" y2="140" stroke="white" strokeWidth="1" opacity="0.15" />
      </g>

      {/* Server rack */}
      <g transform={`translate(${W - 86}, 32)`}>
        <rect x="0" y="0" width="58" height="162" rx="4"
          fill={C.panelBg} stroke={C.borderMid} strokeWidth="1.5" />
        <rect x="3" y="3" width="52" height="156" rx="2" fill={C.cardBg} />
        {[8, 28, 48, 68, 88, 108, 130].map((ry, i) => (
          <g key={i}>
            <rect x="5" y={ry} width="48" height="16" rx="2"
              fill={C.panelBg} stroke={C.border} strokeWidth="1" />
            <rect x="9" y={ry + 5} width="20" height="6" rx="1" fill={C.deskBg} />
            <circle cx="39" cy={ry + 8} r="3"
              fill={i % 3 === 0 ? '#4ade80' : i % 3 === 1 ? MC : '#fbbf24'}
              opacity="0.9" className="server-led" />
            <circle cx="48" cy={ry + 8} r="2" fill={C.border} />
          </g>
        ))}
      </g>

      {/* Maintenance bot (background) */}
      <g transform={`translate(${W * 0.36}, ${H - 92})`} className="idle-bot-1">
        <rect x="10" y="28" width="36" height="28" rx="5"
          fill={C.panelBg} stroke={C.borderMid} strokeWidth="1.5" />
        <rect x="16" y="12" width="24" height="18" rx="5"
          fill={C.panelBg} stroke={C.borderMid} strokeWidth="1.5" />
        <rect x="8"  y="38" width="8" height="16" rx="3" fill={C.deskBg} />
        <rect x="40" y="38" width="8" height="16" rx="3" fill={C.deskBg} />
        {/* Treads */}
        <rect x="10" y="56" width="36" height="8" rx="4"
          fill={C.deskBg} stroke={C.borderMid} strokeWidth="1" />
        {[13, 20, 27, 34, 39].map((px, i) => (
          <rect key={i} x={px} y="58" width="5" height="4" rx="1" fill={C.borderMid} />
        ))}
        {/* Eyes */}
        <circle cx="23" cy="20" r="3" fill={MC} opacity="0.8" className="bg-led" />
        <circle cx="33" cy="20" r="3" fill={MC} opacity="0.8" className="bg-led" />
        {/* Antenna */}
        <line x1="28" y1="12" x2="28" y2="5" stroke={C.borderMid} strokeWidth="1.5" />
        <circle cx="28" cy="3" r="2.5" fill="#f59e0b" className="antenna-pulse" />
      </g>

      {/* Drone */}
      <g transform={`translate(${W * 0.62}, ${H * 0.27})`} className="drone-float">
        {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx, sy], i) => (
          <g key={i}>
            <line x1="30" y1="26" x2={30 + sx * 22} y2={26 + sy * 8}
              stroke={C.borderStrong} strokeWidth="2" />
            <ellipse cx={30 + sx * 22} cy={26 + sy * 8} rx="9" ry="2.5"
              fill={WC} opacity="0.35"
              className={i % 2 === 0 ? 'spin-cw' : 'spin-ccw'} />
          </g>
        ))}
        <rect x="20" y="18" width="20" height="14" rx="5"
          fill={C.cardBg} stroke={WC} strokeWidth="1.5" />
        <circle cx="30" cy="25" r="4" fill={C.panelBg} stroke={WC} strokeWidth="1" />
        <circle cx="30" cy="25" r="2" fill={WC} opacity="0.8" className="bg-led" />
        {/* Landing legs */}
        <line x1="22" y1="32" x2="18" y2="44" stroke={C.borderMid} strokeWidth="1.5" />
        <line x1="38" y1="32" x2="42" y2="44" stroke={C.borderMid} strokeWidth="1.5" />
        <line x1="14" y1="44" x2="22" y2="44" stroke={C.borderMid} strokeWidth="1.5" />
        <line x1="38" y1="44" x2="46" y2="44" stroke={C.borderMid} strokeWidth="1.5" />
      </g>

      {/* Waiting card — clean white card */}
      <g transform={`translate(${W / 2}, ${H / 2 - 14})`}>
        {/* Shadow */}
        <rect x="-134" y="-28" width="268" height="68" rx="12"
          fill="rgba(0,0,0,0.06)" transform="translate(2,3)" />
        {/* Card */}
        <rect x="-134" y="-28" width="268" height="68" rx="12"
          fill={C.cardBg} stroke={C.borderMid} strokeWidth="1.5" />
        <rect x="-134" y="-28" width="268" height="68" rx="12"
          fill="none" stroke={MC} strokeWidth="0.75" opacity="0.35" />

        <text textAnchor="middle" y="4"
          fill={C.text}
          fontSize="14"
          fontFamily="'DM Sans', sans-serif"
          fontWeight="600"
          letterSpacing="-0.02em"
          className="waiting-pulse"
        >
          Waiting for agents…
        </text>
        <text textAnchor="middle" y="22"
          fill={C.textFaint}
          fontSize="10"
          fontFamily="'DM Mono', monospace"
        >
          WebSocket open · listening
        </text>
      </g>
    </g>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────── */

export default function OfficeScene({ agents }) {
  const hasAgents = agents && agents.length >= 2;
  const mon = agents?.find(a => a.agent_name === 'Monitor') ?? agents?.[0];
  const wkr = agents?.find(a => a.agent_name === 'Worker')  ?? agents?.[1];

  const VW = 900, VH = 520;

  return (
    <div className="office-scene-container">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="office-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Base fill */}
        <rect x="0" y="0" width={VW} height={VH} fill={C.pageBg} />

        {/* ── IDLE ── */}
        {!hasAgents && <IdleScene W={VW} H={VH} />}

        {/* ── DUAL AGENT ── */}
        {hasAgents && (
          <g>
            {/* Ceiling */}
            <rect x="0" y="0" width={VW} height="22" fill={C.cardBg} />
            <line x1="0" y1="22" x2={VW} y2="22" stroke={C.borderMid} strokeWidth="1" />
            {[150, 440, 720].map((lx, i) => (
              <g key={i}>
                <rect x={lx - 36} y="0" width="72" height="6" rx="2"
                  fill={C.panelBg} stroke={C.borderMid} strokeWidth="1" />
                <rect x={lx - 32} y="6" width="64" height="3" rx="1"
                  fill="#fef9e7" opacity="0.85" className="ceil-light" />
              </g>
            ))}

            {/* Floor */}
            <rect x="0" y={VH - 22} width={VW} height="22" fill={C.floorBg} />
            <line x1="0" y1={VH - 22} x2={VW} y2={VH - 22} stroke={C.borderMid} strokeWidth="1" />
            {[...Array(12)].map((_, i) => (
              <line key={i}
                x1={i * 80} y1={VH - 22}
                x2={i * 80} y2={VH}
                stroke={C.border} strokeWidth="1" />
            ))}

            {/* Centre divider */}
            <rect x={VW / 2 - 4} y="22" width="8" height={VH - 44}
              fill={C.panelBg} stroke={C.borderMid} strokeWidth="1" />
            <line x1={VW / 2} y1="22" x2={VW / 2} y2={VH - 22}
              stroke={MC} strokeWidth="0.5" strokeDasharray="5 10" opacity="0.2" />

            {/* Décor */}
            <FilingCabinet x={28}       y={58} />
            <FilingCabinet x={VW - 60}  y={58} />
            <Plant x={34}               y={VH - 132} />
            <Plant x={VW - 74}          y={VH - 132} />

            {/* Cubicles */}
            <Cubicle
              x={16} y={22} width={VW / 2 - 34} height={VH - 44}
              accentColor={MC} label="Monitor Unit · Sector A"
              side="left" hasAgent={!!mon}
            />
            <Cubicle
              x={VW / 2 + 18} y={22} width={VW / 2 - 34} height={VH - 44}
              accentColor={WC} label="Worker Unit · Sector B"
              side="right" hasAgent={!!wkr}
            />

            {/* Robots */}
            <g transform={`translate(${VW / 4 - 66}, ${VH - 248})`} className="agent-robot">
              <RobotSVG act={mon?.act} accentColor={MC} size={134} />
            </g>
            <g transform={`translate(${VW * 0.75 - 66}, ${VH - 248})`} className="agent-robot">
              <RobotSVG act={wkr?.act} accentColor={WC} size={134} />
            </g>

            {/* Speech bubbles */}
            {mon?.text && (
              <g transform={`translate(${VW / 4 - 120}, ${VH - 402})`}>
                <SpeechBubble key={mon.text} text={mon.text} act={mon.act} accentColor={MC} />
              </g>
            )}
            {wkr?.text && (
              <g transform={`translate(${VW * 0.75 - 110}, ${VH - 402})`}>
                <SpeechBubble key={wkr.text} text={wkr.text} act={wkr.act} accentColor={WC} />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Nameplate bar */}
      {hasAgents && (
        <div className="agent-nameplates">
          <div className="nameplate monitor">
            <div className="nameplate-dot" style={{ background: MC, boxShadow: `0 0 0 3px color-mix(in srgb, ${MC} 18%, transparent)` }} />
            <span className="nameplate-name">{mon?.agent_name}</span>
            <span className="nameplate-act" style={{ color: MC, borderColor: `color-mix(in srgb, ${MC} 30%, transparent)` }}>
              {mon?.act}
            </span>
          </div>
          <div className="nameplate-divider" />
          <div className="nameplate worker">
            <div className="nameplate-dot" style={{ background: WC, boxShadow: `0 0 0 3px color-mix(in srgb, ${WC} 18%, transparent)` }} />
            <span className="nameplate-name">{wkr?.agent_name}</span>
            <span className="nameplate-act" style={{ color: WC, borderColor: `color-mix(in srgb, ${WC} 30%, transparent)` }}>
              {wkr?.act}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
