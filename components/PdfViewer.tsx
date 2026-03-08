import React, { useEffect, useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf using local file
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  url: string;
  onClose: () => void;
  visualEffect: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, onClose, visualEffect }) => {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    // Lock body scroll when viewer is open
    document.body.style.overflow = 'hidden';
    
    // Set initial container width for responsive PDF rendering
    const updateWidth = () => {
      setContainerWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => {
      // Restore body scroll when viewer is closed
      document.body.style.overflow = '';
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setScale(1);

  // Use proxy to avoid CORS issues when fetching PDFs from external sources like Supabase Storage
  const proxyUrl = `/api/proxy-pdf?url=${encodeURIComponent(url)}`;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col bg-black/95 backdrop-blur-xl h-[100dvh]">
      {/* Header / Toolbar */}
      <div className={`flex justify-between items-center p-2 md:p-4 shadow-lg z-20 shrink-0 safe-area-top ${visualEffect === 'cyberpunk' ? 'bg-black/90 border-b border-cyan-500/50' : 'bg-gray-900 border-b border-gray-800'}`}>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${visualEffect === 'cyberpunk' ? 'text-cyan-400 hover:bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
            <X size={24} />
          </button>
          <div className={`text-sm font-medium ${visualEffect === 'cyberpunk' ? 'text-cyan-500' : 'text-gray-400'}`}>
            PDF 预览
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-2 bg-black/50 rounded-lg p-1 border border-gray-700">
          <button onClick={zoomOut} className={`p-1.5 md:p-2 rounded-md transition-colors flex items-center ${visualEffect === 'cyberpunk' ? 'text-cyan-400 hover:bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} title="缩小">
            <ZoomOut size={18} className="md:w-5 md:h-5" />
          </button>
          <span className={`text-xs w-8 text-center ${visualEffect === 'cyberpunk' ? 'text-cyan-500' : 'text-gray-400'}`}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={zoomIn} className={`p-1.5 md:p-2 rounded-md transition-colors flex items-center ${visualEffect === 'cyberpunk' ? 'text-cyan-400 hover:bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} title="放大">
            <ZoomIn size={18} className="md:w-5 md:h-5" />
          </button>
          <button onClick={resetZoom} className={`p-1.5 md:p-2 rounded-md transition-colors flex items-center ${visualEffect === 'cyberpunk' ? 'text-cyan-400 hover:bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} title="重置缩放">
            <Maximize size={18} className="md:w-5 md:h-5" />
          </button>
          <div className="w-px h-6 bg-gray-700 mx-1"></div>
          <button onClick={handleDownload} className={`p-1.5 md:p-2 rounded-md transition-colors flex items-center ${visualEffect === 'cyberpunk' ? 'text-cyan-400 hover:bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} title="下载 PDF">
            <Download size={18} className="md:w-5 md:h-5 mr-1" />
            <span className="text-sm hidden sm:inline">下载</span>
          </button>
        </div>
      </div>

      {/* Viewer Body */}
      <div className="flex-1 w-full h-full relative bg-gray-100 overflow-auto">
        <div className="flex justify-center min-w-full min-h-full p-4">
          <Document 
            file={url} 
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error('Error while loading document!', error);
              setPdfError(`解析 PDF 文件失败: ${error.message}`);
            }}
            loading={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-64 text-red-500">
                {pdfError || '解析 PDF 文件失败'}
              </div>
            }
          >
            {numPages ? Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} className="mb-4 shadow-lg bg-white">
                <Page 
                  pageNumber={index + 1} 
                  scale={scale} 
                  width={containerWidth ? Math.min(containerWidth - 32, 800) : undefined}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </div>
            )) : null}
          </Document>
        </div>
      </div>
    </div>
  );
}
