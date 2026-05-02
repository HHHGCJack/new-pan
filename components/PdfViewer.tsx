import React, { useEffect, useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useTheme } from '../App';

// Set up the worker for react-pdf using unpkg CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  onClose: () => void;
  themeMode: 'light' | 'dark';
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, onClose, themeMode }) => {
  const isDark = themeMode === 'dark';
  const { language } = useTheme();
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
    console.log(`Document loaded successfully with ${numPages} pages.`);
    setNumPages(numPages);
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setScale(1);

  // Try direct URL first, Supabase usually has CORS configured for public buckets
  const proxyUrl = url;

  const t = {
    zh: { title: 'PDF 预览', zoomOut: '缩小', zoomIn: '放大', resetZoom: '重置缩放', download: '下载', downloadPdf: '下载 PDF', errorParse: '解析 PDF 文件失败:', errorParseShort: '解析 PDF 文件失败', fallbackMsg: '如果无法预览，您可以直接下载文件到本地查看', directDownload: '直接下载' },
    en: { title: 'PDF Preview', zoomOut: 'Zoom Out', zoomIn: 'Zoom In', resetZoom: 'Reset Zoom', download: 'Download', downloadPdf: 'Download PDF', errorParse: 'Failed to parse PDF file:', errorParseShort: 'Failed to parse PDF', fallbackMsg: 'If preview fails, you can download the file to view locally', directDownload: 'Direct Download' },
    ja: { title: 'PDF プレビュー', zoomOut: '縮小', zoomIn: '拡大', resetZoom: 'ズームリセット', download: 'ダウンロード', downloadPdf: 'PDFをダウンロード', errorParse: 'PDF解析失敗:', errorParseShort: 'PDFの解析に失敗', fallbackMsg: 'プレビューできない場合は、直接ダウンロードしてください', directDownload: '直接ダウンロード' },
    ko: { title: 'PDF 미리보기', zoomOut: '축소', zoomIn: '확대', resetZoom: '확대 축소 재설정', download: '다운로드', downloadPdf: 'PDF 다운로드', errorParse: 'PDF 구문 분석 실패:', errorParseShort: 'PDF 구문 분석 실패', fallbackMsg: '미리보기가 안 되면 파일을 다운로드하여 보세요', directDownload: '직접 다운로드' },
    es: { title: 'Vista previa de PDF', zoomOut: 'Alejar', zoomIn: 'Acercar', resetZoom: 'Restablecer zoom', download: 'Descargar', downloadPdf: 'Descargar PDF', errorParse: 'Error al analizar PDF:', errorParseShort: 'Error al analizar PDF', fallbackMsg: 'Si la vista previa falla, descárguelo directamente', directDownload: 'Descarga Directa' },
    fr: { title: 'Aperçu PDF', zoomOut: 'Dézoomer', zoomIn: 'Zoomer', resetZoom: 'Réinitialiser le zoom', download: 'Télécharger', downloadPdf: 'Télécharger le PDF', errorParse: 'Échec de l\'analyse du PDF:', errorParseShort: 'Échec de l\'analyse du PDF', fallbackMsg: 'Si l\'aperçu échoue, téléchargez-le', directDownload: 'Téléchargement Direct' },
    de: { title: 'PDF-Vorschau', zoomOut: 'Verkleinern', zoomIn: 'Vergrößern', resetZoom: 'Zoom zurücksetzen', download: 'Herunterladen', downloadPdf: 'PDF herunterladen', errorParse: 'PDF-Analyse fehlgeschlagen:', errorParseShort: 'PDF-Analyse fehlgeschlagen', fallbackMsg: 'Falls die Vorschau fehlschlägt, herunterladen', directDownload: 'Direkter Download' },
    el: { title: 'Προεπισκόπηση PDF', zoomOut: 'Σμίκρυνση', zoomIn: 'Μεγέθυνση', resetZoom: 'Επαναφορά', download: 'Λήψη', downloadPdf: 'Λήψη PDF', errorParse: 'Αποτυχία ανάλυσης:', errorParseShort: 'Αποτυχία ανάλυσης', fallbackMsg: 'Αν η προεπισκόπηση αποτύχει, κατεβάστε το', directDownload: 'Άμεση Λήψη' }
  }[language] || { title: 'PDF Preview', zoomOut: 'Zoom Out', zoomIn: 'Zoom In', resetZoom: 'Reset Zoom', download: 'Download', downloadPdf: 'Download PDF', errorParse: 'Failed to parse PDF file:', errorParseShort: 'Failed to parse PDF', fallbackMsg: 'If preview fails, you can download the file to view locally', directDownload: 'Direct Download' };

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col bg-black/95 backdrop-blur-xl h-[100dvh]">
      {/* Header / Toolbar */}
      <div className={`flex justify-between items-center p-2 md:p-4 shadow-lg z-20 shrink-0 safe-area-top ${isDark ? 'bg-black/90 border-b border-white/20' : 'bg-gray-900 border-b border-gray-800'}`}>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'text-white hover:bg-white/20' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
            <X size={24} />
          </button>
          <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
            {t.title}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-2 bg-black/50 rounded-lg p-1 border border-gray-700">
          <button onClick={zoomOut} className={`p-1.5 md:p-2 rounded-md transition-colors flex items-center ${isDark ? 'text-white hover:bg-white/20' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} title={t.zoomOut}>
            <ZoomOut size={18} className="md:w-5 md:h-5" />
          </button>
          <span className={`text-xs w-8 text-center ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={zoomIn} className={`p-1.5 md:p-2 rounded-md transition-colors flex items-center ${isDark ? 'text-white hover:bg-white/20' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} title={t.zoomIn}>
            <ZoomIn size={18} className="md:w-5 md:h-5" />
          </button>
          <button onClick={resetZoom} className={`p-1.5 md:p-2 rounded-md transition-colors flex items-center ${isDark ? 'text-white hover:bg-white/20' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} title={t.resetZoom}>
            <Maximize size={18} className="md:w-5 md:h-5" />
          </button>
          <div className="w-px h-6 bg-gray-700 mx-1"></div>
          <button onClick={handleDownload} className={`p-1.5 md:p-2 rounded-md transition-colors flex items-center ${isDark ? 'text-white hover:bg-white/20' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} title={t.downloadPdf}>
            <Download size={18} className="md:w-5 md:h-5 mr-1" />
            <span className="text-sm hidden sm:inline">{t.download}</span>
          </button>
        </div>
      </div>

      {/* Viewer Body */}
      <div className="flex-1 w-full h-full relative bg-gray-100 overflow-auto">
        <div className="flex justify-center min-w-full min-h-full p-4">
          <Document 
            file={proxyUrl} 
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error('Error while loading document!', error);
              setPdfError(`${t.errorParse} ${error.message}`);
            }}
            loading={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-red-500 text-center px-4 font-medium">
                  {pdfError || t.errorParseShort}
                </div>
                <div className="text-gray-500 text-sm text-center px-4">
                  {t.fallbackMsg}
                </div>
                <button 
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors shadow-sm"
                >
                  <Download size={18} />
                  <span>{t.directDownload}</span>
                </button>
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
