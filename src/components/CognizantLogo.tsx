import React from 'react';

export const CognizantLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.627 0 12-5.373 12-12h-4c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8c4.418 0 8 3.582 8 8h4c0-6.627-5.373-12-12-12z" 
    />
  </svg>
);
