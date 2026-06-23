import React from 'react';
import { useTheme } from '../App';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 36, className = '' }) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  // Liquid glass border and container styling
  const glassContainerStyle = isDark
    ? 'bg-black/30 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md'
    : 'bg-white/40 border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md';

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl p-1.5 transition-all duration-300 ease-out hover:scale-115 active:scale-95 cursor-pointer transform-gpu ${glassContainerStyle} ${className}`}
      style={{ width: size, height: size }}
      id="brand-logo-container"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized leaf at the top right */}
        <path
          d="M 51,26 C 51,26 65,10 78,8 C 78,8 65,28 51,26 Z"
          fill="#4C6044"
          stroke="#4C6044"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Right orange semi-circle slice */}
        <path
          d="M 52.5,23.5 A 31.5,31.5 0 0,1 52.5,86.5 Z"
          fill="#FF7E0F"
        />

        {/* Outer rind arc highlight on the right */}
        <path
          d="M 55.5,19.5 A 35.5,35.5 0 0,1 77.5,60.5"
          stroke="#FF7E0F"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Top-left slice (cream color) */}
        <path
          d="M 47.5,23 A 31,31 0 0,0 16.5,54 L 47.5,54 Z"
          fill="#F4EDE2"
        />

        {/* Middle-left slice (dark charcoal color, adjusted dynamically for dark/light mode visibility) */}
        <path
          d="M 46.5,56 L 15.5,56 A 31,31 0 0,0 23.5,71.5 L 46.5,56 Z"
          fill={isDark ? '#2D302B' : '#1F221E'}
        />

        {/* Bottom-left slice (orange color) */}
        <path
          d="M 47.5,58.5 L 25.5,74 A 31,31 0 0,0 47.5,85.5 Z"
          fill="#FF7E0F"
        />
      </svg>
    </div>
  );
};
