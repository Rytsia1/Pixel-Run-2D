
import React from 'react';
import { Obstacle as ObstacleProps, ObstacleType } from '../types';

const ObstacleComponent: React.FC<{ obstacle: ObstacleProps }> = ({ obstacle }) => {
  let bgColor = 'bg-red-500'; // Default
  let specificStyles: React.CSSProperties = {};

  switch (obstacle.type) {
    case ObstacleType.CACTUS_SMALL:
      bgColor = 'bg-yellow-600';
      break;
    case ObstacleType.CACTUS_LARGE:
      bgColor = 'bg-yellow-700';
      break;
    case ObstacleType.PTERODACTYL:
      bgColor = 'bg-purple-500';
      specificStyles.borderRadius = '50% 20% / 10% 40%'; // attempt at wing shape
      break;
  }
  
  // Obstacle y is its bottom edge from the game container's bottom
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${obstacle.x}px`,
    bottom: `${obstacle.y}px`,
    width: `${obstacle.width}px`,
    height: `${obstacle.height}px`,
    border: '2px solid #4A5568', // Dark gray border
    borderRadius: '4px',
    boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    ...specificStyles,
  };

  return <div className={`${bgColor}`} style={style} aria-label={`obstacle ${obstacle.type}`} />;
};

export default ObstacleComponent;
