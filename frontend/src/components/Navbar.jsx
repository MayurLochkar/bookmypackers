'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { Layers3, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Request Service', href: '/request-service' },
    { name: 'Test Tools', href: '/test-tools' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      {/* Curved Shape Container */}
      <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-teal-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-teal-600 p-2.5 rounded-full shadow-inner transform group-hover:rotate-12 transition-transform">
            <Layers3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-teal-950 tracking-tight">
            Lead<span className="text-teal-600 font-extrabold">Flow</span> <span className='text-xs font-mono text-teal-500'>Pro</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-semibold text-teal-900 px-4 py-2 rounded-full hover:bg-teal-50 transition">
              {link.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-4">
              <Link href="/dashboard" className="bg-teal-600 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow hover:bg-teal-700 transition transform hover:scale-105">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-rose-50 text-rose-600 border border-rose-200 text-sm font-bold px-5 py-2.5 rounded-full shadow-sm hover:bg-rose-100 transition">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-4">
              <Link href="/login" className="text-teal-900 text-sm font-bold px-5 py-2.5 rounded-full hover:bg-teal-50 transition">
                Login
              </Link>
              <Link href="/register" className="bg-teal-600 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow hover:bg-teal-700 transition transform hover:scale-105">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-teal-900" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-7 h-7" />
        </button>
      </nav>

      {/* Mobile Menu Dialog */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <Dialog as={motion.div} static open={mobileMenuOpen} onClose={setMobileMenuOpen} className="fixed inset-0 z-50 md:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-teal-950">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-teal-900 bg-teal-50 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3 flex-grow">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-lg font-semibold text-teal-950 p-4 rounded-xl hover:bg-teal-50">
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="w-full block text-center bg-teal-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:bg-teal-700 transition">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full bg-rose-50 text-rose-600 border border-rose-200 text-lg font-bold py-4 rounded-xl shadow-sm hover:bg-rose-100 transition">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full block text-center bg-teal-50 text-teal-900 border border-teal-200 text-lg font-bold py-4 rounded-xl shadow-sm hover:bg-teal-100 transition">
                      Login
                    </Link>
                    <Link href="/register" className="w-full block text-center bg-teal-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:bg-teal-700 transition">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </header>
  );
}
