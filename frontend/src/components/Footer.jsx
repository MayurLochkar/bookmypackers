import Link from 'next/link';
import { Layers3 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-teal-950 text-teal-200 mt-20">
      <svg className="absolute top-0 left-0 w-full h-[10vh] transform -translate-y-[95%]" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#0a3636" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-teal-500 p-2 rounded-full">
              <Layers3 className="w-6 h-6 text-teal-950" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">LeadFlow Pro</span>
          </Link>
          <p className="text-teal-300 text-sm">Engineered for precise, real-time lead distribution. Maximize your conversion potential.</p>
        </div>
        <div className='md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8'>
          <div className='space-y-3'>
            <h4 className='font-bold text-white'>Platform</h4>
            <Link href="/request-service" className='block text-sm hover:text-white'>Submit Lead</Link>
            <Link href="/dashboard" className='block text-sm hover:text-white'>Provider Portal</Link>
            <Link href="/test-tools" className='block text-sm hover:text-white'>API Tools</Link>
          </div>
          <div className='space-y-3'>
            <h4 className='font-bold text-white'>Company</h4>
            <Link href="#" className='block text-sm hover:text-white'>About Us</Link>
            <Link href="#" className='block text-sm hover:text-white'>Careers</Link>
            <Link href="#" className='block text-sm hover:text-white'>Contact</Link>
          </div>
          <div className='space-y-3'>
            <h4 className='font-bold text-white'>Legal</h4>
            <Link href="#" className='block text-sm hover:text-white'>Terms of Service</Link>
            <Link href="#" className='block text-sm hover:text-white'>Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-8 pt-4 border-t border-teal-800 text-center text-xs text-teal-500 relative z-10">
        &copy; {new Date().getFullYear()} LeadFlow Pro (HackOcean Venture). All rights reserved. Evaluation Version.
      </div>
    </footer>
  );
}
