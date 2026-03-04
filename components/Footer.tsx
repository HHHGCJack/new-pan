import React, { useState } from 'react';
import { X, Github, Mail } from 'lucide-react';
import { useTheme } from '../App';

type ModalType = 'privacy' | 'terms' | 'contact' | null;

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { visualEffect } = useTheme();

  const closeModal = () => setActiveModal(null);

  // Reusing the robust modal style from Navbar for consistency
  let modalStyle = '';
  if (visualEffect === 'liquid') {
    modalStyle = 'bg-white/10 backdrop-blur-[30px] backdrop-saturate-[220%] shadow-[0_50px_100px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.1)] border border-white/30 will-change-[backdrop-filter,transform,opacity]';
  } else if (visualEffect === 'cyberpunk') {
    modalStyle = 'bg-black/90 backdrop-blur-xl border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2),_inset_0_0_20px_rgba(6,182,212,0.1)] text-cyan-50 will-change-[backdrop-filter,transform,opacity]';
  } else {
    modalStyle = 'bg-white/95 backdrop-blur-2xl shadow-2xl border border-gray-100 will-change-[backdrop-filter,transform,opacity]';
  }

  return (
    <>
      <footer className={`w-full py-12 px-6 backdrop-blur-sm ${visualEffect === 'cyberpunk' ? 'bg-black/50 border-t border-cyan-500/20' : 'bg-white/50 border-t border-gray-200/50'}`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className={`text-xl font-bold tracking-tight ${visualEffect === 'cyberpunk' ? 'text-cyan-400' : 'text-gray-900'}`}>Pan Studio</div>
          <p className={`text-[10px] tracking-[0.2em] uppercase ${visualEffect === 'cyberpunk' ? 'text-cyan-500/50' : 'text-gray-400'}`}>
            &copy; 2026 Designed for Simplicity.
          </p>
          <div className="flex space-x-8 mt-2">
            <button onClick={() => setActiveModal('privacy')} className={`text-xs font-medium transition-colors ${visualEffect === 'cyberpunk' ? 'text-cyan-400/60 hover:text-cyan-400' : 'text-gray-500 hover:text-black'}`}>Privacy</button>
            <button onClick={() => setActiveModal('terms')} className={`text-xs font-medium transition-colors ${visualEffect === 'cyberpunk' ? 'text-cyan-400/60 hover:text-cyan-400' : 'text-gray-500 hover:text-black'}`}>Terms</button>
            <button onClick={() => setActiveModal('contact')} className={`text-xs font-medium transition-colors ${visualEffect === 'cyberpunk' ? 'text-cyan-400/60 hover:text-cyan-400' : 'text-gray-500 hover:text-black'}`}>Contact</button>
            <a href="/admin" className={`text-xs font-medium transition-colors ${visualEffect === 'cyberpunk' ? 'text-cyan-400/60 hover:text-cyan-400' : 'text-gray-500 hover:text-black'}`}>Admin</a>
          </div>
        </div>
      </footer>

      {/* Shared Modal Overlay */}
      <div 
        className={`fixed inset-0 z-[110] flex items-center justify-center px-6 transition-all duration-300 ${
          activeModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/10" onClick={closeModal} />
        
        <div 
          className={`relative w-full max-w-md rounded-[2.5rem] p-8 md:p-10 transform transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${modalStyle} ${
            activeModal ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
          }`}
        >
          <button 
            onClick={closeModal} 
            className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${visualEffect === 'cyberpunk' ? 'bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-400' : 'bg-black/5 hover:bg-black/10 text-gray-600'}`}
          >
            <X size={20} />
          </button>

          {activeModal === 'contact' && (
            <div className="text-center">
              <h3 className={`text-2xl font-bold mb-2 ${visualEffect === 'cyberpunk' ? 'text-cyan-50' : 'text-gray-900'}`}>联系我</h3>
              <p className={`text-sm mb-8 ${visualEffect === 'cyberpunk' ? 'text-cyan-400/70' : 'text-gray-500'}`}>随时欢迎交流与反馈</p>
              
              <div className="space-y-4">
                <a href="mailto:3387287031@qq.com" className={`flex items-center p-4 rounded-2xl transition-colors border shadow-sm group ${visualEffect === 'cyberpunk' ? 'bg-black/50 hover:bg-cyan-900/20 border-cyan-500/30' : 'bg-white/50 hover:bg-white/80 border-white/40'}`}>
                  <div className={`p-3 rounded-full mr-4 group-hover:scale-110 transition-transform ${visualEffect === 'cyberpunk' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Mail size={20} />
                  </div>
                  <div className="text-left overflow-hidden">
                    <div className={`text-xs font-bold uppercase tracking-wider ${visualEffect === 'cyberpunk' ? 'text-cyan-500/50' : 'text-gray-400'}`}>Email</div>
                    <div className={`font-medium truncate ${visualEffect === 'cyberpunk' ? 'text-cyan-100' : 'text-gray-900'}`}>3387287031@qq.com</div>
                  </div>
                </a>

                <a href="https://github.com/gongpan" target="_blank" rel="noopener noreferrer" className={`flex items-center p-4 rounded-2xl transition-colors border shadow-sm group ${visualEffect === 'cyberpunk' ? 'bg-black/50 hover:bg-cyan-900/20 border-cyan-500/30' : 'bg-white/50 hover:bg-white/80 border-white/40'}`}>
                   <div className={`p-3 rounded-full mr-4 group-hover:scale-110 transition-transform ${visualEffect === 'cyberpunk' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-gray-100 text-gray-900'}`}>
                    <Github size={20} />
                  </div>
                  <div className="text-left">
                    <div className={`text-xs font-bold uppercase tracking-wider ${visualEffect === 'cyberpunk' ? 'text-cyan-500/50' : 'text-gray-400'}`}>GitHub</div>
                    <div className={`font-medium ${visualEffect === 'cyberpunk' ? 'text-cyan-100' : 'text-gray-900'}`}>@gongpan</div>
                  </div>
                </a>
              </div>
            </div>
          )}

          {activeModal === 'privacy' && (
            <div>
              <h3 className={`text-2xl font-bold mb-6 ${visualEffect === 'cyberpunk' ? 'text-cyan-50' : 'text-gray-900'}`}>隐私政策</h3>
              <div className={`text-sm space-y-4 leading-relaxed h-[300px] overflow-y-auto pr-2 scrollbar-hide ${visualEffect === 'cyberpunk' ? 'text-cyan-100/80' : 'text-gray-600'}`}>
                <p>我们非常重视您的隐私。本网站（G胖儿GongPan）目前不收集任何个人身份信息。所有的资源链接均为直接跳转。</p>
                <p><strong>1. 数据收集</strong><br/>我们不使用 Cookies 跟踪您的个人行为，也不存储您的 IP 地址。</p>
                <p><strong>2. 第三方链接</strong><br/>本网站包含指向第三方网站的链接。我们对这些网站的内容或隐私惯例不承担任何责任。</p>
                <p><strong>3. 变更</strong><br/>我们可能会不时更新本隐私政策。</p>
              </div>
            </div>
          )}

          {activeModal === 'terms' && (
             <div>
             <h3 className={`text-2xl font-bold mb-6 ${visualEffect === 'cyberpunk' ? 'text-cyan-50' : 'text-gray-900'}`}>服务条款</h3>
             <div className={`text-sm space-y-4 leading-relaxed h-[300px] overflow-y-auto pr-2 scrollbar-hide ${visualEffect === 'cyberpunk' ? 'text-cyan-100/80' : 'text-gray-600'}`}>
               <p>欢迎访问 G胖儿GongPan。</p>
               <p><strong>1. 免责声明</strong><br/>本站提供的所有资源仅供学习与交流，严禁用于商业用途。资源版权归原作者所有。</p>
               <p><strong>2. 使用规则</strong><br/>您同意仅出于合法目的使用本网站，不得利用本网站进行任何违法活动。</p>
               <p><strong>3. 内容所有权</strong><br/>本站设计的 UI 风格归 Pan Studio 所有。</p>
             </div>
           </div>
          )}
        </div>
      </div>
    </>
  );
};