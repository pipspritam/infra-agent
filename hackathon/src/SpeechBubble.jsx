/**
 * SpeechBubble — light theme.
 * key={text} forces React re-mount → CSS pop-anim re-triggers
 * on every new message without any JS timers.
 */

function wrapText(str, maxLen = 26) {
  const words = str.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLen) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export default function SpeechBubble({ text, act, accentColor }) {
  const isThinking = act === 'Thinking';
  const lines = wrapText(text);
  const W     = 200;
  const lineH = 18;
  const padY  = 12;
  const H     = lines.length * lineH + padY * 2;

  // Light-theme fill — very subtle tint of the accent
  const bubbleBg    = `color-mix(in srgb, ${accentColor} 8%, #ffffff)`;
  const cloudBg     = `color-mix(in srgb, ${accentColor} 10%, #ffffff)`;
  const textColor   = '#1c1917';  // text-primary
  const thinkColor  = accentColor;

  /* ── Thought bubble ── */
  if (isThinking) {
    return (
      <div className="speech-bubble-wrap" key={text}>
        <svg
          width={W + 20}
          height={H + 32}
          viewBox={`0 0 ${W + 20} ${H + 32}`}
          className="bubble-svg pop-anim"
        >
          {/* Thought trail */}
          <circle cx={W / 2 + 10} cy={H + 27} r="4"  fill={accentColor} opacity="0.35" />
          <circle cx={W / 2 + 2}  cy={H + 19} r="5"  fill={accentColor} opacity="0.45" />
          <circle cx={W / 2 - 7}  cy={H + 11} r="6"  fill={accentColor} opacity="0.55" />

          {/* Cloud blobs */}
          {[
            {cx:50,  cy:H/2+4,  rx:22, ry:18},
            {cx:80,  cy:H/2,    rx:26, ry:20},
            {cx:112, cy:H/2+2,  rx:24, ry:19},
            {cx:140, cy:H/2+4,  rx:20, ry:17},
            {cx:62,  cy:H/2+12, rx:30, ry:15},
            {cx:100, cy:H/2+13, rx:34, ry:15},
            {cx:132, cy:H/2+12, rx:28, ry:14},
          ].map((e, i) => (
            <ellipse key={i}
              cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry}
              fill={cloudBg}
              stroke={accentColor}
              strokeWidth="1.2"
              opacity="0.9"
            />
          ))}

          {/* Text */}
          {lines.map((line, i) => (
            <text
              key={i}
              x={W / 2 + 8}
              y={padY + 13 + i * lineH}
              textAnchor="middle"
              fill={thinkColor}
              fontSize="11"
              fontFamily="'DM Mono', monospace"
              fontWeight="500"
            >
              {line}
            </text>
          ))}
        </svg>
      </div>
    );
  }

  /* ── Speech bubble ── */
  return (
    <div className="speech-bubble-wrap" key={text}>
      <svg
        width={W + 20}
        height={H + 22}
        viewBox={`0 0 ${W + 20} ${H + 22}`}
        className="bubble-svg pop-anim"
      >
        {/* Drop shadow approximation */}
        <rect x="12" y="7" width={W} height={H} rx="10"
          fill="rgba(0,0,0,0.06)" />

        {/* Bubble body */}
        <rect x="10" y="4" width={W} height={H} rx="10"
          fill={bubbleBg}
          stroke={accentColor}
          strokeWidth="1.2"
        />

        {/* Tail */}
        <polygon
          points={`${W / 2 + 5},${H + 4} ${W / 2 + 14},${H + 18} ${W / 2 + 22},${H + 4}`}
          fill={bubbleBg}
          stroke={accentColor}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Act badge */}
        <rect x={10 + W - 54} y="8" width="50" height="15" rx="4"
          fill={accentColor} opacity="0.12" />
        <text
          x={10 + W - 29} y="19.5"
          textAnchor="middle"
          fill={accentColor}
          fontSize="7.5"
          fontFamily="'DM Mono', monospace"
          fontWeight="500"
          opacity="0.9"
        >
          {act?.toUpperCase()}
        </text>

        {/* Message text */}
        {lines.map((line, i) => (
          <text
            key={i}
            x={10 + W / 2}
            y={4 + padY + 13 + i * lineH}
            textAnchor="middle"
            fill={textColor}
            fontSize="11"
            fontFamily="'DM Mono', monospace"
            fontWeight="400"
          >
            {line}
          </text>
        ))}
      </svg>
    </div>
  );
}
