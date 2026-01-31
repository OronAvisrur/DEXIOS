import React, { useState, useEffect } from 'react';
import { getIPFSUrl, downloadFromIPFS } from '../utils/ipfs';
import './FilePreview.css';

const FilePreview = ({ ipfsHash }) => {
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ipfsHash) {
      const url = getIPFSUrl(ipfsHash);
      setFileUrl(url);
      detectFileType(url);
    }
  }, [ipfsHash]);

  const detectFileType = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      setFileType(contentType);
      setLoading(false);
    } catch (error) {
      setFileType('unknown');
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadFromIPFS(ipfsHash);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deliverable-${ipfsHash.substring(0, 8)}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Download failed: ' + error.message);
    }
  };

  if (loading) return <div className="file-preview-loading">Loading preview...</div>;

  return (
    <div className="file-preview">
      {fileType?.startsWith('image/') ? (
        <img src={fileUrl} alt="Deliverable" className="preview-image" />
      ) : fileType === 'application/pdf' ? (
        <iframe src={fileUrl} title="PDF Preview" className="preview-pdf" />
      ) : (
        <div className="preview-placeholder">
          <p>File type: {fileType || 'Unknown'}</p>
          <p className="preview-hash">{ipfsHash}</p>
        </div>
      )}
      <button onClick={handleDownload} className="download-btn">
        Download File
      </button>
    </div>
  );
};

export default FilePreview;
