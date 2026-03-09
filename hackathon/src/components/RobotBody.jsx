import React from 'react';

/**
 * RobotBody — Warm retro desk-toy robot, SVG primitives only.
 * 
 * Design language: rounded, friendly, slightly chunky — like a
 * high-quality enamel figurine sitting on a desk. Uses warm cream
 * body tones with colored accent panels.
 * 
 * Props:
 *   act    — "Idle" | "Reading" | "Thinking" | "Responding"
 *   accent — hex color (used for eye, chest panel, antenna tip)
 *   size   — scale multiplier (1 = 110×190 canvas)
 */
const RobotBody = ({ act = 'Idle', accent = '#2A5F8F', size = 1 }) => {
  const W = 110 * size;
  const H = 190 * size;

  // Warm body color palette
  const bodyMain  = '#F4EED8';
  const bodyShade = '#EAE2C8';
  const bodyDeep  = '#DDD5BC';
  const limbClr   = '#E0D9C4';
  const limbShade = '#D5CEBE';
  const highlight = '#FFFDF7';

  // Accent-derived lighter shade for subtle fills
  const isBlue = accent === '#2A5F8F';
  const accentPale = isBlue ? '#DBEAFE' : '#D1E8D8';
  const accentMid  = isBlue ? '#7AB4D8' : '#7AB08A';

  /* ── Eyes per act ── */
  const renderEyes = () => {
    switch (act) {
      case 'Reading':
        return (
          <g>
            {/* Lens circles (glasses) */}
            <ellipse cx="38" cy="58" rx="9" ry="8" fill={accentPale} stroke={accent} strokeWidth="1.5"/>
            <ellipse cx="72" cy="58" rx="9" ry="8" fill={accentPale} stroke={accent} strokeWidth="1.5"/>
            {/* bridge */}
            <line x1="47" y1="58" x2="63" y2="58" stroke={accent} strokeWidth="1.5"/>
            {/* pupils */}
            <circle cx="38" cy="58" r="3.5" fill={accent}/>
            <circle cx="72" cy="58" r="3.5" fill={accent}/>
            {/* glint */}
            <circle cx="40" cy="56.5" r="1.5" fill={highlight} opacity="0.9"/>
            <circle cx="74" cy="56.5" r="1.5" fill={highlight} opacity="0.9"/>
          </g>
        );
      case 'Thinking':
        return (
          <g>
            {/* Narrowed, contemplative half-ellipses */}
            <ellipse cx="38" cy="59" rx="8" ry="4" fill={accent} opacity="0.85"/>
            <ellipse cx="72" cy="59" rx="8" ry="4" fill={accent} opacity="0.85"/>
            {/* upward angled brow lines */}
            <line x1="31" y1="51" x2="45" y2="53" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            <line x1="79" y1="51" x2="65" y2="53" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
          </g>
        );
      case 'Responding':
        return (
          <g>
            {/* Wide, bright excited eyes */}
            <circle cx="38" cy="58" r="9" fill={accent}/>
            <circle cx="72" cy="58" r="9" fill={accent}/>
            {/* large glints */}
            <circle cx="41" cy="55.5" r="3.5" fill={highlight} opacity="0.85"/>
            <circle cx="75" cy="55.5" r="3.5" fill={highlight} opacity="0.85"/>
            {/* tiny secondary glint */}
            <circle cx="35" cy="61" r="1.5" fill={highlight} opacity="0.45"/>
            <circle cx="69" cy="61" r="1.5" fill={highlight} opacity="0.45"/>
          </g>
        );
      default: // Idle
        return (
          <g>
            {/* Calm horizontal bars */}
            <rect x="30" y="56" width="16" height="4" rx="2" fill={accent} opacity="0.75"/>
            <rect x="64" y="56" width="16" height="4" rx="2" fill={accent} opacity="0.75"/>
          </g>
        );
    }
  };

  /* ── Mouth per act ── */
  const renderMouth = () => {
    switch (act) {
      case 'Responding':
        return <path d="M38 74 Q55 83 72 74" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round"/>;
      case 'Thinking':
        return <line x1="44" y1="75" x2="66" y2="75" stroke={bodyDeep} strokeWidth="2" strokeLinecap="round"/>;
      case 'Reading':
        return <line x1="41" y1="75" x2="69" y2="75" stroke={bodyDeep} strokeWidth="2" strokeLinecap="round"/>;
      default:
        return <path d="M42 74 Q55 78 68 74" fill="none" stroke={bodyDeep} strokeWidth="2" strokeLinecap="round"/>;
    }
  };

  /* ── Left arm per act ── */
  const renderLeftArm = () => {
    switch (act) {
      case 'Reading':
        // Bent up, holding book from left
        return (
          <g>
            <rect x="6" y="96" width="14" height="22" rx="7" fill={limbClr} stroke={limbShade} strokeWidth="1"
              transform="rotate(30 13 96)"/>
            <circle cx="19" cy="117" r="7" fill={limbShade} stroke={bodyDeep} strokeWidth="1"/>
          </g>
        );
      case 'Thinking':
        // Arm bent with hand raised toward chin
        return (
          <g style={{ transformOrigin: '13px 96px', animation: 'robot-bob 3s ease-in-out infinite' }}>
            <rect x="4" y="92" width="14" height="26" rx="7" fill={limbClr} stroke={limbShade} strokeWidth="1"
              transform="rotate(38 11 92)"/>
            <circle cx="22" cy="114" r="7" fill={limbShade} stroke={bodyDeep} strokeWidth="1"/>
          </g>
        );
      case 'Responding':
        // Raised arm gesturing outward
        return (
          <g>
            <rect x="2" y="86" width="14" height="28" rx="7" fill={limbClr} stroke={limbShade} strokeWidth="1"
              transform="rotate(50 9 86)"/>
            <circle cx="24" cy="107" r="7" fill={limbShade} stroke={bodyDeep} strokeWidth="1"/>
          </g>
        );
      default:
        return (
          <g>
            <rect x="8" y="96" width="14" height="38" rx="7" fill={limbClr} stroke={limbShade} strokeWidth="1"/>
            <circle cx="15" cy="136" r="7" fill={limbShade} stroke={bodyDeep} strokeWidth="1"/>
          </g>
        );
    }
  };

  /* ── Right arm per act ── */
  const renderRightArm = () => {
    switch (act) {
      case 'Reading':
        return (
          <g>
            <rect x="90" y="96" width="14" height="22" rx="7" fill={limbClr} stroke={limbShade} strokeWidth="1"
              transform="rotate(-30 97 96)"/>
            <circle cx="91" cy="117" r="7" fill={limbShade} stroke={bodyDeep} strokeWidth="1"/>
          </g>
        );
      case 'Thinking':
        return (
          <g>
            <rect x="8" y="96" width="14" height="38" rx="7" fill={limbClr} stroke={limbShade} strokeWidth="1"
              style={{ transform: 'translateX(82px)' }}/>
            <circle cx="95" cy="136" r="7" fill={limbShade} stroke={bodyDeep} strokeWidth="1"/>
          </g>
        );
      case 'Responding':
        return (
          <g>
            <rect x="94" y="86" width="14" height="28" rx="7" fill={limbClr} stroke={limbShade} strokeWidth="1"
              transform="rotate(-50 101 86)"/>
            <circle cx="86" cy="107" r="7" fill={limbShade} stroke={bodyDeep} strokeWidth="1"/>
          </g>
        );
      default:
        return (
          <g>
            <rect x="88" y="96" width="14" height="38" rx="7" fill={limbClr} stroke={limbShade} strokeWidth="1"/>
            <circle cx="95" cy="136" r="7" fill={limbShade} stroke={bodyDeep} strokeWidth="1"/>
          </g>
        );
    }
  };

  /* ── Book prop for Reading ── */
  const renderBook = () => act === 'Reading' ? (
    <g>
      {/* Book body */}
      <rect x="28" y="118" width="54" height="38" rx="3" fill="#FFFDF7" stroke={bodyDeep} strokeWidth="1.5"/>
      {/* spine */}
      <line x1="55" y1="119.5" x2="55" y2="155" stroke={bodyDeep} strokeWidth="1.5"/>
      {/* left page lines */}
      <line x1="33" y1="128" x2="52" y2="128" stroke={accentMid} strokeWidth="1.2" opacity="0.7"/>
      <line x1="33" y1="133" x2="52" y2="133" stroke={accentMid} strokeWidth="1.2" opacity="0.7"/>
      <line x1="33" y1="138" x2="50" y2="138" stroke={accentMid} strokeWidth="1.2" opacity="0.7"/>
      <line x1="33" y1="143" x2="52" y2="143" stroke={accentMid} strokeWidth="1.2" opacity="0.7"/>
      {/* right page lines */}
      <line x1="58" y1="128" x2="77" y2="128" stroke={accentMid} strokeWidth="1.2" opacity="0.7"/>
      <line x1="58" y1="133" x2="77" y2="133" stroke={accentMid} strokeWidth="1.2" opacity="0.7"/>
      <line x1="58" y1="138" x2="75" y2="138" stroke={accentMid} strokeWidth="1.2" opacity="0.7"/>
      <line x1="58" y1="143" x2="77" y2="143" stroke={accentMid} strokeWidth="1.2" opacity="0.7"/>
    </g>
  ) : null;

  return (
    <svg
      width={W} height={H}
      viewBox="0 0 110 190"
      overflow="visible"
      aria-label={`Robot — ${act}`}
    >
      <defs>
        <filter id={`rb-glow-${accent.replace('#','')}`}>
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="body-shine" cx="35%" cy="25%" r="70%">
          <stop offset="0%" stopColor={highlight} stopOpacity="0.5"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="head-shine" cx="30%" cy="20%" r="70%">
          <stop offset="0%" stopColor={highlight} stopOpacity="0.55"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      {/* ── Treads ── */}
      <rect x="18" y="165" width="74" height="18" rx="9" fill={bodyDeep}/>
      {/* tread notches */}
      {[0,1,2,3,4,5].map(i => (
        <line key={i} x1={24 + i*11} y1="167" x2={24 + i*11} y2="181"
          stroke={limbShade} strokeWidth="1.2" opacity="0.6"/>
      ))}
      {/* wheel hubs */}
      <circle cx="30" cy="174" r="6.5" fill={bodyShade}/>
      <circle cx="55" cy="174" r="6.5" fill={bodyShade}/>
      <circle cx="80" cy="174" r="6.5" fill={bodyShade}/>
      <circle cx="30" cy="174" r="2.5" fill={bodyDeep}/>
      <circle cx="55" cy="174" r="2.5" fill={bodyDeep}/>
      <circle cx="80" cy="174" r="2.5" fill={bodyDeep}/>

      {/* ── Torso ── */}
      <rect x="22" y="90" width="66" height="76" rx="10" fill={bodyMain} stroke={bodyDeep} strokeWidth="1"/>
      {/* torso shine */}
      <rect x="22" y="90" width="66" height="76" rx="10" fill="url(#body-shine)"/>

      {/* chest accent panel */}
      <rect x="30" y="98" width="50" height="30" rx="6" fill={accentPale} stroke={accentMid} strokeWidth="1"/>
      {/* panel inner display */}
      <rect x="34" y="102" width="42" height="20" rx="3" fill={accent} opacity="0.12"/>
      {/* 3 status dots */}
      <circle cx="41" cy="112" r="4" fill={accent} opacity="0.75"
        style={{ animation: 'led-tick 3s ease-in-out infinite' }}/>
      <circle cx="55" cy="112" r="4" fill="#3D6B4F" opacity="0.75"
        style={{ animation: 'led-slow 4s ease-in-out infinite 0.6s' }}/>
      <circle cx="69" cy="112" r="4" fill="#D4840A" opacity="0.75"
        style={{ animation: 'led-tick 2.5s ease-in-out infinite 1.2s' }}/>

      {/* vent slots */}
      {[0,1,2].map(i => (
        <rect key={i} x="34" y={140+i*7} width="42" height="3" rx="1.5"
          fill={bodyShade} opacity="0.7"/>
      ))}

      {/* ── Arms ── */}
      {renderLeftArm()}
      {renderRightArm()}

      {/* ── Book prop ── */}
      {renderBook()}

      {/* ── Neck ── */}
      <rect x="44" y="78" width="22" height="14" rx="5" fill={bodyShade} stroke={bodyDeep} strokeWidth="1"/>

      {/* ── Head ── */}
      <rect x="20" y="30" width="70" height="52" rx="14" fill={bodyMain} stroke={bodyDeep} strokeWidth="1.2"/>
      <rect x="20" y="30" width="70" height="52" rx="14" fill="url(#head-shine)"/>

      {/* face cutout (recessed screen area) */}
      <rect x="26" y="44" width="58" height="32" rx="9" fill={bodyShade}/>
      <rect x="28" y="46" width="54" height="28" rx="7" fill="#FFFEFA"/>

      {/* ── Eyes ── */}
      {renderEyes()}

      {/* ── Mouth ── */}
      {renderMouth()}

      {/* ── Ear bumpers ── */}
      <rect x="12" y="44" width="10" height="20" rx="5" fill={bodyShade} stroke={bodyDeep} strokeWidth="1"/>
      <rect x="88" y="44" width="10" height="20" rx="5" fill={bodyShade} stroke={bodyDeep} strokeWidth="1"/>
      {/* ear detail dot */}
      <circle cx="17" cy="54" r="2.5" fill={bodyDeep}/>
      <circle cx="93" cy="54" r="2.5" fill={bodyDeep}/>

      {/* ── Antenna ── */}
      <line x1="55" y1="30" x2="55" y2="14" stroke={bodyDeep} strokeWidth="2.5" strokeLinecap="round"/>
      {/* ball joint */}
      <circle cx="55" cy="12" r="3" fill={bodyShade} stroke={bodyDeep} strokeWidth="1"/>
      {/* glowing tip */}
      <circle
        cx="55" cy="7" r="5" fill={accent}
        filter={`url(#rb-glow-${accent.replace('#','')})`}
        style={{ animation: 'antenna-glow 2s ease-in-out infinite' }}
      />
      <circle cx="55" cy="7" r="2.5" fill={highlight} opacity="0.7"/>
    </svg>
  );
};

export default RobotBody;
