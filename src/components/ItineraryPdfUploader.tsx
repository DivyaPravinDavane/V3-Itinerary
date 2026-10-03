import React, { useState, useRef } from 'react';
import { 
  FileText, UploadCloud, CheckCircle2, Eye, 
  Trash2, RefreshCw, AlertCircle, ExternalLink, X
} from 'lucide-react';
import { uploadPdfToBackend } from '../utils/api';

interface ItineraryPdfUploaderProps {
  currentPdfUrl?: string;
  currentPdfName?: string;
  currentPdfSize?: number;
  onPdfChange: (pdfData: { url: string; name: string; size: number } | null) => void;
  label?: string;
  helperText?: string;
}

export const ItineraryPdfUploader: React.FC<ItineraryPdfUploaderProps> = ({
  currentPdfUrl = '',
  currentPdfName = '',
  currentPdfSize = 0,
  onPdfChange,
  label = 'Official Itinerary Blueprint PDF',
  helperText = 'Upload your complete tour itinerary PDF directly from your computer. Travelers will view and download this exact PDF!'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setUploadError('Please select a valid PDF document (.pdf file).');
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setUploadError('PDF file is too large. Please select a PDF under 30 MB.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const result = await uploadPdfToBackend(file);
      if (result && result.url) {
        onPdfChange({
          url: result.url,
          name: result.originalName || file.name,
          size: result.size || file.size
        });
      } else {
        setUploadError('Failed to read the PDF file. Please try again.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error processing PDF document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = () => {
    onPdfChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasPdf = Boolean(currentPdfUrl && currentPdfUrl.trim().length > 0);

  return (
    <div className="pdf-uploader-section">
      <div className="pdf-uploader-head flex items-center justify-between gap-2 mb-2">
        <div>
          <label className="agent-lbl font-bold flex items-center gap-1.5 text-slate-800 text-sm">
            <FileText size={17} className="text-red-500" />
            <span>{label} *</span>
          </label>
          <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
        </div>
        {hasPdf && (
          <span className="badge-pdf-attached-top">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>PDF ATTACHED</span>
          </span>
        )}
      </div>

      {/* Hidden Native File Input */}
      <input 
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />

      {/* Error Alert */}
      {uploadError && (
        <div className="pdf-upload-err-banner animate-shake mb-3">
          <AlertCircle size={15} className="shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* CASE 1: PDF IS ALREADY UPLOADED */}
      {hasPdf ? (
        <div className="pdf-ready-card animate-fade-in">
          <div className="pdf-ready-left">
            <div className="pdf-icon-badge">
              <FileText size={28} className="text-red-600" />
              <span className="pdf-tag-tiny">PDF</span>
            </div>
            <div className="pdf-file-details">
              <div className="flex items-center gap-2 flex-wrap">
                <h5 className="pdf-file-name" title={currentPdfName || 'Itinerary_Blueprint.pdf'}>
                  {currentPdfName || 'Itinerary_Blueprint.pdf'}
                </h5>
                <span className="pdf-size-pill">
                  {formatFileSize(currentPdfSize) || 'Ready'}
                </span>
              </div>
              <p className="pdf-status-hint">
                <CheckCircle2 size={12} className="text-emerald-600 inline mr-1" />
                This PDF will be displayed on the customer portal and unlocked for travelers.
              </p>
            </div>
          </div>

          <div className="pdf-ready-actions">
            <button 
              type="button" 
              className="btn-pdf-preview"
              onClick={() => setShowPreviewModal(true)}
              title="Preview PDF inside modal"
            >
              <Eye size={14} />
              <span>Preview PDF</span>
            </button>

            <button 
              type="button" 
              className="btn-pdf-replace"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Choose another PDF from PC"
            >
              <RefreshCw size={14} className={isUploading ? 'animate-spin' : ''} />
              <span>Replace</span>
            </button>

            <button 
              type="button" 
              className="btn-pdf-remove"
              onClick={handleRemove}
              title="Remove attached PDF"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* CASE 2: NO PDF - DRAG & DROP ZONE */
        <div 
          className={`pdf-dropzone ${isDragOver ? 'drag-active' : ''} ${isUploading ? 'uploading' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          {isUploading ? (
            <div className="pdf-drop-content">
              <RefreshCw size={36} className="text-emerald-600 animate-spin mb-2" />
              <div className="text-sm font-bold text-slate-800">Reading & Preparing Itinerary PDF...</div>
              <p className="text-xs text-slate-500 mt-1">Please wait while your document is formatted for customer viewing</p>
            </div>
          ) : (
            <div className="pdf-drop-content">
              <div className="pdf-upload-icon-circle">
                <UploadCloud size={30} className="text-emerald-600" />
              </div>
              <div className="text-sm font-bold text-slate-800 mt-2">
                Click to Upload Itinerary PDF from Computer
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Select your official itinerary blueprint (.pdf) from your PC or drag and drop it here.
              </p>
              <div className="pdf-dropzone-pills mt-3 flex items-center justify-center gap-2 flex-wrap">
                <span className="drop-pill">📄 PDF Document</span>
                <span className="drop-pill">⚡ Instant Customer Access</span>
                <span className="drop-pill">🔒 ₹99 Pay-to-Unlock</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: LIVE PDF PREVIEW MODAL */}
      {showPreviewModal && currentPdfUrl && (
        <div className="modal-overlay animate-fade-in" style={{ zIndex: 1200 }} onClick={() => setShowPreviewModal(false)}>
          <div 
            className="modal-container pdf-preview-lightbox shadow-2xl animate-scale-up" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pdf-lightbox-header flex items-center justify-between p-3.5 bg-slate-900 text-white rounded-t-xl">
              <div className="flex items-center gap-2.5">
                <FileText size={18} className="text-red-400" />
                <span className="font-bold text-sm truncate max-w-sm">
                  {currentPdfName || 'Itinerary_Blueprint.pdf'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({formatFileSize(currentPdfSize) || 'PDF Document'})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={currentPdfUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-lightbox-action"
                  title="Open in new browser tab"
                >
                  <ExternalLink size={14} />
                  <span>Full Screen</span>
                </a>
                <button 
                  className="btn-lightbox-close" 
                  onClick={() => setShowPreviewModal(false)}
                  aria-label="Close Preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="pdf-lightbox-body">
              <iframe 
                src={currentPdfUrl} 
                className="pdf-lightbox-iframe"
                title="Itinerary PDF Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
