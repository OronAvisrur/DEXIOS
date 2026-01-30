import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileSelect, accept = "*" }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div 
      className={`file-upload ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        onChange={handleFileChange}
        accept={accept}
        hidden
      />
      <label htmlFor="file-input" className="file-upload-label">
        {selectedFile ? (
          <div className="file-selected">
            <span className="file-icon">📄</span>
            <div className="file-info">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        ) : (
          <div className="file-placeholder">
            <span className="upload-icon">☁️</span>
            <p>Drag & drop file here or click to browse</p>
            <p className="upload-hint">Support for any file type</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default FileUpload;
