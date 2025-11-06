
import { PowerUp, PowerUpType } from '../types';
import { 
  GAME_WIDTH,
  POWERUP_WIDTH,
  POWERUP_HEIGHT,
  POWERUP_Y_OPTIONS,
} from '../constants';

export function createPowerUp(): PowerUp {
  const id = `pu-${Date.now()}-${Math.random()}`;
  const powerUpTypes = Object.values(PowerUpType);
  const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

  const x = GAME_WIDTH;
  const y = POWERUP_Y_OPTIONS[Math.floor(Math.random() * POWERUP_Y_OPTIONS.length)];
  const width = POWERUP_WIDTH;
  const height = POWERUP_HEIGHT;

  return { id, type, x, y, width, height };
}
