import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="text-2xl font-bold tracking-tighter">G胖儿GongPan</div>
        <p className="text-xs text-gray-400 tracking-widest uppercase">
          &copy; 2026 Designed for Simplicity.
        </p>
        <div className="flex space-x-6 mt-4">
          <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors">Privacy</a>
          <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors">Terms</a>
          <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};