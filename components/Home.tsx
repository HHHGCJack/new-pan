import React from 'react';
import { Hero } from './Hero';
import { Card } from './Card';
import { motion } from 'motion/react';
import { useTheme } from '../App';

export const Home: React.FC = () => {
  const { handleCardToast, pansouEnabled, showToast } = useTheme();

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
              title="网盘影视资源搜"
              description="聚合全网资源，打破信息孤岛。一次搜索，极速直达云端内容。"
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1618005182384-a83a8bd57fbe&w=800&q=50&output=webp"
              href={pansouEnabled ? "http://gongcheng.yyboxdns.com:12309" : "#"}
              onToast={() => !pansouEnabled ? showToast('因政策原因暂停服务') : undefined}
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
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1550592704-6c76defa9985&w=500&q=50&output=webp"
              href="/reading-pro"
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
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1677442136019-21780ecad995&w=500&q=50&output=webp"
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
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1476275466078-4007374efbbe&w=800&q=50&output=webp"
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
  );
};
