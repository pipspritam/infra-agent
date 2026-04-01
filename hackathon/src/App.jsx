import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";

import OfficeIdle from "./components/OfficeIdle";
import BotScene from "./components/BotScene";
import DebugPanel from "./components/DebugPanel";
import SkinSelector from "./components/SkinSelector";

const DEFAULT_WS_URL = "ws://192.168.0.104:8000/ws/state";

// Ms between each dialogue step during replay
const REPLAY_STEP_MS = 2800;

/* ── Mock API: submit agent server URL for approval ──────────────────────────
   Replace with a real call when the backend is ready:
   POST /api/agent-servers  { url: string }
   → { ok: true, message: string } | { ok: false, error: string }
────────────────────────────────────────────────────────────────────────────── */
async function submitAgentServerUrl(url) {
  await new Promise((r) => setTimeout(r, 900));
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    return { ok: false, error: "URL must start with http:// or https://" };
  }
  return {
    ok: true,
    message: "Submitted for approval — you'll be notified once it's live.",
  };
}

const App = () => {
  const [monitorBot, setMonitorBot] = useState(null);
  const [workerBot, setWorkerBot] = useState(null);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [chatHistory, setChatHistory] = useState([]);
  const [robotSkin, setRobotSkin] = useState(0);
  const [skinOpen, setSkinOpen] = useState(false);
  const [wsUrl, setWsUrl] = useState(
    () => localStorage.getItem("infrasage_ws_url") || DEFAULT_WS_URL,
  );
  const [editingUrl, setEditingUrl] = useState(false);

  // ── Debug panel — open by default so chat is always visible ──
  const [debugOpen, setDebugOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevChatLenRef = useRef(0);

  // ── Agent server URL submission ──
  const [serverSubmitUrl, setServerSubmitUrl] = useState("");
  const [serverSubmitState, setServerSubmitState] = useState("idle");
  const [serverSubmitMsg, setServerSubmitMsg] = useState("");

  // ── Replay state ──
  const [replayMode, setReplayMode] = useState(false);
  const [replayingIncident, setReplayingIncident] = useState(null);
  const [replayProgress, setReplayProgress] = useState({ step: 0, total: 0 });

  const replayModeRef = useRef(false);
  const monitorNameRef = useRef(null);
  const workerNameRef = useRef(null);
  const wsRef = useRef(null);
  const retryMs = useRef(1000);
  const retryTimer = useRef(null);
  const mounted = useRef(true);
  const replayTimers = useRef([]);
  const wsUrlRef = useRef(wsUrl);

  useEffect(() => {
    wsUrlRef.current = wsUrl;
    localStorage.setItem("infrasage_ws_url", wsUrl);
  }, [wsUrl]);

  useEffect(() => {
    replayModeRef.current = replayMode;
  }, [replayMode]);

  useEffect(() => {
    if (!skinOpen) return;
    const handler = (e) => {
      if (!e.target.closest("[data-skin-selector]")) setSkinOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [skinOpen]);

  // Track unread messages when panel is closed
  useEffect(() => {
    const newLen = chatHistory.length;
    if (!debugOpen && newLen > prevChatLenRef.current) {
      setUnreadCount((c) => c + (newLen - prevChatLenRef.current));
    }
    prevChatLenRef.current = newLen;
  }, [chatHistory, debugOpen]);

  // Clear unread when panel opens
  const handleDebugToggle = useCallback(() => {
    setDebugOpen((o) => {
      if (!o) setUnreadCount(0);
      return !o;
    });
  }, []);

  /* ── processMessage ──────────────────────────────────────────────────────── */
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

    setChatHistory((p) => {
      if (!text) return p;
      const last = [...p].reverse().find((m) => m.agent === agent_name);
      if (last && last.text === text) return p;
      return [
        ...p.slice(-200),
        {
          agent: agent_name,
          text,
          timestamp: ts,
          slot: isMonitor ? "monitor" : "worker",
        },
      ];
    });
  }, []);

  /* ── processMessages handles full array-of-2 format per README ──────────── */
  const processMessages = useCallback(
    (parsed) => {
      if (Array.isArray(parsed)) {
        parsed.forEach((msg) => processMessage(msg));
      } else {
        processMessage(parsed);
      }
    },
    [processMessage],
  );

  /* ── Auto-reset bots when both are done ──────────────────────────────────── */
  useEffect(() => {
    const monDone = monitorBot?.status === "done";
    const wrkDone = !workerBot || workerBot?.status === "done";
    if (monDone && wrkDone && monitorBot) {
      const t = setTimeout(() => {
        setMonitorBot(null);
        setWorkerBot(null);
        monitorNameRef.current = null;
        workerNameRef.current = null;
        if (replayModeRef.current) {
          setTimeout(() => {
            setReplayMode(false);
            setReplayingIncident(null);
            setReplayProgress({ step: 0, total: 0 });
          }, 800);
        }
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [monitorBot, workerBot]);

  /* ── Safe WS close ───────────────────────────────────────────────────────── */
  const safeCloseWs = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      wsRef.current.close();
    }
  }, []);

  /* ── WebSocket ───────────────────────────────────────────────────────────── */
  const connect = useCallback(() => {
    if (!mounted.current) return;
    setWsStatus("connecting");
    try {
      const ws = new WebSocket(wsUrlRef.current);
      wsRef.current = ws;
      ws.onopen = () => {
        if (!mounted.current) return;
        setWsStatus("connected");
        retryMs.current = 1000;
      };
      ws.onmessage = ({ data }) => {
        if (!mounted.current) return;
        if (replayModeRef.current) return;
        try {
          const parsed = JSON.parse(data);
          processMessages(parsed);
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
  }, [processMessages, safeCloseWs]);

  const reconnect = useCallback(() => {
    clearTimeout(retryTimer.current);
    retryMs.current = 1000;
    safeCloseWs();
    connect();
  }, [connect, safeCloseWs]);

  useEffect(() => {
    mounted.current = true;
    connect();
    return () => {
      mounted.current = false;
      clearTimeout(retryTimer.current);
      safeCloseWs();
    };
  }, [connect, safeCloseWs]);

  /* ── Replay helpers ──────────────────────────────────────────────────────── */
  const clearReplayTimers = () => {
    replayTimers.current.forEach(clearTimeout);
    replayTimers.current = [];
  };

  const resetBots = useCallback(() => {
    setMonitorBot(null);
    setWorkerBot(null);
    monitorNameRef.current = null;
    workerNameRef.current = null;
  }, []);

  const startReplay = useCallback(
    (incident) => {
      clearReplayTimers();
      replayModeRef.current = true;
      setReplayMode(true);
      resetBots();
      setChatHistory([]);
      setReplayingIncident(incident);

      const steps = incident.dialogue ?? [];
      setReplayProgress({ step: 0, total: steps.length });

      replayTimers.current = steps.map((msg, i) =>
        setTimeout(() => {
          processMessage(msg);
          setReplayProgress({ step: i + 1, total: steps.length });
        }, i * REPLAY_STEP_MS),
      );
    },
    [processMessage, resetBots],
  );

  const stopReplay = useCallback(() => {
    clearReplayTimers();
    replayModeRef.current = false;
    setReplayMode(false);
    setReplayingIncident(null);
    setReplayProgress({ step: 0, total: 0 });
    resetBots();
    setChatHistory([]);
  }, [resetBots]);

  useEffect(() => () => clearReplayTimers(), []);

  /* ── URL edit handler ────────────────────────────────────────────────────── */
  function handleUrlSubmit(newUrl) {
    const trimmed = (newUrl || "").trim();
    if (!trimmed) return;
    wsUrlRef.current = trimmed;
    setWsUrl(trimmed);
    setEditingUrl(false);
    clearTimeout(retryTimer.current);
    retryMs.current = 1000;
    safeCloseWs();
    connect();
  }

  /* ── Agent server URL submission ─────────────────────────────────────────── */
  async function handleServerUrlSubmit() {
    const trimmed = serverSubmitUrl.trim();
    if (!trimmed) return;
    setServerSubmitState("loading");
    setServerSubmitMsg("");
    try {
      const result = await submitAgentServerUrl(trimmed);
      if (result.ok) {
        setServerSubmitState("success");
        setServerSubmitMsg(result.message);
        setServerSubmitUrl("");
      } else {
        setServerSubmitState("error");
        setServerSubmitMsg(result.error);
      }
    } catch {
      setServerSubmitState("error");
      setServerSubmitMsg("Network error. Please try again.");
    }
    setTimeout(() => {
      setServerSubmitState("idle");
      setServerSubmitMsg("");
    }, 4000);
  }

  /* ── Status bar ──────────────────────────────────────────────────────────── */
  const statusMap = {
    connecting: { label: "Connecting", cls: "connecting" },
    connected: { label: "Live", cls: "connected" },
    disconnected: { label: "Reconnecting…", cls: "disconnected" },
    error: { label: "Error", cls: "error" },
  };
  const { label: statusLabel, cls: pipCls } =
    statusMap[wsStatus] || statusMap.connecting;
  const hasActiveBots = monitorBot !== null;

  const replayPct =
    replayProgress.total > 0
      ? Math.round((replayProgress.step / replayProgress.total) * 100)
      : 0;

  /* ── Render ──────────────────────────────────────────────────────────────── */
  return (
    <div className="app-layout">
      {/* ── Main stage — flex:1, shrinks when panel is open ───────────────── */}
      <main className="main-stage">
        {/* ── Top bar ───────────────────────────────────────────────────────── */}
        <header className="top-bar">
          <div className="top-bar-logo">
            <div
              className="top-bar-logo-dot"
              style={{ background: "#C8102E" }}
            />
            <span className="ti-brand">Texas Instruments</span>
            <span className="top-bar-dot-sep">·</span>
            <span className="infrasage-brand">InfraSage</span>
          </div>
          <div className="top-bar-divider" />
          <div className="top-bar-status">
            <div
              className={`status-pip ${replayMode ? "connected" : pipCls}`}
            />
            {replayMode ? "Replay Mode" : statusLabel}
          </div>

          {/* {(wsStatus === "disconnected" || wsStatus === "error") &&
            !replayMode && (
              <button
                className="reconnect-btn"
                onClick={reconnect}
                title="Reconnect WebSocket"
              >
                ↻ Reconnect
              </button>
            )} */}

          {/* ── Agent Server URL submission ────────────────────────────────── */}
          <div
            className="server-submit-wrap"
            title="Submit an agent server URL for admin approval"
          >
            <div className="server-submit-field">
              <input
                className={`server-submit-input server-submit-input--${serverSubmitState}`}
                type="text"
                placeholder="Submit agent server URL…"
                value={serverSubmitUrl}
                onChange={(e) => setServerSubmitUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleServerUrlSubmit();
                }}
                disabled={serverSubmitState === "loading"}
              />
              <button
                className={`server-submit-btn server-submit-btn--${serverSubmitState}`}
                onClick={handleServerUrlSubmit}
                disabled={
                  !serverSubmitUrl.trim() || serverSubmitState === "loading"
                }
              >
                {serverSubmitState === "loading" ? (
                  <span className="replay-spinner" />
                ) : serverSubmitState === "success" ? (
                  "✓"
                ) : serverSubmitState === "error" ? (
                  "!"
                ) : (
                  "Submit"
                )}
              </button>
            </div>
            {serverSubmitMsg && (
              <div
                className={`server-submit-toast server-submit-toast--${serverSubmitState}`}
              >
                {serverSubmitMsg}
              </div>
            )}
          </div>

          <div className="top-bar-divider" />

          <div data-skin-selector>
            <SkinSelector
              currentSkin={robotSkin}
              onSelect={setRobotSkin}
              open={skinOpen}
              onToggle={() => setSkinOpen((o) => !o)}
            />
          </div>

          {editingUrl ? (
            <input
              autoFocus
              className="ws-url-input"
              defaultValue={wsUrl}
              onBlur={(e) => handleUrlSubmit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUrlSubmit(e.currentTarget.value);
                if (e.key === "Escape") setEditingUrl(false);
              }}
            />
          ) : (
            <div
              className="top-bar-ws-url"
              onClick={() => !replayMode && setEditingUrl(true)}
              title={
                replayMode
                  ? "Stop replay to edit URL"
                  : "Click to edit WebSocket URL"
              }
              style={{
                opacity: replayMode ? 0.4 : 1,
                cursor: replayMode ? "not-allowed" : "pointer",
              }}
            >
              {wsUrl}
            </div>
          )}

          <div className="top-bar-divider" />

          {/* ── Debug panel toggle ─────────────────────────────────────────── */}
          <button
            className={`debug-toggle-btn${debugOpen ? " debug-toggle-btn--active" : ""}`}
            onClick={handleDebugToggle}
            title={debugOpen ? "Close debug console" : "Open debug console"}
            aria-label="Toggle debug console"
          >
            <span className="debug-toggle-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect
                  x="0.5"
                  y="0.5"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                />
                <path
                  d="M3 4.5L5.5 6.5L3 8.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 8.5H10"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="debug-toggle-label">Debug</span>
            {unreadCount > 0 && !debugOpen && (
              <span className="debug-toggle-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            <span className="debug-toggle-arrow">{debugOpen ? "›" : "‹"}</span>
          </button>
        </header>

        {/* ── Replay Banner ──────────────────────────────────────────────────── */}
        {replayMode && replayingIncident && (
          <div className="replay-banner">
            <div className="replay-banner-left">
              <span className="replay-badge">▶ REPLAY</span>
              <span className="replay-incident-id">{replayingIncident.id}</span>
              <span className="replay-incident-summary">
                {replayingIncident.summary}
              </span>
            </div>
            <div className="replay-banner-right">
              <div className="replay-progress-wrap">
                <div className="replay-progress-track">
                  <div
                    className="replay-progress-fill"
                    style={{ width: `${replayPct}%` }}
                  />
                </div>
                <span className="replay-progress-label">
                  {replayProgress.step}/{replayProgress.total}
                </span>
              </div>
              <button className="replay-stop-btn" onClick={stopReplay}>
                ⏹ Stop
              </button>
            </div>
          </div>
        )}

        {/* ── Stage ─────────────────────────────────────────────────────────── */}
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

      {/* ── Debug panel — push layout, no backdrop overlay ────────────────── */}
      <DebugPanel
        chatHistory={chatHistory}
        onReplayIncident={startReplay}
        replayingId={replayingIncident?.id ?? null}
        open={debugOpen}
        onClose={() => setDebugOpen(false)}
      />
    </div>
  );
};

export default App;
