import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";

import DebugPanel from "./components/DebugPanel";
import { OfficeIdleScene, ActiveScene } from "./components/OfficeScene";

const WS_URL = "ws://192.168.0.109:8000/ws/state";

const MOCK_SEQUENCE = [
  {
    agent_name: "ARIA",
    act: "Reading",
    text: "Alert! CPU at 98% on prod-server-07. Analyzing now...",
  },
  {
    agent_name: "ARIA",
    act: "Thinking",
    text: "Spike started 4 mins ago. Likely a runaway process.",
  },
  {
    agent_name: "ARIA",
    act: "Responding",
    text: "BOLT, get on prod-server-07 ASAP. CPU at 98%!",
  },
  {
    agent_name: "BOLT",
    act: "Reading",
    text: "On it! Scanning process table on prod-server-07...",
  },
  {
    agent_name: "BOLT",
    act: "Thinking",
    text: "Found it — PID 14892, rogue job eating 6 cores.",
  },
  {
    agent_name: "BOLT",
    act: "Responding",
    text: "Killed PID 14892. CPU dropping... 22%... nominal!",
  },
  {
    agent_name: "ARIA",
    act: "Reading",
    text: "Metrics confirmed stable. Logging incident #4471.",
  },
  {
    agent_name: "BOLT",
    act: "Responding",
    text: "Root cause: bad batch job. Adding watchdog rule.",
  },
  {
    agent_name: "ARIA",
    act: "Done",
    text: "All clear. Resolved in 3m 42s. Returning to standby.",
  },
  {
    agent_name: "BOLT",
    act: "Done",
    text: "Standing down. Ready for next alert!",
  },
];

export default function App() {
  const [scene, setScene] = useState("idle");
  const [agents, setAgents] = useState({ monitor: null, worker: null });
  const [chatHistory, setChatHistory] = useState([]);
  const [jsonHistory, setJsonHistory] = useState([]);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [mockMode, setMockMode] = useState(false);

  const wsRef = useRef(null);
  const retryMs = useRef(1000);
  const retryTimer = useRef(null);
  const mounted = useRef(true);
  const mockTimerRef = useRef(null);
  const mockIndexRef = useRef(0);
  const monitorNameRef = useRef(null);

  const processMessage = useCallback((msg) => {
    const { agent_name, act, text } = msg;
    if (!agent_name) return;
    const ts = Date.now();

    if (!monitorNameRef.current) monitorNameRef.current = agent_name;
    const isMonitor = agent_name === monitorNameRef.current;
    const slot = isMonitor ? "monitor" : "worker";

    setAgents((prev) => {
      const updated = { ...prev, [slot]: { agent_name, act, text } };
      const other = prev[slot === "monitor" ? "worker" : "monitor"];
      if (other && act === "Done" && other.act === "Done") {
        setTimeout(() => {
          setScene("zooming-out");
          setTimeout(() => {
            setScene("idle");
            setAgents({ monitor: null, worker: null });
            monitorNameRef.current = null;
          }, 960);
        }, 2600);
      }
      return updated;
    });

    setScene((prev) => {
      if (prev === "idle") {
        setTimeout(() => setScene("active"), 920);
        return "zooming-in";
      }
      return prev;
    });

    setJsonHistory((h) => [...h.slice(-49), { data: msg, timestamp: ts }]);
    setChatHistory((h) => {
      const last = [...h].reverse().find((m) => m.agent === agent_name);
      if (last && last.text === text) return h;
      return [
        ...h.slice(-199),
        { agent: agent_name, slot, text, timestamp: ts },
      ];
    });
  }, []);

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
          let p = JSON.parse(data);
          if (Array.isArray(p)) p = p[0];
          processMessage(p);
        } catch (e) {
          console.error("[WS]", e);
        }
      };
      ws.onerror = () => {
        if (!mounted.current) return;
        setWsStatus("error");
      };
      ws.onclose = () => {
        if (!mounted.current) return;
        setWsStatus("disconnected");
        retryTimer.current = setTimeout(() => {
          retryMs.current = Math.min(retryMs.current * 2, 30000);
          connect();
        }, retryMs.current);
      };
    } catch {
      setWsStatus("error");
      retryTimer.current = setTimeout(() => {
        retryMs.current = Math.min(retryMs.current * 2, 30000);
        connect();
      }, retryMs.current);
    }
  }, [processMessage]);

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

  const startMock = useCallback(() => {
    mockIndexRef.current = 0;
    monitorNameRef.current = null;
    setAgents({ monitor: null, worker: null });
    setScene("idle");
    setChatHistory([]);
    setJsonHistory([]);
    const step = () => {
      const idx = mockIndexRef.current;
      if (idx >= MOCK_SEQUENCE.length) {
        setMockMode(false);
        return;
      }
      processMessage(MOCK_SEQUENCE[idx]);
      mockIndexRef.current++;
      mockTimerRef.current = setTimeout(
        step,
        MOCK_SEQUENCE[idx - 1]?.act === "Thinking" ? 2800 : 1900,
      );
    };
    mockTimerRef.current = setTimeout(step, 600);
  }, [processMessage]);

  const stopMock = useCallback(() => {
    clearTimeout(mockTimerRef.current);
    setMockMode(false);
    setScene("zooming-out");
    setTimeout(() => {
      setScene("idle");
      setAgents({ monitor: null, worker: null });
      monitorNameRef.current = null;
    }, 960);
  }, []);

  useEffect(() => {
    if (mockMode) startMock();
    return () => clearTimeout(mockTimerRef.current);
  }, [mockMode, startMock]);

  const statusMap = {
    connecting: { label: "Connecting", cls: "connecting" },
    connected: { label: "Live", cls: "connected" },
    disconnected: { label: "Reconnecting…", cls: "disconnected" },
    error: { label: "Error", cls: "error" },
  };
  const { label: statusLabel, cls: pipCls } =
    statusMap[wsStatus] || statusMap.connecting;

  const renderStage = () => {
    if (scene === "idle")
      return (
        <div className="office-idle">
          <div className="office-idle-svg-wrap">
            <OfficeIdleScene />
          </div>
          <div className="idle-tagline">
            <span className="idle-tagline-bar" />
            Awaiting dispatch
            <span className="idle-tagline-bar" />
          </div>
        </div>
      );

    if (scene === "zooming-in" || scene === "zooming-out")
      return (
        <div
          className={`office-zoom-wrap office-zoom-wrap--${scene === "zooming-in" ? "zooming-in" : "zooming-out"}`}
        >
          <div className="office-idle-svg-wrap">
            <OfficeIdleScene />
          </div>
        </div>
      );

    // Active: single SVG with everything inside
    return (
      <div className="active-scene-wrap">
        <ActiveScene ariaData={agents.monitor} boltData={agents.worker} />
      </div>
    );
  };

  return (
    <div className="app-layout">
      <main className="main-stage">
        <header className="top-bar">
          <div className="top-bar-logo">
            <svg width="20" height="20" viewBox="0 0 22 22">
              <path d="M11 2 L20 7 L20 15 L11 20 L2 15 L2 7 Z" fill="#cc1f1f" />
              <text
                x="11"
                y="14.5"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill="white"
              >
                TI
              </text>
            </svg>
            <span className="top-bar-ti-name">Texas Instruments</span>
            <span className="top-bar-subtitle">· Agent HQ</span>
          </div>
          <div className="top-bar-divider" />
          <div className="top-bar-status">
            <div className={`status-pip ${pipCls}`} />
            {statusLabel}
          </div>
          <div className="top-bar-ws-url">{WS_URL}</div>
          <button
            className={`mock-btn${mockMode ? " mock-btn--active" : ""}`}
            onClick={() => (mockMode ? stopMock() : setMockMode(true))}
          >
            {mockMode ? "⏹ Stop Mock" : "▶ Mock Mode"}
          </button>
        </header>
        <div className="stage-content">{renderStage()}</div>
      </main>
      <DebugPanel chatHistory={chatHistory} jsonHistory={jsonHistory} />
    </div>
  );
}
