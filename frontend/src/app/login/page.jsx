'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // --- Backend Logic (Unchanged) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };
  // ---------------------------------

  return (
    // Custom Animation Keyframes directly in style tag for ease of use
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl flex overflow-hidden border border-slate-100 min-h-[600px]">

          {/* Left Side - Animated Visual (Hidden on Mobile) */}
          <div className="w-1/2 bg-teal-600 p-12 text-white flex-col justify-between hidden md:flex relative overflow-hidden">
            {/* Background Decorative Circles */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-teal-500 rounded-full opacity-50"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-700 rounded-full opacity-50 animate-pulse-slow"></div>

            <div className="relative z-10">
              <h1 className="text-4xl font-extrabold tracking-tight">HackOcean</h1>
              <p className="text-teal-100 mt-2">Secure Provider Portal</p>
            </div>

            {/* --- CODE-BASED ANIMATED CHARACTER (SVG) --- */}
            <div className="relative z-10 flex justify-center items-center flex-grow animate-float">
              <svg width="350" height="350" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Abstract Platform */}
                <ellipse cx="250" cy="430" rx="150" ry="20" fill="#0f766e" fillOpacity="0.3" />
                <path d="M150 410H350L380 440H120L150 410Z" fill="#14b8a6" />

                {/* Character Body */}
                <rect x="210" y="250" width="80" height="120" rx="10" fill="#f1f5f9" />
                <rect x="220" y="260" width="60" height="100" rx="5" fill="#e2e8f0" />
                {/* Hoodie strings */}
                <path d="M240 260V290" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                <path d="M260 260V290" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

                {/* Head / Helmet with Glow */}
                <circle cx="250" cy="210" r="45" fill="#0f172a" stroke="#2dd4bf" strokeWidth="4" />
                <path d="M225 200C225 180 275 180 275 200V220H225V200Z" fill="#1e293b" />
                <rect x="230" y="200" width="40" height="15" rx="2" fill="#2dd4bf" className="animate-pulse">
                  <title>Glow</title>
                </rect>

                {/* Floating Screen 1 (Left) */}
                <g className="animate-float" style={{ animationDelay: '1s' }}>
                  <rect x="80" y="150" width="100" height="70" rx="8" fill="white" stroke="#5eead4" strokeWidth="2" />
                  <rect x="90" y="160" width="60" height="8" rx="2" fill="#2dd4bf" />
                  <rect x="90" y="175" width="80" height="4" rx="2" fill="#cbd5e1" />
                  <rect x="90" y="185" width="80" height="4" rx="2" fill="#cbd5e1" />
                  <rect x="90" y="195" width="50" height="4" rx="2" fill="#cbd5e1" />
                </g>

                {/* Floating Elements (Right) */}
                <g className="animate-float" style={{ animationDelay: '2s' }}>
                  <circle cx="400" cy="180" r="25" fill="#115e59" stroke="white" strokeWidth="2" />
                  <path d="M393 180L398 185L407 176" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                  <rect x="370" y="240" width="90" height="50" rx="8" fill="#14b8a6" fillOpacity="0.8" />
                  <path d="M380 255H450" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  <path d="M380 265H430" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  <path d="M380 275H410" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* Hands interacting */}
                <path d="M190 320C190 320 210 300 220 300" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" />
                <path d="M310 320C310 320 290 300 280 300" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
            {/* ---------------------------------------------------- */}

            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-bold text-white">Streamline Your Leads</h2>
              <p className="text-teal-100 mt-2 text-sm max-w-sm mx-auto">Access real-time customer data and manage service allocations efficiently in one secure place.</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">

            {/* Mobile Logo (Visible only on mobile) */}
            <div className="md:hidden text-center mb-8">
              <h1 className="text-3xl font-black text-teal-600 tracking-tight">HackOcean</h1>
              <p className="text-slate-500 text-xs mt-1">Secure Provider Portal</p>
            </div>

            <div className="mb-10 text-center md:text-left">
              <h2 className="text-4xl font-extrabold text-slate-950 tracking-tight">Welcome Back</h2>
              <p className="text-slate-600 mt-2 font-medium">Please enter your details to sign in.</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-500 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v.008Z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    type="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 focus:bg-white focus:outline-none transition-all duration-200 text-slate-900"
                    placeholder="admin@hackocean.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-800">Password</label>
                  <a href="#" className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline">Forgot password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                  <input
                    type="password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 focus:bg-white focus:outline-none transition-all duration-200 text-slate-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/20 transform hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]">
                Sign In to Dashboard
              </button>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-xs text-center text-slate-400 font-bold uppercase tracking-wider mb-3">Demo Quick Login</p>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => { setEmail('admin@hackocean.com'); setPassword('admin123'); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-lg transition"
                  >
                    👨‍💻 Admin
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setEmail('provider@hackocean.com'); setPassword('provider123'); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-lg transition"
                  >
                    🏢 Provider
                  </button>
                </div>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-slate-600">
              New to HackOcean? <Link href="/register" className="text-teal-600 font-bold hover:text-teal-700 hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}