import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { useSIWE } from '../lib/web3';
import { useSendTransaction, useAccount } from 'wagmi';
import { toHex } from 'viem';
import { getTransactionAttributionCode } from '../lib/erc8021';

export function GameOverScreen() {
  const { score, distance, resetGame, startGame } = useGameStore();
  const { isSignedIn } = useSIWE();
  const { isConnected, address } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const [txStatus, setTxStatus] = useState<string>('');

  const handleOnChainRecord = async () => {
    if (!isSignedIn || !isConnected) {
      alert("Please connect your wallet in the main menu first.");
      return;
    }

    try {
      setTxStatus('Awaiting wallet...');
      const attributionStr = getTransactionAttributionCode();
      const calldataHex = toHex(attributionStr);

      // This is a stubbed "Say GM" or "Record Reflection" transaction
      // It sends 0 ETH to the user themselves just to include the calldata.
      sendTransaction({
        to: address || '0x0000000000000000000000000000000000000000', // Self for simple data recording
        value: 0n,
        data: calldataHex
      }, {
        onSuccess(hash) {
          setTxStatus(`Recorded! Tx: ${hash.slice(0, 8)}...`);
        },
        onError(error) {
          setTxStatus('Tx Failed! See console.');
          console.error('Tx Error:', error);
        }
      });
    } catch (e) {
      setTxStatus('Tx Failed!');
      console.error(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
      animate={{ opacity: 1, backdropFilter: 'blur(10px)' }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center select-none bg-black/80"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border border-[#ff00ff]/50 bg-[#1a0b16]/80 p-8 flex flex-col items-center max-w-sm w-full"
      >
        <h2 className="glitch-text text-3xl md:text-5xl mb-6">
          OVERLOAD
        </h2>
        
        <div className="grid grid-cols-2 gap-8 my-8 text-left w-full">
          <div>
            <div className="text-cyan-400 text-xs opacity-60 mb-1 uppercase tracking-widest">Depth Reached</div>
            <div className="text-3xl font-bold text-white">{Math.floor(distance)}m</div>
          </div>
          <div>
             <div className="text-[#ff00ff] text-xs opacity-60 mb-1 uppercase tracking-widest">Reflections</div>
             <div className="text-3xl font-bold text-white">{Math.floor(score)}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full mt-4">
          <button 
            onClick={startGame}
            className="w-full bg-white text-black font-bold uppercase tracking-widest px-6 py-4 hover:bg-[#00ffff] transition-colors"
          >
            Dive Again
          </button>
          
          <button 
            onClick={resetGame}
            className="w-full border border-white/30 text-white hover:border-[#ff00ff] uppercase tracking-widest px-6 py-4 transition-colors"
          >
            Return to Nexus
          </button>

          {isSignedIn && (
             <button 
               onClick={handleOnChainRecord}
               className="mt-4 w-full bg-[#ff00ff]/20 border border-[#ff00ff] text-white hover:bg-[#ff00ff] font-bold uppercase tracking-widest px-6 py-4 transition-all relative"
             >
               Record On-Chain
               {txStatus && <span className="block mt-2 text-[10px] opacity-80">{txStatus}</span>}
             </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
