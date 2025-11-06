
import React from 'react';
import { Projectile } from '../types';

const ProjectileComponent: React.FC<{ projectile: Projectile }> = ({ projectile }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${projectile.x}px`,
    bottom: `${projectile.y}px`,
    width: `${projectile.width}px`,
    height: `${projectile.height}px`,
    backgroundColor: '#FBBF24', // amber-400
    borderRadius: '2px',
    boxShadow: '0 0 8px #FBBF24',
  };

  return <div style={style} aria-label="projectile" />;
};

export default ProjectileComponent;
