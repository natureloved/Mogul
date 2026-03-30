"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Layout, Megaphone, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-accent selection:text-black overflow-hidden relative font-sans">
      {/* Grid Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      >
      </div>

      {/* Dynamic Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] z-0 animate-pulse-glow pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px] z-0 animate-pulse-glow delay-1000 pointer-events-none"></div>

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl px-6 py-4 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black font-display text-xl group-hover:rotate-12 transition-transform">M</div>
            <h1 className="text-2xl font-display tracking-widest uppercase">Mogul</h1>
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-widest text-accent">
              Your AI CM
            </span>
          </div>
          <Link 
            href="/dashboard" 
            className="hidden md:flex items-center gap-2 bg-accent text-black px-4 py-1.5 rounded-full font-display text-lg hover:scale-105 hover:shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all"
          >
            Launch App <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-32 md:pt-40 md:pb-48 max-w-6xl mx-auto">
        {/* Status Pill */}
        <div className="animate-float mb-8 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">System Online: Analyzing Onchain Data</span>
        </div>

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-display leading-[0.9] tracking-tighter mb-10 text-balance uppercase"
          >
            THE <span className="text-accent italic text-glow">AI COACH</span> <br/>
            YOUR BAGS DESERVE
          </motion.h2>
        </motion.div>

        <p className="text-base md:text-lg font-sans text-white/50 mb-14 max-w-3xl leading-relaxed font-light">
          Mogul aggregates live intelligence from <span className="text-white italic">Bags.fm</span> to provide real-time advice, social content generation, and onchain growth tracking for your token.
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Link 
            href="/dashboard" 
            className="w-full md:w-auto bg-accent text-black px-8 py-3 rounded-full font-display text-xl hover:shadow-[0_0_40px_rgba(20,241,149,0.4)] hover:-translate-y-1 transition-all"
          >
            Start Analyzing
          </Link>
          <a 
            href="https://docs.bags.fm" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full md:w-auto border border-white/10 bg-white/5 backdrop-blur-md px-8 py-3 rounded-full font-display text-xl hover:bg-white/10 transition-all text-white/80"
          >
            Read Documentation
          </a>
        </div>
      </header>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-12 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {[
            { title: "Token Intelligence", icon: <BarChart3 className="text-accent" />, desc: "Real-time analytics on liquidity, volume, and holder dynamics for every mission." },
            { title: "AI Growth Coach", icon: <Bot className="text-accent" />, desc: "Personalized onchain strategy to scale your token's reach and impact." },
            { title: "Content Generator", icon: <Megaphone className="text-accent" />, desc: "Auto-generate viral social posts tailored to your token mission's vibe." },
            { title: "Holder Insights", icon: <Users className="text-accent" />, desc: "Deep analysis of who is holding and how they influence the price action." },
            { title: "Growth Score", icon: <Zap className="text-accent" />, desc: "Proprietary metric to track your token's overall health and growth potential." },
            { title: "Custom UI", icon: <Layout className="text-accent" />, desc: "Clean, bold dashboard designed for high-stakes token management." }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group glass-panel p-6 rounded-2xl hover:border-accent/40 hover:bg-white/[0.05] transition-all duration-500 cursor-default"
            >
              <div className="w-10 h-10 mb-4 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-display mb-2 group-hover:text-accent transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="font-sans text-white/40 leading-relaxed text-sm font-light">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-20 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="flex items-center gap-4">
             <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center text-accent font-display text-sm">M</div>
             <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/20">
               Mogul Intelligence &copy; 2026
             </p>
          </div>
          <div className="flex items-center gap-8">
             <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
               Powered by <span className="text-white/60">Claude AI</span> · <span className="text-accent/80">Solana Network</span>
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
