import { GridBoard } from './components/GridBoard';
import { Timer } from './components/Timer';
import { ControlBar } from './components/ControlBar';
import { GameHeader } from './components/GameHeader';
import { GameModal } from './components/GameModal';
import { useGameState } from './hooks/useGameState';

function App() {
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

  // Modal shows for won/lost/timeout, but NOT for answer_shown (we want to see the path)
  const showModal = ['won', 'lost', 'timeout'].includes(state.gameStatus);
  const isPlaying = state.gameStatus === 'playing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center py-6 px-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Grid Flow Puzzle
      </h1>
      <p className="text-gray-600 mb-4 text-center">
        Connect the path from <span className="text-blue-600 font-semibold">IN</span> to <span className="text-green-600 font-semibold">OUT</span> by rotating tiles
      </p>
      
      {/* Game Header */}
      <GameHeader moves={state.moves} level={state.level} />
      
      {/* Timer */}
      <div className="my-4">
        <Timer seconds={state.timer} />
      </div>
      
      {/* Grid */}
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
      
      {/* Controls */}
      <ControlBar
        onRotate={rotateTile}
        onFlip={flipTile}
        onSubmit={validatePath}
        onShowAnswer={showAnswer}
        hasSelection={state.selectedTile !== null}
        disabled={!isPlaying}
      />
      
      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-500 max-w-md">
        <p>
          <strong>Click</strong> a tile to select it, then use <strong>Rotate</strong> or <strong>Flip</strong> to adjust.
        </p>
        <p className="mt-1">
          Press <strong>✓</strong> to check if your path is valid.
        </p>
      </div>
      
      {/* Modal */}
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
  );
}

export default App;
