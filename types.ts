
export interface PlayerState {
  y: number;
  vy: number; // Vertical velocity
  isJumping: boolean;
  width: number;
  height: number;
  health: number;
  ammo: number;
  invincibilityEndTime: number; // Timestamp
}

export enum ObstacleType {
  CACTUS_SMALL = 'CACTUS_SMALL',
  CACTUS_LARGE = 'CACTUS_LARGE',
  PTERODACTYL = 'PTERODACTYL',
}

export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum PowerUpType {
  HEALTH = 'HEALTH',
  INVINCIBILITY = 'INVINCIBILITY',
  SCORE_MULTIPLIER = 'SCORE_MULTIPLIER',
  AMMO = 'AMMO',
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}


export enum GameStatus {
  IDLE = 'IDLE', // Waiting to start
  RUNNING = 'RUNNING',
  GAME_OVER = 'GAME_OVER',
}

export interface DustCloudData {
  id: string;
  x: number;
  y: number;
}
