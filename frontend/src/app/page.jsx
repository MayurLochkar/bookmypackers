'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import {
  Zap, Users, Target, BarChart3, ShieldCheck,
  RefreshCcw, Layers3, Menu, X, ArrowRight, BotMessageSquare
} from 'lucide-react';

// --- Animations Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const robotAnimation = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, -2, 2, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// --- Mock Data (Features) ---
const features = [
  { title: 'Intelligent Routing', desc: 'AI-powered algorithms match leads to the best-suited providers instantly based on industry, location, and capacity.', icon: Target },
  { title: 'Real-Time Concurrency', desc: 'Atomic database operations guarantee zero race conditions. Leads are never double-assigned, even under heavy load.', icon: Zap },
  { title: 'Dynamic Quota Management', desc: 'Set and forget monthly or daily limits per provider. The system automatically pauses allocation when caps are met.', icon: Layers3 },
  { title: 'Fair & Round-Robin Distribution', desc: 'Ensure equal opportunity with sophisticated round-robin logic that respects provider availability and performance tiers.', icon: Users },
  { title: 'Fraud Detection & Verification', desc: 'Built-in lead scrubbing validates phone numbers, emails, and detects duplicates before they enter the system.', icon: ShieldCheck },
  { title: 'Performance Analytics', desc: 'Track conversion rates, acceptance times, and ROI per provider with detailed, exportable reports.', icon: BarChart3 },
];

// --- Components ---

const DynamicOceanBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-white to-teal-100/50" />
    <svg className="absolute bottom-0 left-0 w-full h-[20vh] transform translate-y-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="#008080" fillOpacity="0.1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,202.7C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      <path fill="#008080" fillOpacity="0.15" d="M0,224L60,218.7C120,213,240,203,360,186.7C480,171,600,149,720,165.3C840,181,960,235,1080,245.3C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" className="animate-pulse" style={{ animationDuration: '6s' }}></path>
    </svg>
  </div>
);

export default function Home() {
  return (
    <div className="relative min-h-screen text-teal-950 font-sans antialiased">
      <DynamicOceanBackground />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 overflow-hidden">
        <motion.div
          className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center"
          initial="hidden" animate="visible" variants={staggerContainer}
        >
          {/* Hero Text */}
          <motion.div className="md:col-span-7 space-y-6 text-center md:text-left section-scroll-animate" variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full text-sm font-semibold shadow-inner border border-teal-200">
              <Zap className="w-4 h-4 text-teal-600 animate-pulse" />
              Next-Gen Lead Distribution Engine
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-teal-950 tracking-tighter leading-[0.95] drop-shadow-sm">
              Route Leads <span className="text-teal-600">Instantly</span>. Maximize Revenue.
            </h1>

            <p className="text-xl md:text-2xl text-teal-800 max-w-3xl font-medium leading-relaxed">
              Eliminate manual sorting and race conditions. Our high-performance engine ensures fair, concurrent-safe lead allocation to your provider network in milliseconds.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
              <Link href="/dashboard" className="group bg-teal-600 hover:bg-teal-700 text-white text-lg font-bold px-10 py-4 rounded-2xl shadow-lg hover:shadow-cyan-500/30 transition transform hover:-translate-y-1 flex items-center gap-2">
                Launch Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/request-service" className="bg-white text-teal-700 border-2 border-teal-200 text-lg font-bold px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-teal-50 transition transform hover:-translate-y-1">
                Demo Submission
              </Link>
            </div>
          </motion.div>

          {/* Animated Character / Visual */}
          <motion.div className="md:col-span-5 flex justify-center section-scroll-animate relative" variants={fadeInUp}>
            <div className='absolute inset-0 bg-teal-200 rounded-full blur-3xl opacity-30 animate-pulse' />
            <motion.div
              className="relative bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white"
              variants={robotAnimation} animate="animate"
            >
              <BotMessageSquare className='w-64 h-64 text-teal-600 drop-shadow-xl' strokeWidth={1} />
              <div className='absolute bottom-4 left-4 right-4 bg-teal-950 text-white p-4 rounded-xl shadow-lg text-center font-mono text-xs border border-teal-700'>
                STATUS: Processing Leads...<br />
                <span className='text-green-400'>[OK] Concurrency Safe</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative z-10">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        >
          <motion.div className="text-center mb-20 section-scroll-animate" variants={fadeInUp}>
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Enterprise Grade</h2>
            <p className="text-5xl font-extrabold text-teal-950 tracking-tight">Core System Architecture</p>
            <p className="text-xl text-teal-800 max-w-2xl mx-auto mt-5 leading-relaxed">Built for engineering correctness, speed, and reliability. No flashy fluff, just robust lead logistics.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-white p-8 rounded-3xl shadow-xl border border-teal-100 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-teal-200 flex flex-col section-scroll-animate"
              >
                <div className="bg-teal-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-teal-100 group-hover:bg-teal-600 transition-colors duration-300 shadow-inner">
                  <feature.icon className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-teal-950 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-teal-800 leading-relaxed text-base flex-grow">{feature.desc}</p>
                <div className='w-full h-1 bg-teal-100 mt-6 rounded-full overflow-hidden'>
                  <div className='w-0 h-full bg-teal-500 group-hover:w-full transition-all duration-500' />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* High-Quality Image / CTA Section */}
      <section className="py-20 px-4 relative z-10 overflow-hidden section-scroll-animate">
        <motion.div
          className="max-w-7xl mx-auto bg-teal-950 rounded-3xl p-12 md:p-20 shadow-2xl flex flex-col md:flex-row items-center gap-12 text-white border border-teal-800 relative"
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          <div className='absolute inset-0 opacity-10'>
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070" alt="background hardware" className='object-cover w-full h-full' />
          </div>
          <div className="flex-1 space-y-6 relative z-10">
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">Ready to Audit our Distribution Logic?</h3>
            <p className="text-xl text-teal-200 max-w-2xl leading-relaxed">
              The dashboard provides a live feed of lead assignments, concurrent connection status via SSE, and provider quota usage. Test the round-robin and business rule complexity in real-time.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/dashboard" className="bg-white text-teal-950 text-lg font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-teal-50 transition transform hover:-translate-y-1 flex items-center gap-2">
                View Live Dashboard <Zap className='w-4 h-4 text-teal-600' />
              </Link>
              <Link href="/test-tools" className="bg-teal-800 text-teal-100 border border-teal-700 text-lg font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-teal-900 transition flex items-center gap-2">
                API Test Tools <BotMessageSquare className='w-5 h-5' />
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0 relative z-10 w-full md:w-auto flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800"
              alt="Data Analytics Dashboard"
              className="w-full max-w-[400px] h-auto md:h-[300px] rounded-2xl shadow-2xl border-4 border-teal-700 object-cover aspect-video md:aspect-auto transition-transform duration-500 hover:rotate-2 hover:scale-105"
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
}