"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import GrowthScore from "@/components/GrowthScore";
import TokenStats from "@/components/TokenStats";
import AICoach from "@/components/AICoach";
import ContentGenerator from "@/components/ContentGenerator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ArrowRight, BarChart3, Bot, Layout, Megaphone, Zap, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { authenticated, login, logout, user } = usePrivy();
  const [mint, setMint] = useState("");
  const [submittedMint, setSubmittedMint] = useState("");
  const [activeTab, setActiveTab] = useState("Stats");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (submittedMint) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => setIsAnalyzing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [submittedMint]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 p-12 border border-white/10 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem]"
        >
          <div className="w-16 h-16 bg-accent rounded-2xl mx-auto flex items-center justify-center text-black font-display text-4xl shadow-[0_0_30px_rgba(20,241,149,0.2)]">M</div>
          <h2 className="text-5xl font-display tracking-tight">Access Dashboard</h2>
          <p className="font-sans text-white/50 text-lg">
            Connect your wallet to start tracking your Bags.fm token intelligence.
          </p>
          <button 
            onClick={login}
            className="w-full bg-accent text-black py-4 rounded-full font-display text-2xl hover:shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all flex items-center justify-center gap-2"
          >
            Connect Wallet <ArrowRight size={20} />
          </button>
          <Link href="/" className="block text-white/30 font-mono text-xs uppercase tracking-widest hover:text-white transition-colors">
            ← Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleAnalyze = () => {
    if (mint.trim()) {
      setSubmittedMint(mint.trim());
    }
  };

  const identifier = user?.wallet?.address 
    ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
    : user?.email?.address 
      ? user.email.address 
      : "ID: " + user?.id?.slice(0, 8);

  const sampleMints = [
    { name: "Sample 1", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
    { name: "Sample 2", address: "JUPyiHrh2jqEJEVgdCZiZbsEKfujBv245P1pHOxrY78" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-accent selection:text-black">
      {/* Live Pulse Ticker */}
      <div className="bg-accent/10 border-b border-accent/20 px-6 py-2 overflow-hidden sticky top-0 z-[60] backdrop-blur-md">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-accent uppercase font-bold pr-8 border-r border-accent/10">
              <Zap size={10} className="fill-accent" /> Live Pulse: New Mogul entry detected in Bag #{i * 123}
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4 md:px-12 sticky top-[40px] z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-display tracking-wider hover:text-accent transition-colors flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent text-black flex items-center justify-center text-xs">M</div>
            Mogul
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
              <span className="font-mono text-[10px]">{identifier}</span>
            </div>
            <button 
              onClick={logout}
              className="text-white/40 hover:text-red-400 font-mono text-[10px] uppercase tracking-widest transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-12 md:px-12"
      >
        {/* Mint Input Section */}
        <section className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-display mb-8">Analyze Your Token</h2>
          <div className="flex flex-col sm:flex-row gap-4 p-2 border border-white/10 bg-white/5 rounded-[2rem] focus-within:border-accent/40 transition-colors mb-6 shadow-2xl">
            <input 
              type="text" 
              placeholder="Paste Bags token mint address..."
              value={mint}
              onChange={(e) => setMint(e.target.value)}
              className="flex-1 bg-transparent px-6 py-3 font-sans text-lg outline-none"
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-accent text-black px-12 py-3 rounded-[1.5rem] font-display text-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="fill-black" />}
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
             <span className="font-mono text-[10px] uppercase tracking-widest text-white/20">Try these:</span>
             {sampleMints.map((s) => (
                <button
                  key={s.address}
                  onClick={() => { setMint(s.address); setSubmittedMint(s.address); }}
                  className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-mono text-white/40 hover:text-accent hover:border-accent/20 transition-all hover:bg-accent/5"
                >
                  {s.name}
                </button>
             ))}
             <a 
               href="https://bags.fm" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-[10px] font-mono uppercase tracking-widest text-accent/60 hover:text-accent underline underline-offset-4"
             >
               Find Mints on Bags.fm →
             </a>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {submittedMint ? (
            <motion.div 
              key={submittedMint}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Tabs */}
              <div className="flex gap-3 justify-center">
                {["Stats", "AI Coach", "Content Gen"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-full font-display text-lg transition-all border ${
                      activeTab === tab 
                        ? "bg-accent text-black border-accent shadow-[0_0_15px_rgba(20,241,149,0.2)]" 
                        : "bg-white/5 text-white/40 border-transparent hover:bg-white/10"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="relative">
                <ErrorBoundary>
                  {activeTab === "Stats" && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row gap-8">
                      <GrowthScore tokenMint={submittedMint} />
                      <TokenStats tokenMint={submittedMint} />
                    </motion.div>
                  )}
                  {activeTab === "AI Coach" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <AICoach tokenMint={submittedMint} />
                    </motion.div>
                  )}
                  {activeTab === "Content Gen" && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <ContentGenerator tokenMint={submittedMint} />
                    </motion.div>
                  )}
                </ErrorBoundary>
              </div>
            </motion.div>
          ) : (
            <div className="py-20 text-center text-white/20 grayscale opacity-20">
              <div className="text-8xl font-display mb-4">Mogul</div>
              <p className="font-sans italic text-xl">Enter a mint address above to generate your growth dashboard</p>
            </div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
