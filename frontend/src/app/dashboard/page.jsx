'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [data, setData] = useState({ providers: [], leads: [] });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('admin'); // 'admin', or 'provider_1', 'provider_2', etc.
  const [toast, setToast] = useState(null);
  const router = useRouter();

  const fetchDashboard = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/dashboard');
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const url = action === 'complete' 
        ? `http://localhost:5000/api/leads/${id}/complete`
        : `http://localhost:5000/api/leads/${id}`;
      
      const res = await fetch(url, {
        method: action === 'complete' ? 'PUT' : 'DELETE'
      });
      
      if (res.ok) {
        setToast({ 
          title: 'Success!', 
          message: `Lead ${action === 'complete' ? 'completed' : 'deleted'} successfully.` 
        });
        setTimeout(() => setToast(null), 3000);
        fetchDashboard(); // Optimistic or manual refresh
      }
    } catch (err) {
      console.error(err);
    }
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
      if (event.data === 'update') {
        fetchDashboard();
      }
    };
    eventSource.addEventListener('log', (event) => {
      try {
        const logData = JSON.parse(event.data);
        if (logData.message.includes('assigned')) {
          setToast({ title: 'New Lead Assigned!', message: logData.message });
          setTimeout(() => setToast(null), 4000);
        }
      } catch (e) {}
    });

    return () => eventSource.close();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-teal-800 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  // Filter data based on view mode
  const displayedProviders = viewMode === 'admin' 
    ? data.providers 
    : data.providers.filter(p => p.providerId.toString() === viewMode.split('_')[1]);

  const displayedLeads = viewMode === 'admin'
    ? data.leads
    : data.leads.filter(l => l.assignedProviders.includes(Number(viewMode.split('_')[1])));

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border-l-4 border-teal-500 shadow-2xl rounded-lg p-4 z-50 animate-bounce">
          <h4 className="font-bold text-teal-900">{toast.title}</h4>
          <p className="text-sm text-slate-600 mt-1">{toast.message}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {viewMode === 'admin' ? 'Admin Master Dashboard' : `Provider ${viewMode.split('_')[1]} Dashboard`}
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Real-time allocation status and recent leads feed.
            </p>
          </div>

          {/* VIEW SELECTOR */}
          <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <span className="text-sm font-bold text-slate-600 px-2">View As:</span>
            <select 
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 font-semibold cursor-pointer outline-none"
            >
              <option value="admin">👨‍💻 Admin (All)</option>
              {data.providers.map(p => (
                <option key={p.providerId} value={`provider_${p.providerId}`}>
                  🏢 {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Providers Cards Grid */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            {viewMode === 'admin' ? `All Active Providers (${displayedProviders.length})` : 'Your Quota Status'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProviders.map(p => (
              <div
                key={p.providerId}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between group hover:border-teal-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border ${p.quota === 0
                      ? 'bg-rose-50 text-rose-700 border-rose-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                      Quota: {p.quota} / 10
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-lg font-bold text-slate-800 tracking-tight">
                      {p.name}
                    </h4>
                    <span className="text-xs font-semibold text-slate-500 mt-0.5">
                      Provider #{p.providerId}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leads Received</span>
                  <span className="font-extrabold text-2xl text-slate-800 bg-slate-50 px-3 py-1 rounded-lg">
                    {p.leadsReceived}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads Table Container */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75c.621 0 1.125.504 1.125 1.125v1.125c0 .621-.504 1.125-1.125 1.125H5.625A1.125 1.125 0 0 1 4.5 6.75V5.625c0-.621.504-1.125 1.125-1.125Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {viewMode === 'admin' ? 'All Recent Leads' : 'Your Assigned Leads'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Updated automatically on new entries</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Customer Name</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6">Service Area</th>
                  {viewMode === 'admin' && <th className="py-4 px-6">Assigned To</th>}
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {displayedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={viewMode === 'admin' ? 6 : 5} className="p-8 text-center text-sm text-slate-400 font-medium">
                      No recent leads found.
                    </td>
                  </tr>
                ) : (
                  displayedLeads.map(lead => (
                    <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="py-4 px-6 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                        {lead.name}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600 whitespace-nowrap">
                        {lead.phone}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                          {lead.service}
                        </span>
                      </td>
                      {viewMode === 'admin' && (
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1.5">
                            {lead.assignedProviders.map(pid => (
                              <span
                                key={pid}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded transition-colors"
                              >
                                P{pid}
                              </span>
                            ))}
                          </div>
                        </td>
                      )}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleAction(lead._id, 'complete')}
                            title="Mark as Completed"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleAction(lead._id, 'delete')}
                            title="Delete Lead"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}