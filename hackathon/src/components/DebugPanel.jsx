import React, { useState, useRef, useEffect } from "react";

export default function DebugPanel({ chatHistory, jsonHistory }) {
  const [tab, setTab] = useState("chat");
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [chatHistory, jsonHistory, tab]);

  const fmt = (ts) => {
    const d = new Date(ts);
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
  };

  return (
    <aside className="debug-panel">
      <div className="debug-panel-top">
        <div className="debug-panel-wordmark">debug console</div>
        <div className="debug-tab-row">
          <button
            className={`debug-tab-btn${tab === "chat" ? " active" : ""}`}
            onClick={() => setTab("chat")}
          >
            Chat
          </button>
          <button
            className={`debug-tab-btn${tab === "json" ? " active" : ""}`}
            onClick={() => setTab("json")}
          >
            JSON
          </button>
        </div>
      </div>

      <div ref={bodyRef} className="debug-body">
        {tab === "chat" &&
          (chatHistory.length === 0 ? (
            <div className="debug-empty-state">
              <div className="debug-empty-icon">💬</div>
              <div className="debug-empty-text">Awaiting messages</div>
            </div>
          ) : (
            chatHistory.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.slot}`}>
                <div className="chat-msg-label">
                  {msg.agent}
                  <span className="chat-msg-time">{fmt(msg.timestamp)}</span>
                </div>
                <div className="chat-msg-body">{msg.text}</div>
              </div>
            ))
          ))}

        {tab === "json" &&
          (jsonHistory.length === 0 ? (
            <div className="debug-empty-state">
              <div className="debug-empty-icon">{"{}"}</div>
              <div className="debug-empty-text">No payloads yet</div>
            </div>
          ) : (
            jsonHistory.map((entry, i) => (
              <div key={i} className="json-entry">
                <div className="json-entry-header">
                  <span>#{String(i + 1).padStart(3, "0")}</span>
                  <span className="json-entry-hash">
                    {fmt(entry.timestamp)}
                  </span>
                </div>
                <pre className="json-entry-pre">
                  {JSON.stringify(entry.data, null, 2)}
                </pre>
              </div>
            ))
          ))}
      </div>
    </aside>
  );
}
