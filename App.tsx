import React, { useState, createContext, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { ReadingPro } from './components/ReadingPro';
import { Admin } from './components/Admin';
import { ThemeContextType, VisualEffect } from './types';

// Create Context
export const ThemeContext = createContext<ThemeContextType>({
  visualEffect: 'liquid',
  setVisualEffect: () => {},
  showToast: () => {},
  handleCardToast: () => {},
});

// Use Context Hook
export const useTheme = () => useContext(ThemeContext);

// Simple Toast Component - Enhanced Liquid Glass
const Toast = ({ message, visible }: { message: string; visible: boolean }) => {
  const { visualEffect } = useTheme();
  
  // Dynamic styles based on theme - Enhanced Liquid Glass with Glossy Highlights
  let styleClass = '';
  if (visualEffect === 'liquid') {
    styleClass = 'bg-white/15 backdrop-blur-[20px] backdrop-saturate-[200%] border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.2)]';
  } else if (visualEffect === 'cyberpunk') {
    styleClass = 'bg-black/80 backdrop-blur-xl border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.5),_inset_0_0_10px_rgba(6,182,212,0.2)] text-cyan-400';
  } else {
    styleClass = 'bg-white/95 backdrop-blur-xl border-gray-200 shadow-xl';
  }

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
         <span className={`w-2 h-2 rounded-full animate-pulse relative z-10 ${visualEffect === 'cyberpunk' ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}></span>
         <span className={`text-sm font-semibold tracking-wide relative z-10 ${visualEffect === 'cyberpunk' ? 'text-cyan-100' : 'text-gray-900'}`}>{message}</span>
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
    <ThemeContext.Provider value={{ visualEffect, setVisualEffect, showToast, handleCardToast }}>
      <div className={`min-h-screen flex flex-col font-sans selection:bg-black selection:text-white transition-colors duration-500 relative overflow-hidden ${visualEffect === 'cyberpunk' ? 'bg-[#050505] selection:bg-cyan-500 selection:text-black' : 'bg-[#f5f5f7]'}`}>
        
        {/* Cyberpunk Background Elements */}
        {visualEffect === 'cyberpunk' && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
            
            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
            
            {/* Digital Rain / Scanlines effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none z-50 opacity-20"></div>
          </div>
        )}

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