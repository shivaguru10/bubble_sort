import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  seconds: number;
}

export const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  const isLowTime = seconds <= 60;
  const isCritical = seconds <= 30;
  
  return (
    <div 
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        font-mono text-2xl font-bold
        transition-all duration-300
        ${isCritical ? 'bg-red-600 text-white animate-pulse' : 
          isLowTime ? 'bg-yellow-500 text-gray-900' : 
          'bg-gray-800 text-white'}
      `}
    >
      <Clock className="w-6 h-6" />
      <span>
        {minutes.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
