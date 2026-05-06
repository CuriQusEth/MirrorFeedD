/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { GameEngine } from './game/GameEngine';
import { MenuScreen } from './screens/MenuScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { HUD } from './components/HUD';
import { useGameStore } from './store/gameStore';
import { Web3Provider } from './lib/web3';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const { gameState } = useGameStore();

  return (
    <Web3Provider>
      <div className="relative w-full h-[100dvh] bg-[#050505] overflow-hidden font-sans select-none">
        {/* The Game Engine runs continuously, but handles pause/reset internally via Zustand */}
        <GameEngine />
        
        {/* HUD is visible when playing */}
        <HUD />

        {/* UI Overlay Management */}
        <AnimatePresence mode="wait">
          {gameState === 'MENU' && <MenuScreen key="menu" />}
          {gameState === 'GAMEOVER' && <GameOverScreen key="gameover" />}
        </AnimatePresence>

        {/* CSS for Scanlines and Glitch Effects */}
        <div className="scanlines mix-blend-overlay opacity-40" />
        {gameState === 'MENU' && <div className="distorted-bg">FEED</div>}
      </div>
    </Web3Provider>
  );
}
