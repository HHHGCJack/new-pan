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
      // Liquid Glass: High transparency, Low Blur (Clearer), Specular Highlights (Inset Shadow)
      // "Wet" look: bg-white/5 (very transparent), backdrop-saturate-200 (vibrant), shiny border
      return 'bg-white/5 backdrop-blur-[12px] backdrop-saturate-[200%] border border-white/20 text-gray-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),_inset_0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_40px_80px_-20px_rgba(50,50,93,0.2)] hover:bg-white/10 hover:border-white/40';
    } else {
      // Gaussian Blur: Higher Opacity, Standard Blur, Matte Finish (No shine)
      // "Dry" look: bg-white/80, standard blur, flat border
      return 'bg-white/85 backdrop-blur-xl border border-white/50 text-gray-900 shadow-md hover:shadow-xl hover:bg-white/95';
    }
  };

  // 2. 标签样式 (Tag Styles)
  const getTagStyle = () => {
    if (isDark) return 'bg-white/10 text-white border-white/20';
    
    if (visualEffect === 'liquid') {
      // Liquid Tag: Shiny, transparent, inset glow
      return 'bg-white/20 text-gray-900 border-white/30 backdrop-blur-md shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]';
    } else {
      // Blur Tag: Matte, solid feel, no shine
      return 'bg-gray-100/80 text-gray-600 border-transparent';
    }
  };

  // 3. 按钮样式 (Arrow/Lock Button Styles)
  const getButtonStyle = () => {
    if (isDark) return 'bg-white/20 text-white hover:bg-white hover:text-black';

    if (visualEffect === 'liquid') {
      // Liquid Button: Shiny bubble look
      return 'bg-white/20 text-black border border-white/30 backdrop-blur-sm shadow-[inset_0_0_8px_rgba(255,255,255,0.3)] hover:bg-white/40 hover:scale-110';
    } else {
      // Blur Button: Matte gray circle
      return 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black hover:scale-105';
    }
  };

  return (
    <a 
      href={href} 
      target={href === '#' ? undefined : "_blank"}
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group relative isolate overflow-hidden rounded-[2.5rem] transform-gpu will-change-transform 
        transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
        hover:-translate-y-2 
        ${size === 'wide' ? 'md:col-span-2' : 'col-span-1'}
        ${getGlassClasses()}
        h-[420px] md:h-[500px] flex flex-col cursor-pointer
      `}
      style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
    >
      {/* Background Image Area */}
      {/* Liquid needs mix-blend to look integrated/wet. Blur needs natural colors. */}
      <div className={`absolute inset-0 z-0 overflow-hidden ${isDark ? 'opacity-60' : visualEffect === 'liquid' ? 'opacity-90 mix-blend-overlay' : 'opacity-100'}`}>
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transform-gpu transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110 will-change-transform"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${
          isDark 
            ? 'from-black via-black/40 to-transparent' 
            : visualEffect === 'liquid'
              ? 'from-white/80 via-white/10 to-transparent' // Liquid: Clearer middle
              : 'from-white/95 via-white/40 to-transparent' // Blur: More opaque fade
        }`}></div>
      </div>

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
               <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            )}
          </div>
        </div>

        {/* Text Container */}
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