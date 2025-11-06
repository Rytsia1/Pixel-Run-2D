
import { Obstacle, ObstacleType } from '../types';
import { 
  GAME_WIDTH, 
  GROUND_Y, 
  CACTUS_SMALL_WIDTH, CACTUS_SMALL_HEIGHT, 
  CACTUS_LARGE_WIDTH, CACTUS_LARGE_HEIGHT,
  PTERODACTYL_WIDTH, PTERODACTYL_HEIGHT, PTERODACTYL_Y_OPTIONS,
  PLAYER_HEIGHT // Added as it is used by PTERODACTYL_Y_OPTIONS definition in constants.ts
} from '../constants';

export function createObstacle(): Obstacle {
  const id = `obs-${Date.now()}-${Math.random()}`;
  const obstacleTypes = Object.values(ObstacleType);
  const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

  let x = GAME_WIDTH; // Start off-screen to the right
  let y, width, height;

  switch (type) {
    case ObstacleType.CACTUS_SMALL:
      width = CACTUS_SMALL_WIDTH;
      height = CACTUS_SMALL_HEIGHT;
      y = GROUND_Y; // Bottom of cactus is on the ground
      break;
    case ObstacleType.CACTUS_LARGE:
      width = CACTUS_LARGE_WIDTH;
      height = CACTUS_LARGE_HEIGHT;
      y = GROUND_Y;
      break;
    case ObstacleType.PTERODACTYL:
      width = PTERODACTYL_WIDTH;
      height = PTERODACTYL_HEIGHT;
      // Pterodactyl y is its bottom edge.
      y = PTERODACTYL_Y_OPTIONS[Math.floor(Math.random() * PTERODACTYL_Y_OPTIONS.length)];
      break;
    default: // Should not happen
      width = 30;
      height = 50;
      y = GROUND_Y;
  }

  return { id, type, x, y, width, height };
}