import { useState, useEffect } from 'react';

const STATUS_CFG = {
  connecting:   { label: 'Connecting', color: '#d97706', blink: true  },
  connected:    { label: 'Live',       color: '#16a34a', blink: false },
  disconnected: { label: 'Offline',    color: '#9e9488', blink: false },
  error:        { label: 'Error',      color: '#dc2626', blink: true  },
};

export default function StatusBar({ wsStatus, agentCount }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const cfg = STATUS_CFG[wsStatus] ?? STATUS_CFG.connecting;

  return (
    <header className="status-bar">

      {/* ── Left: branding ── */}
      <div className="status-bar-left">
        <div className="hq-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5"
              fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="5"
              stroke="#6366f1" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2" fill="#6366f1" />
            <line x1="12" y1="2"  x2="12" y2="7"  stroke="#6366f1" strokeWidth="1.5" />
            <line x1="12" y1="17" x2="12" y2="22" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="2"  y1="12" x2="7"  y2="12" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="17" y1="12" x2="22" y2="12" stroke="#6366f1" strokeWidth="1.5" />
          </svg>
          <span className="hq-title">AI Agent HQ</span>
        </div>
        <span className="hq-subtitle">Operational Command Center</span>
      </div>

      {/* ── Center: agent grid ── */}
      <div className="status-bar-center">
        <div className="grid-indicator">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`grid-dot${i < agentCount * 4 ? ' active' : ''}`}
            />
          ))}
        </div>
        <span className="agent-count">
          {agentCount} agent{agentCount !== 1 ? 's' : ''} active
        </span>
      </div>

      {/* ── Right: status pill + clock ── */}
      <div className="status-bar-right">
        <div className="ws-status">
          <div
            className={`status-dot${cfg.blink ? ' blink' : ''}`}
            style={{
              background: cfg.color,
              boxShadow: `0 0 0 2px ${cfg.color}30`,
            }}
          />
          <span className="status-label" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
        </div>

        <div className="clock">
          <span className="clock-date">
            {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <span className="clock-time">
            {now.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>

    </header>
  );
}
