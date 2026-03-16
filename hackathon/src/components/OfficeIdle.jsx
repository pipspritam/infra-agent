import React from "react";

/**
 * OfficeIdle — Rich illustrated office floor plan.
 *
 * Three sectors A/B/C  •  Break room right  •  Server rack left
 * Ambient: drone patrol, floor cleaner, blinking screens, sun rays.
 */
export default function OfficeIdle() {
  return (
    <div className="office-idle">
      <div className="office-idle-svg-wrap">
        <svg viewBox="0 0 860 510" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="oi-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F9F5EC" />
              <stop offset="100%" stopColor="#EDE6D2" />
            </linearGradient>
            <linearGradient id="oi-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="100%" stopColor="#F5EEE2" />
            </linearGradient>
            <linearGradient id="oi-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C4E4FF" />
              <stop offset="100%" stopColor="#E8F5FF" />
            </linearGradient>
            <linearGradient id="oi-desk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EAE0C8" />
              <stop offset="100%" stopColor="#DBCFB5" />
            </linearGradient>
            <linearGradient id="oi-screen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A2B3C" />
              <stop offset="100%" stopColor="#0D1824" />
            </linearGradient>
            <radialGradient id="oi-bloom" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,248,210,0.72)" />
              <stop offset="100%" stopColor="rgba(255,248,210,0)" />
            </radialGradient>
            <radialGradient id="oi-spot-b" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(255,248,200,0.32)" />
              <stop offset="100%" stopColor="rgba(255,248,200,0)" />
            </radialGradient>
            <style>{`
              .oi-ray1{animation:ray-shimmer 4s ease-in-out infinite}
              .oi-ray2{animation:ray-shimmer 4s ease-in-out infinite .7s}
              .oi-ray3{animation:ray-shimmer 4s ease-in-out infinite 1.3s}
              .oi-cg1{animation:ceiling-hum 3.2s ease-in-out infinite}
              .oi-cg2{animation:ceiling-hum 3.2s ease-in-out infinite .9s}
              .oi-cg3{animation:ceiling-hum 3.2s ease-in-out infinite 1.7s}
              .oi-la{animation:led-tick 3s ease-in-out infinite}
              .oi-lb{animation:led-tick 3s ease-in-out infinite .4s}
              .oi-lc{animation:led-slow 4.5s ease-in-out infinite .8s}
              .oi-ld{animation:led-tick 2.5s ease-in-out infinite 1.3s}
              .oi-le{animation:led-slow 3.8s ease-in-out infinite .2s}
              .oi-lf{animation:led-tick 3.2s ease-in-out infinite 1.8s}
              .oi-drone{animation:drone-float 3s ease-in-out infinite}
              .oi-pa{animation:spin-cw  .3s linear infinite;transform-origin:106px 76px}
              .oi-pb{animation:spin-ccw .28s linear infinite;transform-origin:142px 76px}
              .oi-pc{animation:spin-cw  .3s linear infinite;transform-origin:106px 96px}
              .oi-pd{animation:spin-ccw .28s linear infinite;transform-origin:142px 96px}
              .oi-clean{animation:cleaner-trundle 6s ease-in-out infinite}
              .oi-cur{animation:screen-blink 1.3s step-end infinite}
              .oi-cp1{animation:charge-bar 1.6s ease-in-out infinite}
              .oi-cp2{animation:charge-bar 1.6s ease-in-out infinite .35s}
              .oi-cp3{animation:charge-bar 1.6s ease-in-out infinite .7s}
              .oi-bgp{animation:b-glow-pulse 4s ease-in-out infinite}
              @keyframes b-glow-pulse{0%,100%{opacity:.15}50%{opacity:.35}}
            `}</style>
          </defs>

          {/* Wall & floor */}
          <rect x="0" y="0" width="860" height="220" fill="url(#oi-wall)" />
          <rect x="0" y="200" width="860" height="310" fill="url(#oi-floor)" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect
              key={i}
              x={i * 132}
              y="0"
              width="1"
              height="200"
              fill="#EDE5D6"
              opacity="0.55"
            />
          ))}
          <rect x="0" y="128" width="860" height="5" fill="#E8E0D0" />
          <rect x="0" y="195" width="860" height="8" fill="#DDD6C6" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <line
              key={`fh${i}`}
              x1="0"
              y1={210 + i * 34}
              x2="860"
              y2={210 + i * 34}
              stroke="#E4DDD0"
              strokeWidth="0.8"
            />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <line
              key={`fv${i}`}
              x1={i * 86}
              y1="210"
              x2={i * 86}
              y2="510"
              stroke="#E4DDD0"
              strokeWidth="0.8"
            />
          ))}

          {/* Windows */}
          {[
            {
              wx: 60,
              rays: [
                [78, 94],
                [108, 118],
                [132, 144],
              ],
            },
            {
              wx: 360,
              rays: [
                [374, 392],
                [412, 424],
              ],
            },
            {
              wx: 640,
              rays: [
                [655, 672],
                [695, 710],
              ],
            },
          ].map(({ wx, rays }, wi) => (
            <g key={wi}>
              <rect
                x={wx}
                y="16"
                width="120"
                height="110"
                rx="5"
                fill="url(#oi-sky)"
                stroke="#D0C4B0"
                strokeWidth="2"
              />
              <line
                x1={wx + 60}
                y1="16"
                x2={wx + 60}
                y2="126"
                stroke="#D0C4B0"
                strokeWidth="2"
              />
              <line
                x1={wx}
                y1="65"
                x2={wx + 120}
                y2="65"
                stroke="#D0C4B0"
                strokeWidth="2"
              />
              <rect
                x={wx - 6}
                y="124"
                width="132"
                height="7"
                rx="2"
                fill="#D0C4B0"
              />
              <rect
                x={wx + 6}
                y="20"
                width="50"
                height="40"
                rx="3"
                fill="rgba(255,255,255,0.16)"
              />
              {rays.map(([x1, x2], ri) => (
                <polygon
                  key={ri}
                  className={["oi-ray1", "oi-ray2", "oi-ray3"][ri]}
                  points={`${x1},131 ${x1 - 8},510 ${x2 + 8},510 ${x2},131`}
                  fill={`rgba(255,242,160,${0.18 - ri * 0.03})`}
                />
              ))}
            </g>
          ))}

          {/* Ceiling lights */}
          {[170, 430, 690].map((lx, i) => (
            <g key={lx}>
              <line
                x1={lx}
                y1="0"
                x2={lx}
                y2="22"
                stroke="#C4BCA8"
                strokeWidth="1.5"
              />
              <rect
                x={lx - 30}
                y="20"
                width="60"
                height="11"
                rx="5.5"
                fill="#EDE8DC"
                stroke="#D8D2C4"
                strokeWidth="1"
              />
              <rect
                x={lx - 26}
                y="26"
                width="52"
                height="5"
                rx="2.5"
                fill="rgba(255,251,200,0.92)"
              />
              <ellipse
                cx={lx}
                cy="46"
                rx="46"
                ry="18"
                className={["oi-cg1", "oi-cg2", "oi-cg3"][i]}
                fill="url(#oi-bloom)"
              />
            </g>
          ))}

          {/* TI sign */}
          <rect
            x="330"
            y="28"
            width="200"
            height="34"
            rx="7"
            fill="white"
            opacity="0.93"
            stroke="#EAE4D8"
            strokeWidth="1"
          />
          <text
            x="430"
            y="46"
            textAnchor="middle"
            fontFamily="'Playfair Display',serif"
            fontSize="11"
            fontWeight="700"
            fill="#C8102E"
            letterSpacing="1.6"
          >
            TEXAS INSTRUMENTS
          </text>
          <text
            x="430"
            y="57"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="5.5"
            fill="#B0A898"
            letterSpacing="0.28em"
          >
            AGENT OPERATIONS CENTER
          </text>

          {/* Cubicle dividers */}
          {[298, 498, 90, 714].map((x) => (
            <rect
              key={x}
              x={x}
              y="195"
              width="5"
              height="320"
              rx="2.5"
              fill="#D4CCC0"
            />
          ))}
          <rect x="90" y="326" width="618" height="5" rx="2.5" fill="#D4CCC0" />

          {/* Sector B ambient glow */}
          <rect
            x="303"
            y="198"
            width="190"
            height="316"
            rx="2"
            fill="url(#oi-spot-b)"
            className="oi-bgp"
          />

          {/* Sector labels */}
          {[194, 398, 606].map((x, i) => (
            <g key={i}>
              <rect
                x={x - 32}
                y="192"
                width="64"
                height="10"
                rx="3"
                fill="#EDE6D8"
                stroke="#D8D0C4"
                strokeWidth="0.8"
              />
              <text
                x={x}
                y="199.5"
                textAnchor="middle"
                fill="#9B8F82"
                fontSize="5.5"
                fontFamily="monospace"
                letterSpacing="0.2em"
              >
                {["SECTOR A", "SECTOR B", "SECTOR C"][i]}
              </text>
            </g>
          ))}

          {/* Desks */}
          {[
            { dx: 108, dy: 278, led: "oi-la", item: "coffee", active: false },
            { dx: 310, dy: 278, led: "oi-lb", item: "plant", active: true },
            { dx: 512, dy: 278, led: "oi-lc", item: "books", active: false },
            { dx: 108, dy: 382, led: "oi-ld", item: "coffee", active: false },
            { dx: 310, dy: 382, led: "oi-le", item: "plant", active: false },
          ].map(({ dx, dy, led, item, active }, i) => (
            <g key={i}>
              {/* chair */}
              <ellipse
                cx={dx + 74}
                cy={dy + 66}
                rx="22"
                ry="12"
                fill="#D8D2C2"
              />
              <rect
                x={dx + 58}
                y={dy + 56}
                width="32"
                height="18"
                rx="7"
                fill="#D0CAB8"
              />
              <rect
                x={dx + 62}
                y={dy + 36}
                width="24"
                height="24"
                rx="6"
                fill="#D8D2C2"
              />
              {/* desk */}
              <rect
                x={dx}
                y={dy}
                width="148"
                height="50"
                rx="5"
                fill="url(#oi-desk)"
                stroke="#C8C0AC"
                strokeWidth="1.2"
              />
              <rect
                x={dx}
                y={dy + 46}
                width="148"
                height="5"
                rx="2"
                fill="#C8C0AC"
                opacity="0.45"
              />
              {/* monitor */}
              <rect
                x={dx + 34}
                y={dy - 50}
                width="80"
                height="48"
                rx="5"
                fill={active ? "#1E2B3C" : "#222830"}
                stroke="#141E28"
                strokeWidth="1"
              />
              <rect
                x={dx + 38}
                y={dy - 46}
                width="72"
                height="40"
                rx="3"
                fill="url(#oi-screen)"
              />
              {active ? (
                <>
                  <rect
                    x={dx + 42}
                    y={dy - 41}
                    width="64"
                    height="3"
                    rx="1.5"
                    fill="#38BDF8"
                    opacity="0.9"
                  />
                  <rect
                    x={dx + 42}
                    y={dy - 35}
                    width="44"
                    height="2.5"
                    rx="1.25"
                    fill="#7AB08A"
                    opacity="0.7"
                  />
                  <rect
                    x={dx + 42}
                    y={dy - 29}
                    width="58"
                    height="2.5"
                    rx="1.25"
                    fill="#E8624A"
                    opacity="0.65"
                  />
                  <rect
                    x={dx + 42}
                    y={dy - 23}
                    width="36"
                    height="2.5"
                    rx="1.25"
                    fill="#38BDF8"
                    opacity="0.5"
                  />
                  <text
                    x={dx + 42}
                    y={dy - 10}
                    fill="#7AB08A"
                    fontSize="5.5"
                    fontFamily="monospace"
                    className="oi-cur"
                  >
                    $_
                  </text>
                </>
              ) : (
                <>
                  <rect
                    x={dx + 42}
                    y={dy - 41}
                    width="52"
                    height="2.5"
                    rx="1.25"
                    fill="#334155"
                    opacity="0.45"
                  />
                  <rect
                    x={dx + 42}
                    y={dy - 35}
                    width="38"
                    height="2.5"
                    rx="1.25"
                    fill="#334155"
                    opacity="0.32"
                  />
                  <rect
                    x={dx + 42}
                    y={dy - 29}
                    width="46"
                    height="2.5"
                    rx="1.25"
                    fill="#334155"
                    opacity="0.28"
                  />
                </>
              )}
              <circle
                cx={dx + 100}
                cy={dy - 50}
                r="2.5"
                fill={active ? "#4ade80" : "#334155"}
                className={active ? led : ""}
              />
              {/* monitor stand */}
              <rect
                x={dx + 69}
                y={dy - 2}
                width="10"
                height="6"
                rx="2"
                fill="#283040"
              />
              <rect
                x={dx + 62}
                y={dy + 3}
                width="24"
                height="3"
                rx="1.5"
                fill="#283040"
              />
              {/* keyboard */}
              <rect
                x={dx + 22}
                y={dy + 8}
                width="66"
                height="18"
                rx="3"
                fill="#F0EAD8"
                stroke="#D8D2C2"
                strokeWidth="1"
              />
              {[0, 1, 2].map((row) =>
                [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={dx + 25 + col * 7}
                    y={dy + 10 + row * 5}
                    width="5"
                    height="3.5"
                    rx="1"
                    fill="#E0DAC8"
                  />
                )),
              )}
              {/* mouse */}
              <ellipse
                cx={dx + 104}
                cy={dy + 19}
                rx="7"
                ry="9"
                fill="#F0EAD8"
                stroke="#D8D2C2"
                strokeWidth="1"
              />
              {/* desk item */}
              {item === "coffee" && (
                <g>
                  <rect
                    x={dx + 120}
                    y={dy + 4}
                    width="15"
                    height="18"
                    rx="3"
                    fill="#E8624A"
                    opacity="0.88"
                  />
                  <path
                    d={`M${dx + 135} ${dy + 9}Q${dx + 141} ${dy + 9}${dx + 141} ${dy + 15}Q${dx + 141} ${dy + 21}${dx + 135} ${dy + 21}`}
                    fill="none"
                    stroke="#E8624A"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  <path
                    d={`M${dx + 127} ${dy + 2}Q${dx + 130} ${dy - 2}${dx + 133} ${dy + 1}`}
                    fill="none"
                    stroke="#D8D2C2"
                    strokeWidth="1"
                    opacity="0.5"
                    strokeLinecap="round"
                  />
                </g>
              )}
              {item === "plant" && (
                <g>
                  <rect
                    x={dx + 122}
                    y={dy + 34}
                    width="14"
                    height="10"
                    rx="3"
                    fill="#8B6914"
                    opacity="0.42"
                  />
                  <ellipse
                    cx={dx + 129}
                    cy={dy + 30}
                    rx="9"
                    ry="8"
                    fill="#3D6B4F"
                    opacity="0.78"
                  />
                  <ellipse
                    cx={dx + 122}
                    cy={dy + 24}
                    rx="6"
                    ry="7"
                    fill="#4A7A5E"
                    opacity="0.66"
                  />
                  <ellipse
                    cx={dx + 136}
                    cy={dy + 26}
                    rx="6"
                    ry="5"
                    fill="#3D6B4F"
                    opacity="0.6"
                  />
                </g>
              )}
              {item === "books" && (
                <g>
                  {[
                    { ox: 112, c: "#E8624A", h: 24 },
                    { ox: 118, c: "#2A5F8F", h: 20 },
                    { ox: 124, c: "#3D6B4F", h: 22 },
                    { ox: 130, c: "#D4840A", h: 18 },
                  ].map((b, bi) => (
                    <rect
                      key={bi}
                      x={dx + b.ox}
                      y={dy + 44 - b.h}
                      width="5"
                      height={b.h}
                      rx="1"
                      fill={b.c}
                      opacity="0.82"
                    />
                  ))}
                  <rect
                    x={dx + 136}
                    y={dy + 22}
                    width="3"
                    height="22"
                    rx="1"
                    fill="#D8D2C2"
                  />
                </g>
              )}
            </g>
          ))}

          {/* Break room */}
          <rect
            x="726"
            y="278"
            width="120"
            height="50"
            rx="5"
            fill="url(#oi-desk)"
            stroke="#C8C0AC"
            strokeWidth="1.2"
          />
          <rect x="726" y="274" width="120" height="8" rx="3" fill="#D4CCBA" />
          <rect
            x="726"
            y="196"
            width="108"
            height="12"
            rx="3"
            fill="#EDE6D8"
            stroke="#D8D0C4"
            strokeWidth="0.8"
          />
          <text
            x="780"
            y="205"
            textAnchor="middle"
            fill="#9B8F82"
            fontSize="6"
            fontFamily="monospace"
            letterSpacing="0.2em"
          >
            BREAK ROOM
          </text>
          {/* water cooler */}
          <rect
            x="736"
            y="218"
            width="30"
            height="56"
            rx="5"
            fill="#D8E8F4"
            stroke="#B8D0E4"
            strokeWidth="1.2"
          />
          <rect
            x="740"
            y="222"
            width="22"
            height="30"
            rx="3"
            fill="rgba(200,230,248,0.55)"
          />
          <rect x="736" y="266" width="30" height="10" rx="3" fill="#C4B8A8" />
          <circle
            cx="751"
            cy="250"
            r="3"
            fill="#7AB4D8"
            opacity="0.6"
            className="oi-lf"
          />
          {/* coffee machine */}
          <rect
            x="778"
            y="226"
            width="40"
            height="50"
            rx="5"
            fill="#2C3340"
            stroke="#1E2530"
            strokeWidth="1"
          />
          <rect x="782" y="230" width="32" height="22" rx="3" fill="#1A2030" />
          <circle
            cx="798"
            cy="268"
            r="5"
            fill="#D4840A"
            opacity="0.7"
            className="oi-lc"
          />
          {/* bar stools */}
          {[745, 770, 795, 820].map((sx) => (
            <g key={sx}>
              <circle
                cx={sx}
                cy="344"
                r="10"
                fill="#D8D2C2"
                stroke="#C8C2B4"
                strokeWidth="1"
              />
              <line
                x1={sx}
                y1="344"
                x2={sx}
                y2="364"
                stroke="#C4BCAC"
                strokeWidth="2"
              />
            </g>
          ))}
          {/* floor plant */}
          <rect
            x="700"
            y="430"
            width="24"
            height="22"
            rx="5"
            fill="#8B6914"
            opacity="0.38"
          />
          <ellipse
            cx="712"
            cy="422"
            rx="20"
            ry="18"
            fill="#3D6B4F"
            opacity="0.8"
          />
          <ellipse
            cx="700"
            cy="411"
            rx="13"
            ry="14"
            fill="#4A7A5E"
            opacity="0.68"
          />
          <ellipse
            cx="724"
            cy="413"
            rx="12"
            ry="10"
            fill="#3D6B4F"
            opacity="0.6"
          />

          {/* Bookshelf */}
          <rect
            x="812"
            y="195"
            width="44"
            height="210"
            rx="4"
            fill="#DDD4BC"
            stroke="#C8C0AC"
            strokeWidth="1.2"
          />
          {[248, 290, 332, 374].map((sy) => (
            <rect
              key={sy}
              x="812"
              y={sy}
              width="44"
              height="3"
              fill="#C4BCAC"
            />
          ))}
          {[
            { x: 816, y: 210, w: 7, h: 35, c: "#E8624A" },
            { x: 825, y: 212, w: 6, h: 33, c: "#2A5F8F" },
            { x: 833, y: 210, w: 9, h: 35, c: "#3D6B4F" },
            { x: 844, y: 212, w: 5, h: 33, c: "#D4840A" },
            { x: 851, y: 213, w: 4, h: 32, c: "#6B4A8F" },
            { x: 816, y: 253, w: 8, h: 34, c: "#3D6B4F" },
            { x: 826, y: 254, w: 6, h: 33, c: "#6B4A8F" },
            { x: 834, y: 252, w: 9, h: 35, c: "#E8624A" },
            { x: 845, y: 254, w: 6, h: 33, c: "#D4840A" },
            { x: 853, y: 255, w: 4, h: 32, c: "#2A5F8F" },
          ].map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="1"
              fill={b.c}
              opacity="0.82"
            />
          ))}
          <circle
            cx="832"
            cy="202"
            r="6"
            fill="#F2E8D4"
            stroke="#DDD4BC"
            strokeWidth="1"
          />

          {/* Plants corridor */}
          {[268, 472].map((px) => (
            <g key={px}>
              <rect
                x={px}
                y="188"
                width="18"
                height="12"
                rx="3"
                fill="#7B5E2A"
                opacity="0.5"
              />
              <ellipse
                cx={px + 9}
                cy="183"
                rx="13"
                ry="11"
                fill="#3D6B4F"
                opacity="0.82"
              />
              <ellipse
                cx={px + 2}
                cy="176"
                rx="8"
                ry="9"
                fill="#4A7A5E"
                opacity="0.7"
              />
              <ellipse
                cx={px + 16}
                cy="178"
                rx="8"
                ry="7"
                fill="#3D6B4F"
                opacity="0.65"
              />
            </g>
          ))}

          {/* Server rack left */}
          <rect
            x="20"
            y="195"
            width="54"
            height="200"
            rx="5"
            fill="#1E2530"
            stroke="#141C26"
            strokeWidth="1"
            opacity="0.9"
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x="24"
              y={200 + i * 28}
              width="46"
              height="22"
              rx="3"
              fill="#232E3C"
              stroke="#2E3A4A"
              strokeWidth="0.8"
            />
          ))}
          {[
            ["oi-la", 206],
            ["oi-lb", 234],
            ["oi-lc", 262],
            ["oi-ld", 290],
            ["oi-le", 318],
            ["oi-lf", 346],
          ].map(([cl, sy], i) => (
            <g key={i}>
              <circle cx="28" cy={sy} r="2.5" fill="#4ade80" className={cl} />
              <circle cx="34" cy={sy} r="2.5" fill="#fbbf24" />
              <rect
                x="42"
                y={sy - 2}
                width="20"
                height="4"
                rx="1"
                fill="#334155"
                opacity="0.6"
              />
            </g>
          ))}

          {/* Drone */}
          <g className="oi-drone">
            <rect
              x="97"
              y="80"
              width="54"
              height="28"
              rx="8"
              fill="#2C3340"
              stroke="#3A4555"
              strokeWidth="1"
            />
            <rect x="100" y="83" width="48" height="22" rx="6" fill="#232E3C" />
            <circle
              cx="124"
              cy="94"
              r="6"
              fill="#1A2030"
              stroke="#3A4555"
              strokeWidth="1"
            />
            <circle cx="124" cy="94" r="3.5" fill="#0D1824" />
            <circle
              cx="122.5"
              cy="92.5"
              r="1.2"
              fill="rgba(255,255,255,0.35)"
            />
            <circle cx="110" cy="88" r="2" fill="#4ade80" opacity="0.9" />
            <circle cx="138" cy="88" r="2" fill="#E8624A" opacity="0.9" />
            <line
              x1="97"
              y1="84"
              x2="76"
              y2="74"
              stroke="#3A4555"
              strokeWidth="1.8"
            />
            <line
              x1="151"
              y1="84"
              x2="172"
              y2="74"
              stroke="#3A4555"
              strokeWidth="1.8"
            />
            <line
              x1="97"
              y1="100"
              x2="76"
              y2="110"
              stroke="#3A4555"
              strokeWidth="1.8"
            />
            <line
              x1="151"
              y1="100"
              x2="172"
              y2="110"
              stroke="#3A4555"
              strokeWidth="1.8"
            />
            <ellipse
              cx="106"
              cy="76"
              rx="16"
              ry="4"
              fill="#C4BCAC"
              opacity="0.25"
              className="oi-pa"
            />
            <ellipse
              cx="142"
              cy="76"
              rx="16"
              ry="4"
              fill="#C4BCAC"
              opacity="0.25"
              className="oi-pb"
            />
            <ellipse
              cx="106"
              cy="96"
              rx="16"
              ry="4"
              fill="#C4BCAC"
              opacity="0.25"
              className="oi-pc"
            />
            <ellipse
              cx="142"
              cy="96"
              rx="16"
              ry="4"
              fill="#C4BCAC"
              opacity="0.25"
              className="oi-pd"
            />
            <line
              x1="124"
              y1="108"
              x2="124"
              y2="130"
              stroke="#3A4555"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
          </g>

          {/* Floor cleaner */}
          <g className="oi-clean">
            <ellipse
              cx="424"
              cy="452"
              rx="30"
              ry="20"
              fill="#DDDACF"
              stroke="#C8C4BC"
              strokeWidth="1.2"
            />
            <ellipse cx="424" cy="449" rx="24" ry="16" fill="#C8C4BA" />
            <circle
              cx="424"
              cy="448"
              r="6"
              fill="#B8B4AA"
              stroke="#A8A49C"
              strokeWidth="1"
            />
            <circle
              cx="424"
              cy="448"
              r="3"
              fill="#D4840A"
              opacity="0.7"
              className="oi-lc"
            />
            {[-20, -10, 0, 10, 20].map((bx) => (
              <line
                key={bx}
                x1={424 + bx}
                y1="467"
                x2={424 + bx}
                y2="472"
                stroke="#B8B4AA"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Charging station bot */}
          <g transform="translate(666,410)">
            <rect
              x="-16"
              y="8"
              width="32"
              height="12"
              rx="4"
              fill="#1E2530"
              stroke="#2C3340"
              strokeWidth="1"
            />
            <rect
              x="-12"
              y="11"
              width="24"
              height="5"
              rx="1.5"
              fill="#334155"
            />
            <rect
              x="-12"
              y="11"
              width="16"
              height="5"
              rx="1.5"
              fill="#4ade80"
              className="oi-cp3"
            />
            <rect
              x="-10"
              y="-18"
              width="20"
              height="26"
              rx="6"
              fill="#E8E4DA"
              stroke="#D8D2C8"
              strokeWidth="1"
            />
            <rect x="-7" y="-14" width="14" height="10" rx="3" fill="#151A23" />
            <rect x="-4" y="-11" width="4" height="4" rx="1" fill="#2A5F8F" />
            <rect x="0" y="-11" width="4" height="4" rx="1" fill="#2A5F8F" />
            <circle cx="0" cy="4" r="2.5" fill="#4ade80" className="oi-cp1" />
          </g>
        </svg>
      </div>
      <div className="idle-tagline">
        <div className="idle-tagline-bar" />
        <span>Awaiting agent transmissions</span>
        <div className="idle-tagline-bar" />
      </div>
    </div>
  );
}
