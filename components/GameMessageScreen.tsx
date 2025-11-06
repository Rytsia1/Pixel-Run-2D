
import React from 'react';

interface GameMessageScreenProps {
  title: string;
  subtitle?: string;
  onAction?: () => void;
  actionText?: string;
}

const GameMessageScreen: React.FC<GameMessageScreenProps> = ({ title, subtitle, onAction, actionText }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 z-10">
      <h2 className="text-5xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-2xl text-gray-300 mb-8">{subtitle}</p>}
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="px-8 py-4 bg-green-500 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-150"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default GameMessageScreen;
