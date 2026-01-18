import React from 'react';

export const AccentureLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 60 60" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M15 10 L45 30 L15 50" 
      stroke="#A100FF" 
      strokeWidth="12" 
      strokeLinecap="square"
      fill="none"
    />
  </svg>
);
