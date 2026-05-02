import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../App';

const words = [
  { text: 'Hello', lang: 'en' },
  { text: '你好', lang: 'cn' },
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

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative w-full h-[60vh] min-h-[400px] flex flex-col justify-center items-center overflow-hidden transition-colors duration-500`}
    >
      <div className="relative h-48 w-full flex justify-center items-center">
        {words.map((word, index) => (
          <span
            key={index}
            className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              index === activeIndex
                ? 'opacity-100 transform translate-y-0 scale-100 blur-0'
                : 'opacity-0 transform translate-y-8 scale-90 blur-sm'
            } ${themeMode === 'dark' ? 'text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)]' : 'text-gray-800 drop-shadow-md'}`}
            style={{
              fontFamily: '"SF Pro Rounded", "Arial Rounded MT Bold", "Nunito", "Varela Round", sans-serif',
              fontWeight: 900,
              fontSize: ['cn', 'jp', 'kr'].includes(word.lang) ? 'clamp(3rem, 15vw, 8rem)' : 'clamp(3.5rem, 18vw, 10rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em'
            }}
          >
            {word.text}
          </span>
        ))}
      </div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className={`mt-8 text-xs font-semibold tracking-[0.3em] uppercase ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}
      >
        {t.slogan}
      </motion.p>
    </motion.section>
  );
};