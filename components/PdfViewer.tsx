import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  onClose: () => void;
  visualEffect: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, onClose, visualEffect }) => {
  useEffect(() => {
    // Lock body scroll when viewer is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore body scroll when viewer is closed
      document.body.style.overflow = '';
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
          <button onClick={handleDownload} className={`p-1.5 md:p-2 rounded-md transition-colors flex items-center ${visualEffect === 'cyberpunk' ? 'text-cyan-400 hover:bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} title="下载 PDF">
            <Download size={18} className="md:w-5 md:h-5 mr-1" />
            <span className="text-sm hidden sm:inline">下载</span>
          </button>
        </div>
      </div>

      {/* Viewer Body */}
      <div className="flex-1 w-full h-full relative bg-gray-100">
        <iframe 
          src={`${url}#toolbar=0&navpanes=0`} 
          className="w-full h-full border-none"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
}
