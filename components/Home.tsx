import React from 'react';
import { Hero } from './Hero';
import { Card } from './Card';
import { motion } from 'motion/react';
import { useTheme } from '../App';

export const Home: React.FC = () => {
  const { handleCardToast, pansouEnabled, showToast, language } = useTheme();

  const translations = {
    zh: {
      pansou: {
        title: "网盘影视资源搜",
        desc: "聚合全网资源，打破信息孤岛。一次搜索，极速直达云端内容。",
        tag: "HOT TOOL"
      },
      readingPro: {
        title: "外刊精读 Pro",
        desc: "深度解析《经济学人》、《纽约客》等顶级刊物，打破语言围墙，拓展国际视野。",
        tag: "PREMIUM"
      },
      ai: {
        title: "AI 智能体",
        desc: "您的私人数字助手。具备深度推理与上下文理解能力，即刻开启未来对话。",
        tag: "COMING SOON"
      },
      chat: {
        title: "即时聊天软件",
        desc: "中国人自己的Telegram。安全、快速、全平台的私密消息应用。",
        tag: "BETA"
      },
      pansouDisabled: '因政策原因暂停服务'
    },
    en: {
      pansou: {
        title: "Cloud Resource Search",
        desc: "Aggregate entire network resources, break information silos. One search to reach cloud content.",
        tag: "HOT TOOL"
      },
      readingPro: {
        title: "Reading Pro",
        desc: "In-depth interpretation of top publications like The Economist. Break language barriers.",
        tag: "PREMIUM"
      },
      ai: {
        title: "AI Agent",
        desc: "Your personal digital assistant. Equipped with deep reasoning and contextual understanding.",
        tag: "COMING SOON"
      },
      chat: {
        title: "Instant Messaging",
        desc: "Chinese own Telegram. Secure, fast, cross-platform private messaging application.",
        tag: "BETA"
      },
      pansouDisabled: 'Service suspended due to policy'
    },
    ja: {
      pansou: { title: "クラウド検索", desc: "情報のサイロを打破するネットワークリソースの集約", tag: "HOT TOOL" },
      readingPro: { title: "Reading Pro", desc: "The Economistなどのトップ出版物の深い解釈", tag: "PREMIUM" },
      ai: { title: "AIエージェント", desc: "あなたのパーソナルデジタルアシスタント", tag: "COMING SOON" },
      chat: { title: "インスタントメッセージ", desc: "中国版Telegram。安全で高速なアプリ", tag: "BETA" },
      pansouDisabled: 'ポリシーによりサービス一時停止'
    },
    ko: {
      pansou: { title: "클라우드 검색", desc: "네트워크 리소스 통합 및 정보 사일로 타파", tag: "HOT TOOL" },
      readingPro: { title: "Reading Pro", desc: "이코노미스트 등 শীর্ষ 간행물 심층 해석", tag: "PREMIUM" },
      ai: { title: "AI 에이전트", desc: "개인 디지털 비서", tag: "COMING SOON" },
      chat: { title: "인스턴트 메시징", desc: "중국어 텔레그램. 안전하고 빠른 앱", tag: "BETA" },
      pansouDisabled: '정책으로 인해 서비스 중단됨'
    },
    es: {
      pansou: { title: "Búsqueda en la Nube", desc: "Agregación de recursos y ruptura de silos de información", tag: "HOT TOOL" },
      readingPro: { title: "Reading Pro", desc: "Interpretación profunda de publicaciones principales", tag: "PREMIUM" },
      ai: { title: "Agente AI", desc: "Tu asistente digital personal", tag: "COMING SOON" },
      chat: { title: "Mensajería Instantánea", desc: "El Telegram chino. Aplicación segura", tag: "BETA" },
      pansouDisabled: 'Servicio suspendido por política'
    },
    fr: {
      pansou: { title: "Recherche Cloud", desc: "Agrégation de ressources cloud", tag: "HOT TOOL" },
      readingPro: { title: "Reading Pro", desc: "Interprétation de revues principales", tag: "PREMIUM" },
      ai: { title: "Agent IA", desc: "Votre assistant numérique personnel", tag: "COMING SOON" },
      chat: { title: "Messagerie Instantanée", desc: "Le Telegram chinois. Application sécurisée", tag: "BETA" },
      pansouDisabled: 'Service suspendu'
    },
    de: {
      pansou: { title: "Cloud-Suche", desc: "Aggregation von Cloud-Ressourcen", tag: "HOT TOOL" },
      readingPro: { title: "Reading Pro", desc: "Interpretation von Top-Publikationen", tag: "PREMIUM" },
      ai: { title: "KI-Agent", desc: "Ihr persönlicher Assistent", tag: "COMING SOON" },
      chat: { title: "Instant Messaging", desc: "Chinesisches Telegram. Sichere App", tag: "BETA" },
      pansouDisabled: 'Dienst ausgesetzt'
    },
    el: {
      pansou: { title: "Αναζήτηση Cloud", desc: "Συγκέντρωση πόρων cloud", tag: "HOT TOOL" },
      readingPro: { title: "Reading Pro", desc: "Ερμηνεία κορυφαίων δημοσιεύσεων", tag: "PREMIUM" },
      ai: { title: "Agent AI", desc: "Ο προσωπικός σας βοηθός", tag: "COMING SOON" },
      chat: { title: "Άμεση συνομιλία", desc: "Κινεζικό Telegram. Ασφαλής εφαρμογή", tag: "BETA" },
      pansouDisabled: 'Η υπηρεσία έχει ανασταλεί'
    }
  };

  const t = (translations as any)[language] || translations.en;

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
              title={t.pansou.title}
              description={t.pansou.desc}
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1618005182384-a83a8bd57fbe&w=800&q=50&output=webp"
              href={pansouEnabled ? "http://gongcheng.yyboxdns.com:12309" : "#"}
              onToast={() => !pansouEnabled ? showToast(t.pansouDisabled) : undefined}
              tag={t.pansou.tag}
              size="wide"
              theme="light"
            />
          </motion.div>

          {/* 2. Foreign Journal - Tall Card - Stable Journal/Coffee */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}>
            <Card
              title={t.readingPro.title}
              description={t.readingPro.desc}
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1550592704-6c76defa9985&w=500&q=50&output=webp"
              href="/reading-pro"
              tag={t.readingPro.tag}
              size="normal"
              theme="light"
            />
          </motion.div>

          {/* 3. AI Agent - Dark Theme Card - Dark Neural Abstract */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}>
            <Card
              title={t.ai.title}
              description={t.ai.desc}
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1677442136019-21780ecad995&w=500&q=50&output=webp"
              href="#"
              tag={t.ai.tag}
              size="normal"
              theme="dark"
              onToast={handleCardToast}
            />
          </motion.div>

            {/* 4. Instant Chat - Light Card */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }} className="md:col-span-2">
            <Card
              title={t.chat.title}
              description={t.chat.desc}
              imageUrl="https://wsrv.nl/?url=images.unsplash.com/photo-1611746872915-64382b5c76da&w=800&q=50&output=webp"
              href="http://gongcheng.yyboxdns.com:21312/"
              tag={t.chat.tag}
              size="wide"
              theme="light"
            />
          </motion.div>

        </motion.div>
      </section>
    </main>
  );
};
