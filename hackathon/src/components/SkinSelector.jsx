import React from "react";
import RobotSVG from "./RobotSVG";

const SKINS = [
  {
    id: 0,
    label: "HELIX",
    subtitle: "Classic",
    bg: "#F4EED8",
    border: "#C8C0A8",
  },
  {
    id: 1,
    label: "PIXEL",
    subtitle: "8-Bit",
    bg: "#1A1A2E",
    border: "#60A5FA",
  },
  { id: 2, label: "CHIBI", subtitle: "Soft", bg: "#F0F4FF", border: "#BFDBFE" },
  {
    id: 3,
    label: "MECH",
    subtitle: "Industrial",
    bg: "#1C2432",
    border: "#38BDF8",
  },
  {
    id: 4,
    label: "GHOST",
    subtitle: "Spectral",
    bg: "#0D1117",
    border: "rgba(59,130,246,0.5)",
  },
  {
    id: 5,
    label: "SLEEK",
    subtitle: "Modern",
    bg: "#F8FAFC",
    border: "#E2E8F0",
  },
];

export default function SkinSelector({
  currentSkin,
  onSelect,
  open,
  onToggle,
}) {
  return (
    <div style={{ position: "relative" }} data-skin-selector="true">
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "5px 8px 5px 8px",
          background: open ? "var(--ink-0)" : "var(--cream-1)",
          color: open ? "var(--cream-2)" : "var(--ink-3)",
          border: `1.5px solid ${open ? "var(--ink-0)" : "var(--cream-4)"}`,
          borderRadius: 6,
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "8px",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          transition: "all 0.18s ease",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            borderRadius: 4,
            background: SKINS[currentSkin]?.bg || "#fff",
            border: `1px solid ${SKINS[currentSkin]?.border || "#ccc"}`,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <span style={{ display: "block", marginTop: 8, marginLeft: -2 }}>
            <RobotSVG
              act="Idle"
              accentColor="#2A5F8F"
              size={28}
              skin={currentSkin}
            />
          </span>
        </span>
        <span>Robot Style</span>
        <span style={{ opacity: 0.5, fontSize: 9, marginLeft: 2 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <>
          <div
            onClick={onToggle}
            style={{ position: "fixed", inset: 0, zIndex: 98 }}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              background: "var(--cream-0)",
              border: "1.5px solid var(--cream-3)",
              borderRadius: 14,
              padding: "12px 10px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              zIndex: 99,
              boxShadow:
                "0 12px 40px rgba(28,26,22,0.18), 0 2px 8px rgba(28,26,22,0.08)",
              // Increased width to fit 8 skins (approx 75px per skin)
              minWidth: 600,
              animation: "skin-drop 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-4)",
                paddingLeft: 2,
              }}
            >
              Select Robot Design
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
              {SKINS.map((s) => {
                const isActive = currentSkin === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelect(s.id);
                      onToggle();
                    }}
                    style={{
                      flex: 1,
                      background: isActive
                        ? "var(--cream-2)"
                        : "var(--cream-1)",
                      border: `1.5px solid ${
                        isActive ? "var(--blue)" : "var(--cream-3)"
                      }`,
                      borderRadius: 10,
                      padding: "8px 4px 7px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0,
                      transition: "all 0.15s ease",
                      position: "relative",
                      outline: "none",
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--blue)",
                        }}
                      />
                    )}

                    <div
                      style={{
                        width: 64,
                        height: 82,
                        borderRadius: 8,
                        background: s.bg,
                        border: `1px solid ${s.border}`,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        paddingBottom: 4,
                        marginBottom: 4,
                        flexShrink: 0,
                        overflow: "visible",
                        position: "relative",
                      }}
                    >
                      <div style={{ overflow: "visible", display: "flex" }}>
                        <RobotSVG
                          act="Idle"
                          accentColor="#2A5F8F"
                          size={50}
                          skin={s.id}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 8.5,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        color: isActive ? "var(--blue)" : "var(--ink-1)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 7.5,
                        color: "var(--ink-4)",
                        letterSpacing: "0.04em",
                        marginTop: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
