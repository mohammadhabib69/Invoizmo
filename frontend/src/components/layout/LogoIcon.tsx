import React from 'react';

export function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
    >
      <rect width="200" height="200" rx="40" fill="transparent"/>
      {/* Document Body */}
      <path 
        d="M60 40H120L150 70V160C150 165.523 145.523 170 140 170H60C54.4772 170 50 165.523 50 160V50C50 44.4772 54.4772 40 60 40Z" 
        fill="currentColor" 
        className="text-primary"
      />
      {/* Folded Corner */}
      <path 
        d="M120 40V70H150" 
        fill="currentColor" 
        className="text-secondary opacity-80"
        strokeLinejoin="round"
      />
      {/* Decorative Lines */}
      <path d="M70 85H110" stroke="white" strokeWidth="6" strokeLinecap="round" className="opacity-30"/>
      <path d="M70 110H130" stroke="white" strokeWidth="6" strokeLinecap="round" className="opacity-30"/>
      <path d="M70 135H110" stroke="white" strokeWidth="6" strokeLinecap="round" className="opacity-30"/>
      
      {/* Checkmark Circle */}
      <circle cx="155" cy="155" r="35" fill="currentColor" className="text-secondary shadow-lg" />
      <path 
        d="M142 155L152 165L168 145" 
        stroke="white" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
