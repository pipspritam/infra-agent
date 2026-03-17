import React from "react";
import AgentCard from "./AgentCard";

/**
 * CubicleZoom — Zoomed-in cubicle view with agent conversations
 *
 * Displays:
 * - Full cubicle SVG with desk, monitor, chair
 * - Agent cards overlay positioned on left/right
 * - "Texas Instruments" title in red at top
 * - Smooth zoom in/out animations
 */
const CubicleZoom = ({ agents = [], zoomState, cubicleId = "A" }) => {
  // Cubicle dimensions and positions in the full office
  const cubicles = {
    A: { x: 108, y: 210, w: 178, h: 110, label: "A" },
    B: { x: 310, y: 210, w: 178, h: 110, label: "B" },
    C: { x: 510, y: 210, w: 178, h: 110, label: "C" },
    D: { x: 108, y: 334, w: 178, h: 110, label: "D" },
    E: { x: 310, y: 334, w: 178, h: 110, label: "E" },
  };

  const cubicle = cubicles[cubicleId] || cubicles.A;

  return (
    <div
      className={`cubicle-zoom cubicle-zoom--${zoomState}`}
      style={{ "--cubicle-id": `"${cubicleId}"` }}
    >
      {/* Title */}
      <div className="cubicle-zoom__title">
        Texas<span className="cubicle-zoom__title-highlight">Instruments</span>
      </div>

      {/* Zoomed cubicle SVG backdrop */}
      <div className="cubicle-zoom__backdrop">
        <svg viewBox="0 0 178 110" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cubicle-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F9F5EC" />
              <stop offset="100%" stopColor="#F0EAD8" />
            </linearGradient>
            <linearGradient id="cubicle-desk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8DFC8" />
              <stop offset="100%" stopColor="#DCCEB5" />
            </linearGradient>
            <linearGradient id="cubicle-monitor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1C2B3A" />
              <stop offset="100%" stopColor="#0F1A24" />
            </linearGradient>
          </defs>

          {/* Floor background */}
          <rect x="0" y="0" width="178" height="110" fill="url(#cubicle-floor)" />
          {/* Floor grid lines subtle */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={27.5 + i * 27.5}
              x2="178"
              y2={27.5 + i * 27.5}
              stroke="#E8E2D2"
              strokeWidth="0.6"
              opacity="0.5"
            />
          ))}
          {[0, 1].map((i) => (
            <line
              key={`v${i}`}
              x1={89 + i * 89}
              y1="0"
              x2={89 + i * 89}
              y2="110"
              stroke="#E8E2D2"
              strokeWidth="0.6"
              opacity="0.5"
            />
          ))}

          {/* Chair */}
          <ellipse cx="89" cy="82" rx="16" ry="9" fill="#E0D9C8" stroke="#D0C9B8" strokeWidth="0.8" />
          <rect x="79" y="72" width="20" height="12" rx="4" fill="#D8D2C2" stroke="#C8C2B2" strokeWidth="0.8" />
          {/* Chair back */}
          <rect x="83" y="58" width="12" height="16" rx="3" fill="#E0D9C8" stroke="#D0C9B8" strokeWidth="0.8" />
          {/* Chair support */}
          <line x1="89" y1="72" x2="89" y2="84" stroke="#C8C2B2" strokeWidth="1" />

          {/* Desk surface */}
          <rect
            x="39"
            y="72"
            width="100"
            height="30"
            rx="3"
            fill="url(#cubicle-desk)"
            stroke="#C8C0AC"
            strokeWidth="1"
          />

          {/* Monitor */}
          <rect x="58" y="32" width="54" height="38" rx="3" fill="#1E2B3A" stroke="#141E28" strokeWidth="0.8" />
          {/* Monitor screen */}
          <rect x="61" y="35" width="48" height="30" rx="2" fill="url(#cubicle-monitor)" />
          {/* Screen glow */}
          <rect x="61" y="35" width="48" height="30" rx="2" fill="#0F1A24" opacity="0.6" />
          {/* Terminal text */}
          <text x="64" y="43" fill="#38bdf8" fontSize="3.5" fontFamily="monospace">
            active
          </text>
          {/* Monitor stand */}
          <rect x="80" y="68" width="6" height="5" rx="1.5" fill="#283040" />
          <rect x="75" y="71" width="16" height="2" rx="1" fill="#283040" />

          {/* Keyboard simplified */}
          <rect x="45" y="80" width="48" height="11" rx="2" fill="#F0EAD8" stroke="#D8D2C2" strokeWidth="0.8" />
          {/* Key cluster */}
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3, 4, 5].map((col) => (
              <rect
                key={`k${row}-${col}`}
                x={48 + col * 6}
                y={82 + row * 3}
                width="4"
                height="2"
                rx="0.5"
                fill="#E0D9C8"
              />
            ))
          )}

          {/* Mouse */}
          <ellipse cx="117" cy="86" rx="5" ry="6" fill="#F0EAD8" stroke="#D8D2C2" strokeWidth="0.8" />
          <line x1="117" y1="80" x2="117" y2="86" stroke="#D8D2C2" strokeWidth="0.6" />

          {/* Coffee mug */}
          <rect x="120" y="75" width="10" height="12" rx="2" fill="#E8624A" opacity="0.8" />
          <path
            d="M130 79 Q133 79 133 84 Q133 88 130 88"
            fill="none"
            stroke="#E8624A"
            strokeWidth="1"
            opacity="0.8"
          />

          {/* Plant on desk */}
          <rect x="128" y="88" width="8" height="6" rx="2" fill="#8B6914" opacity="0.35" />
          <ellipse cx="132" cy="85" rx="5" ry="4" fill="#3D6B4F" opacity="0.6" />
        </svg>
      </div>

      {/* Agent cards overlay */}
      <div className="cubicle-zoom__agents">
        {agents.map((agent, idx) => (
          <div
            key={agent.agent_name}
            className={`agent-overlay agent-overlay--${agent.slot} agent-overlay--entering`}
          >
            <AgentCard agentData={agent} side={agent.slot} isEntering={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CubicleZoom;
