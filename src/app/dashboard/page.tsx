"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useRef, useEffect } from "react";
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
import AlphaRadar from "@/components/AlphaRadar";
import { ArrowRight, Zap, Loader2, Target, Share2, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [mint, setMint] = useState("");
  const [activeTab, setActiveTab] = useState("Stats");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const [analysis, setAnalysis] = useState<{ mint: string; data: any } | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("mogul_mint");
    if (saved) {
      setAnalysis({ mint: saved, data: null });
    }
  }, []);

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
      console.log("Analyzing mint:", cleanMint);
      const res = await fetch(`/api/token-stats?mint=${cleanMint}`);
      const data = await res.json();
      console.log("Analysis Result:", data);

      if (!res.ok || !data.success) {
        console.error("Analysis Error:", data.error);
        setErrorMsg(data.error || "Token not found or API error.");
        setIsAnalyzing(false);
        return;
      }

      // Store in sessionStorage — survives Fast Refresh completely
      sessionStorage.setItem("mogul_mint", cleanMint);
      setAnalysis({ mint: cleanMint, data: data.data });
      setIsAnalyzing(false); // Close loader last
      console.log("State updated: Analysis ready.");

    } catch (err) {
      console.error("Fatal Analysis Error:", err);
      setErrorMsg("Network error. Check your connection.");
      setIsAnalyzing(false);
    }
  };

  const handleShare = async () => {
    if (!analysis) return;
    const url = `${window.location.origin}/score/${analysis.mint}`;
    await navigator.clipboard.writeText(url);
    const tweet = `https://twitter.com/intent/tweet?text=My%20token%20just%20got%20its%20Mogul%20Score%20%F0%9F%A7%A0%20%E2%80%94%20AI-powered%20intelligence%20by%20Mogul%20on%20%40BagsApp%20%23BagsHackathon&url=${encodeURIComponent(url)}`;
    window.open(tweet, "_blank");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-4 py-4 md:px-12 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold hover:text-[#14F195] transition-colors flex items-center gap-2">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-[#14F195] text-black flex items-center justify-center text-[10px] md:text-xs font-bold">M</div>
            Mogul
          </Link>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden min-[450px]:flex items-center gap-2 px-2 py-1 md:px-3 md:py-1.5 bg-white/5 border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
              <span className="font-mono text-[9px] md:text-[10px]">{identifier}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-white/40 hover:text-red-400 transition-colors"
              title="Disconnect"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
        {/* Mint Input */}
        <section className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold mb-8">Analyze Your Token</h2>
          <div className="flex flex-col sm:flex-row gap-2 p-1.5 border border-white/10 bg-black rounded-2xl focus-within:border-[#14F195]/40 transition-colors mb-4 mx-auto max-w-[90vw] sm:max-w-none">
            <input
              id="mint-address"
              name="mint-address"
              type="text"
              placeholder="Paste Bags token mint address..."
              value={mint}
              onChange={(e) => setMint(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1 bg-transparent px-4 py-2 text-sm sm:text-lg outline-none placeholder-white/20 min-w-0"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !mint.trim()}
              className="bg-[#14F195] text-black px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-bold text-sm sm:text-lg hover:bg-[#10c977] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-white/20">Discovery:</span>
              <a 
                href="https://bags.fm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-[#14F195] hover:bg-[#14F195]/10 transition-all flex items-center gap-2"
              >
                Find Real Tokens on Bags.fm <ArrowRight size={14} />
              </a>
            </div>
            <p className="text-[10px] text-white/20 font-mono italic max-w-sm">
              Note: Mogul provides simulated intelligence for non-Bags tokens (like USDC) to support your demos.
            </p>
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

        {/* Empty state - Only show if no analysis AND not currently loading */}
        {!analysis && !isAnalyzing && (
          <div className="py-20 text-center opacity-20">
            <div className="text-8xl font-bold mb-4">Mogul</div>
            <p className="italic text-xl">Enter a mint address above to generate your growth dashboard</p>
          </div>
        )}

        {/* Dashboard - Render as soon as analysis exists, loader will handle overlay */}
        {analysis && (
          <motion.div
            key={analysis.mint}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Tabs + Share button */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-row overflow-x-auto sm:flex-wrap gap-2 sm:gap-3 pb-2 sm:pb-0 no-scrollbar">
                {["Stats", "AI Coach", "Content Gen", "Raid Mode"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all border whitespace-nowrap ${
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
                        <GrowthScore tokenMint={analysis.mint} initialData={analysis.data} />
                        <div className="flex-1 space-y-6">
                          <SentimentPulse score={analysis.data?.growthScore || 82} />
                          <BondingCurveHUD progress={64} />
                        </div>
                      </div>
                      <TokenStats tokenMint={analysis.mint} initialData={analysis.data} />
                    </div>
                    <div className="lg:col-span-1">
                      <WhaleTracker tokenMint={analysis.mint} />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "AI Coach" && <AICoach tokenMint={analysis.mint} />}
              {activeTab === "Content Gen" && <ContentGenerator tokenMint={analysis.mint} />}
              {activeTab === "Raid Mode" && <AlphaRadar tokenMint={analysis.mint} />}
            </ErrorBoundary>
          </motion.div>
        )}
      </main>
    </div>
  );
}
