import React, { useState, useEffect } from 'react';

export default function CircularRoutingView() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/fraud/circular-routing')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') setCycles(data.cycles);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch cycle data:", err));
  }, []);

  return (
    <div className="p-6 bg-[#0f0f0f] text-gray-100 rounded-md shadow-md border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Detected Fraud Cycles</h2>
      
      {loading ? (
        <p className="text-gray-400 font-mono text-sm">Analyzing transaction graph...</p>
      ) : cycles.length > 0 ? (
        <ul className="space-y-3">
          {cycles.map((cycle, index) => (
            <li 
              key={index} 
              className="font-mono text-sm bg-black p-4 rounded border border-gray-800 shadow-inner"
            >
              {cycle.join(' ➔ ')}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No circular routing detected.</p>
      )}
    </div>
  );
}