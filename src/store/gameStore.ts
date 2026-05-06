import { create } from 'zustand';

interface GameState {
  score: number;
  multiplier: number;
  distance: number;
  isMirrored: boolean;
  isCorrupted: boolean;
  gameState: 'MENU' | 'PLAYING' | 'GAMEOVER';
  highestScore: number;
  
  startGame: () => void;
  endGame: () => void;
  shiftMirror: () => void;
  addScore: (points: number) => void;
  increaseDistance: (amount: number) => void;
  setCorrupted: (corrupted: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  multiplier: 1,
  distance: 0,
  isMirrored: false,
  isCorrupted: false,
  gameState: 'MENU',
  highestScore: parseInt(localStorage.getItem('highestScore') || '0', 10),

  startGame: () => set({ gameState: 'PLAYING', score: 0, distance: 0, multiplier: 1, isMirrored: false, isCorrupted: false }),
  endGame: () => set((state) => {
    const newHighest = Math.max(state.highestScore, state.score);
    localStorage.setItem('highestScore', newHighest.toString());
    return { gameState: 'GAMEOVER', highestScore: newHighest };
  }),
  shiftMirror: () => set((state) => ({ isMirrored: !state.isMirrored })),
  addScore: (points) => set((state) => {
    const newScore = state.score + (points * state.multiplier);
    return { score: newScore, multiplier: Math.min(state.multiplier + 0.1, 5) };
  }),
  increaseDistance: (amount) => set((state) => ({ distance: state.distance + amount })),
  setCorrupted: (corrupted) => set({ isCorrupted: corrupted }),
  resetGame: () => set({ score: 0, distance: 0, multiplier: 1, isMirrored: false, isCorrupted: false, gameState: 'MENU' })
}));
