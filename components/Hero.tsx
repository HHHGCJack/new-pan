import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../App';
import { translations } from '../i18n';

export const Hero: React.FC = () => {
  const { theme, language } = useTheme();
  const t = translations[language];

  const [helloIndex, setHelloIndex] = useState(0);

  const hellos = [
    { text: 'Hello', lang: 'en' },
    { text: '你好', lang: 'zh' },
    { text: 'Bonjour', lang: 'fr' },
    { text: 'Hola', lang: 'es' },
    { text: 'こんにちは', lang: 'ja' },
    { text: '안녕하세요', lang: 'ko' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHelloIndex((prev) => (prev + 1) % hellos.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [hellos.length]);

  return (
    <section 
      className={`relative w-full h-[60vh] min-h-[400px] flex flex-col justify-center items-center overflow-hidden transition-colors duration-500`}
    >
      <div className="relative h-48 w-full flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={helloIndex}
            initial={{ opacity: 0, scale: 0.5, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className={`absolute flex justify-center items-center w-full`}
          >
            <h1 
              className={`font-semibold tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              style={{
                fontSize: hellos[helloIndex].lang === 'zh' || hellos[helloIndex].lang === 'ja' || hellos[helloIndex].lang === 'ko' ? 'clamp(6rem, 15vw, 10rem)' : 'clamp(5rem, 15vw, 10rem)',
              }}
            >
              {hellos[helloIndex].text}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className={`mt-4 text-xs font-semibold tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {t.hero.subtitle}
      </motion.p>
    </section>
  );
};