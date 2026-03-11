import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";

import OfficeIdle from "./components/OfficeIdle";
import OfficeWithSingleAgent from "./components/OfficeWithSingleAgent";
import AgentCard from "./components/AgentCard";
import DebugPanel from "./components/DebugPanel";

/** WebSocket endpoint */
const WS_URL = "ws://192.168.0.109:8000/ws/state";

/**
 * App — Root component.
 *
 * Rendering modes:
 *   agents === null   → OfficeIdle (no WS data)
 *   agents.length === 1 → OfficeWithSingleAgent
 *   agents.length >= 2  → Dual AgentCard layout
 *
 * WebSocket: connects on mount, exponential back-off on failure.
 */
const App = () => {
  const [agents, setAgents] = useState(null);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [chatHistory, setChatHistory] = useState([]);
  const [jsonHistory, setJsonHistory] = useState([]);
  console.log(agents);
  const wsRef = useRef(null);
  const retryMs = useRef(1000);
  const retryTimer = useRef(null);
  const mounted = useRef(true);

  const connect = useCallback(() => {
    if (!mounted.current) return;
    setWsStatus("connecting");

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mounted.current) return;
        setWsStatus("connected");
        retryMs.current = 1000;
      };

      ws.onmessage = ({ data }) => {
        if (!mounted.current) return;

        try {
          let parsed = JSON.parse(data);

          // Convert dictionary → array
          if (!Array.isArray(parsed)) {
            parsed = [parsed];
          }

          const ts = Date.now();
          function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
          }
          sleep(2000);
          setAgents(parsed);

          setJsonHistory((prev) => [
            ...prev.slice(-49),
            { data: parsed, timestamp: ts },
          ]);

          setChatHistory((prev) => {
            const entries = parsed
              .filter((a) => a.text && a.agent_name)
              .filter((a) => {
                const last = [...prev]
                  .reverse()
                  .find((p) => p.agent === a.agent_name);
                return !last || last.text !== a.text;
              })
              .map((a) => ({
                agent: a.agent_name,
                text: a.text,
                timestamp: ts,
              }));

            return entries.length ? [...prev.slice(-199), ...entries] : prev;
          });
        } catch (e) {
          console.error("[WS] Parse error:", e);
        }
      };
      ws.onerror = () => {
        if (!mounted.current) return;
        setWsStatus("error");
      };

      ws.onclose = ({ code }) => {
        if (!mounted.current) return;
        setWsStatus("disconnected");
        retryTimer.current = setTimeout(() => {
          retryMs.current = Math.min(retryMs.current * 2, 30000);
          connect();
        }, retryMs.current);
      };
    } catch (e) {
      setWsStatus("error");
      retryTimer.current = setTimeout(() => {
        retryMs.current = Math.min(retryMs.current * 2, 30000);
        connect();
      }, retryMs.current);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    connect();
    return () => {
      mounted.current = false;
      clearTimeout(retryTimer.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect]);

  /* ── Status label & pip class ── */
  const statusMap = {
    connecting: { label: "Connecting", cls: "connecting" },
    connected: { label: "Live", cls: "connected" },
    disconnected: { label: "Reconnecting…", cls: "disconnected" },
    error: { label: "Error", cls: "error" },
  };
  const { label: statusLabel, cls: pipCls } =
    statusMap[wsStatus] || statusMap.connecting;

  /* ── Main stage renderer ── */
  const renderStage = () => {
    if (!agents) return <OfficeIdle />;

    if (agents.length === 1) {
      return <OfficeWithSingleAgent agent={agents[0]} />;
    }

    // Match by name, fallback to index
    const monitor =
      agents.find((a) => a.agent_name?.toLowerCase().includes("monitor")) ||
      agents[0];
    const worker =
      agents.find((a) => a.agent_name?.toLowerCase().includes("worker")) ||
      agents[1];

    return (
      <div className="dual-agent-stage">
        <AgentCard agent={monitor} variant="monitor" />
        <AgentCard agent={worker} variant="worker" />
      </div>
    );
  };

  return (
    <div className="app-layout">
      {/* ═══ Main Stage ═══ */}
      <main className="main-stage">
        {/* Top bar */}
        <header className="top-bar">
          <div className="top-bar-logo">
            <div className="top-bar-logo-dot" />
            Agent HQ
          </div>
          <div className="top-bar-divider" />
          <div className="top-bar-status">
            <div className={`status-pip ${pipCls}`} />
            {statusLabel}
          </div>
          <div className="top-bar-ws-url">{WS_URL}</div>
        </header>

        {/* Stage content */}
        <div className="stage-content">{renderStage()}</div>
      </main>

      {/* ═══ Debug Sidebar ═══ */}
      <DebugPanel chatHistory={chatHistory} jsonHistory={jsonHistory} />
    </div>
  );
};

export default App;
