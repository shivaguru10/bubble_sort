import React from 'react';
import type { Tile as TileType, Side } from '../types/game';
import { getTileOpenSides, getPorts } from '../utils/pathValidator';

interface TileProps {
  tile: TileType;
  isSelected: boolean;
  isInPath: boolean;
  isBroken?: boolean; // For highlighting broken connections
  onClick: () => void;
}

// Convert open sides to a connections object for rendering
function sidesToConnections(sides: Side[]): { top: boolean; bottom: boolean; left: boolean; right: boolean } {
  return {
    top: sides.includes('top'),
    bottom: sides.includes('bottom'),
    left: sides.includes('left'),
    right: sides.includes('right'),
  };
}

// Determine arrow direction based on input/output ports
function getArrowDirection(tile: TileType): { isHorizontal: boolean; isReversed: boolean } {
  const ports = getPorts(tile);
  const hasRightInput = ports.inputs.includes('right');
  const hasBottomInput = ports.inputs.includes('bottom');
  
  // For straight tiles, determine if horizontal or vertical
  const openSides = getTileOpenSides(tile);
  const isHorizontal = openSides.includes('left') && openSides.includes('right');
  
  // Determine if flow is reversed (right-to-left or bottom-to-top)
  let isReversed = false;
  if (isHorizontal) {
    isReversed = hasRightInput; // Flow from right to left
  } else {
    isReversed = hasBottomInput; // Flow from bottom to top
  }
  
  return { isHorizontal, isReversed };
}

// SVG Arrow components for different tile types
const ArrowStraight: React.FC<{ tile: TileType }> = ({ tile }) => {
  const { isHorizontal, isReversed } = getArrowDirection(tile);
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div 
        className={`flex items-center justify-center gap-0.5 ${isHorizontal ? 'flex-row' : 'flex-col'}`}
        style={{ 
          width: isHorizontal ? '100%' : '16px',
          height: isHorizontal ? '16px' : '100%',
          backgroundColor: '#4a5568',
          padding: '2px 4px',
          transform: isReversed ? (isHorizontal ? 'scaleX(-1)' : 'scaleY(-1)') : 'none',
        }}
      >
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-3 h-3 text-white flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d={isHorizontal ? "M5 12h14m-4-4l4 4-4 4" : "M12 5v14m-4-4l4 4 4-4"} 
            />
          </svg>
        ))}
      </div>
    </div>
  );
};

const ArrowCorner: React.FC<{ tile: TileType }> = ({ tile }) => {
  const openSides = getTileOpenSides(tile);
  const connections = sidesToConnections(openSides);
  const ports = getPorts(tile);
  
  // Corner has exactly 2 open sides. Draw the L-shape path between them.
  // Coordinates: left=8, right=92, top=8, bottom=92, center=50
  let pathD = '';
  
  // All possible corner orientations (2 connected sides)
  if (connections.right && connections.bottom) {
    // Opens right and bottom: L from right edge to bottom edge
    pathD = 'M 92 50 L 50 50 L 50 92';
  } else if (connections.bottom && connections.left) {
    // Opens bottom and left: L from bottom edge to left edge
    pathD = 'M 50 92 L 50 50 L 8 50';
  } else if (connections.left && connections.top) {
    // Opens left and top: L from left edge to top edge
    pathD = 'M 8 50 L 50 50 L 50 8';
  } else if (connections.top && connections.right) {
    // Opens top and right: L from top edge to right edge
    pathD = 'M 50 8 L 50 50 L 92 50';
  }
  
  // Draw arrows ONLY at output ports to show flow direction
  const arrowPaths: string[] = [];
  if (ports.outputs.includes('right')) {
    arrowPaths.push('M 85 44 L 92 50 L 85 56'); // Arrow pointing right
  }
  if (ports.outputs.includes('left')) {
    arrowPaths.push('M 15 44 L 8 50 L 15 56'); // Arrow pointing left
  }
  if (ports.outputs.includes('bottom')) {
    arrowPaths.push('M 44 85 L 50 92 L 56 85'); // Arrow pointing down
  }
  if (ports.outputs.includes('top')) {
    arrowPaths.push('M 44 15 L 50 8 L 56 15'); // Arrow pointing up
  }
  
  return (
    <svg 
      className="absolute inset-0 w-full h-full" 
      viewBox="0 0 100 100"
    >
      <path
        d={pathD}
        fill="none"
        stroke="#4a5568"
        strokeWidth="16"
        strokeLinecap="square"
      />
      {arrowPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};

const ArrowTJunction: React.FC<{ tile: TileType }> = ({ tile }) => {
  const openSides = getTileOpenSides(tile);
  const connections = sidesToConnections(openSides);
  const ports = getPorts(tile);
  
  return (
    <svg 
      className="absolute inset-0 w-full h-full" 
      viewBox="0 0 100 100"
    >
      {/* Horizontal line */}
      {(connections.left || connections.right) && (
        <line
          x1={connections.left ? 8 : 50}
          y1="50"
          x2={connections.right ? 92 : 50}
          y2="50"
          stroke="#4a5568"
          strokeWidth="16"
        />
      )}
      {/* Vertical line */}
      {(connections.top || connections.bottom) && (
        <line
          x1="50"
          y1={connections.top ? 8 : 50}
          x2="50"
          y2={connections.bottom ? 92 : 50}
          stroke="#4a5568"
          strokeWidth="16"
        />
      )}
      {/* Arrows only at output ports */}
      {ports.outputs.includes('right') && (
        <path d="M 85 44 L 92 50 L 85 56" fill="none" stroke="white" strokeWidth="2" />
      )}
      {ports.outputs.includes('left') && (
        <path d="M 15 44 L 8 50 L 15 56" fill="none" stroke="white" strokeWidth="2" />
      )}
      {ports.outputs.includes('bottom') && (
        <path d="M 44 85 L 50 92 L 56 85" fill="none" stroke="white" strokeWidth="2" />
      )}
      {ports.outputs.includes('top') && (
        <path d="M 44 15 L 50 8 L 56 15" fill="none" stroke="white" strokeWidth="2" />
      )}
    </svg>
  );
};

const ArrowCross: React.FC = () => {
  // Cross tiles are bidirectional, show arrows at all ends
  return (
    <svg 
      className="absolute inset-0 w-full h-full" 
      viewBox="0 0 100 100"
    >
      {/* Horizontal line */}
      <line x1="8" y1="50" x2="92" y2="50" stroke="#4a5568" strokeWidth="16" />
      {/* Vertical line */}
      <line x1="50" y1="8" x2="50" y2="92" stroke="#4a5568" strokeWidth="16" />
      {/* Arrows at all ends for bidirectional flow */}
      <path d="M 85 44 L 92 50 L 85 56" fill="none" stroke="white" strokeWidth="2" />
      <path d="M 15 44 L 8 50 L 15 56" fill="none" stroke="white" strokeWidth="2" />
      <path d="M 44 85 L 50 92 L 56 85" fill="none" stroke="white" strokeWidth="2" />
      <path d="M 44 15 L 50 8 L 56 15" fill="none" stroke="white" strokeWidth="2" />
    </svg>
  );
};

export const Tile: React.FC<TileProps> = ({ tile, isSelected, isInPath, isBroken, onClick }) => {
  const renderTileContent = () => {
    switch (tile.type) {
      case 'STRAIGHT':
        return <ArrowStraight tile={tile} />;
      case 'CORNER':
        return <ArrowCorner tile={tile} />;
      case 'TJUNCTION':
        return <ArrowTJunction tile={tile} />;
      case 'CROSS':
        return <ArrowCross />;
      default:
        return null;
    }
  };
  
  return (
    <div
      onClick={onClick}
      className={`
        relative w-full aspect-square cursor-pointer
        transition-all duration-150 ease-out
        bg-gray-100 border border-gray-300
        hover:bg-gray-50 active:scale-95
        ${isSelected ? 'ring-4 ring-yellow-400 ring-inset z-10 shadow-lg' : ''}
        ${isInPath ? 'bg-green-100 border-green-400' : ''}
        ${isBroken ? 'bg-red-100 border-red-400' : ''}
      `}
    >
      {renderTileContent()}
      {isInPath && (
        <div className="absolute inset-0 bg-green-400 opacity-30 pointer-events-none" />
      )}
      {isBroken && (
        <div className="absolute inset-0 bg-red-400 opacity-30 pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

export default Tile;

