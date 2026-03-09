import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
   OFFICE CUBICLE SCENE
   ─────────────────────────────────────────────────────────────────
   Two states:
     "overview"  → wide office floor with many cubicles, two robots
                   visible in the active cubicle in the centre
     "zoomed"    → smooth CSS transform zooms into the active cubicle,
                   speech bubbles appear, agent name-tags visible
   Transition is pure CSS cubic-bezier on transform + clip + opacity.
   ══════════════════════════════════════════════════════════════════ */

/* ─── Minimal robot SVGs (compact, for cubicle scale) ─────────── */

function RobotMonitor({ act }) {
  const responding = act === "Responding";
  const thinking = act === "Thinking";
  const reading = act === "Reading";
  return (
    <svg viewBox="0 0 56 80" fill="none" className="cubicle-robot">
      {/* body */}
      <rect
        x="14"
        y="38"
        width="28"
        height="26"
        rx="7"
        fill={responding ? "#0ea5e9" : "#1e3a5f"}
      />
      {/* badge */}
      <rect
        x="22"
        y="44"
        width="12"
        height="8"
        rx="3"
        fill="#0ea5e9"
        opacity="0.6"
      />
      <circle cx="28" cy="48" r="2.5" fill="#38bdf8" />
      {/* arms */}
      <path
        d="M14 44 Q6 52 5 62"
        strokeWidth="7"
        stroke={responding ? "#0ea5e9" : "#1e3a5f"}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M42 44 Q50 52 51 62"
        strokeWidth="7"
        stroke={responding ? "#0ea5e9" : "#1e3a5f"}
        strokeLinecap="round"
        fill="none"
      />
      {/* head */}
      <rect x="16" y="10" width="24" height="28" rx="10" fill="#fbbf24" />
      {/* hair */}
      <rect x="16" y="9" width="24" height="10" rx="6" fill="#1e293b" />
      {/* eyes */}
      <rect x="18" y="21" width="8" height="6" rx="4" fill="#fff" />
      <rect x="30" y="21" width="8" height="6" rx="4" fill="#fff" />
      <circle cx="22" cy={thinking ? 22 : 24} r="2.5" fill="#1e293b" />
      <circle cx="34" cy={thinking ? 22 : 24} r="2.5" fill="#1e293b" />
      {/* mouth */}
      {responding ? (
        <path
          d="M21 33 Q28 38 35 33"
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M21 33 Q28 36 35 33"
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {/* glasses when reading */}
      {reading && (
        <>
          <rect
            x="16"
            y="19"
            width="10"
            height="9"
            rx="5"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.2"
            opacity="0.5"
          />
          <rect
            x="30"
            y="19"
            width="10"
            height="9"
            rx="5"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.2"
            opacity="0.5"
          />
          <line
            x1="26"
            y1="23"
            x2="30"
            y2="23"
            stroke="#1e293b"
            strokeWidth="1.2"
          />
        </>
      )}
      {/* headset */}
      {responding && (
        <>
          <path
            d="M16 18 Q16 6 28 6 Q40 6 40 18"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="11" y="16" width="6" height="9" rx="3" fill="#0ea5e9" />
          <rect x="39" y="16" width="6" height="9" rx="3" fill="#0ea5e9" />
        </>
      )}
      {/* thinking bubbles */}
      {thinking && (
        <>
          <circle
            cx="42"
            cy="14"
            r="2.5"
            fill="#a78bfa"
            opacity="0.7"
            style={{ animation: "think-pop 1.2s ease-in-out infinite" }}
          />
          <circle
            cx="47"
            cy="8"
            r="3.5"
            fill="#a78bfa"
            opacity="0.8"
            style={{ animation: "think-pop 1.2s ease-in-out infinite 0.2s" }}
          />
          <circle
            cx="53"
            cy="2"
            r="4.5"
            fill="#a78bfa"
            opacity="0.9"
            style={{ animation: "think-pop 1.2s ease-in-out infinite 0.4s" }}
          />
        </>
      )}
    </svg>
  );
}

function RobotWorker({ act }) {
  const responding = act === "Responding";
  const thinking = act === "Thinking";
  const reading = act === "Reading";
  return (
    <svg viewBox="0 0 56 80" fill="none" className="cubicle-robot">
      {/* body */}
      <rect
        x="10"
        y="38"
        width="36"
        height="28"
        rx="8"
        fill={responding ? "#16a34a" : "#14532d"}
      />
      {/* hi-vis stripe */}
      <rect
        x="10"
        y="50"
        width="36"
        height="5"
        fill={responding ? "#4ade80" : "#22c55e"}
        opacity="0.5"
      />
      <rect x="26" y="38" width="4" height="28" fill="#22c55e" opacity="0.25" />
      {/* arms */}
      <path
        d="M10 46 Q2 54 1 66"
        strokeWidth="8"
        stroke={responding ? "#16a34a" : "#14532d"}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M46 46 Q54 54 55 66"
        strokeWidth="8"
        stroke={responding ? "#16a34a" : "#14532d"}
        strokeLinecap="round"
        fill="none"
      />
      {/* hard hat */}
      <ellipse cx="28" cy="14" rx="18" ry="6" fill="#fbbf24" />
      <rect x="10" y="12" width="36" height="5" rx="2.5" fill="#f59e0b" />
      <ellipse cx="28" cy="17" rx="20" ry="3.5" fill="#f59e0b" />
      {/* head */}
      <rect x="14" y="14" width="28" height="26" rx="10" fill="#fbbf24" />
      {/* eyes */}
      <rect x="17" y="22" width="8" height="6" rx="4" fill="#fff" />
      <rect x="31" y="22" width="8" height="6" rx="4" fill="#fff" />
      <circle cx="21" cy={thinking ? 23 : 25} r="2.5" fill="#1e293b" />
      <circle cx="35" cy={thinking ? 23 : 25} r="2.5" fill="#1e293b" />
      {/* brows thinking */}
      {thinking && (
        <>
          <path
            d="M17 20 Q21 17 25 20"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M31 20 Q35 17 39 20"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
      {/* mouth */}
      {responding ? (
        <path
          d="M20 33 Q28 39 36 33"
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M20 34 Q28 37 36 34"
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {/* radio earpiece */}
      {responding && (
        <>
          <circle cx="14" cy="28" r="3" fill="#16a34a" />
          <path
            d="M11 28 Q8 23 8 19"
            fill="none"
            stroke="#4ade80"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
      {/* thinking gears */}
      {thinking && (
        <>
          <circle
            cx="44"
            cy="14"
            r="2.5"
            fill="#fbbf24"
            opacity="0.7"
            style={{ animation: "think-pop 1.2s ease-in-out infinite 0.1s" }}
          />
          <circle
            cx="49"
            cy="7"
            r="3.5"
            fill="#fbbf24"
            opacity="0.8"
            style={{ animation: "think-pop 1.2s ease-in-out infinite 0.25s" }}
          />
          <text x="49" y="11" textAnchor="middle" fontSize="5">
            ⚙
          </text>
          <circle
            cx="55"
            cy="1"
            r="4.5"
            fill="#fbbf24"
            opacity="0.9"
            style={{ animation: "think-pop 1.2s ease-in-out infinite 0.45s" }}
          />
          <text x="55" y="5" textAnchor="middle" fontSize="7">
            ⚙
          </text>
        </>
      )}
      {/* clipboard when reading */}
      {reading && (
        <>
          <rect x="46" y="52" width="12" height="16" rx="2" fill="#0f172a" />
          <rect x="47" y="53" width="10" height="12" rx="1" fill="#1e3a5f" />
          <rect
            x="49"
            y="56"
            width="6"
            height="1.5"
            rx="0.5"
            fill="#38bdf8"
            opacity="0.8"
          />
          <rect
            x="49"
            y="59"
            width="4"
            height="1.5"
            rx="0.5"
            fill="#38bdf8"
            opacity="0.6"
          />
          <rect
            x="49"
            y="62"
            width="5"
            height="1.5"
            rx="0.5"
            fill="#ef4444"
            opacity="0.8"
          />
        </>
      )}
    </svg>
  );
}

/* ─── Speech Bubble ────────────────────────────────────────────── */
function SpeechBubble({ text, act, side }) {
  const isThinking = act === "Thinking";
  if (!text || text === "...") return null;
  return (
    <div
      className={`scene-bubble scene-bubble--${side} ${isThinking ? "scene-bubble--thought" : ""}`}
    >
      {isThinking && (
        <div className="scene-bubble-dots">
          <span />
          <span />
          <span />
        </div>
      )}
      <p className="scene-bubble-text">{text}</p>
    </div>
  );
}

/* ─── ACT colour map ────────────────────────────────────────────── */
const ACT_COLORS = {
  Idle: "#9b978f",
  Reading: "#38bdf8",
  Thinking: "#a78bfa",
  Responding: "#4ade80",
};

/* ════════════════════════════════════════════════════════════════
   MAIN SCENE COMPONENT
   Props:
     agents   — array of 0-2 agent objects { agent_name, act, text }
                null = show overview/idle
     zoomed   — bool: true when WS data is active (triggers zoom)
   ════════════════════════════════════════════════════════════════ */
export default function OfficeCubicleScene({ agents, zoomed }) {
  const monitor =
    agents?.find(
      (a) =>
        a.agent_name?.toLowerCase().includes("monitor") ||
        a.agent_name?.toLowerCase().includes("aria"),
    ) ||
    agents?.[0] ||
    null;

  const worker =
    agents?.find(
      (a) =>
        a.agent_name?.toLowerCase().includes("worker") ||
        a.agent_name?.toLowerCase().includes("bot"),
    ) ||
    agents?.[1] ||
    null;

  const monAct = monitor?.act || "Idle";
  const wrkAct = worker?.act || "Idle";

  /* active agent for status badge */
  const activeName = (() => {
    if (monAct === "Responding") return monitor?.agent_name;
    if (wrkAct === "Responding") return worker?.agent_name;
    if (monAct !== "Idle") return monitor?.agent_name;
    if (wrkAct !== "Idle") return worker?.agent_name;
    return null;
  })();

  return (
    <div className={`office-scene ${zoomed ? "office-scene--zoomed" : ""}`}>
      {/* ── The full zooming viewport ── */}
      <div className="office-scene__viewport">
        {/* ═══ OFFICE FLOOR SVG ════════════════════════════════ */}
        <svg
          viewBox="0 0 900 560"
          fill="none"
          className="office-floor-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── Floor ── */}
          <rect width="900" height="560" fill="#f4eed8" />

          {/* ── Floor tiles ── */}
          {Array.from({ length: 18 }, (_, col) =>
            Array.from({ length: 11 }, (_, row) => (
              <rect
                key={`${col}-${row}`}
                x={col * 50}
                y={row * 50}
                width="50"
                height="50"
                fill="none"
                stroke="#ebe3c8"
                strokeWidth="0.8"
              />
            )),
          )}

          {/* ── Ceiling light bars ── */}
          {[150, 450, 750].map((x) => (
            <g key={x}>
              <rect
                x={x - 60}
                y="0"
                width="120"
                height="14"
                rx="4"
                fill="#e8dfc8"
              />
              <rect
                x={x - 55}
                y="3"
                width="110"
                height="6"
                rx="2"
                fill="#fffbf0"
                opacity="0.9"
                style={{ animation: "ceiling-hum 3s ease-in-out infinite" }}
              />
              {/* light cone */}
              <path
                d={`M${x - 55} 14 L${x - 100} 200 L${x + 100} 200 L${x + 55} 14 Z`}
                fill="url(#lightCone)"
                opacity="0.09"
              />
            </g>
          ))}

          <defs>
            <linearGradient id="lightCone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff9e6" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff9e6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ═══════════════════════════════════════════════
              BACKGROUND CUBICLES (decorative, inactive)
              3 × 2 grid, active one is centre (col1, row0)
              ═══════════════════════════════════════════════ */}

          {/* ── Row 0 Left  (col0) ── */}
          <Cubicle x={40} y={80} label="PROC-1" occupied dimmed />
          {/* ── Row 0 RIGHT (col2) ── */}
          <Cubicle x={596} y={80} label="PROC-3" occupied dimmed />
          {/* ── Row 1 Left  ── */}
          <Cubicle x={40} y={340} label="PROC-4" occupied={false} dimmed />
          {/* ── Row 1 Centre ── */}
          <Cubicle x={318} y={340} label="PROC-5" occupied dimmed />
          {/* ── Row 1 Right  ── */}
          <Cubicle x={596} y={340} label="PROC-6" occupied={false} dimmed />

          {/* ═══════════════════════════════════════════════
              ACTIVE CUBICLE — centre (col1, row0)
              This is where the two robots live.
              ═══════════════════════════════════════════════ */}
          <g className="active-cubicle-group">
            {/* cubicle walls */}
            <rect
              x={274}
              y={64}
              width={262}
              height={234}
              rx="0"
              fill="#fffdf7"
              stroke="#c9c0a8"
              strokeWidth="1.5"
            />
            {/* back wall */}
            <rect x={274} y={64} width={262} height={12} fill="#ddd5bc" />
            {/* left wall */}
            <rect x={274} y={64} width={12} height={234} fill="#e5ddc8" />
            {/* right wall */}
            <rect x={524} y={64} width={12} height={234} fill="#e5ddc8" />

            {/* ── Desk ── */}
            <rect
              x={294}
              y={230}
              width={220}
              height={18}
              rx="4"
              fill="#c8b99a"
            />
            <rect
              x={294}
              y={244}
              width={220}
              height={6}
              rx="2"
              fill="#b8a88a"
            />
            {/* desk legs */}
            <rect x={300} y={250} width={8} height={48} rx="3" fill="#a89878" />
            <rect x={500} y={250} width={8} height={48} rx="3" fill="#a89878" />
            {/* desk surface objects */}
            {/* Monitor screen on desk */}
            <rect
              x={370}
              y={180}
              width={68}
              height={48}
              rx="5"
              fill="#1e293b"
            />
            <rect
              x={373}
              y={183}
              width={62}
              height={38}
              rx="3"
              fill={
                monAct === "Reading"
                  ? "#0c1a33"
                  : monAct === "Thinking"
                    ? "#1a0c33"
                    : "#111827"
              }
            />
            {/* screen glow */}
            {monAct !== "Idle" && (
              <rect
                x={373}
                y={183}
                width={62}
                height={38}
                rx="3"
                fill="none"
                stroke={ACT_COLORS[monAct] || "#38bdf8"}
                strokeWidth="1"
                opacity="0.6"
                style={{ animation: "screen-glow 2s ease-in-out infinite" }}
              />
            )}
            {/* monitor stand */}
            <rect x={399} y={226} width={10} height={6} rx="2" fill="#334155" />
            <rect x={392} y={230} width={24} height={4} rx="2" fill="#334155" />
            {/* keyboard */}
            <rect
              x={360}
              y={232}
              width={88}
              height={10}
              rx="3"
              fill="#ddd5bc"
            />
            <rect x={362} y={233} width={84} height={7} rx="2" fill="#ebe3c8" />
            {/* coffee mug */}
            <rect
              x={476}
              y={218}
              width={14}
              height={16}
              rx="3"
              fill="#e8624a"
            />
            <path
              d="M490 222 Q496 222 496 228 Q496 234 490 234"
              fill="none"
              stroke="#e8624a"
              strokeWidth="2.5"
            />
            <rect
              x={477}
              y={220}
              width={12}
              height={4}
              rx="1"
              fill="#f4a49a"
              opacity="0.7"
            />
            {/* sticky notes */}
            <rect
              x={300}
              y={170}
              width={28}
              height={26}
              rx="2"
              fill="#fef3c7"
              opacity="0.9"
            />
            <rect
              x={304}
              y={174}
              width={20}
              height={2}
              rx="1"
              fill="#d4840a"
              opacity="0.4"
            />
            <rect
              x={304}
              y={178}
              width={16}
              height={2}
              rx="1"
              fill="#d4840a"
              opacity="4"
            />
            <rect
              x={304}
              y={182}
              width={18}
              height={2}
              rx="1"
              fill="#d4840a"
              opacity="0.4"
            />
            <rect
              x={300}
              y={200}
              width={26}
              height={24}
              rx="2"
              fill="#d1e8d8"
              opacity="0.9"
            />
            <rect
              x={304}
              y={204}
              width={18}
              height={2}
              rx="1"
              fill="#3d6b4f"
              opacity="0.4"
            />
            <rect
              x={304}
              y={208}
              width={12}
              height={2}
              rx="1"
              fill="#3d6b4f"
              opacity="0.4"
            />
            {/* cubicle label */}
            <rect
              x={274}
              y={64}
              width={262}
              height={22}
              fill="#2e2b24"
              rx="0"
            />
            <text
              x={405}
              y={79}
              textAnchor="middle"
              fontFamily="DM Mono, monospace"
              fontSize="9"
              letterSpacing="2"
              fill="#fbbf52"
            >
              ACTIVE — PROC-2
            </text>

            {/* ─ Robot: Monitor (left side of desk) ─ */}
            <g transform="translate(305, 138)">
              <RobotMonitor act={monAct} />
            </g>

            {/* ─ Robot: Worker (right side of desk) ─ */}
            <g transform="translate(437, 134)">
              <RobotWorker act={wrkAct} />
            </g>

            {/* active glow border */}
            {zoomed && (
              <rect
                x={274}
                y={64}
                width={262}
                height={234}
                rx="0"
                fill="none"
                stroke="#d4840a"
                strokeWidth="2.5"
                opacity="0.5"
                style={{
                  animation: "active-border-pulse 2.5s ease-in-out infinite",
                }}
              />
            )}
          </g>

          {/* ── Far-background: water cooler ── */}
          <g transform="translate(820,80)">
            <rect
              x="0"
              y="0"
              width="28"
              height="60"
              rx="8"
              fill="#dbeafe"
              opacity="0.7"
            />
            <rect
              x="4"
              y="4"
              width="20"
              height="20"
              rx="6"
              fill="#7ab4d8"
              opacity="0.6"
            />
            <rect
              x="8"
              y="28"
              width="12"
              height="28"
              rx="4"
              fill="#bfdbfe"
              opacity="0.8"
            />
            <rect x="10" y="44" width="8" height="6" rx="2" fill="#93c5fd" />
          </g>

          {/* ── Far-background: plant ── */}
          <g transform="translate(30,460)">
            <rect x="8" y="36" width="20" height="24" rx="4" fill="#854d0e" />
            <ellipse
              cx="18"
              cy="36"
              rx="18"
              ry="22"
              fill="#14532d"
              opacity="0.8"
            />
            <ellipse
              cx="6"
              cy="22"
              rx="10"
              ry="14"
              fill="#166534"
              opacity="0.7"
            />
            <ellipse
              cx="30"
              cy="24"
              rx="10"
              ry="13"
              fill="#15803d"
              opacity="0.7"
            />
            <ellipse
              cx="18"
              cy="14"
              rx="10"
              ry="13"
              fill="#16a34a"
              opacity="0.8"
            />
          </g>
          {/* second plant */}
          <g transform="translate(830,440)">
            <rect x="8" y="36" width="16" height="20" rx="3" fill="#854d0e" />
            <ellipse
              cx="16"
              cy="36"
              rx="14"
              ry="18"
              fill="#14532d"
              opacity="0.8"
            />
            <ellipse
              cx="5"
              cy="24"
              rx="8"
              ry="11"
              fill="#166534"
              opacity="0.7"
            />
            <ellipse
              cx="26"
              cy="22"
              rx="9"
              ry="12"
              fill="#15803d"
              opacity="0.7"
            />
          </g>
        </svg>
        {/* end office-floor-svg */}

        {/* ═══════════════════════════════════════════════════════
            SPEECH BUBBLES (overlaid in HTML, positioned over SVG)
            Only shown when zoomed in
            ═══════════════════════════════════════════════════════ */}
        <div
          className={`scene-bubbles-layer ${zoomed ? "scene-bubbles-layer--visible" : ""}`}
        >
          {/* Monitor bubble — top-left of active cubicle */}
          <div className="scene-bubble-anchor scene-bubble-anchor--monitor">
            <SpeechBubble text={monitor?.text} act={monAct} side="left" />
            <div className="scene-agent-nameplate scene-agent-nameplate--monitor">
              <span className="scene-agent-dot" />
              {monitor?.agent_name || "Monitor"}
              <span
                className="scene-agent-act"
                style={{ color: ACT_COLORS[monAct] }}
              >
                {monAct}
              </span>
            </div>
          </div>

          {/* Worker bubble — top-right of active cubicle */}
          <div className="scene-bubble-anchor scene-bubble-anchor--worker">
            <SpeechBubble text={worker?.text} act={wrkAct} side="right" />
            <div className="scene-agent-nameplate scene-agent-nameplate--worker">
              <span className="scene-agent-dot" />
              {worker?.agent_name || "Worker"}
              <span
                className="scene-agent-act"
                style={{ color: ACT_COLORS[wrkAct] }}
              >
                {wrkAct}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* end viewport */}

      {/* ── Zoom-out hint when zoomed ── */}
      {zoomed && activeName && (
        <div className="scene-zoom-badge">
          <span className="scene-zoom-badge-pip" />
          PROC-2 · {activeName}
        </div>
      )}
    </div>
  );
}

/* ─── Reusable decorative background cubicle ──────────────────── */
function Cubicle({ x, y, label, occupied, dimmed }) {
  return (
    <g opacity={dimmed ? 0.55 : 1}>
      {/* walls */}
      <rect
        x={x}
        y={y}
        width={224}
        height={200}
        rx="0"
        fill="#fbf7ee"
        stroke="#c9c0a8"
        strokeWidth="1"
      />
      <rect x={x} y={y} width={224} height={10} fill="#ddd5bc" />
      <rect x={x} y={y} width={10} height={200} fill="#e5ddc8" />
      <rect x={x + 214} y={y} width={10} height={200} fill="#e5ddc8" />
      {/* label bar */}
      <rect x={x} y={y} width={224} height={18} fill="#2e2b24" />
      <text
        x={x + 112}
        y={y + 12}
        textAnchor="middle"
        fontFamily="DM Mono, monospace"
        fontSize="7.5"
        letterSpacing="1.5"
        fill="#9b978f"
      >
        {label}
      </text>
      {/* desk */}
      <rect
        x={x + 16}
        y={y + 148}
        width={192}
        height={14}
        rx="3"
        fill="#c8b99a"
      />
      {/* monitor */}
      <rect
        x={x + 72}
        y={y + 96}
        width={56}
        height={40}
        rx="4"
        fill="#1e293b"
      />
      <rect
        x={x + 75}
        y={y + 99}
        width={50}
        height={30}
        rx="2"
        fill={occupied ? "#0f172a" : "#1e293b"}
      />
      {occupied && (
        <rect
          x={x + 76}
          y={y + 100}
          width={48}
          height={28}
          rx="2"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="0.8"
          opacity="0.3"
          style={{ animation: "screen-glow 4s ease-in-out infinite" }}
        />
      )}
      {/* monitor stand */}
      <rect x={x + 92} y={y + 134} width={8} height={8} rx="2" fill="#334155" />
      <rect
        x={x + 86}
        y={y + 140}
        width={20}
        height={3}
        rx="1.5"
        fill="#334155"
      />
      {/* keyboard */}
      <rect
        x={x + 60}
        y={y + 148}
        width={80}
        height={8}
        rx="2"
        fill="#ddd5bc"
      />
      {/* decorative seated robot silhouette */}
      {occupied && (
        <>
          <rect
            x={x + 92}
            y={y + 52}
            width={20}
            height={42}
            rx="6"
            fill="#1e3a5f"
            opacity="0.6"
          />
          <rect
            x={x + 94}
            y={y + 36}
            width={16}
            height={18}
            rx="8"
            fill="#fbbf24"
            opacity="0.7"
          />
        </>
      )}
      {/* coffee cup */}
      <rect
        x={x + 168}
        y={y + 138}
        width={12}
        height={12}
        rx="2.5"
        fill="#e8624a"
        opacity="0.6"
      />
    </g>
  );
}
