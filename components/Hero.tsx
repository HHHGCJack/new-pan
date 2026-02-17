import React, { useEffect, useState } from 'react';

const words = [
  { text: 'Hello', lang: 'en', font: 'font-cursive-en' },
  { text: '你好', lang: 'cn', font: 'font-cursive-cn' },
  { text: 'Hola', lang: 'es', font: 'font-cursive-en' },
  { text: 'Bonjour', lang: 'fr', font: 'font-cursive-en' },
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
    <section className="relative w-full h-[60vh] min-h-[400px] flex flex-col justify-center items-center overflow-hidden bg-[#f5f5f7]">
      <div className="relative h-48 w-full flex justify-center items-center">
        {words.map((word, index) => (
          <span
            key={index}
            className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${word.font} ${
              index === activeIndex
                ? 'opacity-100 transform translate-y-0 scale-100 blur-0'
                : 'opacity-0 transform translate-y-8 scale-90 blur-sm'
            }`}
            style={{
              fontSize: word.lang === 'cn' ? 'clamp(4rem, 15vw, 8rem)' : 'clamp(5rem, 18vw, 10rem)',
              background: 'linear-gradient(180deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2
            }}
          >
            {word.text}
          </span>
        ))}
      </div>
      <p className="mt-8 text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase opacity-80 animate-fade-in-up">
        Simple . Pure . Powerful
      </p>
    </section>
  );
};