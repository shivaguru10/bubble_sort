import type { Tile, Position, Side, TilePorts } from '../types/game';

// =============================================================================
// CORE: Directional Port System
// Each tile has INPUT ports (where flow enters) and OUTPUT ports (where flow exits)
// =============================================================================

/**
 * Get the input/output ports for a tile based on its type, rotation, and flip state.
 * This is the CRUCIAL function that determines flow direction based on rotation/flip
 */
export function getPorts(tile: Tile): TilePorts {
  // Get base ports for the tile type (at 0° rotation, not flipped)
  let ports = getBasePorts(tile.type);
  
  // Apply rotation to both inputs and outputs
  ports = {
    inputs: ports.inputs.map(side => rotateSide(side, tile.rotation)),
    outputs: ports.outputs.map(side => rotateSide(side, tile.rotation)),
  };
  
  // Handle flip based on tile type
  if (tile.isFlipped) {
    if (tile.type === 'TJUNCTION') {
      // For T-junction, flip changes WHICH opening is the input
      // Instead of swapping all, we cycle: if input was on one output, move it to another
      // At any rotation, T-junction has 3 openings. Flip makes a different one the input.
      // Simple approach: swap the input with one of the outputs
      const currentInput = ports.inputs[0];
      const newInput = ports.outputs[0]; // Take first output as new input
      ports = {
        inputs: [newInput],
        outputs: [currentInput, ports.outputs[1]], // Original input becomes output
      };
    } else {
      // For other tiles (STRAIGHT, CORNER), swap inputs and outputs (reverse flow)
      ports = {
        inputs: ports.outputs,
        outputs: ports.inputs,
      };
    }
  }
  
  return ports;
}

/**
 * Get base ports for each tile type at 0° rotation (not flipped)
 * Flow direction: Input → Output
 * MUST match the physical openings defined in gridGenerator.ts
 */
function getBasePorts(type: Tile['type']): TilePorts {
  switch (type) {
    case 'STRAIGHT':
      // Horizontal pipe: opens left-right, flow goes left→right
      return { inputs: ['left'], outputs: ['right'] };
    case 'CORNER':
      // L-bend: opens right-bottom (not left!), flow goes right→bottom
      return { inputs: ['right'], outputs: ['bottom'] };
    case 'TJUNCTION':
      // T-shape: opens left, right, bottom - flow enters left, exits to right+bottom
      return { inputs: ['left'], outputs: ['right', 'bottom'] };
    case 'CROSS':
      // Cross is bidirectional - all sides work as both input and output
      return { inputs: ['top', 'bottom', 'left', 'right'], outputs: ['top', 'bottom', 'left', 'right'] };
    case 'EMPTY':
    default:
      return { inputs: [], outputs: [] };
  }
}

/**
 * Rotate a side by a given angle (clockwise)
 */
function rotateSide(side: Side, rotation: Tile['rotation']): Side {
  const sides: Side[] = ['top', 'right', 'bottom', 'left'];
  const currentIndex = sides.indexOf(side);
  const rotationSteps = rotation / 90;
  const newIndex = (currentIndex + rotationSteps) % 4;
  return sides[newIndex];
}

/**
 * Get the opposite side (for checking if tiles can connect)
 */
function getOppositeSide(side: Side): Side {
  switch (side) {
    case 'top': return 'bottom';
    case 'bottom': return 'top';
    case 'left': return 'right';
    case 'right': return 'left';
  }
}

/**
 * Get the adjacent position in a given direction
 */
function getAdjacentPosition(pos: Position, side: Side): Position {
  switch (side) {
    case 'top': return { row: pos.row - 1, col: pos.col };
    case 'bottom': return { row: pos.row + 1, col: pos.col };
    case 'left': return { row: pos.row, col: pos.col - 1 };
    case 'right': return { row: pos.row, col: pos.col + 1 };
  }
}

/**
 * Returns which sides of a tile are "open" (have any port - input or output)
 * Used for visual rendering of tile connections
 */
export function getTileOpenSides(tile: Tile): Side[] {
  const ports = getPorts(tile);
  const allSides = new Set<Side>([...ports.inputs, ...ports.outputs]);
  return Array.from(allSides);
}

// =============================================================================
// PATH VALIDATION: Trace path from start to end with head-to-tail checking
// =============================================================================

export interface ValidationResult {
  isValid: boolean;
  path: string[]; // Tile IDs that form the valid path
  brokenAt?: string; // Tile ID where connection breaks (for red highlight)
}

/**
 * Validate the path from start to end using strict head-to-tail connectivity
 * Flow Direction: Each tile's OUTPUT must connect to the next tile's INPUT
 */
export function validatePath(
  grid: Tile[][],
  startPos: Position,
  endPos: Position
): ValidationResult {
  const gridSize = grid.length;
  const path: string[] = [];
  const visited = new Set<string>();
  
  // Start tile - flow enters from the left (outside the grid)
  const startTile = grid[startPos.row][startPos.col];
  const startPorts = getPorts(startTile);
  
  // Check if start tile can accept input from the left (entry point)
  if (!startPorts.inputs.includes('left')) {
    return { isValid: false, path: [], brokenAt: startTile.id };
  }
  
  // BFS traversal with directional connection verification
  // Each queue entry: position + the side we entered from
  const queue: { pos: Position; entrySide: Side }[] = [
    { pos: startPos, entrySide: 'left' }
  ];
  
  while (queue.length > 0) {
    const { pos, entrySide } = queue.shift()!;
    const key = `${pos.row}-${pos.col}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    const tile = grid[pos.row][pos.col];
    const ports = getPorts(tile);
    
    // Verify this tile can accept input from the entry side
    if (!ports.inputs.includes(entrySide)) {
      return { isValid: false, path, brokenAt: tile.id };
    }
    
    path.push(tile.id);
    
    // Check if we've reached the end
    if (pos.row === endPos.row && pos.col === endPos.col) {
      // End tile must have an output on the right (to allow exit)
      if (ports.outputs.includes('right')) {
        return { isValid: true, path };
      } else {
        return { isValid: false, path, brokenAt: tile.id };
      }
    }
    
    // Find all possible exits via OUTPUT ports (excluding entry side which is an input)
    for (const outputSide of ports.outputs) {
      const nextPos = getAdjacentPosition(pos, outputSide);
      const nextKey = `${nextPos.row}-${nextPos.col}`;
      
      // Check bounds
      if (nextPos.row < 0 || nextPos.row >= gridSize ||
          nextPos.col < 0 || nextPos.col >= gridSize) {
        continue; // Out of bounds
      }
      
      if (visited.has(nextKey)) continue;
      
      // HEAD-TO-TAIL CHECK:
      // Our output goes in direction 'outputSide'
      // The next tile must have an INPUT on the opposite side
      const nextTile = grid[nextPos.row][nextPos.col];
      const nextPorts = getPorts(nextTile);
      const requiredInputSide = getOppositeSide(outputSide);
      
      if (nextPorts.inputs.includes(requiredInputSide)) {
        queue.push({ pos: nextPos, entrySide: requiredInputSide });
      }
    }
  }
  
  // Path didn't reach the end
  return { isValid: false, path, brokenAt: path.length > 0 ? path[path.length - 1] : undefined };
}

/**
 * Check if two adjacent tiles are connected with proper directionality
 * tile1's output must connect to tile2's input
 */
export function areTilesConnected(
  tile1: Tile,
  tile2: Tile,
  tile1Side: Side
): boolean {
  const tile1Ports = getPorts(tile1);
  const tile2Ports = getPorts(tile2);
  const tile2RequiredSide = getOppositeSide(tile1Side);
  
  // tile1 must have an output on tile1Side, tile2 must have an input on the opposite side
  return tile1Ports.outputs.includes(tile1Side) && tile2Ports.inputs.includes(tile2RequiredSide);
}

// Re-export for compatibility
export { getAdjacentPosition as getAdjacentPos };

