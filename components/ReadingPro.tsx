import React, { useState, useEffect } from 'react';
import { useTheme } from '../App';
import { BookOpen, X } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  pdfUrl: string;
}

export const ReadingPro: React.FC = () => {
  const { visualEffect } = useTheme();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error("Error fetching books:", err));
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
    <main className="flex-grow pt-24 pb-32 px-6 max-w-7xl mx-auto w-full relative z-10">
      <div className="mb-12 text-center">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${visualEffect === 'cyberpunk' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-gray-900'}`}>外刊精读 Pro</h1>
        <p className={`text-lg ${visualEffect === 'cyberpunk' ? 'text-cyan-100/70' : 'text-gray-600'}`}>深度解析国际顶级刊物，在线沉浸式阅读。</p>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className={`mx-auto w-16 h-16 mb-4 ${visualEffect === 'cyberpunk' ? 'text-cyan-500/50' : 'text-gray-300'}`} />
          <p className={`text-xl ${visualEffect === 'cyberpunk' ? 'text-cyan-100/50' : 'text-gray-500'}`}>暂无图书，请前往后台上传。</p>
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

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-sm">
          <div className={`relative w-full h-full max-w-6xl rounded-2xl overflow-hidden flex flex-col ${visualEffect === 'cyberpunk' ? 'bg-black border border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'bg-white shadow-2xl'}`}>
            <div className={`flex justify-between items-center p-4 ${visualEffect === 'cyberpunk' ? 'bg-black border-b border-cyan-500/30' : 'bg-gray-100 border-b border-gray-200'}`}>
              <h3 className={`font-bold ${visualEffect === 'cyberpunk' ? 'text-cyan-400' : 'text-gray-800'}`}>在线阅读</h3>
              <button 
                onClick={() => setSelectedPdf(null)}
                className={`p-2 rounded-full transition-colors ${visualEffect === 'cyberpunk' ? 'hover:bg-cyan-900/50 text-cyan-400' : 'hover:bg-gray-200 text-gray-600'}`}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow relative">
              <iframe 
                src={`${selectedPdf}#toolbar=0`} 
                className="w-full h-full border-none"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
