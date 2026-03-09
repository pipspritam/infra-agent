import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";

import OfficeIdle from "./components/OfficeIdle";
import OfficeWithSingleAgent from "./components/OfficeWithSingleAgent";
import AgentCard from "./components/AgentCard";
import DebugPanel from "./components/DebugPanel";

/** WebSocket endpoint */
const WS_URL = "ws://192.168.0.109:8000/ws/state";

/* ══════════════════════════════════════════════════════════════
   DEMO CONVERSATION SCRIPT
   A realistic infra-alert conversation between Monitor & Worker
   Each beat: { agent, act, text, duration }
     - duration = how long (ms) this state shows before advancing
     - act: "Idle" | "Reading" | "Thinking" | "Responding"
   ══════════════════════════════════════════════════════════════ */
const DEMO_SCRIPT = [
  // ── Beat 0: Alert detected ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Reading",
      text: "🚨 Alert triggered — Storage volume /data-01 at 94% capacity. I/O wait spiking.",
    },
    worker: { agent_name: "BOT-3", act: "Idle", text: "..." },
    duration: 3200,
  },
  // ── Beat 1: Worker notices ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Reading",
      text: "🚨 Alert triggered — Storage volume /data-01 at 94% capacity. I/O wait spiking.",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Reading",
      text: "Pulling metrics now. Let me check the disk usage breakdown...",
    },
    duration: 2800,
  },
  // ── Beat 2: Monitor thinks ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Thinking",
      text: "Cross-referencing with last 72h write patterns...",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Reading",
      text: "Pulling metrics now. Let me check the disk usage breakdown...",
    },
    duration: 2600,
  },
  // ── Beat 3: Worker reports back ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Thinking",
      text: "Cross-referencing with last 72h write patterns...",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Responding",
      text: "Found it. /var/log/app dumped 40GB of debug logs since midnight. No rotation policy set.",
    },
    duration: 3400,
  },
  // ── Beat 4: Monitor responds ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Responding",
      text: "That's the culprit. Can you truncate stale logs and set a 7-day rotation?",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Responding",
      text: "Found it. /var/log/app dumped 40GB of debug logs since midnight. No rotation policy set.",
    },
    duration: 3000,
  },
  // ── Beat 5: Worker thinks ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Idle",
      text: "Awaiting confirmation...",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Thinking",
      text: "Calculating safe truncation threshold... don't want to wipe active traces.",
    },
    duration: 2800,
  },
  // ── Beat 6: Worker executes ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Reading",
      text: "Watching volume drop in real-time...",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Responding",
      text: "Running: find /var/log/app -mtime +1 -delete && logrotate -f /etc/logrotate.d/app",
    },
    duration: 3500,
  },
  // ── Beat 7: Monitor reading results ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Reading",
      text: "Storage at 61% ✓  I/O wait normalising. That's a 33-point drop.",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Thinking",
      text: "Verifying rotation config was written correctly...",
    },
    duration: 3000,
  },
  // ── Beat 8: Worker done ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Reading",
      text: "Storage at 61% ✓  I/O wait normalising. That's a 33-point drop.",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Responding",
      text: "Rotation confirmed. Set to: daily, compress, 7-day retain. Alert should clear in ~2min.",
    },
    duration: 3500,
  },
  // ── Beat 9: Monitor closes loop ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Responding",
      text: "Perfect. I'll flag compute node CPU-4 next — it's been at 98% for 18 minutes.",
    },
    worker: { agent_name: "BOT-3", act: "Idle", text: "On it. Standing by." },
    duration: 3400,
  },
  // ── Beat 10: Worker ready ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Thinking",
      text: "Isolating the runaway process...",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Reading",
      text: "Checked CPU-4. PID 38821 — a stuck model-inference job, no timeout set.",
    },
    duration: 3000,
  },
  // ── Beat 11: Monitor decides ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Responding",
      text: "Kill it and add a 30-min timeout to the inference queue config.",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Reading",
      text: "Checked CPU-4. PID 38821 — a stuck model-inference job, no timeout set.",
    },
    duration: 2800,
  },
  // ── Beat 12: Worker executes ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Reading",
      text: "CPU-4 load falling... 98%... 71%... 34%. Nice.",
    },
    worker: {
      agent_name: "BOT-3",
      act: "Responding",
      text: "kill -9 38821 done. Timeout set. Queue healthy. All green on my end 🟢",
    },
    duration: 3600,
  },
  // ── Beat 13: Both idle / resolved ──
  {
    monitor: {
      agent_name: "ARIA-7",
      act: "Idle",
      text: "All systems nominal. Resuming scheduled checks.",
    },
    worker: { agent_name: "BOT-3", act: "Idle", text: "Ready for next task." },
    duration: 4000,
  },
];

/**
 * App — Root component.
 *
 * Rendering modes:
 *   agents === null   → OfficeIdle (no WS data)
 *   agents.length === 1 → OfficeWithSingleAgent
 *   agents.length >= 2  → Dual AgentCard layout
 *
 * WebSocket: connects on mount, exponential back-off on failure.
 * Demo Mode: "Run Demo" button steps through DEMO_SCRIPT with
 *            realistic timing so agents appear to converse.
 */
const App = () => {
  const [agents, setAgents] = useState(null);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [chatHistory, setChatHistory] = useState([]);
  const [jsonHistory, setJsonHistory] = useState([]);
  const [demoActive, setDemoActive] = useState(false);
  const [demoBeat, setDemoBeat] = useState(0);

  const wsRef = useRef(null);
  const retryMs = useRef(1000);
  const retryTimer = useRef(null);
  const mounted = useRef(true);
  const demoTimer = useRef(null);
  const demoRef = useRef(false); // tracks demo state without closure stale ref

  /* ── Helper: push agents state + update histories ── */
  const pushAgentState = useCallback((parsed) => {
    const ts = Date.now();
    setAgents(parsed);
    setJsonHistory((prev) => [
      ...prev.slice(-49),
      { data: parsed, timestamp: ts },
    ]);
    setChatHistory((prev) => {
      const entries = parsed
        .filter((a) => a.text && a.agent_name && a.text !== "...")
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
  }, []);

  /* ── Demo runner ── */
  const runDemoBeat = useCallback(
    (beatIndex) => {
      if (!demoRef.current) return;
      if (beatIndex >= DEMO_SCRIPT.length) {
        // Loop back to start after a short pause
        demoTimer.current = setTimeout(() => {
          if (demoRef.current) runDemoBeat(0);
        }, 2000);
        return;
      }

      const beat = DEMO_SCRIPT[beatIndex];
      const parsed = [beat.monitor, beat.worker];
      pushAgentState(parsed);
      setDemoBeat(beatIndex);

      demoTimer.current = setTimeout(() => {
        if (demoRef.current) runDemoBeat(beatIndex + 1);
      }, beat.duration);
    },
    [pushAgentState],
  );

  const startDemo = useCallback(() => {
    // Pause real WS updates during demo
    clearTimeout(demoTimer.current);
    demoRef.current = true;
    setDemoActive(true);
    setDemoBeat(0);
    runDemoBeat(0);
  }, [runDemoBeat]);

  const stopDemo = useCallback(() => {
    demoRef.current = false;
    setDemoActive(false);
    clearTimeout(demoTimer.current);
    // Return to idle if WS isn't providing data
    setAgents(null);
  }, []);

  /* ── WebSocket ── */
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
        // Don't overwrite demo with live WS data while demo is running
        if (demoRef.current) return;

        try {
          let parsed = JSON.parse(data);
          if (!Array.isArray(parsed)) parsed = [parsed];
          pushAgentState(parsed);
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
  }, [pushAgentState]);

  useEffect(() => {
    mounted.current = true;
    connect();
    return () => {
      mounted.current = false;
      clearTimeout(retryTimer.current);
      clearTimeout(demoTimer.current);
      demoRef.current = false;
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

    const monitor =
      agents.find((a) => a.agent_name?.toLowerCase().includes("monitor")) ||
      agents.find((a) => a.agent_name?.toLowerCase().includes("aria")) ||
      agents[0];
    const worker =
      agents.find((a) => a.agent_name?.toLowerCase().includes("worker")) ||
      agents.find((a) => a.agent_name?.toLowerCase().includes("bot")) ||
      agents[1];

    return (
      <div className="dual-agent-stage">
        <AgentCard agent={monitor} variant="monitor" />
        <AgentCard agent={worker} variant="worker" />
      </div>
    );
  };

  /* ── Demo progress ── */
  const demoProgress = demoActive
    ? Math.round(((demoBeat + 1) / DEMO_SCRIPT.length) * 100)
    : 0;

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

          {/* ── Demo Button ── */}
          <div className="demo-control">
            {demoActive ? (
              <>
                {/* Progress bar */}
                <div className="demo-progress-wrap">
                  <div
                    className="demo-progress-bar"
                    style={{ width: `${demoProgress}%` }}
                  />
                </div>
                <span className="demo-beat-label">
                  {demoBeat + 1} / {DEMO_SCRIPT.length}
                </span>
                <button className="demo-btn demo-btn--stop" onClick={stopDemo}>
                  ■ Stop
                </button>
              </>
            ) : (
              <button className="demo-btn demo-btn--start" onClick={startDemo}>
                ▶ Run Demo
              </button>
            )}
          </div>
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
