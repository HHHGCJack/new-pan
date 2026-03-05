import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { BookOpen, X, ArrowLeft } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { PdfViewer } from './PdfViewer';

interface Book {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  pdfUrl: string;
}

export const ReadingPro: React.FC = () => {
  const { visualEffect } = useTheme();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.warn('Supabase credentials missing. Showing empty state.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
            className={`absolute left-0 flex items-center px-3 py-2 rounded-full transition-all ${
              visualEffect === 'cyberpunk' 
                ? 'text-cyan-400 hover:bg-cyan-900/40 border border-cyan-500/30' 
                : 'text-gray-600 hover:bg-gray-200 border border-transparent hover:border-gray-300'
            }`}
          >
            <ArrowLeft size={20} className="sm:mr-1" />
            <span className="hidden sm:inline text-sm font-medium">返回主页</span>
          </button>
          
          <div className="text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${visualEffect === 'cyberpunk' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-gray-900'}`}>外刊精读 Pro</h1>
            <p className={`text-lg ${visualEffect === 'cyberpunk' ? 'text-cyan-100/70' : 'text-gray-600'}`}>深度解析国际顶级刊物，在线沉浸式阅读。</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className={`text-xl ${visualEffect === 'cyberpunk' ? 'text-cyan-100/50' : 'text-gray-500'}`}>加载中...</p>
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
