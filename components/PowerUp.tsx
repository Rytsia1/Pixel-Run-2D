
import React from 'react';
import { PowerUp, PowerUpType } from '../types';

const PowerUpComponent: React.FC<{ powerUp: PowerUp }> = ({ powerUp }) => {
  let content = '';
  let bgColor = 'bg-gray-400';
  let textColor = 'text-white';
  
  switch(powerUp.type) {
    case PowerUpType.HEALTH:
      content = '♥';
      bgColor = 'bg-red-500';
      break;
    case PowerUpType.AMMO:
      content = '➤';
      bgColor = 'bg-yellow-500';
      textColor = 'text-gray-800'
      break;
    case PowerUpType.INVINCIBILITY:
      content = '★';
      bgColor = 'bg-blue-400';
      break;
    case PowerUpType.SCORE_MULTIPLIER:
      content = 'x2';
      bgColor = 'bg-green-500';
      break;
  }
  
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${powerUp.x}px`,
    bottom: `${powerUp.y}px`,
    width: `${powerUp.width}px`,
    height: `${powerUp.height}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
    border: '2px solid white',
  };

  return (
    <div className={`${bgColor} ${textColor}`} style={style} aria-label={`power-up ${powerUp.type}`}>
      {content}
    </div>
  );
};

export default PowerUpComponent;
