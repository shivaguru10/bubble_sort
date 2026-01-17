import React from 'react';
import { Trophy, XCircle, Clock, RotateCcw, ArrowRight } from 'lucide-react';

interface GameModalProps {
  type: 'won' | 'lost' | 'timeout';
  moves: number;
  timeRemaining: number;
  onNewGame: () => void;
  onNextLevel: () => void;
  onTryAgain: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  type,
  moves,
  timeRemaining,
  onNewGame,
  onNextLevel,
  onTryAgain,
}) => {
  const timeUsed = 240 - timeRemaining;
  const minutes = Math.floor(timeUsed / 60);
  const seconds = timeUsed % 60;
  
  const isWin = type === 'won';
  const isTimeout = type === 'timeout';
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        className={`
          bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4
          transform transition-all duration-300 animate-bounce-in
        `}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {isWin ? (
            <div className="p-4 bg-green-100 rounded-full">
              <Trophy className="w-16 h-16 text-green-600" />
            </div>
          ) : isTimeout ? (
            <div className="p-4 bg-yellow-100 rounded-full">
              <Clock className="w-16 h-16 text-yellow-600" />
            </div>
          ) : (
            <div className="p-4 bg-red-100 rounded-full">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
          )}
        </div>
        
        {/* Title */}
        <h2 className={`
          text-3xl font-bold text-center mb-2
          ${isWin ? 'text-green-600' : isTimeout ? 'text-yellow-600' : 'text-red-600'}
        `}>
          {isWin ? 'Puzzle Solved!' : isTimeout ? 'Time\'s Up!' : 'Path Invalid'}
        </h2>
        
        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-6">
          {isWin 
            ? 'Great job! You connected the path successfully.' 
            : isTimeout 
            ? 'You ran out of time. Try again!' 
            : 'The arrows don\'t form a valid path. Check the connections!'}
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{moves}</div>
            <div className="text-sm text-gray-500">Moves Used</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-500">Time {isWin ? 'Taken' : 'Elapsed'}</div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {isWin ? (
            <>
              <button
                onClick={onNextLevel}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                Next Level <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onNewGame}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
              >
                <RotateCcw className="w-5 h-5" /> New Game
              </button>
            </>
          ) : (
            <>
              <button
                onClick={isTimeout ? onNewGame : onTryAgain}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
              >
                <RotateCcw className="w-5 h-5" /> {isTimeout ? 'Try Again' : 'Keep Trying'}
              </button>
              {!isTimeout && (
                <button
                  onClick={onNewGame}
                  className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                >
                  New Puzzle
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModal;
