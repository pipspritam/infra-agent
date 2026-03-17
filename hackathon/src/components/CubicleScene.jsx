import React, { useState, useEffect } from "react";
import CuteBot from "./CuteBot";

/**
 * CubicleScene — Shows a zoomed-in cubicle view with bot conversation
 *
 * Features:
 * - Smooth zoom-in from office to specific cubicle
 * - Two bots positioned on opposite sides
 * - Speech bubbles with dynamic content
 * - Smooth entry/exit animations
 * - Automatic reset when both bots are Done
 */

function SpeechBubble({ text, side, act }) {
  const isThinking = act === "Thinking";

  return (
    <div
      className={`comic-bubble comic-bubble--${isThinking ? "thought" : "speech"} comic-bubble--${side}`}
      style={{
        "--bubble-bg": isThinking ? "var(--cream-1)" : "var(--cream-0)",
        "--bubble-border": act === "Done" ? "var(--sage)" : "var(--ink-0)",
      }}
    >
      {isThinking && (
        <div className="think-dots-inline">
          <span />
          <span />
          <span />
        </div>
      )}
      <p className="comic-bubble__text">{text || "..."}</p>
      {!isThinking && <div className="comic-bubble__tail" />}
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

export default function CubicleScene({ agents, isResetting }) {
  const [displayedBots, setDisplayedBots] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [cubicleId, setCubicleId] = useState(0);

  useEffect(() => {
    if (!agents || agents.length === 0) {
      setDisplayedBots([]);
      setIsZoomed(false);
      return;
    }

    // Determine cubicle based on agent names (distribute across 3 cubicles)
    const newCubicleId = agents[0]?.agent_name?.charCodeAt(0) % 3;
    setCubicleId(newCubicleId);

    // Sort agents: Monitor first (left), Worker second (right)
    const sorted = [...agents].sort((a, b) => {
      const aIsMonitor = a.agent_name?.toLowerCase().includes("monitor");
      const bIsMonitor = b.agent_name?.toLowerCase().includes("monitor");
      return aIsMonitor ? -1 : 1;
    });

    // Create bot entries with side assignment
    const bots = sorted.map((agent, idx) => ({
      ...agent,
      side: idx === 0 ? "left" : "right",
      robotType: idx === 0 ? "monitor" : "worker",
      uniqueKey: `${agent.agent_name}-${Date.now()}-${idx}`,
    }));

    setDisplayedBots(bots);
    setIsZoomed(true);
  }, [agents]);

  if (!isZoomed || displayedBots.length === 0) {
    return null;
  }

  return (
    <div
      className={`cubicle-scene cubicle-scene--id-${cubicleId} ${isResetting ? "cubicle-scene--exiting" : ""}`}
    >
      {/* Cubicle backdrop */}
      <div className="cubicle-backdrop">
        <svg viewBox="0 0 1000 700" className="cubicle-svg" preserveAspectRatio="xMidYMid slice">
          {/* Floor */}
          <rect x="0" y="550" width="1000" height="150" fill="#d8cfb8" />
          <defs>
            <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#d8cfb8", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#cfc7b0", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect x="0" y="550" width="1000" height="150" fill="url(#floorGrad)" />

          {/* Back wall */}
          <rect x="0" y="0" width="1000" height="550" fill="#ebe3c8" />
          <defs>
            <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#ebe3c8", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#d8cfb8", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1000" height="550" fill="url(#wallGrad)" />

          {/* Cubicle divider - center wall */}
          <rect x="490" y="100" width="20" height="450" rx="8" fill="#a89a86" opacity="0.8" />

          {/* Left cubicle back wall */}
          <rect x="50" y="80" width="430" height="420" rx="12" fill="none" stroke="#b8ae98" strokeWidth="3" />
          {/* Left desk */}
          <rect x="80" y="480" width="370" height="60" rx="8" fill="#a89a86" />
          <rect x="85" y="485" width="360" height="50" rx="6" fill="#b8ae98" />

          {/* Right cubicle back wall */}
          <rect x="520" y="80" width="430" height="420" rx="12" fill="none" stroke="#b8ae98" strokeWidth="3" />
          {/* Right desk */}
          <rect x="550" y="480" width="370" height="60" rx="8" fill="#a89a86" />
          <rect x="555" y="485" width="360" height="50" rx="6" fill="#b8ae98" />

          {/* Wall textures */}
          {Array.from({ length: 10 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 100}
              y1="80"
              x2={i * 100}
              y2="550"
              stroke="#e4dbc0"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
        </svg>
      </div>

      {/* Bot containers with proper positioning */}
      <div className="cubicle-bots-container">
        {displayedBots.map((bot, idx) => (
          <div
            key={bot.uniqueKey}
            className={`bot-slot bot-slot--${bot.side} ${bot.act === "Done" ? "bot-slot--done" : ""}`}
          >
            {/* Bot name tag */}
            <div
              className="bot-name-tag"
              style={{
                color: bot.side === "left" ? "var(--blue)" : "var(--sage)",
                background: bot.side === "left" ? "var(--blue-lt)" : "var(--sage-lt)",
                borderColor: bot.side === "left" ? "var(--blue-md)" : "var(--sage-md)",
              }}
            >
              <span className="bot-name-dot" style={{
                background: bot.side === "left" ? "var(--blue)" : "var(--sage)",
              }} />
              {bot.agent_name}
            </div>

            {/* Act status */}
            <div className="bot-act-status" style={{
              color: bot.side === "left" ? "var(--blue)" : "var(--sage)",
            }}>
              {bot.act === "Reading" && "📖 Reading"}
              {bot.act === "Thinking" && "🤔 Thinking"}
              {bot.act === "Responding" && "💬 Responding"}
              {bot.act === "Idle" && "⏸ Idle"}
              {bot.act === "Done" && "✅ Done"}
            </div>

            {/* Robot SVG */}
            <div className="bot-robot-display">
              <CuteBot robotType={bot.robotType} act={bot.act} />
            </div>

            {/* Speech bubble */}
            <div className="bot-speech-area">
              <SpeechBubble text={bot.text} side={bot.side} act={bot.act} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
