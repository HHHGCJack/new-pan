import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Lock } from 'lucide-react';
import { ProductCardProps } from '../types';
import { useTheme, translations as appTranslations } from '../App';

export const Card: React.FC<ProductCardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  gradient,
  href, 
  tag, 
  size = 'normal',
  onToast
}) => {
  const { themeMode, language } = useTheme();
  const isDark = themeMode === 'dark';
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (href === '#') {
      e.preventDefault();
      if (onToast) onToast();
    } else if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
    }
  };

  const getGlassClasses = () => {
    if (isDark) {
      return 'bg-black/40 bg-gradient-to-br from-white/10 via-transparent to-white/5 backdrop-blur-[20px] backdrop-saturate-[150%] border border-white/20 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),_inset_0_1px_2px_rgba(255,255,255,0.3),_inset_0_-1px_2px_rgba(255,255,255,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] hover:bg-black/50 hover:border-white/30 active:bg-black/60';
    }
    return 'bg-white/10 bg-gradient-to-br from-white/40 via-white/5 to-white/20 backdrop-blur-[20px] backdrop-saturate-[200%] border border-white/40 text-gray-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),_inset_0_1px_2px_rgba(255,255,255,0.9),_inset_0_-1px_2px_rgba(255,255,255,0.2),_inset_1px_0_2px_rgba(255,255,255,0.3)] hover:shadow-[0_40px_80px_-20px_rgba(50,50,93,0.2)] hover:bg-white/15 hover:border-white/60 active:shadow-[0_20px_40px_-10px_rgba(50,50,93,0.15)] active:bg-white/20 active:border-white/80';
  };

  const getTagStyle = () => {
    if (isDark) {
      return 'bg-white/10 text-white border-white/30 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] group-hover:bg-white/20 group-hover:border-white/50 group-active:bg-white/30 group-active:shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]';
    }
    return 'bg-white/20 text-gray-900 border-white/40 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] group-hover:bg-white/40 group-hover:border-white/60 group-active:bg-white/50 group-active:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]';
  };

  const getButtonStyle = () => {
    if (isDark) {
      return 'bg-white/10 text-white border border-white/30 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] hover:bg-white/30 hover:scale-110 active:scale-95 active:bg-white/40';
    }
    return 'bg-white/20 text-black border border-white/40 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] hover:bg-white/40 hover:scale-110 active:scale-95 active:bg-white/60';
  };

  const ctaText = href === '#' 
    ? appTranslations[language].comingSoon 
    : appTranslations[language].visitNow;

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
        md:hover:-translate-y-3 md:hover:scale-[1.02] md:hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)]
        active:scale-[0.98] active:translate-y-0 active:shadow-inner active:duration-75
        ${size === 'wide' ? 'md:col-span-2' : 'col-span-1'}
        ${getGlassClasses()}
        h-[420px] md:h-[500px] flex flex-col cursor-pointer
        touch-manipulation select-none
      `}
      style={{ 
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        WebkitTouchCallout: 'none'
      }}
    >
      <div className={`absolute inset-0 z-0 overflow-hidden ${isDark ? 'opacity-60' : 'opacity-90 mix-blend-overlay'}`}>
        {gradient ? (
          <div className={`w-full h-full ${gradient} transform-gpu transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110 group-active:scale-105 will-change-transform`} />
        ) : (
          <img 
            src={imageUrl} 
            alt={title} 
            loading="lazy"
            decoding="async"
            draggable="false"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transform-gpu transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110 group-active:scale-105 will-change-transform`}
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-black/40 to-transparent' : 'from-white/80 via-white/10 to-transparent'}`}></div>
      </div>

      {!isDark && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/10 to-transparent" />
        </div>
      )}

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
               {ctaText}
             </span>
          </div>
        </div>
      </div>
    </a>
  );
};