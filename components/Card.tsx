import React from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import { ProductCardProps } from '../types';
import { useTheme } from '../App';

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
  const { visualEffect } = useTheme();
  const isDark = theme === 'dark';

  const handleClick = (e: React.MouseEvent) => {
    if (href === '#') {
      e.preventDefault();
      if (onToast) onToast();
    }
  };

  // 1. 卡片主体样式 (Main Card Container)
  const getGlassClasses = () => {
    if (isDark) {
      return 'bg-black text-white shadow-2xl shadow-black/20';
    }

    if (visualEffect === 'liquid') {
      // Liquid Glass: High transparency, Clearer Blur, Specular Highlights
      // "Wet" look: bg-white/10, backdrop-saturate-200, shiny border, inner specular highlights
      return 'bg-white/10 backdrop-blur-[15px] backdrop-saturate-[200%] border border-white/40 text-gray-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(50,50,93,0.2)] hover:bg-white/15 hover:border-white/60 active:shadow-[0_20px_40px_-10px_rgba(50,50,93,0.15)] active:bg-white/20 active:border-white/80';
    } else {
      // Gaussian Blur: Higher Opacity, Standard Blur, Matte Finish (No shine)
      // "Dry" look: bg-white/80, standard blur, flat border
      return 'bg-white/85 backdrop-blur-xl border border-white/50 text-gray-900 shadow-md hover:shadow-xl hover:bg-white/95 active:shadow-lg active:bg-white';
    }
  };

  // 2. 标签样式 (Tag Styles)
  const getTagStyle = () => {
    if (isDark) return 'bg-white/10 text-white border-white/20 group-hover:bg-white/20 group-active:bg-white/30';
    
    if (visualEffect === 'liquid') {
      // Liquid Tag: Shiny, transparent, inset glow
      return 'bg-white/20 text-gray-900 border-white/40 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] group-hover:bg-white/40 group-hover:border-white/60 group-active:bg-white/50 group-active:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]';
    } else {
      // Blur Tag: Matte, solid feel, no shine
      return 'bg-gray-100/80 text-gray-600 border-transparent group-hover:bg-gray-200 group-active:bg-gray-300';
    }
  };

  // 3. 按钮样式 (Arrow/Lock Button Styles)
  const getButtonStyle = () => {
    if (isDark) return 'bg-white/20 text-white hover:bg-white hover:text-black';

    if (visualEffect === 'liquid') {
      // Liquid Button: Shiny bubble look
      return 'bg-white/20 text-black border border-white/40 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] hover:bg-white/40 hover:scale-110 active:scale-95 active:bg-white/60';
    } else {
      // Blur Button: Matte gray circle
      return 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black hover:scale-105 active:scale-95 active:bg-gray-300';
    }
  };

  return (
    <a 
      href={href} 
      target={href === '#' ? undefined : "_blank"}
      rel="noopener noreferrer"
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      draggable="false"
      className={`group relative isolate overflow-hidden rounded-[2.5rem] transform-gpu will-change-transform 
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        
        /* Desktop Hover - Only apply when device supports hover to prevent mobile stickiness */
        md:hover:-translate-y-3 md:hover:scale-[1.02] md:hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)]
        
        /* Active effect - Subtle press down, stable for mobile */
        active:scale-[0.98] active:translate-y-0 active:shadow-inner active:duration-75
        
        ${size === 'wide' ? 'md:col-span-2' : 'col-span-1'}
        ${getGlassClasses()}
        h-[420px] md:h-[500px] flex flex-col cursor-pointer
        touch-manipulation select-none
      `}
      style={{ 
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        WebkitTouchCallout: 'none' // Disable Safari long-press menu
      }}
    >
      {/* Background Image Area */}
      {/* Liquid needs mix-blend to look integrated/wet. Blur needs natural colors. */}
      <div className={`absolute inset-0 z-0 overflow-hidden ${isDark ? 'opacity-60' : visualEffect === 'liquid' ? 'opacity-90 mix-blend-overlay' : 'opacity-100'}`}>
        <img 
          src={imageUrl} 
          alt={title} 
          loading="lazy"
          decoding="async"
          draggable="false"
          className="w-full h-full object-cover transform-gpu transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110 group-active:scale-105 will-change-transform"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${
          isDark 
            ? 'from-black via-black/40 to-transparent' 
            : visualEffect === 'liquid'
              ? 'from-white/80 via-white/10 to-transparent' // Liquid: Clearer middle
              : 'from-white/95 via-white/40 to-transparent' // Blur: More opaque fade
        }`}></div>
      </div>

      {/* Glossy Reflection Overlay for Liquid Glass */}
      {!isDark && visualEffect === 'liquid' && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/10 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          {tag && (
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-colors duration-500 ${getTagStyle()}`}>
              {tag}
            </span>
          )}
          
          <div className={`p-2.5 rounded-full transition-all duration-500 flex items-center justify-center ${getButtonStyle()}`}>
            {href === '#' ? (
               <Lock className="w-5 h-5" />
            ) : (
               <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 group-active:rotate-45 transition-transform duration-300" />
            )}
          </div>
        </div>

        {/* Text Container */}
        <div className="transform transition-transform duration-500 group-hover:-translate-y-1 group-active:-translate-y-0.5">
          <h3 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1]">
            {title}
          </h3>
          <p className={`text-sm md:text-lg leading-relaxed max-w-sm font-medium transition-opacity duration-500 ${isDark ? 'text-gray-400 group-hover:text-gray-300 group-active:text-gray-300' : 'text-gray-600 group-hover:text-gray-800 group-active:text-gray-800'}`}>
            {description}
          </p>
          
          <div className="mt-8 flex items-center overflow-hidden h-6">
             <span className={`text-xs font-semibold border-b transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform-gpu ${
               isDark ? 'border-white text-white' : 'border-black text-black'
             } translate-y-8 group-hover:translate-y-0 group-active:translate-y-0`}>
               {href === '#' ? 'Coming Soon' : '立即访问'}
             </span>
          </div>
        </div>
      </div>
    </a>
  );
};