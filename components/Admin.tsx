import React, { useState } from 'react';
import { useTheme } from '../App';
import { Upload, FileText, Image as ImageIcon, Loader2, Lock } from 'lucide-react';

export const Admin: React.FC = () => {
  const { visualEffect } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Gc200902') {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('密码错误');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !cover || !pdf) {
      setMessage('请填写标题并上传封面和PDF文件。');
      return;
    }

    setIsUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('cover', cover);
    formData.append('pdf', pdf);
    formData.append('password', password);

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('图书上传成功！');
        setTitle('');
        setDescription('');
        setCover(null);
        setPdf(null);
        // Reset file inputs
        (document.getElementById('cover-upload') as HTMLInputElement).value = '';
        (document.getElementById('pdf-upload') as HTMLInputElement).value = '';
      } else {
        const error = await res.json();
        setMessage(`上传失败: ${error.error || '未知错误'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('网络错误，上传失败。');
    } finally {
      setIsUploading(false);
    }
  };

  const getGlassClasses = () => {
    if (visualEffect === 'liquid') {
      return 'bg-white/10 bg-gradient-to-br from-white/40 via-white/5 to-white/20 backdrop-blur-[20px] backdrop-saturate-[200%] backdrop-contrast-[110%] backdrop-brightness-[110%] border border-white/40 text-gray-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),_inset_0_1px_2px_rgba(255,255,255,0.9),_inset_0_-1px_2px_rgba(255,255,255,0.2),_inset_1px_0_2px_rgba(255,255,255,0.3)]';
    } else if (visualEffect === 'cyberpunk') {
      return 'bg-black/80 backdrop-blur-xl border border-cyan-500/50 text-cyan-50 shadow-[0_0_20px_rgba(6,182,212,0.15),_inset_0_0_20px_rgba(6,182,212,0.05)]';
    } else {
      return 'bg-white/85 backdrop-blur-xl border border-white/50 text-gray-900 shadow-md';
    }
  };

  const getInputClasses = () => {
    if (visualEffect === 'cyberpunk') {
      return 'w-full bg-cyan-950/30 border border-cyan-500/50 rounded-xl px-4 py-3 text-cyan-100 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all';
    }
    return 'w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all';
  };

  return (
    <main className="flex-grow pt-24 pb-32 px-6 max-w-3xl mx-auto w-full relative z-10">
      <div className={`rounded-[2.5rem] p-8 md:p-12 ${getGlassClasses()}`}>
        <h1 className={`text-3xl font-bold mb-8 text-center ${visualEffect === 'cyberpunk' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-gray-900'}`}>后台管理 - 上传图书</h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-center font-medium ${message.includes('成功') ? 'bg-green-500/20 text-green-600 border border-green-500/30' : 'bg-red-500/20 text-red-600 border border-red-500/30'}`}>
            {message}
          </div>
        )}

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-6 max-w-sm mx-auto mt-12">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${visualEffect === 'cyberpunk' ? 'text-cyan-300' : 'text-gray-700'}`}>管理员密码</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${visualEffect === 'cyberpunk' ? 'text-cyan-500/50' : 'text-gray-400'}`} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${getInputClasses()} pl-12`}
                  placeholder="请输入密码"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
                visualEffect === 'cyberpunk' 
                  ? 'bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]' 
                  : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg'
              }`}
            >
              登录
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${visualEffect === 'cyberpunk' ? 'text-cyan-300' : 'text-gray-700'}`}>书名</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={getInputClasses()}
              placeholder="例如：经济学人 2024-05"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${visualEffect === 'cyberpunk' ? 'text-cyan-300' : 'text-gray-700'}`}>简介</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${getInputClasses()} min-h-[100px] resize-y`}
              placeholder="简短描述..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${visualEffect === 'cyberpunk' ? 'text-cyan-300' : 'text-gray-700'}`}>封面图片 (JPG/PNG)</label>
              <div className={`relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all ${visualEffect === 'cyberpunk' ? 'border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-900/20' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/50'}`}>
                <input 
                  id="cover-upload"
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setCover(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="text-center flex flex-col items-center">
                  <ImageIcon className={`w-8 h-8 mb-2 ${visualEffect === 'cyberpunk' ? 'text-cyan-500/50' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${visualEffect === 'cyberpunk' ? 'text-cyan-400/80' : 'text-gray-500'}`}>
                    {cover ? cover.name : '点击或拖拽上传封面'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${visualEffect === 'cyberpunk' ? 'text-cyan-300' : 'text-gray-700'}`}>PDF 文件</label>
              <div className={`relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all ${visualEffect === 'cyberpunk' ? 'border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-900/20' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/50'}`}>
                <input 
                  id="pdf-upload"
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => setPdf(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="text-center flex flex-col items-center">
                  <FileText className={`w-8 h-8 mb-2 ${visualEffect === 'cyberpunk' ? 'text-cyan-500/50' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${visualEffect === 'cyberpunk' ? 'text-cyan-400/80' : 'text-gray-500'}`}>
                    {pdf ? pdf.name : '点击或拖拽上传 PDF'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
              visualEffect === 'cyberpunk' 
                ? 'bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] disabled:bg-cyan-900/50 disabled:text-cyan-500/50' 
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 mr-2" />
                确认上传
              </>
            )}
          </button>
        </form>
        )}
      </div>
    </main>
  );
};
