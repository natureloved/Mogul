"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import Link from "next/link";
import GrowthScore from "@/components/GrowthScore";
import TokenStats from "@/components/TokenStats";
import AICoach from "@/components/AICoach";
import ContentGenerator from "@/components/ContentGenerator";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function DashboardPage() {
  const { authenticated, login, logout, user } = usePrivy();
  const [mint, setMint] = useState("");
  const [submittedMint, setSubmittedMint] = useState("");
  const [activeTab, setActiveTab] = useState("Stats");

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 p-12 border border-white/10 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem]">
          <h2 className="text-5xl font-display tracking-tight">Access Dashboard</h2>
          <p className="font-sans text-white/50 text-lg">
            Connect your wallet to start tracking your Bags.fm token intelligence.
          </p>
          <button 
            onClick={login}
            className="w-full bg-accent text-black py-4 rounded-full font-display text-2xl hover:shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all"
          >
            Connect Wallet
          </button>
          <Link href="/" className="block text-white/30 font-mono text-xs uppercase tracking-widest hover:text-white transition-colors">
            ← Return Home
          </Link>
        </div>
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
    { name: "Sample 1", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" }, // USDC for testing
    { name: "Sample 2", address: "JUPyiHrh2jqEJEVgdCZiZbsEKfujBv245P1pHOxrY78" }, // JUP for testing
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-accent selection:text-black">
      {/* Dashboard Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4 md:px-12 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-display tracking-wider hover:text-accent transition-colors">
            Mogul
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span className="font-mono text-xs">{identifier}</span>
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

      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
        {/* Mint Input Section */}
        <section className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-display mb-6">Analyze Your Token</h2>
          <div className="flex flex-col sm:flex-row gap-4 p-2 border border-white/10 bg-white/5 rounded-[2rem] focus-within:border-accent/40 transition-colors mb-4">
            <input 
              type="text" 
              placeholder="Paste Bags token mint address..."
              value={mint}
              onChange={(e) => setMint(e.target.value)}
              className="flex-1 bg-transparent px-6 py-3 font-sans text-lg outline-none"
            />
            <button 
              onClick={handleAnalyze}
              className="bg-accent text-black px-10 py-3 rounded-[1.5rem] font-display text-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Analyze
            </button>
          </div>
          
          {/* Sample Mints */}
          <div className="flex flex-wrap items-center justify-center gap-3">
             <span className="font-mono text-[10px] uppercase tracking-widest text-white/20">Try these:</span>
             {sampleMints.map((s) => (
                <button
                  key={s.address}
                  onClick={() => { setMint(s.address); setSubmittedMint(s.address); }}
                  className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-mono text-white/40 hover:text-accent hover:border-accent/20 transition-all"
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

        {submittedMint ? (
          <div className="space-y-12">
            {/* Tabs */}
            <div className="flex gap-4 justify-center">
              {["Stats", "AI Coach", "Content Gen"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-full font-display text-xl transition-all ${
                    activeTab === tab 
                      ? "bg-accent text-black shadow-[0_0_15px_rgba(20,241,149,0.2)]" 
                      : "bg-white/5 text-white/40 hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ErrorBoundary>
                {activeTab === "Stats" && (
                  <div className="flex flex-col md:flex-row gap-8">
                    <GrowthScore tokenMint={submittedMint} />
                    <TokenStats tokenMint={submittedMint} />
                  </div>
                )}
                {activeTab === "AI Coach" && (
                  <AICoach tokenMint={submittedMint} />
                )}
                {activeTab === "Content Gen" && (
                  <ContentGenerator tokenMint={submittedMint} />
                )}
              </ErrorBoundary>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-white/20">
            <div className="text-6xl font-display mb-4 opacity-10">Waiting for data</div>
            <p className="font-sans italic">Enter a mint address above to generate your growth dashboard</p>
          </div>
        )}
      </main>
    </div>
  );
}
