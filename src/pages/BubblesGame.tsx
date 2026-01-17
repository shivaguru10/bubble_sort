import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, RefreshCw, Trophy, Clock } from 'lucide-react';

interface Bubble {
  id: number;
  value: number;
  isSwapping: boolean;
  isSorted: boolean;
}

export const BubblesGame: React.FC = () => {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'timeout'>('playing');
  const [level, setLevel] = useState(1);

  const generateBubbles = useCallback((size: number = 6) => {
    const values = Array.from({ length: size }, (_, i) => i + 1);
    // Shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    setBubbles(values.map((v, i) => ({ id: i, value: v, isSwapping: false, isSorted: false })));
    setMoves(0);
    setTimer(180);
    setGameStatus('playing');
    setSelectedIndex(null);
  }, []);

  useEffect(() => {
    generateBubbles(5 + level);
  }, [level, generateBubbles]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setGameStatus('timeout');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStatus]);

  const checkSorted = (arr: Bubble[]) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].value > arr[i + 1].value) return false;
    }
    return true;
  };

  const handleBubbleClick = (index: number) => {
    if (gameStatus !== 'playing') return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      // Can only swap adjacent bubbles (bubble sort rule)
      if (Math.abs(selectedIndex - index) === 1) {
        const newBubbles = [...bubbles];
        // Swap
        [newBubbles[selectedIndex], newBubbles[index]] = [newBubbles[index], newBubbles[selectedIndex]];
        setBubbles(newBubbles);
        setMoves(m => m + 1);
        
        if (checkSorted(newBubbles)) {
          setGameStatus('won');
          // Mark all as sorted
          setBubbles(newBubbles.map(b => ({ ...b, isSorted: true })));
        }
      }
      setSelectedIndex(null);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <button 
          onClick={() => navigate('/dashboard/accenture')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <Home className="w-5 h-5" />
          Home
        </button>
      </nav>

      {/* Game Content */}
      <div className="flex-1 flex flex-col items-center py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bubble Sort Game</h1>
        <p className="text-gray-600 mb-6 text-center">
          Sort the bubbles from smallest to largest. You can only swap <strong>adjacent</strong> bubbles!
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
            <Trophy className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Level {level}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full">
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold">{formatTime(timer)}</span>
          </div>
          <div className="px-4 py-2 bg-purple-100 rounded-full">
            <span className="text-purple-800 font-semibold">{moves} moves</span>
          </div>
        </div>

        {/* Bubbles */}
        <div className="flex items-end gap-3 mb-8 p-8 bg-white rounded-2xl shadow-xl">
          {bubbles.map((bubble, index) => (
            <div
              key={bubble.id}
              onClick={() => handleBubbleClick(index)}
              className={`
                w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer
                transition-all duration-200 transform
                ${selectedIndex === index 
                  ? 'ring-4 ring-yellow-400 scale-110 bg-yellow-400 text-yellow-900' 
                  : bubble.isSorted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:scale-105'}
                ${gameStatus !== 'playing' ? 'pointer-events-none' : ''}
              `}
              style={{
                boxShadow: selectedIndex === index 
                  ? '0 8px 25px rgba(234, 179, 8, 0.5)' 
                  : '0 4px 15px rgba(59, 130, 246, 0.4)',
              }}
            >
              {bubble.value}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <p className="text-gray-500 text-sm mb-4">
          Click a bubble to select it, then click an adjacent bubble to swap them.
        </p>

        {/* New Game Button */}
        <button
          onClick={() => generateBubbles(5 + level)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          <RefreshCw className="w-5 h-5" />
          New Game
        </button>

        {/* Win/Lose Modal */}
        {gameStatus !== 'playing' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
              {gameStatus === 'won' ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-green-600 mb-2">Sorted!</h2>
                  <p className="text-gray-600 mb-6">You sorted all bubbles in {moves} moves!</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-red-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-red-600 mb-2">Time's Up!</h2>
                  <p className="text-gray-600 mb-6">Try again to beat the clock.</p>
                </>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => generateBubbles(5 + level)}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Play Again
                </button>
                {gameStatus === 'won' && (
                  <button
                    onClick={() => setLevel(l => l + 1)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
                  >
                    Next Level →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BubblesGame;
