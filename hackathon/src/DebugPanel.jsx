import { useState, useEffect, useRef } from 'react';

const ACT_COLORS = {
  Thinking:   '#d97706',
  Reading:    '#7c3aed',
  Responding: '#16a34a',
  Idle:       '#9e9488',
};

/* ─── Chat tab ─── */
function ChatTab({ chatHistory }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  if (chatHistory.length === 0) {
    return (
      <div className="chat-log">
        <div className="chat-empty">
          <div className="chat-empty-icon">◈</div>
          <span>Awaiting transmissions…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-log">
      {chatHistory.map(msg => {
        const isMonitor  = msg.agent === 'Monitor';
        const agentColor = isMonitor ? '#6366f1' : '#0ea5e9';
        const actColor   = ACT_COLORS[msg.act] ?? '#9e9488';

        return (
          <div key={msg.id} className={`chat-msg ${isMonitor ? 'left' : 'right'}`}>
            <div className="chat-msg-header">
              <span className="chat-agent"     style={{ color: agentColor }}>{msg.agent}</span>
              <span className="chat-act-badge" style={{ color: actColor }}>{msg.act}</span>
              <span className="chat-time">{msg.time}</span>
            </div>
            <div
              className="chat-bubble"
              style={{ borderColor: `color-mix(in srgb, ${agentColor} 25%, #e6e2dc)` }}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

/* ─── Raw JSON tab ─── */
function RawTab({ rawLogs }) {
  if (rawLogs.length === 0) {
    return (
      <div className="raw-log">
        <div className="chat-empty">
          <div className="chat-empty-icon">◈</div>
          <span>No payloads yet…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="raw-log">
      {rawLogs.map(log => (
        <div key={log.id} className="raw-entry">
          <div className="raw-ts">
            <span className="raw-ts-icon">▶</span>
            <span>{log.time}</span>
            <span className="raw-ts-label">ws payload</span>
          </div>
          <pre className="raw-pre">{log.payload}</pre>
        </div>
      ))}
    </div>
  );
}

/* ─── Panel ─── */
export default function DebugPanel({ chatHistory, rawLogs }) {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <aside className="debug-panel">

      {/* Header */}
      <div className="debug-header">
        <div className="debug-title">
          {/* React atom icon — sky colour, glow on parent hover */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <ellipse cx="8" cy="8" rx="7" ry="2.8"
              stroke="#0ea5e9" strokeWidth="1.2" />
            <ellipse cx="8" cy="8" rx="7" ry="2.8"
              stroke="#0ea5e9" strokeWidth="1.2" transform="rotate(60,8,8)" />
            <ellipse cx="8" cy="8" rx="7" ry="2.8"
              stroke="#0ea5e9" strokeWidth="1.2" transform="rotate(120,8,8)" />
            <circle cx="8" cy="8" r="1.5" fill="#0ea5e9" />
          </svg>
          Systems Log
        </div>
        <div className="debug-count">{chatHistory.length} entries</div>
      </div>

      {/* Tab bar */}
      <div className="debug-tabs">
        <button
          className={`debug-tab${activeTab === 'chat' ? ' active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
          {chatHistory.length > 0 && (
            <span className="tab-badge">{chatHistory.length}</span>
          )}
        </button>
        <button
          className={`debug-tab${activeTab === 'raw' ? ' active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          Raw JSON
          {rawLogs.length > 0 && (
            <span className="tab-badge">{rawLogs.length}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="debug-content">
        {activeTab === 'chat'
          ? <ChatTab chatHistory={chatHistory} />
          : <RawTab rawLogs={rawLogs} />}
      </div>

      {/* Footer */}
      <div className="debug-footer">
        <div className="signal-bar h1" />
        <div className="signal-bar h2" />
        <div className="signal-bar h3" />
        <div className="signal-bar h4" />
        <span>Live feed</span>
      </div>

    </aside>
  );
}
