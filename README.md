# MirrorFeed

A surreal, mind-bending endless runner + reflection puzzle game built on Base Mainnet.

## Overview
**MirrorFeed** is a mobile-first side-scrolling endless runner where you play as a "Mirror Entity" trapped inside an infinite digital mirror realm. The game utilizes on-chain actions for a hybrid leaderboard and player attribution.

## Features
- **Mirror Shift**: Tap to flip between the Real and Mirror side of the world, dodging obstacles and discovering fragmented memories.
- **Reflection Orbs**: Collect fragments of reality and stack massive multipliers.
- **On-Chain Recording**: Uses ERC-8021 and ERC-8004 concepts to record deepest runs and biggest reflection scores trustlessly on Base.
- **Dodge Distortions**: Avoid "Distortions" and "Glitches" to prevent the feed from completely corrupting.
- **MCP API**: Includes an MCP server endpoint for "Mirror Feed Orchestrator" agent to perform feed-mirroring and content aggregation.

## Development Stack
This project uses Vite, React, Tailwind CSS, Canvas API, and Framer Motion for the frontend, and Express for the backend (providing MCP and Agent APIs).

- React 19 + Vite
- Zustand for state management
- Wagmi & Viem for Web3/Base connection

## Running Locally
Ensure you have Node.js installed, then execute:

```sh
npm install
npm run dev
```

You can find the Agent configuration at `/.well-known/agent-card.json`.
