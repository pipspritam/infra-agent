import React, { useState, useEffect, useRef } from 'react';

/**
 * DebugPanel — Fixed right sidebar.
 * Dark ink panel against the warm light main stage.
 * 
 * Tab 1: Chat Log    — per-agent message history
 * Tab 2: Raw JSON    — timestamped WS payload log
 */
const DebugPanel = ({ chatHistory = [], jsonHistory = [] }) => {
  const [tab, setTab] = useState('chat');
  const chatRef = useRef(null);
  const jsonRef = useRef(null);

  // Auto-scroll on new content
  useEffect(() => {
    if (tab === 'chat' && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory, tab]);

  useEffect(() => {
    if (tab === 'json' && jsonRef.current) {
      jsonRef.current.scrollTop = jsonRef.current.scrollHeight;
    }
  }, [jsonHistory, tab]);

  const fmt = ts => new Date(ts).toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <aside className="debug-panel">

      {/* Header */}
      <div className="debug-panel-top">
        <div className="debug-panel-wordmark">Agent HQ / console</div>
        <div className="debug-tab-row">
          <button
            className={`debug-tab-btn ${tab === 'chat' ? 'active' : ''}`}
            onClick={() => setTab('chat')}
          >
            Chat Log
          </button>
          <button
            className={`debug-tab-btn ${tab === 'json' ? 'active' : ''}`}
            onClick={() => setTab('json')}
          >
            Raw JSON
          </button>
        </div>
      </div>

      {/* ── Chat Tab ── */}
      {tab === 'chat' && (
        <div className="debug-body" ref={chatRef}>
          {chatHistory.length === 0 ? (
            <div className="debug-empty-state">
              <div className="debug-empty-icon">💬</div>
              <div className="debug-empty-text">No messages yet</div>
            </div>
          ) : (
            chatHistory.map((msg, i) => {
              const isMonitor = msg.agent?.toLowerCase().includes('monitor');
              return (
                <div key={i} className={`chat-msg ${isMonitor ? 'monitor' : 'worker'}`}>
                  <div className="chat-msg-label">
                    {msg.agent}
                    <span className="chat-msg-time">{fmt(msg.timestamp)}</span>
                  </div>
                  <div className="chat-msg-body">{msg.text}</div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── JSON Tab ── */}
      {tab === 'json' && (
        <div className="debug-body" ref={jsonRef}>
          {jsonHistory.length === 0 ? (
            <div className="debug-empty-state">
              <div className="debug-empty-icon">{'{ }'}</div>
              <div className="debug-empty-text">No payloads yet</div>
            </div>
          ) : (
            jsonHistory.map((entry, i) => (
              <div key={i} className="json-entry">
                <div className="json-entry-header">
                  <span>{fmt(entry.timestamp)}</span>
                  <span className="json-entry-hash">#{i + 1}</span>
                </div>
                <pre className="json-entry-pre">
                  {JSON.stringify(entry.data, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      )}

    </aside>
  );
};

export default DebugPanel;
