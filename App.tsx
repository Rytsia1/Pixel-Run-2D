import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dinosaur } from './components/Dinosaur';
import ObstacleComponent from './components/Obstacle';
import Scoreboard from './components/Scoreboard';
import GameMessageScreen from './components/GameMessageScreen';
import Background from './components/Background';
import DustCloud from './components/DustCloud';
import StaminaBar from './components/StaminaBar';
import HealthBar from './components/HealthBar';
import PowerUpComponent from './components/PowerUp';
import ProjectileComponent from './components/Projectile';
import { PlayerState, Obstacle, GameStatus, DustCloudData, PowerUp, Projectile, PowerUpType } from './types';
import { createObstacle } from './services/obstacleFactory';
import { createPowerUp } from './services/powerUpFactory';
import {
  GAME_WIDTH, GAME_HEIGHT, GROUND_Y, PLAYER_WIDTH, PLAYER_HEIGHT,
  PLAYER_INITIAL_Y, JUMP_STRENGTH, GRAVITY, OBSTACLE_SPEED,
  OBSTACLE_SPAWN_INTERVAL_MIN, OBSTACLE_SPAWN_INTERVAL_MAX,
  SCORE_INCREMENT_INTERVAL, SCORE_POINTS_PER_INCREMENT, PLAYER_X_POSITION,
  CLOUD_SPEED, MOUNTAIN_SPEED, MAX_STAMINA, STAMINA_DEPLETION_RATE,
  STAMINA_REGEN_RATE, SPRINT_SPEED_MULTIPLIER, PLAYER_MAX_HEALTH, PLAYER_INVINCIBILITY_ON_HIT_DURATION,
  POWERUP_SPAWN_INTERVAL_MIN, POWERUP_SPAWN_INTERVAL_MAX, POWERUP_INVINCIBILITY_DURATION, POWERUP_SCORE_MULTIPLIER_DURATION,
  POWERUP_SCORE_MULTIPLIER, POWERUP_AMMO_AMOUNT, PROJECTILE_SPEED, PROJECTILE_WIDTH, PROJECTILE_HEIGHT
} from './constants';

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [player, setPlayer] = useState<PlayerState>({
    y: PLAYER_INITIAL_Y,
    vy: 0,
    isJumping: false,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    health: PLAYER_MAX_HEALTH,
    ammo: 0,
    invincibilityEndTime: 0,
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const savedHighScore = localStorage.getItem('dinoHighScore');
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });
  const [cloudOffset, setCloudOffset] = useState(0);
  const [mountainOffset, setMountainOffset] = useState(0);
  const [groundOffset, setGroundOffset] = useState(0);
  const [dustClouds, setDustClouds] = useState<DustCloudData[]>([]);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);
  const [stamina, setStamina] = useState<number>(MAX_STAMINA);
  const [activePowerUps, setActivePowerUps] = useState<{ [key in PowerUpType]?: number }>({});
  
  const gameLoopRef = useRef<number | null>(null);
  const lastObstacleSpawnTimeRef = useRef<number>(0);
  const nextSpawnIntervalRef = useRef<number>(0);
  const lastPowerUpSpawnTimeRef = useRef<number>(0);
  const nextPowerUpSpawnIntervalRef = useRef<number>(0);
  const lastScoreIncrementTimeRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    setPlayer({
      y: PLAYER_INITIAL_Y,
      vy: 0,
      isJumping: false,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      health: PLAYER_MAX_HEALTH,
      ammo: 0,
      invincibilityEndTime: 0,
    });
    setObstacles([]);
    setPowerUps([]);
    setProjectiles([]);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('dinoHighScore', score.toString());
    }
    setScore(0);
    setCloudOffset(0);
    setMountainOffset(0);
    setGroundOffset(0);
    setDustClouds([]);
    setStamina(MAX_STAMINA);
    setIsSprinting(false);
    setActivePowerUps({});
    lastObstacleSpawnTimeRef.current = 0;
    lastPowerUpSpawnTimeRef.current = 0;
    nextSpawnIntervalRef.current = OBSTACLE_SPAWN_INTERVAL_MIN + Math.random() * (OBSTACLE_SPAWN_INTERVAL_MAX - OBSTACLE_SPAWN_INTERVAL_MIN);
    nextPowerUpSpawnIntervalRef.current = POWERUP_SPAWN_INTERVAL_MIN + Math.random() * (POWERUP_SPAWN_INTERVAL_MAX - POWERUP_SPAWN_INTERVAL_MIN);
    lastScoreIncrementTimeRef.current = 0;
  }, [score, highScore]);

  const startGame = useCallback(() => {
    resetGame();
    setGameStatus(GameStatus.RUNNING);
    const now = performance.now();
    lastObstacleSpawnTimeRef.current = now;
    lastPowerUpSpawnTimeRef.current = now;
  }, [resetGame]);

  const handleDustAnimationEnd = useCallback((id: string) => {
    setDustClouds(prev => prev.filter(cloud => cloud.id !== id));
  }, []);

  const handleJump = useCallback(() => {
    if (gameStatus === GameStatus.RUNNING && !player.isJumping) {
      setPlayer(prev => ({ ...prev, vy: JUMP_STRENGTH, isJumping: true }));

      const newDustCloud: DustCloudData = {
        id: `dust-${Date.now()}-${Math.random()}`,
        x: PLAYER_X_POSITION + PLAYER_WIDTH / 4,
        y: PLAYER_INITIAL_Y,
      };
      setDustClouds(prev => [...prev, newDustCloud]);

    } else if (gameStatus === GameStatus.IDLE || gameStatus === GameStatus.GAME_OVER) {
      startGame();
    }
  }, [gameStatus, player.isJumping, startGame]);
  
  const handleShoot = useCallback(() => {
    if (gameStatus === GameStatus.RUNNING && player.ammo > 0) {
      setPlayer(prev => ({...prev, ammo: prev.ammo - 1}));
      setProjectiles(prev => [...prev, {
        id: `proj-${Date.now()}`,
        x: PLAYER_X_POSITION + PLAYER_WIDTH,
        y: player.y + PLAYER_HEIGHT / 2 - PROJECTILE_HEIGHT / 2,
        width: PROJECTILE_WIDTH,
        height: PROJECTILE_HEIGHT,
      }]);
    }
  }, [gameStatus, player.ammo, player.y]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        handleJump();
      } else if (event.key === 'Shift' && !event.repeat) {
        if (gameStatus === GameStatus.RUNNING && stamina > 0) {
          setIsSprinting(true);
        }
      } else if ((event.key === 'f' || event.key === 'F') && !event.repeat) {
        handleShoot();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setIsSprinting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleJump, handleShoot, gameStatus, stamina]);
  
  const playerRef = useRef(player);
  playerRef.current = player;
  const obstaclesRef = useRef(obstacles);
  obstaclesRef.current = obstacles;
  const powerUpsRef = useRef(powerUps);
  powerUpsRef.current = powerUps;
  const projectilesRef = useRef(projectiles);
  projectilesRef.current = projectiles;
  const isSprintingRef = useRef(isSprinting);
  isSprintingRef.current = isSprinting;
  const staminaRef = useRef(stamina);
  staminaRef.current = stamina;

  useEffect(() => {
    if (gameStatus !== GameStatus.RUNNING) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    let lastFrameTime = performance.now();
    
    const gameTick = (currentTime: number) => {
      const deltaTime = (currentTime - lastFrameTime) / (1000 / 60);
      lastFrameTime = currentTime;

      const isInvincible = currentTime < playerRef.current.invincibilityEndTime;
      const scoreMultiplier = activePowerUps[PowerUpType.SCORE_MULTIPLIER] && activePowerUps[PowerUpType.SCORE_MULTIPLIER]! > currentTime
        ? POWERUP_SCORE_MULTIPLIER : 1;
      
      setActivePowerUps(prev => {
        const updated: typeof prev = {};
        for (const key in prev) {
          if (prev[key as PowerUpType]! > currentTime) {
            updated[key as PowerUpType] = prev[key as PowerUpType];
          }
        }
        return updated;
      });

      if (isSprintingRef.current) {
        setStamina(prev => {
            const newStamina = prev - STAMINA_DEPLETION_RATE * deltaTime;
            if (newStamina <= 0) {
                setIsSprinting(false);
                return 0;
            }
            return newStamina;
        });
      } else {
        setStamina(prev => Math.min(MAX_STAMINA, prev + STAMINA_REGEN_RATE * deltaTime));
      }
      
      const canSprint = isSprintingRef.current && staminaRef.current > 0;
      const currentSpeed = canSprint ? OBSTACLE_SPEED * SPRINT_SPEED_MULTIPLIER : OBSTACLE_SPEED;
      const parallaxSpeedMultiplier = currentSpeed / OBSTACLE_SPEED;

      setCloudOffset(prev => prev - CLOUD_SPEED * parallaxSpeedMultiplier * deltaTime);
      setMountainOffset(prev => prev - MOUNTAIN_SPEED * parallaxSpeedMultiplier * deltaTime);
      setGroundOffset(prev => prev - currentSpeed * deltaTime);

      setPlayer(prevPlayer => {
        let newVy = prevPlayer.vy - GRAVITY * deltaTime;
        let newY = prevPlayer.y + newVy * deltaTime;
        let newIsJumping = prevPlayer.isJumping;

        if (newY <= PLAYER_INITIAL_Y) {
          newY = PLAYER_INITIAL_Y;
          newVy = 0;
          newIsJumping = false;
        }
        return { ...prevPlayer, y: newY, vy: newVy, isJumping: newIsJumping };
      });

      setObstacles(prevObstacles => 
        prevObstacles
          .map(obs => ({ ...obs, x: obs.x - currentSpeed * deltaTime }))
          .filter(obs => obs.x + obs.width > 0)
      );
      
      setPowerUps(prevPowerUps => 
        prevPowerUps
          .map(p => ({ ...p, x: p.x - currentSpeed * deltaTime }))
          .filter(p => p.x + p.width > 0)
      );

      setProjectiles(prev => 
        prev
          .map(p => ({...p, x: p.x + PROJECTILE_SPEED * deltaTime}))
          .filter(p => p.x < GAME_WIDTH)
      );


      if (currentTime - lastObstacleSpawnTimeRef.current > nextSpawnIntervalRef.current) {
        setObstacles(prev => [...prev, createObstacle()]);
        lastObstacleSpawnTimeRef.current = currentTime;
        nextSpawnIntervalRef.current = OBSTACLE_SPAWN_INTERVAL_MIN + Math.random() * (OBSTACLE_SPAWN_INTERVAL_MAX - OBSTACLE_SPAWN_INTERVAL_MIN);
      }
      
      if (currentTime - lastPowerUpSpawnTimeRef.current > nextPowerUpSpawnIntervalRef.current) {
        setPowerUps(prev => [...prev, createPowerUp()]);
        lastPowerUpSpawnTimeRef.current = currentTime;
        nextPowerUpSpawnIntervalRef.current = POWERUP_SPAWN_INTERVAL_MIN + Math.random() * (POWERUP_SPAWN_INTERVAL_MAX - POWERUP_SPAWN_INTERVAL_MIN);
      }
      
      if (currentTime - lastScoreIncrementTimeRef.current > SCORE_INCREMENT_INTERVAL) {
          setScore(s => s + (SCORE_POINTS_PER_INCREMENT * scoreMultiplier));
          lastScoreIncrementTimeRef.current = currentTime;
      }

      // Collision Detections
      const p = playerRef.current;
      const pRect = { left: PLAYER_X_POSITION, right: PLAYER_X_POSITION + p.width, bottom: p.y, top: p.y + p.height };

      // Player vs Obstacle
      if (!isInvincible) {
        for (const obs of obstaclesRef.current) {
          const oRect = { left: obs.x, right: obs.x + obs.width, bottom: obs.y, top: obs.y + obs.height };
          if (pRect.right > oRect.left && pRect.left < oRect.right && pRect.top > oRect.bottom && pRect.bottom < oRect.top) {
            setPlayer(prev => {
              const newHealth = prev.health - 1;
              if (newHealth <= 0) {
                setGameStatus(GameStatus.GAME_OVER);
                return {...prev, health: 0};
              }
              return { ...prev, health: newHealth, invincibilityEndTime: currentTime + PLAYER_INVINCIBILITY_ON_HIT_DURATION };
            });
            break; // only process one hit per frame
          }
        }
      }
      
      // Player vs PowerUp
      const collectedPowerUpIds = new Set();
      for (const powerUp of powerUpsRef.current) {
          const puRect = { left: powerUp.x, right: powerUp.x + powerUp.width, bottom: powerUp.y, top: powerUp.y + powerUp.height };
          if (pRect.right > puRect.left && pRect.left < puRect.right && pRect.top > puRect.bottom && pRect.bottom < puRect.top) {
              collectedPowerUpIds.add(powerUp.id);
              switch(powerUp.type) {
                  case PowerUpType.HEALTH:
                      setPlayer(prev => ({...prev, health: Math.min(PLAYER_MAX_HEALTH, prev.health + 1)}));
                      break;
                  case PowerUpType.AMMO:
                      setPlayer(prev => ({...prev, ammo: prev.ammo + POWERUP_AMMO_AMOUNT}));
                      break;
                  case PowerUpType.INVINCIBILITY:
                      setPlayer(prev => ({...prev, invincibilityEndTime: currentTime + POWERUP_INVINCIBILITY_DURATION}));
                      break;
                  case PowerUpType.SCORE_MULTIPLIER:
                      setActivePowerUps(prev => ({...prev, [PowerUpType.SCORE_MULTIPLIER]: currentTime + POWERUP_SCORE_MULTIPLIER_DURATION}));
                      break;
              }
          }
      }
      if (collectedPowerUpIds.size > 0) {
          setPowerUps(prev => prev.filter(pu => !collectedPowerUpIds.has(pu.id)));
      }

      // Projectile vs Obstacle
      const destroyedObstacleIds = new Set();
      const usedProjectileIds = new Set();
      for (const proj of projectilesRef.current) {
        const projRect = { left: proj.x, right: proj.x + proj.width, bottom: proj.y, top: proj.y + proj.height };
        for (const obs of obstaclesRef.current) {
            if (destroyedObstacleIds.has(obs.id)) continue;
            const obsRect = { left: obs.x, right: obs.x + obs.width, bottom: obs.y, top: obs.y + obs.height };
            if (projRect.right > obsRect.left && projRect.left < obsRect.right && projRect.top > obsRect.bottom && projRect.bottom < obsRect.top) {
                destroyedObstacleIds.add(obs.id);
                usedProjectileIds.add(proj.id);
                break; // a projectile can only hit one obstacle
            }
        }
      }
      if (destroyedObstacleIds.size > 0) {
          setObstacles(prev => prev.filter(o => !destroyedObstacleIds.has(o.id)));
          setProjectiles(prev => prev.filter(p => !usedProjectileIds.has(p.id)));
      }
      
      gameLoopRef.current = requestAnimationFrame(gameTick);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameTick);
    
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameStatus, resetGame, activePowerUps]);
  
  // Explicitly cancel game loop on component unmount to prevent memory leaks.
  // This is a safety measure, as the effect above should handle cleanup during state transitions.
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount.

  const isInvincible = performance.now() < player.invincibilityEndTime;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 py-8 px-4">
        <h1 className="text-4xl font-bold text-green-400 my-6 tracking-wide shadow-sm">Pixel Dino Run</h1>
        <div 
          className="relative bg-gray-900 border-4 border-green-600 rounded-lg shadow-2xl overflow-hidden"
          style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName !== 'BUTTON') handleJump();
          }}
        >
          <Background 
            cloudOffset={cloudOffset}
            mountainOffset={mountainOffset}
            groundOffset={groundOffset}
          />

          {dustClouds.map(cloud => (
            <DustCloud 
              key={cloud.id} 
              id={cloud.id}
              x={cloud.x}
              y={cloud.y}
              onAnimationEnd={handleDustAnimationEnd}
            />
          ))}

          <Dinosaur player={player} isInvincible={isInvincible} />
          {obstacles.map(obs => (
            <ObstacleComponent key={obs.id} obstacle={obs} />
          ))}
          {powerUps.map(p => (
            <PowerUpComponent key={p.id} powerUp={p} />
          ))}
          {projectiles.map(p => (
            <ProjectileComponent key={p.id} projectile={p} />
          ))}
          <HealthBar health={player.health} maxHealth={PLAYER_MAX_HEALTH} ammo={player.ammo} />
          <Scoreboard score={score} highScore={highScore} />
          <StaminaBar stamina={stamina} maxStamina={MAX_STAMINA} />

          {gameStatus === GameStatus.IDLE && (
            <GameMessageScreen 
              title="Ready?"
              subtitle="Press SPACE or Click to Start"
              onAction={startGame}
              actionText="Start Game"
            />
          )}
          {gameStatus === GameStatus.GAME_OVER && (
            <GameMessageScreen 
              title="Game Over!"
              subtitle={`Your Score: ${score}`}
              onAction={startGame}
              actionText="Restart"
            />
          )}
        </div>
        <p className="mt-6 text-sm text-gray-400">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Spacebar</kbd> / <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Click</kbd> to Jump/Start
          <br />
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Shift</kbd> to Sprint | <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">F</kbd> to Shoot
        </p>
    </div>
  );
};

export default App;