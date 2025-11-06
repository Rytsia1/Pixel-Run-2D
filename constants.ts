export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 400;

export const GROUND_Y_OFFSET = 60; // From bottom of game area
export const GROUND_Y = GROUND_Y_OFFSET;

export const PLAYER_X_POSITION = 50;
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 60;
export const PLAYER_INITIAL_Y = GROUND_Y;
export const PLAYER_MAX_HEALTH = 3;
export const PLAYER_INVINCIBILITY_ON_HIT_DURATION = 1000; // 1 second
export const JUMP_STRENGTH = 18; // Initial upward velocity on jump
export const GRAVITY = 0.8;

export const CLOUD_SPEED = 0.5;
export const MOUNTAIN_SPEED = 1.0;

export const OBSTACLE_SPEED = 5;

// Sprinting and Stamina
export const SPRINT_SPEED_MULTIPLIER = 1.5;
export const MAX_STAMINA = 100;
export const STAMINA_DEPLETION_RATE = 0.5; // points per frame at 60fps
export const STAMINA_REGEN_RATE = 0.2; // points per frame at 60fps

export const OBSTACLE_SPAWN_INTERVAL_MIN = 1500; // ms
export const OBSTACLE_SPAWN_INTERVAL_MAX = 3500; // ms

// Power-ups
export const POWERUP_SPAWN_INTERVAL_MIN = 5000; // ms
export const POWERUP_SPAWN_INTERVAL_MAX = 10000; // ms
export const POWERUP_WIDTH = 25;
export const POWERUP_HEIGHT = 25;
export const POWERUP_Y_OPTIONS = [GROUND_Y + 10, GROUND_Y + PLAYER_HEIGHT + 10];
export const POWERUP_INVINCIBILITY_DURATION = 5000; // 5 seconds
export const POWERUP_SCORE_MULTIPLIER_DURATION = 10000; // 10 seconds
export const POWERUP_SCORE_MULTIPLIER = 2;
export const POWERUP_AMMO_AMOUNT = 5;

// Projectiles
export const PROJECTILE_SPEED = 10;
export const PROJECTILE_WIDTH = 20;
export const PROJECTILE_HEIGHT = 8;


export const CACTUS_SMALL_WIDTH = 25;
export const CACTUS_SMALL_HEIGHT = 50;
export const CACTUS_LARGE_WIDTH = 40;
export const CACTUS_LARGE_HEIGHT = 70;

export const PTERODACTYL_WIDTH = 50;
export const PTERODACTYL_HEIGHT = 30;
export const PTERODACTYL_Y_OPTIONS = [
  GROUND_Y + 10, // Flying low
  GROUND_Y + PLAYER_HEIGHT - PTERODACTYL_HEIGHT, // Flying mid (player head height)
  GROUND_Y + PLAYER_HEIGHT + 40, // Flying high
];

export const SCORE_INCREMENT_INTERVAL = 100; // ms, score increases every this often
export const SCORE_POINTS_PER_INCREMENT = 1;