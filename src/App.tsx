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
  const [gmFeedback, setGmFeedback] = useState<string>('');

  const sendGMTransaction = async () => {
    if (!isConnected) return;
    try {
      setIsSending(true);
      setGmFeedback('Broadcasting (200ms Denim block)...');
      sendTransaction({
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
        value: 0n,
      }, {
        onSuccess: (hash) => {
          setGmFeedback(`Confirmed in Denim! ${hash.slice(0, 6)}...`);
          setTimeout(() => setGmFeedback(''), 4000);
        },
        onError: () => {
          setGmFeedback('GM failed');
          setTimeout(() => setGmFeedback(''), 3000);
        },
        onSettled: () => {
          setIsSending(false);
        }
      });
    } catch (e) {
      console.error(e);
      setIsSending(false);
      setGmFeedback('Error');
      setTimeout(() => setGmFeedback(''), 3000);
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
        <div className="absolute top-4 right-4 z-50 flex flex-col items-end">
          <button 
            onClick={sendGMTransaction}
            disabled={isSending}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun className="w-4 h-4" />
            {isSending ? 'Sending...' : 'Say GM'}
          </button>
          {gmFeedback && (
            <div className="text-[10px] text-[#E8A020] mt-1 font-mono tracking-tight bg-black/60 px-2 py-0.5 rounded border border-[#E8A020]/30">
              {gmFeedback}
            </div>
          )}
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
