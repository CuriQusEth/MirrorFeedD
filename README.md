# MirrorFeed

A surreal, mind-bending endless runner + reflection puzzle game built on Base Mainnet.

## Overview
**MirrorFeed** is a mobile-first side-scrolling endless runner where you play as a "Mirror Entity" trapped inside an infinite digital mirror realm. The game utilizes on-chain actions for a hybrid leaderboard and player attribution.

## Features
- **Mirror Shift**: Tap to flip between the Real and Mirror side of the world, dodging obstacles and discovering fragmented memories.
- **Reflection Orbs**: Collect fragments of reality and stack massive multipliers.
- **On-Chain Recording**: Uses ERC-8021 and ERC-8004 concepts to record deepest runs and biggest reflection scores trustlessly on Base.
- **Dodge Distortions**: Avoid "Distortions" and "Glitches" to prevent the feed from completely corrupting.
- **Platform Agent**: Incorporates the **Mirror Feed Orchestrator** AI Agent handling feed mirroring, content aggregation, and syndication.

## Technical Stack
- **Frontend**: Next.js (App Router compliant) / React, Tailwind CSS, Canvas API, Framer Motion
- **Web3**: Wagmi & Viem configured for Base Mainnet
- **State Management**: Zustand
- **Agent Integration**: Model Context Protocol (MCP) compatible endpoints

## Orchestrator Agent & MCP

The **Mirror Feed Orchestrator** is an ERC-8004 compatible AI Agent that handles real-time distribution and multi-source management.

- **Agent Card**: Served at `/.well-known/agent-card.json`
- **Agent API**: Available at `/api/agent` (Next.js App Router format)
- **MCP Endpoint**: Available at `/api/mcp` (Next.js App Router format)

### MCP Capabilities
The agent's MCP interface exposes tools to interact with the game feed directly:
- `get_race_status`
- `start_race`
- `get_leaderboard`
- `optimize_speed`
- `get_track_info`

## Running Locally

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run the development server:
   ```sh
   npm run dev
   ```
3. Check the Agent registration at `http://localhost:3000/.well-known/agent-card.json`.

---
*Note: Ensure your wallet is connected to Base Mainnet to interact with on-chain mechanics.*
