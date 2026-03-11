import React from "react";

/* ══════════════════════════════════════════
   OFFICE IDLE SCENE
   viewBox 800×460 — ceiling y=0-44, wall y=44-340, floor y=340-460
   3 cubicles side by side. Everything is proportioned to these zones.
   ══════════════════════════════════════════ */
export function OfficeIdleScene() {
  return (
    <svg
      viewBox="0 0 800 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        height: "auto",
        filter: "drop-shadow(0 8px 32px rgba(28,26,22,0.09))",
      }}
    >
      {/* ── Full background ── */}
      <rect width="800" height="460" fill="#f4eed8" />

      {/* ── Floor ── y=340 to 460 */}
      <rect x="0" y="340" width="800" height="120" fill="#d8cfb8" />
      {/* Checkerboard tiles */}
      {Array.from({ length: 8 }, (_, c) =>
        Array.from({ length: 3 }, (_, r) => (
          <rect
            key={`${c}-${r}`}
            x={c * 100}
            y={340 + r * 40}
            width="100"
            height="40"
            fill={(c + r) % 2 === 0 ? "#cfc7b0" : "#c4bc9f"}
            opacity="0.6"
          />
        )),
      )}
      {/* Floor baseboard */}
      <rect x="0" y="340" width="800" height="6" fill="#b8ae98" />

      {/* ── Back wall ── y=44 to 340 */}
      <rect x="0" y="44" width="800" height="296" fill="#ebe3c8" />
      {/* Wall texture — subtle vertical lines */}
      {Array.from({ length: 20 }, (_, i) => (
        <line
          key={i}
          x1={i * 42}
          y1="44"
          x2={i * 42}
          y2="340"
          stroke="#e4dbc0"
          strokeWidth="1"
          opacity="0.5"
        />
      ))}

      {/* ── Ceiling ── y=0 to 44 */}
      <rect x="0" y="0" width="800" height="44" fill="#d8d0bc" />
      {/* Ceiling edge */}
      <rect x="0" y="40" width="800" height="4" fill="#c8c0a8" />
      {/* Ceiling lights — 5 evenly spaced */}
      {[80, 240, 400, 560, 720].map((x, i) => (
        <g key={i}>
          <rect x={x - 36} y="6" width="72" height="16" rx="4" fill="#c4bba8" />
          <rect
            x={x - 32}
            y="8"
            width="64"
            height="12"
            rx="3"
            fill="#fffdf7"
            opacity="0.92"
            style={{
              animation: `ceiling-hum 3s ${i * 0.5}s ease-in-out infinite`,
            }}
          />
          <rect
            x={x - 36}
            y="22"
            width="72"
            height="3"
            rx="1"
            fill="#b4aa94"
            opacity="0.5"
          />
        </g>
      ))}

      {/* ══════════════════════════════════════════
          TI SIGN — mounted on wall, centered
          ══════════════════════════════════════════ */}
      <rect
        x="270"
        y="58"
        width="260"
        height="36"
        rx="8"
        fill="#fff"
        opacity="0.95"
      />
      <rect x="274" y="62" width="252" height="28" rx="6" fill="#fff" />
      <rect
        x="274"
        y="62"
        width="252"
        height="28"
        rx="6"
        fill="none"
        stroke="#e8e0d0"
        strokeWidth="1"
      />
      <text
        x="400"
        y="81"
        textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        fontSize="15"
        fontWeight="700"
        fill="#cc1f1f"
        letterSpacing="2"
      >
        TEXAS INSTRUMENTS
      </text>

      {/* ══════════════════════════════════════════
          CUBICLE PARTITION WALLS
          3 bays: x=0-266, 267-533, 534-800
          Dividers at x=266 and x=533, height from y=100 to y=340
          ══════════════════════════════════════════ */}
      {/* Left outer wall */}
      <rect x="0" y="100" width="10" height="240" rx="0" fill="#c4b99a" />
      {/* Divider 1 */}
      <rect x="262" y="100" width="10" height="240" fill="#c4b99a" />
      {/* Divider 2 */}
      <rect x="528" y="100" width="10" height="240" fill="#c4b99a" />
      {/* Right outer wall */}
      <rect x="790" y="100" width="10" height="240" fill="#c4b99a" />
      {/* Top rail across all */}
      <rect x="0" y="100" width="800" height="9" fill="#c4b99a" />

      {/* ══════════════════════════════════════════
          BAY 1: ARIA's desk — x: 10 to 262
          Desk top at y=268, chair behind at y=285-340
          ══════════════════════════════════════════ */}
      {/* Desk surface */}
      <rect x="20" y="268" width="232" height="18" rx="5" fill="#a89070" />
      <rect x="20" y="268" width="232" height="5" rx="3" fill="#b8a082" />
      {/* Desk legs */}
      <rect x="28" y="286" width="10" height="54" rx="4" fill="#8a7060" />
      <rect x="234" y="286" width="10" height="54" rx="4" fill="#8a7060" />

      {/* Monitor — sits ON the desk (bottom of monitor = y=268) */}
      {/* Monitor base/stand */}
      <rect x="112" y="256" width="16" height="14" rx="3" fill="#334155" />
      <rect x="100" y="265" width="40" height="5" rx="2" fill="#334155" />
      {/* Monitor frame — top of frame = y=186, bottom = y=256 */}
      <rect x="86" y="186" width="88" height="72" rx="6" fill="#1e293b" />
      <rect x="90" y="190" width="80" height="60" rx="4" fill="#0c1a33" />
      {/* Screen lines */}
      <rect
        x="96"
        y="197"
        width="68"
        height="3"
        rx="1.5"
        fill="#38bdf8"
        opacity="0.8"
      />
      <rect
        x="96"
        y="203"
        width="50"
        height="3"
        rx="1.5"
        fill="#64748b"
        opacity="0.5"
      />
      <rect
        x="96"
        y="209"
        width="60"
        height="3"
        rx="1.5"
        fill="#64748b"
        opacity="0.4"
      />
      <rect
        x="96"
        y="215"
        width="68"
        height="4"
        rx="2"
        fill="#ef4444"
        opacity="0.75"
        style={{ animation: "alert-pulse 2s ease-in-out infinite" }}
      />
      <rect
        x="96"
        y="222"
        width="44"
        height="3"
        rx="1.5"
        fill="#64748b"
        opacity="0.35"
      />
      <rect
        x="96"
        y="228"
        width="54"
        height="3"
        rx="1.5"
        fill="#64748b"
        opacity="0.25"
      />
      {/* Keyboard */}
      <rect x="92" y="258" width="76" height="12" rx="3" fill="#c4bba8" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={95 + i * 11}
          y={260}
          width="9"
          height="5"
          rx="1.5"
          fill="#b0a890"
        />
      ))}
      {/* Coffee mug */}
      <rect x="194" y="246" width="20" height="22" rx="5" fill="#e8624a" />
      <path
        d="M 214 252 Q 222 252 222 259 Q 222 266 214 266"
        fill="none"
        stroke="#c8442a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 200 242 Q 197 235 200 229"
        fill="none"
        stroke="#c4b99a"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
        style={{ animation: "drone-float 2s ease-in-out infinite" }}
      />
      {/* Chair */}
      <ellipse cx="136" cy="316" rx="40" ry="14" fill="#7a6a55" />
      <rect x="110" y="304" width="52" height="30" rx="8" fill="#6b5c48" />
      <rect x="120" y="294" width="32" height="36" rx="8" fill="#5c4e3c" />

      {/* ══════════════════════════════════════════
          BAY 2: BOLT's desk — x: 272 to 528
          Desk at y=268
          ══════════════════════════════════════════ */}
      <rect x="280" y="268" width="240" height="18" rx="5" fill="#a89070" />
      <rect x="280" y="268" width="240" height="5" rx="3" fill="#b8a082" />
      <rect x="288" y="286" width="10" height="54" rx="4" fill="#8a7060" />
      <rect x="502" y="286" width="10" height="54" rx="4" fill="#8a7060" />
      {/* Laptop */}
      <rect x="348" y="218" width="84" height="52" rx="5" fill="#1e293b" />
      <rect x="352" y="222" width="76" height="44" rx="3" fill="#0f172a" />
      <rect
        x="356"
        y="228"
        width="68"
        height="3"
        rx="1.5"
        fill="#a78bfa"
        opacity="0.8"
      />
      <rect
        x="356"
        y="234"
        width="52"
        height="3"
        rx="1.5"
        fill="#64748b"
        opacity="0.5"
      />
      <rect
        x="356"
        y="240"
        width="60"
        height="3"
        rx="1.5"
        fill="#64748b"
        opacity="0.4"
      />
      <rect
        x="356"
        y="246"
        width="40"
        height="3"
        rx="1.5"
        fill="#64748b"
        opacity="0.3"
      />
      {/* Laptop base */}
      <rect x="340" y="268" width="100" height="6" rx="3" fill="#334155" />
      {/* Notepad */}
      <rect x="460" y="252" width="50" height="20" rx="3" fill="#fffdf7" />
      <rect
        x="460"
        y="252"
        width="50"
        height="20"
        rx="3"
        fill="none"
        stroke="#ddd5bc"
        strokeWidth="1"
      />
      <rect x="464" y="257" width="42" height="2" rx="1" fill="#ddd5bc" />
      <rect x="464" y="262" width="34" height="2" rx="1" fill="#ddd5bc" />
      {/* Chair */}
      <ellipse cx="400" cy="316" rx="40" ry="14" fill="#7a6a55" />
      <rect x="374" y="304" width="52" height="30" rx="8" fill="#6b5c48" />

      {/* ══════════════════════════════════════════
          BAY 3: Server rack — x: 538 to 790
          ══════════════════════════════════════════ */}
      <rect x="546" y="268" width="234" height="18" rx="5" fill="#a89070" />
      <rect x="546" y="268" width="234" height="5" rx="3" fill="#b8a082" />
      <rect x="554" y="286" width="10" height="54" rx="4" fill="#8a7060" />
      <rect x="762" y="286" width="10" height="54" rx="4" fill="#8a7060" />
      {/* Server rack */}
      <rect x="594" y="114" width="64" height="156" rx="5" fill="#111827" />
      <rect x="597" y="117" width="58" height="150" rx="3" fill="#1e293b" />
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i}>
          <rect
            x="600"
            y={121 + i * 14}
            width="52"
            height="12"
            rx="2"
            fill="#111827"
          />
          <circle
            cx="607"
            cy={127 + i * 14}
            r="3"
            fill={i % 3 === 0 ? "#22c55e" : i % 3 === 1 ? "#f59e0b" : "#3b82f6"}
            opacity="0.9"
            style={{
              animation: `led-tick ${1 + i * 0.25}s ${i * 0.12}s ease-in-out infinite`,
            }}
          />
          <rect
            x="616"
            y={125 + i * 14}
            width="30"
            height="2"
            rx="1"
            fill="#334155"
            opacity="0.8"
          />
          <rect
            x="616"
            y={129 + i * 14}
            width="20"
            height="2"
            rx="1"
            fill="#334155"
            opacity="0.5"
          />
        </g>
      ))}
      {/* Window */}
      <rect
        x="694"
        y="110"
        width="84"
        height="100"
        rx="6"
        fill="#dbeafe"
        opacity="0.55"
      />
      <rect
        x="694"
        y="110"
        width="84"
        height="100"
        rx="6"
        fill="none"
        stroke="#b8a888"
        strokeWidth="3"
      />
      <line
        x1="736"
        y1="110"
        x2="736"
        y2="210"
        stroke="#b8a888"
        strokeWidth="2"
      />
      <line
        x1="694"
        y1="160"
        x2="778"
        y2="160"
        stroke="#b8a888"
        strokeWidth="2"
      />
      {/* Light ray */}
      <path
        d="M 778 110 L 800 140 L 800 110 Z"
        fill="#fef3c7"
        opacity="0.15"
        style={{ animation: "ray-shimmer 5s ease-in-out infinite" }}
      />
      {/* Plant */}
      <rect x="556" y="254" width="22" height="20" rx="4" fill="#8a7060" />
      <ellipse cx="567" cy="252" rx="20" ry="22" fill="#3d6b4f" />
      <ellipse cx="555" cy="242" rx="14" ry="17" fill="#2d5a3f" />
      <ellipse cx="579" cy="244" rx="14" ry="17" fill="#2d5a3f" />

      {/* ══════════════════════════════════════════
          FLOATING DRONE — hovers in ceiling zone
          ══════════════════════════════════════════ */}
      <g
        style={{
          animation: "drone-float 3.5s ease-in-out infinite",
          transformOrigin: "400px 68px",
        }}
      >
        <rect x="372" y="58" width="56" height="20" rx="6" fill="#111827" />
        <rect x="375" y="61" width="50" height="14" rx="4" fill="#1e3a5f" />
        <text x="400" y="72" textAnchor="middle" fontSize="7" fill="#7dd3fc">
          ARIA HQ
        </text>
        {/* Rotors */}
        <ellipse cx="370" cy="62" rx="8" ry="4" fill="#334155" opacity="0.7" />
        <ellipse cx="430" cy="62" rx="8" ry="4" fill="#334155" opacity="0.7" />
        <line
          x1="370"
          y1="62"
          x2="372"
          y2="62"
          stroke="#64748b"
          strokeWidth="2"
        />
        <line
          x1="430"
          y1="62"
          x2="428"
          y2="62"
          stroke="#64748b"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════
   ACTIVE SCENE — robots + desk in ONE SVG
   viewBox 700×520

   Layout zones:
   - Wall/ceiling: y=0–110
   - Desk: y=320–360 (surface top y=320, thickness 18px)
   - Desk legs: y=338–460
   - Floor: y=460–520
   - ARIA (left robot):  center-x=170, feet at y=458
   - BOLT (right robot): center-x=530, feet at y=458
   - Speech bubbles float above heads

   Robot body plan (drawn in absolute SVG coords):
   Each robot is ~100px wide, ~160px tall.
   Feet bottom = y=458. Head top ≈ y=298.
   ══════════════════════════════════════════ */
export function ActiveScene({ ariaData, boltData }) {
  const aria = ariaData || {};
  const bolt = boltData || {};
  const ariaAct = aria.act || "Idle";
  const boltAct = bolt.act || "Idle";
  const ariaText = aria.text || "";
  const boltText = bolt.text || "";
  const ariaName = aria.agent_name || "ARIA";
  const boltName = bolt.agent_name || "BOLT";

  /* ── Aria colour state ── */
  const ariaIsReading = ariaAct === "Reading";
  const ariaIsThinking = ariaAct === "Thinking";
  const ariaIsResponding = ariaAct === "Responding";
  const ariaIsDone = ariaAct === "Done";
  const ariaBody = ariaIsResponding
    ? "#2d6a9f"
    : ariaIsDone
      ? "#2d6b50"
      : "#2a4a72";
  const ariaVisor = ariaIsReading
    ? "#7dd3fc"
    : ariaIsThinking
      ? "#c4b5fd"
      : ariaIsResponding
        ? "#6ee7b7"
        : ariaIsDone
          ? "#6ee7b7"
          : "#94a3b8";

  /* ── Bolt colour state ── */
  const boltIsReading = boltAct === "Reading";
  const boltIsThinking = boltAct === "Thinking";
  const boltIsResponding = boltAct === "Responding";
  const boltIsDone = boltAct === "Done";
  const boltBody = boltIsResponding
    ? "#b45309"
    : boltIsDone
      ? "#2d6b50"
      : "#7c3a0e";
  const boltEye = boltIsReading
    ? "#7dd3fc"
    : boltIsThinking
      ? "#fcd34d"
      : boltIsResponding
        ? "#6ee7b7"
        : boltIsDone
          ? "#6ee7b7"
          : "#f59e0b";

  /* Robot positions:
     ARIA: cx=175, feet-y=458
     BOLT: cx=525, feet-y=458
     Robot width ~110, height ~160
     So ARIA x: 120–230,  BOLT x: 470–580
  */
  const A = 175; // aria center x
  const B = 525; // bolt center x
  const FY = 458; // feet bottom y
  const HT = 160; // robot height
  const HW = 55; // half-width

  /* ── Speech bubble text wrapping ──
     Simple: max ~26 chars per line, split at spaces */
  const wrapText = (str, maxLen = 24) => {
    if (!str) return [];
    const words = str.split(" ");
    const lines = [];
    let cur = "";
    words.forEach((w) => {
      if ((cur + " " + w).trim().length > maxLen) {
        if (cur) lines.push(cur);
        cur = w;
      } else {
        cur = cur ? cur + " " + w : w;
      }
    });
    if (cur) lines.push(cur);
    return lines.slice(0, 4); // max 4 lines
  };

  const ariaLines = wrapText(ariaText);
  const boltLines = wrapText(boltText);
  const ariaBubbleH = Math.max(32, ariaLines.length * 16 + 16);
  const boltBubbleH = Math.max(32, boltLines.length * 16 + 16);
  const ariaBubbleW = 180;
  const boltBubbleW = 180;

  /* Bubble positioning:
     Bubble bottom = head top - 8px = (FY - HT) - 8 = 290
     So bubble top = 290 - ariaBubbleH
     ARIA bubble: right-aligned to left of center, tail points down-left
     BOLT bubble: left-aligned from right of center, tail points down-right
  */
  const ariaHeadTop = FY - HT + 2; // ≈ 300
  const boltHeadTop = FY - HT + 2;
  const ariaBubbleY = ariaHeadTop - ariaBubbleH - 10;
  const boltBubbleY = boltHeadTop - boltBubbleH - 10;
  /* ARIA bubble: x from (A - HW - ariaBubbleW + 20) to (A + HW + 20) */
  const ariaBubbleX = A - 10; // left edge, extends right
  const boltBubbleX = B - ariaBubbleW + 10; // left edge, extends right

  return (
    <svg
      viewBox="0 0 700 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        height: "auto",
        filter: "drop-shadow(0 4px 20px rgba(28,26,22,0.08))",
      }}
    >
      {/* ── Full background ── */}
      <rect width="700" height="520" fill="#f4eed8" />

      {/* ── Floor ── */}
      <rect x="0" y="460" width="700" height="60" fill="#d8cfb8" />
      {Array.from({ length: 7 }, (_, c) => (
        <rect
          key={c}
          x={c * 100}
          y="460"
          width="100"
          height="60"
          fill={c % 2 === 0 ? "#cfc7b0" : "#c4bc9f"}
          opacity="0.55"
        />
      ))}
      <rect x="0" y="460" width="700" height="4" fill="#b8ae98" />

      {/* ── Back wall ── */}
      <rect x="0" y="0" width="700" height="460" fill="#ebe3c8" />

      {/* ── Ceiling strip ── */}
      <rect x="0" y="0" width="700" height="46" fill="#d8d0bc" />
      <rect x="0" y="42" width="700" height="4" fill="#c8c0a8" />
      {/* 3 ceiling lights */}
      {[116, 350, 584].map((x, i) => (
        <g key={i}>
          <rect x={x - 44} y="7" width="88" height="18" rx="4" fill="#c4bba8" />
          <rect
            x={x - 40}
            y="9"
            width="80"
            height="14"
            rx="3"
            fill="#fffdf7"
            opacity="0.92"
            style={{
              animation: `ceiling-hum 3s ${i * 0.6}s ease-in-out infinite`,
            }}
          />
        </g>
      ))}

      {/* ── TI sign on wall ── */}
      <rect
        x="232"
        y="58"
        width="236"
        height="34"
        rx="7"
        fill="white"
        opacity="0.95"
      />
      <rect x="236" y="62" width="228" height="26" rx="5" fill="white" />
      <text
        x="350"
        y="80"
        textAnchor="middle"
        fontFamily="'Playfair Display',serif"
        fontSize="13"
        fontWeight="700"
        fill="#cc1f1f"
        letterSpacing="1.5"
      >
        TEXAS INSTRUMENTS
      </text>

      {/* ── Cubicle walls — this is a single bay ── */}
      {/* Left wall */}
      <rect x="0" y="102" width="12" height="360" fill="#c4b99a" />
      {/* Right wall */}
      <rect x="688" y="102" width="12" height="360" fill="#c4b99a" />
      {/* Top rail */}
      <rect x="0" y="102" width="700" height="10" fill="#c4b99a" />
      {/* Center partition hint (subtle) */}
      <rect
        x="347"
        y="112"
        width="6"
        height="210"
        fill="#c4b99a"
        opacity="0.4"
      />

      {/* ── Desk ── surface top at y=320, 18px thick, full width */}
      <rect x="12" y="320" width="676" height="22" rx="6" fill="#a89070" />
      {/* Desk top highlight */}
      <rect x="12" y="320" width="676" height="6" rx="4" fill="#b8a082" />
      {/* Desk front shadow */}
      <rect
        x="12"
        y="338"
        width="676"
        height="4"
        rx="0"
        fill="#8a7060"
        opacity="0.4"
      />
      {/* Desk legs */}
      <rect x="24" y="342" width="14" height="118" rx="5" fill="#8a7060" />
      <rect x="662" y="342" width="14" height="118" rx="5" fill="#8a7060" />
      <rect x="280" y="342" width="12" height="118" rx="4" fill="#8a7060" />
      <rect x="408" y="342" width="12" height="118" rx="4" fill="#8a7060" />

      {/* ── Monitor on desk (center) ── */}
      {/* Stand: bottom of stand = desk top = y=320 */}
      <rect x="329" y="302" width="18" height="20" rx="4" fill="#374151" />
      <rect x="318" y="316" width="40" height="6" rx="3" fill="#374151" />
      {/* Screen: bottom of screen = y=302 */}
      <rect x="256" y="200" width="164" height="104" rx="8" fill="#1e293b" />
      <rect x="260" y="204" width="156" height="94" rx="6" fill="#0c1a33" />
      {/* Screen content */}
      <rect
        x="268"
        y="212"
        width="140"
        height="4"
        rx="2"
        fill="#7dd3fc"
        opacity="0.8"
      />
      <rect
        x="268"
        y="220"
        width="106"
        height="4"
        rx="2"
        fill="#4b5563"
        opacity="0.6"
      />
      <rect
        x="268"
        y="228"
        width="124"
        height="4"
        rx="2"
        fill="#4b5563"
        opacity="0.5"
      />
      <rect
        x="268"
        y="236"
        width="140"
        height="5"
        rx="2.5"
        fill="#ef4444"
        opacity="0.75"
        style={{ animation: "alert-pulse 1.8s ease-in-out infinite" }}
      />
      <rect
        x="268"
        y="244"
        width="90"
        height="4"
        rx="2"
        fill="#4b5563"
        opacity="0.4"
      />
      <rect
        x="268"
        y="252"
        width="116"
        height="4"
        rx="2"
        fill="#4b5563"
        opacity="0.35"
      />
      <rect
        x="268"
        y="260"
        width="76"
        height="4"
        rx="2"
        fill="#7dd3fc"
        opacity="0.3"
      />
      {/* Keyboard */}
      <rect x="258" y="306" width="160" height="16" rx="4" fill="#c4bba8" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={261 + i * 12}
          y={308}
          width="10"
          height="6"
          rx="2"
          fill="#b0a890"
        />
      ))}

      {/* ── Left desk items (ARIA side) ── */}
      {/* Coffee mug */}
      <rect x="60" y="296" width="28" height="28" rx="7" fill="#e8624a" />
      <path
        d="M 88 303 Q 100 303 100 312 Q 100 321 88 321"
        fill="none"
        stroke="#c8442a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 68 292 Q 65 283 68 276"
        fill="none"
        stroke="#c4b0a0"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
        style={{ animation: "drone-float 2.2s ease-in-out infinite" }}
      />
      <path
        d="M 76 290 Q 73 281 76 274"
        fill="none"
        stroke="#c4b0a0"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
        style={{ animation: "drone-float 2.2s 0.5s ease-in-out infinite" }}
      />

      {/* ── Right desk items (BOLT side) ── */}
      {/* Notepad */}
      <rect x="566" y="294" width="72" height="30" rx="4" fill="#fffdf7" />
      <rect
        x="566"
        y="294"
        width="72"
        height="30"
        rx="4"
        fill="none"
        stroke="#ddd5bc"
        strokeWidth="1.5"
      />
      <rect x="571" y="300" width="62" height="2" rx="1" fill="#ddd5bc" />
      <rect x="571" y="305" width="48" height="2" rx="1" fill="#ddd5bc" />
      <rect x="571" y="310" width="56" height="2" rx="1" fill="#ddd5bc" />
      {/* Pen */}
      <rect x="640" y="290" width="5" height="34" rx="2.5" fill="#1e293b" />
      <rect x="641" y="290" width="2" height="7" rx="1" fill="#fbbf24" />

      {/* ══════════════════════════════════════════
          SPEECH BUBBLES
          These sit above the robots' heads.
          ARIA: bubble on left side, tail points down-right (toward ARIA head)
          BOLT: bubble on right side, tail points down-left (toward BOLT head)
          ══════════════════════════════════════════ */}

      {/* ARIA bubble — right of center-left area */}
      {ariaText && (
        <g>
          {/* Bubble rect */}
          <rect
            x={A - 20}
            y={ariaBubbleY}
            width={ariaBubbleW}
            height={ariaBubbleH}
            rx="12"
            fill={ariaIsDone ? "#d1fae5" : "#fffdf7"}
            stroke={ariaIsDone ? "#3d6b4f" : "#1c1a16"}
            strokeWidth="2"
            style={{ filter: "drop-shadow(2px 3px 0 rgba(28,26,22,0.10))" }}
          />
          {/* Tail: points down toward ARIA's head (center x ≈ A) */}
          {!ariaIsThinking && (
            <polygon
              points={`${A + 14},${ariaBubbleY + ariaBubbleH} ${A + 26},${ariaBubbleY + ariaBubbleH} ${A + 16},${ariaBubbleY + ariaBubbleH + 12}`}
              fill={ariaIsDone ? "#fffdf7" : "#fffdf7"}
              stroke={ariaIsDone ? "#3d6b4f" : "#1c1a16"}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}
          {/* Cover the bubble-border inside the tail join */}
          {!ariaIsThinking && (
            <rect
              x={A + 15}
              y={ariaBubbleY + ariaBubbleH - 2}
              width="10"
              height="4"
              fill={ariaIsDone ? "#d1fae5" : "#fffdf7"}
            />
          )}
          {/* Thought dots */}
          {ariaIsThinking && (
            <>
              <circle
                cx={A + 22}
                cy={ariaBubbleY + ariaBubbleH + 6}
                r="4"
                fill="#9b978f"
                opacity="0.7"
              />
              <circle
                cx={A + 34}
                cy={ariaBubbleY + ariaBubbleH + 14}
                r="6"
                fill="#9b978f"
                opacity="0.8"
              />
              <circle
                cx={A + 48}
                cy={ariaBubbleY + ariaBubbleH + 20}
                r="3"
                fill="#9b978f"
                opacity="0.6"
              />
            </>
          )}
          {/* Text lines */}
          {ariaLines.map((line, i) => (
            <text
              key={i}
              x={A - 20 + 12}
              y={ariaBubbleY + 18 + i * 16}
              fontFamily="'DM Mono',monospace"
              fontSize="11"
              fill="#1c1a16"
            >
              {line}
            </text>
          ))}
        </g>
      )}

      {/* BOLT bubble — left of center-right area */}
      {boltText && (
        <g>
          <rect
            x={B - ariaBubbleW + 20}
            y={boltBubbleY}
            width={boltBubbleW}
            height={boltBubbleH}
            rx="12"
            fill={boltIsDone ? "#d1fae5" : "#fffdf7"}
            stroke={boltIsDone ? "#3d6b4f" : "#1c1a16"}
            strokeWidth="2"
            style={{ filter: "drop-shadow(2px 3px 0 rgba(28,26,22,0.10))" }}
          />
          {/* Tail: points down toward BOLT's head */}
          {!boltIsThinking && (
            <polygon
              points={`${B - 14},${boltBubbleY + boltBubbleH} ${B - 26},${boltBubbleY + boltBubbleH} ${B - 16},${boltBubbleY + boltBubbleH + 12}`}
              fill="#fffdf7"
              stroke={boltIsDone ? "#3d6b4f" : "#1c1a16"}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}
          {!boltIsThinking && (
            <rect
              x={B - 24}
              y={boltBubbleY + boltBubbleH - 2}
              width="10"
              height="4"
              fill={boltIsDone ? "#d1fae5" : "#fffdf7"}
            />
          )}
          {boltIsThinking && (
            <>
              <circle
                cx={B - 22}
                cy={boltBubbleY + boltBubbleH + 6}
                r="4"
                fill="#9b978f"
                opacity="0.7"
              />
              <circle
                cx={B - 34}
                cy={boltBubbleY + boltBubbleH + 14}
                r="6"
                fill="#9b978f"
                opacity="0.8"
              />
              <circle
                cx={B - 48}
                cy={boltBubbleY + boltBubbleH + 20}
                r="3"
                fill="#9b978f"
                opacity="0.6"
              />
            </>
          )}
          {boltLines.map((line, i) => (
            <text
              key={i}
              x={B - ariaBubbleW + 32}
              y={boltBubbleY + 18 + i * 16}
              fontFamily="'DM Mono',monospace"
              fontSize="11"
              fill="#1c1a16"
            >
              {line}
            </text>
          ))}
        </g>
      )}

      {/* ══════════════════════════════════════════
          ARIA ROBOT
          Center x=175, feet bottom = y=458
          Robot is 110px wide, 158px tall
          So: left x=120, right x=230, head top=300
          ══════════════════════════════════════════ */}
      <AriaRobotSVG
        cx={A}
        fy={FY}
        act={ariaAct}
        visor={ariaVisor}
        body={ariaBody}
      />

      {/* ARIA name tag — below feet */}
      <rect
        x={A - 32}
        y={FY + 4}
        width="64"
        height="18"
        rx="9"
        fill="#dbeafe"
        stroke="#7ab4d8"
        strokeWidth="1"
      />
      <text
        x={A}
        y={FY + 16}
        textAnchor="middle"
        fontFamily="'DM Mono',monospace"
        fontSize="9"
        fontWeight="500"
        fill="#2a5f8f"
        letterSpacing="0.08em"
      >
        {ariaName}
      </text>

      {/* ══════════════════════════════════════════
          BOLT ROBOT
          Center x=525, feet bottom = y=458
          ══════════════════════════════════════════ */}
      <BoltRobotSVG
        cx={B}
        fy={FY}
        act={boltAct}
        eyeCol={boltEye}
        body={boltBody}
      />

      {/* BOLT name tag */}
      <rect
        x={B - 32}
        y={FY + 4}
        width="64"
        height="18"
        rx="9"
        fill="#d1fae5"
        stroke="#7ab08a"
        strokeWidth="1"
      />
      <text
        x={B}
        y={FY + 16}
        textAnchor="middle"
        fontFamily="'DM Mono',monospace"
        fontSize="9"
        fontWeight="500"
        fill="#3d6b4f"
        letterSpacing="0.08em"
      >
        {boltName}
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════
   ARIA ROBOT — inline SVG group
   cx = center x, fy = feet bottom y
   Total height = 158px, width = 110px
   All coords relative to (cx, fy)

   Structure from bottom to top:
   fy-0:   feet bottom
   fy-18:  feet top / leg bottom
   fy-60:  leg top / torso bottom
   fy-118: torso top / head bottom  (shoulder=fy-108)
   fy-158: head top
   ══════════════════════════════════════════ */
function AriaRobotSVG({ cx, fy, act, visor, body }) {
  const isReading = act === "Reading";
  const isThinking = act === "Thinking";
  const isResponding = act === "Responding";
  const isDone = act === "Done";
  const x = cx; // shorthand

  return (
    <g>
      {/* Shadow */}
      <ellipse cx={x} cy={fy + 2} rx="36" ry="6" fill="rgba(28,26,22,0.10)" />

      {/* ── Feet ── */}
      <rect
        x={x - 44}
        y={fy - 16}
        width="36"
        height="16"
        rx="7"
        fill="#1e293b"
      />
      <rect
        x={x + 8}
        y={fy - 16}
        width="36"
        height="16"
        rx="7"
        fill="#1e293b"
      />
      {/* Boot highlight */}
      <rect
        x={x - 42}
        y={fy - 15}
        width="32"
        height="5"
        rx="3"
        fill="#263a52"
        opacity="0.8"
      />
      <rect
        x={x + 10}
        y={fy - 15}
        width="32"
        height="5"
        rx="3"
        fill="#263a52"
        opacity="0.8"
      />

      {/* ── Lower legs ── */}
      <rect
        x={x - 38}
        y={fy - 60}
        width="24"
        height="46"
        rx="8"
        fill="#243755"
      />
      <rect
        x={x + 14}
        y={fy - 60}
        width="24"
        height="46"
        rx="8"
        fill="#243755"
      />
      {/* Knee detail */}
      <rect
        x={x - 40}
        y={fy - 62}
        width="28"
        height="10"
        rx="5"
        fill={visor}
        opacity="0.35"
      />
      <rect
        x={x + 12}
        y={fy - 62}
        width="28"
        height="10"
        rx="5"
        fill={visor}
        opacity="0.35"
      />

      {/* ── Torso ── */}
      <rect
        x={x - 46}
        y={fy - 118}
        width="92"
        height="62"
        rx="14"
        fill={body}
      />
      {/* Chest panel */}
      <rect
        x={x - 38}
        y={fy - 112}
        width="76"
        height="44"
        rx="9"
        fill="#0d1d35"
      />
      {/* Panel content */}
      {isReading && (
        <>
          <rect
            x={x - 34}
            y={fy - 107}
            width="68"
            height="3.5"
            rx="1.5"
            fill="#7dd3fc"
            opacity="0.9"
          />
          <rect
            x={x - 34}
            y={fy - 100}
            width="50"
            height="3.5"
            rx="1.5"
            fill="#93c5fd"
            opacity="0.6"
          />
          <rect
            x={x - 34}
            y={fy - 93}
            width="68"
            height="4.5"
            rx="2"
            fill="#fca5a5"
            opacity="0.85"
            style={{ animation: "alert-pulse 1.4s ease-in-out infinite" }}
          />
          <rect
            x={x - 34}
            y={fy - 85}
            width="40"
            height="3.5"
            rx="1.5"
            fill="#93c5fd"
            opacity="0.5"
          />
        </>
      )}
      {isThinking && (
        <>
          <rect
            x={x - 34}
            y={fy - 107}
            width="68"
            height="3.5"
            rx="1.5"
            fill="#c4b5fd"
            opacity="0.8"
          />
          <rect
            x={x - 34}
            y={fy - 100}
            width="44"
            height="3.5"
            rx="1.5"
            fill="#a78bfa"
            opacity="0.5"
          />
          <rect
            x={x - 34}
            y={fy - 93}
            width="58"
            height="3.5"
            rx="1.5"
            fill="#c4b5fd"
            opacity="0.4"
          />
          <rect
            x={x - 34}
            y={fy - 86}
            width="30"
            height="3.5"
            rx="1.5"
            fill="#a78bfa"
            opacity="0.3"
          />
        </>
      )}
      {isResponding &&
        [0, 9, 18, 27, 36, 45, 54].map((dx, i) => (
          <rect
            key={i}
            x={x - 34 + dx}
            y={fy - 107 + (i % 4) * 2}
            width="5"
            height={16 - (i % 4) * 3}
            rx="2"
            fill="#6ee7b7"
            opacity="0.85"
            style={{
              animation: `wave-anim ${0.3 + i * 0.07}s ease-in-out ${i * 0.06}s infinite alternate`,
            }}
          />
        ))}
      {isDone && (
        <>
          <rect
            x={x - 34}
            y={fy - 110}
            width="68"
            height="42"
            rx="7"
            fill="#064e3b"
            opacity="0.8"
          />
          <text x={x} y={fy - 84} textAnchor="middle" fontSize="22">
            ✅
          </text>
        </>
      )}
      {!isReading && !isThinking && !isResponding && !isDone && (
        <>
          <rect
            x={x - 34}
            y={fy - 107}
            width="68"
            height="2.5"
            rx="1"
            fill="#334155"
            opacity="0.6"
          />
          <rect
            x={x - 34}
            y={fy - 101}
            width="50"
            height="2.5"
            rx="1"
            fill="#334155"
            opacity="0.4"
          />
          <rect
            x={x - 34}
            y={fy - 95}
            width="60"
            height="2.5"
            rx="1"
            fill="#334155"
            opacity="0.3"
          />
          <rect
            x={x - 34}
            y={fy - 89}
            width="36"
            height="2.5"
            rx="1"
            fill="#334155"
            opacity="0.2"
          />
        </>
      )}

      {/* ── Arms ── */}
      <rect x={x - 62} y={fy - 114} width="18" height="48" rx="9" fill={body} />
      <rect x={x + 44} y={fy - 114} width="18" height="48" rx="9" fill={body} />
      {/* Elbow */}
      <rect
        x={x - 63}
        y={fy - 96}
        width="20"
        height="8"
        rx="4"
        fill={visor}
        opacity="0.3"
      />
      <rect
        x={x + 43}
        y={fy - 96}
        width="20"
        height="8"
        rx="4"
        fill={visor}
        opacity="0.3"
      />
      {/* Hands */}
      <ellipse cx={x - 53} cy={fy - 62} rx="10" ry="9" fill="#1e293b" />
      <ellipse cx={x + 53} cy={fy - 62} rx="10" ry="9" fill="#1e293b" />

      {/* ── Neck ── */}
      <rect
        x={x - 14}
        y={fy - 130}
        width="28"
        height="14"
        rx="7"
        fill="#1a3050"
      />
      {/* Neck bolts */}
      <circle cx={x - 8} cy={fy - 123} r="3.5" fill={visor} opacity="0.6" />
      <circle cx={x + 8} cy={fy - 123} r="3.5" fill={visor} opacity="0.6" />

      {/* ── Head ── */}
      <rect
        x={x - 42}
        y={fy - 160}
        width="84"
        height="34"
        rx="16"
        fill="#1e3a5f"
      />
      {/* Head top dome */}
      <ellipse cx={x} cy={fy - 160} rx="42" ry="12" fill="#1e3a5f" />
      {/* Head shine */}
      <rect
        x={x - 28}
        y={fy - 168}
        width="28"
        height="8"
        rx="6"
        fill="rgba(255,255,255,0.07)"
      />
      {/* Side bolts */}
      <circle cx={x - 42} cy={fy - 143} r="5" fill="#0f172a" />
      <circle cx={x - 42} cy={fy - 143} r="3" fill="#1e293b" />
      <circle cx={x + 42} cy={fy - 143} r="5" fill="#0f172a" />
      <circle cx={x + 42} cy={fy - 143} r="3" fill="#1e293b" />

      {/* Antenna */}
      <rect
        x={x - 3}
        y={fy - 176}
        width="6"
        height="18"
        rx="3"
        fill="#0f172a"
      />
      <circle
        cx={x}
        cy={fy - 178}
        r="8"
        fill={visor}
        opacity="0.8"
        style={{ animation: "pip-pulse 2s ease-in-out infinite" }}
      />
      <circle cx={x} cy={fy - 178} r="4" fill="white" opacity="0.45" />

      {/* Visor panel */}
      <rect
        x={x - 34}
        y={fy - 154}
        width="68"
        height="22"
        rx="9"
        fill="#060e1c"
      />
      <rect
        x={x - 32}
        y={fy - 152}
        width="64"
        height="18"
        rx="7"
        fill={visor}
        opacity="0.12"
      />
      {/* Scan line */}
      <rect
        x={x - 30}
        y={fy - 144}
        width="60"
        height="1"
        fill={visor}
        opacity="0.3"
      />

      {/* Eyes */}
      {isThinking ? (
        <>
          <ellipse
            cx={x - 16}
            cy={fy - 143}
            rx="10"
            ry="8"
            fill={visor}
            opacity="0.2"
          />
          <circle cx={x - 16} cy={fy - 143} r="7" fill={visor} opacity="0.9" />
          <circle cx={x - 16} cy={fy - 146} r="3" fill="white" opacity="0.9" />
          <ellipse
            cx={x + 16}
            cy={fy - 143}
            rx="10"
            ry="8"
            fill={visor}
            opacity="0.2"
          />
          <circle cx={x + 16} cy={fy - 143} r="7" fill={visor} opacity="0.9" />
          <circle cx={x + 16} cy={fy - 146} r="3" fill="white" opacity="0.9" />
        </>
      ) : (
        <>
          <rect
            x={x - 28}
            y={fy - 152}
            width="22"
            height="14"
            rx="5"
            fill={visor}
            opacity={isReading ? 0.95 : 0.7}
          />
          <rect
            x={x + 6}
            y={fy - 152}
            width="22"
            height="14"
            rx="5"
            fill={visor}
            opacity={isReading ? 0.95 : 0.7}
          />
          <circle cx={x - 17} cy={fy - 145} r="4" fill="white" opacity="0.5" />
          <circle cx={x + 17} cy={fy - 145} r="4" fill="white" opacity="0.5" />
        </>
      )}

      {/* Mouth grille */}
      <rect
        x={x - 22}
        y={fy - 132}
        width="44"
        height="6"
        rx="3"
        fill="#060e1c"
      />
      {isResponding
        ? [0, 7, 14, 21, 28, 35].map((dx, i) => (
            <rect
              key={i}
              x={x - 22 + dx}
              y={fy - 131}
              width="4"
              height={3 + (i % 3) * 1.5}
              rx="1.5"
              fill="#6ee7b7"
              opacity="0.9"
              style={{
                animation: `wave-anim ${0.3 + i * 0.06}s ease-in-out infinite alternate`,
              }}
            />
          ))
        : [0, 7, 14, 21, 28, 35].map((dx, i) => (
            <rect
              key={i}
              x={x - 22 + dx}
              y={fy - 130}
              width="4"
              height="2.5"
              rx="1"
              fill="#1e3a5f"
              opacity="0.9"
            />
          ))}

      {/* Thinking bubbles */}
      {isThinking && (
        <>
          <circle
            cx={x + 50}
            cy={fy - 152}
            r="5"
            fill="#c4b5fd"
            opacity="0.7"
            style={{ animation: "think-bob 1.4s ease-in-out infinite" }}
          />
          <circle
            cx={x + 60}
            cy={fy - 164}
            r="7"
            fill="#c4b5fd"
            opacity="0.8"
            style={{ animation: "think-bob 1.4s 0.22s ease-in-out infinite" }}
          />
          <circle
            cx={x + 68}
            cy={fy - 177}
            r="9"
            fill="#c4b5fd"
            opacity="0.9"
            style={{ animation: "think-bob 1.4s 0.44s ease-in-out infinite" }}
          />
        </>
      )}

      {/* Headset */}
      {isResponding && (
        <>
          <path
            d={`M ${x - 42} ${fy - 146} Q ${x - 42} ${fy - 174} ${x} ${fy - 174} Q ${x + 42} ${fy - 174} ${x + 42} ${fy - 146}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <rect
            x={x - 52}
            y={fy - 152}
            width="12"
            height="16"
            rx="6"
            fill="#38bdf8"
          />
          <rect
            x={x + 40}
            y={fy - 152}
            width="12"
            height="16"
            rx="6"
            fill="#38bdf8"
          />
          <path
            d={`M ${x - 52} ${fy - 140} Q ${x - 58} ${fy - 138} ${x - 58} ${fy - 132}`}
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx={x - 58}
            cy={fy - 130}
            r="3"
            fill="#7dd3fc"
            opacity="0.9"
          />
        </>
      )}

      {/* Done badge */}
      {isDone && (
        <>
          <circle cx={x + 38} cy={fy - 170} r="13" fill="#166534" />
          <circle cx={x + 38} cy={fy - 170} r="11" fill="#16a34a" />
          <text
            x={x + 38}
            y={fy - 165}
            textAnchor="middle"
            fontSize="12"
            fill="white"
          >
            ✓
          </text>
        </>
      )}
    </g>
  );
}

/* ══════════════════════════════════════════
   BOLT ROBOT — inline SVG group
   cx = center x, fy = feet bottom y
   Total height ≈ 162px, width ≈ 120px
   Stockier than ARIA, hard-hat, wider torso

   fy-0:   feet bottom
   fy-20:  feet top
   fy-66:  leg top / torso bottom
   fy-130: torso top (wider: ±52px)
   fy-166: head top (including hat)
   ══════════════════════════════════════════ */
function BoltRobotSVG({ cx, fy, act, eyeCol, body }) {
  const isReading = act === "Reading";
  const isThinking = act === "Thinking";
  const isResponding = act === "Responding";
  const isDone = act === "Done";
  const x = cx;

  return (
    <g>
      {/* Shadow */}
      <ellipse cx={x} cy={fy + 2} rx="40" ry="6" fill="rgba(28,26,22,0.10)" />

      {/* ── Wide work boots ── */}
      <rect
        x={x - 48}
        y={fy - 20}
        width="40"
        height="20"
        rx="8"
        fill="#1c0a00"
      />
      <rect
        x={x + 8}
        y={fy - 20}
        width="40"
        height="20"
        rx="8"
        fill="#1c0a00"
      />
      {/* Toe cap */}
      <ellipse cx={x - 28} cy={fy} rx="18" ry="6" fill="#2d1200" />
      <ellipse cx={x + 28} cy={fy} rx="18" ry="6" fill="#2d1200" />
      {/* Boot highlight */}
      <rect
        x={x - 46}
        y={fy - 19}
        width="36"
        height="5"
        rx="3"
        fill="#3d1800"
        opacity="0.7"
      />
      <rect
        x={x + 10}
        y={fy - 19}
        width="36"
        height="5"
        rx="3"
        fill="#3d1800"
        opacity="0.7"
      />

      {/* ── Chunky legs ── */}
      <rect
        x={x - 42}
        y={fy - 68}
        width="28"
        height="50"
        rx="9"
        fill="#5c2800"
      />
      <rect
        x={x + 14}
        y={fy - 68}
        width="28"
        height="50"
        rx="9"
        fill="#5c2800"
      />
      {/* Knee pads */}
      <rect
        x={x - 44}
        y={fy - 70}
        width="32"
        height="12"
        rx="6"
        fill="#c47a1a"
      />
      <rect
        x={x + 12}
        y={fy - 70}
        width="32"
        height="12"
        rx="6"
        fill="#c47a1a"
      />
      <rect
        x={x - 42}
        y={fy - 69}
        width="28"
        height="8"
        rx="4"
        fill="#d4921e"
        opacity="0.7"
      />
      <rect
        x={x + 14}
        y={fy - 69}
        width="28"
        height="8"
        rx="4"
        fill="#d4921e"
        opacity="0.7"
      />

      {/* ── Wide torso ── */}
      <rect
        x={x - 52}
        y={fy - 132}
        width="104"
        height="68"
        rx="14"
        fill={body}
      />
      {/* Hi-vis stripe */}
      <rect
        x={x - 52}
        y={fy - 112}
        width="104"
        height="10"
        rx="0"
        fill="#d4921e"
        opacity="0.35"
      />
      {/* Chest badge */}
      <rect
        x={x - 36}
        y={fy - 126}
        width="42"
        height="28"
        rx="7"
        fill="#3d1600"
      />
      <rect
        x={x - 33}
        y={fy - 123}
        width="36"
        height="22"
        rx="5"
        fill="#2d0e00"
      />
      {isReading && (
        <>
          <rect
            x={x - 31}
            y={fy - 120}
            width="32"
            height="3"
            rx="1.5"
            fill="#7dd3fc"
            opacity="0.9"
          />
          <rect
            x={x - 31}
            y={fy - 114}
            width="22"
            height="3"
            rx="1.5"
            fill="#93c5fd"
            opacity="0.6"
          />
          <rect
            x={x - 31}
            y={fy - 108}
            width="32"
            height="4"
            rx="2"
            fill="#fca5a5"
            opacity="0.85"
            style={{ animation: "alert-pulse 1.4s ease-in-out infinite" }}
          />
        </>
      )}
      {isThinking && (
        <text x={x - 15} y={fy - 106} fontSize="16">
          ⚙️
        </text>
      )}
      {isResponding && (
        <text x={x - 15} y={fy - 106} fontSize="16">
          ⚡
        </text>
      )}
      {isDone && (
        <text x={x - 15} y={fy - 106} fontSize="16">
          ✅
        </text>
      )}
      {!isReading && !isThinking && !isResponding && !isDone && (
        <text
          x={x - 15}
          y={fy - 107}
          fontSize="8"
          fontWeight="700"
          fill="#7c3a0e"
          letterSpacing="1"
        >
          BOLT
        </text>
      )}
      {/* Belt */}
      <rect
        x={x - 52}
        y={fy - 68}
        width="104"
        height="8"
        rx="4"
        fill="#3d1600"
      />
      <rect
        x={x - 10}
        y={fy - 70}
        width="20"
        height="12"
        rx="3"
        fill="#c47a1a"
      />
      <rect
        x={x - 7}
        y={fy - 68}
        width="14"
        height="8"
        rx="2"
        fill="#d4921e"
        opacity="0.8"
      />

      {/* ── Wide arms ── */}
      <rect
        x={x - 72}
        y={fy - 128}
        width="22"
        height="52"
        rx="11"
        fill={body}
      />
      <rect
        x={x + 50}
        y={fy - 128}
        width="22"
        height="52"
        rx="11"
        fill={body}
      />
      {/* Elbow guard */}
      <rect
        x={x - 74}
        y={fy - 110}
        width="26"
        height="10"
        rx="5"
        fill="#c47a1a"
        opacity="0.45"
      />
      <rect
        x={x + 48}
        y={fy - 110}
        width="26"
        height="10"
        rx="5"
        fill="#c47a1a"
        opacity="0.45"
      />
      {/* Fists */}
      <ellipse cx={x - 61} cy={fy - 72} rx="12" ry="11" fill="#2d0e00" />
      <ellipse cx={x + 61} cy={fy - 72} rx="12" ry="11" fill="#2d0e00" />
      {/* Knuckle bumps */}
      {[-3, 0, 3].map((dx, i) => (
        <circle key={i} cx={x - 61 + dx} cy={fy - 78} r="3" fill="#3d1600" />
      ))}
      {/* Wrench in right hand */}
      {(isResponding || isReading) && (
        <>
          <rect
            x={x + 62}
            y={fy - 80}
            width="26"
            height="8"
            rx="4"
            fill="#92400e"
          />
          <rect
            x={x + 84}
            y={fy - 86}
            width="8"
            height="20"
            rx="4"
            fill="#78350f"
          />
          <rect
            x={x + 82}
            y={fy - 88}
            width="12"
            height="5"
            rx="2.5"
            fill="#c47a1a"
          />
          <rect
            x={x + 82}
            y={fy - 72}
            width="12"
            height="5"
            rx="2.5"
            fill="#c47a1a"
          />
        </>
      )}

      {/* ── Neck ── short and wide */}
      <rect
        x={x - 16}
        y={fy - 144}
        width="32"
        height="14"
        rx="7"
        fill="#5c2800"
      />
      <circle cx={x - 10} cy={fy - 137} r="4" fill="#c47a1a" opacity="0.75" />
      <circle cx={x - 10} cy={fy - 137} r="2" fill="#d4921e" opacity="0.6" />
      <circle cx={x + 10} cy={fy - 137} r="4" fill="#c47a1a" opacity="0.75" />
      <circle cx={x + 10} cy={fy - 137} r="2" fill="#d4921e" opacity="0.6" />

      {/* ── Hard hat ── */}
      {/* Dome */}
      <ellipse cx={x} cy={fy - 162} rx="48" ry="22" fill="#d4921e" />
      {/* Hat band */}
      <rect
        x={x - 46}
        y={fy - 148}
        width="92"
        height="12"
        rx="6"
        fill="#c47a1a"
      />
      {/* Brim */}
      <ellipse cx={x} cy={fy - 148} rx="52" ry="7" fill="#b45309" />
      <ellipse
        cx={x}
        cy={fy - 144}
        rx="52"
        ry="5"
        fill="#b45309"
        opacity="0.5"
      />
      {/* Hat logo stripe */}
      <rect
        x={x - 20}
        y={fy - 170}
        width="40"
        height="8"
        rx="4"
        fill="white"
        opacity="0.18"
      />
      {/* Hat rivet */}
      <circle cx={x} cy={fy - 174} r="5" fill="#c47a1a" opacity="0.7" />
      <circle cx={x} cy={fy - 174} r="3" fill="#fef3c7" opacity="0.5" />

      {/* ── Head (under hat brim) ── */}
      <rect
        x={x - 38}
        y={fy - 148}
        width="76"
        height="38"
        rx="12"
        fill="#f5c842"
      />
      {/* Cheek blush */}
      <ellipse
        cx={x - 28}
        cy={fy - 116}
        rx="10"
        ry="7"
        fill="#e8aa30"
        opacity="0.4"
      />
      <ellipse
        cx={x + 28}
        cy={fy - 116}
        rx="10"
        ry="7"
        fill="#e8aa30"
        opacity="0.4"
      />

      {/* Eyes */}
      {isThinking ? (
        <>
          <ellipse cx={x - 16} cy={fy - 132} rx="13" ry="11" fill="#fffbeb" />
          <ellipse cx={x - 16} cy={fy - 132} rx="10" ry="8" fill={eyeCol} />
          <circle cx={x - 16} cy={fy - 135} r="4" fill="#1c0a00" />
          <circle cx={x - 15} cy={fy - 136} r="2" fill="white" opacity="0.85" />
          <ellipse cx={x + 16} cy={fy - 132} rx="13" ry="11" fill="#fffbeb" />
          <ellipse cx={x + 16} cy={fy - 132} rx="10" ry="8" fill={eyeCol} />
          <circle cx={x + 16} cy={fy - 135} r="4" fill="#1c0a00" />
          <circle cx={x + 17} cy={fy - 136} r="2" fill="white" opacity="0.85" />
        </>
      ) : (
        <>
          <ellipse cx={x - 16} cy={fy - 131} rx="13" ry="11" fill="#1c0a00" />
          <ellipse cx={x - 16} cy={fy - 131} rx="10" ry="8" fill={eyeCol} />
          <circle cx={x - 16} cy={fy - 135} r="4" fill="white" opacity="0.8" />
          <circle cx={x - 15} cy={fy - 136} r="2" fill={eyeCol} opacity="0.4" />
          <ellipse cx={x + 16} cy={fy - 131} rx="13" ry="11" fill="#1c0a00" />
          <ellipse cx={x + 16} cy={fy - 131} rx="10" ry="8" fill={eyeCol} />
          <circle cx={x + 16} cy={fy - 135} r="4" fill="white" opacity="0.8" />
          <circle cx={x + 17} cy={fy - 136} r="2" fill={eyeCol} opacity="0.4" />
        </>
      )}

      {/* Eyebrows */}
      {isThinking ? (
        <>
          <rect
            x={x - 28}
            y={fy - 146}
            width="24"
            height="4"
            rx="2"
            fill="#3d1600"
            transform={`rotate(-9,${x - 16},${fy - 144})`}
          />
          <rect
            x={x + 4}
            y={fy - 146}
            width="24"
            height="4"
            rx="2"
            fill="#3d1600"
            transform={`rotate(9,${x + 16},${fy - 144})`}
          />
        </>
      ) : (
        <>
          <rect
            x={x - 28}
            y={fy - 144}
            width="24"
            height="3.5"
            rx="1.5"
            fill="#3d1600"
            opacity="0.9"
          />
          <rect
            x={x + 4}
            y={fy - 144}
            width="24"
            height="3.5"
            rx="1.5"
            fill="#3d1600"
            opacity="0.9"
          />
        </>
      )}

      {/* Nose */}
      <ellipse
        cx={x}
        cy={fy - 122}
        rx="5"
        ry="3.5"
        fill="#e8aa30"
        opacity="0.7"
      />

      {/* Mouth */}
      {isResponding ? (
        <path
          d={`M ${x - 18} ${fy - 113} Q ${x} ${fy - 104} ${x + 18} ${fy - 113}`}
          fill="none"
          stroke="#3d1600"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : isThinking ? (
        <path
          d={`M ${x - 14} ${fy - 112} Q ${x} ${fy - 115} ${x + 14} ${fy - 112}`}
          fill="none"
          stroke="#3d1600"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : isDone ? (
        <path
          d={`M ${x - 18} ${fy - 113} Q ${x} ${fy - 104} ${x + 18} ${fy - 113}`}
          fill="none"
          stroke="#3d1600"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d={`M ${x - 16} ${fy - 112} Q ${x} ${fy - 106} ${x + 16} ${fy - 112}`}
          fill="none"
          stroke="#3d1600"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}

      {/* Thinking gear bubbles */}
      {isThinking && (
        <>
          <circle
            cx={x + 58}
            cy={fy - 144}
            r="5"
            fill="#fcd34d"
            opacity="0.7"
            style={{ animation: "think-bob 1.4s ease-in-out infinite" }}
          />
          <text x={x + 58} y={fy - 141} textAnchor="middle" fontSize="7">
            ⚙
          </text>
          <circle
            cx={x + 66}
            cy={fy - 158}
            r="7"
            fill="#fcd34d"
            opacity="0.8"
            style={{ animation: "think-bob 1.4s 0.22s ease-in-out infinite" }}
          />
          <text x={x + 66} y={fy - 154} textAnchor="middle" fontSize="10">
            ⚙
          </text>
          <circle
            cx={x + 72}
            cy={fy - 172}
            r="9"
            fill="#fcd34d"
            opacity="0.9"
            style={{ animation: "think-bob 1.4s 0.44s ease-in-out infinite" }}
          />
          <text x={x + 72} y={fy - 167} textAnchor="middle" fontSize="12">
            ⚙
          </text>
        </>
      )}

      {/* Radio earpiece */}
      {isResponding && (
        <>
          <circle cx={x - 40} cy={fy - 126} r="6" fill="#7c3a0e" />
          <circle cx={x - 40} cy={fy - 126} r="4" fill="#c47a1a" />
          <path
            d={`M ${x - 46} ${fy - 126} Q ${x - 52} ${fy - 122} ${x - 52} ${fy - 116}`}
            fill="none"
            stroke="#c47a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx={x - 52}
            cy={fy - 114}
            r="3"
            fill="#d4921e"
            opacity="0.8"
          />
        </>
      )}

      {/* Done badge */}
      {isDone && (
        <>
          <circle cx={x - 36} cy={fy - 170} r="13" fill="#14532d" />
          <circle cx={x - 36} cy={fy - 170} r="11" fill="#16a34a" />
          <text
            x={x - 36}
            y={fy - 165}
            textAnchor="middle"
            fontSize="12"
            fill="white"
          >
            ✓
          </text>
        </>
      )}
    </g>
  );
}
