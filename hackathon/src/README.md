# AI Agent Monitor v2

Dark-theme, vector-style React frontend visualizing two AI agents in real time.

## Quick Start

```bash
npm install
npm start
# → http://localhost:3000
```

## WebSocket Format

Connects to: `ws://192.168.0.109:8000/ws/state`

Expected message — **array of 2 agent dicts**:

```json
[
  { "agent_name": "Monitor", "act": "Reading",    "text": "Scanning metrics..." },
  { "agent_name": "Worker",  "act": "Responding", "text": "Task completed!"    }
]
```

**Fallback**: single object `{ agent_name, act, text }` also accepted.

If WebSocket fails, **Demo Mode** auto-starts and cycles through all 4 states.

## Activity States

| `act`        | Monitor animation    | Worker animation   |
|--------------|----------------------|--------------------|
| `Idle`       | Gentle float         | Gentle float       |
| `Reading`    | Lean + glasses on    | Lean + clipboard   |
| `Thinking`   | Head tilt + bubbles  | Brow furrow + gears|
| `Responding` | Bounce + headset     | Bounce + earpiece  |

## File Structure

```
src/
  App.js          — WebSocket, state, layout
  AgentCard.js    — SVG characters + bubbles + animations
  DebugPanel.js   — Right-side live log panel
  styles.css      — Full design system
  index.js        — Entry point
public/
  index.html
```

## Layout

- **Desktop (>900px)**: Agents side-by-side left, debug panel fixed right
- **Tablet (≤900px)**: Agents on top, debug panel collapses to bottom strip
- **Mobile (≤580px)**: Agents stack vertically
