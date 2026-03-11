import React from "react";

/**
 * Reusable robot SVG.
 * Props:
 * - act: 'Idle' | 'Reading' | 'Thinking' | 'Responding'
 * - agentType: 'monitor' | 'worker' (affects accent color)
 * - size: width/height in pixels (optional)
 */
const RobotBody = ({ act = "Idle", agentType = "monitor", size = 200 }) => {
  // Determine colors based on agent type
  const primaryColor = agentType === "monitor" ? "#0369a1" : "#15803d";
  const secondaryColor = agentType === "monitor" ? "#0284c7" : "#16a34a";
  const lightColor = agentType === "monitor" ? "#7dd3fc" : "#86efac";

  // Eye shapes based on act
  let eyes;
  switch (act) {
    case "Reading":
      eyes = (
        <g>
          <circle cx="70" cy="60" r="10" fill="#fff" />
          <circle cx="130" cy="60" r="10" fill="#fff" />
          {/* Glasses overlay */}
          <rect
            x="55"
            y="50"
            width="30"
            height="20"
            rx="5"
            ry="5"
            fill="none"
            stroke="#000"
            strokeWidth="3"
          />
          <rect
            x="115"
            y="50"
            width="30"
            height="20"
            rx="5"
            ry="5"
            fill="none"
            stroke="#000"
            strokeWidth="3"
          />
          <line
            x1="85"
            y1="60"
            x2="115"
            y2="60"
            stroke="#000"
            strokeWidth="3"
          />
        </g>
      );
      break;
    case "Thinking":
      eyes = (
        <g>
          <ellipse cx="70" cy="60" rx="8" ry="12" fill="#fff" />
          <ellipse cx="130" cy="60" rx="8" ry="12" fill="#fff" />
          <circle cx="70" cy="60" r="4" fill="#000" />
          <circle cx="130" cy="60" r="4" fill="#000" />
        </g>
      );
      break;
    case "Responding":
      eyes = (
        <g>
          <circle cx="70" cy="60" r="12" fill="#fff" />
          <circle cx="130" cy="60" r="12" fill="#fff" />
          <circle cx="70" cy="60" r="6" fill={primaryColor} />
          <circle cx="130" cy="60" r="6" fill={primaryColor} />
          <circle cx="64" cy="54" r="2" fill="#fff" />
          <circle cx="124" cy="54" r="2" fill="#fff" />
        </g>
      );
      break;
    default: // Idle
      eyes = (
        <g>
          <line
            x1="60"
            y1="60"
            x2="80"
            y2="60"
            stroke="#000"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1="120"
            y1="60"
            x2="140"
            y2="60"
            stroke="#000"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      );
  }

  // Arms based on act
  let arms;
  switch (act) {
    case "Reading":
      arms = (
        <g>
          <rect
            x="10"
            y="90"
            width="30"
            height="15"
            rx="5"
            ry="5"
            fill={secondaryColor}
            transform="rotate(-20, 25, 100)"
          />
          <rect
            x="160"
            y="90"
            width="30"
            height="15"
            rx="5"
            ry="5"
            fill={secondaryColor}
            transform="rotate(20, 175, 100)"
          />
          {/* Book shape in one hand */}
          <rect
            x="5"
            y="70"
            width="25"
            height="20"
            rx="3"
            ry="3"
            fill="#8b5a2b"
            transform="rotate(-20, 20, 80)"
          />
        </g>
      );
      break;
    case "Thinking":
      arms = (
        <g>
          <rect
            x="10"
            y="100"
            width="40"
            height="15"
            rx="8"
            ry="8"
            fill={secondaryColor}
            transform="rotate(-30, 30, 110)"
          />
          <circle cx="140" cy="90" r="15" fill={secondaryColor} />
          <line
            x1="140"
            y1="90"
            x2="110"
            y2="70"
            stroke={secondaryColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
      );
      break;
    case "Responding":
      arms = (
        <g>
          <rect
            x="5"
            y="85"
            width="40"
            height="15"
            rx="8"
            ry="8"
            fill={secondaryColor}
            transform="rotate(20, 25, 95)"
          />
          <rect
            x="155"
            y="75"
            width="40"
            height="15"
            rx="8"
            ry="8"
            fill={secondaryColor}
            transform="rotate(-20, 175, 85)"
          />
        </g>
      );
      break;
    default: // Idle
      arms = (
        <g>
          <rect
            x="10"
            y="100"
            width="40"
            height="15"
            rx="8"
            ry="8"
            fill={secondaryColor}
          />
          <rect
            x="150"
            y="100"
            width="40"
            height="15"
            rx="8"
            ry="8"
            fill={secondaryColor}
          />
        </g>
      );
  }

  // Accessory based on act (for Reading we already added book; for Thinking we add thought clouds in bubble; for Responding we add speech bubble separately)
  // Additional accessories can be added here if needed, but we'll keep simple.

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`robot-body ${act.toLowerCase()}`}
    >
      {/* Treads / wheels */}
      <rect
        x="20"
        y="160"
        width="160"
        height="20"
        rx="10"
        ry="10"
        fill="#4b5563"
      />
      <circle cx="50" cy="180" r="15" fill="#1f2937" />
      <circle cx="150" cy="180" r="15" fill="#1f2937" />

      {/* Chassis body */}
      <rect
        x="40"
        y="80"
        width="120"
        height="80"
        rx="15"
        ry="15"
        fill={primaryColor}
      />

      {/* Head */}
      <rect
        x="60"
        y="20"
        width="80"
        height="60"
        rx="15"
        ry="15"
        fill={secondaryColor}
      />

      {/* Antenna */}
      <line
        x1="100"
        y1="20"
        x2="100"
        y2="0"
        stroke={secondaryColor}
        strokeWidth="4"
      />
      <circle
        cx="100"
        cy="-5"
        r="8"
        fill={lightColor}
        className="antenna-pulse"
      />

      {/* Status indicator lights */}
      <circle cx="80" cy="110" r="6" fill="#ffaa00" className="led-blink" />
      <circle
        cx="120"
        cy="110"
        r="6"
        fill="#00ff00"
        className="led-blink delay-1"
      />

      {/* Eyes */}
      {eyes}

      {/* Arms */}
      {arms}
    </svg>
  );
};

export default RobotBody;
