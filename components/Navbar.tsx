import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, ExternalLink, Settings, Zap, Droplets, Monitor, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../App';
import { translations } from '../i18n';

export const Navbar: React.FC = () => {
  const { theme, setTheme, language, setLanguage, showToast, pansouEnabled } = useTheme();
  
  const t = translations[language];

  const navData = [
    { 
      name: t.nav.study, 
      items: [
        { title: t.nav.readingPro, desc: t.nav.readingProDesc, href: '/reading-pro' }
      ] 
    },
    { 
      name: t.nav.entertainment, 
      items: [
        { 
          title: t.nav.pansou, 
          desc: t.nav.pansouDesc, 
          href: pansouEnabled ? 'http://gongcheng.yyboxdns.com:12309' : '#',
          onToast: () => !pansouEnabled ? showToast(t.actions.suspended) : undefined
        },
        { title: t.nav.novel, desc: t.nav.novelDesc, href: '#' }
      ] 
    },
    { 
      name: t.nav.tools, 
      items: [
        { title: t.nav.admin, desc: t.nav.adminDesc, href: '/admin' }
      ] 
    }
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null);

  const isDropdownOpen = activeDropdown !== null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll
  useEffect(() => {
    const shouldLock = mobileMenuOpen || showSupportModal;
    document.body.style.overflow = shouldLock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, showSupportModal]);

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
        showToast(t.actions.comingSoon);
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
  };

  // Unified Glass Style Configuration (Only Liquid Glass Adapted to Light/Dark)
  const getGlassStyle = (type: 'nav' | 'dropdown' | 'mobile') => {
    const gpuFix = 'transform-gpu backface-hidden';
    
    let liquidStyle = '';
    
    if (theme === 'dark') {
      liquidStyle = `
        bg-black/30 
        bg-gradient-to-br from-white/10 via-transparent to-white/5
        backdrop-blur-[25px] 
        backdrop-saturate-[180%] 
        backdrop-contrast-[110%]
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_inset_0_-1px_2px_rgba(255,255,255,0.05),_inset_1px_0_2px_rgba(255,255,255,0.05)]
        text-white
        ${gpuFix}
      `;
    } else {
      liquidStyle = `
        bg-white/10 
        bg-gradient-to-br from-white/40 via-white/5 to-white/20
        backdrop-blur-[25px] 
        backdrop-saturate-[200%] 
        backdrop-contrast-[110%]
        backdrop-brightness-[110%]
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),_inset_0_-1px_2px_rgba(255,255,255,0.2),_inset_1px_0_2px_rgba(255,255,255,0.3)]
        text-gray-900
        ${gpuFix}
      `;
    }

    const borderColor = theme === 'dark' ? 'border-white/10' : 'border-white/30';
    if (type === 'nav') {
      if (isDropdownOpen) return `${liquidStyle} border-b border-transparent shadow-none`;
      if (isScrolled) return `${liquidStyle} border-b ${borderColor} shadow-sm`;
      return `bg-transparent border-b border-transparent`;
    }
    if (type === 'dropdown') {
      return `${liquidStyle} border-t ${borderColor} shadow-[0_50px_100px_rgba(0,0,0,0.2)]`;
    }
    if (type === 'mobile') {
      return `${liquidStyle} border-b ${borderColor}`;
    }
    return '';
  };

  // Styles for the "Pill" hover effect in navbar
  const getNavPillStyle = (isActive: boolean) => {
    if (!isActive) {
      return theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black';
    }
    
    // Liquid Pill: Glossy, inner shadow, border
    if (theme === 'dark') {
      return 'text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.5)]';
    } else {
      return 'text-black bg-white/20 backdrop-blur-md border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.08)]';
    }
  };

  // Text effect for Liquid mode
  const getTextEffect = () => {
    return theme === 'dark' ? 'drop-shadow-md text-shadow-sm' : 'drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] text-shadow-sm';
  };

  // Modal Style
  let modalStyle = '';
  if (theme === 'dark') {
    modalStyle = 'bg-black/60 backdrop-blur-[30px] backdrop-saturate-[220%] shadow-[0_50px_100px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/10 will-change-[backdrop-filter,transform,opacity] text-white';
  } else {
    modalStyle = 'bg-white/10 backdrop-blur-[30px] backdrop-saturate-[220%] shadow-[0_50px_100px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/30 will-change-[backdrop-filter,transform,opacity] text-gray-900';
  }

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 transition-all duration-500 pointer-events-none ${
          theme === 'dark' ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm'
        } ${
          activeDropdown !== null || mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          mobileMenuOpen ? 'bg-transparent' : getGlassStyle('nav')
        }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between relative z-50">
          <Link to="/" className={`text-xl font-bold tracking-tight relative flex-shrink-0 ${getTextEffect()} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            G胖儿GongPan
          </Link>

          <div className="hidden md:flex flex-1 justify-center items-center h-full space-x-2">
            {navData.map((item, idx) => (
              <div 
                key={item.name} 
                className="h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(idx)}
              >
                <button 
                  className={`px-5 py-2 text-sm font-semibold transition-all duration-300 rounded-full ${getNavPillStyle(activeDropdown === idx)} ${getTextEffect()}`}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3 h-full justify-end flex-shrink-0">
             {/* Theme Toggle */}
             <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`p-2 rounded-full transition-all duration-300 ${
                  theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-yellow-300' : 'bg-black/5 hover:bg-black/10 text-gray-700'
                }`}
             >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             {/* Language Dropdown */}
             <button 
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-all duration-300 ${
                  theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-800'
                }`}
             >
                <Globe size={16} />
                <span className="text-xs font-bold uppercase">{language === 'zh' ? 'EN' : '中'}</span>
             </button>

            <button 
              onClick={handleSupportClick}
              className={`px-5 py-2 text-sm font-bold transition-all duration-300 rounded-full ${
                theme === 'dark' 
                  ? 'text-white bg-white/20 border border-white/30 hover:bg-white/30 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]'
                  : 'text-gray-900 bg-white/30 border border-white/50 hover:bg-white/50 shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]' 
              }`}
            >
              {t.actions.support}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
             <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`p-2 rounded-full transition-all duration-300 ${
                  theme === 'dark' ? 'text-yellow-300 active:bg-white/10' : 'text-gray-700 active:bg-black/5'
                }`}
             >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button 
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className={`p-2 rounded-full transition-all duration-300 ${
                  theme === 'dark' ? 'text-white active:bg-white/10' : 'text-gray-800 active:bg-black/5'
                }`}
             >
                <div className="flex items-center justify-center font-bold text-sm h-5 w-5 border-2 rounded-full border-current">
                   {language === 'zh' ? 'E' : '中'}
                </div>
             </button>
            <button 
              className={`p-2 rounded-full active:bg-black/5 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Desktop Dropdown */}
        <div 
          className={`absolute top-full left-0 w-full overflow-hidden transition-all duration-300 z-10 ${getGlassStyle('dropdown')} ${
            activeDropdown !== null ? 'opacity-100 visible h-auto' : 'opacity-0 invisible h-0 border-none'
          }`}
        >
          {/* Extra Blur Layer for enhanced depth */}
          <div className={`absolute inset-0 w-full h-full -z-10 ${theme === 'dark' ? 'bg-black/40 backdrop-blur-[20px]' : 'bg-white/10 backdrop-blur-[30px]'}`} />

          <div className="max-w-7xl mx-auto px-6 py-10 flex justify-center">
            {activeDropdown !== null && (
              <div className="grid grid-cols-2 gap-12 animate-fade-in w-full max-w-2xl">
                    {navData[activeDropdown].items.map((subItem) => (
                      <a 
                        key={subItem.title} 
                        href={subItem.href}
                        onClick={(e) => handleItemClick(e, subItem.title, subItem.href, subItem)}
                        className={`group block p-4 rounded-2xl transition-all duration-200 ${
                            theme === 'dark' 
                            ? 'hover:bg-white/10 hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]' 
                            : 'hover:bg-white/30 hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]' 
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{subItem.title}</span>
                          <ExternalLink size={14} className={`ml-2 opacity-50`} />
                        </div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{subItem.desc}</p>
                      </a>
                    ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 pt-20 px-6 transition-all duration-300 ${getGlassStyle('mobile')} ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className={`flex flex-col space-y-1 transition-all duration-300 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'}`}>
          {navData.map((link, idx) => (
            <div key={link.name} className="overflow-hidden">
              <button 
                onClick={() => toggleMobileItem(idx)}
                className={`w-full flex items-center justify-between py-4 border-b ${theme === 'dark' ? 'border-white/10 text-white' : 'border-gray-500/10 text-gray-900'}`}
              >
                <span className="text-lg font-bold">{link.name}</span>
                <ChevronDown className={`transition-transform duration-300 ${mobileExpandedIndex === idx ? 'rotate-180' : ''}`} size={18} />
              </button>
              
              {/* Animated Sub-menu using Grid for smooth height transition */}
              <div 
                className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                   mobileExpandedIndex === idx ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                   <div className={`space-y-3 pt-2 pb-4 pl-2 transition-all duration-500 ${mobileExpandedIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                    {link.items.map((sub) => (
                      <a 
                        key={sub.title} 
                        href={sub.href}
                        onClick={(e) => handleItemClick(e, sub.title, sub.href, sub)}
                        className={`block p-4 rounded-2xl transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-white/10 border border-white/20 shadow-sm active:bg-white/20 active:scale-[0.98]'
                            : 'bg-white/40 border border-white/60 shadow-[inset_0_1px_10px_rgba(255,255,255,0.8),0_10px_20px_rgba(0,0,0,0.1)] active:bg-white/60 active:scale-[0.98] active:shadow-inner'
                        }`}
                      >
                        <div className={`font-medium text-sm flex items-center justify-between ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {sub.title}
                          <ChevronRight size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={handleSupportClick}
            className={`w-full flex items-center justify-between py-4 border-b text-left ${theme === 'dark' ? 'border-white/10 text-white' : 'border-gray-500/10 text-gray-900'}`}
          >
             <span className="text-lg font-bold">{t.actions.support}</span>
             <ChevronRight className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} size={18} />
          </button>
        </div>
      </div>

      {/* Support Modal */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center px-6 transition-all duration-300 ${
          showSupportModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/10" onClick={() => setShowSupportModal(false)} />
        <div className={`relative w-full max-w-xl rounded-[2rem] p-8 text-center transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${modalStyle} ${showSupportModal ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}>
           <button onClick={() => setShowSupportModal(false)} className={`absolute top-4 right-4 p-2 rounded-full ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}>
             <X size={18} />
           </button>
           <h3 className={`text-2xl font-bold mb-2`}>{t.actions.support}</h3>
           <div className={`p-2 rounded-xl shadow-inner mb-4 mx-auto w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-white'}`}>
              <img src="https://img2.nloln.de/file/BQACAgUAAyEGAASLVN5eAAICk2mN45AwGUskAt-IElNLMd01oxSKAAKkHAACodFxVE4r2ioOGqDxOgQ.jpg" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-auto rounded-lg" alt="QR" />
           </div>
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">WeChat Pay</p>
        </div>
      </div>
    </>
  );
};
