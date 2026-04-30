import React, { useState, createContext, useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { ReadingPro } from './components/ReadingPro';
import { Admin } from './components/Admin';
import { ThemeContextType, Theme, Language } from './types';
import { supabase } from './src/lib/supabase';
import { translations } from './i18n';

// Create Context
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  language: 'zh',
  setLanguage: () => {},
  showToast: () => {},
  handleCardToast: () => {},
  pansouEnabled: true,
  setPansouEnabled: () => {},
});

// Use Context Hook
export const useTheme = () => useContext(ThemeContext);

// Simple Toast Component - Enhanced Liquid Glass
const Toast = ({ message, visible }: { message: string; visible: boolean }) => {
  const { theme } = useTheme();
  
  // Always Liquid Glass style, adapted to theme
  let styleClass = '';
  if (theme === 'dark') {
    styleClass = 'bg-black/40 backdrop-blur-[20px] backdrop-saturate-[150%] border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(255,255,255,0.05)] text-white';
  } else {
    styleClass = 'bg-white/15 backdrop-blur-[20px] backdrop-saturate-[200%] border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.2)] text-gray-900';
  }

  return (
    <div 
      className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
      }`}
    >
      <div className={`px-6 py-3 rounded-full border flex items-center space-x-2 transition-all duration-500 relative overflow-hidden ${styleClass}`}>
         {/* Glossy Reflection Overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2 pointer-events-none" />
         <span className={`w-2 h-2 rounded-full animate-pulse relative z-10 ${theme === 'dark' ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}></span>
         <span className={`text-sm font-semibold tracking-wide relative z-10`}>{message}</span>
      </div>
    </div>
  );
};

function App() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('敬请期待 Coming Soon');
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('zh');
  const [pansouEnabled, setPansouEnabled] = useState(true);

  // Apply dark mode class to body if needed
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
    showToast(translations[language].actions.comingSoon);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, language, setLanguage, showToast, handleCardToast, pansouEnabled, setPansouEnabled }}>
      {/* Import Cursive Fonts for Handwriting Animation */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Zhi+Mang+Xing&display=swap');
        `}
      </style>
      
      <div className={`min-h-screen flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-500 relative overflow-hidden ${theme === 'dark' ? 'bg-[#0f0f11]' : 'bg-[#f5f5f7]'}`}>
        
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