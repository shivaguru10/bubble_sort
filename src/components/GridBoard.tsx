import React from 'react';
import { Tile } from './Tile';
import type { Tile as TileType, Position } from '../types/game';
import { ArrowRight } from 'lucide-react';

interface GridBoardProps {
  grid: TileType[][];
  startPos: Position;
  endPos: Position;
  selectedTile: Position | null;
  pathCells: string[];
  brokenTileId?: string; // ID of tile where path breaks
  onTileClick: (position: Position) => void;
}

export const GridBoard: React.FC<GridBoardProps> = ({
  grid,
  startPos,
  endPos,
  selectedTile,
  pathCells,
  brokenTileId,
  onTileClick,
}) => {
  const gridSize = grid.length;
  const pathSet = new Set(pathCells);
  
  return (
    <div className="relative inline-block">
      {/* Start indicator */}
      <div 
        className="absolute left-0 flex items-center justify-center z-20"
        style={{
          top: `${(startPos.row / gridSize) * 100}%`,
          height: `${100 / gridSize}%`,
          transform: 'translateX(-100%)',
        }}
      >
        <div className="flex items-center gap-1 px-2 py-1 bg-blue-600 rounded-l-full text-white shadow-lg">
          <span className="text-xs font-bold">IN</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
      
      {/* End indicator */}
      <div 
        className="absolute right-0 flex items-center justify-center z-20"
        style={{
          top: `${(endPos.row / gridSize) * 100}%`,
          height: `${100 / gridSize}%`,
          transform: 'translateX(100%)',
        }}
      >
        <div className="flex items-center gap-1 px-2 py-1 bg-green-600 rounded-r-full text-white shadow-lg">
          <ArrowRight className="w-4 h-4" />
          <span className="text-xs font-bold">OUT</span>
        </div>
      </div>
      
      {/* Grid */}
      <div 
        className="grid gap-0.5 bg-gray-300 p-1 rounded-lg shadow-xl"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(80vw, 500px)`,
          height: `min(80vw, 500px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <Tile
              key={tile.id}
              tile={tile}
              isSelected={selectedTile?.row === rowIndex && selectedTile?.col === colIndex}
              isInPath={pathSet.has(tile.id)}
              isBroken={tile.id === brokenTileId}
              onClick={() => onTileClick({ row: rowIndex, col: colIndex })}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GridBoard;
