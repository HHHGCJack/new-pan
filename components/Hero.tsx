import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const words = [
  { text: 'Hello', lang: 'en' },
  { text: '你好', lang: 'cn' },
  { text: 'Hola', lang: 'es' },
  { text: 'Bonjour', lang: 'fr' },
  { text: 'こんにちは', lang: 'jp' },
  { text: '안녕하세요', lang: 'kr' },
  { text: 'Привет', lang: 'ru' },
];

export const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

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
      className="relative w-full h-[60vh] min-h-[400px] flex flex-col justify-center items-center overflow-hidden bg-[#f5f5f7]"
    >
      <div className="relative h-48 w-full flex justify-center items-center">
        {words.map((word, index) => (
          <span
            key={index}
            className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              index === activeIndex
                ? 'opacity-100 transform translate-y-0 scale-100 blur-0'
                : 'opacity-0 transform translate-y-8 scale-90 blur-sm'
            }`}
            style={{
              // Use a robust stack for rounded fonts: SF Pro Rounded (Apple), Arial Rounded MT Bold (Win), or general rounded
              fontFamily: '"SF Pro Rounded", "Arial Rounded MT Bold", "Nunito", "Varela Round", sans-serif',
              fontWeight: 900, // Heavy weight for that "Hello" look
              fontSize: ['cn', 'jp', 'kr'].includes(word.lang) ? 'clamp(4rem, 15vw, 8rem)' : 'clamp(5rem, 18vw, 10rem)',
              background: 'linear-gradient(180deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
        className="mt-8 text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase"
      >
        Simple . Pure . Powerful
      </motion.p>
    </motion.section>
  );
};