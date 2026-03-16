import React, { useState, useEffect } from "react";
import RobotSVG from "./RobotSVG";

/**
 * ComicBubble — act-aware speech / thought bubble.
 * key={text} at call-site forces re-mount & re-animation.
 */
function ComicBubble({ text, act, side }) {
  const isThought = act === "Thinking";
  const words = (text || "").trim().split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > 28 && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  const wrapped = lines.join("\n") || "…";

  if (isThought) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <div className={`comic-bubble__trail comic-bubble__trail--${side}`}>
          <span />
          <span />
          <span />
        </div>
        <div className="comic-bubble comic-bubble--thought comic-bubble--enter">
          <p className="comic-bubble__text">{wrapped}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comic-bubble comic-bubble--enter">
      <p className="comic-bubble__text">{wrapped}</p>
      <div className={`comic-bubble__tail comic-bubble--${side}`} />
    </div>
  );
}

/**
 * AgentCard — compact bot card used inside BotScene.
 *
 * Props:
 *   agentData  — { agent_name, act, text, status }
 *   side       — "left" | "right"
 *   isEntering — boolean (triggers bounce animation)
 */
export default function AgentCard({ agentData, side, isEntering }) {
  const { agent_name, act, text, status } = agentData || {};
  const isDone = status === "done";
  const accent = side === "left" ? "#2A5F8F" : "#3D6B4F";
  const accentLt = side === "left" ? "#DBEAFE" : "#D1FAE5";

  /* track previous text so bubble re-mounts on change */
  const [bubbleKey, setBubbleKey] = useState(0);
  const prevText = React.useRef(text);
  useEffect(() => {
    if (text !== prevText.current) {
      prevText.current = text;
      setBubbleKey((k) => k + 1);
    }
  }, [text]);

  return (
    <div
      className={[
        "agent-card-v2",
        `agent-card-v2--${side}`,
        isEntering ? "agent-card-v2--entering" : "",
      ]
        .join(" ")
        .trim()}
    >
      {/* Role chip */}
      <div className="agent-card-v2__role" style={{ color: accent }}>
        {side === "left" ? "MONITOR" : "WORKER"}
      </div>

      {/* Speech bubble area */}
      <div className="agent-card-v2__bubble-area">
        {text ? (
          <ComicBubble key={bubbleKey} text={text} act={act} side={side} />
        ) : (
          <div style={{ height: 52 }} />
        )}
      </div>

      {/* Think dots when thinking (supplement bubble) */}
      {act === "Thinking" && (
        <div className="think-dots-inline" style={{ marginBottom: -4 }}>
          <span />
          <span />
          <span />
        </div>
      )}

      {/* Robot */}
      <div className="robot-wrap">
        <RobotSVG
          act={isDone ? "Idle" : act || "Idle"}
          accentColor={accent}
          size={124}
        />
      </div>

      {/* Name badge */}
      <div
        className="agent-card-v2__badge"
        style={{ color: accent, borderColor: accent, background: accentLt }}
      >
        <span
          className="agent-card-v2__badge-dot"
          style={{ background: accent }}
        />
        {agent_name || (side === "left" ? "Monitor" : "Worker")}
      </div>

      {/* Act label */}
      <div className="agent-card-v2__act-label" style={{ color: accent }}>
        {isDone ? "✓ Complete" : act || "Idle"}
      </div>
    </div>
  );
}
