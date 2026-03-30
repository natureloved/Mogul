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

const DEMO_MINT = "AWc8uws9nh7pYjFQ8FzxavmP8WTUPwmQZAvK2yAPBAGS";

export default function DashboardPage() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [mint, setMint] = useState(DEMO_MINT);
  const submittedMintRef = useRef(DEMO_MINT);
  const [submittedMint, setSubmittedMint] = useState(DEMO_MINT);
  const [activeTab, setActiveTab] = useState("Stats");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    if (!submittedMint) return;
    const url = `${window.location.origin}/score/${submittedMint}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    const tweetText = encodeURIComponent(`My token just got its Mogul Score 🧠 — AI-powered intelligence by Mogul on @BagsApp #BagsHackathon`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(url)}`, "_blank");
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Wait for Privy to initialize
  if (!ready) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const identifier = authenticated
    ? user?.wallet?.address
      ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
      : user?.email?.address ?? "ID: " + user?.id?.slice(0, 8)
    : null;

  const sampleMints = [
    { name: "Demo Token", address: DEMO_MINT },
    { name: "Sample 2", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
  ];

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

      submittedMintRef.current = cleanMint;
      setSubmittedMint(cleanMint);
      setIsAnalyzing(false);

    } catch (_err) {
      setErrorMsg("Network error. Try again.");
      setIsAnalyzing(false);
    }
  };

  const handleSampleClick = (address: string) => {
    setMint(address);
    submittedMintRef.current = address;
    setSubmittedMint(address);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-accent selection:text-black">
      {/* Dashboard Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4 md:px-12 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-display tracking-wider hover:text-accent transition-colors flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded bg-accent text-black flex items-center justify-center text-xs">
              M
            </div>
            Mogul
          </Link>
          <div className="flex items-center gap-6">
            {identifier ? (
              <>
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
              </>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest hover:bg-accent/20 transition-all"
              >
                Connect Wallet <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
        {/* Mint Input Section */}
        <section className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-display mb-8">Analyze Your Token</h2>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-[2.1rem] blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
            <div className="relative flex flex-col sm:flex-row gap-4 p-2 border border-white/10 bg-black rounded-[2rem] focus-within:border-accent/40 transition-colors mb-4 shadow-2xl">
              <input
                type="text"
                id="mint-address"
                name="mint-address"
                placeholder="Paste Bags token mint address..."
                value={mint}
                onChange={(e) => setMint(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                className="flex-1 bg-transparent px-6 py-3 font-sans text-lg outline-none"
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !mint.trim()}
                className="bg-accent text-black px-6 py-3 rounded-[1.2rem] font-display text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Zap size={16} className="fill-black" />
                )}
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-mono">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/20">
              Try these:
            </span>
            {sampleMints.map((s) => (
              <button
                key={s.address}
                onClick={() => handleSampleClick(s.address)}
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
              <div className="w-20 h-20 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              <div className="font-display text-4xl tracking-widest animate-pulse">
                ANALYZING ONCHAIN DATA
              </div>
              <p className="font-mono text-xs text-white/40">
                Aggregating Bags.fm intelligence...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard content */}
        {submittedMint && !isAnalyzing && (
          <motion.div
            key={submittedMint}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Tabs + Share */}
            <div className="flex flex-wrap gap-3 justify-center items-center">
              {["Stats", "AI Coach", "Content Gen", "Raid Mode"].map((tab) => (
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
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-accent hover:border-accent/30 transition-all font-mono text-[10px] uppercase tracking-widest relative"
              >
                <Share2 size={12} />
                {shareCopied ? "Link Copied!" : "Share Score Card"}
              </button>
            </div>

            {/* Tab Content */}
            <ErrorBoundary>
              {activeTab === "Stats" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        <GrowthScore tokenMint={submittedMint} />
                        <div className="flex-1 space-y-6">
                          <SentimentPulse score={82} />
                          <BondingCurveHUD progress={64} />
                        </div>
                      </div>
                      <TokenStats tokenMint={submittedMint} />
                    </div>
                    <div className="lg:col-span-1">
                      <WhaleTracker tokenMint={submittedMint} />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "AI Coach" && (
                <AICoach tokenMint={submittedMint} />
              )}
              {activeTab === "Content Gen" && (
                <ContentGenerator tokenMint={submittedMint} />
              )}
              {activeTab === "Raid Mode" && (
                <div className="p-12 rounded-[3rem] text-center max-w-2xl mx-auto border border-accent/20 bg-white/[0.02]">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-8 animate-pulse">
                    <Target size={40} />
                  </div>
                  <h3 className="text-5xl font-display mb-6 tracking-tighter">
                    Enter Raid Mode
                  </h3>
                  <p className="font-sans text-white/50 text-xl mb-10 leading-relaxed">
                    Generate high-intensity raid instructions and pre-written
                    posts for your community to blast on X.
                  </p>
                  <button
                    onClick={() => setActiveTab("Content Gen")}
                    className="bg-accent text-black px-12 py-4 rounded-full font-display text-2xl hover:shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all"
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
