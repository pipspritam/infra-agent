import { useId } from "react";
/**
 * RobotSVG — 8 switchable robot skin designs.
 * Props:
 * act        — "Idle" | "Reading" | "Thinking" | "Responding"
 * accentColor — hex (#2A5F8F or #3D6B4F)
 * size        — pixel width (height auto from viewBox aspect)
 * skin        — 0-7 (design style index)
 */

// ─── Skin 0: HELIX Classic (original style, compacted) ───────────────────────
function HelixRobot({ act, ac, size }) {
  const a = act === "Idle" || !act ? "Idle" : act;
  const isBlue = ac.startsWith("#2");
  const body = "#F4EED8";
  const bodyBd = "#C8C0A8";
  const panel = "#E8E0C8";
  const acLt = isBlue ? "#DBEAFE" : "#D1FAE5";
  const acMd = isBlue ? "#7AB4D8" : "#7AB08A";
  const hl = "#FFFDF7";
  const fp = "#0F1C2E";
  const off = "#2E3040";
  const leds =
    a === "Responding"
      ? [ac, "#3D6B4F", "#D4840A"]
      : a === "Reading"
        ? [ac, ac, off]
        : a === "Thinking"
          ? [ac, off, off]
          : [off, off, off];
  const _rid = useId();
  const uid = `h0-${_rid.replace(/:/g, "-")}-${ac.replace("#", "")}`;

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 140 155"
      overflow="visible"
      aria-label={`Robot ${a}`}
    >
      <defs>
        <radialGradient id={`${uid}-hg`} cx="30%" cy="20%" r="70%">
          <stop offset="0%" stopColor={hl} stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id={`${uid}-fw`}>
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Treads */}
      <rect
        x="22"
        y="130"
        width="96"
        height="16"
        rx="8"
        fill={panel}
        stroke={bodyBd}
        strokeWidth="1"
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={28 + i * 14}
          y1="132"
          x2={28 + i * 14}
          y2="144"
          stroke={bodyBd}
          strokeWidth="1"
          opacity="0.5"
        />
      ))}
      {[30, 70, 110].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="138" r="5" fill={body} />
          <circle cx={cx} cy="138" r="2" fill={bodyBd} />
        </g>
      ))}

      {/* Torso */}
      <rect
        x="28"
        y="72"
        width="84"
        height="60"
        rx="10"
        fill={body}
        stroke={bodyBd}
        strokeWidth="1.2"
      />
      <rect
        x="28"
        y="72"
        width="84"
        height="60"
        rx="10"
        fill={`url(#${uid}-hg)`}
      />
      <rect
        x="36"
        y="80"
        width="68"
        height="28"
        rx="6"
        fill={acLt}
        stroke={acMd}
        strokeWidth="0.9"
      />
      {leds.map((c, i) => (
        <circle
          key={i}
          cx={46 + i * 14}
          cy="94"
          r="4.5"
          fill={c}
          style={
            c !== off
              ? {
                  animation: `led-tick ${2.4 + i * 0.4}s ease-in-out infinite ${i * 0.35}s`,
                }
              : {}
          }
        />
      ))}
      <rect
        x="36"
        y="114"
        width="68"
        height="10"
        rx="3"
        fill={ac}
        opacity="0.1"
      />
      <text
        x="70"
        y="121.5"
        textAnchor="middle"
        fill={ac}
        fontSize="6.5"
        fontFamily="'DM Mono',monospace"
        fontWeight="600"
        letterSpacing="0.1em"
      >
        {a.toUpperCase()}
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="40"
          y={126 + i * 0}
          width="60"
          height="0"
          rx="1"
          fill={bodyBd}
          opacity="0.4"
        />
      ))}

      {/* Arms */}
      {a === "Responding" ? (
        <>
          <rect
            x="8"
            y="68"
            width="22"
            height="36"
            rx="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
            transform="rotate(-28 19 68)"
          />
          <circle
            cx="6"
            cy="97"
            r="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
          />
          <rect
            x="110"
            y="68"
            width="22"
            height="36"
            rx="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
            transform="rotate(28 121 68)"
          />
          <circle
            cx="134"
            cy="97"
            r="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
          />
        </>
      ) : a === "Thinking" ? (
        <>
          <rect
            x="10"
            y="74"
            width="20"
            height="34"
            rx="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
            transform="rotate(20 20 74)"
          />
          <circle
            cx="22"
            cy="105"
            r="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
          />
          <rect
            x="110"
            y="74"
            width="20"
            height="38"
            rx="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
          />
          <circle
            cx="120"
            cy="114"
            r="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
          />
        </>
      ) : (
        <>
          <rect
            x="10"
            y="74"
            width="20"
            height="38"
            rx="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
          />
          <circle
            cx="20"
            cy="114"
            r="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
          />
          <rect
            x="110"
            y="74"
            width="20"
            height="38"
            rx="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
          />
          <circle
            cx="120"
            cy="114"
            r="8"
            fill={panel}
            stroke={bodyBd}
            strokeWidth="1"
          />
        </>
      )}

      {/* Neck */}
      <rect
        x="58"
        y="61"
        width="24"
        height="13"
        rx="5"
        fill={panel}
        stroke={bodyBd}
        strokeWidth="1.2"
      />

      {/* Head shadow */}
      <rect
        x="24"
        y="14"
        width="92"
        height="50"
        rx="13"
        fill="rgba(0,0,0,0.08)"
        transform="translate(3,3)"
      />
      {/* Head */}
      <rect
        x="24"
        y="11"
        width="92"
        height="52"
        rx="13"
        fill={body}
        stroke={bodyBd}
        strokeWidth="1.5"
      />
      <rect
        x="24"
        y="11"
        width="92"
        height="52"
        rx="13"
        fill={`url(#${uid}-hg)`}
      />
      {/* OLED face */}
      <rect x="32" y="18" width="76" height="38" rx="8" fill={fp} />
      <rect
        x="32"
        y="18"
        width="76"
        height="38"
        rx="8"
        fill="none"
        stroke={ac}
        strokeWidth="0.8"
        opacity="0.3"
      />

      {/* Eyes */}
      {a === "Reading" ? (
        <>
          <rect
            x="40"
            y="27"
            width="18"
            height="12"
            rx="3"
            fill={ac}
            opacity="0.2"
          />
          <rect
            x="82"
            y="27"
            width="18"
            height="12"
            rx="3"
            fill={ac}
            opacity="0.2"
          />
          <rect x="43" y="29" width="12" height="7" rx="2" fill={ac} />
          <rect x="85" y="29" width="12" height="7" rx="2" fill={ac} />
          <rect
            x="44"
            y="30"
            width="4"
            height="2"
            rx="1"
            fill={hl}
            opacity="0.8"
          />
          <rect
            x="86"
            y="30"
            width="4"
            height="2"
            rx="1"
            fill={hl}
            opacity="0.8"
          />
          <line
            x1="61"
            y1="33"
            x2="82"
            y2="33"
            stroke={ac}
            strokeWidth="1.5"
            opacity="0.5"
          />
        </>
      ) : a === "Thinking" ? (
        <>
          <ellipse cx="49" cy="34" rx="8" ry="5" fill={ac} opacity="0.7" />
          <ellipse cx="91" cy="34" rx="8" ry="5" fill={ac} opacity="0.7" />
          <line
            x1="42"
            y1="27"
            x2="56"
            y2="29"
            stroke={ac}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <line
            x1="98"
            y1="27"
            x2="84"
            y2="29"
            stroke={ac}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </>
      ) : a === "Responding" ? (
        <>
          <circle cx="49" cy="33" r="9" fill={ac} />
          <circle cx="91" cy="33" r="9" fill={ac} />
          <circle cx="52" cy="30" r="3.5" fill={hl} opacity="0.85" />
          <circle cx="94" cy="30" r="3.5" fill={hl} opacity="0.85" />
        </>
      ) : (
        <>
          <rect
            x="41"
            y="31"
            width="16"
            height="4"
            rx="2"
            fill={ac}
            opacity="0.8"
          />
          <rect
            x="83"
            y="31"
            width="16"
            height="4"
            rx="2"
            fill={ac}
            opacity="0.8"
          />
        </>
      )}

      {/* Mouth */}
      {a === "Responding" ? (
        <path
          d="M42 44 Q70 54 98 44"
          fill="none"
          stroke={ac}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : a === "Thinking" ? (
        <line
          x1="52"
          y1="45"
          x2="88"
          y2="45"
          stroke="#334155"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M48 44 Q70 48 92 44"
          fill="none"
          stroke="#334155"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {/* Ear panels */}
      <rect
        x="14"
        y="20"
        width="12"
        height="22"
        rx="5"
        fill={panel}
        stroke={bodyBd}
        strokeWidth="1.2"
      />
      <rect
        x="114"
        y="20"
        width="12"
        height="22"
        rx="5"
        fill={panel}
        stroke={bodyBd}
        strokeWidth="1.2"
      />
      <rect
        x="16"
        y="24"
        width="8"
        height="13"
        rx="2"
        fill={acLt}
        stroke={acMd}
        strokeWidth="0.8"
      />
      <rect
        x="116"
        y="24"
        width="8"
        height="13"
        rx="2"
        fill={acLt}
        stroke={acMd}
        strokeWidth="0.8"
      />

      {/* Antenna */}
      <line
        x1="70"
        y1="11"
        x2="70"
        y2="-1"
        stroke={bodyBd}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="70"
        cy="-1"
        r="3"
        fill={panel}
        stroke={bodyBd}
        strokeWidth="1"
      />
      <circle
        cx="70"
        cy="-8"
        r="6.5"
        fill={ac}
        filter={`url(#${uid}-fw)`}
        style={{ animation: "antenna-glow 2s ease-in-out infinite" }}
      />
      <circle cx="70" cy="-8" r="3" fill={hl} opacity="0.8" />
    </svg>
  );
}

// ─── Skin 1: PIXEL — 8-bit blocky retro ──────────────────────────────────────
function PixelRobot({ act, ac, size }) {
  const a = act || "Idle";
  const isBlue = ac.startsWith("#2");
  const bg = "#1A1A2E";
  const border = ac;
  const face = "#16213E";
  const hl = isBlue ? "#60A5FA" : "#34D399";
  const _rid = useId();
  const uid = `h1-${_rid.replace(/:/g, "-")}-${ac.replace("#", "")}`;

  return (
    <svg
      width={size}
      height={size * 1.0}
      viewBox="0 0 120 120"
      overflow="visible"
    >
      <defs>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base platform */}
      <rect
        x="20"
        y="106"
        width="80"
        height="8"
        rx="2"
        fill={ac}
        opacity="0.4"
      />

      {/* Legs */}
      <rect
        x="38"
        y="90"
        width="14"
        height="18"
        rx="2"
        fill={bg}
        stroke={border}
        strokeWidth="1.5"
      />
      <rect
        x="68"
        y="90"
        width="14"
        height="18"
        rx="2"
        fill={bg}
        stroke={border}
        strokeWidth="1.5"
      />
      <rect x="36" y="104" width="18" height="5" rx="1" fill={ac} />
      <rect x="66" y="104" width="18" height="5" rx="1" fill={ac} />

      {/* Body */}
      <rect
        x="24"
        y="52"
        width="72"
        height="42"
        rx="4"
        fill={bg}
        stroke={border}
        strokeWidth="2"
      />
      {/* chest display */}
      <rect x="32" y="60" width="56" height="26" rx="2" fill={face} />
      {a === "Responding" ? (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={34}
              y={62 + i * 4}
              width={Math.sin(i * 0.9 + 1) * 40 + 4}
              height="2.5"
              rx="1"
              fill={hl}
              opacity={0.6 + i * 0.06}
            />
          ))}
        </>
      ) : a === "Reading" ? (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={34}
              y={62 + i * 4}
              width={20 + i * 5}
              height="2"
              rx="1"
              fill={ac}
              opacity="0.7"
            />
          ))}
        </>
      ) : a === "Thinking" ? (
        <>
          <text
            x="60"
            y="76"
            textAnchor="middle"
            fill={ac}
            fontSize="14"
            fontFamily="monospace"
          >
            ?
          </text>
          <text
            x="60"
            y="76"
            textAnchor="middle"
            fill={hl}
            fontSize="14"
            fontFamily="monospace"
            opacity="0.5"
            style={{ animation: "led-tick 1.4s step-end infinite" }}
          >
            ?
          </text>
        </>
      ) : (
        <>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={34 + i * 18}
              y="70"
              width="12"
              height="10"
              rx="2"
              fill={ac}
              opacity={0.3 + i * 0.2}
            />
          ))}
        </>
      )}
      {/* side vents */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="24"
          y={57 + i * 7}
          width="5"
          height="4"
          rx="1"
          fill={ac}
          opacity="0.5"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="91"
          y={57 + i * 7}
          width="5"
          height="4"
          rx="1"
          fill={ac}
          opacity="0.5"
        />
      ))}

      {/* Arms */}
      {a === "Responding" ? (
        <>
          <rect
            x="2"
            y="48"
            width="22"
            height="34"
            rx="3"
            fill={bg}
            stroke={border}
            strokeWidth="2"
            transform="rotate(-20 13 50)"
          />
          <rect
            x="96"
            y="48"
            width="22"
            height="34"
            rx="3"
            fill={bg}
            stroke={border}
            strokeWidth="2"
            transform="rotate(20 107 50)"
          />
          <rect x="2" y="72" width="22" height="8" rx="2" fill={ac} />
          <rect x="96" y="72" width="22" height="8" rx="2" fill={ac} />
        </>
      ) : (
        <>
          <rect
            x="2"
            y="54"
            width="22"
            height="38"
            rx="3"
            fill={bg}
            stroke={border}
            strokeWidth="2"
          />
          <rect
            x="96"
            y="54"
            width="22"
            height="38"
            rx="3"
            fill={bg}
            stroke={border}
            strokeWidth="2"
          />
          <rect x="2" y="88" width="22" height="8" rx="2" fill={ac} />
          <rect x="96" y="88" width="22" height="8" rx="2" fill={ac} />
        </>
      )}

      {/* Neck */}
      <rect
        x="46"
        y="40"
        width="28"
        height="14"
        rx="2"
        fill={bg}
        stroke={border}
        strokeWidth="1.5"
      />
      {[50, 60, 70].map((x) => (
        <rect
          key={x}
          x={x - 4}
          y="42"
          width="8"
          height="9"
          rx="1"
          fill={ac}
          opacity="0.5"
        />
      ))}

      {/* Head */}
      <rect
        x="16"
        y="4"
        width="88"
        height="38"
        rx="4"
        fill={bg}
        stroke={border}
        strokeWidth="2"
      />
      {/* face screen */}
      <rect x="22" y="9" width="76" height="28" rx="2" fill={face} />

      {/* Pixel eyes */}
      {a === "Thinking" ? (
        <>
          <rect
            x="30"
            y="14"
            width="22"
            height="8"
            rx="1"
            fill={ac}
            opacity="0.4"
          />
          <rect
            x="68"
            y="14"
            width="22"
            height="8"
            rx="1"
            fill={ac}
            opacity="0.4"
          />
          {[31, 35, 39, 43].map((x) => (
            <rect key={x} x={x} y="15" width="5" height="6" rx="1" fill={ac} />
          ))}
          {[69, 73, 77, 81].map((x) => (
            <rect key={x} x={x} y="15" width="5" height="6" rx="1" fill={ac} />
          ))}
        </>
      ) : a === "Responding" ? (
        <>
          {[
            [30, 12, 22, 12],
            [68, 12, 22, 12],
          ].map(([x, y, w, h], i) => (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="1"
                fill={hl}
                filter={`url(#${uid}-glow)`}
                opacity="0.8"
              />
              {[x, x + 5, x + 10, x + 15].map((px) => (
                <rect
                  key={px}
                  x={px}
                  y={y + 1}
                  width="4"
                  height="9"
                  rx="1"
                  fill={ac}
                />
              ))}
            </g>
          ))}
        </>
      ) : (
        <>
          {[30, 68].map((ex) => (
            <g key={ex}>
              <rect
                x={ex}
                y="14"
                width="22"
                height="10"
                rx="1"
                fill={ac}
                opacity="0.15"
              />
              <rect
                x={ex + 2}
                y="15"
                width="18"
                height="7"
                rx="1"
                fill={ac}
                opacity="0.6"
              />
              <rect
                x={ex + 4}
                y="16"
                width="5"
                height="3"
                rx="1"
                fill="#fff"
                opacity="0.4"
              />
            </g>
          ))}
        </>
      )}

      {/* Pixel mouth */}
      {a === "Responding"
        ? [26, 30, 34, 42, 50, 58, 66, 70, 74, 78, 82, 86, 90].map((x, i) => (
            <rect
              key={i}
              x={x}
              y={i < 2 || i > 10 ? 32 : 28}
              width="4"
              height="4"
              rx="1"
              fill={hl}
              opacity="0.7"
            />
          ))
        : [34, 42, 50, 58, 66, 74, 82].map((x, i) => (
            <rect
              key={i}
              x={x}
              y="31"
              width="4"
              height="4"
              rx="1"
              fill={ac}
              opacity={0.4 + i * 0.05}
            />
          ))}

      {/* Antenna */}
      <rect x="57" y="-4" width="6" height="10" rx="1" fill={border} />
      <rect
        x="52"
        y="-10"
        width="16"
        height="8"
        rx="2"
        fill={ac}
        style={{ animation: "antenna-glow 2s ease-in-out infinite" }}
        filter={`url(#${uid}-glow)`}
      />
    </svg>
  );
}

// ─── Skin 2: CHIBI — round cute SD proportions ───────────────────────────────
function ChibiRobot({ act, ac, size }) {
  const a = act || "Idle";
  const isBlue = ac.startsWith("#2");
  const body = "#FFFFFF";
  const bd = "#E2E8F0";
  const cheek = isBlue ? "#BFDBFE" : "#BBF7D0";
  const _rid = useId();
  const uid = `h2-${_rid.replace(/:/g, "-")}-${ac.replace("#", "")}`;

  return (
    <svg
      width={size}
      height={size * 1.0}
      viewBox="0 0 120 125"
      overflow="visible"
    >
      <defs>
        <filter id={`${uid}-s`}>
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3"
            floodColor={ac}
            floodOpacity="0.25"
          />
        </filter>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shadow */}
      <ellipse cx="60" cy="118" rx="32" ry="6" fill="rgba(0,0,0,0.12)" />

      {/* Legs */}
      <rect
        x="36"
        y="92"
        width="18"
        height="22"
        rx="9"
        fill={ac}
        opacity="0.8"
      />
      <rect
        x="66"
        y="92"
        width="18"
        height="22"
        rx="9"
        fill={ac}
        opacity="0.8"
      />
      <ellipse cx="45" cy="113" rx="11" ry="5" fill={ac} />
      <ellipse cx="75" cy="113" rx="11" ry="5" fill={ac} />

      {/* Body */}
      <rect
        x="22"
        y="52"
        width="76"
        height="46"
        rx="24"
        fill={body}
        stroke={bd}
        strokeWidth="2"
        filter={`url(#${uid}-s)`}
      />
      {/* belly gem */}
      <circle cx="60" cy="74" r="12" fill={ac} opacity="0.15" />
      <circle cx="60" cy="74" r="8" fill={ac} opacity="0.8" />
      <circle cx="57" cy="71" r="3" fill="#fff" opacity="0.5" />
      {/* side buttons */}
      <circle cx="32" cy="68" r="5" fill={ac} opacity="0.4" />
      <circle cx="88" cy="68" r="5" fill={ac} opacity="0.4" />
      <circle cx="32" cy="82" r="5" fill={ac} opacity="0.4" />
      <circle cx="88" cy="82" r="5" fill={ac} opacity="0.4" />

      {/* Arms */}
      {a === "Responding" ? (
        <>
          <ellipse
            cx="12"
            cy="66"
            rx="10"
            ry="18"
            fill={body}
            stroke={bd}
            strokeWidth="2"
            transform="rotate(25 12 66)"
          />
          <ellipse
            cx="108"
            cy="66"
            rx="10"
            ry="18"
            fill={body}
            stroke={bd}
            strokeWidth="2"
            transform="rotate(-25 108 66)"
          />
        </>
      ) : a === "Thinking" ? (
        <>
          <ellipse
            cx="10"
            cy="62"
            rx="10"
            ry="18"
            fill={body}
            stroke={bd}
            strokeWidth="2"
            transform="rotate(35 10 62)"
          />
          <ellipse
            cx="110"
            cy="70"
            rx="10"
            ry="16"
            fill={body}
            stroke={bd}
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <ellipse
            cx="10"
            cy="70"
            rx="10"
            ry="16"
            fill={body}
            stroke={bd}
            strokeWidth="2"
          />
          <ellipse
            cx="110"
            cy="70"
            rx="10"
            ry="16"
            fill={body}
            stroke={bd}
            strokeWidth="2"
          />
        </>
      )}

      {/* Head — oversized chibi */}
      <circle
        cx="60"
        cy="34"
        r="34"
        fill={body}
        stroke={bd}
        strokeWidth="2"
        filter={`url(#${uid}-s)`}
      />

      {/* Cheeks */}
      <ellipse cx="36" cy="44" rx="9" ry="6" fill={cheek} opacity="0.8" />
      <ellipse cx="84" cy="44" rx="9" ry="6" fill={cheek} opacity="0.8" />

      {/* Eyes */}
      {a === "Thinking" ? (
        <>
          <path
            d="M42 32 Q48 26 54 32"
            fill="none"
            stroke={ac}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M66 32 Q72 26 78 32"
            fill="none"
            stroke={ac}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      ) : a === "Responding" ? (
        <>
          <ellipse cx="48" cy="34" rx="10" ry="11" fill={ac} />
          <ellipse cx="72" cy="34" rx="10" ry="11" fill={ac} />
          <circle cx="51" cy="30" r="4" fill="#fff" opacity="0.7" />
          <circle cx="75" cy="30" r="4" fill="#fff" opacity="0.7" />
        </>
      ) : (
        <>
          <ellipse cx="48" cy="34" rx="10" ry="10" fill={ac} />
          <ellipse cx="72" cy="34" rx="10" ry="10" fill={ac} />
          <circle cx="51" cy="30" r="4" fill="#fff" opacity="0.7" />
          <circle cx="75" cy="30" r="4" fill="#fff" opacity="0.7" />
          <circle cx="48" cy="34" r="3" fill="rgba(0,0,0,0.6)" />
          <circle cx="72" cy="34" r="3" fill="rgba(0,0,0,0.6)" />
        </>
      )}

      {/* Mouth */}
      {a === "Responding" ? (
        <path
          d="M46 48 Q60 58 74 48"
          fill="none"
          stroke={ac}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : a === "Thinking" ? (
        <path
          d="M48 49 Q60 44 72 49"
          fill="none"
          stroke={bd}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M46 49 Q60 55 74 49"
          fill="none"
          stroke={ac}
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {/* Antenna */}
      <line x1="60" y1="2" x2="60" y2="-6" stroke={bd} strokeWidth="2.5" />
      <circle
        cx="60"
        cy="-12"
        r="7"
        fill={ac}
        filter={`url(#${uid}-glow)`}
        style={{ animation: "antenna-glow 2s ease-in-out infinite" }}
      />
      <circle cx="60" cy="-12" r="3.5" fill="#fff" opacity="0.7" />

      {/* Ears */}
      <circle cx="26" cy="24" r="8" fill={body} stroke={bd} strokeWidth="2" />
      <circle cx="94" cy="24" r="8" fill={body} stroke={bd} strokeWidth="2" />
      <circle cx="26" cy="24" r="4" fill={ac} opacity="0.4" />
      <circle cx="94" cy="24" r="4" fill={ac} opacity="0.4" />
    </svg>
  );
}

// ─── Skin 3: INDUSTRIAL — tough hexagonal mech ───────────────────────────────
function IndustrialRobot({ act, ac, size }) {
  const a = act || "Idle";
  const isBlue = ac.startsWith("#2");
  const metal = "#2C3E50";
  const metalMd = "#34495E";
  const metalLt = "#4A6278";
  const glow = isBlue ? "#38BDF8" : "#4ADE80";
  const _rid = useId();
  const uid = `h3-${_rid.replace(/:/g, "-")}-${ac.replace("#", "")}`;

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 130 144"
      overflow="visible"
    >
      <defs>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`${uid}-mg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={metalLt} />
          <stop offset="100%" stopColor={metal} />
        </linearGradient>
      </defs>

      {/* Tank treads */}
      <rect
        x="12"
        y="120"
        width="106"
        height="18"
        rx="9"
        fill={metal}
        stroke={metalLt}
        strokeWidth="2"
      />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x={14 + i * 14}
          y="120"
          width="9"
          height="18"
          rx="2"
          fill={metalMd}
          stroke={metalLt}
          strokeWidth="1"
        />
      ))}
      {[22, 65, 108].map((cx) => (
        <g key={cx}>
          <circle
            cx={cx}
            cy="129"
            r="7"
            fill={metalMd}
            stroke={glow}
            strokeWidth="1.5"
          />
          <circle cx={cx} cy="129" r="3" fill={metal} />
        </g>
      ))}

      {/* Body — hexagonal ish */}
      <polygon
        points="28,62 102,62 116,80 116,118 14,118 14,80"
        fill={`url(#${uid}-mg)`}
        stroke={metalLt}
        strokeWidth="2"
      />
      {/* rivet bolts */}
      {[
        [18, 66],
        [18, 110],
        [112, 66],
        [112, 110],
        [65, 64],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill={metalLt}
          stroke={metal}
          strokeWidth="1"
        />
      ))}
      {/* chest panel */}
      <rect
        x="30"
        y="74"
        width="70"
        height="34"
        rx="3"
        fill={metal}
        stroke={glow}
        strokeWidth="1.2"
      />
      {a === "Responding" ? (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x="34"
              y={77 + i * 6}
              width={Math.sin(i + 0.5) * 40 + 18}
              height="4"
              rx="2"
              fill={glow}
              opacity="0.8"
            />
          ))}
        </>
      ) : a === "Reading" ? (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x="34"
              y={77 + i * 6}
              width={20 + i * 8}
              height="3"
              rx="1.5"
              fill={ac}
              opacity="0.7"
            />
          ))}
        </>
      ) : a === "Thinking" ? (
        <>
          <text
            x="65"
            y="97"
            textAnchor="middle"
            fill={glow}
            fontSize="16"
            fontFamily="monospace"
            style={{ animation: "led-tick 1.5s ease-in-out infinite" }}
          >
            ...
          </text>
        </>
      ) : (
        <>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x="34"
              y={77 + i * 9}
              width="62"
              height="5"
              rx="2.5"
              fill={metalLt}
              opacity="0.5"
            />
          ))}
        </>
      )}
      {/* power LED row */}
      {[ac, glow, "#E8624A"].map((c, i) => (
        <circle
          key={i}
          cx={42 + i * 22}
          cy="116"
          r="4"
          fill={c}
          style={{
            animation: `led-tick ${2 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
          }}
        />
      ))}

      {/* Arms */}
      {a === "Responding" ? (
        <>
          <polygon
            points="4,62 20,62 20,100 4,100"
            fill={metalMd}
            stroke={metalLt}
            strokeWidth="1.5"
            transform="rotate(-15 12 80)"
          />
          <circle
            cx="6"
            cy="95"
            r="10"
            fill={metalMd}
            stroke={glow}
            strokeWidth="1.5"
          />
          <polygon
            points="110,62 126,62 126,100 110,100"
            fill={metalMd}
            stroke={metalLt}
            strokeWidth="1.5"
            transform="rotate(15 118 80)"
          />
          <circle
            cx="124"
            cy="95"
            r="10"
            fill={metalMd}
            stroke={glow}
            strokeWidth="1.5"
          />
        </>
      ) : (
        <>
          <rect
            x="2"
            y="66"
            width="14"
            height="44"
            rx="3"
            fill={metalMd}
            stroke={metalLt}
            strokeWidth="1.5"
          />
          <circle
            cx="9"
            cy="112"
            r="8"
            fill={metalMd}
            stroke={metalLt}
            strokeWidth="1.5"
          />
          <rect
            x="114"
            y="66"
            width="14"
            height="44"
            rx="3"
            fill={metalMd}
            stroke={metalLt}
            strokeWidth="1.5"
          />
          <circle
            cx="121"
            cy="112"
            r="8"
            fill={metalMd}
            stroke={metalLt}
            strokeWidth="1.5"
          />
        </>
      )}

      {/* Head — flat-top hex */}
      <polygon
        points="28,12 102,12 116,30 102,56 28,56 14,30"
        fill={`url(#${uid}-mg)`}
        stroke={metalLt}
        strokeWidth="2"
      />
      {/* face visor */}
      <rect x="22" y="18" width="86" height="32" rx="4" fill="#050D15" />
      <rect
        x="22"
        y="18"
        width="86"
        height="32"
        rx="4"
        fill="none"
        stroke={glow}
        strokeWidth="1.2"
        opacity="0.6"
      />

      {/* Eyes */}
      {a === "Thinking" ? (
        <>
          <rect
            x="28"
            y="22"
            width="30"
            height="12"
            rx="2"
            fill={glow}
            opacity="0.15"
          />
          <rect
            x="72"
            y="22"
            width="30"
            height="12"
            rx="2"
            fill={glow}
            opacity="0.15"
          />
          {[29, 34, 39, 44, 49].map((x) => (
            <rect
              key={x}
              x={x}
              y="23"
              width="4"
              height="9"
              rx="1"
              fill={glow}
              opacity="0.5+.1"
              style={{
                animation: `led-tick ${1 + x * 0.05}s ease-in-out infinite`,
              }}
            />
          ))}
          {[73, 78, 83, 88, 93].map((x) => (
            <rect
              key={x}
              x={x}
              y="23"
              width="4"
              height="9"
              rx="1"
              fill={glow}
              opacity="0.5"
            />
          ))}
        </>
      ) : a === "Responding" ? (
        <>
          <rect
            x="28"
            y="21"
            width="32"
            height="14"
            rx="2"
            fill={glow}
            opacity="0.9"
            filter={`url(#${uid}-glow)`}
          />
          <rect
            x="70"
            y="21"
            width="32"
            height="14"
            rx="2"
            fill={glow}
            opacity="0.9"
            filter={`url(#${uid}-glow)`}
          />
        </>
      ) : (
        <>
          <rect
            x="28"
            y="22"
            width="32"
            height="12"
            rx="2"
            fill={glow}
            opacity="0.5"
          />
          <rect
            x="70"
            y="22"
            width="32"
            height="12"
            rx="2"
            fill={glow}
            opacity="0.5"
          />
          <rect
            x="30"
            y="24"
            width="10"
            height="6"
            rx="1"
            fill="#fff"
            opacity="0.2"
          />
          <rect
            x="72"
            y="24"
            width="10"
            height="6"
            rx="1"
            fill="#fff"
            opacity="0.2"
          />
        </>
      )}

      {/* Mouth grill */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x={26 + i * 10}
          y="40"
          width="7"
          height="7"
          rx="1"
          fill={glow}
          opacity={a === "Responding" ? 0.8 : 0.25}
        />
      ))}

      {/* Top antenna array */}
      {[-16, 0, 16].map((ox, i) => (
        <g key={i}>
          <line
            x1={65 + ox}
            y1="12"
            x2={65 + ox}
            y2={-2 - i * 4}
            stroke={metalLt}
            strokeWidth="2"
          />
          <circle
            cx={65 + ox}
            cy={-4 - i * 4}
            r={3 - i * 0.5}
            fill={i === 1 ? glow : ac}
            filter={i === 1 ? `url(#${uid}-glow)` : undefined}
            style={
              i === 1
                ? { animation: "antenna-glow 2s ease-in-out infinite" }
                : {}
            }
          />
        </g>
      ))}
    </svg>
  );
}

// ─── Skin 4: GHOST — translucent floating spirit ─────────────────────────────
function GhostRobot({ act, ac, size }) {
  const a = act || "Idle";
  const isBlue = ac.startsWith("#2");
  const ghostFill = isBlue ? "rgba(59,130,246,0.12)" : "rgba(52,211,153,0.12)";
  const ghostBd = isBlue ? "rgba(59,130,246,0.5)" : "rgba(52,211,153,0.5)";
  const glow = isBlue ? "#3B82F6" : "#34D399";
  const _rid = useId();
  const uid = `h4-${_rid.replace(/:/g, "-")}-${ac.replace("#", "")}`;

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 120 132"
      overflow="visible"
    >
      <defs>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${uid}-soft`}>
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.25" />
          <stop offset="100%" stopColor={glow} stopOpacity="0.04" />
        </radialGradient>
      </defs>

      {/* Floating shadow */}
      <ellipse
        cx="60"
        cy="126"
        rx="26"
        ry="5"
        fill={glow}
        opacity="0.12"
        style={{ animation: "drone-float 3s ease-in-out infinite" }}
      />

      {/* Ghost body — wavy bottom */}
      <g style={{ animation: "drone-float 3s ease-in-out infinite" }}>
        {/* aura glow */}
        <ellipse cx="60" cy="72" rx="48" ry="56" fill={`url(#${uid}-bg)`} />

        {/* Body shape */}
        <path
          d="M18,50 Q18,20 60,20 Q102,20 102,50 L102,98 Q90,88 80,98 Q70,108 60,98 Q50,88 40,98 Q30,108 18,98 Z"
          fill={ghostFill}
          stroke={ghostBd}
          strokeWidth="1.5"
          filter={`url(#${uid}-soft)`}
        />

        {/* inner glow lines */}
        {[0, 1, 2].map((i) => (
          <ellipse
            key={i}
            cx="60"
            cy={55 + i * 14}
            rx={28 - i * 4}
            ry="4"
            fill="none"
            stroke={glow}
            strokeWidth="0.8"
            opacity={0.3 - i * 0.08}
          />
        ))}

        {/* Arms — wispy */}
        {a === "Responding" ? (
          <>
            <path
              d="M18,55 Q4,48 2,60 Q0,72 12,70"
              fill="none"
              stroke={ghostBd}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx="10"
              cy="66"
              r="6"
              fill={ghostFill}
              stroke={ghostBd}
              strokeWidth="1.5"
            />
            <path
              d="M102,55 Q116,48 118,60 Q120,72 108,70"
              fill="none"
              stroke={ghostBd}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx="110"
              cy="66"
              r="6"
              fill={ghostFill}
              stroke={ghostBd}
              strokeWidth="1.5"
            />
          </>
        ) : (
          <>
            <path
              d="M18,58 Q6,60 6,76 Q6,88 18,86"
              fill="none"
              stroke={ghostBd}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M102,58 Q114,60 114,76 Q114,88 102,86"
              fill="none"
              stroke={ghostBd}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.7"
            />
          </>
        )}

        {/* Face */}
        {/* Eyes */}
        {a === "Thinking" ? (
          <>
            <ellipse cx="44" cy="52" rx="7" ry="4" fill={glow} opacity="0.5" />
            <ellipse cx="76" cy="52" rx="7" ry="4" fill={glow} opacity="0.5" />
            <path
              d="M38 47 Q44 43 50 47"
              fill="none"
              stroke={glow}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M70 47 Q76 43 82 47"
              fill="none"
              stroke={glow}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        ) : a === "Responding" ? (
          <>
            <ellipse
              cx="44"
              cy="51"
              rx="9"
              ry="10"
              fill={glow}
              opacity="0.9"
              filter={`url(#${uid}-glow)`}
            />
            <ellipse
              cx="76"
              cy="51"
              rx="9"
              ry="10"
              fill={glow}
              opacity="0.9"
              filter={`url(#${uid}-glow)`}
            />
            <ellipse cx="44" cy="51" rx="4" ry="5" fill="#fff" opacity="0.6" />
            <ellipse cx="76" cy="51" rx="4" ry="5" fill="#fff" opacity="0.6" />
          </>
        ) : (
          <>
            <ellipse
              cx="44"
              cy="51"
              rx="9"
              ry="9"
              fill={glow}
              opacity="0.7"
              filter={`url(#${uid}-soft)`}
            />
            <ellipse
              cx="76"
              cy="51"
              rx="9"
              ry="9"
              fill={glow}
              opacity="0.7"
              filter={`url(#${uid}-soft)`}
            />
            <ellipse cx="44" cy="51" rx="4" ry="4" fill="#fff" opacity="0.5" />
            <ellipse cx="76" cy="51" rx="4" ry="4" fill="#fff" opacity="0.5" />
          </>
        )}

        {/* Mouth */}
        {a === "Responding" ? (
          <path
            d="M40 68 Q60 80 80 68"
            fill="none"
            stroke={glow}
            strokeWidth="2.5"
            strokeLinecap="round"
            filter={`url(#${uid}-soft)`}
          />
        ) : (
          <path
            d="M42 68 Q60 72 78 68"
            fill="none"
            stroke={glow}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        )}

        {/* Core orb */}
        <circle
          cx="60"
          cy="82"
          r="8"
          fill={glow}
          opacity="0.6"
          filter={`url(#${uid}-glow)`}
          style={{ animation: "antenna-glow 2.5s ease-in-out infinite" }}
        />
        <circle cx="60" cy="82" r="4" fill="#fff" opacity="0.5" />
      </g>

      {/* Floating particles */}
      {[
        [-20, -20],
        [-28, 10],
        [20, -25],
        [28, 5],
      ].map(([ox, oy], i) => (
        <circle
          key={i}
          cx={60 + ox}
          cy={60 + oy}
          r={2 + i * 0.5}
          fill={glow}
          opacity="0.4"
          style={{
            animation: `drone-float ${2 + i * 0.7}s ease-in-out infinite ${i * 0.5}s`,
          }}
        />
      ))}
    </svg>
  );
}

// ─── Skin 5: SLEEK — minimalist floating pill (Sci-fi modern) ────────────────
function SleekRobot({ act, ac, size }) {
  const a = act || "Idle";
  const body = "#F8FAFC";
  const shell = "#E2E8F0";
  const visor = "#0F172A";
  const _rid = useId();
  const uid = `h5-${_rid.replace(/:/g, "-")}-${ac.replace("#", "")}`;

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 120 130"
      overflow="visible"
    >
      <defs>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Drop Shadow */}
      <ellipse
        cx="60"
        cy="120"
        rx="20"
        ry="4"
        fill="rgba(0,0,0,0.1)"
        style={{ animation: "drone-float 3s ease-in-out infinite reverse" }}
      />

      <g style={{ animation: "drone-float 3s ease-in-out infinite" }}>
        {/* Floating Pod Body */}
        <rect
          x="25"
          y="10"
          width="70"
          height="100"
          rx="35"
          fill={body}
          stroke={shell}
          strokeWidth="2"
        />

        {/* Side panels */}
        <path
          d="M25 45 Q35 60 25 75"
          fill="none"
          stroke={shell}
          strokeWidth="2"
        />
        <path
          d="M95 45 Q85 60 95 75"
          fill="none"
          stroke={shell}
          strokeWidth="2"
        />

        {/* Visor */}
        <rect x="32" y="25" width="56" height="28" rx="14" fill={visor} />
        <rect
          x="32"
          y="25"
          width="56"
          height="28"
          rx="14"
          fill="none"
          stroke={ac}
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Dynamic LED Face */}
        {a === "Thinking" ? (
          <>
            <circle
              cx="50"
              cy="39"
              r="3"
              fill={ac}
              opacity="0.5"
              style={{ animation: "led-tick 1s ease-in-out infinite" }}
            />
            <circle
              cx="60"
              cy="39"
              r="3"
              fill={ac}
              opacity="0.8"
              style={{ animation: "led-tick 1s ease-in-out infinite 0.2s" }}
            />
            <circle
              cx="70"
              cy="39"
              r="3"
              fill={ac}
              opacity="0.5"
              style={{ animation: "led-tick 1s ease-in-out infinite 0.4s" }}
            />
          </>
        ) : a === "Responding" ? (
          <>
            <ellipse
              cx="60"
              cy="39"
              rx="18"
              ry="4"
              fill={ac}
              filter={`url(#${uid}-glow)`}
            />
            <ellipse cx="60" cy="39" rx="8" ry="2" fill="#fff" opacity="0.8" />
          </>
        ) : a === "Reading" ? (
          <>
            <rect
              x="42"
              y="37"
              width="12"
              height="4"
              rx="2"
              fill={ac}
              opacity="0.8"
            />
            <rect
              x="66"
              y="37"
              width="12"
              height="4"
              rx="2"
              fill={ac}
              opacity="0.8"
            />
          </>
        ) : (
          <>
            <circle cx="46" cy="39" r="4" fill={ac} opacity="0.7" />
            <circle cx="74" cy="39" r="4" fill={ac} opacity="0.7" />
            <path
              d="M54 44 Q60 48 66 44"
              fill="none"
              stroke={ac}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
          </>
        )}

        {/* Chest indicator */}
        <circle cx="60" cy="75" r="8" fill={visor} />
        <circle cx="60" cy="75" r="4" fill={ac} filter={`url(#${uid}-glow)`} />

        {/* Floating Arms (Detached) */}
        {a === "Responding" ? (
          <>
            <rect
              x="5"
              y="50"
              width="12"
              height="30"
              rx="6"
              fill={body}
              stroke={shell}
              strokeWidth="2"
              transform="rotate(-15 11 65)"
            />
            <rect
              x="103"
              y="50"
              width="12"
              height="30"
              rx="6"
              fill={body}
              stroke={shell}
              strokeWidth="2"
              transform="rotate(15 109 65)"
            />
          </>
        ) : (
          <>
            <rect
              x="10"
              y="55"
              width="10"
              height="36"
              rx="5"
              fill={body}
              stroke={shell}
              strokeWidth="2"
            />
            <rect
              x="100"
              y="55"
              width="10"
              height="36"
              rx="5"
              fill={body}
              stroke={shell}
              strokeWidth="2"
            />
          </>
        )}
      </g>
    </svg>
  );
}

// ─── Skin 6: RETRO — 1950s B-movie dome-head ─────────────────────────────────
function RetroRobot({ act, ac, size }) {
  const a = act || "Idle";
  const metal = "#94A3B8";
  const darkMetal = "#475569";
  const dome = "rgba(226, 232, 240, 0.4)";
  const _rid = useId();
  const uid = `h6-${_rid.replace(/:/g, "-")}-${ac.replace("#", "")}`;

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 130 145"
      overflow="visible"
    >
      <defs>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hover Skirt (Base) */}
      <path d="M25 115 L105 115 L120 130 L10 130 Z" fill={darkMetal} />
      <ellipse cx="65" cy="130" rx="55" ry="8" fill={metal} />
      <ellipse cx="65" cy="115" rx="40" ry="6" fill={metal} />
      {/* Skirt Vents */}
      {[25, 45, 65, 85, 105].map((cx) => (
        <rect
          key={cx}
          x={cx - 3}
          y="120"
          width="6"
          height="8"
          rx="2"
          fill="#1E293B"
        />
      ))}

      {/* Segmented Torso */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={30 - i * 2}
          y={85 - i * 12}
          width={70 + i * 4}
          height="12"
          rx="4"
          fill={metal}
          stroke={darkMetal}
          strokeWidth="1.5"
        />
      ))}

      {/* Chest Dial / Meters */}
      <circle
        cx="65"
        cy="72"
        r="10"
        fill="#F1F5F9"
        stroke={darkMetal}
        strokeWidth="2"
      />
      <line
        x1="65"
        y1="72"
        x2={a === "Responding" ? "72" : a === "Thinking" ? "58" : "65"}
        y2="65"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transition: "all 0.3s" }}
      />
      <rect
        x="42"
        y="68"
        width="8"
        height="8"
        rx="1"
        fill={ac}
        opacity={a === "Reading" ? 1 : 0.3}
      />
      <rect
        x="80"
        y="68"
        width="8"
        height="8"
        rx="1"
        fill={ac}
        opacity={a === "Reading" ? 1 : 0.3}
      />

      {/* Segmented Arms */}
      {a === "Responding" ? (
        <>
          <path
            d="M26 60 Q10 50 15 35"
            fill="none"
            stroke={darkMetal}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M104 60 Q120 50 115 35"
            fill="none"
            stroke={darkMetal}
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Claws */}
          <path
            d="M15 35 Q5 25 10 15 M15 35 Q25 25 20 15"
            fill="none"
            stroke={metal}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M115 35 Q105 25 110 15 M115 35 Q125 25 120 15"
            fill="none"
            stroke={metal}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M26 60 Q10 70 15 90"
            fill="none"
            stroke={darkMetal}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M104 60 Q120 70 115 90"
            fill="none"
            stroke={darkMetal}
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Claws */}
          <path
            d="M15 90 Q5 100 10 110 M15 90 Q25 100 20 110"
            fill="none"
            stroke={metal}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M115 90 Q105 100 110 110 M115 90 Q125 100 120 110"
            fill="none"
            stroke={metal}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Glass Dome Head */}
      <path
        d="M35 50 C 35 15, 95 15, 95 50 Z"
        fill={dome}
        stroke="#CBD5E1"
        strokeWidth="2"
      />
      <ellipse
        cx="65"
        cy="50"
        rx="30"
        ry="6"
        fill={metal}
        stroke={darkMetal}
        strokeWidth="2"
      />

      {/* Brain/Antenna Inside Dome */}
      <line
        x1="65"
        y1="50"
        x2="65"
        y2="25"
        stroke={darkMetal}
        strokeWidth="3"
      />
      <circle
        cx="65"
        cy="25"
        r="6"
        fill={ac}
        filter={`url(#${uid}-glow)`}
        style={{ animation: "antenna-glow 1.5s ease-in-out infinite" }}
      />

      {/* Inside Dome Eyes */}
      {a === "Thinking" ? (
        <>
          <line
            x1="52"
            y1="38"
            x2="58"
            y2="38"
            stroke={ac}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="72"
            y1="38"
            x2="78"
            y2="38"
            stroke={ac}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <circle cx="55" cy="38" r="4" fill={ac} />
          <circle cx="75" cy="38" r="4" fill={ac} />
        </>
      )}
    </svg>
  );
}

// ─── Skin 7: STEAMPUNK — brass, gears, and boiler ────────────────────────────
function SteampunkRobot({ act, ac, size }) {
  const a = act || "Idle";
  const brass = "#C5A059";
  const copper = "#B87333";
  const iron = "#3E3B38";
  const boilerGlow = ac;
  const _rid = useId();
  const uid = `h7-${_rid.replace(/:/g, "-")}-${ac.replace("#", "")}`;

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 130 145"
      overflow="visible"
    >
      <defs>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Spider/Crab Legs Base */}
      <path
        d="M45 110 L20 135 L10 135 M45 110 L30 140 M85 110 L110 135 L120 135 M85 110 L100 140"
        fill="none"
        stroke={copper}
        strokeWidth="6"
        strokeLinecap="square"
      />
      <path
        d="M45 110 L20 135 M85 110 L110 135"
        fill="none"
        stroke={iron}
        strokeWidth="2"
      />

      {/* Base Chassis */}
      <rect x="35" y="100" width="60" height="15" rx="3" fill={iron} />
      <circle cx="50" cy="107" r="4" fill={brass} />
      <circle cx="80" cy="107" r="4" fill={brass} />

      {/* Boiler Body */}
      <rect
        x="35"
        y="45"
        width="60"
        height="55"
        rx="8"
        fill={brass}
        stroke={copper}
        strokeWidth="3"
      />
      <rect
        x="40"
        y="50"
        width="50"
        height="10"
        rx="2"
        fill={copper}
        opacity="0.5"
      />
      <rect
        x="40"
        y="85"
        width="50"
        height="10"
        rx="2"
        fill={copper}
        opacity="0.5"
      />

      {/* Furnace Belly */}
      <rect x="45" y="65" width="40" height="15" rx="3" fill="#1A1A1A" />
      {[48, 56, 64, 72].map((x, i) => (
        <rect
          key={x}
          x={x}
          y="67"
          width="4"
          height="11"
          rx="1"
          fill={boilerGlow}
          opacity={a === "Responding" ? 0.9 : 0.4}
          filter={a === "Responding" ? `url(#${uid}-glow)` : ""}
        />
      ))}

      {/* Steam Pipe */}
      <path
        d="M95 55 L110 55 L110 20 L100 20"
        fill="none"
        stroke={copper}
        strokeWidth="4"
      />
      {a === "Thinking" && (
        <>
          <circle
            cx="100"
            cy="10"
            r="4"
            fill="#D1D5DB"
            opacity="0.6"
            style={{ animation: "drone-float 1s infinite" }}
          />
          <circle
            cx="95"
            cy="0"
            r="6"
            fill="#D1D5DB"
            opacity="0.4"
            style={{ animation: "drone-float 1.5s infinite" }}
          />
        </>
      )}

      {/* Mechanical Arms */}
      {a === "Responding" ? (
        <>
          <path
            d="M35 60 L15 50 L20 30"
            fill="none"
            stroke={iron}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <circle cx="35" cy="60" r="6" fill={copper} />
          <circle cx="15" cy="50" r="4" fill={brass} />
        </>
      ) : (
        <>
          <path
            d="M35 60 L15 75 L20 95"
            fill="none"
            stroke={iron}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <circle cx="35" cy="60" r="6" fill={copper} />
          <circle cx="15" cy="75" r="4" fill={brass} />
        </>
      )}
      {/* Right arm tucked */}
      <path
        d="M95 60 L115 75 L110 95"
        fill="none"
        stroke={iron}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <circle cx="95" cy="60" r="6" fill={copper} />
      <circle cx="115" cy="75" r="4" fill={brass} />

      {/* Head Box */}
      <rect
        x="45"
        y="15"
        width="40"
        height="30"
        rx="4"
        fill={iron}
        stroke={brass}
        strokeWidth="2"
      />

      {/* Monocle Eye (Right) & Small Eye (Left) */}
      <circle cx="55" cy="30" r="4" fill={boilerGlow} opacity="0.6" />
      <circle
        cx="75"
        cy="30"
        r="8"
        fill={brass}
        stroke={copper}
        strokeWidth="2"
      />
      <circle
        cx="75"
        cy="30"
        r="4"
        fill={boilerGlow}
        filter={`url(#${uid}-glow)`}
      />

      {/* Top Hat/Valve */}
      <path d="M55 15 L55 5 L75 5 L75 15 Z" fill={copper} />
      <rect x="50" y="13" width="30" height="2" fill={brass} />
    </svg>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function RobotSVG({
  act = "Idle",
  accentColor = "#2A5F8F",
  size = 108,
  skin = 0,
}) {
  const props = { act, ac: accentColor, size };
  switch (skin) {
    case 1:
      return <PixelRobot {...props} />;
    case 2:
      return <ChibiRobot {...props} />;
    case 3:
      return <IndustrialRobot {...props} />;
    case 4:
      return <GhostRobot {...props} />;
    case 5:
      return <SleekRobot {...props} />;
    default:
      return <IndustrialRobot {...props} />;
  }
}
