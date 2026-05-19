'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function TestTools() {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [dashboardData, setDashboardData] = useState({ providers: [] });
  const [customLeadCount, setCustomLeadCount] = useState(10);
  
  const logsEndRef = useRef(null);
  const router = useRouter();

  const fetchDashboard = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setDashboardData(json);
      }
    } catch (err) {}
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchDashboard();

    const eventSource = new EventSource('http://localhost:5000/api/stream');
    eventSource.onmessage = (event) => {
      if (event.data === 'update') fetchDashboard();
    };
    eventSource.addEventListener('log', (event) => {
      try {
        const logData = JSON.parse(event.data);
        setLogs(prev => [...prev, logData]);
      } catch (e) {}
    });

    return () => eventSource.close();
  }, [router]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const apiCall = async (url, body = {}) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: Object.keys(body).length ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setStatus({ type: 'success', msg: data.message });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
      {/* LEFT COLUMN: Controls */}
      <div className="lg:w-1/2 space-y-6">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-teal-900 mb-2">Advanced Testing Tools</h2>
          <p className="text-teal-700">Enterprise-grade simulations for Webhooks & Concurrency.</p>
        </div>
        
        {status && (
          <div className={`p-4 rounded-lg font-medium shadow-sm border-l-4 ${status.type === 'error' ? 'bg-red-50 text-red-900 border-red-500' : 'bg-teal-50 text-teal-900 border-teal-500'}`}>
            {status.msg}
          </div>
        )}

        {/* Webhook & Idempotency */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-teal-100">
          <h3 className="text-xl font-bold text-teal-800 mb-2 border-b pb-2">Webhook / Quota</h3>
          <p className="text-sm text-gray-600 mb-4">
            This section acts like a payment gateway. When someone pays, it refills the quotas back to 10. The idempotency test makes sure that if 5 identical payment messages arrive at the exact same time, the system only counts it once.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => apiCall('http://localhost:5000/api/webhook/reset-quota', { eventId: `webhook_reset_${Date.now()}` })}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-lg font-bold shadow-md transition"
            >
              Simulate Quota Reset
            </button>
            <button 
              onClick={async () => {
                const eventId = `idempotency_${Date.now()}`;
                setStatus({ type: 'success', msg: 'Firing 5 simultaneous requests...' });
                const promises = Array(5).fill().map(() => fetch('http://localhost:5000/api/webhook/reset-quota', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventId })
                }));
                await Promise.all(promises);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-teal-800 border border-slate-300 px-5 py-3 rounded-lg font-bold transition"
            >
              Test Idempotency (5x Requests)
            </button>
          </div>
        </div>

        {/* Custom Lead Generation */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-teal-100">
          <h3 className="text-xl font-bold text-teal-800 mb-2 border-b pb-2">Load Testing</h3>
          <p className="text-sm text-gray-600 mb-4">
            Use this to generate fake leads. "Burst" sends them all instantly at the exact same millisecond to test race conditions. "Trickle" sends them slowly one by one.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">Number of Leads: {customLeadCount}</label>
            <input 
              type="range" min="1" max="100" 
              value={customLeadCount} 
              onChange={(e) => setCustomLeadCount(e.target.value)}
              className="w-full accent-teal-600"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => apiCall('http://localhost:5000/api/test/generate-custom-leads', { count: customLeadCount, burst: true })}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-lg font-bold shadow-md transition"
            >
              Burst (Simultaneous)
            </button>
            <button 
              onClick={() => apiCall('http://localhost:5000/api/test/generate-custom-leads', { count: customLeadCount, burst: false })}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold shadow-md transition"
            >
              Trickle (0.5s Gap)
            </button>
          </div>
        </div>

        {/* Chaos Engineering */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-rose-100">
          <h3 className="text-xl font-bold text-rose-800 mb-2 border-b border-rose-100 pb-2">Chaos Simulation</h3>
          <p className="text-sm text-gray-600 mb-4">
            These buttons intentionally break the system to see how it recovers. DB Timeout freezes the database for 5 seconds. Webhook Error fakes a server crash.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => apiCall('http://localhost:5000/api/test/simulate-error', { type: 'db_timeout' })}
              className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 px-4 py-3 rounded-lg font-bold transition"
            >
              DB Timeout (5s)
            </button>
            <button 
              onClick={() => apiCall('http://localhost:5000/api/test/simulate-error', { type: 'webhook_fail' })}
              className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 px-4 py-3 rounded-lg font-bold transition"
            >
              Webhook Error 500
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Terminal & Mini Dashboard */}
      <div className="lg:w-1/2 flex flex-col gap-6">
        
        {/* Live Terminal */}
        <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[400px]">
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-xs font-mono text-slate-400">live_audit_logs.sh</span>
            </div>
            <button onClick={() => setLogs([])} className="text-xs text-slate-400 hover:text-white transition">Clear</button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic">Waiting for events...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`mb-2 ${log.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  <span className="text-slate-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.message}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Mini Provider Dashboard */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-teal-100">
          <h3 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
            Live Quota Monitor
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {dashboardData.providers.map(p => (
              <div key={p.providerId} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-xs font-bold text-slate-500 mb-1">{p.name}</div>
                <div className={`text-2xl font-black ${p.quota === 0 ? 'text-rose-500' : 'text-teal-600'}`}>
                  {p.quota}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 uppercase">Quota</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
