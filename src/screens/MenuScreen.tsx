import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { useSIWE } from '../lib/web3';

export function MenuScreen() {
  const { startGame, highestScore } = useGameStore();
  const { isSignedIn, address, signIn } = useSIWE();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <motion.h1 
        initial={{ y: -50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.6 }}
        className="glitch-text text-5xl md:text-7xl mb-4"
      >
        MIRRORFEED
      </motion.h1>
      
      <p className="text-white/60 text-sm md:text-base mb-12 tracking-widest uppercase">
        Escape the infinite reflection
      </p>

      {highestScore > 0 && (
        <div className="mb-8 text-cyan-400">
          <span className="opacity-50 text-xs">Best Depth: </span>
          <span className="font-bold">{highestScore}</span>
        </div>
      )}

      <button 
        onClick={startGame}
        className="bg-white text-black px-8 py-4 font-bold text-lg tracking-widest hover:bg-[#ff00ff] hover:text-white transition-colors mb-6 uppercase"
      >
        Initiate Dive
      </button>

      <div className="mt-auto pb-8 w-full flex flex-col items-center gap-4">
        {!isSignedIn ? (
          <button 
            onClick={signIn}
            className="text-xs text-white/50 hover:text-[#00ffff] uppercase tracking-widest border border-white/20 px-6 py-3 hover:border-[#00ffff] transition-colors"
          >
            Connect Base (SIWE)
          </button>
        ) : (
          <div className="text-xs text-[#00ffff] uppercase tracking-widest px-6 py-3 bg-[#00ffff]/10 border border-[#00ffff]/30">
            Identity Verified [{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'ACTIVE'}]
          </div>
        )}
      </div>
    </motion.div>
  );
}
