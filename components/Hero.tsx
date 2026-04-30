import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../App';

const words = [
  { text: 'hello', lang: 'en' },
  { text: '你好', lang: 'cn' },
  { text: 'hola', lang: 'es' },
  { text: 'bonjour', lang: 'fr' },
  { text: 'こんにちは', lang: 'jp' },
  { text: '안녕하세요', lang: 'kr' },
  { text: 'привет', lang: 'ru' },
];

export const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { visualEffect } = useTheme();

  useEffect(() => {
    // Apple's animation is slow and deliberate
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % words.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Apple-style iOS setup screen variants
  const variants = {
    enter: {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)',
    },
    center: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1], // Custom spring-like Apple ease
      }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)',
      transition: {
        duration: 1.0,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative w-full h-[60vh] min-h-[400px] flex flex-col justify-center items-center overflow-hidden transition-colors duration-500 ${visualEffect === 'cyberpunk' ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}
    >
      <div className="relative h-48 w-full flex justify-center items-center">
        <AnimatePresence>
          <motion.span
            key={activeIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`absolute ${visualEffect === 'cyberpunk' ? 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'text-[#1d1d1f]'}`}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              fontWeight: 500, // Medium weight for elegance
              fontSize: ['cn', 'jp', 'kr'].includes(words[activeIndex].lang) ? 'clamp(3rem, 15vw, 6rem)' : 'clamp(4rem, 18vw, 8rem)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              // Force hardware acceleration for smooth blur/scale
              WebkitFontSmoothing: 'antialiased',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            {words[activeIndex].text}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className={`mt-12 text-xs font-semibold tracking-[0.3em] uppercase ${visualEffect === 'cyberpunk' ? 'text-cyan-500/70 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-gray-400'}`}
      >
        Simple . Pure . Powerful
      </motion.p>
    </motion.section>
  );
};