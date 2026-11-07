import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

export default function GraphCanvas() {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [accountId, setAccountId] = useState('ACC1000000000001');
  const [hops, setHops] = useState(1);
  const [loading, setLoading] = useState(false);
  const [graphMeta, setGraphMeta] = useState(null);

  const fetchGraphData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/graph/${accountId}?hops=${hops}`);
      const data = await res.json();
      setGraphMeta(data);

      const elements = [
        ...data.nodes.map(n => ({
          data: { id: n.id, label: n.label }
        })),
        ...data.edges.map((e, idx) => ({
          data: {
            id: `e-${idx}`,
            source: e.source,
            target: e.target,
            label: `₹${e.amount} (${e.channel})`
          }
        }))
      ];

      if (cyRef.current) {
        cyRef.current.destroy();
      }

      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: elements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#2563eb',
              'label': 'data(label)',
              'color': '#ffffff',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '11px',
              'width': '60px',
              'height': '60px'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#94a3b8',
              'target-arrow-color': '#0ea5e9',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': '10px',
              'color': '#334155',
              'text-rotation': 'autorotate',
              'text-margin-y': -8
            }
          }
        ],
        layout: {
          name: 'cose',
          padding: 30
        }
      });
    } catch (err) {
      console.error("Failed to load graph data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, []);

  return (
    <div style={{ marginTop: '24px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
      <h3 style={{ margin: '0 0 12px 0' }}>Transaction Network Graph Visualization</h3>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
        <input
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="Enter Account ID"
          style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', width: '220px' }}
        />
        <select
          value={hops}
          onChange={(e) => setHops(Number(e.target.value))}
          style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
        >
          <option value={1}>1 Hop</option>
          <option value={2}>2 Hops</option>
          <option value={3}>3 Hops</option>
        </select>
        <button
          onClick={fetchGraphData}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0284c7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Traversing...' : 'Expand Graph'}
        </button>
      </div>

      {graphMeta && (
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
          Nodes Discovered: <strong>{graphMeta.total_nodes}</strong> | Directed Transfers: <strong>{graphMeta.total_edges}</strong>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '420px',
          backgroundColor: '#f8fafc',
          borderRadius: '6px',
          border: '1px dashed #cbd5e1'
        }}
      />
    </div>
  );
}