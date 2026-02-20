import React, { useState } from 'react';
import { X, Github, Mail } from 'lucide-react';
import { useTheme } from '../App';

type ModalType = 'privacy' | 'terms' | 'contact' | null;

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { visualEffect } = useTheme();

  const closeModal = () => setActiveModal(null);

  // Reusing the robust modal style from Navbar for consistency
  const modalStyle = visualEffect === 'liquid'
    ? 'bg-white/10 backdrop-blur-[30px] backdrop-saturate-[220%] shadow-[0_50px_100px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.1)] border border-white/30 will-change-[backdrop-filter,transform,opacity]'
    : 'bg-white/95 backdrop-blur-2xl shadow-2xl border border-gray-100 will-change-[backdrop-filter,transform,opacity]';

  return (
    <>
      <footer className="w-full py-12 px-6 bg-white/50 border-t border-gray-200/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="text-xl font-bold tracking-tight text-gray-900">Pan Studio</div>
          <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">
            &copy; 2026 Designed for Simplicity.
          </p>
          <div className="flex space-x-8 mt-2">
            <button onClick={() => setActiveModal('privacy')} className="text-xs font-medium text-gray-500 hover:text-black transition-colors">Privacy</button>
            <button onClick={() => setActiveModal('terms')} className="text-xs font-medium text-gray-500 hover:text-black transition-colors">Terms</button>
            <button onClick={() => setActiveModal('contact')} className="text-xs font-medium text-gray-500 hover:text-black transition-colors">Contact</button>
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
            className="absolute top-6 right-6 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {activeModal === 'contact' && (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">联系我</h3>
              <p className="text-gray-500 text-sm mb-8">随时欢迎交流与反馈</p>
              
              <div className="space-y-4">
                <a href="mailto:3387287031@qq.com" className="flex items-center p-4 rounded-2xl bg-white/50 hover:bg-white/80 transition-colors border border-white/40 shadow-sm group">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4 group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div className="text-left overflow-hidden">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</div>
                    <div className="text-gray-900 font-medium truncate">3387287031@qq.com</div>
                  </div>
                </a>

                <a href="https://github.com/gongpan" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-2xl bg-white/50 hover:bg-white/80 transition-colors border border-white/40 shadow-sm group">
                   <div className="p-3 rounded-full bg-gray-100 text-gray-900 mr-4 group-hover:scale-110 transition-transform">
                    <Github size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">GitHub</div>
                    <div className="text-gray-900 font-medium">@gongpan</div>
                  </div>
                </a>
              </div>
            </div>
          )}

          {activeModal === 'privacy' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">隐私政策</h3>
              <div className="text-sm text-gray-600 space-y-4 leading-relaxed h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                <p>我们非常重视您的隐私。本网站（G胖儿GongPan）目前不收集任何个人身份信息。所有的资源链接均为直接跳转。</p>
                <p><strong>1. 数据收集</strong><br/>我们不使用 Cookies 跟踪您的个人行为，也不存储您的 IP 地址。</p>
                <p><strong>2. 第三方链接</strong><br/>本网站包含指向第三方网站的链接。我们对这些网站的内容或隐私惯例不承担任何责任。</p>
                <p><strong>3. 变更</strong><br/>我们可能会不时更新本隐私政策。</p>
              </div>
            </div>
          )}

          {activeModal === 'terms' && (
             <div>
             <h3 className="text-2xl font-bold text-gray-900 mb-6">服务条款</h3>
             <div className="text-sm text-gray-600 space-y-4 leading-relaxed h-[300px] overflow-y-auto pr-2 scrollbar-hide">
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