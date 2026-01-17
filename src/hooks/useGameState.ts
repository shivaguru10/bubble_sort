import { useReducer, useEffect, useCallback } from 'react';
import type { GameState, GameAction, Position } from '../types/game';
import { generateSolvablePuzzle, rotateTile, flipTile } from '../utils/gridGenerator';
import { validatePath } from '../utils/pathValidator';

const initialGridSize = 6;

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_TILE': {
      const tile = state.grid[action.position.row][action.position.col];
      if (tile.isLocked) return state;
      
      // Toggle selection
      if (state.selectedTile?.row === action.position.row && 
          state.selectedTile?.col === action.position.col) {
        return { ...state, selectedTile: null };
      }
      
      return { ...state, selectedTile: action.position };
    }
    
    case 'ROTATE_TILE': {
      if (!state.selectedTile || state.gameStatus !== 'playing') return state;
      
      const { row, col } = state.selectedTile;
      const tile = state.grid[row][col];
      if (tile.isLocked) return state;
      
      const newGrid = state.grid.map((gridRow, r) =>
        gridRow.map((t, c) => {
          if (r === row && c === col) {
            return rotateTile(t);
          }
          return t;
        })
      );
      
      return {
        ...state,
        grid: newGrid,
        moves: state.moves + 1,
        pathCells: [],
      };
    }
    
    case 'FLIP_TILE': {
      if (!state.selectedTile || state.gameStatus !== 'playing') return state;
      
      const { row, col } = state.selectedTile;
      const tile = state.grid[row][col];
      if (tile.isLocked) return state;
      
      const newGrid = state.grid.map((gridRow, r) =>
        gridRow.map((t, c) => {
          if (r === row && c === col) {
            return flipTile(t);
          }
          return t;
        })
      );
      
      return {
        ...state,
        grid: newGrid,
        moves: state.moves + 1,
        pathCells: [],
      };
    }
    
    case 'TICK_TIMER': {
      if (state.gameStatus !== 'playing') return state;
      
      const newTimer = state.timer - 1;
      if (newTimer <= 0) {
        return { ...state, timer: 0, gameStatus: 'timeout' };
      }
      return { ...state, timer: newTimer };
    }
    
    case 'VALIDATE_PATH': {
      if (state.gameStatus !== 'playing') return state;
      
      const result = validatePath(state.grid, state.startPos, state.endPos);
      
      if (result.isValid) {
        return {
          ...state,
          gameStatus: 'won',
          pathCells: result.path,
          brokenTileId: undefined,
        };
      } else {
        return {
          ...state,
          gameStatus: 'lost',
          pathCells: result.path, // Show partial path
          brokenTileId: result.brokenAt, // Highlight broken tile
        };
      }
    }
    
    case 'SET_PATH': {
      return { ...state, pathCells: action.pathCells };
    }
    
    case 'SET_GAME_STATUS': {
      return { ...state, gameStatus: action.status };
    }
    
    case 'NEW_GAME': {
      return generateSolvablePuzzle(initialGridSize, 1);
    }
    
    case 'NEXT_LEVEL': {
      const newLevel = state.level + 1;
      const newGridSize = Math.min(8, initialGridSize + Math.floor(newLevel / 3));
      return generateSolvablePuzzle(newGridSize, newLevel);
    }
    
    case 'SHOW_ANSWER': {
      // Apply the solution to reveal the correct path
      const newGrid = state.grid.map(row => row.map(tile => ({ ...tile })));
      
      // Apply each solution entry
      state.solution.forEach(sol => {
        const tile = newGrid[sol.row][sol.col];
        tile.rotation = sol.rotation;
        tile.isFlipped = sol.isFlipped;
      });
      
      // Validate to show the complete path
      const result = validatePath(newGrid, state.startPos, state.endPos);
      
      return {
        ...state,
        grid: newGrid,
        pathCells: result.path,
        gameStatus: 'answer_shown', // Don't trigger win modal, just show the answer
      };
    }
    
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, () => 
    generateSolvablePuzzle(initialGridSize, 1)
  );
  
  // Timer effect
  useEffect(() => {
    if (state.gameStatus !== 'playing') return;
    
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state.gameStatus]);
  
  const selectTile = useCallback((position: Position) => {
    dispatch({ type: 'SELECT_TILE', position });
  }, []);
  
  const rotateTileAction = useCallback(() => {
    dispatch({ type: 'ROTATE_TILE' });
  }, []);
  
  const flipTileAction = useCallback(() => {
    dispatch({ type: 'FLIP_TILE' });
  }, []);
  
  const validatePathAction = useCallback(() => {
    dispatch({ type: 'VALIDATE_PATH' });
  }, []);
  
  const newGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' });
  }, []);
  
  const nextLevel = useCallback(() => {
    dispatch({ type: 'NEXT_LEVEL' });
  }, []);
  
  const continueGame = useCallback(() => {
    dispatch({ type: 'SET_GAME_STATUS', status: 'playing' });
  }, []);
  
  const showAnswer = useCallback(() => {
    dispatch({ type: 'SHOW_ANSWER' });
  }, []);
  
  return {
    state,
    selectTile,
    rotateTile: rotateTileAction,
    flipTile: flipTileAction,
    validatePath: validatePathAction,
    newGame,
    nextLevel,
    continueGame,
    showAnswer,
  };
}
