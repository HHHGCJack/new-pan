import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { BookOpen, X, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { PdfViewer } from './PdfViewer';

interface Book {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  pdfUrl: string;
  order_index?: number;
}

const CACHE_KEY = 'pan_studio_books_cache';

export const ReadingPro: React.FC = () => {
  const { visualEffect } = useTheme();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Load from cache immediately for instant display
    let cachedBooks = null;
    try {
      cachedBooks = localStorage.getItem(CACHE_KEY);
      if (cachedBooks) {
        setBooks(JSON.parse(cachedBooks));
        setLoading(false); // Stop loading immediately if we have cache
      }
    } catch (e) {
      console.warn('localStorage access failed or parse error', e);
    }

    // 2. Fetch fresh data in the background
    fetchBooks(!!cachedBooks);
  }, []);

  const fetchBooks = async (hasCache: boolean = false) => {
    if (hasCache) setIsSyncing(true);
    else setLoading(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase credentials missing.');
        if (!hasCache) setError('未配置数据库连接，请在环境变量中设置 Supabase 凭证。');
        return;
      }

      // Add a timeout to the fetch request (10 seconds)
      const fetchPromise = supabase
        .from('books')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })
        .then(res => {
          if (res.error && res.error.message.includes('order_index')) {
            return supabase.from('books').select('*').order('created_at', { ascending: false });
          }
          return res;
        });
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('数据库连接超时，请检查网络或稍后重试。')), 10000)
      );

      const { data, error: dbError } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (dbError) throw dbError;
      
      if (data) {
        setBooks(data);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
          console.warn('Failed to save cache', e);
        }
      }
    } catch (err: any) {
      console.error("Error fetching books:", err);
      if (!hasCache) {
        setError(err.message || '加载失败，请检查网络连接。');
      }
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  const getGlassClasses = () => {
    if (visualEffect === 'liquid') {
      return 'bg-white/10 bg-gradient-to-br from-white/40 via-white/5 to-white/20 backdrop-blur-[20px] backdrop-saturate-[200%] backdrop-contrast-[110%] backdrop-brightness-[110%] border border-white/40 text-gray-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),_inset_0_1px_2px_rgba(255,255,255,0.9),_inset_0_-1px_2px_rgba(255,255,255,0.2),_inset_1px_0_2px_rgba(255,255,255,0.3)] hover:shadow-[0_40px_80px_-20px_rgba(50,50,93,0.2)] hover:bg-white/15 hover:border-white/60';
    } else if (visualEffect === 'cyberpunk') {
      return 'bg-black/80 backdrop-blur-xl border border-cyan-500/50 text-cyan-50 shadow-[0_0_20px_rgba(6,182,212,0.15),_inset_0_0_20px_rgba(6,182,212,0.05)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3),_inset_0_0_30px_rgba(6,182,212,0.1)] hover:border-cyan-400 hover:bg-black/90';
    } else {
      return 'bg-white/85 backdrop-blur-xl border border-white/50 text-gray-900 shadow-md hover:shadow-xl hover:bg-white/95';
    }
  };

  return (
    <>
      <main className="flex-grow pt-24 pb-32 px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="mb-12 relative flex items-center justify-center">
          <button 
            onClick={() => navigate('/')}
            className={`absolute left-0 top-0 md:top-2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${
              visualEffect === 'liquid'
                ? 'bg-white/10 bg-gradient-to-br from-white/40 via-white/5 to-white/20 backdrop-blur-[20px] backdrop-saturate-[200%] border border-white/40 text-gray-800 shadow-[0_8px_32px_0_rgba(31,38,135,0.15),_inset_0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25),_inset_0_1px_2px_rgba(255,255,255,0.9)] hover:bg-white/20 hover:scale-105'
                : visualEffect === 'cyberpunk' 
                ? 'bg-black/60 backdrop-blur-md border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:bg-cyan-900/40 hover:scale-105' 
                : 'bg-white/80 backdrop-blur-md border border-gray-200 text-gray-600 shadow-sm hover:shadow-md hover:bg-white hover:scale-105'
            }`}
            title="返回主页"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <h1 className={`text-4xl md:text-5xl font-bold ${visualEffect === 'cyberpunk' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-gray-900'}`}>外刊精读 Pro</h1>
              {isSyncing && (
                <RefreshCw size={20} className={`animate-spin ${visualEffect === 'cyberpunk' ? 'text-cyan-500' : 'text-gray-400'}`} title="正在同步最新数据..." />
              )}
            </div>
            <p className={`text-lg ${visualEffect === 'cyberpunk' ? 'text-cyan-100/70' : 'text-gray-600'}`}>深度解析国际顶级刊物，在线沉浸式阅读。</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className={`text-xl ${visualEffect === 'cyberpunk' ? 'text-cyan-100/50' : 'text-gray-500'}`}>加载中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <AlertCircle className={`mx-auto w-16 h-16 mb-4 ${visualEffect === 'cyberpunk' ? 'text-red-500/80' : 'text-red-400'}`} />
            <p className={`text-xl mb-6 ${visualEffect === 'cyberpunk' ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
            <button 
              onClick={() => fetchBooks(false)}
              className={`px-6 py-3 rounded-full font-medium transition-all flex items-center justify-center mx-auto ${
                visualEffect === 'cyberpunk'
                  ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-800/60'
                  : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <RefreshCw size={18} className="mr-2" />
              重新加载
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className={`mx-auto w-16 h-16 mb-4 ${visualEffect === 'cyberpunk' ? 'text-cyan-500/50' : 'text-gray-300'}`} />
            <p className={`text-xl ${visualEffect === 'cyberpunk' ? 'text-cyan-100/50' : 'text-gray-500'}`}>暂无图书，或未配置数据库连接。</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map(book => (
              <div 
                key={book.id} 
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 flex flex-col ${getGlassClasses()}`}
                onClick={() => setSelectedPdf(book.pdfUrl)}
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img 
                    src={book.coverUrl} 
                    alt={book.title} 
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${visualEffect === 'cyberpunk' ? 'grayscale contrast-125' : ''}`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${visualEffect === 'cyberpunk' ? 'from-black via-black/40 to-transparent' : 'from-black/60 via-black/10 to-transparent'}`}></div>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-end absolute bottom-0 left-0 right-0">
                  <h3 className="text-lg font-bold text-white mb-1 drop-shadow-md">{book.title}</h3>
                  <p className="text-xs text-white/80 line-clamp-2 drop-shadow-sm">{book.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PdfViewer 
          url={selectedPdf} 
          onClose={() => setSelectedPdf(null)} 
          visualEffect={visualEffect} 
        />
      )}
    </>
  );
};
