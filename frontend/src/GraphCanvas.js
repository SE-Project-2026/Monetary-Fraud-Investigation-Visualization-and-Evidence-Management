import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

export default function GraphCanvas({ externalAccount, refreshTrigger }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  const [accountId, setAccountId] = useState('ACC1000000000001');
  const [hops, setHops] = useState(2);
  const [minAmount, setMinAmount] = useState('');
  const [channel, setChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [graphMeta, setGraphMeta] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const fetchGraphData = async (targetAccount = accountId) => {
    if (!targetAccount) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ hops: hops.toString() });
      if (minAmount) params.append('min_amount', minAmount);
      if (channel) params.append('channel', channel);

      const res = await fetch(`http://127.0.0.1:8000/api/graph/${targetAccount}?${params.toString()}`);
      const data = await res.json();
      setGraphMeta(data);

      const elements = [
        ...(data.nodes || []).map(n => ({
          data: {
            id: n.id,
            label: n.label,
            isSeed: n.id === targetAccount
          }
        })),
        ...(data.edges || []).map((e, idx) => ({
          data: {
            id: `e-${idx}`,
            source: e.source,
            target: e.target,
            label: `₹${Number(e.amount).toLocaleString()} (${e.channel})`
          }
        }))
      ];

      if (cyRef.current) {
        cyRef.current.destroy();
      }

      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: elements,
        autoungrabify: false,
        userZoomingEnabled: true,
        userPanningEnabled: true,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#1d4ed8',
              'border-width': 2,
              'border-color': '#60a5fa',
              'label': 'data(label)',
              'color': '#f8fafc',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '10px',
              'font-weight': 'bold',
              'width': '68px',
              'height': '68px'
            }
          },
          {
            selector: 'node[?isSeed]',
            style: {
              'background-color': '#dc2626',
              'border-color': '#fca5a5',
              'width': '76px',
              'height': '76px'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2.5,
              'line-color': '#475569',
              'target-arrow-color': '#38bdf8',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': '10px',
              'color': '#e2e8f0',
              'text-background-color': '#0f172a',
              'text-background-opacity': 0.85,
              'text-background-padding': '3px',
              'text-rotation': 'autorotate'
            }
          }
        ],
        layout: {
          name: 'circle',
          padding: 45,
          fit: true,
          animate: false
        }
      });

      cyRef.current.on('tap', 'node', (evt) => {
        setSelectedNode(evt.target.data());
      });
    } catch (err) {
      console.error('Failed to load graph data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (externalAccount) {
      setAccountId(externalAccount);
      fetchGraphData(externalAccount);
    } else {
      fetchGraphData(accountId);
    }
    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, [externalAccount, refreshTrigger]);

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Transaction Network Topology</h3>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Red Node = Target Suspect Account | Blue Nodes = Connected Counterparties
          </span>
        </div>
        {graphMeta && (
          <div style={{ backgroundColor: '#0f172a', padding: '6px 12px', borderRadius: '6px', border: '1px solid #334155', fontSize: '12px', whiteSpace: 'nowrap' }}>
            Nodes: <strong style={{ color: '#38bdf8' }}>{graphMeta.total_nodes ?? 0}</strong> &nbsp;|&nbsp;
            Transfers: <strong style={{ color: '#4ade80' }}>{graphMeta.total_edges ?? 0}</strong>
          </div>
        )}
      </div>

      {/* Responsive Traversal & Edge Filter Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        <input
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="Target Account ID"
          style={{ flex: '2 1 180px', minWidth: 0, padding: '8px 10px', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '6px', fontSize: '13px' }}
        />
        <select
          value={hops}
          onChange={(e) => setHops(Number(e.target.value))}
          style={{ flex: '0 1 95px', padding: '8px', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '6px', fontSize: '13px' }}
        >
          <option value={1}>1 Hop</option>
          <option value={2}>2 Hops</option>
          <option value={3}>3 Hops</option>
        </select>
        <input
          type="number"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          placeholder="Min ₹ Amount"
          style={{ flex: '1 1 115px', minWidth: 0, padding: '8px 10px', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '6px', fontSize: '13px' }}
        />
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          style={{ flex: '1 1 115px', padding: '8px', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '6px', fontSize: '13px' }}
        >
          <option value="">All Channels</option>
          <option value="NEFT">NEFT</option>
          <option value="RTGS">RTGS</option>
          <option value="IMPS">IMPS</option>
          <option value="UPI">UPI</option>
        </select>
        <button
          onClick={() => fetchGraphData(accountId)}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          {loading ? '...' : 'Trace'}
        </button>
      </div>

      {/* Dark Interactive Cytoscape Canvas */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '430px',
          backgroundColor: '#090d16',
          borderRadius: '8px',
          border: '1px solid #334155',
          overflow: 'hidden'
        }}
      />

      {selectedNode && (
        <div style={{ marginTop: '10px', padding: '10px 14px', backgroundColor: '#0f172a', borderRadius: '6px', border: '1px solid #334155', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>Selected Entity:</strong> {selectedNode.id} (Masked: {selectedNode.label})</span>
          <span style={{ color: selectedNode.isSeed ? '#f87171' : '#38bdf8' }}>
            {selectedNode.isSeed ? 'Primary Suspect Node' : 'Connected Counterparty'}
          </span>
        </div>
      )}
    </div>
  );
}