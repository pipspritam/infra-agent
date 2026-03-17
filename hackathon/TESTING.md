# Testing the Multi-Agent Conversation System

## Quick Start

1. **Start Mock Mode**: Click the **🎭 Mock Mode** button in the top-right corner of the app
2. **Watch Conversation**: You'll see:
   - Office view zooms smoothly into a cubicle
   - "Aria" (monitor bot, blue) receives an alert
   - "Bolt" (worker bot, sage) joins and analyzes the issue
   - Both bots interact with realistic conversation flow
   - Scene zooms back out when complete

## What to Look For

✅ **Smooth Animations**
- Office zooms in/out with spring easing (looks bouncy and natural)
- Agent cards fade in with staggered timing
- Robots bobbing gently while talking

✅ **Realistic Conversation**
- Aria gets alert → Bolt thinks → Bolt responds → Aria confirms → Both done
- Messages appear in Debug Panel Chat tab

✅ **Texas Instruments Branding**
- Red "Instruments" text at top of cubicle view
- Professional, warm aesthetic

✅ **Robot Personalities**
- Aria: sleek, visor eyes, antenna (monitoring role)
- Bolt: chunky, hard-hat, warm colors (fixing role)
- Cute expressive faces matching their actions

✅ **Max 2 Agents**
- Only two robots visible at once
- Proper positioning (left/right)

✅ **Debug Panel**
- Chat tab shows all messages with timestamps
- JSON tab shows raw message data

## Mock Mode Toggle

- **Inactive (🎭 Mock Mode)**: WebSocket connection active
- **Active (📺 Mock ON)**: Fires 6-message conversation with 2.5s delays

## Keyboard Test

Try these during mock mode:
- Click mock button again to stop (resets to office idle)
- Open DevTools (F12) Console to see any errors
- Watch Debug Panel update in real-time

## Real WebSocket

When WebSocket is connected:
1. Messages arrive as JSON from server
2. First agent = monitor (left)
3. Second agent joins = worker (right)
4. When both have act="Done", scene exits
