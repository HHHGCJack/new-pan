import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../App';

const words = [
  { text: '你好', lang: 'cn' },
  { text: 'Hello', lang: 'en' },
  { text: 'Hola', lang: 'es' },
  { text: 'Bonjour', lang: 'fr' },
  { text: 'こんにちは', lang: 'jp' },
  { text: '안녕하세요', lang: 'kr' },
  { text: 'Привет', lang: 'ru' },
  { text: 'Γεια σας', lang: 'el' }
];

export const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { themeMode, language } = useTheme();

  const translations = {
    zh: {
      slogan: 'Simple . Pure . Powerful'
    },
    en: { slogan: 'Simple . Pure . Powerful' },
    ja: { slogan: 'Simple . Pure . Powerful' },
    ko: { slogan: 'Simple . Pure . Powerful' },
    es: { slogan: 'Simple . Pure . Powerful' },
    fr: { slogan: 'Simple . Pure . Powerful' },
    de: { slogan: 'Simple . Pure . Powerful' }
  };

  const t = (translations as any)[language] || translations.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    const section = document.getElementById('content-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <motion.section 
      id="hero-cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] flex items-center justify-center overflow-hidden transition-colors duration-500 select-none pt-14 md:pt-16`}
    >
      {/* Main Center Brand Cover - Optically Balanced Midpoint */}
      <div className="flex flex-col items-center justify-center w-full px-4 text-center -translate-y-3 sm:-translate-y-4 md:-translate-y-6">
        <div className="relative h-24 sm:h-32 md:h-44 w-full flex justify-center items-center">
          {words.map((word, index) => (
            <span
              key={index}
              className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                index === activeIndex
                  ? 'opacity-100 transform translate-y-0 scale-100 blur-0 pointer-events-auto'
                  : 'opacity-0 transform translate-y-6 scale-90 blur-sm pointer-events-none'
              } ${themeMode === 'dark' ? 'text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.25)]' : 'text-gray-900 drop-shadow-md'}`}
              style={{
                fontFamily: '"SF Pro Rounded", "Arial Rounded MT Bold", "Nunito", "Varela Round", sans-serif',
                fontWeight: 900,
                fontSize: ['cn', 'jp', 'kr'].includes(word.lang) 
                  ? 'clamp(2.7rem, 13vw, 7.5rem)' 
                  : 'clamp(3.1rem, 15vw, 9rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}
            >
              {word.text}
            </span>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={`mt-2 sm:mt-4 md:mt-5 text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.3em] sm:tracking-[0.4em] uppercase ${
            themeMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {t.slogan}
        </motion.p>
      </div>

      {/* Floating Bottom Scroll Prompt Indicator - Positioned naturally near bottom edge */}
      <div className="absolute bottom-4 sm:bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-auto">
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ 
            opacity: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
            delay: 0.8
          }}
          className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-full transition-transform hover:scale-110 active:scale-95 focus:outline-none cursor-pointer ${
            themeMode === 'dark' ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Scroll down to explore"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown size={21} strokeWidth={2.2} />
          </motion.div>
        </motion.button>
      </div>
    </motion.section>
  );
};