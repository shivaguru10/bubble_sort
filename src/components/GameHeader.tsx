import React from 'react';
import { Move, Zap } from 'lucide-react';

interface GameHeaderProps {
  moves: number;
  level: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ moves, level }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-lg px-4 py-2">
      {/* Level indicator */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white shadow-md">
        <Zap className="w-5 h-5" />
        <span className="font-bold">Level {level}</span>
      </div>
      
      {/* Move counter */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-white shadow-md">
        <Move className="w-5 h-5" />
        <span className="font-mono font-bold">{moves} moves</span>
      </div>
    </div>
  );
};

export default GameHeader;
