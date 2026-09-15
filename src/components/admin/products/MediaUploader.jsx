import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check } from 'lucide-react';

export const MediaUploader = ({ imageUrl, onImageChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Drop Zone */}
      <div
        className={`adm-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('adm-file-input')?.click()}
      >
        <input
          id="adm-file-input"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
        <UploadCloud size={32} className="adm-dropzone-icon" />
        <div className="adm-dropzone-text">Drop product image here or click to browse</div>
        <div className="adm-dropzone-sub">Supports PNG, JPG, or WEBP (up to 5MB)</div>
      </div>

      {/* URL Input Fallback */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="adm-input"
          placeholder="Or paste an image URL (e.g. /images/featured-hoodie.jpg)"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUrlSubmit(); } }}
        />
        <button
          type="button"
          className="adm-btn adm-btn-secondary"
          onClick={handleUrlSubmit}
        >
          Add URL
        </button>
      </div>

      {/* Image Preview & Primary Tag */}
      {imageUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: 'var(--adm-bg)', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)' }}>
          <img
            src={imageUrl}
            alt="Product preview"
            style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
              <Check size={14} color="var(--adm-success)" /> Primary Catalog Image
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', wordBreak: 'break-all', maxWidth: '300px' }}>
              {imageUrl.startsWith('data:') ? 'Local file uploaded' : imageUrl}
            </div>
          </div>
          <button
            type="button"
            className="adm-btn-icon danger"
            style={{ marginLeft: 'auto' }}
            onClick={() => onImageChange('')}
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
