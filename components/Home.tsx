import React from 'react';
import { Hero } from './Hero';
import { Card } from './Card';
import { motion } from 'motion/react';
import { useTheme } from '../App';
import { translations } from '../i18n';

export const Home: React.FC = () => {
  const { handleCardToast, pansouEnabled, showToast, language, theme } = useTheme();
  
  const t = translations[language];

  return (
    <main className="flex-grow pt-16">
      <Hero />

      <section className="max-w-7xl mx-auto px-6 pb-32 -mt-5 md:-mt-10 relative z-10">
        
        {/* Bento Grid Layout - Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          
          {/* 1. Pansou - Wide Card - New Premium "Liquid Oil" Abstract */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }} className="md:col-span-2">
            <Card
              title={t.home.pansouTitle}
              description={t.home.pansouCardDesc}
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1618005182384-a83a8bd57fbe&w=800&q=50&output=webp"
              href={pansouEnabled ? "http://gongcheng.yyboxdns.com:12309" : "#"}
              onToast={() => !pansouEnabled ? showToast(t.actions.suspended) : undefined}
              tag={t.home.hotTool}
              size="wide"
              uiTheme={theme}
              i18nVisit={t.actions.visit}
              i18nComingSoon={t.actions.comingSoon}
            />
          </motion.div>

          {/* 2. Foreign Journal - Tall Card - Stable Journal/Coffee */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}>
            <Card
              title={t.home.readingProTitle}
              description={t.home.readingProCardDesc}
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1550592704-6c76defa9985&w=500&q=50&output=webp"
              href="/reading-pro"
              tag="PREMIUM"
              size="normal"
              uiTheme={theme}
              i18nVisit={t.actions.visit}
              i18nComingSoon={t.actions.comingSoon}
            />
          </motion.div>

            {/* 3. Minimalist Novel - Light Card - Stable Book/Nature */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }} className="md:col-span-3">
            <Card
              title={t.home.novelTitle}
              description={t.home.novelCardDesc}
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1476275466078-4007374efbbe&w=800&q=50&output=webp"
              href="#"
              tag={t.home.classic}
              size="wide"
              uiTheme={theme}
              onToast={handleCardToast}
              i18nVisit={t.actions.visit}
              i18nComingSoon={t.actions.comingSoon}
            />
          </motion.div>

        </motion.div>
      </section>
    </main>
  );
};
