import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { GridBoard } from '../components/GridBoard';
import { Timer } from '../components/Timer';
import { ControlBar } from '../components/ControlBar';
import { GameHeader } from '../components/GameHeader';
import { GameModal } from '../components/GameModal';
import { useGameState } from '../hooks/useGameState';

export const PathGame: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    selectTile,
    rotateTile,
    flipTile,
    validatePath,
    newGame,
    nextLevel,
    continueGame,
    showAnswer,
  } = useGameState();

  const showModal = ['won', 'lost', 'timeout'].includes(state.gameStatus);
  const isPlaying = state.gameStatus === 'playing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
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
      <div className="flex-1 flex flex-col items-center py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Path Flow Puzzle
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          Connect the path from <span className="text-blue-600 font-semibold">IN</span> to <span className="text-green-600 font-semibold">OUT</span> by rotating tiles
        </p>
        
        <GameHeader moves={state.moves} level={state.level} />
        
        <div className="my-4">
          <Timer seconds={state.timer} />
        </div>
        
        <div className="flex-1 flex items-center justify-center my-4">
          <GridBoard
            grid={state.grid}
            startPos={state.startPos}
            endPos={state.endPos}
            selectedTile={state.selectedTile}
            pathCells={state.pathCells}
            brokenTileId={state.brokenTileId}
            onTileClick={selectTile}
          />
        </div>
        
        <ControlBar
          onRotate={rotateTile}
          onFlip={flipTile}
          onSubmit={validatePath}
          onShowAnswer={showAnswer}
          hasSelection={state.selectedTile !== null}
          disabled={!isPlaying}
        />
        
        <div className="mt-4 text-center text-sm text-gray-500 max-w-md">
          <p>
            <strong>Click</strong> a tile to select it, then use <strong>Rotate</strong> or <strong>Flip</strong> to adjust.
          </p>
          <p className="mt-1">
            Press <strong>✓</strong> to check if your path is valid.
          </p>
        </div>
        
        {showModal && (
          <GameModal
            type={state.gameStatus as 'won' | 'lost' | 'timeout'}
            moves={state.moves}
            timeRemaining={state.timer}
            onNewGame={newGame}
            onNextLevel={nextLevel}
            onTryAgain={continueGame}
          />
        )}
      </div>
    </div>
  );
};

export default PathGame;
