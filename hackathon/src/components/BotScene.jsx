import React, { useState, useEffect, useRef } from "react";
import RobotSVG from "./RobotSVG";

/* ─── Typewriter text ────────────────────────────────────────────────────────── */
function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!text) return;
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  const done = displayed.length >= (text?.length ?? 0);
  return (
    <>
      {displayed}
      {!done && (
        <span
          style={{
            opacity: 0.6,
            animation: "cursor-blink 0.6s step-end infinite",
            fontWeight: 700,
          }}
        >
          ▋
        </span>
      )}
    </>
  );
}

/* ─── Speech bubble ─────────────────────────────────────────────────────────── */
function InlineBubble({ text, act }) {
  if (!text) return null;
  const isThought = act === "Thinking";

  if (isThought) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 3,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {[4, 6, 8].map((s, i) => (
            <div
              key={i}
              style={{
                width: s,
                height: s,
                borderRadius: "50%",
                background: "#DDD5BC",
                animation: `think-bob 2s ease-in-out infinite ${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            background: "#FFFDF7",
            border: "2px dashed #1C1A16",
            borderRadius: 16,
            padding: "8px 12px",
            maxWidth: 190,
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "11px",
            lineHeight: 1.55,
            color: "#2E2B24",
            wordBreak: "break-word",
            animation:
              "bubble-appear 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <TypewriterText text={text} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FFFDF7",
        border: "2px solid #1C1A16",
        borderRadius: 10,
        padding: "8px 12px",
        maxWidth: 190,
        fontFamily: "'DM Mono','Courier New',monospace",
        fontSize: "11px",
        lineHeight: 1.55,
        color: "#2E2B24",
        boxShadow: "2px 2px 0 #1C1A16",
        wordBreak: "break-word",
        position: "relative",
        marginBottom: 12,
        flexShrink: 0,
        animation: "bubble-appear 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      <TypewriterText text={text} />
      <div
        style={{
          position: "absolute",
          bottom: -10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "10px solid #1C1A16",
        }}
      />
    </div>
  );
}

/* ─── Name plate ─────────────────────────────────────────────────────────────── */
function NamePlate({ name, act, accentColor, x, y }) {
  const isDone = act === "done";
  const statusText = isDone ? "✓ DONE" : (act || "IDLE").toUpperCase();
  return (
    <g>
      <rect
        x={x - Math.max(56, name.length * 3 + 30)}
        y={y}
        width={Math.max(112, name.length * 6 + 60)}
        height="20"
        rx="6"
        fill="#FFFDF7"
        stroke="#DDD5BC"
        strokeWidth="1.2"
      />
      <rect
        x={x - Math.max(56, name.length * 3 + 30)}
        y={y}
        width={Math.max(112, name.length * 6 + 60)}
        height="20"
        rx="6"
        fill={accentColor}
        opacity="0.05"
      />
      <circle
        cx={x - Math.max(56, name.length * 3 + 30) + 16}
        cy={y + 10}
        r="3.5"
        fill={accentColor}
      />
      <text
        x={x - Math.max(56, name.length * 3 + 30) + 27}
        y={y + 13.5}
        fill="#2E2B24"
        fontSize="7.5"
        fontFamily="'DM Mono','Courier New',monospace"
        fontWeight="600"
        letterSpacing="0.04em"
      >
        {name}
      </text>
      <text
        x={
          x -
          Math.max(56, name.length * 3 + 30) +
          Math.max(112, name.length * 6 + 60) -
          6
        }
        y={y + 12.5}
        fill={accentColor}
        fontSize="6"
        fontFamily="monospace"
        letterSpacing="0.06em"
        textAnchor="end"
      >
        ({statusText})
      </text>
    </g>
  );
}

/* ─── Bot station via foreignObject ──────────────────────────────────────────── */
function BotStation({
  bot,
  foX,
  foY,
  foW,
  foH,
  accentColor,
  isNew,
  bubbleKey,
  walksIn,
  skin,
}) {
  if (!bot) return null;
  const act = bot.status === "done" ? "Idle" : bot.act || "Idle";

  return (
    <foreignObject x={foX} y={foY} width={foW} height={foH}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          paddingBottom: 0,
        }}
      >
        <InlineBubble key={bubbleKey} text={bot.text} act={bot.act} />
        <div
          style={{
            animation: walksIn
              ? "worker-walk-in 0.9s cubic-bezier(0.22,1,0.36,1) both"
              : isNew
                ? "card-bounce-in 0.65s cubic-bezier(0.34,1.56,0.64,1) both"
                : "none",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <RobotSVG act={act} accentColor={accentColor} size={92} skin={skin} />
        </div>
      </div>
    </foreignObject>
  );
}

/* ─── Main scene ─────────────────────────────────────────────────────────────── */
export default function BotScene({ monitorBot, workerBot, skin = 0 }) {
  const isAlone = !workerBot;

  const [monitorIsNew, setMonitorIsNew] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setMonitorIsNew(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const [workerWalksIn, setWorkerWalksIn] = useState(false);
  const [workerIsNew, setWorkerIsNew] = useState(false);
  const prevWorkerRef = useRef(null);
  useEffect(() => {
    if (!workerBot) {
      prevWorkerRef.current = null;
      return;
    }
    if (workerBot.agent_name !== prevWorkerRef.current) {
      prevWorkerRef.current = workerBot.agent_name;
      setWorkerWalksIn(true);
      setWorkerIsNew(true);
      const t = setTimeout(() => {
        setWorkerWalksIn(false);
        setWorkerIsNew(false);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [workerBot?.agent_name]);

  const [mBubbleKey, setMBubbleKey] = useState(0);
  const [wBubbleKey, setWBubbleKey] = useState(0);
  const prevMText = useRef("");
  const prevWText = useRef("");
  useEffect(() => {
    if (monitorBot?.text !== prevMText.current) {
      prevMText.current = monitorBot?.text || "";
      setMBubbleKey((k) => k + 1);
    }
  }, [monitorBot?.text]);
  useEffect(() => {
    if (workerBot?.text !== prevWText.current) {
      prevWText.current = workerBot?.text || "";
      setWBubbleKey((k) => k + 1);
    }
  }, [workerBot?.text]);

  // ── Layout constants ──
  const VW = 860,
    VH = 500;
  const FO_W = 152,
    FO_H = 220,
    FO_Y = 58;

  const DESK_Y = 262,
    DESK_H = 48,
    DESK_W = 208;
  const PLATE_Y = DESK_Y + DESK_H + 5;
  const MON_Y = 213,
    MON_H = 54,
    MON_W = 92;
  const CHAIR_Y = 356;

  const SOLO_CX = 430;
  const SOLO_FO_X = SOLO_CX - FO_W / 2;
  const SOLO_DX = SOLO_CX - DESK_W / 2;

  const LEFT_CX = 220,
    RIGHT_CX = 640;
  const LEFT_FO_X = LEFT_CX - FO_W / 2;
  const RIGHT_FO_X = RIGHT_CX - FO_W / 2;
  const LEFT_DX = LEFT_CX - DESK_W / 2;
  const RIGHT_DX = RIGHT_CX - DESK_W / 2;

  const mAc = "#2A5F8F",
    wAc = "#3D6B4F";
  const mActive =
    monitorBot?.act === "Responding" || monitorBot?.act === "Reading";
  const wActive =
    workerBot?.act === "Responding" || workerBot?.act === "Reading";

  return (
    <div
      className="bot-scene"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bs-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAF5EC" />
            <stop offset="100%" stopColor="#EDE4D4" />
          </linearGradient>
          <linearGradient id="bs-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8DFCA" />
            <stop offset="100%" stopColor="#D8CEBC" />
          </linearGradient>
          <linearGradient id="bs-desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EAE0C8" />
            <stop offset="100%" stopColor="#D4C8B0" />
          </linearGradient>
          <linearGradient id="bs-desk-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8BCA0" />
            <stop offset="100%" stopColor="#B8AC94" />
          </linearGradient>
          <linearGradient id="bs-screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D1B2C" />
            <stop offset="100%" stopColor="#061018" />
          </linearGradient>
          <linearGradient id="bs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8D8F8" />
            <stop offset="60%" stopColor="#D4EAF8" />
            <stop offset="100%" stopColor="#E8F4FC" />
          </linearGradient>
          <linearGradient id="bs-partition" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D4CCBA" />
            <stop offset="100%" stopColor="#C4BCA8" />
          </linearGradient>
          <linearGradient id="bs-carpet" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3A4A5A" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#3A4A5A" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#3A4A5A" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="bs-chair-seat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8B0A0" />
            <stop offset="100%" stopColor="#A0988A" />
          </linearGradient>
          <radialGradient id="bs-spot-l" cx="50%" cy="20%" r="60%">
            <stop offset="0%" stopColor="rgba(180,210,240,0.22)" />
            <stop offset="100%" stopColor="rgba(180,210,240,0)" />
          </radialGradient>
          <radialGradient id="bs-spot-r" cx="50%" cy="20%" r="60%">
            <stop offset="0%" stopColor="rgba(140,200,170,0.2)" />
            <stop offset="100%" stopColor="rgba(140,200,170,0)" />
          </radialGradient>
          <radialGradient id="bs-bloom" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="rgba(255,248,200,0.6)" />
            <stop offset="100%" stopColor="rgba(255,248,200,0)" />
          </radialGradient>
          <radialGradient id="bs-floor-ao" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          {/* Filters */}
          <filter id="bs-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="6"
              floodColor="#1C1A16"
              floodOpacity="0.14"
            />
          </filter>
          <filter id="bs-glow-b">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bs-glow-g">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Clip paths */}
          <clipPath id="bs-win-clip">
            <rect x="0" y="0" width="860" height="500" />
          </clipPath>
          {/* Keyframes */}
          <style>{`
            @keyframes worker-walk-in {
              0%   { transform: translateX(96px); opacity:0; }
              35%  { opacity:1; }
              72%  { transform: translateX(-7px); }
              87%  { transform: translateX(3px); }
              100% { transform: translateX(0); opacity:1; }
            }
            @keyframes card-bounce-in {
              0%   { transform: scale(0.72) translateY(18px); opacity:0; }
              62%  { transform: scale(1.05) translateY(-5px); opacity:1; }
              100% { transform: scale(1) translateY(0); opacity:1; }
            }
            @keyframes bubble-appear {
              0%   { opacity:0; transform:scale(0.78) translateY(6px); }
              65%  { transform:scale(1.03) translateY(-1px); }
              100% { opacity:1; transform:scale(1) translateY(0); }
            }
            .bs-cur { animation: screen-blink 1.2s step-end infinite; }
            .bs-la-b { animation: led-tick 2.8s ease-in-out infinite; fill: #4ADE80; }
            .bs-la-dim { fill: #2A3A4A; }
            .bs-cg  { animation: ceiling-hum 3s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* ══ 1. BACKGROUND ══ */}
        {/* Wall */}
        <rect x="0" y="0" width={VW} height="210" fill="url(#bs-wall)" />
        {/* Wainscoting / dado rail */}
        <rect x="0" y="154" width={VW} height="8" rx="0" fill="#D8D0BF" />
        <rect x="0" y="160" width={VW} height="2" fill="#C4BCB0" />
        <rect x="0" y="150" width={VW} height="6" fill="#E4DCD0" />
        {/* Subtle vertical wall panels */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={i * 172 + 8}
            y="12"
            width="148"
            height="136"
            rx="3"
            fill="none"
            stroke="#E4DDD0"
            strokeWidth="0.8"
            opacity="0.7"
          />
        ))}
        {/* Floor */}
        <rect
          x="0"
          y="207"
          width={VW}
          height={VH - 207}
          fill="url(#bs-floor)"
        />
        {/* Floor carpet grid — subtle */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <line
            key={`fh${i}`}
            x1="0"
            y1={210 + i * 36}
            x2={VW}
            y2={210 + i * 36}
            stroke="#C8C0B0"
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <line
            key={`fv${i}`}
            x1={i * 96}
            y1="207"
            x2={i * 96}
            y2={VH}
            stroke="#C8C0B0"
            strokeWidth="0.6"
            opacity="0.4"
          />
        ))}
        {/* Floor/wall baseboard */}
        <rect x="0" y="205" width={VW} height="6" fill="#C8C0B0" />
        <rect x="0" y="209" width={VW} height="2" fill="#B8B0A0" />
        {/* Ambient floor AO */}
        <rect x="0" y="207" width={VW} height="80" fill="url(#bs-floor-ao)" />

        {/* ══ 2. WINDOWS ══ */}
        {[72, 638].map((wx, wi) => (
          <g key={wi}>
            {/* Outer frame shadow */}
            <rect
              x={wx - 4}
              y="14"
              width="136"
              height="134"
              rx="4"
              fill="rgba(0,0,0,0.06)"
            />
            {/* Sky */}
            <rect
              x={wx}
              y="16"
              width="128"
              height="130"
              rx="4"
              fill="url(#bs-sky)"
              stroke="#C8BCAE"
              strokeWidth="2.5"
            />
            {/* Clouds */}
            <ellipse
              cx={wx + 40}
              cy={wi === 0 ? 38 : 42}
              rx="22"
              ry="9"
              fill="white"
              opacity="0.65"
            />
            <ellipse
              cx={wx + 56}
              cy={wi === 0 ? 34 : 38}
              rx="18"
              ry="7"
              fill="white"
              opacity="0.5"
            />
            <ellipse
              cx={wx + 88}
              cy={wi === 0 ? 50 : 46}
              rx="15"
              ry="6"
              fill="white"
              opacity="0.45"
            />
            {/* Window dividers */}
            <line
              x1={wx + 64}
              y1="16"
              x2={wx + 64}
              y2="146"
              stroke="#C0B4A8"
              strokeWidth="2.2"
            />
            <line
              x1={wx}
              y1="72"
              x2={wx + 128}
              y2="72"
              stroke="#C0B4A8"
              strokeWidth="2.2"
            />
            {/* Inner frame edge highlight */}
            <rect
              x={wx}
              y="16"
              width="128"
              height="130"
              rx="4"
              fill="none"
              stroke="#FFFDF7"
              strokeWidth="1"
              opacity="0.4"
            />
            {/* Window sill */}
            <rect
              x={wx - 6}
              y="143"
              width="140"
              height="10"
              rx="2"
              fill="#D4C8B8"
              stroke="#C0B4A8"
              strokeWidth="1"
            />
            <rect
              x={wx - 4}
              y="143"
              width="136"
              height="4"
              rx="1"
              fill="#E0D4C4"
              opacity="0.8"
            />
            {/* Light shafts */}
            <polygon
              points={`${wx + 18},153 ${wx + 10},${VH} ${wx + 40},${VH} ${wx + 32},153`}
              fill="rgba(255,244,160,0.09)"
            />
            <polygon
              points={`${wx + 62},153 ${wx + 56},${VH} ${wx + 80},${VH} ${wx + 74},153`}
              fill="rgba(255,244,160,0.07)"
            />
            <polygon
              points={`${wx + 96},153 ${wx + 90},${VH} ${wx + 116},${VH} ${wx + 110},153`}
              fill="rgba(255,244,160,0.08)"
            />
          </g>
        ))}

        {/* ══ 3. CEILING LIGHTS ══ */}
        {[280, 580].map((lx, li) => (
          <g key={li}>
            <line
              x1={lx}
              y1="0"
              x2={lx}
              y2="16"
              stroke="#C4BCA8"
              strokeWidth="1.5"
            />
            <rect
              x={lx - 30}
              y="14"
              width="60"
              height="12"
              rx="6"
              fill="#EDE8DC"
              stroke="#D4CEC0"
              strokeWidth="1"
            />
            <rect
              x={lx - 26}
              y="22"
              width="52"
              height="5"
              rx="2.5"
              fill="rgba(255,252,200,0.98)"
            />
            <ellipse
              cx={lx}
              cy="48"
              rx="56"
              ry="24"
              fill="url(#bs-bloom)"
              className="bs-cg"
            />
          </g>
        ))}

        {/* ══ 4. COMPANY SIGN ══ */}
        <rect
          x="320"
          y="24"
          width="220"
          height="38"
          rx="7"
          fill="rgba(255,253,247,0.97)"
          stroke="#DED8CA"
          strokeWidth="1.2"
          filter="url(#bs-shadow)"
        />
        <text
          x="430"
          y="43"
          textAnchor="middle"
          fontFamily="'Playfair Display',Georgia,serif"
          fontSize="11"
          fontWeight="700"
          fill="#C8102E"
          letterSpacing="1.8"
        >
          TEXAS INSTRUMENTS
        </text>
        <text
          x="430"
          y="55"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="5.2"
          fill="#A89E90"
          letterSpacing="0.28em"
        >
          AGENT OPERATIONS CENTER
        </text>

        {/* ══ 5. SPOTLIGHTS ══ */}
        {!isAlone ? (
          <>
            <ellipse
              cx={LEFT_CX}
              cy="430"
              rx="130"
              ry="52"
              fill="url(#bs-spot-l)"
            />
            <ellipse
              cx={RIGHT_CX}
              cy="430"
              rx="130"
              ry="52"
              fill="url(#bs-spot-r)"
            />
          </>
        ) : (
          <ellipse
            cx={SOLO_CX}
            cy="430"
            rx="130"
            ry="52"
            fill="url(#bs-spot-l)"
          />
        )}

        {/* ══ 6. CUBICLE WALLS ══ */}
        {/* Left outer wall */}
        <rect
          x="48"
          y="195"
          width="10"
          height={VH - 195}
          rx="3"
          fill="url(#bs-partition)"
        />
        <rect x="48" y="195" width="10" height="4" rx="2" fill="#E4DCD0" />
        {/* Right outer wall */}
        <rect
          x="802"
          y="195"
          width="10"
          height={VH - 195}
          rx="3"
          fill="url(#bs-partition)"
        />
        <rect x="802" y="195" width="10" height="4" rx="2" fill="#E4DCD0" />
        {/* Center divider (dual only) */}
        {!isAlone && (
          <>
            <rect
              x="425"
              y="195"
              width="10"
              height={VH - 195}
              rx="2"
              fill="url(#bs-partition)"
            />
            <rect x="425" y="195" width="10" height="4" rx="2" fill="#E4DCD0" />
          </>
        )}
        {/* Cubicle top rails */}
        <rect x="48" y="192" width={VW - 96} height="6" rx="3" fill="#D0C8B4" />

        {/* ══ 7. SECTOR LABEL ══ */}
        <rect
          x="374"
          y="184"
          width="112"
          height="12"
          rx="4"
          fill="#EDE6D8"
          stroke="#D8D0C4"
          strokeWidth="0.8"
        />
        <text
          x="430"
          y="192"
          textAnchor="middle"
          fill="#9B8F82"
          fontSize="5.8"
          fontFamily="monospace"
          letterSpacing="0.2em"
        >
          SECTOR B — ACTIVE
        </text>

        {/* ══ 8. CHAIRS (monitor side only) ══ */}
        {[isAlone ? SOLO_CX : LEFT_CX].map((cx) => (
          <g key={cx}>
            {/* Chair base star */}
            {[-40, -14, 14, 40].map((ox, i) => (
              <line
                key={i}
                x1={cx}
                y1={CHAIR_Y + 22}
                x2={cx + ox}
                y2={CHAIR_Y + 46}
                stroke="#908880"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            ))}
            {[-40, -14, 14, 40].map((ox, i) => (
              <ellipse
                key={i}
                cx={cx + ox}
                cy={CHAIR_Y + 48}
                rx="6"
                ry="3.5"
                fill="#888080"
              />
            ))}
            {/* Pneumatic column */}
            <rect
              x={cx - 4}
              y={CHAIR_Y + 22}
              x2={cx + 4}
              width="8"
              height="18"
              rx="3"
              fill="#A0988A"
            />
            {/* Seat */}
            <ellipse
              cx={cx}
              cy={CHAIR_Y + 22}
              rx="28"
              ry="13"
              fill="url(#bs-chair-seat)"
              stroke="#908880"
              strokeWidth="1"
            />
            {/* Back rest */}
            <rect
              x={cx - 22}
              y={CHAIR_Y - 22}
              width="44"
              height="30"
              rx="10"
              fill="url(#bs-chair-seat)"
              stroke="#908880"
              strokeWidth="1"
            />
            {/* Back support */}
            <rect
              x={cx - 2}
              y={CHAIR_Y - 22}
              width="4"
              height="44"
              rx="2"
              fill="#908880"
            />
            {/* Armrests */}
            <rect
              x={cx - 28}
              y={CHAIR_Y - 4}
              width="6"
              height="22"
              rx="3"
              fill="#A0988A"
            />
            <rect
              x={cx + 22}
              y={CHAIR_Y - 4}
              width="6"
              height="22"
              rx="3"
              fill="#A0988A"
            />
            <rect
              x={cx - 32}
              y={CHAIR_Y + 14}
              width="14"
              height="5"
              rx="2.5"
              fill="#888080"
            />
            <rect
              x={cx + 18}
              y={CHAIR_Y + 14}
              width="14"
              height="5"
              rx="2.5"
              fill="#888080"
            />
          </g>
        ))}

        {/* ══ 9. MONITORS ══ */}
        {(!isAlone
          ? [
              { cx: LEFT_CX, ac: mAc, isActive: mActive },
              { cx: RIGHT_CX, ac: wAc, isActive: wActive },
            ]
          : [{ cx: SOLO_CX, ac: mAc, isActive: mActive }]
        ).map(({ cx, ac, isActive }) => (
          <g key={cx}>
            {/* Monitor body */}
            <rect
              x={cx - MON_W / 2 - 2}
              y={MON_Y - 2}
              width={MON_W + 4}
              height={MON_H + 4}
              rx="6"
              fill="rgba(0,0,0,0.12)"
            />
            <rect
              x={cx - MON_W / 2}
              y={MON_Y}
              width={MON_W}
              height={MON_H}
              rx="5"
              fill="#1E2D3D"
              stroke="#101820"
              strokeWidth="1.2"
            />
            {/* Screen */}
            <rect
              x={cx - MON_W / 2 + 5}
              y={MON_Y + 5}
              width={MON_W - 10}
              height={MON_H - 10}
              rx="3"
              fill="url(#bs-screen)"
            />
            {/* Screen content */}
            {isActive ? (
              <>
                <rect
                  x={cx - 37}
                  y={MON_Y + 12}
                  width="62"
                  height="3"
                  rx="1.5"
                  fill="#38BDF8"
                  opacity="0.9"
                />
                <rect
                  x={cx - 37}
                  y={MON_Y + 18}
                  width="44"
                  height="2.5"
                  rx="1.2"
                  fill={ac}
                  opacity="0.85"
                />
                <rect
                  x={cx - 37}
                  y={MON_Y + 24}
                  width="56"
                  height="2.5"
                  rx="1.2"
                  fill="#F97316"
                  opacity="0.7"
                />
                <rect
                  x={cx - 37}
                  y={MON_Y + 30}
                  width="36"
                  height="2.5"
                  rx="1.2"
                  fill="#38BDF8"
                  opacity="0.55"
                />
                <rect
                  x={cx - 37}
                  y={MON_Y + 36}
                  width="48"
                  height="2.5"
                  rx="1.2"
                  fill={ac}
                  opacity="0.4"
                />
                <text
                  x={cx - 37}
                  y={MON_Y + 46}
                  fill="#7AB08A"
                  fontSize="5.5"
                  fontFamily="monospace"
                  className="bs-cur"
                >
                  $_
                </text>
              </>
            ) : (
              <>
                <rect
                  x={cx - 37}
                  y={MON_Y + 12}
                  width="52"
                  height="2.5"
                  rx="1.2"
                  fill="#2A3A4A"
                  opacity="0.7"
                />
                <rect
                  x={cx - 37}
                  y={MON_Y + 18}
                  width="38"
                  height="2.5"
                  rx="1.2"
                  fill="#2A3A4A"
                  opacity="0.5"
                />
                <rect
                  x={cx - 37}
                  y={MON_Y + 24}
                  width="48"
                  height="2.5"
                  rx="1.2"
                  fill="#2A3A4A"
                  opacity="0.4"
                />
                <rect
                  x={cx - 37}
                  y={MON_Y + 30}
                  width="30"
                  height="2.5"
                  rx="1.2"
                  fill="#2A3A4A"
                  opacity="0.3"
                />
              </>
            )}
            {/* Status LED */}
            <circle
              cx={cx + MON_W / 2 - 9}
              cy={MON_Y + 7}
              r="2.5"
              className={isActive ? "bs-la-b" : "bs-la-dim"}
            />
            {/* Monitor stand */}
            <rect
              x={cx - 6}
              y={MON_Y + MON_H}
              width="12"
              height="8"
              rx="2"
              fill="#283040"
            />
            <rect
              x={cx - 18}
              y={MON_Y + MON_H + 7}
              width="36"
              height="4"
              rx="2"
              fill="#283040"
            />
          </g>
        ))}

        {/* ══ 10. ROBOTS ══ */}
        <BotStation
          bot={monitorBot}
          foX={isAlone ? SOLO_FO_X : LEFT_FO_X}
          foY={FO_Y}
          foW={FO_W}
          foH={FO_H}
          accentColor={mAc}
          isNew={monitorIsNew}
          walksIn={false}
          bubbleKey={mBubbleKey}
          skin={skin}
        />
        {!isAlone && (
          <BotStation
            bot={workerBot}
            foX={RIGHT_FO_X}
            foY={FO_Y}
            foW={FO_W}
            foH={FO_H}
            accentColor={wAc}
            isNew={workerIsNew}
            walksIn={workerWalksIn}
            bubbleKey={wBubbleKey}
            skin={skin}
          />
        )}

        {/* ══ 11. DESKS (drawn after robots) ══ */}
        {(!isAlone
          ? [
              { dx: LEFT_DX, cx: LEFT_CX, item: "coffee" },
              { dx: RIGHT_DX, cx: RIGHT_CX, item: "plant" },
            ]
          : [{ dx: SOLO_DX, cx: SOLO_CX, item: "coffee" }]
        ).map(({ dx, cx, item }) => (
          <g key={dx}>
            {/* Desk shadow */}
            <rect
              x={dx - 2}
              y={DESK_Y + 2}
              width={DESK_W + 4}
              height={DESK_H + 2}
              rx="5"
              fill="rgba(0,0,0,0.1)"
            />
            {/* Desk surface */}
            <rect
              x={dx}
              y={DESK_Y}
              width={DESK_W}
              height={DESK_H}
              rx="5"
              fill="url(#bs-desk)"
              stroke="#C4BAA0"
              strokeWidth="1.4"
            />
            {/* Desk front edge (thickness) */}
            <rect
              x={dx}
              y={DESK_Y + DESK_H - 6}
              width={DESK_W}
              height="8"
              rx="3"
              fill="url(#bs-desk-edge)"
            />
            {/* Desk top highlight */}
            <rect
              x={dx + 4}
              y={DESK_Y}
              width={DESK_W - 8}
              height="3"
              rx="2"
              fill="rgba(255,255,255,0.25)"
            />

            {/* Keyboard */}
            <rect
              x={dx + 16}
              y={DESK_Y + 8}
              width="74"
              height="20"
              rx="4"
              fill="#ECE6D6"
              stroke="#D4CEBE"
              strokeWidth="1"
            />
            <rect
              x={dx + 16}
              y={DESK_Y + 8}
              width="74"
              height="4"
              rx="2"
              fill="rgba(255,255,255,0.3)"
            />
            {[0, 1, 2].map((row) =>
              [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={dx + 20 + col * 8}
                  y={DESK_Y + 13 + row * 6}
                  width="6"
                  height="4.5"
                  rx="1.5"
                  fill="#E2DCD0"
                  stroke="#CCCAB8"
                  strokeWidth="0.5"
                />
              )),
            )}
            {/* Spacebar */}
            <rect
              x={dx + 28}
              y={DESK_Y + 31}
              width="36"
              height="4.5"
              rx="2"
              fill="#E2DCD0"
              stroke="#CCCAB8"
              strokeWidth="0.5"
            />

            {/* Mouse */}
            <ellipse
              cx={cx + 62}
              cy={DESK_Y + 18}
              rx="7.5"
              ry="10"
              fill="#EEE8D8"
              stroke="#D4CEBC"
              strokeWidth="1"
            />
            <line
              x1={cx + 62}
              y1={DESK_Y + 9}
              x2={cx + 62}
              y2={DESK_Y + 19}
              stroke="#D0CAB8"
              strokeWidth="1"
            />
            <rect
              x={cx + 57}
              y={DESK_Y + 9}
              width="4.5"
              height="8"
              rx="2"
              fill="none"
              stroke="#D0CAB8"
              strokeWidth="0.6"
            />

            {/* Sticky notes */}
            <rect
              x={dx + 102}
              y={DESK_Y + 10}
              width="18"
              height="18"
              rx="2"
              fill="#FFE47A"
              stroke="#DDD060"
              strokeWidth="0.8"
              transform="rotate(-4 111 19)"
            />
            <line
              x1={dx + 105}
              y1={DESK_Y + 17}
              x2={dx + 117}
              y2={DESK_Y + 17}
              stroke="#B8A830"
              strokeWidth="1"
              opacity="0.5"
            />
            <line
              x1={dx + 105}
              y1={DESK_Y + 21}
              x2={dx + 115}
              y2={DESK_Y + 21}
              stroke="#B8A830"
              strokeWidth="1"
              opacity="0.4"
            />

            {/* Item */}
            {item === "coffee" && (
              <g>
                <rect
                  x={cx + 64}
                  y={DESK_Y + 5}
                  width="16"
                  height="20"
                  rx="4"
                  fill="#D85C38"
                  opacity="0.92"
                />
                <rect
                  x={cx + 66}
                  y={DESK_Y + 7}
                  width="10"
                  height="2"
                  rx="1"
                  fill="rgba(255,255,255,0.35)"
                />
                {/* Handle */}
                <path
                  d={`M${cx + 80} ${DESK_Y + 9} Q${cx + 86} ${DESK_Y + 10} ${cx + 86} ${DESK_Y + 15} Q${cx + 86} ${DESK_Y + 21} ${cx + 80} ${DESK_Y + 22}`}
                  fill="none"
                  stroke="#D85C38"
                  strokeWidth="2"
                />
                {/* Steam */}
                <path
                  d={`M${cx + 70} ${DESK_Y + 3} Q${cx + 73} ${DESK_Y} ${cx + 70} ${DESK_Y - 3}`}
                  fill="none"
                  stroke="#C4BCA8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <path
                  d={`M${cx + 75} ${DESK_Y + 2} Q${cx + 78} ${DESK_Y - 1} ${cx + 75} ${DESK_Y - 4}`}
                  fill="none"
                  stroke="#C4BCA8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </g>
            )}
            {item === "plant" && (
              <g>
                <rect
                  x={cx + 64}
                  y={DESK_Y + 28}
                  width="16"
                  height="13"
                  rx="4"
                  fill="#7A5A14"
                  opacity="0.5"
                />
                <ellipse
                  cx={cx + 72}
                  cy={DESK_Y + 26}
                  rx="10"
                  ry="9"
                  fill="#3D6B4F"
                  opacity="0.85"
                />
                <ellipse
                  cx={cx + 64}
                  cy={DESK_Y + 20}
                  rx="7"
                  ry="8"
                  fill="#4A7A5E"
                  opacity="0.7"
                />
                <ellipse
                  cx={cx + 80}
                  cy={DESK_Y + 22}
                  rx="7"
                  ry="6"
                  fill="#3D6B4F"
                  opacity="0.65"
                />
                <ellipse
                  cx={cx + 72}
                  cy={DESK_Y + 14}
                  rx="5"
                  ry="6"
                  fill="#58886C"
                  opacity="0.6"
                />
              </g>
            )}

            {/* Desk legs */}
            <rect
              x={dx + 10}
              y={DESK_Y + DESK_H}
              width="6"
              height="26"
              rx="2"
              fill="#C4BAA0"
            />
            <rect
              x={dx + DESK_W - 16}
              y={DESK_Y + DESK_H}
              width="6"
              height="26"
              rx="2"
              fill="#C4BAA0"
            />
          </g>
        ))}

        {/* Cabinet between stations */}
        {!isAlone && (
          <g>
            <rect
              x="377"
              y="248"
              width="106"
              height="90"
              rx="5"
              fill="#D8D0BC"
              stroke="#C4BCAA"
              strokeWidth="1.2"
              filter="url(#bs-shadow)"
            />
            <rect
              x="380"
              y="250"
              width="100"
              height="4"
              rx="2"
              fill="#E4DCC8"
            />
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect
                  x="383"
                  y={258 + i * 22}
                  width="94"
                  height="18"
                  rx="4"
                  fill="#E4DAC8"
                  stroke="#C8C0AA"
                  strokeWidth="0.8"
                />
                <circle
                  cx="330"
                  cy={267 + i * 22}
                  r="3.5"
                  fill="#B4AC9C"
                  stroke="#A4A090"
                  strokeWidth="0.8"
                />
              </g>
            ))}
            {/* Top item — small printer/device */}
            <rect
              x="393"
              y="242"
              width="34"
              height="10"
              rx="3"
              fill="#D0C8B4"
              stroke="#C0B8A4"
              strokeWidth="0.8"
            />
            <rect
              x="396"
              y="244"
              width="24"
              height="2"
              rx="1"
              fill="#C0B8A4"
              opacity="0.6"
            />
          </g>
        )}

        {/* ══ 12. NAME PLATES ══ */}
        {monitorBot && (
          <NamePlate
            name={monitorBot.agent_name || "Monitor"}
            act={
              monitorBot.status === "done" ? "done" : monitorBot.act || "Idle"
            }
            accentColor={mAc}
            x={isAlone ? SOLO_CX : LEFT_CX}
            y={PLATE_Y}
          />
        )}
        {!isAlone && workerBot && (
          <NamePlate
            name={workerBot.agent_name || "Worker"}
            act={workerBot.status === "done" ? "done" : workerBot.act || "Idle"}
            accentColor={wAc}
            x={RIGHT_CX}
            y={PLATE_Y}
          />
        )}

        {/* ══ 13. FLOOR PLANTS ══ */}
        {/* Left corner plant */}
        <rect
          x="60"
          y="372"
          width="22"
          height="16"
          rx="5"
          fill="#7A5A14"
          opacity="0.45"
        />
        <ellipse
          cx="71"
          cy="364"
          rx="17"
          ry="15"
          fill="#3D6B4F"
          opacity="0.82"
        />
        <ellipse
          cx="61"
          cy="353"
          rx="12"
          ry="13"
          fill="#4A7A5E"
          opacity="0.7"
        />
        <ellipse
          cx="82"
          cy="356"
          rx="11"
          ry="10"
          fill="#3D6B4F"
          opacity="0.65"
        />
        <ellipse
          cx="71"
          cy="346"
          rx="8"
          ry="10"
          fill="#58886C"
          opacity="0.55"
        />
        {/* Right corner plant */}
        <rect
          x="777"
          y="372"
          width="22"
          height="16"
          rx="5"
          fill="#7A5A14"
          opacity="0.45"
        />
        <ellipse
          cx="788"
          cy="364"
          rx="17"
          ry="15"
          fill="#3D6B4F"
          opacity="0.82"
        />
        <ellipse
          cx="778"
          cy="353"
          rx="12"
          ry="13"
          fill="#4A7A5E"
          opacity="0.7"
        />
        <ellipse
          cx="799"
          cy="356"
          rx="11"
          ry="10"
          fill="#3D6B4F"
          opacity="0.65"
        />
        <ellipse
          cx="788"
          cy="346"
          rx="8"
          ry="10"
          fill="#58886C"
          opacity="0.55"
        />

        {/* ══ 14. ACCENT DETAILS ══ */}
        {/* Blue accent strip left wall */}
        <rect
          x="50"
          y="270"
          width="8"
          height="60"
          rx="4"
          fill={mAc}
          opacity={mActive ? 0.75 : 0.35}
        />
        {mActive && (
          <rect
            x="50"
            y="270"
            width="8"
            height="60"
            rx="4"
            fill={mAc}
            opacity="0.25"
            filter="url(#bs-glow-b)"
          />
        )}
        {/* Green accent strip right wall */}
        <rect
          x="802"
          y="270"
          width="8"
          height="60"
          rx="4"
          fill={wAc}
          opacity={wActive ? 0.75 : 0.35}
        />
        {wActive && (
          <rect
            x="802"
            y="270"
            width="8"
            height="60"
            rx="4"
            fill={wAc}
            opacity="0.25"
            filter="url(#bs-glow-g)"
          />
        )}

        {/* ══ 15. WALL CLOCK ══ */}
        <circle
          cx="330"
          cy="122"
          r="18"
          fill="#FFFDF7"
          stroke="#D8D0BE"
          strokeWidth="1.5"
        />
        <circle
          cx="330"
          cy="122"
          r="16"
          fill="none"
          stroke="#EDE5D4"
          strokeWidth="0.8"
        />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          const r1 = i % 3 === 0 ? 11 : 12.5,
            r2 = 14;
          return (
            <line
              key={i}
              x1={330 + r1 * Math.cos(a)}
              y1={122 + r1 * Math.sin(a)}
              x2={330 + r2 * Math.cos(a)}
              y2={122 + r2 * Math.sin(a)}
              stroke="#A89E90"
              strokeWidth={i % 3 === 0 ? 1.4 : 0.8}
            />
          );
        })}
        {/* Clock hands — decorative (fixed time) */}
        <line
          x1="330"
          y1="122"
          x2="330"
          y2="112"
          stroke="#2E2B24"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="330"
          y1="122"
          x2="338"
          y2="126"
          stroke="#2E2B24"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="330" cy="122" r="1.5" fill="#2E2B24" />
      </svg>
    </div>
  );
}
