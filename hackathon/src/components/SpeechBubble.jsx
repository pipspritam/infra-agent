import React from 'react';

/**
 * SpeechBubble — Act-aware message bubble.
 * 
 * "Thinking" act → dashed thought bubble with trailing dots.
 * All others     → solid speech bubble with tail pointer.
 * 
 * CRITICAL: Wrap with key={text} at the call site to force
 * React re-mount and trigger the bubble-appear CSS animation
 * on every new message.
 */
const SpeechBubble = ({ text = '', act = 'Responding', accent = '#2A5F8F' }) => {
  const isThought = act === 'Thinking';

  /** Soft word-wrap at ~30 chars, preserving words. */
  const wrap = (str, max = 30) => {
    const words = str.trim().split(/\s+/);
    const lines = [];
    let cur = '';
    for (const w of words) {
      if ((cur + (cur ? ' ' : '') + w).length > max) {
        if (cur) lines.push(cur);
        cur = w;
      } else {
        cur = cur ? `${cur} ${w}` : w;
      }
    }
    if (cur) lines.push(cur);
    return lines.join('\n');
  };

  const wrapped = wrap(text) || '…';

  if (isThought) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div className="thought-trail">
          <div className="thought-trail-dot" style={{ animationDelay: '0s' }}/>
          <div className="thought-trail-dot" style={{ animationDelay: '0.15s' }}/>
          <div className="thought-trail-dot" style={{ animationDelay: '0.3s' }}/>
        </div>
        <div className="thought-bubble">
          <p className="bubble-text">{wrapped}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="speech-bubble">
      <p className="bubble-text">{wrapped}</p>
    </div>
  );
};

export default SpeechBubble;
