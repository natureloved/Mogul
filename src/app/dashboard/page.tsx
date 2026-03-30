"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import GrowthScore from "@/components/GrowthScore";
import TokenStats from "@/components/TokenStats";
import AICoach from "@/components/AICoach";
import ContentGenerator from "@/components/ContentGenerator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SentimentPulse from "@/components/SentimentPulse";
import BondingCurveHUD from "@/components/BondingCurveHUD";
import WhaleTracker from "@/components/WhaleTracker";
import { ArrowRight, Zap, Loader2, Target, Share2 } from "lucide-react";

export default function DashboardPage() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [mint, setMint] = useState("");
  const [activeTab, setActiveTab] = useState("Stats");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  // Use ref as source of truth — immune to Fast Refresh wipes
  const mintRef = useRef("");
  const [displayMint, setDisplayMint] = useState("");

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#14F195] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 p-12 border border-white/10 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem]"
        >
          <div className="w-16 h-16 bg-[#14F195] rounded-2xl mx-auto flex items-center justify-center text-black text-4xl font-bold shadow-[0_0_30px_rgba(20,241,149,0.2)]">
            M
          </div>
          <h2 className="text-5xl font-bold tracking-tight">Access Dashboard</h2>
          <p className="text-white/50 text-lg">
            Connect your wallet to start tracking your Bags.fm token intelligence.
          </p>
          <button
            onClick={login}
            className="w-full bg-[#14F195] text-black py-4 rounded-full font-bold text-xl hover:shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all flex items-center justify-center gap-2"
          >
            Connect Wallet <ArrowRight size={20} />
          </button>
          <Link
            href="/"
            className="block text-white/30 text-xs uppercase tracking-widest hover:text-white transition-colors"
          >
            ← Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const identifier = user?.wallet?.address
    ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
    : user?.email?.address
    ? user.email.address
    : "Connected";

  const handleAnalyze = async () => {
    const cleanMint = mint.trim();
    if (!cleanMint) return;

    setErrorMsg("");
    setIsAnalyzing(true);

    try {
      const res = await fetch(`/api/token-stats?mint=${cleanMint}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Failed to fetch token data.");
        setIsAnalyzing(false);
        return;
      }

      // Write to ref first — survives any re-render
      mintRef.current = cleanMint;
      setDisplayMint(cleanMint);
      setIsAnalyzing(false);

    } catch (_err) {
      setErrorMsg("Network error. Check your connection.");
      setIsAnalyzing(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/score/${mintRef.current}`;
    await navigator.clipboard.writeText(url);
    const tweet = `https://twitter.com/intent/tweet?text=My%20token%20just%20got%20its%20Mogul%20Score%20%F0%9F%A7%A0%20%E2%80%94%20AI-powered%20intelligence%20by%20Mogul%20on%20%40BagsApp%20%23BagsHackathon&url=${encodeURIComponent(url)}`;
    window.open(tweet, "_blank");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeMint = mintRef.current || displayMint;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4 md:px-12 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:text-[#14F195] transition-colors flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#14F195] text-black flex items-center justify-center text-xs font-bold">M</div>
            Mogul
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
              <span className="font-mono text-[10px]">{identifier}</span>
            </div>
            <button
              onClick={logout}
              className="text-white/40 hover:text-red-400 text-xs uppercase tracking-widest transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
        {/* Mint Input */}
        <section className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold mb-8">Analyze Your Token</h2>
          <div className="flex flex-col sm:flex-row gap-3 p-2 border border-white/10 bg-black rounded-2xl focus-within:border-[#14F195]/40 transition-colors mb-4">
            <input
              type="text"
              placeholder="Paste Bags token mint address..."
              value={mint}
              onChange={(e) => setMint(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1 bg-transparent px-6 py-3 text-lg outline-none placeholder-white/20"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !mint.trim()}
              className="bg-[#14F195] text-black px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#10c977] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing
                ? <><Loader2 className="animate-spin" size={16} /> Analyzing...</>
                : <><Zap size={16} /> Analyze</>
              }
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-white/20">Try:</span>
            {[
              { name: "Sample 1", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
              { name: "Sample 2", address: "JUPyiHrh2jqEJEVgdCZiZbsEKfujBv245P1pHOxrY78" },
            ].map((s) => (
              <button
                key={s.address}
                onClick={() => {
                  setMint(s.address);
                  mintRef.current = s.address;
                  setDisplayMint(s.address);
                }}
                className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-mono text-white/40 hover:text-[#14F195] hover:border-[#14F195]/20 transition-all"
              >
                {s.name}
              </button>
            ))}
          </div>
        </section>

        {/* Loading overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center flex-col gap-6"
            >
              <div className="w-20 h-20 border-4 border-[#14F195]/20 border-t-[#14F195] rounded-full animate-spin" />
              <div className="text-lg font-bold tracking-widest animate-pulse">ANALYZING ONCHAIN DATA</div>
              <p className="text-xs text-white/40 font-mono">Aggregating Bags.fm intelligence...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!activeMint && !isAnalyzing && (
          <div className="py-20 text-center opacity-20">
            <div className="text-8xl font-bold mb-4">Mogul</div>
            <p className="italic text-xl">Enter a mint address above to generate your growth dashboard</p>
          </div>
        )}

        {/* Dashboard */}
        {activeMint && !isAnalyzing && (
          <motion.div
            key={activeMint}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Tabs + Share button */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                {["Stats", "AI Coach", "Content Gen", "Raid Mode"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-full font-bold text-sm transition-all border ${
                      activeTab === tab
                        ? "bg-[#14F195] text-black border-[#14F195]"
                        : "bg-white/5 text-white/40 border-transparent hover:bg-white/10"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Share Score Card button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs text-white/50 hover:text-[#14F195] hover:border-[#14F195]/30 transition-all"
              >
                <Share2 size={12} />
                {copied ? "Link copied! ✓" : "Share Score Card"}
              </button>
            </div>

            {/* Tab Content */}
            <ErrorBoundary>
              {activeTab === "Stats" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        <GrowthScore tokenMint={activeMint} />
                        <div className="flex-1 space-y-6">
                          <SentimentPulse score={82} />
                          <BondingCurveHUD progress={64} />
                        </div>
                      </div>
                      <TokenStats tokenMint={activeMint} />
                    </div>
                    <div className="lg:col-span-1">
                      <WhaleTracker tokenMint={activeMint} />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "AI Coach" && <AICoach tokenMint={activeMint} />}
              {activeTab === "Content Gen" && <ContentGenerator tokenMint={activeMint} />}
              {activeTab === "Raid Mode" && (
                <div className="p-12 rounded-3xl text-center max-w-2xl mx-auto border border-[#14F195]/20 bg-white/[0.02]">
                  <div className="w-20 h-20 rounded-full bg-[#14F195]/10 flex items-center justify-center text-[#14F195] mx-auto mb-8 animate-pulse">
                    <Target size={40} />
                  </div>
                  <h3 className="text-5xl font-bold mb-6">Enter Raid Mode</h3>
                  <p className="text-white/50 text-xl mb-10 leading-relaxed">
                    Generate high-intensity raid instructions and pre-written posts for your community to blast on X.
                  </p>
                  <button
                    onClick={() => setActiveTab("Content Gen")}
                    className="bg-[#14F195] text-black px-12 py-4 rounded-full font-bold text-xl hover:shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all"
                  >
                    Initialize Mission
                  </button>
                </div>
              )}
            </ErrorBoundary>
          </motion.div>
        )}
      </main>
    </div>
  );
}
