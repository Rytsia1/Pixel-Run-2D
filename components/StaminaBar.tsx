import React from 'react';

interface StaminaBarProps {
  stamina: number;
  maxStamina: number;
}

const StaminaBar: React.FC<StaminaBarProps> = ({ stamina, maxStamina }) => {
  const percentage = Math.max(0, (stamina / maxStamina) * 100);

  return (
    <div 
      className="absolute bottom-4 left-4 w-48 h-6 bg-gray-700 bg-opacity-80 rounded-full border-2 border-gray-500 overflow-hidden"
      aria-label={`Stamina: ${Math.round(percentage)}%`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={maxStamina}
      aria-valuenow={stamina}
    >
      <div
        className="h-full bg-yellow-400 transition-all duration-200 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
        Stamina
      </span>
    </div>
  );
};

export default StaminaBar;
