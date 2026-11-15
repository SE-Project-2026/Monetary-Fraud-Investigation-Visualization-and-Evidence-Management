import React, { useState } from 'react';
import GraphCanvas from './GraphCanvas';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [activeAccount, setActiveAccount] = useState('ACC1000000000001');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadResult(data);

      if (data.seed_account) {
        setActiveAccount(data.seed_account);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      alert('Upload failed. Ensure FastAPI backend is running on port 8000.');
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/accounts/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1120', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top Navbar */}
        <header style={{ padding: '14px 32px', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ backgroundColor: '#2563eb', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          F
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Monetary Fraud Investigation Platform
        </div>
      </header>

      {/* Main Two-Column Workbench */}
      <main
        style={{
          width: '100%',
          maxWidth: '1320px',
          margin: '24px auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '360px minmax(0, 1fr)',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        
        {/* Left Sidebar: Evidence Vault + Account Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card 1: SHA-256 Evidence Ingestion */}
          <section style={{ backgroundColor: '#111827', padding: '22px', borderRadius: '10px', border: '1px solid #1f2937' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>1. Evidence Vault & Ingestion</h3>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '14px' }}>
              Upload transaction CSV logs to compute SHA-256 integrity hash and build the entity graph.
            </p>

            <form onSubmit={handleUpload}>
              <input
                type="file"
                accept=".csv,.txt,.json"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
                style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px dashed #334155', borderRadius: '6px', color: '#cbd5e1', fontSize: '12px', marginBottom: '12px', boxSizing: 'border-box' }}
              />
              <button
                type="submit"
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {uploading ? 'Hashing & Parsing...' : 'Ingest & Generate SHA-256'}
              </button>
            </form>

            {uploadResult && (
              <div style={{ marginTop: '14px', padding: '12px', backgroundColor: '#0f172a', borderRadius: '6px', border: '1px solid #1e293b', fontSize: '12px' }}>
                <div style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: '6px' }}>
                  ✓ Verified & Ingested ({uploadResult.records_ingested} rows)
                </div>
                <div style={{ color: '#94a3b8', fontSize: '11px', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  <strong style={{ color: '#cbd5e1' }}>SHA-256 Digest:</strong><br />
                  {uploadResult.sha256_hash}
                </div>
              </div>
            )}
          </section>

          {/* Card 2: Account Lookup Query Bar */}
          <section style={{ backgroundColor: '#111827', padding: '22px', borderRadius: '10px', border: '1px solid #1f2937' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>2. Suspect Account Search</h3>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px' }}>
              Search ingested accounts by partial ID to load into the topology canvas.
            </p>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. ACC9 or 0002"
                style={{ flex: 1, padding: '8px 10px', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '6px', fontSize: '13px' }}
              />
              <button
                type="submit"
                style={{ padding: '8px 14px', backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                Find
              </button>
            </form>

            {searchResults.length > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {searchResults.map((acc) => (
                  <button
                    key={acc}
                    onClick={() => {
                      setActiveAccount(acc);
                      setRefreshTrigger(prev => prev + 1);
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#1e293b',
                      color: '#e2e8f0',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {acc} ↗
                  </button>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Main Area: Interactive Graph Workbench */}
        <section style={{ backgroundColor: '#111827', padding: '22px', borderRadius: '10px', border: '1px solid #1f2937' }}>
          <GraphCanvas externalAccount={activeAccount} refreshTrigger={refreshTrigger} />
        </section>

      </main>
    </div>
  );
}

export default App;