import React from 'react';
import RobotBody from './RobotBody';
import SpeechBubble from './SpeechBubble';

/**
 * AgentCard — Individual agent card for dual-agent layout.
 * 
 * Warm editorial aesthetic: cream card with colored left stripe,
 * serif name, mono badge. Robot sits on a subtle desk shelf.
 * 
 * Props:
 *   agent   — { agent_name, act, text }
 *   variant — "monitor" | "worker"
 */
const AgentCard = ({ agent, variant = 'monitor' }) => {
  const isMonitor = variant === 'monitor';
  const accent    = isMonitor ? '#2A5F8F' : '#3D6B4F';
  const accentLt  = isMonitor ? '#DBEAFE' : '#D1E8D8';
  const accentMd  = isMonitor ? '#7AB4D8' : '#7AB08A';

  const act  = agent?.act  || 'Idle';
  const text = agent?.text || '';
  const name = agent?.agent_name || (isMonitor ? 'Monitor' : 'Worker');

  return (
    <div className={`agent-card ${variant}`}>

      {/* ── Header ── */}
      <div className="agent-card-header">
        <div className="agent-card-header-left">
          <div className="agent-card-title">{name}</div>
          <div className="agent-card-subtitle">
            {isMonitor ? 'Oversight · Analysis' : 'Execution · Output'}
          </div>
        </div>
        <span className="agent-act-badge">{act}</span>
      </div>

      {/* ── Body ── */}
      <div className="agent-card-body">

        {/* Bubble — key={text} re-mounts on each message → triggers CSS animation */}
        <div className="bubble-wrap" key={text}>
          <SpeechBubble text={text} act={act} accent={accent}/>
        </div>

        {/* Desk shelf + robot */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          {/* Shelf surface */}
          <div style={{
            position: 'absolute',
            bottom: 18,
            left: '12%',
            right: '12%',
            height: 6,
            background: 'linear-gradient(to bottom, #E0D9C9, #D4CCBC)',
            borderRadius: 3,
            boxShadow: '0 3px 8px rgba(28,26,22,0.1)',
          }}/>

          {/* Shelf front edge shadow */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: '14%',
            right: '14%',
            height: 4,
            background: 'rgba(28,26,22,0.06)',
            borderRadius: '0 0 4px 4px',
            filter: 'blur(2px)',
          }}/>

          {/* Small desk item — accent colored cube */}
          <div style={{
            position: 'absolute',
            bottom: 24,
            right: '16%',
            width: 14, height: 14,
            background: accentLt,
            border: `1.5px solid ${accentMd}`,
            borderRadius: 3,
          }}/>

          <div className="robot-wrap"
            style={{ animation: 'robot-bob 4s ease-in-out infinite', paddingBottom: 22 }}>
            <RobotBody act={act} accent={accent} size={1.05}/>
          </div>
        </div>

      </div>

      {/* ── Footer strip ── */}
      <div style={{
        height: 32,
        borderTop: '1.5px solid #EDE6D8',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px 0 22px',
        gap: 8,
        flexShrink: 0,
      }}>
        {/* Activity indicator */}
        <div style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: accent,
          animation: 'pip-glow 2s ease-in-out infinite',
          flexShrink: 0,
        }}/>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          color: 'var(--ink-4)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          flex: 1,
        }}>
          {isMonitor ? 'monitor@hq' : 'worker@hq'}
        </span>
        {/* Last act chip */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: accent,
          background: accentLt,
          padding: '2px 7px',
          borderRadius: 10,
          border: `1px solid ${accentMd}`,
          letterSpacing: '0.05em',
        }}>
          {act.toLowerCase()}
        </span>
      </div>

    </div>
  );
};

export default AgentCard;
