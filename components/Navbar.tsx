import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, ExternalLink, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../App';
import { Logo } from './Logo';
import { SUPPORT_QR_BASE64, SUPPORT_QR_CDN, SUPPORT_QR_LOCAL } from '../src/assets/support_qr_base64';

export const DEFAULT_SUPPORT_QR = SUPPORT_QR_LOCAL;

export const Navbar: React.FC = () => {
  const { themeMode, setThemeMode, language, setLanguage, showToast, pansouEnabled } = useTheme();
  const [qrImage, setQrImage] = useState<string>(() => {
    const saved = localStorage.getItem('custom_support_qr');
    // If user has old broken telegram/nloln url, reset to new high-speed source
    if (saved && (saved.includes('nloln.de') || saved.includes('img2.'))) {
      localStorage.removeItem('custom_support_qr');
      return SUPPORT_QR_LOCAL;
    }
    return saved || SUPPORT_QR_LOCAL;
  });

  const translations = {
    zh: {
      brand: 'G胖儿GongPan',
      nav: {
        learn: '学习',
        entertainment: '娱乐',
        tech: '科技',
      },
      items: {
        readingPro: { title: '外刊精读', desc: '深度解析国际刊物' },
        pansou: { title: '网盘资源搜', desc: '全网影视资源聚合' },
        chat: { title: '即时聊天软件', desc: '中国人自己的Telegram' },
        ai: { title: 'AI 投资智能体', desc: 'AI驱动的智能投资决策' },
        lab: { title: '实验室', desc: '极客实验性工具箱' },
      },
      support: '支持我',
      supportThanks: '感谢支持',
      pansouDisabled: '因政策原因暂停服务',
      comingSoon: '敬请期待 Coming Soon',
      selectLang: '精选优质资源',
    },
    en: {
      brand: 'GongPan',
      nav: {
        learn: 'Learn',
        entertainment: 'Entertainment',
        tech: 'Tech',
      },
      items: {
        readingPro: { title: 'Journal Reading', desc: 'In-depth international journals' },
        pansou: { title: 'Cloud Search', desc: 'Movie resource aggregation' },
        chat: { title: 'Instant Chat', desc: 'Chinese own Telegram' },
        ai: { title: 'AI Investment Agent', desc: 'AI-driven investment intelligence' },
        lab: { title: 'Laboratory', desc: 'Experimental Sandbox' },
      },
      support: 'Support Me',
      supportThanks: 'Thanks for Support',
      pansouDisabled: 'Service suspended due to policy',
      comingSoon: 'Coming Soon',
      selectLang: 'Premium Resources',
    },
    ja: {
      brand: 'GongPan',
      nav: { learn: '学習', entertainment: 'エンターテイメント', tech: 'テクノロジー' },
      items: {
        readingPro: { title: 'ジャーナル精読', desc: '国際的なジャーナルの深い解釈' },
        pansou: { title: 'クラウド検索', desc: '映画リソースの集約' },
        chat: { title: 'インスタントチャット', desc: '中国のTelegram' },
        ai: { title: 'AI投資エージェント', desc: 'AIによる投資インテリジェンス' },
        lab: { title: '研究室', desc: '実験的機能とツール' },
      },
      support: 'サポート',
      supportThanks: 'サポートありがとうございます',
      pansouDisabled: '制限によりサービス停止中',
      comingSoon: '近日公開',
      selectLang: 'プレミアムリソース',
    },
    ko: {
      brand: 'GongPan',
      nav: { learn: '학습', entertainment: '엔터테인먼트', tech: '기술' },
      items: {
        readingPro: { title: '저널 정독', desc: '국제 저널 심층 해석' },
        pansou: { title: '클라우드 검색', desc: '영화 리소스 통합' },
        chat: { title: '인스턴트 채팅', desc: '중국의 Telegram' },
        ai: { title: 'AI 투자 에이전트', desc: 'AI 기반 투자 인텔리전스' },
        lab: { title: '실험실', desc: '실험적 기능 및 제어' },
      },
      support: '지원하기',
      supportThanks: '지원해 주셔서 감사합니다',
      pansouDisabled: '정책으로 인해 서비스 중지',
      comingSoon: '출시 예정',
      selectLang: '프리미엄 리소스',
    },
    es: {
      brand: 'GongPan',
      nav: { learn: 'Aprender', entertainment: 'Entretenimiento', tech: 'Tecnología' },
      items: {
        readingPro: { title: 'Lectura de Revistas', desc: 'Revistas internacionales' },
        pansou: { title: 'Nube de Películas', desc: 'Agregación de recursos' },
        chat: { title: 'Chat Instantáneo', desc: 'Telegram chino' },
        ai: { title: 'Agente de Inversión IA', desc: 'Inteligencia de inversión con IA' },
        lab: { title: 'Laboratorio', desc: 'Herramientas y sandbox' },
      },
      support: 'Apóyame',
      supportThanks: 'Gracias por tu apoyo',
      pansouDisabled: 'Servicio suspendido',
      comingSoon: 'Próximamente',
      selectLang: 'Recursos Premium',
    },
    fr: {
      brand: 'GongPan',
      nav: { learn: 'Apprendre', entertainment: 'Divertissement', tech: 'Technologie' },
      items: {
        readingPro: { title: 'Lecture de Revues', desc: 'Revues internationales' },
        pansou: { title: 'Recherche Cloud', desc: 'Ressources de films' },
        chat: { title: 'Chat Instantané', desc: 'Telegram chinois' },
        ai: { title: 'Agent d\'Investissement IA', desc: 'Intelligence d\'investissement IA' },
        lab: { title: 'Laboratoire', desc: 'Outils Expérimentaux' },
      },
      support: 'Soutenez-moi',
      supportThanks: 'Merci pour votre soutien',
      pansouDisabled: 'Service suspendu',
      comingSoon: 'Bientôt disponible',
      selectLang: 'Ressources Premium',
    },
    de: {
      brand: 'GongPan',
      nav: { learn: 'Lernen', entertainment: 'Unterhaltung', tech: 'Technologie' },
      items: {
        readingPro: { title: 'Zeitschriften-Lektüre', desc: 'Internationale Zeitschriften' },
        pansou: { title: 'Cloud-Suche', desc: 'Filmressourcen' },
        chat: { title: 'Instant Chat', desc: 'Chinesisches Telegram' },
        ai: { title: 'KI-Investment-Agent', desc: 'KI-gestützte Anlageintelligenz' },
        lab: { title: 'Laboratorium', desc: 'Experimentelle Tools' },
      },
      support: 'Unterstütze mich',
      supportThanks: 'Danke für die Unterstützung',
      pansouDisabled: 'Dienst ausgesetzt',
      comingSoon: 'Demnächst',
      selectLang: 'Premium-Ressourcen',
    },
    el: {
      brand: 'GongPan',
      nav: { learn: 'Μαθαίνω', entertainment: 'Ψυχαγωγία', tech: 'Τεχνολογία' },
      items: {
        readingPro: { title: 'Μελέτη Περιοδικών', desc: 'Διεθνή περιοδικά' },
        pansou: { title: 'Αναζήτηση Cloud', desc: 'Πόροι ταινιών' },
        chat: { title: 'Instant Chat', desc: 'Κινεζικό Telegram' },
        ai: { title: 'Agent Επενδύσεων AI', desc: 'Επενδυτική ευφυΐα AI' },
        lab: { title: 'Εργαστήριο', desc: 'Πειραματικά Εργαλεία' },
      },
      support: 'Υποστήριξη',
      supportThanks: 'Ευχαριστώ για την υποστήριξη',
      pansouDisabled: 'Η υπηρεσία έχει ανασταλεί',
      comingSoon: 'Σύντομα',
      selectLang: 'Premium Πόροι',
    }
  };

  const t = (translations as any)[language] || translations.en;

  const navData = [
    { 
      name: t.nav.learn, 
      items: [
        { title: t.items.readingPro.title, desc: t.items.readingPro.desc, href: '/reading-pro' }
      ] 
    },
    { 
      name: t.nav.entertainment, 
      items: [
        { 
          title: t.items.pansou.title, 
          desc: t.items.pansou.desc, 
          href: pansouEnabled ? 'http://gongcheng.yyboxdns.com:12309' : '#',
          onToast: () => !pansouEnabled ? showToast(t.pansouDisabled) : undefined
        },
        { title: t.items.chat.title, desc: t.items.chat.desc, href: 'http://gongcheng.yyboxdns.com:21312/' }
      ] 
    },
    { 
      name: t.nav.tech, 
      items: [
        { title: t.items.ai.title, desc: t.items.ai.desc, href: 'https://cash.gongpan.org' },
        { title: t.items.lab.title, desc: t.items.lab.desc, href: '/laboratory' }
      ] 
    }
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const langTimeoutRef = React.useRef<any>(null);
  const navTimeoutRef = React.useRef<any>(null);

  const handleNavTabEnter = (idx: number) => {
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = null;
    }
    setActiveDropdown(idx);
  };

  const handleNavLeave = () => {
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }
    navTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleLangMouseEnter = () => {
    if (langTimeoutRef.current) {
      clearTimeout(langTimeoutRef.current);
      langTimeoutRef.current = null;
    }
    setLangDropdownOpen(true);
  };

  const handleLangMouseLeave = () => {
    langTimeoutRef.current = setTimeout(() => {
      setLangDropdownOpen(false);
    }, 250);
  };

  const handleLangClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (langTimeoutRef.current) {
      clearTimeout(langTimeoutRef.current);
      langTimeoutRef.current = null;
    }
    setLangDropdownOpen(!langDropdownOpen);
  };

  const isDropdownOpen = activeDropdown !== null;

  const languages = [
    { code: 'zh', label: '简', name: '简体中文' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'ja', label: 'JA', name: '日本語' },
    { code: 'ko', label: 'KO', name: '한국어' },
    { code: 'es', label: 'ES', name: 'Español' },
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'de', label: 'DE', name: 'Deutsch' },
    { code: 'el', label: 'EL', name: 'Ελληνικά' }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => {
      setLangDropdownOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      if (langTimeoutRef.current) {
        clearTimeout(langTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const shouldLock = mobileMenuOpen || showSupportModal;
    document.body.style.overflow = shouldLock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, showSupportModal]);

  useEffect(() => {
    // Check if server or storage has an updated QR code
    fetch('/api/support-qr')
      .then(res => {
        if (res.ok) return res.blob();
        throw new Error('No custom server qr');
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setQrImage(url);
      })
      .catch(() => {
        const saved = localStorage.getItem('custom_support_qr');
        if (saved) setQrImage(saved);
      });
  }, []);

  const toggleMobileItem = (index: number) => {
    setMobileExpandedIndex(mobileExpandedIndex === index ? null : index);
  };

  const handleSupportClick = () => {
    setShowSupportModal(true);
    setMobileMenuOpen(false);
  };

  const navigate = useNavigate();

  const handleItemClick = (e: React.MouseEvent, title: string, href: string, subItem?: any) => {
    if (href === '#') {
      e.preventDefault();
      if (subItem && subItem.onToast) {
        subItem.onToast();
      } else {
        showToast(t.comingSoon);
      }
      setMobileMenuOpen(false);
      setActiveDropdown(null);
      return;
    }

    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      setMobileMenuOpen(false);
      setActiveDropdown(null);
      return;
    }

    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // Liquid Glass Logic combined with Light/Dark Theme
  const getGlassStyle = (type: 'mobile') => {
    const isDark = themeMode === 'dark';
    const bgNav = isDark 
      ? 'bg-black/30 bg-gradient-to-b from-black/50 via-black/20 to-black/30' 
      : 'bg-white/15 bg-gradient-to-b from-white/40 via-white/10 to-white/15';
    const bgBlur = isDark 
      ? 'backdrop-blur-[22px] backdrop-saturate-[140%]' 
      : 'backdrop-blur-[22px] backdrop-saturate-[160%]';
    
    const borderColor = isDark ? 'border-white/10' : 'border-white/20';
    
    if (type === 'mobile') {
      const shadow = isDark 
        ? 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]' 
        : 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]';
      return `${bgNav} ${bgBlur} ${shadow} border-b ${borderColor}`;
    }
    return '';
  };

  const getNavPillStyle = (isActive: boolean) => {
    const isDark = themeMode === 'dark';
    if (!isActive) {
      return isDark ? 'text-gray-300 hover:text-white border border-transparent' : 'text-gray-600 hover:text-black border border-transparent';
    }
    return isDark 
      ? 'text-white bg-white/10 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.4)]'
      : 'text-black bg-white/20 border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.08)]';
  };

  const getTextEffect = () => themeMode === 'dark' ? '[text-shadow:0_1px_2px_rgba(0,0,0,0.8)]' : '[text-shadow:0_1px_2px_rgba(255,255,255,0.8)]';

  const modalStyle = themeMode === 'dark'
    ? 'bg-black/40 backdrop-blur-[30px] backdrop-saturate-[220%] shadow-[0_50px_100px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.1),_inset_0_-1px_1px_rgba(0,0,0,0.5)] border border-white/10 text-white'
    : 'bg-white/10 backdrop-blur-[30px] backdrop-saturate-[220%] shadow-[0_50px_100px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.1)] border border-white/30 text-gray-900';

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      {/* Background Dimmer */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-300 pointer-events-none ${
          themeMode === 'dark' ? 'bg-black/20' : 'bg-black/10'
        } ${
          activeDropdown !== null || mobileMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${mobileMenuOpen ? 'bg-transparent' : ''}`}
        onMouseLeave={handleNavLeave}
        onMouseEnter={() => {
          if (navTimeoutRef.current) {
            clearTimeout(navTimeoutRef.current);
            navTimeoutRef.current = null;
          }
        }}
      >
        {/* Base Nav Glass */}
        <div 
          className={`absolute top-0 left-0 w-full h-full -z-20 transition-all duration-300 ${
             mobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
          } ${
             themeMode === 'dark' 
                ? 'bg-black/20 bg-gradient-to-br from-black/40 via-black/10 to-black/20 backdrop-blur-[25px] backdrop-saturate-[150%] backdrop-contrast-[110%]' 
                : 'bg-white/10 bg-gradient-to-b from-white/40 via-white/10 to-transparent backdrop-blur-[25px] backdrop-saturate-[200%] backdrop-contrast-[110%] backdrop-brightness-[110%]'
          } ${
             themeMode === 'dark'
                ? 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_inset_0_-1px_2px_rgba(255,255,255,0.02)]'
                : 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),_inset_0_-1px_2px_rgba(255,255,255,0.2),_inset_1px_0_2px_rgba(255,255,255,0.3)]'
          } ${
             isScrolled && activeDropdown === null 
                ? (themeMode === 'dark' ? 'border-b border-white/10 shadow-sm' : 'border-b border-white/30 shadow-sm')
                : 'border-b border-transparent'
          }`}
        />

        {/* Dropdown Glass (Fades in with ultra-smooth progressive feathered mask) */}
        <div 
          className={`absolute top-0 left-0 w-full h-[380px] pointer-events-none -z-10 transition-opacity duration-300 ${
             activeDropdown !== null && !mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          } ${
             themeMode === 'dark' 
                ? 'bg-black/20 bg-gradient-to-b from-black/40 via-black/10 to-transparent backdrop-blur-[25px] backdrop-saturate-[150%] backdrop-contrast-[110%]' 
                : 'bg-white/10 bg-gradient-to-b from-white/40 via-white/10 to-transparent backdrop-blur-[25px] backdrop-saturate-[200%] backdrop-contrast-[110%] backdrop-brightness-[110%]'
          }`}
          style={{ 
             WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.85) 72%, rgba(0,0,0,0.5) 84%, rgba(0,0,0,0.15) 94%, rgba(0,0,0,0) 100%)',
             maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.85) 72%, rgba(0,0,0,0.5) 84%, rgba(0,0,0,0.15) 94%, rgba(0,0,0,0) 100%)'
          }}
        />

        <div className="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between relative z-50">
          <Link to="/" className="flex items-center space-x-3 group z-50">
            <Logo size={36} className="group-hover:scale-115 transition-transform" />
            <span className={`text-xl font-bold tracking-tight relative ${getTextEffect()} ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.brand}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2 h-full">
            {navData.map((item, idx) => (
              <div 
                key={item.name} 
                className="h-full flex items-center"
                onMouseEnter={() => handleNavTabEnter(idx)}
              >
                <button className={`px-5 py-2 text-sm font-semibold transition-all duration-200 rounded-full ${getNavPillStyle(activeDropdown === idx)} ${getTextEffect()}`}>
                  {item.name}
                </button>
              </div>
            ))}
            
            <div className="flex items-center space-x-2 ml-4">
              <div 
                className="relative flex items-center"
                onMouseEnter={handleLangMouseEnter}
                onMouseLeave={handleLangMouseLeave}
              >
                <button 
                  onClick={handleLangClick}
                  className={`px-3 py-2 rounded-full transition-colors flex items-center space-x-1 ${themeMode === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'}`} 
                  title="切换语言 / Switch Language"
                >
                  <Globe size={18} />
                  <span className="text-xs font-semibold uppercase">{languages.find((l: any) => l.code === language)?.label || 'EN'}</span>
                </button>
                
                {/* Desktop Lang Dropdown */}
                <div 
                  className={`absolute top-full right-0 mt-2 w-32 rounded-2xl overflow-hidden transition-[opacity,transform] duration-150 origin-top flex flex-col z-[100] ${
                    langDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                  } ${
                    themeMode === 'dark' 
                       ? 'bg-black/40 backdrop-blur-[25px] backdrop-saturate-[150%] border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_10px_40px_rgba(0,0,0,0.5)] text-white' 
                       : 'glass-liquid text-gray-900'
                  }`}
                >
                  {languages.map((l: any) => (
                    <button
                      key={l.code}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguage(l.code as any);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        language === l.code
                          ? (themeMode === 'dark' ? 'bg-white/10 text-white font-semibold' : 'bg-black/5 text-black font-semibold')
                          : (themeMode === 'dark' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-black/5 text-gray-700')
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${themeMode === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'}`} title="切换主题 / Switch Theme">
                {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={handleSupportClick}
                className={`ml-2 px-5 py-2 text-sm font-bold transition-colors duration-200 rounded-full ${
                  themeMode === 'dark'
                    ? 'text-white bg-white/20 border border-white/20 hover:bg-white/30 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]'
                    : 'text-gray-900 bg-white/30 border border-white/50 hover:bg-white/50 shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]'
                }`}
              >
                {t.support}
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center justify-center -mr-2 space-x-1">
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setLangDropdownOpen(!langDropdownOpen);
                }}
                className={`px-3 py-2 rounded-full active:bg-black/5 flex items-center space-x-1 ${themeMode === 'dark' ? 'text-white' : 'text-gray-800'}`}
              >
                <Globe size={18} />
                <span className="text-xs font-semibold uppercase">{languages.find((l: any) => l.code === language)?.label || 'EN'}</span>
              </button>

              {/* Mobile Lang Dropdown */}
              <div 
                className={`absolute top-full right-0 mt-2 w-32 rounded-2xl overflow-hidden transition-[opacity,transform] duration-150 origin-top flex flex-col z-[100] ${
                  langDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                } ${
                  themeMode === 'dark' 
                    ? 'bg-black/40 backdrop-blur-[25px] backdrop-saturate-[150%] border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_10px_40px_rgba(0,0,0,0.5)] text-white' 
                    : 'glass-liquid text-gray-900'
                }`}
              >
                {languages.map((l: any) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as any);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      language === l.code
                        ? (themeMode === 'dark' ? 'bg-white/10 text-white font-semibold' : 'bg-black/5 text-black font-semibold')
                        : (themeMode === 'dark' ? 'active:bg-white/5 text-gray-300' : 'active:bg-black/5 text-gray-700')
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
            
            <button onClick={toggleTheme} className={`p-2 rounded-full active:bg-black/5 ${themeMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className={`p-2 rounded-full active:bg-black/5 ${themeMode === 'dark' ? 'text-white' : 'text-gray-800'}`}
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setLangDropdownOpen(false);
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Desktop Dropdown */}
        <div 
          className={`absolute top-full left-0 w-full transition-[opacity,transform] duration-200 z-10 ${
            activeDropdown !== null ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          onMouseEnter={() => {
            if (navTimeoutRef.current) {
              clearTimeout(navTimeoutRef.current);
              navTimeoutRef.current = null;
            }
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-10 relative h-[280px]">
            {navData.map((data, idx) => (
              <div 
                key={idx}
                className={`grid grid-cols-3 gap-12 absolute top-10 left-6 right-6 transition-opacity duration-200 ease-out ${
                  activeDropdown === idx 
                    ? 'opacity-100 pointer-events-auto' 
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                  <div className={`col-span-1 border-r pr-8 ${themeMode === 'dark' ? 'border-white/10' : 'border-gray-200/20'}`}>
                    <h3 className={`text-2xl font-bold mb-2 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{data.name}</h3>
                    <p className={`text-sm ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t.selectLang}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-6">
                    {data.items.map((subItem) => (
                      <a 
                        key={subItem.title} 
                        href={subItem.href}
                        onClick={(e) => handleItemClick(e, subItem.title, subItem.href, subItem)}
                        className={`group block p-4 rounded-2xl transition-colors duration-150 ${
                          themeMode === 'dark'
                            ? 'hover:bg-white/10 hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]'
                            : 'hover:bg-white/30 hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <span className={`font-semibold ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{subItem.title}</span>
                          <ExternalLink size={14} className="ml-2 opacity-50" />
                        </div>
                        <p className={`text-xs ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{subItem.desc}</p>
                      </a>
                    ))}
                  </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 pt-20 px-6 transition-[opacity,transform] duration-300 overflow-y-auto ${getGlassStyle('mobile')} ${
          mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-1 pb-10">
          {navData.map((link, idx) => (
            <div key={link.name} className="border-b last:border-b-0 border-inherit">
              <button 
                onClick={() => toggleMobileItem(idx)}
                className={`w-full flex items-center justify-between py-4 transition-colors ${
                  themeMode === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                <span className="text-lg font-bold">{link.name}</span>
                <ChevronDown className={`transition-transform duration-250 ease-out ${mobileExpandedIndex === idx ? 'rotate-180' : ''}`} size={18} />
              </button>
              
              <div 
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                   mobileExpandedIndex === idx ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <div className="space-y-2.5 pt-1 pb-4">
                  {link.items.map((sub) => (
                    <a 
                      key={sub.title} 
                      href={sub.href}
                      onClick={(e) => handleItemClick(e, sub.title, sub.href, sub)}
                      className={`block p-3.5 rounded-2xl transition-all duration-150 border ${
                        themeMode === 'dark'
                          ? 'bg-white/[0.05] border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-white/[0.08] active:bg-white/[0.12]'
                          : 'bg-white/60 border-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.7)] hover:bg-white/80 active:bg-white'
                      }`}
                    >
                      <div className={`font-semibold text-sm flex items-center justify-between ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <span>{sub.title}</span>
                        <ChevronRight size={14} className={themeMode === 'dark' ? 'text-gray-400' : 'text-gray-400'} />
                      </div>
                      {sub.desc && (
                        <p className={`text-xs mt-1 leading-normal ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {sub.desc}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={handleSupportClick}
            className={`w-full flex items-center justify-between py-4 border-b text-left ${themeMode === 'dark' ? 'border-white/10 text-white' : 'border-gray-200/40 text-gray-900'}`}
          >
             <span className="text-lg font-bold">{t.support}</span>
             <ChevronRight className={themeMode === 'dark' ? 'text-gray-500' : 'text-gray-500'} size={18} />
          </button>
        </div>
      </div>

      {/* Support Modal */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center px-6 transition-all duration-300 ${
          showSupportModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-transparent" onClick={() => setShowSupportModal(false)} />
        <div className={`relative w-full max-w-xl rounded-[2rem] p-8 text-center transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${modalStyle} ${showSupportModal ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}>
           <button onClick={() => setShowSupportModal(false)} className={`absolute top-4 right-4 p-2 rounded-full ${themeMode === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}>
             <X size={18} />
           </button>
           <h3 className={`text-2xl font-bold mb-2`}>{t.supportThanks}</h3>
           <div className={`bg-white p-2 rounded-xl shadow-inner mb-2 mx-auto w-full ${themeMode === 'dark' ? 'opacity-95' : ''}`}>
              <img 
                src={qrImage} 
                loading="eager" 
                decoding="async" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== SUPPORT_QR_CDN && target.src.indexOf('iili.io') === -1) {
                    target.src = SUPPORT_QR_CDN;
                  } else if (target.src !== SUPPORT_QR_BASE64) {
                    target.src = SUPPORT_QR_BASE64;
                  }
                }}
                className="w-full h-auto rounded-lg shadow-sm object-contain max-h-[70vh]" 
                alt="Support Payment QR Code" 
              />
           </div>
        </div>
      </div>
    </>
  );
};
