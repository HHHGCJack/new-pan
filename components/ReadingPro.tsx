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
  const { themeMode, language } = useTheme();
  const isDark = themeMode === 'dark';
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    zh: {
      returnHome: '返回主页',
      title: '外刊精读 Pro',
      syncing: '正在同步最新数据...',
      desc: '深度解析国际顶级刊物，在线沉浸式阅读。',
      loading: '加载中...',
      noDb: '未配置数据库连接，请在环境变量中设置 Supabase 凭证。',
      timeout: '数据库连接超时，请检查网络或稍后重试。',
      loadFail: '加载失败，请检查网络连接。',
      reload: '重新加载',
      noBooks: '暂无图书，或未配置数据库连接。'
    },
    en: {
      returnHome: 'Return to Home',
      title: 'Journals Pro',
      syncing: 'Syncing latest data...',
      desc: 'In-depth analysis of top international international journals, immersive online reading.',
      loading: 'Loading...',
      noDb: 'Database connection not configured. Please set Supabase credentials in environment variables.',
      timeout: 'Database connection timeout, please check your network or try again later.',
      loadFail: 'Failed to load, please check your network connection.',
      reload: 'Reload',
      noBooks: 'No books available, or database not configured.'
    },
    ja: {
      returnHome: 'ホームに戻る',
      title: 'ジャーナル Pro',
      syncing: 'データを同期中...',
      desc: 'トップ国際ジャーナルの詳細な分析と没入型オンライン読書。',
      loading: '読み込み中...',
      noDb: 'データベース接続が構成されていません。Supabaseの認証情報を設定してください。',
      timeout: 'データベース接続がタイムアウトしました。',
      loadFail: '読み込みに失敗しました。',
      reload: '再読み込み',
      noBooks: '利用可能な本がないか、データベースが構成されていません。'
    },
    ko: {
      returnHome: '홈으로 이동',
      title: '저널 Pro',
      syncing: '데이터 동기화 중...',
      desc: 'Top 국제 저널 심층 분석 및 몰입형 온라인 독서.',
      loading: '로딩 중...',
      noDb: '데이터베이스 연결이 구성되지 않았습니다.',
      timeout: '데이터베이스 연결 시간 초과.',
      loadFail: '로드 실패.',
      reload: '새로고침',
      noBooks: '사용 가능한 책이 없습니다.'
    },
    es: {
      returnHome: 'Volver al Inicio',
      title: 'Revistas Pro',
      syncing: 'Sincronizando datos...',
      desc: 'Análisis profundo de revistas internacionales, lectura en línea.',
      loading: 'Cargando...',
      noDb: 'Conexión a base de datos no configurada.',
      timeout: 'Tiempo de conexión agotado.',
      loadFail: 'Fallo al cargar.',
      reload: 'Recargar',
      noBooks: 'No hay libros disponibles.'
    },
    fr: {
      returnHome: 'Retour à l\'accueil',
      title: 'Revues Pro',
      syncing: 'Synchronisation des données...',
      desc: 'Analyse approfondie des revues internationales de haut niveau.',
      loading: 'Chargement...',
      noDb: 'Connexion à la base de données non configurée.',
      timeout: 'Délai de connexion dépassé.',
      loadFail: 'Échec du chargement.',
      reload: 'Recharger',
      noBooks: 'Aucun livre disponible.'
    },
    de: {
      returnHome: 'Zurück zur Startseite',
      title: 'Journals Pro',
      syncing: 'Daten synchronisieren...',
      desc: 'Eingehende Analyse von internationalen Top-Zeitschriften.',
      loading: 'Wird geladen...',
      noDb: 'Datenbankverbindung nicht konfiguriert.',
      timeout: 'Zeitüberschreitung der Datenbankverbindung.',
      loadFail: 'Fehler beim Laden.',
      reload: 'Neu laden',
      noBooks: 'Keine Bücher verfügbar.'
    },
    el: {
      returnHome: 'Επιστροφή στην Αρχική',
      title: 'Περιοδικά Pro',
      syncing: 'Συγχρονισμός...',
      desc: 'Σε βάθος ανάλυση διεθνών περιοδικών.',
      loading: 'Φόρτωση...',
      noDb: 'Η σύνδεση στη βάση δεν έχει ρυθμιστεί.',
      timeout: 'Λήξη χρόνου σύνδεσης.',
      loadFail: 'Αποτυχία φόρτωσης.',
      reload: 'Επαναφόρτωση',
      noBooks: 'Δεν υπάρχουν διαθέσιμα βιβλία.'
    }
  }[language] || {
      returnHome: 'Return to Home',
      title: 'Journals Pro',
      syncing: 'Syncing latest data...',
      desc: 'In-depth analysis of top international international journals, immersive online reading.',
      loading: 'Loading...',
      noDb: 'Database connection not configured. Please set Supabase credentials in environment variables.',
      timeout: 'Database connection timeout, please check your network or try again later.',
      loadFail: 'Failed to load, please check your network connection.',
      reload: 'Reload',
      noBooks: 'No books available, or database not configured.'
    };

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
        if (!hasCache) setError(t.noDb);
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
        setTimeout(() => reject(new Error(t.timeout)), 10000)
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
        setError(err.message || t.loadFail);
      }
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  const getGlassClasses = () => {
    if (isDark) {
      return 'bg-black/40 bg-gradient-to-br from-white/10 via-transparent to-white/5 backdrop-blur-[20px] backdrop-saturate-[150%] border border-white/20 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),_inset_0_1px_2px_rgba(255,255,255,0.3),_inset_0_-1px_2px_rgba(255,255,255,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] hover:bg-black/50 hover:border-white/30';
    }
    return 'bg-white/10 bg-gradient-to-br from-white/40 via-white/5 to-white/20 backdrop-blur-[20px] backdrop-saturate-[200%] border border-white/40 text-gray-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),_inset_0_1px_2px_rgba(255,255,255,0.9),_inset_0_-1px_2px_rgba(255,255,255,0.2),_inset_1px_0_2px_rgba(255,255,255,0.3)] hover:shadow-[0_40px_80px_-20px_rgba(50,50,93,0.2)] hover:bg-white/15 hover:border-white/60';
  };

  return (
    <>
      <main className="flex-grow pt-24 pb-32 px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="mb-12 relative flex items-center justify-center">
          <button 
            onClick={() => navigate('/')}
            className={`absolute left-0 top-0 md:top-2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${
              isDark
                ? 'bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-sm hover:shadow-md hover:bg-black/80 hover:scale-105' 
                : 'bg-white/80 backdrop-blur-md border border-gray-200 text-gray-600 shadow-sm hover:shadow-md hover:bg-white hover:scale-105'
            }`}
            title={t.returnHome}
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.title}</h1>
              {isSyncing && (
                <RefreshCw size={20} className={`animate-spin ${isDark ? 'text-gray-300' : 'text-gray-400'}`} title={t.syncing} />
              )}
            </div>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.desc}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.loading}</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <AlertCircle className={`mx-auto w-16 h-16 mb-4 ${isDark ? 'text-red-400' : 'text-red-400'}`} />
            <p className={`text-xl mb-6 ${isDark ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
            <button 
              onClick={() => fetchBooks(false)}
              className={`px-6 py-3 rounded-full font-medium transition-all flex items-center justify-center mx-auto ${
                isDark
                  ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <RefreshCw size={18} className="mr-2" />
              {t.reload}
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className={`mx-auto w-16 h-16 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-xl ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t.noBooks}</p>
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
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-black/40 to-transparent' : 'from-black/60 via-black/10 to-transparent'}`}></div>
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
          themeMode={themeMode} 
        />
      )}
    </>
  );
};
