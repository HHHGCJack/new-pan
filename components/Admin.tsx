import React, { useState, useEffect } from 'react';
import { useTheme } from '../App';
import { Upload, FileText, Image as ImageIcon, Loader2, Lock, Edit2, Save, Trash2, ArrowUp, ArrowDown, Book } from 'lucide-react';
import { supabase } from '../src/lib/supabase';

interface AdminBook {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  pdfUrl: string;
  created_at: string;
}

export const Admin: React.FC = () => {
  const { visualEffect } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'manage' | 'upload'>('manage');
  
  // Upload State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Manage State
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (isAuthenticated && activeTab === 'manage') {
      fetchBooks();
    }
  }, [isAuthenticated, activeTab]);

  const fetchBooks = async () => {
    setIsLoadingBooks(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      setMessage(`加载图书失败: ${error.message}`);
    } else if (data) {
      setBooks(data);
    }
    setIsLoadingBooks(false);
  };

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

    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setMessage('系统未配置 Supabase 环境变量，无法上传。请参考提示配置。');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      // 1. Upload Cover Image
      const coverExt = cover.name.split('.').pop();
      const coverName = `${Date.now()}-cover.${coverExt}`;
      const { error: coverError } = await supabase.storage
        .from('books-media')
        .upload(coverName, cover);
      
      if (coverError) throw new Error(`封面上传失败: ${coverError.message}`);
      
      const { data: coverUrlData } = supabase.storage
        .from('books-media')
        .getPublicUrl(coverName);

      // 2. Upload PDF File
      const pdfExt = pdf.name.split('.').pop();
      const pdfName = `${Date.now()}-pdf.${pdfExt}`;
      const { error: pdfError } = await supabase.storage
        .from('books-media')
        .upload(pdfName, pdf);
      
      if (pdfError) throw new Error(`PDF上传失败: ${pdfError.message}`);

      const { data: pdfUrlData } = supabase.storage
        .from('books-media')
        .getPublicUrl(pdfName);

      // 3. Insert into Database
      const { error: dbError } = await supabase
        .from('books')
        .insert([
          { 
            title, 
            description, 
            coverUrl: coverUrlData.publicUrl, 
            pdfUrl: pdfUrlData.publicUrl 
          }
        ]);

      if (dbError) throw new Error(`数据库保存失败: ${dbError.message}`);

      setMessage('图书上传成功！');
      setTitle('');
      setDescription('');
      setCover(null);
      setPdf(null);
      // Reset file inputs
      const coverInput = document.getElementById('cover-upload') as HTMLInputElement;
      if (coverInput) coverInput.value = '';
      const pdfInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (pdfInput) pdfInput.value = '';
      
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || '网络错误，上传失败。');
    } finally {
      setIsUploading(false);
    }
  };

  const startEditing = (book: AdminBook) => {
    setEditingId(book.id);
    setEditTitle(book.title);
    setEditDescription(book.description || '');
  };

  const saveEditing = async (id: string) => {
    const { error } = await supabase
      .from('books')
      .update({ title: editTitle, description: editDescription })
      .eq('id', id);
    
    if (error) {
      setMessage(`更新失败: ${error.message}`);
    } else {
      setMessage('更新成功！');
      setEditingId(null);
      fetchBooks();
    }
  };

  const deleteBook = async (id: string) => {
    if (!window.confirm('确定要删除这本书吗？')) return;
    
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
      
    if (error) {
      setMessage(`删除失败: ${error.message}`);
    } else {
      setMessage('删除成功！');
      fetchBooks();
    }
  };

  const moveBook = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === books.length - 1) return;
    
    const current = books[index];
    const target = direction === 'up' ? books[index - 1] : books[index + 1];
    
    // Swap created_at to change order
    const { error: err1 } = await supabase.from('books').update({ created_at: target.created_at }).eq('id', current.id);
    const { error: err2 } = await supabase.from('books').update({ created_at: current.created_at }).eq('id', target.id);
    
    if (err1 || err2) {
      setMessage(`移动失败: ${err1?.message || err2?.message}`);
    } else {
      fetchBooks();
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
    <main className="flex-grow pt-24 pb-32 px-6 max-w-4xl mx-auto w-full relative z-10">
      <div className={`rounded-[2.5rem] p-8 md:p-12 ${getGlassClasses()}`}>
        <h1 className={`text-3xl font-bold mb-8 text-center ${visualEffect === 'cyberpunk' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-gray-900'}`}>后台管理</h1>
        
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
          <>
            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-gray-200/20 pb-4">
              <button
                onClick={() => { setActiveTab('manage'); setMessage(''); }}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'manage' 
                    ? (visualEffect === 'cyberpunk' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-black text-white')
                    : (visualEffect === 'cyberpunk' ? 'text-cyan-600 hover:text-cyan-400' : 'text-gray-500 hover:text-gray-900')
                }`}
              >
                图书管理
              </button>
              <button
                onClick={() => { setActiveTab('upload'); setMessage(''); }}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'upload' 
                    ? (visualEffect === 'cyberpunk' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-black text-white')
                    : (visualEffect === 'cyberpunk' ? 'text-cyan-600 hover:text-cyan-400' : 'text-gray-500 hover:text-gray-900')
                }`}
              >
                图书上传
              </button>
            </div>

            {/* Tab Content: Manage */}
            {activeTab === 'manage' && (
              <div className="space-y-6">
                {isLoadingBooks ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                  </div>
                ) : books.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>暂无图书，请先上传</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {books.map((book, index) => (
                      <div key={book.id} className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start md:items-center transition-all ${
                        visualEffect === 'cyberpunk' ? 'bg-black/40 border-cyan-900/50' : 'bg-white/40 border-gray-200'
                      }`}>
                        {/* Cover Thumbnail */}
                        <div className="w-20 h-28 shrink-0 rounded-md overflow-hidden bg-gray-200">
                          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow w-full">
                          {editingId === book.id ? (
                            <div className="space-y-3">
                              <input 
                                type="text" 
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className={getInputClasses()}
                                placeholder="书名"
                              />
                              <textarea 
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className={`${getInputClasses()} min-h-[80px] text-sm`}
                                placeholder="简介"
                              />
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => saveEditing(book.id)}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center"
                                >
                                  <Save className="w-4 h-4 mr-1" /> 保存
                                </button>
                                <button 
                                  onClick={() => setEditingId(null)}
                                  className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600"
                                >
                                  取消
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 className={`font-bold text-lg mb-1 ${visualEffect === 'cyberpunk' ? 'text-cyan-300' : 'text-gray-900'}`}>{book.title}</h3>
                              <p className={`text-sm line-clamp-2 mb-3 ${visualEffect === 'cyberpunk' ? 'text-cyan-600' : 'text-gray-600'}`}>{book.description || '暂无简介'}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                <button 
                                  onClick={() => startEditing(book)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors ${
                                    visualEffect === 'cyberpunk' ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-800/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                  }`}
                                >
                                  <Edit2 className="w-4 h-4 mr-1" /> 编辑
                                </button>
                                <button 
                                  onClick={() => deleteBook(book.id)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors ${
                                    visualEffect === 'cyberpunk' ? 'bg-red-900/30 text-red-400 hover:bg-red-800/50' : 'bg-red-50 text-red-600 hover:bg-red-100'
                                  }`}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" /> 删除
                                </button>
                                
                                <div className="flex-grow"></div>
                                
                                {/* Order Controls */}
                                <div className="flex space-x-1">
                                  <button 
                                    onClick={() => moveBook(index, 'up')}
                                    disabled={index === 0}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      index === 0 
                                        ? 'opacity-30 cursor-not-allowed' 
                                        : (visualEffect === 'cyberpunk' ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-800/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                                    }`}
                                    title="上移"
                                  >
                                    <ArrowUp className="w-5 h-5" />
                                  </button>
                                  <button 
                                    onClick={() => moveBook(index, 'down')}
                                    disabled={index === books.length - 1}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      index === books.length - 1 
                                        ? 'opacity-30 cursor-not-allowed' 
                                        : (visualEffect === 'cyberpunk' ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-800/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                                    }`}
                                    title="下移"
                                  >
                                    <ArrowDown className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Upload */}
            {activeTab === 'upload' && (
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
          </>
        )}
      </div>
    </main>
  );
};
