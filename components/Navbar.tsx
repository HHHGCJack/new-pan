import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

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
      { title: '网盘资源搜', desc: '全网影视资源聚合', href: 'https://pansou.app' },
      { title: '极简小说', desc: '沉浸式阅读体验', href: '#' }
    ] 
  },
  { 
    name: '科技', 
    items: [
      { title: 'AI 智能体', desc: '私人数字助手', href: '#' },
      { title: '实验室', desc: 'Beta 功能测试', href: '#' }
    ] 
  }
];

export const Navbar: React.FC = () => {
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

  // FIXED: Re-introduced overflow locking to prevent background scrolling when menu/modal is open.
  // Since scrollbars are hidden globally via CSS, this won't cause layout shifts/twitching,
  // but it ensures the background doesn't move when interacting with the menu.
  useEffect(() => {
    if (mobileMenuOpen || showSupportModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, showSupportModal]);

  const toggleMobileItem = (index: number) => {
    setMobileExpandedIndex(mobileExpandedIndex === index ? null : index);
  };

  const handleSupportClick = () => {
    setShowSupportModal(true);
    // Smooth transition: Close menu shortly after modal starts opening
    setTimeout(() => {
        setMobileMenuOpen(false);
    }, 100);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          mobileMenuOpen
            ? 'bg-transparent border-transparent' // Force transparent when mobile menu is open to avoid double-glass layering/flicker
            : isDropdownOpen 
              ? 'bg-white/90 backdrop-blur-[100px] backdrop-saturate-[250%] border-b border-transparent shadow-sm' 
              : isScrolled 
                ? 'bg-white/60 backdrop-blur-[80px] backdrop-saturate-[250%] border-b border-white/50 shadow-sm' 
                : 'bg-white/10 backdrop-blur-[20px] border-b border-transparent'
        }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between relative z-50">
          {/* Logo */}
          <a href="#" className="text-xl font-bold tracking-tight text-gray-900 relative mix-blend-overlay-dark">
            G胖儿GongPan
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2 h-full">
            {navData.map((item, idx) => (
              <div 
                key={item.name} 
                className="h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(idx)}
              >
                <button 
                  className={`px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                    activeDropdown === idx 
                      ? 'text-black bg-black/5' // Active state
                      : 'text-gray-600 hover:text-black hover:bg-black/5' // Inactive state
                  }`}
                >
                  {item.name}
                </button>
              </div>
            ))}
            
            {/* Support Button */}
            <div className="h-full flex items-center ml-2">
              <button 
                onClick={handleSupportClick}
                className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-white hover:bg-black transition-all duration-300 rounded-full"
              >
                支持我
              </button>
            </div>
          </div>

          {/* Mobile Menu Button - Fixed dimensions to prevent layout shift */}
          <div className="md:hidden flex items-center justify-center w-10 h-10 -mr-2">
            <button 
              className="p-2 text-gray-800 rounded-full transition-colors active:bg-black/5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Desktop Dropdown Panel */}
        <div 
          className={`absolute top-full left-0 w-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] bg-white/90 backdrop-blur-[100px] backdrop-saturate-[250%] shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-b border-white/50 ${
            activeDropdown !== null 
              ? 'opacity-100 visible translate-y-0 max-h-[400px]' 
              : 'opacity-0 invisible -translate-y-2 max-h-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-12">
            {activeDropdown !== null && (
              <div className="animate-fade-in grid grid-cols-3 gap-12">
                  <div className="col-span-1 border-r border-gray-200/30 pr-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{navData[activeDropdown].name}</h3>
                    <p className="text-base text-gray-500 font-medium leading-relaxed">探索精心挑选的优质资源，<br/>为您打造极致体验。</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-6">
                    {navData[activeDropdown].items.map((subItem) => (
                      <a 
                        key={subItem.title} 
                        href={subItem.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block p-4 rounded-3xl hover:bg-white/40 transition-all duration-300 border border-transparent hover:border-white/40"
                      >
                        <div className="flex items-center mb-1.5">
                          <span className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{subItem.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0" />
                        </div>
                        <p className="text-sm text-gray-500 group-hover:text-gray-700 font-medium">{subItem.desc}</p>
                      </a>
                    ))}
                  </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Ultra Liquid Glass with Enhanced Animations */}
      <div 
        className={`fixed inset-0 z-40 flex flex-col pt-24 px-6 transform-gpu will-change-[transform,opacity] transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] bg-white/40 backdrop-blur-[80px] backdrop-saturate-[250%] ${
          mobileMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ overscrollBehavior: 'contain' }} 
      >
        <div className={`flex flex-col space-y-2 transition-transform duration-500 ease-out delay-75 ${
           mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'
        }`}>
          {navData.map((link, idx) => (
            <div key={link.name} className="overflow-hidden">
              <button 
                onClick={() => toggleMobileItem(idx)}
                className="w-full flex items-center justify-between py-5 border-b border-gray-900/10 active:bg-white/20 transition-colors"
              >
                <span className="text-xl font-bold text-gray-900 tracking-tight">{link.name}</span>
                <ChevronDown 
                  className={`text-gray-500 transition-transform duration-300 ${mobileExpandedIndex === idx ? 'rotate-180 text-black' : ''}`} 
                  size={20} 
                />
              </button>
              
              {/* Liquid Jelly Container Animation */}
              <div 
                className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top ${
                  mobileExpandedIndex === idx ? 'max-h-[500px] opacity-100 py-4 scale-100' : 'max-h-0 opacity-0 py-0 scale-95'
                }`}
              >
                <div className="space-y-3 pl-2">
                  {link.items.map((sub, i) => (
                    /* Mobile Submenu Item - Agile Liquid/Jelly Effect */
                    <a 
                      key={sub.title} 
                      href={sub.href}
                      target={sub.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ transitionDelay: `${i * 50}ms` }}
                      className={`
                        block p-4 rounded-2xl border transition-all duration-300 transform
                        bg-white/30 backdrop-blur-md border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                        active:scale-95 active:bg-white/50 active:shadow-inner active:border-white/40
                        hover:scale-[1.02] hover:bg-white/40
                        ${mobileExpandedIndex === idx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                      `}
                    >
                      <div className="font-semibold text-base text-gray-900 flex items-center">
                        {sub.title}
                        <ChevronRight size={16} className="ml-auto text-gray-400" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-medium">{sub.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {/* Mobile Support Button */}
          <button 
            onClick={handleSupportClick}
            className="w-full flex items-center justify-between py-5 border-b border-gray-900/10 active:bg-white/20 transition-colors text-left"
          >
             <span className="text-xl font-bold text-gray-900 tracking-tight">支持我</span>
             <ChevronRight className="text-gray-500" size={20} />
          </button>
        </div>
        
        <div className={`mt-auto mb-10 text-center transition-opacity duration-700 delay-200 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
           <p className="text-[10px] text-gray-500 tracking-widest uppercase font-semibold">Pan Studio © 2026</p>
        </div>
      </div>

      {/* Support Modal - Enhanced Liquid Glass Card, Simple Overlay */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-6 transition-all duration-500 ${
          showSupportModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Overlay - Darkened for focus, NO blur as requested */}
        <div 
          className="absolute inset-0 bg-black/40 transition-opacity duration-500" 
          onClick={() => setShowSupportModal(false)}
        />
        
        {/* Card - Premium Liquid Glass Style */}
        <div 
          className={`relative z-10 w-full max-w-[500px] 
            bg-white/60 backdrop-blur-[50px] backdrop-saturate-[250%] 
            border border-white/60 shadow-[0_40px_100px_rgba(0,0,0,0.2)] 
            rounded-[2.5rem] p-8 md:p-10 text-center transform 
            transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
            ${showSupportModal ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}
          `}
        >
           <button 
             onClick={() => setShowSupportModal(false)} 
             className="absolute top-6 right-6 p-2 bg-black/5 rounded-full hover:bg-black/10 transition-colors"
           >
             <X size={20} className="text-gray-600" />
           </button>

           <div className="mb-8 mt-2">
              <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">感谢支持</h3>
              <p className="text-gray-600 text-sm font-medium">您的每一份支持，都是我前进的动力。</p>
           </div>

           <div className="p-4 bg-white/50 backdrop-blur-md rounded-[2rem] shadow-inner border border-white/40 mb-8 mx-auto w-full max-w-[280px]">
              <img 
                src="https://img2.nloln.de/file/BQACAgUAAyEGAASLVN5eAAICk2mN45AwGUskAt-IElNLMd01oxSKAAKkHAACodFxVE4r2ioOGqDxOgQ.jpg" 
                alt="QR Code" 
                className="w-full h-auto object-cover rounded-xl"
              />
           </div>
           
           <p className="text-xs text-gray-500 font-medium tracking-wide">微信扫一扫 (WeChat Pay)</p>
        </div>
      </div>
    </>
  );
};