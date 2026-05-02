import React, { useState, createContext, useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { ReadingPro } from './components/ReadingPro';
import { Admin } from './components/Admin';
import { ThemeContextType, ThemeMode, Language } from './types';
import { supabase } from './src/lib/supabase';

// Create Context
export const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  setThemeMode: () => {},
  language: 'zh',
  setLanguage: () => {},
  showToast: () => {},
  handleCardToast: () => {},
  pansouEnabled: true,
  setPansouEnabled: () => {},
});

// Use Context Hook
export const useTheme = () => useContext(ThemeContext);

// Translations
export const translations: Record<Language, { comingSoon: string, visitNow: string }> = {
  zh: { comingSoon: '敬请期待 Coming Soon', visitNow: '立即访问' },
  en: { comingSoon: 'Coming Soon', visitNow: 'Visit Now' },
  ja: { comingSoon: '近日公開 Coming Soon', visitNow: '今すぐ訪問' },
  ko: { comingSoon: '출시 예정 Coming Soon', visitNow: '지금 방문하기' },
  es: { comingSoon: 'Próximamente Coming Soon', visitNow: 'Visitar ahora' },
  fr: { comingSoon: 'Bientôt disponible Coming Soon', visitNow: 'Visitez maintenant' },
  de: { comingSoon: 'Demnächst Coming Soon', visitNow: 'Jetzt besuchen' },
  el: { comingSoon: 'Σύντομα Κοντά Σας Coming Soon', visitNow: 'Επισκεφθείτε τώρα' },
};

// Simple Toast Component - Liquid Glass
const Toast = ({ message, visible }: { message: string; visible: boolean }) => {
  const { themeMode } = useTheme();
  
  // Dynamic styles based on theme
  const styleClass = themeMode === 'light'
    ? 'bg-white/15 backdrop-blur-[20px] backdrop-saturate-[200%] border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.2)] text-gray-900'
    : 'bg-black/40 backdrop-blur-[20px] backdrop-saturate-[200%] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.1)] text-white';

  return (
    <div 
      className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
      }`}
    >
      <div className={`px-6 py-3 rounded-full border flex items-center space-x-2 transition-all duration-500 relative overflow-hidden ${styleClass}`}>
         {/* Glossy Reflection Overlay */}
         <div className={`absolute inset-0 bg-gradient-to-b ${themeMode === 'light' ? 'from-white/30' : 'from-white/5'} to-transparent h-1/2 pointer-events-none`} />
         <span className={`w-2 h-2 rounded-full animate-pulse relative z-10 ${themeMode === 'light' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]'}`}></span>
         <span className="text-sm font-semibold tracking-wide relative z-10">{message}</span>
      </div>
    </div>
  );
};

function App() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('敬请期待 Coming Soon');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<Language>('zh');
  const [pansouEnabled, setPansouEnabled] = useState(true);

  useEffect(() => {
    // Apply theme to document
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('id', 'pansou_enabled')
          .single();
        
        if (data && !error) {
          setPansouEnabled(data.value);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleCardToast = () => {
    showToast(translations[language].comingSoon);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, language, setLanguage, showToast, handleCardToast, pansouEnabled, setPansouEnabled }}>
      <div className={`min-h-screen flex flex-col font-sans selection:bg-blue-500/30 transition-colors duration-500 relative overflow-hidden ${themeMode === 'dark' ? 'bg-[#0a0a0c] text-white' : 'bg-[#f5f5f7] text-black'}`}>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <Toast message={toastMessage} visible={toastVisible} />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reading-pro" element={<ReadingPro />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>

          <Footer />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;