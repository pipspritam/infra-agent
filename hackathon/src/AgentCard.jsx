import { useState, useEffect, useRef } from "react";

/* ─── Vector SVG: Monitoring Agent ─────────────────────────────
   Clean flat-vector style: geometric shapes, minimal strokes    */
function MonitorSVG({ act }) {
  const isReading = act === "Reading";
  const isThinking = act === "Thinking";
  const isResponding = act === "Responding";
  const isIdle = act === "Idle";

  return (
    <svg viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="agent-svg">

      {/* ── Desk surface ── */}
      <rect x="8" y="128" width="144" height="10" rx="5" fill="#1e293b" />
      <rect x="18" y="138" width="8" height="32" rx="4" fill="#0f172a" />
      <rect x="134" y="138" width="8" height="32" rx="4" fill="#0f172a" />

      {/* ── Monitor stand ── */}
      <rect x="71" y="116" width="18" height="14" rx="3" fill="#334155" />
      <rect x="62" y="128" width="36" height="5" rx="2.5" fill="#334155" />

      {/* ── Monitor frame ── */}
      <rect x="32" y="62" width="96" height="56" rx="8" fill="#0f172a" />
      <rect x="36" y="66" width="88" height="48" rx="6"
        fill={isReading ? "#0c1a33" : isThinking ? "#1a0c33" : "#111827"} />

      {/* Monitor screen content */}
      {isIdle && (
        <g opacity="0.4">
          <rect x="44" y="74" width="60" height="3" rx="1.5" fill="#475569" />
          <rect x="44" y="81" width="45" height="3" rx="1.5" fill="#475569" />
          <rect x="44" y="88" width="52" height="3" rx="1.5" fill="#475569" />
          <rect x="44" y="95" width="38" height="3" rx="1.5" fill="#475569" />
          {/* blinking cursor */}
          <rect x="44" y="102" width="8" height="3" rx="1.5" fill="#64748b" className="blink-cursor" />
        </g>
      )}
      {isReading && (
        <g>
          <rect x="44" y="72" width="72" height="3" rx="1.5" fill="#38bdf8" opacity="0.9" />
          <rect x="44" y="79" width="55" height="3" rx="1.5" fill="#7dd3fc" opacity="0.7" />
          <rect x="44" y="86" width="66" height="3" rx="1.5" fill="#7dd3fc" opacity="0.7" />
          {/* Alert line */}
          <rect x="44" y="93" width="72" height="4" rx="2" fill="#ef4444" opacity="0.85" className="alert-pulse" />
          <rect x="44" y="100" width="44" height="3" rx="1.5" fill="#7dd3fc" opacity="0.7" />
        </g>
      )}
      {isThinking && (
        <g>
          <text x="80" y="97" textAnchor="middle" fontSize="28" className="screen-emoji">⚙️</text>
          <rect x="44" y="104" width="72" height="2" rx="1" fill="#a78bfa" opacity="0.5" />
        </g>
      )}
      {isResponding && (
        <g>
          {/* Waveform bars */}
          {[44, 52, 60, 68, 76, 84, 92, 100, 108].map((x, i) => (
            <rect
              key={i} x={x} y={72 + (i % 3) * 4}
              width="5" height={16 - (i % 3) * 4}
              rx="2.5" fill="#34d399" opacity="0.8"
              className={`wave-bar wave-bar-${i}`}
            />
          ))}
          <rect x="44" y="100" width="72" height="2" rx="1" fill="#34d399" opacity="0.4" />
        </g>
      )}

      {/* ── Body (torso) ── */}
      <rect x="50" y="82" width="60" height="52" rx="12"
        fill={isResponding ? "#0ea5e9" : "#1e3a5f"} />

      {/* Collar / shirt detail */}
      <path d="M 80 82 L 72 94 L 80 90 L 88 94 Z" fill="#0f2744" />

      {/* Tie / badge for monitor agent */}
      <rect x="76" y="92" width="8" height="18" rx="4" fill="#0ea5e9" opacity="0.7" />
      <circle cx="80" cy="98" r="3" fill="#38bdf8" />

      {/* ── Arms ── */}
      {/* Left arm */}
      <path d="M 50 94 Q 34 108 30 124" strokeWidth="14" stroke={isResponding ? "#0ea5e9" : "#1e3a5f"}
        strokeLinecap="round" fill="none" />
      {/* Right arm */}
      <path d="M 110 94 Q 126 108 130 124" strokeWidth="14" stroke={isResponding ? "#0ea5e9" : "#1e3a5f"}
        strokeLinecap="round" fill="none" />

      {/* ── Head ── */}
      <rect x="55" y="30" width="50" height="54" rx="20" fill="#fbbf24" />

      {/* Hair — flat geometric block */}
      <rect x="55" y="28" width="50" height="18" rx="10" fill="#1e293b" />
      <rect x="55" y="34" width="12" height="18" rx="6" fill="#1e293b" />
      <rect x="93" y="34" width="12" height="18" rx="6" fill="#1e293b" />

      {/* Eyes */}
      {isThinking ? (
        <>
          {/* Eyes looking up */}
          <rect x="61" y="52" width="14" height="11" rx="7" fill="#fff" />
          <rect x="85" y="52" width="14" height="11" rx="7" fill="#fff" />
          <circle cx="68" cy="54" r="4" fill="#1e293b" />
          <circle cx="92" cy="54" r="4" fill="#1e293b" />
          <circle cx="69" cy="53" r="1.5" fill="white" />
          <circle cx="93" cy="53" r="1.5" fill="white" />
        </>
      ) : isReading ? (
        <>
          <rect x="61" y="53" width="14" height="11" rx="7" fill="#fff" />
          <rect x="85" y="53" width="14" height="11" rx="7" fill="#fff" />
          <circle cx="68" cy="59" r="4" fill="#1e293b" />
          <circle cx="92" cy="59" r="4" fill="#1e293b" />
          <circle cx="69" cy="58" r="1.5" fill="white" />
          <circle cx="93" cy="58" r="1.5" fill="white" />
          {/* Glasses */}
          <rect x="59" y="51" width="18" height="15" rx="8" fill="none" stroke="#1e293b" strokeWidth="2" opacity="0.6" />
          <rect x="83" y="51" width="18" height="15" rx="8" fill="none" stroke="#1e293b" strokeWidth="2" opacity="0.6" />
          <line x1="77" y1="58" x2="83" y2="58" stroke="#1e293b" strokeWidth="2" />
        </>
      ) : (
        <>
          <rect x="61" y="53" width="14" height="11" rx="7" fill="#fff" />
          <rect x="85" y="53" width="14" height="11" rx="7" fill="#fff" />
          <circle cx="68" cy="57" r="4" fill="#1e293b" />
          <circle cx="92" cy="57" r="4" fill="#1e293b" />
          <circle cx="69" cy="56" r="1.5" fill="white" />
          <circle cx="93" cy="56" r="1.5" fill="white" />
        </>
      )}

      {/* Mouth */}
      {isResponding
        ? <path d="M 70 72 Q 80 80 90 72" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        : isThinking
        ? <path d="M 72 74 Q 80 71 88 74" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        : <path d="M 72 73 Q 80 78 88 73" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      }

      {/* Thinking dots above head */}
      {isThinking && (
        <>
          <circle cx="102" cy="36" r="3.5" fill="#a78bfa" className="think-1" />
          <circle cx="110" cy="26" r="5" fill="#a78bfa" className="think-2" />
          <circle cx="120" cy="14" r="7" fill="#a78bfa" className="think-3" />
        </>
      )}

      {/* Headset for responding */}
      {isResponding && (
        <>
          <path d="M 55 48 Q 55 26 80 26 Q 105 26 105 48" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
          <rect x="49" y="46" width="10" height="14" rx="5" fill="#0ea5e9" />
          <rect x="101" y="46" width="10" height="14" rx="5" fill="#0ea5e9" />
        </>
      )}
    </svg>
  );
}

/* ─── Vector SVG: Worker Agent ──────────────────────────────────
   Stockier build, different color palette, tool-belt vibe       */
function WorkerSVG({ act }) {
  const isReading = act === "Reading";
  const isThinking = act === "Thinking";
  const isResponding = act === "Responding";
  const isIdle = act === "Idle";

  return (
    <svg viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="agent-svg">

      {/* ── Floor / base ── */}
      <rect x="8" y="138" width="144" height="8" rx="4" fill="#14532d" opacity="0.6" />

      {/* ── Body ── */}
      <rect x="42" y="82" width="76" height="62" rx="14"
        fill={isResponding ? "#16a34a" : "#14532d"} />

      {/* Hi-vis vest stripes */}
      <rect x="42" y="100" width="76" height="7" rx="0"
        fill={isResponding ? "#4ade80" : "#22c55e"} opacity="0.5" />
      <rect x="76" y="82" width="8" height="62" rx="0" fill="#22c55e" opacity="0.3" />

      {/* Chest badge */}
      <rect x="54" y="88" width="22" height="14" rx="4" fill="#166534" />
      <rect x="56" y="90" width="18" height="10" rx="3" fill="#4ade80" opacity="0.6" />

      {/* ── Arms ── */}
      <path d="M 42 96 Q 22 112 18 138" strokeWidth="16" stroke={isResponding ? "#16a34a" : "#14532d"}
        strokeLinecap="round" fill="none" />
      <path d="M 118 96 Q 138 112 142 138" strokeWidth="16" stroke={isResponding ? "#16a34a" : "#14532d"}
        strokeLinecap="round" fill="none" />

      {/* Hands / tool */}
      {(isResponding || isReading) && (
        <>
          {/* Tablet / clipboard in right hand */}
          <rect x="126" y="120" width="22" height="28" rx="4" fill="#0f172a" />
          <rect x="128" y="122" width="18" height="20" rx="3" fill={isReading ? "#1e3a5f" : "#166534"} />
          {isReading && (
            <>
              <rect x="130" y="126" width="14" height="2" rx="1" fill="#38bdf8" opacity="0.8" />
              <rect x="130" y="130" width="10" height="2" rx="1" fill="#38bdf8" opacity="0.6" />
              <rect x="130" y="134" width="12" height="2" rx="1" fill="#ef4444" opacity="0.8" />
            </>
          )}
          {isResponding && (
            <text x="137" y="135" textAnchor="middle" fontSize="11">✓</text>
          )}
        </>
      )}

      {/* Hard hat */}
      <ellipse cx="80" cy="36" rx="34" ry="10" fill="#fbbf24" />
      <rect x="46" y="34" width="68" height="8" rx="4" fill="#f59e0b" />
      {/* Hard hat brim */}
      <ellipse cx="80" cy="42" rx="38" ry="5" fill="#f59e0b" />

      {/* Head */}
      <rect x="54" y="38" width="52" height="48" rx="18" fill="#fbbf24" />

      {/* Eyes */}
      {isThinking ? (
        <>
          <rect x="60" y="54" width="14" height="11" rx="7" fill="#fff" />
          <rect x="86" y="54" width="14" height="11" rx="7" fill="#fff" />
          <circle cx="67" cy="56" r="4" fill="#1e293b" />
          <circle cx="93" cy="56" r="4" fill="#1e293b" />
          <circle cx="68" cy="55" r="1.5" fill="white" />
          <circle cx="94" cy="55" r="1.5" fill="white" />
        </>
      ) : isReading ? (
        <>
          <rect x="60" y="55" width="14" height="11" rx="7" fill="#fff" />
          <rect x="86" y="55" width="14" height="11" rx="7" fill="#fff" />
          <circle cx="67" cy="61" r="4" fill="#1e293b" />
          <circle cx="93" cy="61" r="4" fill="#1e293b" />
          <circle cx="68" cy="60" r="1.5" fill="white" />
          <circle cx="94" cy="60" r="1.5" fill="white" />
        </>
      ) : (
        <>
          <rect x="60" y="55" width="14" height="11" rx="7" fill="#fff" />
          <rect x="86" y="55" width="14" height="11" rx="7" fill="#fff" />
          <circle cx="67" cy="59" r="4" fill="#1e293b" />
          <circle cx="93" cy="59" r="4" fill="#1e293b" />
          <circle cx="68" cy="58" r="1.5" fill="white" />
          <circle cx="94" cy="58" r="1.5" fill="white" />
        </>
      )}

      {/* Eyebrows */}
      {isThinking
        ? <>
            <path d="M 59 50 Q 67 46 75 50" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 85 50 Q 93 46 101 50" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          </>
        : <>
            <path d="M 60 52 Q 67 49 74 52" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            <path d="M 86 52 Q 93 49 100 52" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </>
      }

      {/* Mouth */}
      {isResponding
        ? <path d="M 68 73 Q 80 82 92 73" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        : isIdle
        ? <path d="M 70 74 Q 80 78 90 74" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        : <path d="M 70 75 Q 80 79 90 75" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      }

      {/* Thinking gear bubbles */}
      {isThinking && (
        <>
          <circle cx="106" cy="40" r="4" fill="#fbbf24" opacity="0.7" className="think-1" />
          <circle cx="116" cy="28" r="6" fill="#fbbf24" opacity="0.8" className="think-2" />
          <text x="116" y="32" textAnchor="middle" fontSize="8" className="think-3">⚙</text>
          <circle cx="128" cy="16" r="9" fill="#fbbf24" opacity="0.9" className="think-3" />
          <text x="128" y="21" textAnchor="middle" fontSize="12">⚙</text>
        </>
      )}

      {/* Radio earpiece for responding */}
      {isResponding && (
        <>
          <circle cx="54" cy="62" r="5" fill="#16a34a" />
          <path d="M 49 62 Q 44 55 44 50" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/* ─── Activity config ───────────────────────────────────────── */
const ACT_CONFIG = {
  Idle:       { label: "Idle",       color: "#64748b", bg: "rgba(100,116,139,0.15)", icon: "◌", anim: "anim-idle" },
  Reading:    { label: "Reading",    color: "#38bdf8", bg: "rgba(56,189,248,0.12)",  icon: "◉", anim: "anim-reading" },
  Thinking:   { label: "Thinking",   color: "#a78bfa", bg: "rgba(167,139,250,0.12)", icon: "◎", anim: "anim-thinking" },
  Responding: { label: "Responding", color: "#4ade80", bg: "rgba(74,222,128,0.12)",  icon: "●", anim: "anim-responding" },
};

/* ─── Bubble ─────────────────────────────────────────────────── */
function Bubble({ text, act, type }) {
  const isThinking = act === "Thinking";
  const cfg = ACT_CONFIG[act] || ACT_CONFIG.Idle;
  return (
    <div className={`bubble ${isThinking ? "bubble-thought" : "bubble-speech"}`}
      style={{ "--bubble-accent": cfg.color }}>
      {isThinking && (
        <div className="thinking-dots">
          <span /><span /><span />
        </div>
      )}
      <p className="bubble-text">{text}</p>
    </div>
  );
}

/* ─── AgentCard ──────────────────────────────────────────────── */
export default function AgentCard({ data, type, label }) {
  const { agent_name = label, act = "Idle", text = "..." } = data || {};
  const cfg = ACT_CONFIG[act] || ACT_CONFIG.Idle;

  const [animKey, setAnimKey] = useState(0);
  const prevRef = useRef({ act, text });

  useEffect(() => {
    if (act !== prevRef.current.act || text !== prevRef.current.text) {
      setAnimKey((k) => k + 1);
      prevRef.current = { act, text };
    }
  }, [act, text]);

  return (
    <div className={`agent-card agent-card--${type}`}
      style={{ "--agent-accent": type === "monitor" ? "#0ea5e9" : "#22c55e" }}>

      {/* Top: label + status */}
      <div className="card-header">
        <div className="card-label">
          <span className="card-type-dot" />
          <span className="card-type-text">{label.toUpperCase()}</span>
        </div>
        <div className="act-chip" style={{ background: cfg.bg, color: cfg.color }}>
          <span className={`act-indicator ${cfg.anim}`} />
          {cfg.label}
        </div>
      </div>

      {/* Bubble */}
      <div key={animKey} className="bubble-area bubble-enter">
        <Bubble text={text} act={act} type={type} />
      </div>

      {/* SVG character */}
      <div className={`svg-stage ${cfg.anim}`}>
        {type === "monitor"
          ? <MonitorSVG act={act} key={act} />
          : <WorkerSVG act={act} key={act} />
        }
      </div>

      {/* Name tag */}
      <div className="name-tag">
        <span className="name-tag-name">{agent_name}</span>
      </div>

      {/* Ambient glow */}
      <div className="card-glow" style={{ background: `radial-gradient(circle at 50% 100%, ${cfg.color}18 0%, transparent 70%)` }} />
    </div>
  );
}
