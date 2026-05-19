'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center mt-10">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-teal-100">
        <h2 className="text-3xl font-bold text-center text-teal-900 mb-6">Create Account</h2>
        {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4 text-center border border-red-100">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Username</label>
            <input 
              type="text" required 
              value={username} onChange={e => setUsername(e.target.value)} 
              className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
              placeholder="hackocean_master"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Email</label>
            <input 
              type="email" required 
              value={email} onChange={e => setEmail(e.target.value)} 
              className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
              placeholder="admin@hackocean.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Password</label>
            <input 
              type="password" required 
              value={password} onChange={e => setPassword(e.target.value)} 
              className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg shadow-md transition">
            Join the Network
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-teal-700">
          Already have an account? <Link href="/login" className="text-teal-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
