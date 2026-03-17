import React from "react";

/**
 * CuteBot — Simpler, cuter robot character for cubicle scene
 * More playful and expressive than the original SVGs
 */

function MonitorBot({ act }) {
  const isReading = act === "Reading";
  const isThinking = act === "Thinking";
  const isResponding = act === "Responding";
  const isDone = act === "Done";

  return (
    <svg
      viewBox="0 0 140 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", maxWidth: "140px" }}
    >
      {/* ── Shadow ── */}
      <ellipse cx="70" cy="190" rx="40" ry="6" fill="rgba(28,26,22,0.15)" />

      {/* ── Base/Feet ── */}
      <rect x="35" y="160" width="70" height="25" rx="8" fill="#2a5f8f" opacity="0.9" />
      <circle cx="50" cy="168" r="5" fill="#1e3a5f" />
      <circle cx="90" cy="168" r="5" fill="#1e3a5f" />

      {/* ── Body ── */}
      <rect x="25" y="90" width="90" height="75" rx="12" fill="#2a5f8f" />
      <rect x="35" y="100" width="70" height="55" rx="8" fill="#1a3a5c" />

      {/* ── Screen/Display ── */}
      <rect x="40" y="105" width="60" height="40" rx="6" fill="#0f172a" />
      <rect
        x="42"
        y="107"
        width="56"
        height="36"
        rx="4"
        fill={isDone ? "#064e3b" : isResponding ? "#0c4a1c" : "#0f172a"}
      />

      {/* Display content based on act */}
      {isReading && (
        <>
          <rect x="48" y="115" width="40" height="3" rx="1.5" fill="#38bdf8" opacity="0.9" />
          <rect x="48" y="122" width="28" height="2.5" rx="1" fill="#38bdf8" opacity="0.7" />
          <rect x="48" y="128" width="40" height="3" rx="1.5" fill="#ef4444" opacity="0.95" style={{ animation: "alert-pulse 1.4s ease-in-out infinite" }} />
          <rect x="48" y="135" width="20" height="2" rx="1" fill="#38bdf8" opacity="0.5" />
        </>
      )}
      {isThinking && (
        <>
          <circle cx="70" cy="125" r="8" fill="#c084fc" opacity="0.7" />
          <circle cx="70" cy="125" r="5" fill="#a855f7" opacity="0.9" />
          <circle cx="85" cy="120" r="5" fill="#c084fc" opacity="0.6" style={{ animation: "think-bob 1.4s ease-in-out infinite" }} />
        </>
      )}
      {isResponding && (
        <>
          {[48, 58, 68, 78].map((x, i) => (
            <rect
              key={i}
              x={x}
              y={115 + (i % 3) * 3}
              width="6"
              height={12 - (i % 3) * 2}
              rx="2"
              fill="#34d399"
              opacity="0.9"
              style={{
                animation: `wave-anim ${0.35 + i * 0.08}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </>
      )}
      {isDone && (
        <text x="70" y="130" textAnchor="middle" fontSize="20" fill="#4ade80">
          ✓
        </text>
      )}

      {/* ── Status lights ── */}
      <circle cx="48" cy="100" r="3" fill={isDone ? "#4ade80" : isReading ? "#38bdf8" : isThinking ? "#c084fc" : "#64748b"} className="status-light-pulse" />
      <circle cx="92" cy="100" r="3" fill={isResponding ? "#34d399" : "#64748b"} />

      {/* ── Neck ── */}
      <rect x="55" y="75" width="30" height="18" rx="6" fill="#1a3a5c" />
      <circle cx="62" cy="82" r="2.5" fill="#38bdf8" opacity="0.6" />
      <circle cx="78" cy="82" r="2.5" fill="#38bdf8" opacity="0.6" />

      {/* ── Head ── */}
      <rect x="20" y="25" width="100" height="60" rx="16" fill="#1e3a5f" />
      <rect x="30" y="35" width="80" height="40" rx="12" fill="#0f172a" />

      {/* ── Visor/Eyes ── */}
      {isThinking ? (
        <>
          <ellipse cx="45" cy="50" rx="10" ry="9" fill="#c084fc" opacity="0.9" />
          <circle cx="45" cy="48" r="4" fill="white" opacity="0.8" />
          <ellipse cx="95" cy="50" rx="10" ry="9" fill="#c084fc" opacity="0.9" />
          <circle cx="95" cy="48" r="4" fill="white" opacity="0.8" />
        </>
      ) : (
        <>
          <rect x="35" y="42" width="20" height="18" rx="6" fill="#38bdf8" opacity={isReading ? 0.95 : 0.75} />
          <rect x="85" y="42" width="20" height="18" rx="6" fill="#38bdf8" opacity={isReading ? 0.95 : 0.75} />
          <circle cx="45" cy={isReading ? 54 : 51} r="4" fill="white" opacity="0.6" />
          <circle cx="95" cy={isReading ? 54 : 51} r="4" fill="white" opacity="0.6" />
        </>
      )}

      {/* ── Antenna ── */}
      <line x1="70" y1="25" x2="70" y2="8" stroke="#1a3a5c" strokeWidth="2.5" />
      <circle cx="70" cy="5" r="4" fill="#38bdf8" className="antenna-pulse" />
      <circle cx="70" cy="5" r="2" fill="white" opacity="0.7" />

      {/* ── Mouth speaker ── */}
      <rect x="45" y="63" width="50" height="8" rx="4" fill="rgba(0,0,0,0.2)" />
      {isResponding &&
        [48, 54, 60, 66, 72, 78, 84].map((x, i) => (
          <rect
            key={i}
            x={x}
            y="64"
            width="4"
            height={2 + (i % 3) * 2}
            rx="1.5"
            fill="#34d399"
            opacity="0.95"
            style={{
              animation: `wave-anim ${0.3 + i * 0.06}s ease-in-out infinite alternate`,
            }}
          />
        ))}
    </svg>
  );
}

function WorkerBot({ act }) {
  const isReading = act === "Reading";
  const isThinking = act === "Thinking";
  const isResponding = act === "Responding";
  const isDone = act === "Done";

  return (
    <svg
      viewBox="0 0 140 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", maxWidth: "140px" }}
    >
      {/* ── Shadow ── */}
      <ellipse cx="70" cy="190" rx="42" ry="6" fill="rgba(28,26,22,0.15)" />

      {/* ── Feet/Work boots ── */}
      <rect x="28" y="160" width="30" height="25" rx="8" fill="#1c0a00" />
      <rect x="82" y="160" width="30" height="25" rx="8" fill="#1c0a00" />
      <ellipse cx="43" cy="178" rx="15" ry="6" fill="#2d1200" opacity="0.8" />
      <ellipse cx="97" cy="178" rx="15" ry="6" fill="#2d1200" opacity="0.8" />

      {/* ── Body/Chassis ── */}
      <rect x="20" y="85" width="100" height="80" rx="14" fill="#78350f" />

      {/* Hi-vis stripes */}
      <rect x="20" y="105" width="100" height="8" fill="#fbbf24" opacity="0.3" />
      <rect x="20" y="125" width="100" height="8" fill="#fbbf24" opacity="0.2" />

      {/* Chest panel */}
      <rect x="35" y="90" width="70" height="50" rx="8" fill="#451a03" />
      <rect x="40" y="95" width="60" height="40" rx="6" fill="#320d00" />

      {isReading && (
        <>
          <rect x="45" y="100" width="35" height="2.5" rx="1" fill="#38bdf8" opacity="0.9" />
          <rect x="45" y="107" width="25" height="2" rx="1" fill="#38bdf8" opacity="0.7" />
          <rect x="45" y="114" width="35" height="3" rx="1.5" fill="#ef4444" opacity="0.95" style={{ animation: "alert-pulse 1.4s ease-in-out infinite" }} />
        </>
      )}
      {isThinking && (
        <text x="70" y="125" textAnchor="middle" fontSize="16">
          ⚙️
        </text>
      )}
      {isResponding && (
        <text x="70" y="125" textAnchor="middle" fontSize="16">
          ⚡
        </text>
      )}
      {isDone && (
        <text x="70" y="125" textAnchor="middle" fontSize="16">
          ✅
        </text>
      )}

      {/* Belt */}
      <rect x="20" y="140" width="100" height="8" rx="4" fill="#451a03" />
      <rect x="60" y="137" width="20" height="14" rx="3" fill="#d97706" />

      {/* ── Neck ── */}
      <rect x="52" y="72" width="36" height="16" rx="8" fill="#5c2d00" />
      <circle cx="58" cy="80" r="2.5" fill="#d97706" opacity="0.7" />
      <circle cx="82" cy="80" r="2.5" fill="#d97706" opacity="0.7" />

      {/* ── Hard Hat ── */}
      <ellipse cx="70" cy="35" rx="54" ry="8" fill="#d97706" />
      <ellipse cx="70" cy="20" rx="48" ry="18" fill="#f59e0b" />
      <rect x="16" y="28" width="108" height="10" rx="5" fill="#d97706" />

      {/* Hat shine */}
      <ellipse cx="70" cy="16" rx="36" ry="8" fill="white" opacity="0.15" />

      {/* Hat rivet */}
      <circle cx="70" cy="8" r="3.5" fill="#d97706" />
      <circle cx="70" cy="8" r="2" fill="#fef3c7" opacity="0.6" />

      {/* ── Head (below hat) ── */}
      <rect x="22" y="32" width="96" height="42" rx="14" fill="#fbbf24" />

      {/* Cheek blush */}
      <ellipse cx="28" cy="55" rx="9" ry="7" fill="#f59e0b" opacity="0.4" />
      <ellipse cx="112" cy="55" rx="9" ry="7" fill="#f59e0b" opacity="0.4" />

      {/* ── Eyes ── */}
      {isThinking ? (
        <>
          <ellipse cx="42" cy="48" rx="12" ry="10" fill="#fef3c7" />
          <ellipse cx="42" cy="48" rx="9" ry="7" fill="#fbbf24" />
          <circle cx="42" cy="45" r="3.5" fill="#1c0a00" />
          <circle cx="43" cy="44" r="1.5" fill="white" opacity="0.9" />
          <ellipse cx="98" cy="48" rx="12" ry="10" fill="#fef3c7" />
          <ellipse cx="98" cy="48" rx="9" ry="7" fill="#fbbf24" />
          <circle cx="98" cy="45" r="3.5" fill="#1c0a00" />
          <circle cx="99" cy="44" r="1.5" fill="white" opacity="0.9" />
        </>
      ) : (
        <>
          <ellipse cx="42" cy="50" rx="13" ry="11" fill="#1c0a00" />
          <ellipse cx="42" cy="50" rx="10" ry="8" fill="#d97706" />
          <circle cx="42" cy="47" r="4" fill="white" opacity="0.85" />
          <circle cx="43" cy="46" r="2" fill="#d97706" opacity="0.4" />
          <ellipse cx="98" cy="50" rx="13" ry="11" fill="#1c0a00" />
          <ellipse cx="98" cy="50" rx="10" ry="8" fill="#d97706" />
          <circle cx="98" cy="47" r="4" fill="white" opacity="0.85" />
          <circle cx="99" cy="46" r="2" fill="#d97706" opacity="0.4" />
        </>
      )}

      {/* ── Eyebrows ── */}
      {isThinking && (
        <>
          <rect x="33" y="36" width="22" height="4" rx="2" fill="#451a03" transform="rotate(-8 44 38)" />
          <rect x="65" y="36" width="22" height="4" rx="2" fill="#451a03" transform="rotate(8 76 38)" />
        </>
      )}

      {/* ── Mouth ── */}
      {isResponding ? (
        <path d="M 42 65 Q 70 75 98 65" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
      ) : isThinking ? (
        <path d="M 46 67 Q 70 64 94 67" fill="none" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
      ) : isDone ? (
        <path d="M 42 65 Q 70 75 98 65" fill="none" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M 44 66 Q 70 72 96 66" fill="none" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* ── Gear bubbles when thinking ── */}
      {isThinking && (
        <>
          <circle cx="118" cy="38" r="5" fill="#fbbf24" opacity="0.75" style={{ animation: "think-bob 1.4s ease-in-out infinite" }} />
          <text x="118" y="43" textAnchor="middle" fontSize="7">
            ⚙
          </text>
        </>
      )}

      {/* ── Done badge ── */}
      {isDone && (
        <>
          <circle cx="115" cy="28" r="12" fill="#14532d" />
          <circle cx="115" cy="28" r="10" fill="#16a34a" />
          <text x="115" y="33" textAnchor="middle" fontSize="11" fill="white">
            ✓
          </text>
        </>
      )}
    </svg>
  );
}

export default function CuteBot({ robotType, act = "Idle" }) {
  return robotType === "monitor" ? <MonitorBot act={act} /> : <WorkerBot act={act} />;
}
