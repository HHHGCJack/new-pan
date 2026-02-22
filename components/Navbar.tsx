import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, ExternalLink, Settings, Zap, Droplets } from 'lucide-react';
import { useTheme } from '../App';

const navData = [
  { 
    name: '学习', 
    items: [
      { title: '外刊精读 Pro', desc: '深度解析国际刊物', href: 'http://gongcheng.yyboxdns.com:25045/' }
    ] 
  },
  { 
    name: '娱乐', 
    items: [
      { title: '网盘资源搜', desc: '全网影视资源聚合', href: 'http://gongcheng.yyboxdns.com:12309' },
      { title: '极简小说', desc: '沉浸式阅读体验', href: '#' }
    ] 
  },
  { 
    name: '科技', 
    items: [
      { title: 'AI 智能体', desc: '私人数字助手', href: '#' },
      { title: '实验室', desc: 'UI 视觉风格设置', href: '#settings' }
    ] 
  }
];

export const Navbar: React.FC = () => {
  const { visualEffect, setVisualEffect, showToast } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
    const shouldLock = mobileMenuOpen || showSupportModal || showSettingsModal;
    document.body.style.overflow = shouldLock ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, showSupportModal, showSettingsModal]);

  const toggleMobileItem = (index: number) => {
    setMobileExpandedIndex(mobileExpandedIndex === index ? null : index);
  };

  const handleSupportClick = () => {
    setShowSupportModal(true);
    setMobileMenuOpen(false);
  };

  const handleItemClick = (e: React.MouseEvent, title: string, href: string) => {
    if (title === '实验室') {
      e.preventDefault();
      setShowSettingsModal(true);
      setMobileMenuOpen(false);
      return;
    }

    if (href === '#' || title === 'AI 智能体' || title === '极简小说') {
        e.preventDefault();
        showToast('敬请期待 Coming Soon');
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        return;
    }
  };

  // Unified Glass Style Configuration
  const getGlassStyle = (type: 'nav' | 'dropdown' | 'mobile') => {
    const gpuFix = 'transform-gpu backface-hidden';
    
    // 1. Liquid Glass (The requested effect)
    // High saturation, strong blur, subtle transparency, glossy highlights
    const liquidStyle = `
      bg-white/10 
      backdrop-blur-[50px] 
      backdrop-saturate-[200%] 
      shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.1)]
      ${gpuFix}
    `;

    // 2. Standard Blur (Fallback)
    const blurStyle = `
      bg-white/80 
      backdrop-blur-xl 
      border-b border-gray-200 
      ${gpuFix}
    `;

    if (visualEffect === 'liquid') {
      const borderColor = 'border-white/30';
      if (type === 'nav') {
        // Navbar specific adjustments
        if (isDropdownOpen) return `${liquidStyle} border-b border-transparent shadow-none`;
        if (isScrolled) return `${liquidStyle} border-b ${borderColor} shadow-sm`;
        return `bg-transparent border-b border-transparent`;
      }
      if (type === 'dropdown') {
        // Dropdown matches navbar exactly
        return `${liquidStyle} border-t border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.1)]`;
      }
      if (type === 'mobile') {
        return `${liquidStyle} border-b border-white/20`;
      }
    } else {
      // Blur effect fallback
      const borderColor = 'border-gray-200';
      if (type === 'nav') {
        if (isDropdownOpen) return `${blurStyle} border-transparent shadow-none`;
        if (isScrolled) return `${blurStyle} shadow-sm`;
        return `bg-white/60 backdrop-blur-md border-b border-transparent`;
      }
      if (type === 'dropdown') return `${blurStyle} border-b ${borderColor} shadow-[0_40px_80px_rgba(0,0,0,0.15)]`;
      if (type === 'mobile') return `${blurStyle} border-b ${borderColor}`;
    }
    return '';
  };

  // Styles for the "Pill" hover effect in navbar
  const getNavPillStyle = (isActive: boolean) => {
    if (!isActive) return 'text-gray-600 hover:text-black'; // Basic state
    
    if (visualEffect === 'liquid') {
      // Liquid Pill: Glossy, inner shadow, border
      return 'text-black bg-white/20 backdrop-blur-md border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.08)]';
    }
    // Standard Pill
    return 'text-black bg-black/5';
  };

  // Text effect for Liquid mode
  const getTextEffect = () => {
    if (visualEffect === 'liquid') {
      return 'drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] text-shadow-sm';
    }
    return '';
  };

  // Modal Style
  const modalStyle = visualEffect === 'liquid'
    ? 'bg-white/10 backdrop-blur-[30px] backdrop-saturate-[220%] shadow-[0_50px_100px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.1)] border border-white/30 will-change-[backdrop-filter,transform,opacity]'
    : 'bg-white/95 backdrop-blur-2xl shadow-2xl border border-gray-100 will-change-[backdrop-filter,transform,opacity]';

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          mobileMenuOpen ? 'bg-transparent' : getGlassStyle('nav')
        }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between relative z-50">
          <a href="#" className={`text-xl font-bold tracking-tight text-gray-900 relative ${getTextEffect()}`}>
            G胖儿GongPan
          </a>

          <div className="hidden md:flex items-center space-x-2 h-full">
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
            
            <div className="h-full flex items-center ml-2">
              <button 
                onClick={handleSupportClick}
                className={`px-5 py-2 text-sm font-bold transition-all duration-300 rounded-full ${visualEffect === 'liquid' ? 'text-gray-900 bg-white/30 border border-white/50 hover:bg-white/50 shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]' : 'text-white bg-black hover:bg-gray-800'}`}
              >
                支持我
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center justify-center -mr-2">
            <button 
              className="p-2 text-gray-800 rounded-full active:bg-black/5"
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
          <div className="absolute inset-0 w-full h-full bg-white/10 backdrop-blur-[30px] -z-10" />

          <div className="max-w-7xl mx-auto px-6 py-10">
            {activeDropdown !== null && (
              <div className="grid grid-cols-3 gap-12 animate-fade-in">
                  <div className="col-span-1 border-r border-gray-200/20 pr-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{navData[activeDropdown].name}</h3>
                    <p className="text-sm text-gray-500">精选优质资源</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-6">
                    {navData[activeDropdown].items.map((subItem) => (
                      <a 
                        key={subItem.title} 
                        href={subItem.href}
                        target={subItem.href === '#settings' ? undefined : "_blank"}
                        onClick={(e) => handleItemClick(e, subItem.title, subItem.href)}
                        className={`group block p-4 rounded-2xl transition-all duration-200 ${
                            visualEffect === 'liquid' 
                            ? 'hover:bg-white/30 hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <span className="font-semibold text-gray-900">{subItem.title}</span>
                          {subItem.title === '实验室' ? <Settings size={14} className="ml-2" /> : <ExternalLink size={14} className="ml-2 opacity-50" />}
                        </div>
                        <p className="text-xs text-gray-500">{subItem.desc}</p>
                      </a>
                    ))}
                  </div>
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
                className="w-full flex items-center justify-between py-4 border-b border-gray-500/10"
              >
                <span className="text-lg font-bold text-gray-900">{link.name}</span>
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
                        onClick={(e) => handleItemClick(e, sub.title, sub.href)}
                        className={`block p-4 rounded-2xl transition-all duration-300 ${
                          visualEffect === 'liquid'
                            ? 'bg-white/40 border border-white/60 shadow-[inset_0_1px_10px_rgba(255,255,255,0.8),0_10px_20px_rgba(0,0,0,0.1)] active:bg-white/60 active:scale-[0.98] active:shadow-inner'
                            : 'bg-white/40 border border-gray-200 shadow-sm active:bg-gray-100 active:scale-[0.98]'
                        }`}
                      >
                        <div className="font-medium text-sm text-gray-900 flex items-center justify-between">
                          {sub.title}
                          <ChevronRight size={14} className="text-gray-400" />
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
            className="w-full flex items-center justify-between py-4 border-b border-gray-500/10 text-left"
          >
             <span className="text-lg font-bold text-gray-900">支持我</span>
             <ChevronRight className="text-gray-500" size={18} />
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
           <button onClick={() => setShowSupportModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10">
             <X size={18} />
           </button>
           <h3 className="text-2xl font-bold text-gray-900 mb-2">感谢支持</h3>
           <div className="bg-white p-2 rounded-xl shadow-inner mb-4 mx-auto w-full">
              <img src="https://images.weserv.nl/?url=img2.nloln.de/file/BQACAgUAAyEGAASLVN5eAAICk2mN45AwGUskAt-IElNLMd01oxSKAAKkHAACodFxVE4r2ioOGqDxOgQ.jpg" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" alt="QR" />
           </div>
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">WeChat Pay</p>
        </div>
      </div>

      {/* Settings Modal */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center px-6 transition-all duration-300 ${
          showSettingsModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/10" onClick={() => setShowSettingsModal(false)} />
        <div className={`relative w-full max-w-sm rounded-[2rem] p-8 text-center transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${modalStyle} ${showSettingsModal ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}>
           <button onClick={() => setShowSettingsModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10">
             <X size={18} />
           </button>
           <h3 className="text-2xl font-bold text-gray-900 mb-6">实验室设置</h3>
           
           <div className="bg-gray-100/50 p-1 rounded-xl flex relative mb-4">
              <button onClick={() => setVisualEffect('liquid')} className={`flex-1 py-3 rounded-lg text-sm font-bold relative z-10 transition-colors ${visualEffect === 'liquid' ? 'text-black' : 'text-gray-500'}`}>
                液态玻璃
              </button>
              <button onClick={() => setVisualEffect('blur')} className={`flex-1 py-3 rounded-lg text-sm font-bold relative z-10 transition-colors ${visualEffect === 'blur' ? 'text-black' : 'text-gray-500'}`}>
                高斯模糊
              </button>
              <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ${visualEffect === 'blur' ? 'translate-x-[100%] translate-x-2' : 'translate-x-0'}`} />
           </div>
           
           {/* Added Explanation Text */}
           <div className={`text-left p-4 rounded-xl border transition-colors duration-300 ${visualEffect === 'liquid' ? 'bg-blue-50/50 border-blue-100/50 text-blue-900' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
              <div className="flex items-start">
                 {visualEffect === 'liquid' ? <Droplets size={16} className="mt-0.5 mr-2 text-blue-500 shrink-0" /> : <Zap size={16} className="mt-0.5 mr-2 text-gray-400 shrink-0" />}
                 <p className="text-xs leading-relaxed font-medium">
                   {visualEffect === 'liquid' 
                     ? '液态玻璃：模拟高透光介质，具有强烈的高光折射、低模糊度和鲜明的色彩通透感。'
                     : '高斯模糊：经典的磨砂玻璃质感，高不透明度，光影柔和，减少视觉干扰。'}
                 </p>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};