
import React from 'react';

interface ScoreboardProps {
  score: number;
  highScore: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, highScore }) => {
  return (
    <div className="absolute top-4 right-4 text-xl font-bold text-gray-100 bg-gray-700 bg-opacity-70 p-3 rounded-lg shadow-md">
      <p>Score: {String(score).padStart(5, '0')}</p>
      <p className="text-sm mt-1">High: {String(highScore).padStart(5, '0')}</p>
    </div>
  );
};

export default Scoreboard;
