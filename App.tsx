import React, { useState, createContext, useContext } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Card } from './components/Card';
import { Footer } from './components/Footer';
import { ThemeContextType, VisualEffect } from './types';
import { motion, AnimatePresence } from 'motion/react';

// Create Context
export const ThemeContext = createContext<ThemeContextType>({
  visualEffect: 'liquid',
  setVisualEffect: () => {},
  showToast: () => {},
});

// Use Context Hook
export const useTheme = () => useContext(ThemeContext);

// Simple Toast Component - Enhanced Liquid Glass
const Toast = ({ message, visible }: { message: string; visible: boolean }) => {
  const { visualEffect } = useTheme();
  
  // Dynamic styles based on theme - Enhanced Liquid Glass with Glossy Highlights
  const styleClass = visualEffect === 'liquid' 
    ? 'bg-white/15 backdrop-blur-[20px] backdrop-saturate-[200%] border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.2)]'
    : 'bg-white/95 backdrop-blur-xl border-gray-200 shadow-xl';

  return (
    <div 
      className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
      }`}
    >
      <div className={`px-6 py-3 rounded-full border flex items-center space-x-2 transition-all duration-500 relative overflow-hidden ${styleClass}`}>
         {/* Glossy Reflection Overlay */}
         {visualEffect === 'liquid' && (
           <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2 pointer-events-none" />
         )}
         <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)] relative z-10"></span>
         <span className="text-sm font-semibold text-gray-900 tracking-wide relative z-10">{message}</span>
      </div>
    </div>
  );
};

function App() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('敬请期待 Coming Soon');
  const [visualEffect, setVisualEffect] = useState<VisualEffect>('liquid');

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleCardToast = () => {
    showToast('敬请期待 Coming Soon');
  };

  return (
    <ThemeContext.Provider value={{ visualEffect, setVisualEffect, showToast }}>
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col font-sans selection:bg-black selection:text-white">
        <Navbar />
        <Toast message={toastMessage} visible={toastVisible} />
        
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
                  title="网盘影视资源搜"
                  description="聚合全网资源，打破信息孤岛。一次搜索，极速直达云端内容。"
                  imageUrl="https://images.weserv.nl/?url=images.unsplash.com/photo-1618005182384-a83a8bd57fbe&w=800&q=50&output=webp"
                  href="http://gongcheng.yyboxdns.com:12309"
                  tag="HOT TOOL"
                  size="wide"
                  theme="light"
                />
              </motion.div>

              {/* 2. Foreign Journal - Tall Card - Stable Journal/Coffee */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}>
                <Card
                  title="外刊精读 Pro"
                  description="深度解析《经济学人》、《纽约客》等顶级刊物，打破语言围墙，拓展国际视野。"
                  imageUrl="https://images.weserv.nl/?url=images.unsplash.com/photo-1550592704-6c76defa9985&w=500&q=50&output=webp"
                  href="http://gongcheng.yyboxdns.com:25045/"
                  tag="PREMIUM"
                  size="normal"
                  theme="light"
                />
              </motion.div>

              {/* 3. AI Agent - Dark Theme Card - Dark Neural Abstract */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}>
                <Card
                  title="AI 智能体"
                  description="您的私人数字助手。具备深度推理与上下文理解能力，即刻开启未来对话。"
                  imageUrl="https://images.weserv.nl/?url=images.unsplash.com/photo-1677442136019-21780ecad995&w=500&q=50&output=webp"
                  href="#"
                  tag="COMING SOON"
                  size="normal"
                  theme="dark"
                  onToast={handleCardToast}
                />
              </motion.div>

               {/* 4. Minimalist Novel - Light Card - Stable Book/Nature */}
               <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }} className="md:col-span-2">
                <Card
                  title="极简小说"
                  description="回归阅读本质。无广告、无干扰的沉浸式阅读体验，支持多种格式解析。"
                  imageUrl="https://images.weserv.nl/?url=images.unsplash.com/photo-1476275466078-4007374efbbe&w=800&q=50&output=webp"
                  href="#"
                  tag="BETA"
                  size="wide"
                  theme="light"
                  onToast={handleCardToast}
                />
              </motion.div>

            </motion.div>
          </section>
        </main>

        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;