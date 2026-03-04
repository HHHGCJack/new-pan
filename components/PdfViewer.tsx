import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker path for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  onClose: () => void;
  visualEffect: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, onClose, visualEffect }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Lock body scroll when viewer is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Restore body scroll when viewer is closed
      document.body.style.overflow = '';
    };
  }, []);

  // Auto-adjust scale for mobile
  useEffect(() => {
    if (windowWidth < 768) {
      // On mobile, try to fit the width of the screen
      // Assuming a standard A4 aspect ratio, adjust scale to fit width
      const mobileScale = (windowWidth - 32) / 600; // 32px for padding, 600 is approx base width of PDF page
      setScale(Math.max(0.5, mobileScale));
    } else {
      setScale(1.2); // Base scale for desktop
    }
  }, [windowWidth]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handleZoomIn = () => setScale(s => Math.min(3, s + 0.2));
  const handleZoomOut = () => setScale(s => Math.max(0.4, s - 0.2));

  const handleDownload = () => {
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col bg-black/95 backdrop-blur-xl h-[100dvh]">
      {/* Header / Toolbar */}
      <div className={`flex justify-between items-center p-2 md:p-4 shadow-lg z-20 shrink-0 safe-area-top ${visualEffect === 'cyberpunk' ? 'bg-black/90 border-b border-cyan-500/50' : 'bg-gray-900 border-b border-gray-800'}`}>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${visualEffect === 'cyberpunk' ? 'text-cyan-400 hover:bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
            <X size={24} />
          </button>
          <div className={`text-sm font-medium hidden sm:block ${visualEffect === 'cyberpunk' ? 'text-cyan-500' : 'text-gray-400'}`}>
            {pageNumber} / {numPages || '-'}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-2 bg-black/50 rounded-lg p-1 border border-gray-700">
          <button onClick={handleZoomOut} className={`p-1.5 md:p-2 rounded-md transition-colors ${visualEffect === 'cyberpunk' ? 'text-cyan-400 hover:bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
            <ZoomOut size={18} className="md:w-5 md:h-5" />
          </button>
          <span className={`text-xs md:text-sm w-10 md:w-12 text-center font-mono ${visualEffect === 'cyberpunk' ? 'text-cyan-300' : 'text-gray-300'}`}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={handleZoomIn} className={`p-1.5 md:p-2 rounded-md transition-colors ${visualEffect === 'cyberpunk' ? 'text-cyan-400 hover:bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
            <ZoomIn size={18} className="md:w-5 md:h-5" />
          </button>
          <div className="w-px h-4 md:h-5 bg-gray-600 mx-1"></div>
          <button onClick={handleDownload} className={`p-1.5 md:p-2 rounded-md transition-colors ${visualEffect === 'cyberpunk' ? 'text-cyan-400 hover:bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} title="下载 PDF">
            <Download size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Viewer Body */}
      <div className="flex-1 overflow-auto flex justify-center items-start p-2 md:p-8 relative w-full">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center h-full absolute inset-0">
              <Loader2 className={`w-10 h-10 animate-spin mb-4 ${visualEffect === 'cyberpunk' ? 'text-cyan-500' : 'text-blue-500'}`} />
              <p className={visualEffect === 'cyberpunk' ? 'text-cyan-400' : 'text-gray-300'}>正在加载 PDF...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-full absolute inset-0 px-4 text-center">
              <p className="text-red-400 mb-4">加载 PDF 失败，请检查网络或文件链接。</p>
              <button onClick={handleDownload} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                尝试直接下载
              </button>
            </div>
          }
          className="flex flex-col items-center min-w-min"
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className={`transition-transform duration-200 ${visualEffect === 'cyberpunk' ? 'shadow-[0_0_30px_rgba(6,182,212,0.2)]' : 'shadow-2xl'} bg-white`}
          />
        </Document>
      </div>

      {/* Bottom Navigation */}
      <div className={`flex justify-between items-center p-3 md:p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20 shrink-0 safe-area-bottom ${visualEffect === 'cyberpunk' ? 'bg-black/90 border-t border-cyan-500/50' : 'bg-gray-900 border-t border-gray-800'}`}>
        <button 
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(p => Math.max(1, p - 1))}
          className={`flex items-center px-3 md:px-4 py-2 rounded-full transition-all text-sm md:text-base ${
            pageNumber <= 1 
              ? 'opacity-50 cursor-not-allowed text-gray-500' 
              : visualEffect === 'cyberpunk'
                ? 'text-cyan-400 hover:bg-cyan-900/40 border border-cyan-500/30'
                : 'text-white hover:bg-gray-800 border border-gray-700'
          }`}
        >
          <ChevronLeft size={18} className="mr-1 md:w-5 md:h-5" />
          上一页
        </button>
        
        <div className={`text-sm font-medium sm:hidden ${visualEffect === 'cyberpunk' ? 'text-cyan-500' : 'text-gray-400'}`}>
          {pageNumber} / {numPages || '-'}
        </div>

        <button 
          disabled={pageNumber >= (numPages || 1)}
          onClick={() => setPageNumber(p => Math.min(numPages || 1, p + 1))}
          className={`flex items-center px-3 md:px-4 py-2 rounded-full transition-all text-sm md:text-base ${
            pageNumber >= (numPages || 1)
              ? 'opacity-50 cursor-not-allowed text-gray-500' 
              : visualEffect === 'cyberpunk'
                ? 'text-cyan-400 hover:bg-cyan-900/40 border border-cyan-500/30'
                : 'text-white hover:bg-gray-800 border border-gray-700'
          }`}
        >
          下一页
          <ChevronRight size={18} className="ml-1 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}
