
import React from 'react';

interface HealthBarProps {
  health: number;
  maxHealth: number;
  ammo: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ health, maxHealth, ammo }) => {
  return (
    <div className="absolute top-4 left-4 flex flex-col items-start text-lg font-bold text-gray-100 bg-gray-700 bg-opacity-70 p-3 rounded-lg shadow-md">
      <div className="flex items-center" aria-label={`Health: ${health} out of ${maxHealth}`}>
        <span className="mr-2">HP:</span>
        {Array.from({ length: maxHealth }).map((_, i) => (
          <span key={i} className={`text-2xl ${i < health ? 'text-red-500' : 'text-gray-500'}`}>
            ♥
          </span>
        ))}
      </div>
       <div className="flex items-center mt-1" aria-label={`Ammo: ${ammo}`}>
        <span className="mr-2 text-yellow-400">Ammo:</span>
        <span>{ammo}</span>
      </div>
    </div>
  );
};

export default HealthBar;
