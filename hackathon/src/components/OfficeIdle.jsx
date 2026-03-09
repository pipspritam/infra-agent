import React from 'react';

/**
 * OfficeIdle — Warm, illustrated multi-cubicle office floor plan.
 * 
 * Layout (birds-eye, slightly angled):
 *   ┌─────────────────────────────────────────────────┐
 *   │  [WINDOW ROW]   [CEILING LIGHTS]   [PLANTS]     │
 *   │  Cubicle A  │  Cubicle B  │  Cubicle C         │
 *   │  ─────────────────────────────────────          │
 *   │  Cubicle D  │  Cubicle E  │  BREAK AREA        │
 *   │             │             │  (water cooler,     │
 *   │  [SERVER RACK LEFT]       │   charging bot,     │
 *   │             │             │   coffee corner)    │
 *   │  [DRONE PATROL overhead]                        │
 *   └─────────────────────────────────────────────────┘
 * 
 * Each cubicle has: desk, monitor, chair, small personal items.
 * Background bots: drone overhead, floor-cleaner, charging station bot.
 */
const OfficeIdle = () => {
  return (
    <div className="office-idle">
      <div className="office-idle-svg-wrap">
        <svg
          viewBox="0 0 860 510"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="floor-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F9F5EC"/>
              <stop offset="100%" stopColor="#F0EAD8"/>
            </linearGradient>
            <linearGradient id="wall-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFDF7"/>
              <stop offset="100%" stopColor="#F8F3E8"/>
            </linearGradient>
            <linearGradient id="desk-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8DFC8"/>
              <stop offset="100%" stopColor="#DCCEB5"/>
            </linearGradient>
            <linearGradient id="monitor-screen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1C2B3A"/>
              <stop offset="100%" stopColor="#0F1A24"/>
            </linearGradient>
            <linearGradient id="window-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4EEFF"/>
              <stop offset="100%" stopColor="#EAF5FF"/>
            </linearGradient>
            <linearGradient id="server-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2C3340"/>
              <stop offset="100%" stopColor="#1E2530"/>
            </linearGradient>
            <radialGradient id="ceiling-light-bloom" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,248,220,0.7)"/>
              <stop offset="100%" stopColor="rgba(255,248,220,0)"/>
            </radialGradient>

            {/* Animations */}
            <style>{`
              .ray1 { animation: ray-shimmer 3.5s ease-in-out infinite; }
              .ray2 { animation: ray-shimmer 3.5s ease-in-out infinite 0.6s; }
              .ray3 { animation: ray-shimmer 3.5s ease-in-out infinite 1.1s; }

              .led-a { animation: led-tick 3s ease-in-out infinite; }
              .led-b { animation: led-tick 3s ease-in-out infinite 0.4s; }
              .led-c { animation: led-slow 4s ease-in-out infinite 0.8s; }
              .led-d { animation: led-tick 2.5s ease-in-out infinite 1.2s; }
              .led-e { animation: led-slow 3.5s ease-in-out infinite 0.3s; }
              .led-f { animation: led-tick 3s ease-in-out infinite 1.8s; }

              .ceiling-glow { animation: ceiling-hum 3s ease-in-out infinite; }
              .ceiling-glow2 { animation: ceiling-hum 3s ease-in-out infinite 0.8s; }
              .ceiling-glow3 { animation: ceiling-hum 3s ease-in-out infinite 1.5s; }

              .drone-group { animation: drone-float 2.8s ease-in-out infinite; }
              .prop-a { animation: spin-cw 0.28s linear infinite; transform-origin: 104px 78px; }
              .prop-b { animation: spin-ccw 0.32s linear infinite; transform-origin: 140px 78px; }
              .prop-c { animation: spin-ccw 0.28s linear infinite; transform-origin: 104px 96px; }
              .prop-d { animation: spin-cw 0.32s linear infinite; transform-origin: 140px 96px; }

              .cleaner { animation: cleaner-trundle 5s ease-in-out infinite; transform-origin: 430px 450px; }

              .charge-pip { animation: charge-bar 1.5s ease-in-out infinite; }
              .charge-pip2 { animation: charge-bar 1.5s ease-in-out infinite 0.3s; }
              .charge-pip3 { animation: charge-bar 1.5s ease-in-out infinite 0.6s; }
              .charge-pip4 { animation: charge-bar 1.5s ease-in-out infinite 0.9s; }

              .screen-cursor { animation: screen-blink 1.2s step-end infinite; }
            `}</style>
          </defs>

          {/* ══════════════════════════════════════
              BACKGROUND — Floor & Wall
              ══════════════════════════════════════ */}

          {/* Back wall */}
          <rect x="0" y="0" width="860" height="220" fill="url(#wall-fill)"/>
          {/* Floor */}
          <rect x="0" y="200" width="860" height="310" fill="url(#floor-fill)"/>
          {/* Floor tile grid */}
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <line key={`fh${i}`} x1="0" y1={210+i*34} x2="860" y2={210+i*34}
              stroke="#E8E2D2" strokeWidth="0.8"/>
          ))}
          {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
            <line key={`fv${i}`} x1={i*86} y1="210" x2={i*86} y2="510"
              stroke="#E8E2D2" strokeWidth="0.8"/>
          ))}

          {/* Baseboard */}
          <rect x="0" y="195" width="860" height="8" fill="#E0D9C9"/>
          {/* Wall dado rail */}
          <rect x="0" y="130" width="860" height="5" fill="#E5DDD0"/>
          <rect x="0" y="132" width="860" height="1" fill="#D8D0C4" opacity="0.6"/>

          {/* Wall texture stripes */}
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={`ws${i}`} x={i*130} y="0" width="1" height="200"
              fill="#EDE6D8" opacity="0.5"/>
          ))}

          {/* ══════════════════════════════════════
              WINDOWS — back wall
              ══════════════════════════════════════ */}

          {/* Window 1 */}
          <rect x="60" y="16" width="120" height="110" rx="4" fill="url(#window-sky)" stroke="#D4C8B4" strokeWidth="2"/>
          <line x1="120" y1="16" x2="120" y2="126" stroke="#D4C8B4" strokeWidth="2"/>
          <line x1="60" y1="65" x2="180" y2="65" stroke="#D4C8B4" strokeWidth="2"/>
          {/* sill */}
          <rect x="54" y="124" width="132" height="7" rx="2" fill="#D4C8B4"/>
          {/* light rays */}
          <polygon className="ray1" points="75,131 88,510 112,510 99,131" fill="rgba(255,242,170,0.18)"/>
          <polygon className="ray2" points="105,131 113,510 128,510 120,131" fill="rgba(255,242,170,0.14)"/>
          <polygon className="ray3" points="130,131 136,510 148,510 142,131" fill="rgba(255,242,170,0.12)"/>
          {/* window details */}
          <rect x="64" y="20" width="52" height="42" rx="2" fill="rgba(255,255,255,0.15)"/>
          <rect x="124" y="20" width="52" height="42" rx="2" fill="rgba(255,255,255,0.1)"/>

          {/* Window 2 */}
          <rect x="360" y="16" width="120" height="110" rx="4" fill="url(#window-sky)" stroke="#D4C8B4" strokeWidth="2"/>
          <line x1="420" y1="16" x2="420" y2="126" stroke="#D4C8B4" strokeWidth="2"/>
          <line x1="360" y1="65" x2="480" y2="65" stroke="#D4C8B4" strokeWidth="2"/>
          <rect x="354" y="124" width="132" height="7" rx="2" fill="#D4C8B4"/>
          <polygon className="ray1" points="372,131 383,510 405,510 394,131" fill="rgba(255,242,170,0.16)"/>
          <polygon className="ray2" points="408,131 415,510 430,510 423,131" fill="rgba(255,242,170,0.12)"/>

          {/* Window 3 */}
          <rect x="640" y="16" width="120" height="110" rx="4" fill="url(#window-sky)" stroke="#D4C8B4" strokeWidth="2"/>
          <line x1="700" y1="16" x2="700" y2="126" stroke="#D4C8B4" strokeWidth="2"/>
          <line x1="640" y1="65" x2="760" y2="65" stroke="#D4C8B4" strokeWidth="2"/>
          <rect x="634" y="124" width="132" height="7" rx="2" fill="#D4C8B4"/>

          {/* ══════════════════════════════════════
              CEILING LIGHTS (pendant fixtures)
              ══════════════════════════════════════ */}

          {[170, 430, 690].map((x, i) => (
            <g key={`light${i}`}>
              <line x1={x} y1="0" x2={x} y2="22" stroke="#C8C0B0" strokeWidth="1.5"/>
              <rect x={x-28} y="20" width="56" height="10" rx="5" fill="#EDE8DC" stroke="#D8D2C4" strokeWidth="1"/>
              <rect x={x-24} y="26" width="48" height="4" rx="2" fill="rgba(255,250,200,0.9)"/>
              <ellipse cx={x} cy="42" rx="42" ry="16"
                className={i === 0 ? 'ceiling-glow' : i === 1 ? 'ceiling-glow2' : 'ceiling-glow3'}
                fill="url(#ceiling-light-bloom)"/>
            </g>
          ))}

          {/* ══════════════════════════════════════
              SERVER RACKS (left wall)
              ══════════════════════════════════════ */}

          {/* Rack cabinet 1 */}
          <rect x="20" y="195" width="56" height="160" rx="4" fill="url(#server-body)" stroke="#1A2030" strokeWidth="1.5"/>
          {[0,1,2,3,4,5].map(i => (
            <g key={`ru${i}`}>
              <rect x="24" y={202+i*25} width="48" height="20" rx="2" fill="#28303E"/>
              <rect x="26" y={204+i*25} width="8" height="16" rx="2" fill="#323C4A"/>
            </g>
          ))}
          <circle className="led-a" cx="64" cy="213" r="2.5" fill="#3D6B4F"/>
          <circle className="led-b" cx="64" cy="238" r="2.5" fill="#3D6B4F"/>
          <circle className="led-c" cx="64" cy="263" r="2.5" fill="#D4840A"/>
          <circle className="led-d" cx="64" cy="288" r="2.5" fill="#3D6B4F"/>
          <circle className="led-e" cx="64" cy="313" r="2.5" fill="#2A5F8F"/>
          <circle className="led-f" cx="64" cy="338" r="2.5" fill="#3D6B4F"/>

          {/* Rack cabinet 2 (shorter) */}
          <rect x="20" y="365" width="56" height="100" rx="4" fill="url(#server-body)" stroke="#1A2030" strokeWidth="1.5"/>
          {[0,1,2,3].map(i => (
            <g key={`ru2${i}`}>
              <rect x="24" y={372+i*23} width="48" height="18" rx="2" fill="#28303E"/>
              <rect x="26" y={374+i*23} width="7" height="14" rx="1" fill="#323C4A"/>
            </g>
          ))}
          <circle cx="64" cy="382" r="2.5" fill="#3D6B4F"
            style={{ animation: 'led-tick 2.8s ease-in-out infinite 0.5s' }}/>
          <circle cx="64" cy="405" r="2.5" fill="#D4840A"
            style={{ animation: 'led-slow 4s ease-in-out infinite 1s' }}/>

          {/* Cable management panel */}
          <rect x="20" y="470" width="56" height="22" rx="3" fill="#1E2530" stroke="#1A2030" strokeWidth="1"/>
          {[0,1,2].map(i => (
            <circle key={i} cx={30+i*14} cy="481" r="4" fill="#28303E"/>
          ))}

          {/* ══════════════════════════════════════
              CUBICLE DIVIDERS & LAYOUT
              ══════════════════════════════════════ */}

          {/* Main horizontal corridor divider */}
          <rect x="90" y="320" width="600" height="8" rx="2" fill="#D8D0C0" stroke="#C8C0B0" strokeWidth="0.8"/>

          {/* Vertical dividers — row 1 */}
          {/* A | B */}
          <rect x="298" y="195" width="6" height="125" rx="2" fill="#D8D0C0" stroke="#C8C0B0" strokeWidth="0.8"/>
          {/* B | C */}
          <rect x="498" y="195" width="6" height="125" rx="2" fill="#D8D0C0" stroke="#C8C0B0" strokeWidth="0.8"/>

          {/* Vertical dividers — row 2 */}
          {/* D | E */}
          <rect x="298" y="326" width="6" height="125" rx="2" fill="#D8D0C0" stroke="#C8C0B0" strokeWidth="0.8"/>
          {/* E | break */}
          <rect x="498" y="326" width="6" height="125" rx="2" fill="#D8D0C0" stroke="#C8C0B0" strokeWidth="0.8"/>

          {/* ══════════════════════════════════════
              CUBICLE A (top-left)
              ══════════════════════════════════════ */}
          <CubicleDesk x={108} y={210} w={178} h={110} label="A"
            monitorColor="#1E3A52" itemType="coffee"/>

          {/* ══════════════════════════════════════
              CUBICLE B (top-center)
              ══════════════════════════════════════ */}
          <CubicleDesk x={310} y={210} w={178} h={110} label="B"
            monitorColor="#1E3A52" itemType="plant"/>

          {/* ══════════════════════════════════════
              CUBICLE C (top-right)
              ══════════════════════════════════════ */}
          <CubicleDesk x={510} y={210} w={178} h={110} label="C"
            monitorColor="#1E3A52" itemType="books"/>

          {/* ══════════════════════════════════════
              CUBICLE D (bottom-left)
              ══════════════════════════════════════ */}
          <CubicleDesk x={108} y={334} w={178} h={110} label="D"
            monitorColor="#1E3A52" itemType="plant"/>

          {/* ══════════════════════════════════════
              CUBICLE E (bottom-center)
              ══════════════════════════════════════ */}
          <CubicleDesk x={310} y={334} w={178} h={110} label="E"
            monitorColor="#1E3A52" itemType="coffee"/>

          {/* ══════════════════════════════════════
              BREAK AREA (bottom-right)
              ══════════════════════════════════════ */}

          {/* Break area floor accent */}
          <rect x="510" y="334" width="300" height="140" rx="4"
            fill="rgba(255,255,255,0.25)" stroke="#E8E0D0" strokeWidth="1"/>

          {/* Rug */}
          <ellipse cx="660" cy="404" rx="90" ry="54" fill="#F2E8D4" stroke="#E0D4C0" strokeWidth="1.5"/>
          <ellipse cx="660" cy="404" rx="74" ry="42" fill="none" stroke="#E8DCC8" strokeWidth="1"/>

          {/* Small round table */}
          <ellipse cx="660" cy="396" rx="38" ry="26" fill="#DDD4BC" stroke="#C8C0AC" strokeWidth="1.5"/>
          <ellipse cx="660" cy="396" rx="34" ry="22" fill="#E4DBCA"/>

          {/* Coffee mugs on table */}
          <rect x="647" y="384" width="14" height="17" rx="3" fill="#E8624A" opacity="0.85"/>
          <path d="M661 390 Q668 390 668 396 Q668 401 661 401" fill="none" stroke="#E8624A" strokeWidth="1.5" opacity="0.85"/>
          <rect x="665" y="386" width="13" height="16" rx="3" fill="#2A5F8F" opacity="0.75"/>

          {/* Water cooler */}
          <rect x="730" y="340" width="30" height="56" rx="5" fill="#E8E2D8" stroke="#D4CEC4" strokeWidth="1.5"/>
          <ellipse cx="745" cy="352" rx="12" ry="8" fill="#C8DCF0" opacity="0.8"/>
          <rect x="733" y="370" width="24" height="24" rx="3" fill="#F0EDE8"/>
          {/* spigots */}
          <rect x="737" y="376" width="7" height="5" rx="2" fill="#E8624A" opacity="0.7"/>
          <rect x="746" y="376" width="7" height="5" rx="2" fill="#2A5F8F" opacity="0.7"/>
          {/* water jug top */}
          <ellipse cx="745" cy="342" rx="10" ry="5" fill="#D8EEF8" stroke="#C0D8EC" strokeWidth="1"/>

          {/* Tall plant in break area */}
          <rect x="786" y="418" width="22" height="16" rx="4" fill="#8B6914" opacity="0.45"/>
          <ellipse cx="797" cy="412" rx="14" ry="12" fill="#3D6B4F" opacity="0.8"/>
          <ellipse cx="788" cy="404" rx="10" ry="10" fill="#4A7A5E" opacity="0.7"/>
          <ellipse cx="804" cy="407" rx="11" ry="9" fill="#3D6B4F" opacity="0.65"/>

          {/* ── Charging station (break area) ── */}
          <rect x="518" y="340" width="60" height="80" rx="5" fill="#E8E2D8" stroke="#D4CEBC" strokeWidth="1.5"/>
          {/* screen */}
          <rect x="524" y="348" width="48" height="30" rx="3" fill="#0F1A24"/>
          <text x="530" y="359" fill="#7AB08A" fontSize="6" fontFamily="monospace">CHARGE</text>
          <text x="530" y="369" fill="#D4840A" fontSize="6" fontFamily="monospace">72%</text>
          {/* bar */}
          <rect x="528" y="372" width="40" height="4" rx="2" fill="#2A3540"/>
          <rect x="528" y="372" width="29" height="4" rx="2" fill="#3D6B4F"/>
          {/* pips */}
          <circle className="charge-pip"  cx="526" cy="394" r="4" fill="#3D6B4F"/>
          <circle className="charge-pip2" cx="537" cy="394" r="4" fill="#3D6B4F"/>
          <circle className="charge-pip3" cx="548" cy="394" r="4" fill="#3D6B4F"/>
          <circle className="charge-pip4" cx="559" cy="394" r="3" fill="#2A3540"/>
          {/* mini bot in charger */}
          <rect x="525" y="403" width="30" height="14" rx="3" fill="#D8D4CC"/>
          <circle cx="531" cy="410" r="3" fill="#2A5F8F" opacity="0.6" style={{ animation: 'led-tick 2s ease-in-out infinite' }}/>
          <circle cx="543" cy="410" r="3" fill="#3D6B4F" opacity="0.6" style={{ animation: 'led-slow 3s ease-in-out infinite 0.4s' }}/>

          {/* ══════════════════════════════════════
              BACKGROUND BOT: Floor Cleaner
              (Roomba-style disc, center aisle)
              ══════════════════════════════════════ */}
          <g className="cleaner">
            <circle cx="430" cy="453" r="22" fill="#E8E4DC" stroke="#D4D0C8" strokeWidth="1.5"/>
            <circle cx="430" cy="453" r="16" fill="#DEDAC8" stroke="#CCC8B8" strokeWidth="1"/>
            <circle cx="430" cy="453" r="6" fill="#C8C4B8"/>
            {/* bumper arc */}
            <path d="M415 445 A22 22 0 0 1 445 445" fill="none" stroke="#C8C4B8" strokeWidth="2.5" strokeLinecap="round"/>
            {/* sensor dot */}
            <circle cx="430" cy="434" r="3" fill="#2A5F8F" opacity="0.6"/>
            {/* brush indicator lines */}
            <line x1="412" y1="453" x2="420" y2="453" stroke="#C0BCAC" strokeWidth="1.5"/>
            <line x1="440" y1="453" x2="448" y2="453" stroke="#C0BCAC" strokeWidth="1.5"/>
          </g>

          {/* ══════════════════════════════════════
              BACKGROUND BOT: Hovering Drone
              ══════════════════════════════════════ */}
          <g className="drone-group">
            {/* shadow on floor */}
            <ellipse cx="122" cy="300" rx="32" ry="10" fill="rgba(28,26,22,0.06)"/>

            {/* drone body */}
            <ellipse cx="122" cy="258" rx="20" ry="11" fill="#2E3440" stroke="#1E2530" strokeWidth="1.2"/>
            <circle cx="122" cy="258" r="7" fill="#1E2530"/>
            {/* camera/sensor */}
            <circle cx="122" cy="262" r="4" fill="#3A4555"/>
            <circle cx="122" cy="262" r="2" fill="#0F1A24"/>
            <circle cx="123" cy="261" r="0.8" fill="rgba(255,255,255,0.4)"/>

            {/* 4 arms */}
            <line x1="102" y1="258" x2="86" y2="248" stroke="#3A4555" strokeWidth="2"/>
            <line x1="142" y1="258" x2="158" y2="248" stroke="#3A4555" strokeWidth="2"/>
            <line x1="102" y1="258" x2="86" y2="268" stroke="#3A4555" strokeWidth="2"/>
            <line x1="142" y1="258" x2="158" y2="268" stroke="#3A4555" strokeWidth="2"/>

            {/* Motor hubs */}
            <circle cx="86" cy="248" r="5" fill="#2E3440" stroke="#1E2530" strokeWidth="1"/>
            <circle cx="158" cy="248" r="5" fill="#2E3440" stroke="#1E2530" strokeWidth="1"/>
            <circle cx="86" cy="268" r="5" fill="#2E3440" stroke="#1E2530" strokeWidth="1"/>
            <circle cx="158" cy="268" r="5" fill="#2E3440" stroke="#1E2530" strokeWidth="1"/>

            {/* Propellers */}
            <ellipse className="prop-a" cx="86" cy="248" rx="14" ry="3.5"
              fill="#4A5568" opacity="0.55" style={{ transformOrigin: '86px 248px' }}/>
            <ellipse className="prop-b" cx="158" cy="248" rx="14" ry="3.5"
              fill="#4A5568" opacity="0.55" style={{ transformOrigin: '158px 248px' }}/>
            <ellipse className="prop-c" cx="86" cy="268" rx="14" ry="3.5"
              fill="#4A5568" opacity="0.5" style={{ transformOrigin: '86px 268px' }}/>
            <ellipse className="prop-d" cx="158" cy="268" rx="14" ry="3.5"
              fill="#4A5568" opacity="0.5" style={{ transformOrigin: '158px 268px' }}/>

            {/* Drone LEDs */}
            <circle cx="110" cy="265" r="2.5" fill="#E8624A" opacity="0.8"
              style={{ animation: 'led-tick 1.5s ease-in-out infinite' }}/>
            <circle cx="134" cy="265" r="2.5" fill="#3D6B4F" opacity="0.8"
              style={{ animation: 'led-tick 1.5s ease-in-out infinite 0.75s' }}/>

            {/* Landing legs */}
            <line x1="112" y1="269" x2="109" y2="278" stroke="#3A4555" strokeWidth="1.5"/>
            <line x1="132" y1="269" x2="135" y2="278" stroke="#3A4555" strokeWidth="1.5"/>
            <line x1="105" y1="278" x2="139" y2="278" stroke="#3A4555" strokeWidth="2" strokeLinecap="round"/>
          </g>

          {/* ══════════════════════════════════════
              BOOKSHELF (right wall)
              ══════════════════════════════════════ */}
          <rect x="810" y="195" width="44" height="250" rx="4" fill="#DDD4BC" stroke="#C8C0AC" strokeWidth="1.5"/>
          {/* shelves */}
          {[0,1,2,3,4].map(i => (
            <rect key={i} x="810" y={242+i*46} width="44" height="4" rx="1" fill="#C8C0AC"/>
          ))}
          {/* books */}
          {[
            // shelf 1
            {x:814,y:206,w:7,h:34,c:'#E8624A'}, {x:823,y:208,w:6,h:32,c:'#2A5F8F'},
            {x:831,y:205,w:8,h:35,c:'#3D6B4F'}, {x:841,y:207,w:6,h:33,c:'#D4840A'},
            {x:849,y:209,w:5,h:31,c:'#6B4A8F'},
            // shelf 2
            {x:814,y:252,w:6,h:32,c:'#2A5F8F'}, {x:822,y:250,w:8,h:34,c:'#E8624A'},
            {x:832,y:253,w:6,h:31,c:'#D4840A'}, {x:840,y:251,w:8,h:33,c:'#3D6B4F'},
            {x:850,y:254,w:4,h:30,c:'#2A5F8F'},
            // shelf 3
            {x:814,y:298,w:7,h:30,c:'#3D6B4F'}, {x:823,y:296,w:6,h:32,c:'#6B4A8F'},
            {x:831,y:299,w:9,h:29,c:'#E8624A'}, {x:842,y:297,w:6,h:31,c:'#D4840A'},
            {x:850,y:300,w:4,h:28,c:'#2A5F8F'},
          ].map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="1" fill={b.c} opacity="0.8"/>
          ))}
          {/* small decor item top shelf */}
          <circle cx="832" cy="203" r="6" fill="#F2E8D4" stroke="#DDD4BC" strokeWidth="1"/>
          <circle cx="832" cy="203" r="3" fill="#D4840A" opacity="0.5"/>

          {/* ══════════════════════════════════════
              CORRIDOR PLANTS (wall accents)
              ══════════════════════════════════════ */}
          {/* Plant 1 */}
          <rect x="270" y="188" width="18" height="12" rx="3" fill="#7B5E2A" opacity="0.5"/>
          <ellipse cx="279" cy="183" rx="13" ry="11" fill="#3D6B4F" opacity="0.8"/>
          <ellipse cx="272" cy="176" rx="8" ry="9" fill="#4A7A5E" opacity="0.7"/>
          <ellipse cx="287" cy="178" rx="9" ry="7" fill="#3D6B4F" opacity="0.65"/>

          {/* Plant 2 */}
          <rect x="468" y="188" width="18" height="12" rx="3" fill="#7B5E2A" opacity="0.5"/>
          <ellipse cx="477" cy="183" rx="13" ry="11" fill="#3D6B4F" opacity="0.8"/>
          <ellipse cx="470" cy="176" rx="8" ry="9" fill="#4A7A5E" opacity="0.7"/>

          {/* Corridor label signs (subtle) */}
          {[170, 400, 600].map((x, i) => (
            <g key={`sign${i}`}>
              <rect x={x-25} y="191" width="50" height="9" rx="2" fill="#EDE6D8" stroke="#D8D0C4" strokeWidth="0.8"/>
              <text x={x} y="198.5" textAnchor="middle" fill="#9B978F" fontSize="5.5" fontFamily="monospace"
                letterSpacing="0.15em">
                {['SECTOR A', 'SECTOR B', 'SECTOR C'][i]}
              </text>
            </g>
          ))}

        </svg>
      </div>

      {/* Tagline */}
      <div className="idle-tagline">
        <div className="idle-tagline-bar"/>
        <span>Waiting for agents</span>
        <div className="idle-tagline-bar"/>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   CubicleDesk — reusable desk + chair + monitor
   ════════════════════════════════════════ */

const CubicleDesk = ({ x, y, w, h, label, monitorColor = '#1E3A52', itemType = 'coffee' }) => {
  // Desk occupies center-bottom of cubicle cell
  const deskX = x + (w - 120) / 2;
  const deskY = y + h - 44;

  return (
    <g>
      {/* Cubicle label (top-left corner, subtle) */}
      <text x={x + 6} y={y + 12} fill="#C8C0B0" fontSize="8" fontFamily="monospace"
        letterSpacing="0.12em" opacity="0.8">{label}</text>

      {/* Chair */}
      <ellipse cx={deskX + 60} cy={deskY + 66} rx="20" ry="12"
        fill="#E0D9C8" stroke="#D0C9B8" strokeWidth="1"/>
      <rect x={deskX + 46} cy={deskY + 56} y={deskY + 56} width="28" height="16" rx="6"
        fill="#D8D2C2" stroke="#C8C2B2" strokeWidth="1"/>
      {/* chair back */}
      <rect x={deskX + 50} y={deskY + 38} width="20" height="22" rx="5"
        fill="#E0D9C8" stroke="#D0C9B8" strokeWidth="1"/>
      {/* chair support */}
      <line x1={deskX+60} y1={deskY+60} x2={deskX+60} y2={deskY+74}
        stroke="#C8C2B2" strokeWidth="1.5"/>

      {/* Desk surface */}
      <rect x={deskX} y={deskY} width="120" height="50" rx="4"
        fill="url(#desk-fill)" stroke="#C8C0AC" strokeWidth="1.2"/>
      {/* desk grain lines */}
      <line x1={deskX+4} y1={deskY+2} x2={deskX+4} y2={deskY+48}
        stroke="#D4CCBA" strokeWidth="0.8" opacity="0.5"/>
      <line x1={deskX+116} y1={deskY+2} x2={deskX+116} y2={deskY+48}
        stroke="#D4CCBA" strokeWidth="0.8" opacity="0.5"/>
      {/* desk front edge shadow */}
      <rect x={deskX} y={deskY+46} width="120" height="5" rx="2"
        fill="#C8C0AC" opacity="0.5"/>

      {/* Monitor */}
      <rect x={deskX+28} y={deskY-48} width="64" height="44" rx="4"
        fill={monitorColor} stroke="#141E28" strokeWidth="1"/>
      {/* screen */}
      <rect x={deskX+32} y={deskY-44} width="56" height="36" rx="2"
        fill="url(#monitor-screen)"/>
      {/* idle terminal content */}
      <text x={deskX+36} y={deskY-34} fill="#7AB08A" fontSize="5.5" fontFamily="monospace">$_</text>
      <rect x={deskX+36} y={deskY-30} width="28" height="2" rx="1" fill="#2A5F8F" opacity="0.4"/>
      <rect x={deskX+36} y={deskY-25} width="20" height="2" rx="1" fill="#2A5F8F" opacity="0.3"/>
      <rect x={deskX+36} y={deskY-20} width="34" height="2" rx="1" fill="#2A5F8F" opacity="0.25"/>
      {/* monitor stand */}
      <rect x={deskX+56} y={deskY-4} width="8" height="7" rx="2" fill="#283040"/>
      <rect x={deskX+50} y={deskY+2} width="20" height="3" rx="1" fill="#283040"/>

      {/* Keyboard */}
      <rect x={deskX+22} y={deskY+6} width="56" height="16" rx="3"
        fill="#F0EAD8" stroke="#D8D2C2" strokeWidth="1"/>
      {[0,1,2].map(row => (
        [0,1,2,3,4,5,6].map(col => (
          <rect key={`${row}-${col}`}
            x={deskX+25+col*7} y={deskY+8+row*4}
            width="5" height="3" rx="1"
            fill="#E0D9C8"/>
        ))
      ))}

      {/* Mouse */}
      <ellipse cx={deskX+90} cy={deskY+16} rx="6" ry="8"
        fill="#F0EAD8" stroke="#D8D2C2" strokeWidth="1"/>
      <line x1={deskX+90} y1={deskY+8} x2={deskX+90} y2={deskY+16}
        stroke="#D8D2C2" strokeWidth="0.8"/>

      {/* Personal item per cubicle */}
      {itemType === 'coffee' && (
        <g>
          <rect x={deskX+95} y={deskY+4} width="14" height="17" rx="3"
            fill="#E8624A" opacity="0.85"/>
          <path d={`M${deskX+109} ${deskY+9} Q${deskX+115} ${deskY+9} ${deskX+115} ${deskY+15} Q${deskX+115} ${deskY+21} ${deskX+109} ${deskY+21}`}
            fill="none" stroke="#E8624A" strokeWidth="1.5" opacity="0.85"/>
          <rect x={deskX+97} y={deskY+6} width="10" height="2" rx="1"
            fill="rgba(255,255,255,0.3)"/>
          {/* steam */}
          <path d={`M${deskX+100} ${deskY+2} Q${deskX+102} ${deskY-2} ${deskX+104} ${deskY+1}`}
            fill="none" stroke="#D8D2C2" strokeWidth="1.2" opacity="0.5" strokeLinecap="round"/>
        </g>
      )}

      {itemType === 'plant' && (
        <g>
          <rect x={deskX+96} y={deskY+32} width="14" height="10" rx="3"
            fill="#8B6914" opacity="0.4"/>
          <ellipse cx={deskX+103} cy={deskY+29} rx="8" ry="7"
            fill="#3D6B4F" opacity="0.75"/>
          <ellipse cx={deskX+97} cy={deskY+24} rx="5" ry="6"
            fill="#4A7A5E" opacity="0.65"/>
        </g>
      )}

      {itemType === 'books' && (
        <g>
          {[
            {dx:87, c:'#E8624A', h:22},
            {dx:93, c:'#2A5F8F', h:19},
            {dx:99, c:'#3D6B4F', h:21},
            {dx:105, c:'#D4840A', h:18},
          ].map((b, i) => (
            <rect key={i} x={deskX+b.dx} y={deskY+42-b.h} width="5" height={b.h} rx="1"
              fill={b.c} opacity="0.8"/>
          ))}
          {/* bookend */}
          <rect x={deskX+111} y={deskY+22} width="3" height="20" rx="1" fill="#D8D2C2"/>
        </g>
      )}
    </g>
  );
};

export default OfficeIdle;
