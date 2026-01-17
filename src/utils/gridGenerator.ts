import type { Tile, TileType, Rotation, TileConnections, Position, GameState } from '../types/game';

// Get connections for a tile based on its type and rotation
export function getTileConnections(tile: Tile): TileConnections {
  const baseConnections = getBaseConnections(tile.type);
  return rotateConnections(baseConnections, tile.rotation);
}

function getBaseConnections(type: TileType): TileConnections {
  switch (type) {
    case 'STRAIGHT':
      // Horizontal straight: connects left-right
      return { up: false, down: false, left: true, right: true };
    case 'CORNER':
      // L-shape: connects right-down (bottom-right corner)
      return { up: false, down: true, left: false, right: true };
    case 'TJUNCTION':
      // T-shape: connects left, right, down (T pointing up)
      return { up: false, down: true, left: true, right: true };
    case 'CROSS':
      // Plus: connects all four directions
      return { up: true, down: true, left: true, right: true };
    case 'EMPTY':
    default:
      return { up: false, down: false, left: false, right: false };
  }
}

function rotateConnections(connections: TileConnections, rotation: Rotation): TileConnections {
  let result = { ...connections };
  const rotations = rotation / 90;
  
  for (let i = 0; i < rotations; i++) {
    result = {
      up: result.left,
      right: result.up,
      down: result.right,
      left: result.down,
    };
  }
  
  return result;
}

// Get the opposite direction
export function getOppositeDirection(dir: 'up' | 'down' | 'left' | 'right'): 'up' | 'down' | 'left' | 'right' {
  switch (dir) {
    case 'up': return 'down';
    case 'down': return 'up';
    case 'left': return 'right';
    case 'right': return 'left';
  }
}

// Get adjacent position in a direction
export function getAdjacentPosition(pos: Position, dir: 'up' | 'down' | 'left' | 'right'): Position {
  switch (dir) {
    case 'up': return { row: pos.row - 1, col: pos.col };
    case 'down': return { row: pos.row + 1, col: pos.col };
    case 'left': return { row: pos.row, col: pos.col - 1 };
    case 'right': return { row: pos.row, col: pos.col + 1 };
  }
}

// Create a random tile
function createRandomTile(row: number, col: number, allowedTypes: TileType[]): Tile {
  const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  const rotations: Rotation[] = [0, 90, 180, 270];
  const rotation = rotations[Math.floor(Math.random() * rotations.length)];
  
  return {
    id: `tile-${row}-${col}`,
    row,
    col,
    type,
    rotation,
    isLocked: false,
    isFlipped: Math.random() > 0.5, // Random flip state
  };
}

// Generate a path from start to end using random walk with proper backtracking
function generatePath(gridSize: number, startPos: Position, endPos: Position): Position[] {
  const maxRetries = 10;
  
  for (let retry = 0; retry < maxRetries; retry++) {
    const path: Position[] = [startPos];
    let current = { ...startPos };
    const visited = new Set<string>();
    visited.add(`${current.row}-${current.col}`);
    
    const maxAttempts = 1000;
    let attempts = 0;
    
    while (current.row !== endPos.row || current.col !== endPos.col) {
      attempts++;
      if (attempts > maxAttempts) break;
      
      const directions: ('up' | 'down' | 'left' | 'right')[] = [];
      
      // Prioritize moving towards the goal
      if (current.col < endPos.col) directions.push('right', 'right');
      if (current.col > endPos.col) directions.push('left', 'left');
      if (current.row < endPos.row) directions.push('down');
      if (current.row > endPos.row) directions.push('up');
      
      // Add random directions for variety
      directions.push('up', 'down', 'left', 'right');
      
      // Shuffle and try each direction
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }
      
      let moved = false;
      for (const dir of directions) {
        const next = getAdjacentPosition(current, dir);
        const key = `${next.row}-${next.col}`;
        
        if (next.row >= 0 && next.row < gridSize &&
            next.col >= 0 && next.col < gridSize &&
            !visited.has(key)) {
          visited.add(key);
          path.push(next);
          current = next;
          moved = true;
          break;
        }
      }
      
      if (!moved) {
        // Dead end - backtrack and remove from visited so we can try another path
        if (path.length > 1) {
          const removed = path.pop()!;
          visited.delete(`${removed.row}-${removed.col}`); // Allow revisiting via different route
          current = path[path.length - 1];
        } else {
          break;
        }
      }
    }
    
    // Check if we reached the goal
    if (current.row === endPos.row && current.col === endPos.col) {
      return path;
    }
    // Otherwise retry with fresh random walk
  }
  
  // Fallback: create a simple direct path (L-shaped)
  const path: Position[] = [startPos];
  let current = { ...startPos };
  
  // Go horizontally first
  while (current.col < endPos.col) {
    current = { row: current.row, col: current.col + 1 };
    path.push({ ...current });
  }
  // Then vertically
  while (current.row > endPos.row) {
    current = { row: current.row - 1, col: current.col };
    path.push({ ...current });
  }
  while (current.row < endPos.row) {
    current = { row: current.row + 1, col: current.col };
    path.push({ ...current });
  }
  
  return path;
}

// Get the tile type and rotation needed to connect path flow: prev → current → next
// The tile must have INPUT facing prev, and OUTPUT facing next
function getTileForPath(prev: Position | null, current: Position, next: Position | null): { type: TileType; rotation: Rotation; isFlipped: boolean } {
  // Get the direction FROM current TO an adjacent cell
  const getDir = (from: Position, to: Position): 'top' | 'bottom' | 'left' | 'right' => {
    if (to.row < from.row) return 'top';
    if (to.row > from.row) return 'bottom';
    if (to.col < from.col) return 'left';
    return 'right';
  };
  
  // inputSide = the side where flow ENTERS (faces previous tile)
  // outputSide = the side where flow EXITS (faces next tile)
  let inputSide: 'top' | 'bottom' | 'left' | 'right' | null = null;
  let outputSide: 'top' | 'bottom' | 'left' | 'right' | null = null;
  
  if (prev) {
    // Flow comes FROM prev, so input is on the side facing prev
    inputSide = getDir(current, prev);
  }
  if (next) {
    // Flow goes TO next, so output is on the side facing next
    outputSide = getDir(current, next);
  }
  
  // Start tile (no prev): flow enters from left (outside grid)
  if (!prev && inputSide === null) {
    inputSide = 'left';
  }
  
  // End tile (no next): flow exits to right (to OUT)
  if (!next && outputSide === null) {
    outputSide = 'right';
  }
  
  // Now determine tile type and rotation
  // STRAIGHT base: input=left, output=right (horizontal)
  // CORNER base: input=right, output=bottom
  
  if (inputSide && outputSide) {
    // Check if straight line (opposite sides)
    const opposites = {
      left: 'right', right: 'left', top: 'bottom', bottom: 'top'
    } as const;
    
    if (opposites[inputSide] === outputSide) {
      // STRAIGHT tile: need input on inputSide, output on outputSide
      // Base STRAIGHT: input=left, output=right (rotation 0)
      // We need to rotate so that input is on inputSide
      const rotationMap: Record<string, Rotation> = {
        'left': 0,    // input from left, output to right
        'top': 90,    // input from top, output to bottom  
        'right': 180, // input from right, output to left
        'bottom': 270 // input from bottom, output to top
      };
      return { type: 'STRAIGHT', rotation: rotationMap[inputSide], isFlipped: false };
    } else {
      // CORNER tile: need input on inputSide, output on outputSide
      // Base CORNER at 0°: input=right, output=bottom
      // We need to find rotation where input ends up on inputSide
      
      // Map of (inputSide, outputSide) -> rotation needed
      // Using the fact that rotateSide rotates clockwise:
      // At 0°: input=right, output=bottom
      // At 90°: input=bottom, output=left
      // At 180°: input=left, output=top
      // At 270°: input=top, output=right
      
      const cornerConfigs: { input: string; output: string; rotation: Rotation }[] = [
        { input: 'right', output: 'bottom', rotation: 0 },
        { input: 'bottom', output: 'left', rotation: 90 },
        { input: 'left', output: 'top', rotation: 180 },
        { input: 'top', output: 'right', rotation: 270 },
      ];
      
      // Find matching config
      let match = cornerConfigs.find(c => c.input === inputSide && c.output === outputSide);
      if (match) {
        return { type: 'CORNER', rotation: match.rotation, isFlipped: false };
      }
      
      // If no direct match, we need the flipped version (swap input/output logic)
      // Flipped corner: outputs become inputs
      // At 0° flipped: input=bottom, output=right
      // At 90° flipped: input=left, output=bottom
      // At 180° flipped: input=top, output=left
      // At 270° flipped: input=right, output=top
      
      const flippedConfigs: { input: string; output: string; rotation: Rotation }[] = [
        { input: 'bottom', output: 'right', rotation: 0 },
        { input: 'left', output: 'bottom', rotation: 90 },
        { input: 'top', output: 'left', rotation: 180 },
        { input: 'right', output: 'top', rotation: 270 },
      ];
      
      match = flippedConfigs.find(c => c.input === inputSide && c.output === outputSide);
      if (match) {
        return { type: 'CORNER', rotation: match.rotation, isFlipped: true };
      }
    }
  }
  
  // Default fallback
  return { type: 'STRAIGHT', rotation: 0, isFlipped: false };
}

// Generate a solvable puzzle
export function generateSolvablePuzzle(gridSize: number, level: number = 1): GameState {
  // Start from left side, end at right side
  const startRow = Math.floor(Math.random() * (gridSize - 2)) + 1;
  const endRow = Math.floor(Math.random() * (gridSize - 2)) + 1;
  
  const startPos: Position = { row: startRow, col: 0 };
  const endPos: Position = { row: endRow, col: gridSize - 1 };
  
  // Generate a valid path
  const path = generatePath(gridSize, startPos, endPos);
  const pathSet = new Map<string, number>();
  path.forEach((pos, idx) => pathSet.set(`${pos.row}-${pos.col}`, idx));
  
  // Create the grid and track solution for path tiles
  const grid: Tile[][] = [];
  const solution: { row: number; col: number; rotation: Rotation; isFlipped: boolean }[] = [];
  const tileTypes: TileType[] = ['STRAIGHT', 'CORNER', 'TJUNCTION'];
  if (level > 2) tileTypes.push('CROSS');
  
  for (let row = 0; row < gridSize; row++) {
    const gridRow: Tile[] = [];
    for (let col = 0; col < gridSize; col++) {
      const key = `${row}-${col}`;
      const pathIdx = pathSet.get(key);
      
      if (pathIdx !== undefined) {
        // This cell is part of the path
        const prev = pathIdx > 0 ? path[pathIdx - 1] : null;
        const current = path[pathIdx];
        const next = pathIdx < path.length - 1 ? path[pathIdx + 1] : null;
        
        const { type, rotation: solutionRotation, isFlipped: solutionFlipped } = getTileForPath(prev, current, next);
        
        // Store the solution BEFORE scrambling
        solution.push({
          row,
          col,
          rotation: solutionRotation,
          isFlipped: solutionFlipped,
        });
        
        // Scramble the rotation to create the puzzle
        const rotations: Rotation[] = [0, 90, 180, 270];
        const scrambledRotation = rotations[Math.floor(Math.random() * rotations.length)];
        
        gridRow.push({
          id: `tile-${row}-${col}`,
          row,
          col,
          type,
          rotation: scrambledRotation,
          isLocked: false,
          isFlipped: Math.random() > 0.5, // Random flip state
        });
      } else {
        // Random filler tile
        gridRow.push(createRandomTile(row, col, tileTypes));
      }
    }
    grid.push(gridRow);
  }
  
  return {
    grid,
    gridSize,
    startPos,
    endPos,
    selectedTile: null,
    timer: 240, // 4 minutes
    moves: 0,
    gameStatus: 'playing',
    pathCells: [],
    level,
    solution,
  };
}

// Rotate a tile 90 degrees clockwise
export function rotateTile(tile: Tile): Tile {
  const rotations: Rotation[] = [0, 90, 180, 270];
  const currentIdx = rotations.indexOf(tile.rotation);
  const newRotation = rotations[(currentIdx + 1) % 4];
  
  return {
    ...tile,
    rotation: newRotation,
  };
}

// Flip a tile (reverse arrow direction)
export function flipTile(tile: Tile): Tile {
  return {
    ...tile,
    isFlipped: !tile.isFlipped,
  };
}
