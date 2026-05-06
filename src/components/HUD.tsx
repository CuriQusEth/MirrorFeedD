import { useGameStore } from '../store/gameStore';

export function HUD() {
  const { score, multiplier, distance, gameState } = useGameStore();

  if (gameState !== 'PLAYING') return null;

  return (
    <div className="absolute top-0 left-0 w-full p-8 pointer-events-none flex justify-between z-10 text-white font-sans uppercase tracking-widest text-sm">
      <div className="flex flex-col">
        <div className="on-chain-badge">BASE MAINNET ACTIVE</div>
        <div className="chain-box mt-4">
          <span className="text-cyan-400 text-xs opacity-60">DISTANCE</span>
          <span className="text-3xl font-bold block">{Math.floor(distance)}m</span>
          <div className="mt-2 text-[10px] text-cyan-400/50 max-w-[150px] leading-tight normal-case font-mono">
            ERC-8004 TRUSTLESS AGENT<br/>ACTIVE: [bc_3ecvuvrh]
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-right mb-6">
          <span className="text-[#ff00ff] text-xs opacity-60 block mb-1">VIRAL MULTIPLIER</span>
          <span className="text-3xl font-bold text-white block">x{multiplier.toFixed(2)}</span>
        </div>
        <div className="text-right">
          <span className="text-cyan-400 text-xs opacity-60 block mb-1">FRAGMENT RECOVERY</span>
          <span className="text-2xl font-bold text-white block">{Math.floor(score)}</span>
        </div>
      </div>
    </div>
  );
}
