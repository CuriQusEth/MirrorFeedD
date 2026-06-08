/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { GameEngine } from './game/GameEngine';
import { MenuScreen } from './screens/MenuScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { HUD } from './components/HUD';
import { useGameStore } from './store/gameStore';
import { Web3Provider, useSIWE } from './lib/web3';
import { useAccount, useSendTransaction } from 'wagmi';
import { AnimatePresence } from 'motion/react';
import { Sun } from 'lucide-react';

function AppContent() {
  const { gameState } = useGameStore();
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const [isSending, setIsSending] = useState(false);

  const sendGMTransaction = async () => {
    if (!isConnected) return;
    try {
      setIsSending(true);
      sendTransaction({
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
        value: 0n,
        // Optional calibration payload or ERC-8021 tracking if we want down the line
      }, {
        onSuccess: (hash) => {
          console.log('GM said! Tx:', hash);
        },
        onSettled: () => {
          setIsSending(false);
        }
      });
    } catch (e) {
      console.error(e);
      setIsSending(false);
    }
  };

  return (
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
      <div className="scanlines mix-blend-overlay opacity-40 pointer-events-none" />
      {gameState === 'MENU' && <div className="distorted-bg pointer-events-none">FEED</div>}

      {/* Say GM Button */}
      {isConnected && (
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={sendGMTransaction}
            disabled={isSending}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun className="w-4 h-4" />
            {isSending ? 'Sending...' : 'Say GM'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}
