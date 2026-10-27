import React, { useState, useRef } from 'react';
import './App.css';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function App() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState(null);
  const inputRef = useRef(null);

  const selectFile = (selected) => {
    if (selected) {
      setFile(selected);
      setMessage(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    selectFile(e.dataTransfer.files[0]);
  };

  const handleRemove = () => {
    setFile(null);
    setMessage(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) {
      setMessage({
        type: 'success',
        text: `Sprint 1 Demo: ${file.name} ready for evidence processing!`,
      });
    } else {
      setMessage({ type: 'error', text: 'Please select a file first.' });
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header-badge">F</div>
        <h1>Monetary Fraud Investigation Platform</h1>
      </header>

      <main className="main">
        <form className="card" onSubmit={handleUpload}>
          <h2>Upload Evidence</h2>
          <p className="subtitle">
            Add transaction records or case files to start an investigation.
          </p>

          <div
            className={`dropzone ${dragging ? 'dragging' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                inputRef.current.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className="dropzone-icon">📁</div>
            <div className="dropzone-title">Drag and drop a file here</div>
            <div className="dropzone-hint">or click to browse</div>
          </div>

          <input
            ref={inputRef}
            className="hidden-input"
            type="file"
            onChange={(e) => selectFile(e.target.files[0])}
          />

          {file && (
            <div className="file-info">
              <div>
                <div className="file-name">{file.name}</div>
                <div className="file-size">{formatSize(file.size)}</div>
              </div>
              <button type="button" className="remove-btn" onClick={handleRemove}>
                Remove
              </button>
            </div>
          )}

          <button type="submit" className="upload-btn">
            Upload Evidence
          </button>

          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
        </form>
      </main>
    </div>
  );
}

export default App;