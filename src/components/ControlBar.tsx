import React from 'react';
import { RotateCw, FlipHorizontal, Check, Lightbulb } from 'lucide-react';

interface ControlBarProps {
  onRotate: () => void;
  onFlip: () => void;
  onSubmit: () => void;
  onShowAnswer: () => void;
  hasSelection: boolean;
  disabled: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  onRotate,
  onFlip,
  onSubmit,
  onShowAnswer,
  hasSelection,
  disabled,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4">
      {/* Rotate Button - 90° clockwise */}
      <button
        onClick={onRotate}
        disabled={disabled || !hasSelection}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full
          transition-all duration-150 transform
          ${hasSelection && !disabled
            ? 'bg-gray-800 text-white hover:bg-gray-700 hover:scale-110 active:scale-90 shadow-lg'
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'}
        `}
        title="Rotate 90° Clockwise"
      >
        <RotateCw className="w-7 h-7" />
      </button>
      
      {/* Flip Button - Reverse arrow direction */}
      <button
        onClick={onFlip}
        disabled={disabled || !hasSelection}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full
          transition-all duration-150 transform
          ${hasSelection && !disabled
            ? 'bg-gray-800 text-white hover:bg-gray-700 hover:scale-110 active:scale-90 shadow-lg'
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'}
        `}
        title="Flip Arrow Direction"
      >
        <FlipHorizontal className="w-7 h-7" />
      </button>
      
      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={disabled}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full
          transition-all duration-150 transform
          ${!disabled
            ? 'bg-gray-800 text-white hover:bg-green-600 hover:scale-110 active:scale-90 shadow-lg'
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'}
        `}
        title="Check Path"
      >
        <Check className="w-8 h-8" strokeWidth={3} />
      </button>
      
      {/* Show Answer Button */}
      <button
        onClick={onShowAnswer}
        disabled={disabled}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full
          transition-all duration-150 transform
          ${!disabled
            ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 hover:scale-110 active:scale-90 shadow-lg'
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'}
        `}
        title="Show Answer"
      >
        <Lightbulb className="w-7 h-7" />
      </button>
    </div>
  );
};

export default ControlBar;

