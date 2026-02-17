import React from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import { ProductCardProps } from '../types';

export const Card: React.FC<ProductCardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  href, 
  tag, 
  theme = 'light', 
  size = 'normal',
  onToast
}) => {
  const isDark = theme === 'dark';

  const handleClick = (e: React.MouseEvent) => {
    if (href === '#') {
      e.preventDefault();
      if (onToast) onToast();
    }
  };

  return (
    <a 
      href={href} 
      target={href === '#' ? undefined : "_blank"}
      rel="noopener noreferrer"
      onClick={handleClick}
      // Combined 'isolate' for clipping fix with new hover animations
      // Hover: Moves up (-translate-y-2), scales up slightly, shadow expands
      className={`group relative isolate overflow-hidden rounded-[2.5rem] transform-gpu will-change-transform 
        transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
        hover:-translate-y-3 hover:scale-[1.02] 
        ${size === 'wide' ? 'md:col-span-2' : 'col-span-1'}
        ${isDark 
          ? 'bg-black text-white shadow-2xl shadow-black/20 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]' 
          : 'bg-white/40 backdrop-blur-[50px] backdrop-saturate-[180%] border border-white/40 text-gray-900 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_50px_100px_-20px_rgba(50,50,93,0.15)] hover:bg-white/60 hover:border-white/60'}
        h-[420px] md:h-[500px] flex flex-col cursor-pointer
      `}
      style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
    >
      {/* Background Image Area - Subtle parallax zoom on hover */}
      <div className={`absolute inset-0 z-0 overflow-hidden ${isDark ? 'opacity-60' : 'opacity-100 mix-blend-overlay'}`}>
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transform-gpu transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110 will-change-transform"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-black/40 to-transparent' : 'from-white/95 via-white/30 to-transparent'}`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          {tag && (
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border backdrop-blur-xl transition-colors duration-500 ${
              isDark 
                ? 'bg-white/10 text-white border-white/20 group-hover:bg-white/20' 
                : 'bg-white/60 text-gray-900 border-white/50 group-hover:bg-white/80'
            }`}>
              {tag}
            </span>
          )}
          {href === '#' ? (
            <Lock className={`w-5 h-5 transition-colors duration-500 ${isDark ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}`} />
          ) : (
            <div className={`p-2.5 rounded-full transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 ${
              isDark ? 'bg-white/20 text-white group-hover:bg-white group-hover:text-black' : 'bg-black/5 text-black group-hover:bg-black group-hover:text-white'
            }`}>
               <ArrowUpRight className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Text Container - Slight movement on hover for depth */}
        <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
          <h3 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1]">
            {title}
          </h3>
          <p className={`text-sm md:text-lg leading-relaxed max-w-sm font-medium transition-opacity duration-500 ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-800'}`}>
            {description}
          </p>
          
          <div className="mt-8 flex items-center overflow-hidden h-6">
             <span className={`text-xs font-semibold border-b transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform-gpu ${
               isDark ? 'border-white text-white' : 'border-black text-black'
             } translate-y-8 group-hover:translate-y-0`}>
               {href === '#' ? 'Coming Soon' : '立即访问'}
             </span>
          </div>
        </div>
      </div>
    </a>
  );
};