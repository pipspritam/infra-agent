import React, { useState, useRef, useEffect, useCallback } from "react";

/* ─── Mock API: save admin notes ────────────────────────────────────────────
   Replace with a real call when the backend is ready:
   PATCH /api/incidents/:id  { admin_notes: string }
   → { ok: true } | { ok: false, error: string }
────────────────────────────────────────────────────────────────────────────── */
async function saveAdminNotes(incidentId, notes) {
  await new Promise((r) => setTimeout(r, 600));
  console.log(`[mock] PATCH /api/incidents/${incidentId}`, {
    admin_notes: notes,
  });
  return { ok: true };
}

/* ─── Mock incident data ─────────────────────────────────────────────────────
   Replace fetchIncidents() below with a real REST call when ready.
   GET /api/incidents →
   [{ id, summary, created_at, admin_notes, dialogue: [{agent_name, act, text}] }]
────────────────────────────────────────────────────────────────────────────── */
const MOCK_INCIDENTS = [
  {
    id: "INC-0042",
    summary: "API latency spike on prod cluster — p99 hit 840ms",
    created_at: "2025-07-14T14:38:00Z",
    admin_notes: "Root cause: exhausted DB connection pool. Auto-resolved.",
    dialogue: [
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
        text: "Issue resolved. Signing off!",
      },
      {
        agent_name: "Shail",
        act: "Done",
        text: "All systems green. Great work, DevBot!",
      },
    ],
  },
  {
    id: "INC-0038",
    summary: "Memory leak in order-processing microservice causing OOM crashes",
    created_at: "2025-07-13T09:12:00Z",
    admin_notes: "Patch deployed to v2.4.1. Monitoring stable for 6h.",
    dialogue: [
      {
        agent_name: "Shail",
        act: "Reading",
        text: "OOM killer triggered on order-svc pods — 3 restarts in 10 min",
      },
      {
        agent_name: "Shail",
        act: "Thinking",
        text: "Heap dump suggests event listener accumulation",
      },
      {
        agent_name: "Shail",
        act: "Responding",
        text: "DevBot — analyze heap dump from pod order-svc-7f9b",
      },
      {
        agent_name: "DevBot",
        act: "Reading",
        text: "Fetching heap snapshot now...",
      },
      {
        agent_name: "DevBot",
        act: "Thinking",
        text: "14,000 uncleaned EventEmitter refs. Classic leak pattern.",
      },
      {
        agent_name: "DevBot",
        act: "Responding",
        text: "Identified leak in PaymentCallback module — missing removeListener",
      },
      {
        agent_name: "Shail",
        act: "Responding",
        text: "Rolling back to v2.3.9 while patch is prepared",
      },
      {
        agent_name: "DevBot",
        act: "Done",
        text: "Rollback confirmed, pods stable.",
      },
      {
        agent_name: "Shail",
        act: "Done",
        text: "All order-svc instances healthy. Incident closed.",
      },
    ],
  },
  {
    id: "INC-0031",
    summary: "Cert expiry took down the payments gateway for 4 minutes",
    created_at: "2025-07-10T02:05:00Z",
    admin_notes: "Auto-renewal misconfigured. Cert rotation now automated.",
    dialogue: [
      {
        agent_name: "Shail",
        act: "Reading",
        text: "CRITICAL: payments-gw returning SSL handshake errors!",
      },
      {
        agent_name: "Shail",
        act: "Thinking",
        text: "Checking cert expiry dates...",
      },
      {
        agent_name: "DevBot",
        act: "Reading",
        text: "TLS cert expired 4 minutes ago. Auto-renewal failed.",
      },
      {
        agent_name: "DevBot",
        act: "Responding",
        text: "Issuing emergency cert via Let's Encrypt now...",
      },
      {
        agent_name: "DevBot",
        act: "Thinking",
        text: "Cert issued. Reloading nginx config...",
      },
      {
        agent_name: "Shail",
        act: "Responding",
        text: "Payments endpoint responding — 200 OK confirmed.",
      },
      {
        agent_name: "DevBot",
        act: "Done",
        text: "New cert valid for 90 days. Monitoring clean.",
      },
      {
        agent_name: "Shail",
        act: "Done",
        text: "Post-mortem scheduled for 10:00 UTC. Good catch!",
      },
    ],
  },
  {
    id: "INC-0024",
    summary: "Runaway cron job hammering the analytics DB with 10k QPS",
    created_at: "2025-07-07T18:44:00Z",
    admin_notes: null,
    dialogue: [
      {
        agent_name: "Shail",
        act: "Reading",
        text: "Analytics DB CPU at 99% — query queue backing up badly",
      },
      {
        agent_name: "Shail",
        act: "Thinking",
        text: "pg_stat_activity shows one query looping at 10k/s",
      },
      {
        agent_name: "DevBot",
        act: "Reading",
        text: "Tracing query origin... cron job report-aggregator-v1",
      },
      {
        agent_name: "DevBot",
        act: "Responding",
        text: "Killing runaway process PID 48821",
      },
      {
        agent_name: "Shail",
        act: "Reading",
        text: "DB CPU dropping — 99% → 41% → 12%. Queue clearing!",
      },
      {
        agent_name: "DevBot",
        act: "Done",
        text: "Job terminated. Adding rate-limit guard to cron config.",
      },
      {
        agent_name: "Shail",
        act: "Done",
        text: "Analytics cluster recovered. Cron PR up for review.",
      },
    ],
  },
];

async function fetchIncidents() {
  // 🔌 Swap this mock for a real call:
  // const res = await fetch("/api/incidents");
  // if (!res.ok) throw new Error(`HTTP ${res.status}`);
  // return res.json();
  await new Promise((r) => setTimeout(r, 620));
  return MOCK_INCIDENTS;
}

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
function fmtDate(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* ─── AdminNotes ─────────────────────────────────────────────────────────────── */
function AdminNotes({ incidentId, initialNotes }) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes || "");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | ok | err
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [editing]);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setNotes(initialNotes || "");
    setSaveState("idle");
  };

  async function handleSave() {
    setSaveState("saving");
    try {
      const result = await saveAdminNotes(incidentId, notes);
      setSaveState(result.ok ? "ok" : "err");
    } catch {
      setSaveState("err");
    }
    setTimeout(() => {
      setSaveState("idle");
      setEditing(false);
    }, 1500);
  }

  const isEmpty = !notes?.trim();

  return (
    <div className="incident-notes">
      <div className="incident-notes-header">
        <span className="incident-notes-label">Admin Notes</span>
        <div className="incident-notes-actions">
          {saveState === "ok" && (
            <span className="notes-save-feedback notes-save-feedback--ok">
              ✓ Saved
            </span>
          )}
          {saveState === "err" && (
            <span className="notes-save-feedback notes-save-feedback--err">
              ✗ Error
            </span>
          )}
          {editing ? (
            <>
              <button
                className="notes-action-btn notes-action-btn--cancel"
                onClick={handleCancel}
                disabled={saveState === "saving"}
              >
                Cancel
              </button>
              <button
                className="notes-action-btn notes-action-btn--save"
                onClick={handleSave}
                disabled={saveState === "saving"}
              >
                {saveState === "saving" ? (
                  <span className="replay-spinner" />
                ) : null}
                Save
              </button>
            </>
          ) : (
            !isEmpty && (
              <button className="notes-edit-btn" onClick={handleEdit}>
                Edit
              </button>
            )
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          ref={textareaRef}
          className="notes-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add admin notes…"
        />
      ) : isEmpty ? (
        <button className="notes-empty-btn" onClick={handleEdit}>
          + Add admin note
        </button>
      ) : (
        <span className="incident-notes-text">{notes}</span>
      )}
    </div>
  );
}

/* ─── Incident Card ─────────────────────────────────────────────────────────── */
function IncidentCard({ incident, onReplay, isReplaying }) {
  const [expanded, setExpanded] = useState(false);
  const stepCount = incident.dialogue?.length ?? 0;
  const agentNames = [
    ...new Set((incident.dialogue ?? []).map((d) => d.agent_name)),
  ];

  return (
    <div
      className={`incident-card${isReplaying ? " incident-card--replaying" : ""}`}
    >
      {/* Header row */}
      <div
        className="incident-card-header"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="incident-id-badge">{incident.id}</div>
        <div className="incident-chevron">{expanded ? "▲" : "▼"}</div>
      </div>

      {/* Summary */}
      <div className="incident-summary">{incident.summary}</div>

      {/* Meta row */}
      <div className="incident-meta">
        <span className="incident-date">{fmtDate(incident.created_at)}</span>
        <span className="incident-step-count">{stepCount} steps</span>
      </div>

      {/* Agents row */}
      <div className="incident-agents">
        {agentNames.map((name, i) => (
          <span
            key={i}
            className={`incident-agent-tag incident-agent-tag--${i === 0 ? "monitor" : "worker"}`}
          >
            {name}
          </span>
        ))}
      </div>

      {/* Admin notes — always editable when expanded */}
      {expanded && (
        <AdminNotes
          incidentId={incident.id}
          initialNotes={incident.admin_notes}
        />
      )}

      {/* Dialogue preview (collapsible) */}
      {expanded && (
        <div className="incident-dialogue-preview">
          {(incident.dialogue ?? []).slice(0, 4).map((msg, i) => (
            <div key={i} className="incident-dialogue-line">
              <span
                className={`incident-dialogue-agent incident-dialogue-agent--${i % 2 === 0 ? "monitor" : "worker"}`}
              >
                {msg.agent_name}
              </span>
              <span className="incident-dialogue-act">[{msg.act}]</span>
              <span className="incident-dialogue-text">{msg.text}</span>
            </div>
          ))}
          {stepCount > 4 && (
            <div className="incident-dialogue-more">
              +{stepCount - 4} more steps…
            </div>
          )}
        </div>
      )}

      {/* Replay button */}
      <button
        className={`incident-replay-btn${isReplaying ? " incident-replay-btn--active" : ""}`}
        onClick={() => onReplay(incident)}
        disabled={isReplaying}
        title={
          isReplaying
            ? "Currently replaying this incident"
            : `Replay ${incident.id}`
        }
      >
        {isReplaying ? (
          <>
            <span className="replay-spinner" />
            Replaying…
          </>
        ) : (
          <>▶ Replay Incident</>
        )}
      </button>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function DebugPanel({
  chatHistory,
  onReplayIncident,
  replayingId,
  open = false,
  onClose,
}) {
  const [tab, setTab] = useState("chat");
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const bodyRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (tab !== "history" && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [chatHistory, tab]);

  const loadIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIncidents();
      setIncidents(data);
      setLastFetched(Date.now());
    } catch (err) {
      setError(err.message || "Failed to load incidents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "history" && incidents.length === 0 && !loading) {
      loadIncidents();
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <aside className={`debug-panel${open ? " debug-panel--open" : ""}`}>
      {/* ── Panel header ── */}
      <div className="debug-panel-top">
        <div className="debug-panel-header-row">
          <div className="debug-panel-wordmark">debug console</div>
          {/* Plain × character — reliable across all browsers/bundlers */}
          <button
            className="debug-panel-close-btn"
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close debug panel"
          >
            ×
          </button>
        </div>

        <div
          className="debug-tab-row"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <button
            className={`debug-tab-btn${tab === "chat" ? " active" : ""}`}
            onClick={() => setTab("chat")}
          >
            Chat
            {chatHistory.length > 0 && (
              <span className="debug-tab-count">{chatHistory.length}</span>
            )}
          </button>
          <button
            className={`debug-tab-btn${tab === "history" ? " active" : ""}`}
            onClick={() => setTab("history")}
          >
            History
          </button>
        </div>
      </div>

      {/* ── Chat tab ── */}
      {tab === "chat" && (
        <div ref={bodyRef} className="debug-body">
          {chatHistory.length === 0 ? (
            <div className="debug-empty-state">
              <div className="debug-empty-icon">💬</div>
              <div className="debug-empty-text">Awaiting messages</div>
            </div>
          ) : (
            chatHistory.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.slot}`}>
                <div className="chat-msg-label">
                  {msg.agent}
                  <span className="chat-msg-time">
                    {fmtTime(msg.timestamp)}
                  </span>
                </div>
                <div className="chat-msg-body">{msg.text}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── History tab ── */}
      {tab === "history" && (
        <div className="debug-body" ref={bodyRef}>
          <div className="history-toolbar">
            <span className="history-title">Incident Log</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {lastFetched && !loading && (
                <span className="history-last-fetch">
                  {fmtTime(lastFetched)}
                </span>
              )}
              <button
                className={`history-refresh-btn${loading ? " history-refresh-btn--loading" : ""}`}
                onClick={loadIncidents}
                disabled={loading}
                title="Refresh incident list"
              >
                {loading ? <span className="replay-spinner" /> : "↻"} Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="history-error">
              <span>⚠ {error}</span>
              <button className="history-retry-btn" onClick={loadIncidents}>
                Retry
              </button>
            </div>
          )}

          {loading && incidents.length === 0 && (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="incident-skeleton">
                  <div className="skeleton-line skeleton-line--short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line skeleton-line--med" />
                </div>
              ))}
            </>
          )}

          {!loading && !error && incidents.length === 0 && (
            <div className="debug-empty-state">
              <div className="debug-empty-icon">📋</div>
              <div className="debug-empty-text">No incidents found</div>
            </div>
          )}

          {incidents.map((inc) => (
            <IncidentCard
              key={inc.id}
              incident={inc}
              onReplay={onReplayIncident}
              isReplaying={replayingId === inc.id}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
