import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const SPEED_INITIAL = 6;

export function GameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  const { gameState, isMirrored, shiftMirror, addScore, increaseDistance, endGame } = useGameStore();

  const gameStateRef = useRef({
    player: { x: 100, y: 0, velocityY: 0, width: 30, height: 30, isJumping: false },
    obstacles: [] as { x: number, y: number, width: number, height: number, type: 'glitch' | 'block', isMirrored: boolean }[],
    orbs: [] as { x: number, y: number, radius: number, isMirrored: boolean, collected: boolean }[],
    speed: SPEED_INITIAL,
    frame: 0
  });

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset local state on start
    const state = gameStateRef.current;
    state.player.y = canvas.height / 4; // Start in top realm
    state.player.velocityY = 0;
    state.obstacles = [];
    state.orbs = [];
    state.speed = SPEED_INITIAL;
    state.frame = 0;

    const gameLoop = () => {
      update(canvas);
      draw(ctx, canvas);
      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  const update = (canvas: HTMLCanvasElement) => {
    const state = gameStateRef.current;
    state.frame++;
    
    // Difficulty scaling
    if (state.frame % 600 === 0) state.speed += 0.5;
    
    increaseDistance(state.speed / 10);

    // Player logic
    const player = state.player;
    const isMirroredRealm = useGameStore.getState().isMirrored;
    
    // Gravity direction based on mirror realm
    const gravityForce = isMirroredRealm ? -GRAVITY : GRAVITY;
    const groundY = isMirroredRealm ? canvas.height : canvas.height / 2;
    const ceilY = isMirroredRealm ? canvas.height / 2 : 0;

    player.velocityY += gravityForce;
    player.y += player.velocityY;

    // Ground/Ceiling collision
    if (!isMirroredRealm) {
      if (player.y + player.height > canvas.height / 2) {
        player.y = canvas.height / 2 - player.height;
        player.velocityY = 0;
        player.isJumping = false;
      }
    } else {
      if (player.y < canvas.height / 2) {
        player.y = canvas.height / 2;
        player.velocityY = 0;
        player.isJumping = false;
      }
    }

    // Wrap-around or bounds keeping
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;

    // Generate Obstacles & Orbs
    if (state.frame % Math.floor(Math.random() * 60 + 60) === 0) {
      const inMirror = Math.random() > 0.5;
      const type = Math.random() > 0.8 ? 'glitch' : 'block';
      state.obstacles.push({
        x: canvas.width,
        y: inMirror ? canvas.height - 40 : canvas.height / 2 - 40,
        width: type === 'glitch' ? 30 : 40,
        height: 40,
        type,
        isMirrored: inMirror
      });
    }

    if (state.frame % Math.floor(Math.random() * 40 + 40) === 0) {
      const inMirror = Math.random() > 0.5;
      state.orbs.push({
        x: canvas.width,
        y: inMirror ? canvas.height - 80 - Math.random() * 40 : canvas.height / 2 - 80 - Math.random() * 40,
        radius: 12,
        isMirrored: inMirror,
        collected: false
      });
    }

    // Update Entities
    state.obstacles.forEach(obs => {
      obs.x -= state.speed;
      // Collision
      if (
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y
      ) {
        if (obs.type === 'glitch') {
          useGameStore.getState().setCorrupted(true);
        } else {
          // Game Over (hitting wall) if in same realm, or if we don't allow passing harmlessly
          if (isMirroredRealm === obs.isMirrored) {
             useGameStore.getState().endGame();
          }
        }
      }
    });

    state.orbs.forEach(orb => {
      if (!orb.collected) {
        orb.x -= state.speed;
        // Collect
        if (
          player.x < orb.x + orb.radius &&
          player.x + player.width > orb.x - orb.radius &&
          player.y < orb.y + orb.radius &&
          player.y + player.height > orb.y - orb.radius
        ) {
          if (isMirroredRealm === orb.isMirrored) {
             orb.collected = true;
             addScore(100);
          }
        }
      }
    });

    // Cleanup
    state.obstacles = state.obstacles.filter(o => o.x + o.width > 0);
    state.orbs = state.orbs.filter(o => o.x + o.radius > 0 && !o.collected);
  };

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const state = gameStateRef.current;
    const store = useGameStore.getState();
    const midY = canvas.height / 2;

    // Backgrounds
    ctx.fillStyle = store.isCorrupted ? '#1a0515' : '#0a0a0c';
    ctx.fillRect(0, 0, canvas.width, midY); // Real
    
    ctx.fillStyle = store.isCorrupted ? '#15051a' : '#050a12';
    ctx.fillRect(0, midY, canvas.width, midY); // Mirror

    // Distortions if corrupted
    if (store.isCorrupted) {
      if (Math.random() > 0.8) {
         ctx.fillStyle = `rgba(255, 0, 255, 0.1)`;
         ctx.fillRect(Math.random() * canvas.width, 0, 100, canvas.height);
      }
    }

    // The Mirror Line (Midline)
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(canvas.width, midY);
    ctx.lineWidth = 4;
    ctx.strokeStyle = store.isMirrored ? '#00ffff' : '#ff00ff';
    ctx.stroke();

    // Draw Orbs
    state.orbs.forEach(orb => {
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fillStyle = orb.isMirrored ? '#00ffff' : '#ff00ff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Obstacles
    state.obstacles.forEach(obs => {
      if (obs.type === 'glitch') {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        ctx.filter = `blur(${Math.random() * 2}px)`;
      } else {
        ctx.fillStyle = obs.isMirrored ? '#005555' : '#550055';
      }
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.filter = 'none';
      
      // Outline for non-glitch
      if (obs.type === 'block') {
         ctx.strokeStyle = obs.isMirrored ? '#00ffff' : '#ff00ff';
         ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      }
    });

    // Draw Player
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffffff';
    ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);
    ctx.shadowBlur = 0;
    
    // Draw "Echo" of player on the opposite side
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    const echoY = state.player.y < midY 
       ? canvas.height - state.player.y - state.player.height 
       : canvas.height - state.player.y - state.player.height;
    ctx.fillRect(state.player.x, echoY, state.player.width, state.player.height);

  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      const state = gameStateRef.current;
      
      if (e.code === 'Space') {
        if (!state.player.isJumping) {
          state.player.velocityY = useGameStore.getState().isMirrored ? -JUMP_FORCE : JUMP_FORCE;
          state.player.isJumping = true;
        }
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
         shiftMirror();
         // Pop out interaction slightly
         state.player.velocityY = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, shiftMirror]);

  // Touch logic (Swipe to jump, Tap to mirror)
  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || gameState !== 'PLAYING') return;
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStartRef.current.x;
    const dy = touchEnd.y - touchStartRef.current.y;
    
    // Swipe detection (jump) vs Tap (mirror)
    if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx)) {
        // Swipe
        const state = gameStateRef.current;
        if (!state.player.isJumping) {
          state.player.velocityY = useGameStore.getState().isMirrored ? -JUMP_FORCE : JUMP_FORCE;
          state.player.isJumping = true;
        }
    } else if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        // Tap
        shiftMirror();
        gameStateRef.current.player.velocityY = 0;
    }
  };


  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      className={`absolute inset-0 z-0 ${gameState !== 'PLAYING' ? 'opacity-30' : 'opacity-100'} transition-opacity duration-1000`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
}
