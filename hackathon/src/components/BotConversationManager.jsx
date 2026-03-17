import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * BotConversationManager — Manages the conversation flow between two bots
 *
 * Logic:
 * 1. Monitoring bot always comes first when a message arrives
 * 2. When a worker bot joins, both are visible
 * 3. When both reach "Done", reset to idle
 * 4. Max 2 bots on screen
 */

export default function BotConversationManager({ agents, isEntering }) {
  const [displayedBots, setDisplayedBots] = useState([]); // Array of bot objects with timing info
  const [zoomTarget, setZoomTarget] = useState(null); // "cubicle-1", "cubicle-2", etc
  const botTimerRef = useRef(null);

  useEffect(() => {
    if (!agents || agents.length === 0) {
      // No agents - reset to idle
      setDisplayedBots([]);
      setZoomTarget(null);
      return;
    }

    // Organize bots: Monitoring bot should always be first/left
    const sortedAgents = agents.slice().sort((a, b) => {
      const aIsMonitor = a.agent_name?.toLowerCase().includes("monitor");
      const bIsMonitor = b.agent_name?.toLowerCase().includes("monitor");
      if (aIsMonitor && !bIsMonitor) return -1;
      if (!aIsMonitor && bIsMonitor) return 1;
      return 0;
    });

    // Check if both bots are done
    const allDone = sortedAgents.every((a) => a.act === "Done");
    if (allDone && displayedBots.length > 0) {
      // Fade out and reset after a delay
      const timer = setTimeout(() => {
        setDisplayedBots([]);
        setZoomTarget(null);
      }, 1500);
      return () => clearTimeout(timer);
    }

    // Update displayed bots with entrance tracking
    setDisplayedBots((prev) => {
      return sortedAgents.map((agent, idx) => {
        const existing = prev.find((b) => b.agent_name === agent.agent_name);
        return {
          ...agent,
          side: idx === 0 ? "left" : "right",
          enteredAt: existing?.enteredAt || Date.now(),
          isNew: !existing,
        };
      });
    });

    // Set zoom target to a cubicle based on first bot
    setZoomTarget(`cubicle-${sortedAgents[0].agent_name?.charCodeAt(0) % 3}`);
  }, [agents]);

  return {
    displayedBots,
    zoomTarget,
  };
}
