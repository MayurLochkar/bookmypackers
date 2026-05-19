'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  MapPin,
  Layers,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function RequestService() {
  const [formData, setFormData] = useState({
    name: '', phone: '', city: '', service: 'Service 1', description: ''
  });
  const [status, setStatus] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  // --- Backend Logic (Unchanged) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const res = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`Error: ${data.error}`);
      } else {
        setStatus(`Success! Lead created and assigned to providers: ${data.assignedProviders.join(', ')}`);
        setFormData({ name: '', phone: '', city: '', service: 'Service 1', description: '' });
      }
    } catch (err) {
      setStatus('Failed to submit request.');
    }
  };
  // ---------------------------------

  const isSubmitting = status === 'Submitting...';
  const isError = status?.startsWith('Error') || status?.startsWith('Failed');
  const isSuccess = status?.startsWith('Success');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">

      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-2xl w-full mx-auto relative z-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10">

          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-900 px-8 py-10 text-white text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white opacity-10 rounded-full"></div>

            <div className="relative z-10 flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
                <Send className="w-8 h-8 text-white transform -rotate-12" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Request a Service</h2>
            <p className="text-teal-100/90 text-sm font-medium max-w-sm mx-auto mb-4">
              Fill out the form below to generate a lead and test the allocation engine in real-time.
            </p>
            <button 
              onClick={() => {
                setFormData({
                  name: `Demo User ${Math.floor(Math.random() * 1000)}`,
                  phone: `98765${Math.floor(10000 + Math.random() * 90000)}`,
                  city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune'][Math.floor(Math.random() * 4)],
                  service: `Service ${Math.floor(1 + Math.random() * 3)}`,
                  description: 'Need urgent help with this service.'
                });
              }}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-1.5 px-4 rounded-full transition-colors border border-white/40 shadow-sm"
            >
              ✨ Auto-fill Fake Data
            </button>
          </div>

          <div className="p-8 sm:p-10">
            {/* Status Alert Messages */}
            {status && !isSubmitting && (
              <div className={`flex items-start gap-4 p-5 mb-8 rounded-2xl border ${isError
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                } transition-all duration-500 animate-in fade-in slide-in-from-top-4`}>
                <div className="shrink-0 mt-0.5">
                  {isSuccess ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-1">
                    {isSuccess ? 'Lead Generated' : 'Submission Failed'}
                  </h3>
                  <p className="font-medium text-sm opacity-90">{status}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text" required
                      value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400"
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel" required
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400"
                      placeholder="+1 (555) 000-0000"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">City</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      type="text" required
                      value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400"
                      placeholder="New York"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Service Select */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Service Type</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                      <Layers className="w-5 h-5" />
                    </div>
                    <select
                      value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 transition-all duration-200 text-slate-900 font-medium appearance-none"
                      disabled={isSubmitting}
                    >
                      <option>Service 1</option>
                      <option>Service 2</option>
                      <option>Service 3</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Description</label>
                <div className="relative group">
                  <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <textarea
                    required
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl h-32 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 transition-all duration-200 resize-none text-slate-900 font-medium placeholder-slate-400"
                    placeholder="Briefly describe what you need help with..."
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-teal-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-lg overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>

                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Allocation...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6 font-medium">
          Secure, idempotent, and race-condition free lead generation.
        </p>
      </div>
    </div>
  );
}