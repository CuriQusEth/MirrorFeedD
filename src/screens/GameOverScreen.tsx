import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { useSIWE } from '../lib/web3';
import { useSendTransaction, useAccount } from 'wagmi';
import { toHex } from 'viem';
import { getTransactionAttributionCode } from '../lib/erc8021';
import { Sun } from 'lucide-react';

export function GameOverScreen() {
  const { score, distance, resetGame, startGame } = useGameStore();
  const { isSignedIn } = useSIWE();
  const { isConnected, address } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const [txStatus, setTxStatus] = useState<string>('');

  const [gmStatus, setGmStatus] = useState<string>('');

  const sendGMTransaction = async () => {
    if (!isSignedIn || !isConnected) return;
    try {
      setGmStatus('Broadcasting GM to Denim...');
      sendTransaction({
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
        value: 0n,
      }, {
        onSuccess(hash) {
          setGmStatus(`GM confirmed in 200ms Denim block! Tx: ${hash.slice(0, 8)}...`);
        },
        onError(err) {
          setGmStatus('GM Tx failed');
          console.error(err);
        }
      });
    } catch (e) {
      setGmStatus('GM failed');
      console.error(e);
    }
  };

  const handleOnChainRecord = async () => {
    if (!isSignedIn || !isConnected) {
      alert("Please connect your wallet in the main menu first.");
      return;
    }

    try {
      setTxStatus('Broadcasting to Base Denim (200ms blocks)...');
      const attributionStr = getTransactionAttributionCode();
      const calldataHex = toHex(attributionStr);

      sendTransaction({
        to: address || '0x0000000000000000000000000000000000000000',
        value: 0n,
        data: calldataHex
      }, {
        onSuccess(hash) {
          setTxStatus(`Confirmed in Denim 200ms block! Tx: ${hash.slice(0, 8)}...`);
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
            <div className="flex flex-col gap-3 mt-2 w-full">
              <button 
                onClick={sendGMTransaction}
                className="w-full px-3 py-3 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center justify-center gap-2 font-['Cinzel'] text-xs font-bold"
              >
                <Sun className="w-4 h-4" />
                Say GM
              </button>
              {gmStatus && <span className="text-[10px] text-[#E8A020] -mt-1">{gmStatus}</span>}

              <button 
                onClick={handleOnChainRecord}
                className="w-full bg-[#ff00ff]/20 border border-[#ff00ff] text-white hover:bg-[#ff00ff] font-bold uppercase tracking-widest px-6 py-4 transition-all relative text-xs"
              >
                Record This Reflection on-chain
              </button>
              {txStatus && <span className="text-[10px] text-cyan-300 -mt-1">{txStatus}</span>}
              <div className="text-[9px] text-white/40 tracking-wider">
                BASE DENIM MAINNET • 200MS CANONICAL BLOCKS
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
