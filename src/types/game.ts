// Game type definitions
// Force reload

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Side = 'top' | 'bottom' | 'left' | 'right';
export type TileType = "STRAIGHT" | "CORNER" | "TJUNCTION" | "CROSS" | "EMPTY";
export type Rotation = 0 | 90 | 180 | 270;

// Directional ports for head-to-tail path validation
export interface TilePorts {
  inputs: Side[];
  outputs: Side[];
}

// Solution for a single tile
export interface TileSolution {
  row: number;
  col: number;
  rotation: Rotation;
  isFlipped: boolean;
}

export interface Tile {
  id: string;
  row: number;
  col: number;
  type: TileType;
  rotation: Rotation;
  isLocked: boolean;
  isFlipped: boolean; // When true, arrow direction is reversed
}

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  grid: Tile[][];
  gridSize: number;
  startPos: Position;
  endPos: Position;
  selectedTile: Position | null;
  timer: number;
  moves: number;
  gameStatus: "playing" | "won" | "lost" | "timeout" | "answer_shown";
  pathCells: string[];
  brokenTileId?: string; // ID of tile where path breaks (for red highlight)
  level: number;
  solution: TileSolution[]; // Stores the correct rotation/flip for path tiles
}

// Tile connection definitions based on type and rotation
export interface TileConnections {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export type GameAction =
  | { type: "SELECT_TILE"; position: Position }
  | { type: "ROTATE_TILE" }
  | { type: "FLIP_TILE" }
  | { type: "TICK_TIMER" }
  | { type: "VALIDATE_PATH" }
  | { type: "SET_PATH"; pathCells: string[] }
  | { type: "SET_GAME_STATUS"; status: GameState["gameStatus"] }
  | { type: "NEW_GAME" }
  | { type: "NEXT_LEVEL" }
  | { type: "SHOW_ANSWER" };

