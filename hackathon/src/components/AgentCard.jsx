import React, { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════
   ARIA — Monitor Robot
   Blue/slate palette. Tall, sleek, desk-worker
   vibes. Big visor eyes, antenna, headset.
   ══════════════════════════════════════════ */
function AriaRobot({ act }) {
  const isReading = act === "Reading";
  const isThinking = act === "Thinking";
  const isResponding = act === "Responding";
  const isDone = act === "Done";

  /* dynamic colours */
  const torsoFill = isResponding ? "#1565c0" : isDone ? "#1b5e20" : "#1a3a5c";
  const visorGlow = isReading
    ? "#38bdf8"
    : isThinking
      ? "#c084fc"
      : isResponding
        ? "#34d399"
        : isDone
          ? "#4ade80"
          : "#64748b";

  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="robot-svg"
    >
      {/* ── Ground shadow ── */}
      <ellipse cx="60" cy="176" rx="34" ry="5" fill="rgba(28,26,22,0.10)" />

      {/* ── Feet ── */}
      <rect x="31" y="153" width="22" height="14" rx="7" fill="#0f172a" />
      <rect x="67" y="153" width="22" height="14" rx="7" fill="#0f172a" />
      {/* Foot detail stripe */}
      <rect x="33" y="160" width="18" height="3" rx="1.5" fill="#1e3a5f" />
      <rect x="69" y="160" width="18" height="3" rx="1.5" fill="#1e3a5f" />

      {/* ── Lower legs ── */}
      <rect x="36" y="128" width="16" height="28" rx="6" fill="#163456" />
      <rect x="68" y="128" width="16" height="28" rx="6" fill="#163456" />
      {/* Knee joint */}
      <ellipse cx="44" cy="131" rx="9" ry="7" fill="#1e3a5f" />
      <ellipse cx="76" cy="131" rx="9" ry="7" fill="#1e3a5f" />
      <ellipse cx="44" cy="131" rx="5" ry="4" fill="#0ea5e9" opacity="0.5" />
      <ellipse cx="76" cy="131" rx="5" ry="4" fill="#0ea5e9" opacity="0.5" />

      {/* ── Torso ── */}
      <rect x="24" y="78" width="72" height="56" rx="14" fill={torsoFill} />
      {/* Torso panel recess */}
      <rect x="30" y="84" width="60" height="38" rx="9" fill="#0a1f3d" />
      {/* Panel screen content */}
      {isReading && (
        <>
          <rect
            x="36"
            y="90"
            width="48"
            height="3"
            rx="1.5"
            fill="#38bdf8"
            opacity="0.95"
          />
          <rect
            x="36"
            y="96"
            width="34"
            height="3"
            rx="1.5"
            fill="#7dd3fc"
            opacity="0.7"
          />
          <rect
            x="36"
            y="102"
            width="48"
            height="4"
            rx="2"
            fill="#ef4444"
            opacity="0.9"
            style={{ animation: "alert-pulse 1.4s ease-in-out infinite" }}
          />
          <rect
            x="36"
            y="109"
            width="26"
            height="3"
            rx="1.5"
            fill="#7dd3fc"
            opacity="0.5"
          />
        </>
      )}
      {isThinking && (
        <>
          <rect
            x="36"
            y="90"
            width="48"
            height="3"
            rx="1.5"
            fill="#c084fc"
            opacity="0.8"
          />
          <rect
            x="36"
            y="96"
            width="30"
            height="3"
            rx="1.5"
            fill="#a855f7"
            opacity="0.5"
          />
          <rect
            x="36"
            y="102"
            width="42"
            height="3"
            rx="1.5"
            fill="#c084fc"
            opacity="0.4"
          />
          <rect
            x="36"
            y="108"
            width="22"
            height="3"
            rx="1.5"
            fill="#a855f7"
            opacity="0.3"
          />
        </>
      )}
      {isResponding &&
        [36, 43, 50, 57, 64, 71, 78].map((x, i) => (
          <rect
            key={i}
            x={x}
            y={88 + (i % 4) * 2}
            width="4"
            height={12 - (i % 4) * 2}
            rx="2"
            fill="#34d399"
            opacity="0.9"
            style={{
              animation: `wave-anim ${0.35 + i * 0.06}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      {isDone && (
        <>
          <rect x="36" y="90" width="48" height="28" rx="6" fill="#064e3b" />
          <text x="60" y="109" textAnchor="middle" fontSize="18">
            ✅
          </text>
        </>
      )}
      {!isReading && !isThinking && !isResponding && !isDone && (
        <>
          <rect
            x="36"
            y="91"
            width="48"
            height="2"
            rx="1"
            fill="#334155"
            opacity="0.7"
          />
          <rect
            x="36"
            y="97"
            width="34"
            height="2"
            rx="1"
            fill="#334155"
            opacity="0.5"
          />
          <rect
            x="36"
            y="103"
            width="42"
            height="2"
            rx="1"
            fill="#334155"
            opacity="0.4"
          />
          <rect
            x="36"
            y="109"
            width="24"
            height="2"
            rx="1"
            fill="#334155"
            opacity="0.3"
          />
        </>
      )}

      {/* ── Shoulder joints ── */}
      <ellipse cx="24" cy="87" rx="8" ry="8" fill="#163456" />
      <ellipse cx="96" cy="87" rx="8" ry="8" fill="#163456" />

      {/* ── Arms ── */}
      {/* Left arm */}
      <rect x="8" y="84" width="16" height="42" rx="8" fill="#163456" />
      {/* Right arm */}
      <rect x="96" y="84" width="16" height="42" rx="8" fill="#163456" />
      {/* Elbow stripe */}
      <rect
        x="10"
        y="100"
        width="12"
        height="4"
        rx="2"
        fill="#0ea5e9"
        opacity="0.4"
      />
      <rect
        x="98"
        y="100"
        width="12"
        height="4"
        rx="2"
        fill="#0ea5e9"
        opacity="0.4"
      />
      {/* Hands */}
      <ellipse cx="16" cy="130" rx="9" ry="8" fill="#0f172a" />
      <ellipse cx="104" cy="130" rx="9" ry="8" fill="#0f172a" />
      {/* Finger hints */}
      {[11, 15, 19].map((x, i) => (
        <rect
          key={i}
          x={x}
          y="132"
          width="3"
          height="5"
          rx="1.5"
          fill="#163456"
        />
      ))}
      {[99, 103, 107].map((x, i) => (
        <rect
          key={i}
          x={x}
          y="132"
          width="3"
          height="5"
          rx="1.5"
          fill="#163456"
        />
      ))}

      {/* ── Neck ── */}
      <rect x="48" y="64" width="24" height="16" rx="8" fill="#163456" />
      {/* Neck bolts */}
      <circle cx="52" cy="72" r="3" fill="#0ea5e9" opacity="0.7" />
      <circle cx="68" cy="72" r="3" fill="#0ea5e9" opacity="0.7" />

      {/* ── Head ── */}
      <rect x="18" y="16" width="84" height="52" rx="20" fill="#1e3a5f" />
      {/* Head top shine */}
      <rect
        x="26"
        y="20"
        width="38"
        height="10"
        rx="8"
        fill="rgba(255,255,255,0.07)"
      />
      {/* Head side bolt */}
      <circle cx="18" cy="42" r="5" fill="#0f172a" />
      <circle cx="18" cy="42" r="3" fill="#163456" />
      <circle cx="102" cy="42" r="5" fill="#0f172a" />
      <circle cx="102" cy="42" r="3" fill="#163456" />

      {/* ── Antenna ── */}
      <rect x="57" y="2" width="6" height="16" rx="3" fill="#0f172a" />
      <circle
        cx="60"
        cy="2"
        r="7"
        fill={visorGlow}
        opacity="0.85"
        style={{ animation: "pip-pulse 2s ease-in-out infinite" }}
      />
      <circle cx="60" cy="2" r="4" fill="white" opacity="0.5" />

      {/* ── Visor panel ── */}
      <rect x="26" y="27" width="68" height="24" rx="10" fill="#060d1a" />
      <rect
        x="28"
        y="29"
        width="64"
        height="20"
        rx="8"
        fill={`${visorGlow}1a`}
        style={{
          animation:
            isReading || isResponding
              ? "screen-blink 4s ease-in-out infinite"
              : "none",
        }}
      />
      {/* Visor scan line */}
      <rect
        x="30"
        y="36"
        width="60"
        height="1"
        fill={visorGlow}
        opacity="0.25"
      />

      {/* Eyes inside visor */}
      {isThinking ? (
        <>
          {/* Wide surprised eyes */}
          <ellipse
            cx="44"
            cy="39"
            rx="9"
            ry="8"
            fill={visorGlow}
            opacity="0.2"
          />
          <circle cx="44" cy="39" r="7" fill={visorGlow} opacity="0.9" />
          <circle cx="44" cy="37" r="3" fill="white" opacity="0.95" />
          <circle cx="46" cy="36" r="1.5" fill={visorGlow} opacity="0.7" />
          <ellipse
            cx="76"
            cy="39"
            rx="9"
            ry="8"
            fill={visorGlow}
            opacity="0.2"
          />
          <circle cx="76" cy="39" r="7" fill={visorGlow} opacity="0.9" />
          <circle cx="76" cy="37" r="3" fill="white" opacity="0.95" />
          <circle cx="78" cy="36" r="1.5" fill={visorGlow} opacity="0.7" />
        </>
      ) : (
        <>
          {/* Rectangular visor eyes — reading down if reading, forward otherwise */}
          <rect
            x="33"
            y="32"
            width="22"
            height="14"
            rx="5"
            fill={visorGlow}
            opacity={isReading ? 0.95 : 0.7}
          />
          <rect
            x="65"
            y="32"
            width="22"
            height="14"
            rx="5"
            fill={visorGlow}
            opacity={isReading ? 0.95 : 0.7}
          />
          {/* Pupil dot */}
          <circle
            cx="44"
            cy={isReading ? 42 : 39}
            r="4"
            fill="white"
            opacity="0.55"
          />
          <circle
            cx="76"
            cy={isReading ? 42 : 39}
            r="4"
            fill="white"
            opacity="0.55"
          />
        </>
      )}

      {/* ── Mouth — speaker grille ── */}
      <rect x="38" y="55" width="44" height="8" rx="4" fill="#060d1a" />
      {isResponding
        ? [40, 46, 52, 58, 64, 70, 76].map((x, i) => (
            <rect
              key={i}
              x={x}
              y="56"
              width="3"
              height={3 + (i % 3) * 2}
              rx="1.5"
              fill="#34d399"
              opacity="0.95"
              style={{
                animation: `wave-anim ${0.3 + i * 0.05}s ease-in-out infinite alternate`,
              }}
            />
          ))
        : [40, 46, 52, 58, 64, 70, 76].map((x, i) => (
            <rect
              key={i}
              x={x}
              y="57"
              width="3"
              height="2"
              rx="1"
              fill="#2a4a6e"
              opacity="0.9"
            />
          ))}

      {/* ── Thinking bubbles ── */}
      {isThinking && (
        <>
          <circle
            cx="108"
            cy="34"
            r="4"
            fill="#c084fc"
            opacity="0.7"
            style={{ animation: "think-bob 1.4s ease-in-out infinite" }}
          />
          <circle
            cx="115"
            cy="22"
            r="6"
            fill="#c084fc"
            opacity="0.8"
            style={{ animation: "think-bob 1.4s 0.2s ease-in-out infinite" }}
          />
          <circle
            cx="120"
            cy="9"
            r="8"
            fill="#c084fc"
            opacity="0.9"
            style={{ animation: "think-bob 1.4s 0.4s ease-in-out infinite" }}
          />
          <circle cx="120" cy="9" r="4" fill="white" opacity="0.4" />
        </>
      )}

      {/* ── Headset when Responding ── */}
      {isResponding && (
        <>
          <path
            d="M 18 40 Q 18 8 60 8 Q 102 8 102 40"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <rect x="10" y="37" width="12" height="16" rx="6" fill="#0ea5e9" />
          <rect x="98" y="37" width="12" height="16" rx="6" fill="#0ea5e9" />
          {/* Mic */}
          <path
            d="M 10 50 Q 6 50 6 55"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="6" cy="56" r="2.5" fill="#38bdf8" />
        </>
      )}

      {/* ── Done badge ── */}
      {isDone && (
        <>
          <circle cx="98" cy="24" r="13" fill="#14532d" />
          <circle cx="98" cy="24" r="11" fill="#16a34a" />
          <text x="98" y="29" textAnchor="middle" fontSize="12" fill="white">
            ✓
          </text>
        </>
      )}
    </svg>
  );
}

/* ══════════════════════════════════════════
   BOLT — Worker Robot
   Orange/amber palette. Chunky, stocky,
   hard-hat, tool-belt energy.
   ══════════════════════════════════════════ */
function BoltRobot({ act }) {
  const isReading = act === "Reading";
  const isThinking = act === "Thinking";
  const isResponding = act === "Responding";
  const isDone = act === "Done";

  const torsoFill = isResponding ? "#b45309" : isDone ? "#14532d" : "#78350f";
  const eyeFill = isReading
    ? "#38bdf8"
    : isThinking
      ? "#fbbf24"
      : isResponding
        ? "#4ade80"
        : isDone
          ? "#4ade80"
          : "#d97706";

  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="robot-svg"
    >
      {/* ── Ground shadow ── */}
      <ellipse cx="60" cy="176" rx="36" ry="5" fill="rgba(28,26,22,0.10)" />

      {/* ── Feet — wide work boots ── */}
      <rect x="26" y="152" width="28" height="16" rx="7" fill="#1c0a00" />
      <rect x="66" y="152" width="28" height="16" rx="7" fill="#1c0a00" />
      {/* Boot toe cap */}
      <ellipse cx="39" cy="168" rx="14" ry="5" fill="#2d1200" />
      <ellipse cx="79" cy="168" rx="14" ry="5" fill="#2d1200" />
      {/* Boot highlight */}
      <rect x="30" y="154" width="20" height="4" rx="2" fill="#451a03" />
      <rect x="70" y="154" width="20" height="4" rx="2" fill="#451a03" />

      {/* ── Lower legs — thick ── */}
      <rect x="32" y="126" width="20" height="30" rx="7" fill="#5c2d00" />
      <rect x="68" y="126" width="20" height="30" rx="7" fill="#5c2d00" />
      {/* Knee pad */}
      <rect x="31" y="125" width="22" height="10" rx="5" fill="#d97706" />
      <rect x="67" y="125" width="22" height="10" rx="5" fill="#d97706" />
      <rect
        x="33"
        y="127"
        width="18"
        height="6"
        rx="3"
        fill="#f59e0b"
        opacity="0.7"
      />
      <rect
        x="69"
        y="127"
        width="18"
        height="6"
        rx="3"
        fill="#f59e0b"
        opacity="0.7"
      />

      {/* ── Torso — wide & square ── */}
      <rect x="18" y="74" width="84" height="58" rx="14" fill={torsoFill} />
      {/* Hi-vis chest stripe */}
      <rect
        x="18"
        y="93"
        width="84"
        height="9"
        rx="0"
        fill="#fbbf24"
        opacity="0.35"
      />
      <rect
        x="18"
        y="106"
        width="84"
        height="9"
        rx="0"
        fill="#fbbf24"
        opacity="0.2"
      />
      {/* Chest badge */}
      <rect x="32" y="80" width="36" height="26" rx="7" fill="#451a03" />
      <rect x="35" y="83" width="30" height="20" rx="5" fill="#320d00" />
      {isReading && (
        <>
          <rect
            x="37"
            y="86"
            width="26"
            height="2.5"
            rx="1"
            fill="#38bdf8"
            opacity="0.9"
          />
          <rect
            x="37"
            y="91"
            width="18"
            height="2.5"
            rx="1"
            fill="#7dd3fc"
            opacity="0.7"
          />
          <rect
            x="37"
            y="96"
            width="26"
            height="3"
            rx="1.5"
            fill="#ef4444"
            opacity="0.9"
            style={{ animation: "alert-pulse 1.4s ease-in-out infinite" }}
          />
        </>
      )}
      {isThinking && (
        <text x="50" y="98" textAnchor="middle" fontSize="14">
          ⚙️
        </text>
      )}
      {isResponding && (
        <text x="50" y="98" textAnchor="middle" fontSize="14">
          ⚡
        </text>
      )}
      {isDone && (
        <text x="50" y="98" textAnchor="middle" fontSize="14">
          ✅
        </text>
      )}
      {!isReading && !isThinking && !isResponding && !isDone && (
        <text
          x="50"
          y="96"
          textAnchor="middle"
          fontSize="8"
          fontWeight="700"
          fill="#78350f"
          letterSpacing="1"
        >
          BOLT
        </text>
      )}

      {/* Belt / tool row */}
      <rect x="18" y="126" width="84" height="7" rx="3.5" fill="#451a03" />
      {/* Belt buckle */}
      <rect x="52" y="124" width="16" height="11" rx="3" fill="#d97706" />
      <rect
        x="55"
        y="126"
        width="10"
        height="7"
        rx="2"
        fill="#f59e0b"
        opacity="0.8"
      />

      {/* ── Shoulder joints ── */}
      <ellipse cx="18" cy="84" rx="9" ry="9" fill="#5c2d00" />
      <ellipse cx="102" cy="84" rx="9" ry="9" fill="#5c2d00" />
      <ellipse cx="18" cy="84" rx="5" ry="5" fill="#d97706" opacity="0.5" />
      <ellipse cx="102" cy="84" rx="5" ry="5" fill="#d97706" opacity="0.5" />

      {/* ── Arms — chunky tubes ── */}
      <rect x="4" y="80" width="18" height="44" rx="9" fill="#5c2d00" />
      <rect x="98" y="80" width="18" height="44" rx="9" fill="#5c2d00" />
      {/* Elbow guard */}
      <rect
        x="5"
        y="98"
        width="16"
        height="8"
        rx="4"
        fill="#d97706"
        opacity="0.55"
      />
      <rect
        x="99"
        y="98"
        width="16"
        height="8"
        rx="4"
        fill="#d97706"
        opacity="0.55"
      />
      {/* Hands */}
      <ellipse cx="13" cy="128" rx="10" ry="9" fill="#1c0a00" />
      <ellipse cx="107" cy="128" rx="10" ry="9" fill="#1c0a00" />
      {/* Knuckle bumps */}
      {[8, 12, 16].map((x, i) => (
        <circle key={i} cx={x} cy="123" r="2.5" fill="#451a03" />
      ))}
      {[102, 106, 110].map((x, i) => (
        <circle key={i} cx={x} cy="123" r="2.5" fill="#451a03" />
      ))}
      {/* Wrench in right hand when working */}
      {(isResponding || isReading) && (
        <>
          <rect x="108" y="115" width="24" height="8" rx="4" fill="#b45309" />
          <rect x="128" y="110" width="8" height="18" rx="4" fill="#78350f" />
          <rect x="126" y="108" width="12" height="5" rx="2.5" fill="#d97706" />
          <rect x="126" y="121" width="12" height="5" rx="2.5" fill="#d97706" />
        </>
      )}

      {/* ── Neck ── */}
      <rect x="46" y="62" width="28" height="14" rx="7" fill="#5c2d00" />
      {/* Neck collar bolts */}
      <circle cx="51" cy="69" r="4" fill="#d97706" opacity="0.8" />
      <circle cx="51" cy="69" r="2" fill="#f59e0b" opacity="0.6" />
      <circle cx="69" cy="69" r="4" fill="#d97706" opacity="0.8" />
      <circle cx="69" cy="69" r="2" fill="#f59e0b" opacity="0.6" />

      {/* ── Hard hat ── */}
      {/* Brim */}
      <ellipse cx="60" cy="36" rx="48" ry="7" fill="#d97706" />
      {/* Dome */}
      <ellipse cx="60" cy="22" rx="42" ry="20" fill="#f59e0b" />
      {/* Hat band */}
      <rect x="18" y="30" width="84" height="9" rx="4" fill="#d97706" />
      {/* Hat brim underside */}
      <ellipse cx="60" cy="37" rx="46" ry="5" fill="#b45309" opacity="0.5" />
      {/* Hat stripe / logo area */}
      <rect
        x="44"
        y="16"
        width="32"
        height="10"
        rx="5"
        fill="white"
        opacity="0.2"
      />
      {/* Hat rivet */}
      <circle cx="60" cy="10" r="4" fill="#d97706" opacity="0.7" />
      <circle cx="60" cy="10" r="2" fill="#fef3c7" opacity="0.6" />

      {/* ── Head (below hat) ── */}
      <rect x="20" y="30" width="80" height="36" rx="12" fill="#fbbf24" />
      {/* Head cheek blush */}
      <ellipse cx="28" cy="50" rx="8" ry="6" fill="#f59e0b" opacity="0.4" />
      <ellipse cx="92" cy="50" rx="8" ry="6" fill="#f59e0b" opacity="0.4" />

      {/* ── Eyes — big round bolt-style ── */}
      {isThinking ? (
        <>
          {/* Squinting furrowed look */}
          <ellipse cx="43" cy="43" rx="12" ry="10" fill="#fef3c7" />
          <ellipse cx="43" cy="43" rx="9" ry="7" fill={eyeFill} />
          <circle cx="43" cy="40" r="3.5" fill="#1c0a00" />
          <circle cx="44" cy="39" r="1.5" fill="white" opacity="0.9" />
          <ellipse cx="77" cy="43" rx="12" ry="10" fill="#fef3c7" />
          <ellipse cx="77" cy="43" rx="9" ry="7" fill={eyeFill} />
          <circle cx="77" cy="40" r="3.5" fill="#1c0a00" />
          <circle cx="78" cy="39" r="1.5" fill="white" opacity="0.9" />
        </>
      ) : (
        <>
          <ellipse cx="43" cy="44" rx="13" ry="11" fill="#1c0a00" />
          <ellipse cx="43" cy="44" rx="10" ry="8" fill={eyeFill} />
          <circle cx="43" cy="41" r="4" fill="white" opacity="0.85" />
          <circle cx="44" cy="40" r="2" fill={eyeFill} opacity="0.4" />
          <ellipse cx="77" cy="44" rx="13" ry="11" fill="#1c0a00" />
          <ellipse cx="77" cy="44" rx="10" ry="8" fill={eyeFill} />
          <circle cx="77" cy="41" r="4" fill="white" opacity="0.85" />
          <circle cx="78" cy="40" r="2" fill={eyeFill} opacity="0.4" />
        </>
      )}

      {/* ── Eyebrows — heavy, expressive ── */}
      {isThinking ? (
        <>
          <rect
            x="33"
            y="32"
            width="22"
            height="4"
            rx="2"
            fill="#451a03"
            transform="rotate(-8 44 34)"
          />
          <rect
            x="65"
            y="32"
            width="22"
            height="4"
            rx="2"
            fill="#451a03"
            transform="rotate(8 76 34)"
          />
        </>
      ) : isResponding ? (
        <>
          <rect
            x="34"
            y="33"
            width="20"
            height="3.5"
            rx="1.75"
            fill="#451a03"
          />
          <rect
            x="66"
            y="33"
            width="20"
            height="3.5"
            rx="1.75"
            fill="#451a03"
          />
        </>
      ) : (
        <>
          <rect
            x="33"
            y="34"
            width="22"
            height="3"
            rx="1.5"
            fill="#451a03"
            opacity="0.9"
          />
          <rect
            x="65"
            y="34"
            width="22"
            height="3"
            rx="1.5"
            fill="#451a03"
            opacity="0.9"
          />
        </>
      )}

      {/* ── Nose — small bump ── */}
      <ellipse cx="60" cy="52" rx="4" ry="3" fill="#f59e0b" opacity="0.7" />

      {/* ── Mouth ── */}
      {isResponding ? (
        <path
          d="M 42 60 Q 60 70 78 60"
          fill="none"
          stroke="#451a03"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : isThinking ? (
        <path
          d="M 46 62 Q 60 59 74 62"
          fill="none"
          stroke="#451a03"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : isDone ? (
        <path
          d="M 42 60 Q 60 70 78 60"
          fill="none"
          stroke="#451a03"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M 44 61 Q 60 67 76 61"
          fill="none"
          stroke="#451a03"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}

      {/* ── Thinking gear bubbles ── */}
      {isThinking && (
        <>
          <circle
            cx="108"
            cy="30"
            r="5"
            fill="#fbbf24"
            opacity="0.75"
            style={{ animation: "think-bob 1.4s ease-in-out infinite" }}
          />
          <text x="108" y="34" textAnchor="middle" fontSize="7">
            ⚙
          </text>
          <circle
            cx="115"
            cy="18"
            r="7"
            fill="#fbbf24"
            opacity="0.85"
            style={{ animation: "think-bob 1.4s 0.22s ease-in-out infinite" }}
          />
          <text x="115" y="23" textAnchor="middle" fontSize="10">
            ⚙
          </text>
          <circle
            cx="121"
            cy="5"
            r="9"
            fill="#fbbf24"
            opacity="0.95"
            style={{ animation: "think-bob 1.4s 0.44s ease-in-out infinite" }}
          />
          <text x="121" y="10" textAnchor="middle" fontSize="12">
            ⚙
          </text>
        </>
      )}

      {/* ── Radio earpiece for Responding ── */}
      {isResponding && (
        <>
          <circle cx="20" cy="48" r="6" fill="#78350f" />
          <circle cx="20" cy="48" r="4" fill="#d97706" />
          <path
            d="M 14 48 Q 8 44 8 38"
            fill="none"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="37" r="3" fill="#fbbf24" opacity="0.8" />
        </>
      )}

      {/* ── Done badge ── */}
      {isDone && (
        <>
          <circle cx="22" cy="22" r="13" fill="#14532d" />
          <circle cx="22" cy="22" r="11" fill="#16a34a" />
          <text x="22" y="27" textAnchor="middle" fontSize="12" fill="white">
            ✓
          </text>
        </>
      )}
    </svg>
  );
}

/* ══════════════════════════════════════════
   COMIC SPEECH BUBBLE
   ══════════════════════════════════════════ */
function ComicBubble({ text, act, side, animKey }) {
  const isThinking = act === "Thinking";
  const isDone = act === "Done";
  const borderColor = isDone ? "var(--sage)" : "var(--ink-0)";
  const bgColor = isDone ? "var(--sage-lt)" : "var(--cream-0)";
  const tailLeft = side === "left";

  return (
    <div
      key={animKey}
      className={`comic-bubble comic-bubble--enter comic-bubble--${isThinking ? "thought" : "speech"} comic-bubble--${side}`}
      style={{ "--bubble-bg": bgColor, "--bubble-border": borderColor }}
    >
      {isThinking && (
        <div className="think-dots-inline">
          <span />
          <span />
          <span />
        </div>
      )}
      <p className="comic-bubble__text">{text}</p>

      {/* Tail */}
      {!isThinking && <div className="comic-bubble__tail" />}

      {/* Thought trail */}
      {isThinking && (
        <div className={`comic-bubble__trail comic-bubble__trail--${side}`}>
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   AGENT CARD V2 — slim card below cubicle
   ══════════════════════════════════════════ */
export default function AgentCard({ agentData, side, isEntering }) {
  const { agent_name = "?", act = "Idle", text = "…" } = agentData || {};
  const isMonitor = side === "left";

  const [bubbleKey, setBubbleKey] = useState(0);
  const prevRef = useRef({ act, text });

  useEffect(() => {
    if (act !== prevRef.current.act || text !== prevRef.current.text) {
      setBubbleKey((k) => k + 1);
      prevRef.current = { act, text };
    }
  }, [act, text]);

  const accentColor = isMonitor ? "var(--blue)" : "var(--sage)";
  const accentBg = isMonitor ? "var(--blue-lt)" : "var(--sage-lt)";
  const accentBorder = isMonitor ? "var(--blue-md)" : "var(--sage-md)";
  const actLabels = {
    Reading: "Reading",
    Thinking: "Thinking…",
    Responding: "Responding",
    Idle: "Idle",
    Done: "Done ✓",
  };

  const bobSpeed =
    act === "Responding"
      ? "robot-bob 0.65s ease-in-out infinite"
      : "robot-bob 3.2s ease-in-out infinite";

  return (
    <div
      className={[
        "agent-card-v2",
        `agent-card-v2--${side}`,
        isEntering ? "agent-card-v2--entering" : "",
      ].join(" ")}
    >
      {/* Name badge */}
      <div
        className="agent-card-v2__badge"
        style={{
          color: accentColor,
          background: accentBg,
          borderColor: accentBorder,
        }}
      >
        <span className="agent-card-v2__badge-dot" />
        {agent_name}
      </div>

      {/* Act label */}
      <div className="agent-card-v2__act-label" style={{ color: accentColor }}>
        {actLabels[act] || act}
      </div>

      {/* Speech bubble */}
      <div className="agent-card-v2__bubble-area">
        <ComicBubble text={text} act={act} side={side} animKey={bubbleKey} />
      </div>

      {/* Robot character */}
      <div className="robot-wrap" style={{ animation: bobSpeed }}>
        {isMonitor ? <AriaRobot act={act} /> : <BoltRobot act={act} />}
      </div>
    </div>
  );
}
