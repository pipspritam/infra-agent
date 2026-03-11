import React from "react";
import OfficeIdle from "./OfficeIdle";
import RobotBody from "./RobotBody";
import SpeechBubble from "./SpeechBubble";

/**
 * Hybrid mode: office background (idle) with one active agent robot
 * positioned at the center desk.
 */
const OfficeWithSingleAgent = ({ agent }) => {
  const { agent_name, act, text } = agent;
  // Determine accent color based on agent name
  const agentType = agent_name === "Monitor" ? "monitor" : "worker";

  return (
    <div className="single-agent-stage">
      {/* Background office (idle) */}
      <OfficeIdle />

      {/* Active agent overlay – absolutely positioned over desk */}
      <div className="agent-overlay">
        <RobotBody act={act} agentType={agentType} size={200} />
        {text && (
          <div className="bubble-wrapper">
            <SpeechBubble text={text} act={act} agentType={agentType} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficeWithSingleAgent;
