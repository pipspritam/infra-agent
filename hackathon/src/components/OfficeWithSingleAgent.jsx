import React from 'react';
import RobotBody from './RobotBody';
import SpeechBubble from './SpeechBubble';

/**
 * OfficeWithSingleAgent — Office backdrop at low opacity,
 * single active agent centered and elevated in the foreground.
 * 
 * The agent is rendered on a soft "spotlight" card that
 * feels like a desk focus area — cream paper with a gentle shadow.
 */
const OfficeWithSingleAgent = ({ agent }) => {
  const act    = agent?.act  || 'Idle';
  const text   = agent?.text || '';
  const name   = agent?.agent_name || 'Agent';
  const accent = '#2A5F8F';

  return (
    <div className="single-agent-stage">

      {/* ── Faded office backdrop ── */}
      <div className="single-backdrop" aria-hidden="true">
        {/* Import the same SVG structure but simplified */}
        <svg viewBox="0 0 860 510" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sb-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F9F5EC"/>
              <stop offset="100%" stopColor="#F0EAD8"/>
            </linearGradient>
            <linearGradient id="sb-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFDF7"/>
              <stop offset="100%" stopColor="#F8F3E8"/>
            </linearGradient>
            <linearGradient id="sb-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4EEFF"/>
              <stop offset="100%" stopColor="#EAF5FF"/>
            </linearGradient>
            <style>{`
              .sb-drone { animation: drone-float 2.8s ease-in-out infinite; }
            `}</style>
          </defs>
          <rect x="0" y="0" width="860" height="220" fill="url(#sb-wall)"/>
          <rect x="0" y="200" width="860" height="310" fill="url(#sb-floor)"/>
          {[0,1,2,3,4,5,6,7,8].map(i=>(
            <line key={i} x1="0" y1={210+i*34} x2="860" y2={210+i*34} stroke="#E8E2D2" strokeWidth="0.7"/>
          ))}
          {[0,1,2,3,4,5,6,7,8,9,10].map(i=>(
            <line key={i} x1={i*86} y1="210" x2={i*86} y2="510" stroke="#E8E2D2" strokeWidth="0.7"/>
          ))}
          <rect x="0" y="195" width="860" height="7" fill="#E0D9C9"/>

          {/* Windows */}
          <rect x="60" y="16" width="120" height="110" rx="4" fill="url(#sb-sky)" stroke="#D4C8B4" strokeWidth="1.5"/>
          <line x1="120" y1="16" x2="120" y2="126" stroke="#D4C8B4" strokeWidth="1.5"/>
          <line x1="60" y1="65" x2="180" y2="65" stroke="#D4C8B4" strokeWidth="1.5"/>
          <rect x="54" y="124" width="132" height="6" rx="2" fill="#D4C8B4"/>

          <rect x="360" y="16" width="120" height="110" rx="4" fill="url(#sb-sky)" stroke="#D4C8B4" strokeWidth="1.5"/>
          <line x1="420" y1="16" x2="420" y2="126" stroke="#D4C8B4" strokeWidth="1.5"/>
          <line x1="360" y1="65" x2="480" y2="65" stroke="#D4C8B4" strokeWidth="1.5"/>

          <rect x="640" y="16" width="120" height="110" rx="4" fill="url(#sb-sky)" stroke="#D4C8B4" strokeWidth="1.5"/>
          <line x1="700" y1="16" x2="700" y2="126" stroke="#D4C8B4" strokeWidth="1.5"/>
          <line x1="640" y1="65" x2="760" y2="65" stroke="#D4C8B4" strokeWidth="1.5"/>

          {/* Ceiling lights simplified */}
          {[170,430,690].map(lx => (
            <g key={lx}>
              <line x1={lx} y1="0" x2={lx} y2="22" stroke="#C8C0B0" strokeWidth="1.2"/>
              <rect x={lx-26} y="20" width="52" height="9" rx="4" fill="#EDE8DC" stroke="#D8D2C4" strokeWidth="0.8"/>
            </g>
          ))}

          {/* Cubicle dividers */}
          <rect x="90" y="320" width="600" height="6" rx="2" fill="#D8D0C0"/>
          <rect x="298" y="195" width="5" height="125" rx="2" fill="#D8D0C0"/>
          <rect x="498" y="195" width="5" height="125" rx="2" fill="#D8D0C0"/>
          <rect x="298" y="326" width="5" height="125" rx="2" fill="#D8D0C0"/>
          <rect x="498" y="326" width="5" height="125" rx="2" fill="#D8D0C0"/>

          {/* Simplified desks */}
          {[[108,210],[310,210],[510,210],[108,334],[310,334]].map(([dx,dy],i)=>(
            <g key={i}>
              <rect x={dx+24} y={dy+66} width="120" height="50" rx="3" fill="#E8DFC8" stroke="#C8C0AC" strokeWidth="1"/>
              <rect x={dx+52} y={dy+18} width="64" height="44" rx="3" fill="#1E2B38" opacity="0.9"/>
              <rect x={dx+56} y={dy+22} width="56" height="36" rx="2" fill="#0F1A24" opacity="0.8"/>
            </g>
          ))}

          {/* Bookshelf right */}
          <rect x="810" y="195" width="44" height="250" rx="4" fill="#DDD4BC" stroke="#C8C0AC" strokeWidth="1.2"/>

          {/* Plant break area */}
          <rect x="786" y="418" width="22" height="14" rx="3" fill="#8B6914" opacity="0.35"/>
          <ellipse cx="797" cy="412" rx="14" ry="12" fill="#3D6B4F" opacity="0.55"/>

          {/* Drone backdrop */}
          <g className="sb-drone">
            <ellipse cx="122" cy="258" rx="18" ry="10" fill="#2E3440" opacity="0.7"/>
            <line x1="104" y1="258" x2="88" y2="248" stroke="#3A4555" strokeWidth="1.5"/>
            <line x1="140" y1="258" x2="156" y2="248" stroke="#3A4555" strokeWidth="1.5"/>
          </g>

          {/* Server rack */}
          <rect x="20" y="195" width="56" height="160" rx="4" fill="#2C3340" opacity="0.8"/>
        </svg>
      </div>

      {/* ── Active agent spotlight ── */}
      <div className="single-agent-focus">
        {/* Bubble — key forces re-mount on new text */}
        <div className="bubble-wrap" key={text} style={{ marginBottom: 6 }}>
          <SpeechBubble text={text} act={act} accent={accent}/>
        </div>

        {/* Robot on a "desk spotlight" surface */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(to bottom, #FFFDF7, #F8F3E8)',
          border: '1.5px solid #E0D9C9',
          borderRadius: 20,
          padding: '20px 32px 8px',
          boxShadow: '0 12px 48px rgba(28,26,22,0.12), 0 4px 12px rgba(28,26,22,0.07)',
        }}>
          {/* subtle desk surface line */}
          <div style={{
            position: 'absolute', bottom: 52, left: 16, right: 16,
            height: '1px', background: '#E0D9C9',
          }}/>
          <div className="robot-wrap">
            <RobotBody act={act} accent={accent} size={1.4}/>
          </div>
        </div>

        {/* Nameplate */}
        <div className="single-agent-nameplate">
          {name}
          <span className="single-agent-nameplate-act">/ {act}</span>
        </div>
      </div>

    </div>
  );
};

export default OfficeWithSingleAgent;
