import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";

import OfficeIdle from "./components/OfficeIdle";
import BotScene from "./components/BotScene";
import DebugPanel from "./components/DebugPanel";
import SkinSelector from "./components/SkinSelector";

const WS_URL = "ws://192.168.0.109:8000/ws/state";

const MOCK_SCRIPT = [
  {
    agent_name: "Shail",
    act: "Reading",
    text: "Alert: API latency spike on prod cluster — p99 at 840ms!",
  },
  {
    agent_name: "Shail",
    act: "Thinking",
    text: "Analyzing patterns... could be a DB connection pool issue",
  },
  {
    agent_name: "Shail",
    act: "Responding",
    text: "Summoning DevBot to investigate the database layer!",
  },
  {
    agent_name: "DevBot",
    act: "Reading",
    text: "On it! Pulling DB metrics now...",
  },
  {
    agent_name: "DevBot",
    act: "Thinking",
    text: "Found 847 idle connections — pool completely exhausted",
  },
  {
    agent_name: "Shail",
    act: "Responding",
    text: "Confirmed spike at 14:32 UTC. Can you flush the stale connections?",
  },
  {
    agent_name: "DevBot",
    act: "Responding",
    text: "Running PURGE on connection pool now...",
  },
  {
    agent_name: "DevBot",
    act: "Thinking",
    text: "Pool cleared. Monitoring response times closely...",
  },
  {
    agent_name: "Shail",
    act: "Reading",
    text: "Latency dropping — 840ms → 220ms → 95ms. Looking great!",
  },
  {
    agent_name: "DevBot",
    act: "Responding",
    text: "All connections healthy. Back to baseline 87ms!",
  },
  {
    agent_name: "DevBot",
    act: "Done",
    text: "Issue resolved. Signing off! 🎉",
  },
  {
    agent_name: "Shail",
    act: "Done",
    text: "All systems green. Great work, DevBot!",
  },
];

const App = () => {
  const [monitorBot, setMonitorBot] = useState(null);
  const [workerBot, setWorkerBot] = useState(null);
  const [mockMode, setMockMode] = useState(false);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [chatHistory, setChatHistory] = useState([]);
  const [jsonHistory, setJsonHistory] = useState([]);
  const [robotSkin, setRobotSkin] = useState(0);
  const [skinOpen, setSkinOpen] = useState(false);

  const monitorNameRef = useRef(null);
  const workerNameRef = useRef(null);
  const wsRef = useRef(null);
  const retryMs = useRef(1000);
  const retryTimer = useRef(null);
  const mounted = useRef(true);
  const mockTimers = useRef([]);

  // Close skin selector on outside click
  useEffect(() => {
    if (!skinOpen) return;
    const handler = (e) => {
      if (!e.target.closest("[data-skin-selector]")) setSkinOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [skinOpen]);

  const processMessage = useCallback((msg) => {
    const { agent_name, act, text } = msg || {};
    if (!agent_name) return;
    const ts = Date.now();

    if (!monitorNameRef.current) monitorNameRef.current = agent_name;

    const isMonitor = agent_name === monitorNameRef.current;
    const newStatus = act === "Done" ? "done" : "active";
    const botPayload = {
      agent_name,
      act: act || "Idle",
      text: text || "",
      status: newStatus,
    };

    if (isMonitor) {
      setMonitorBot(botPayload);
    } else {
      if (!workerNameRef.current || agent_name !== workerNameRef.current)
        workerNameRef.current = agent_name;
      setWorkerBot(botPayload);
    }

    setJsonHistory((p) => [...p.slice(-49), { data: msg, timestamp: ts }]);
    setChatHistory((p) => {
      if (!text) return p;
      const last = [...p].reverse().find((m) => m.agent === agent_name);
      if (last && last.text === text) return p;
      return [
        ...p.slice(-199),
        {
          agent: agent_name,
          text,
          timestamp: ts,
          slot: isMonitor ? "Shail" : "worker",
        },
      ];
    });
  }, []);

  useEffect(() => {
    const monDone = monitorBot?.status === "done";
    const wrkDone = !workerBot || workerBot?.status === "done";
    if (monDone && wrkDone && monitorBot) {
      const t = setTimeout(() => {
        setMonitorBot(null);
        setWorkerBot(null);
        monitorNameRef.current = null;
        workerNameRef.current = null;
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [monitorBot?.status, workerBot?.status, monitorBot, workerBot]);

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
          if (Array.isArray(parsed)) parsed = parsed[0];
          processMessage(parsed);
        } catch (e) {
          console.error("[WS] Parse error:", e);
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

  const clearMockTimers = () => {
    mockTimers.current.forEach(clearTimeout);
    mockTimers.current = [];
  };
  const resetBots = () => {
    setMonitorBot(null);
    setWorkerBot(null);
    monitorNameRef.current = null;
    workerNameRef.current = null;
  };

  const toggleMock = () => {
    clearMockTimers();
    if (mockMode) {
      setMockMode(false);
      resetBots();
    } else {
      setMockMode(true);
      resetBots();
      setTimeout(() => {
        mockTimers.current = MOCK_SCRIPT.map((msg, i) =>
          setTimeout(() => processMessage(msg), i * 2800),
        );
      }, 150);
    }
  };

  const statusMap = {
    connecting: { label: "Connecting", cls: "connecting" },
    connected: { label: "Live", cls: "connected" },
    disconnected: { label: "Reconnecting…", cls: "disconnected" },
    error: { label: "Error", cls: "error" },
  };
  const { label: statusLabel, cls: pipCls } =
    statusMap[wsStatus] || statusMap.connecting;
  const hasActiveBots = monitorBot !== null;

  return (
    <div className="app-layout">
      <main className="main-stage">
        <header className="top-bar">
          <div className="top-bar-logo">
            <div
              className="top-bar-logo-dot"
              style={{ background: "#C8102E" }}
            />
            <span className="ti-brand">Texas Instruments</span>
            <span className="top-bar-dot-sep">·</span>
            Agent HQ
          </div>
          <div className="top-bar-divider" />
          <div className="top-bar-status">
            <div className={`status-pip ${mockMode ? "connected" : pipCls}`} />
            {mockMode ? "Mock Mode" : statusLabel}
          </div>
          <button
            className={`mock-btn${mockMode ? " mock-btn--active" : ""}`}
            onClick={toggleMock}
            aria-label={mockMode ? "Stop mock mode" : "Start mock mode"}
          >
            {mockMode ? "⏹ Stop Mock" : "▶ Mock Mode"}
          </button>

          {/* Robot skin selector */}
          <div data-skin-selector>
            <SkinSelector
              currentSkin={robotSkin}
              onSelect={setRobotSkin}
              open={skinOpen}
              onToggle={() => setSkinOpen((o) => !o)}
            />
          </div>

          <div className="top-bar-ws-url">{WS_URL}</div>
        </header>

        <div className="stage-content">
          {!hasActiveBots ? (
            <div key="idle" className="scene-wrapper scene-idle-wrapper">
              <OfficeIdle />
            </div>
          ) : (
            <div key="active" className="scene-wrapper scene-active-wrapper">
              <BotScene
                monitorBot={monitorBot}
                workerBot={workerBot}
                skin={robotSkin}
              />
            </div>
          )}
        </div>
      </main>

      <DebugPanel chatHistory={chatHistory} jsonHistory={jsonHistory} />
    </div>
  );
};

export default App;
