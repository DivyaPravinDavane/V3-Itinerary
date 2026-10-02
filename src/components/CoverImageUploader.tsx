import React, { useState, useRef } from 'react';
import { 
  UploadCloud, Image as ImageIcon, Link as LinkIcon, 
  Check, X, RefreshCw, Sparkles, AlertCircle, FileCheck
} from 'lucide-react';
import { uploadImageToBackend } from '../utils/api';

export interface PresetCover {
  label: string;
  url: string;
}

export const PRESET_COVERS: PresetCover[] = [
  { label: 'Dubai Skyline & Marina', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Maldives Overwater Villas', url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Bali Tropical Temple', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Swiss Alps & Valleys', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Kashmir Gulmarg Snow', url: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Goa Golden Beach', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Jaipur Hawa Mahal Palace', url: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Kerala Backwaters Houseboat', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Singapore Marina Bay Sands', url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Thailand Phuket Island', url: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Ladakh Pangong Lake', url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Andaman Radhanagar Beach', url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&auto=format&fit=crop&q=80' }
];

interface CoverImageUploaderProps {
  currentUrl: string;
  onImageChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export const CoverImageUploader: React.FC<CoverImageUploaderProps> = ({
  currentUrl,
  onImageChange,
  label = 'Cover Image',
  helperText = 'Upload a high-resolution photo directly from your PC/computer or pick a preset.'
}) => {
  const [sourceMode, setSourceMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Image size exceeds 20MB limit. Please upload a smaller image.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const result = await uploadImageToBackend(file);
      if (result && result.url) {
        setUploadedFileName(file.name);
        setUploadedFileSize(file.size);
        onImageChange(result.url);
      } else {
        setUploadError('Failed to process image. Please try again.');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setUploadError('Upload failed. Please try another file.');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="cover-uploader-card">
      {/* Top Bar: Title & Source Switcher */}
      <div className="cover-uploader-top-bar">
        <div className="cover-uploader-heading-box">
          <label>{label}</label>
          <span className="cover-uploader-helper">{helperText}</span>
        </div>

        {/* Source Mode Switcher */}
        <div className="cover-source-tabs">
          <button
            type="button"
            className={`cover-source-tab-btn ${sourceMode === 'upload' ? 'active' : ''}`}
            onClick={() => setSourceMode('upload')}
          >
            <UploadCloud size={13} />
            <span>Upload from PC</span>
          </button>
          <button
            type="button"
            className={`cover-source-tab-btn ${sourceMode === 'preset' ? 'active' : ''}`}
            onClick={() => setSourceMode('preset')}
          >
            <Sparkles size={13} />
            <span>Presets</span>
          </button>
          <button
            type="button"
            className={`cover-source-tab-btn ${sourceMode === 'url' ? 'active' : ''}`}
            onClick={() => setSourceMode('url')}
          >
            <LinkIcon size={13} />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Hidden file input - guaranteed invisible with inline display: none */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={onFileInputChange}
        style={{ display: 'none' }}
      />

      {/* ERROR ALERT */}
      {uploadError && (
        <div className="auth-error-alert" style={{ marginBottom: '10px' }}>
          <AlertCircle size={15} className="shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* MODE 1: UPLOAD FROM COMPUTER (PC) */}
      {sourceMode === 'upload' && (
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFilePicker}
            className={`cover-dropzone-area ${isDragOver ? 'drag-over' : ''}`}
          >
            {isUploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0' }}>
                <RefreshCw size={26} className="animate-spin text-emerald-600" style={{ marginBottom: '8px' }} />
                <span className="cover-dropzone-prompt-text">Uploading photo from PC...</span>
                <span className="cover-dropzone-sub-text">Storing securely on server</span>
              </div>
            ) : (
              <>
                <div className="cover-dropzone-icon-circle">
                  <UploadCloud size={22} />
                </div>
                <h5 className="cover-dropzone-prompt-text">
                  Click to Browse Image from Computer
                </h5>
                <p className="cover-dropzone-sub-text">
                  or drag and drop your photo here (PNG, JPG, WEBP up to 20MB)
                </p>
                <button
                  type="button"
                  className="cover-upload-cta-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFilePicker();
                  }}
                >
                  <ImageIcon size={14} />
                  <span>Choose Photo from PC</span>
                </button>
              </>
            )}
          </div>

          {/* Details of uploaded file if applicable */}
          {uploadedFileName && (
            <div className="cover-file-attached-pill">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                <FileCheck size={16} className="text-emerald-700 shrink-0" />
                <span style={{ fontWeight: 700, color: '#065F46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {uploadedFileName}
                </span>
                {uploadedFileSize && (
                  <span style={{ fontSize: '11px', color: '#047857', flexShrink: 0 }}>
                    ({formatFileSize(uploadedFileSize)})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={triggerFilePicker}
                style={{ fontSize: '11.5px', fontWeight: 700, color: '#047857', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Change Photo
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: PRESET LIBRARY */}
      {sourceMode === 'preset' && (
        <div className="cover-presets-grid">
          {PRESET_COVERS.map((preset, idx) => {
            const isSelected = currentUrl === preset.url;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUploadedFileName(null);
                  setUploadedFileSize(null);
                  onImageChange(preset.url);
                }}
                className={`cover-preset-card ${isSelected ? 'is-selected' : ''}`}
              >
                <img 
                  src={preset.url} 
                  alt={preset.label} 
                  className="cover-preset-thumbnail" 
                />
                {isSelected && (
                  <div className="cover-preset-selected-badge">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
                <span className="cover-preset-caption">
                  {preset.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* MODE 3: DIRECT IMAGE URL */}
      {sourceMode === 'url' && (
        <div>
          <div className="cover-url-row">
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => {
                setUploadedFileName(null);
                setUploadedFileSize(null);
                onImageChange(e.target.value);
              }}
              placeholder="https://images.unsplash.com/photo-..."
              className="cover-url-input"
            />
            {currentUrl && (
              <button
                type="button"
                onClick={() => onImageChange('')}
                className="modal-close-btn"
                style={{ position: 'static', width: '36px', height: '36px' }}
                title="Clear URL"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
            Paste any direct HTTPS image link (Unsplash, Pexels, AWS S3, or CDN).
          </span>
        </div>
      )}

      {/* LIVE PREVIEW OF CURRENT COVER PHOTO */}
      {currentUrl && (
        <div className="cover-live-preview-box">
          <img 
            src={currentUrl} 
            alt="Itinerary Cover Preview" 
            className="cover-live-preview-image"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = PRESET_COVERS[0].url;
            }}
          />
          <div className="cover-live-preview-overlay">
            <span className="cover-live-preview-badge">
              <Check size={11} className="text-emerald-400" />
              Live Marketplace Cover Preview
            </span>
            <span style={{ fontSize: '10.5px', color: '#E2E8F0' }}>
              Visible to travelers on customer portal
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
