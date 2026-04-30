import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../App';
import { translations } from '../i18n';

export const Hero: React.FC = () => {
  const { theme, language } = useTheme();
  const t = translations[language];

  // We map the language to specific handwriting fonts downloaded in App.tsx
  const getFontFamily = () => {
    return language === 'zh' ? "'Zhi Mang Xing', cursive" : "'Dancing Script', cursive";
  };

  // Re-trigger animation when language changes
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [language]);

  return (
    <section 
      className={`relative w-full h-[60vh] min-h-[400px] flex flex-col justify-center items-center overflow-hidden transition-colors duration-500`}
    >
      <div className="relative h-48 w-full flex justify-center items-center">
        <motion.svg 
          key={animationKey}
          className="w-full h-full max-w-2xl px-6" 
          viewBox="0 0 600 200" 
          preserveAspectRatio="xMinYMin meet"
          style={{ overflow: 'visible' }} // Ensure text is fully visible
        >
          {/* Drop shadow for better legibility */}
          <motion.text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            className={`${theme === 'dark' ? 'stroke-white' : 'stroke-gray-900'}`}
            style={{
               fontFamily: getFontFamily(),
               strokeWidth: 2,
               strokeLinecap: "round",
               strokeLinejoin: "round",
               fontSize: language === 'zh' ? '120px' : '100px',
               paintOrder: 'stroke fill',
               verticalAlign: 'middle',
            }}
            initial={{ strokeDasharray: 1000, strokeDashoffset: 1000, fill: "transparent" }}
            animate={{ strokeDashoffset: 0, fill: theme === 'dark' ? "#fff" : "#111827" }}
            transition={{
              strokeDashoffset: { duration: 2.5, ease: "linear" },
              fill: { duration: 0.8, delay: 2.2, ease: "easeIn" }
            }}
          >
            {t.hero.welcome}
          </motion.text>
        </motion.svg>
      </div>

      <motion.p 
        key={`sub-${animationKey}`}
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