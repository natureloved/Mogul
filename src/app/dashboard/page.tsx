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
import { ArrowRight, Zap, Loader2, Target, Share2, LogOut, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [mint, setMint] = useState("");
  const [activeTab, setActiveTab] = useState("Stats");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [analysis, setAnalysis] = useState<{ mint: string; data: any } | null>(null);
  const [insight, setInsight] = useState<string | null>(null);

  // Set mount flag and load from storage
  useEffect(() => {
    setIsClient(true);
    const saved = sessionStorage.getItem("mogul_mint");
    if (saved) {
      setAnalysis({ mint: saved, data: null });
      // Fetch insight if we have a saved mint
      fetch(`/api/dashboard-insight?mint=${saved}`)
        .then(r => r.json())
        .then(d => { if (d.success) setInsight(d.insight); })
        .catch(err => console.error("Failed to load saved insight:", err));
    }
  }, []);

  if (!ready || !isClient) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#14F195] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 p-12 border border-white/10 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem]">
          <div className="w-16 h-16 bg-[#14F195] rounded-2xl mx-auto flex items-center justify-center text-black text-4xl font-bold shadow-[0_0_30px_rgba(20,241,149,0.2)]">
            M
          </div>
          <h2 className="text-5xl font-bold tracking-tight text-white">Access Dashboard</h2>
          <p className="text-white/50 text-lg">
            Connect your wallet to start tracking your Bags.fm token intelligence.
          </p>
          <button
            onClick={login}
            className="w-full bg-[#14F195] text-black py-4 rounded-full font-bold text-xl hover:shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all flex items-center justify-center gap-2"
          >
            Connect Wallet <ArrowRight size={20} />
          </button>
        </div>
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
    if (!cleanMint || isAnalyzing) return;

    setErrorMsg("");
    setIsAnalyzing(true);

    try {
      console.log("Analyzing mint:", cleanMint);
      const res = await fetch(`/api/token-stats?mint=${cleanMint}`);
      const data = await res.json();
      console.log("Analysis Result Received:", data);

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Token not found on Bags.fm.");
        setAnalysis(null);
        setInsight(null);
        setIsAnalyzing(false);
        return;
      }

      // Fetch AI Insight separately but don't block the main dashboard load
      fetch(`/api/dashboard-insight?mint=${cleanMint}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            setInsight(d.insight);
            console.log("AI Insight loaded for:", cleanMint);
          }
        })
        .catch(err => console.error("Insight fetch failed:", err));

      sessionStorage.setItem("mogul_mint", cleanMint);
      setAnalysis({ mint: cleanMint, data: data.data });
      setIsAnalyzing(false);
      console.log("Dashboard state updated for:", cleanMint);

    } catch (err) {
      console.error("Analysis failed:", err);
      setErrorMsg("Network error. Check connection.");
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
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-4 py-4 md:px-12 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold hover:text-[#14F195] transition-colors flex items-center gap-2 text-white">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-[#14F195] text-black flex items-center justify-center text-[10px] md:text-xs font-bold">M</div>
            Mogul
          </Link>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden min-[450px]:flex items-center gap-2 px-2 py-1 md:px-3 md:py-1.5 bg-white/5 border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
              <span className="font-mono text-[9px] md:text-[10px] text-white underline decoration-[#14F195]/30">{identifier}</span>
            </div>
            <button onClick={logout} className="p-2 text-white/40 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
        <section className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Analyze Your Token</h2>
          <div className="flex flex-col sm:flex-row gap-2 p-1.5 border border-white/10 bg-black rounded-2xl focus-within:border-[#14F195]/40 transition-colors mb-4 mx-auto max-w-[90vw] sm:max-w-none">
            <input
              id="mint-address"
              type="text"
              placeholder="Paste Bags token mint address..."
              value={mint}
              onChange={(e) => setMint(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1 bg-transparent px-4 py-2 text-sm sm:text-lg outline-none placeholder-white/20 text-white"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !mint.trim()}
              className="bg-[#14F195] text-black px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-bold text-sm sm:text-lg hover:bg-[#10c977] transition-all flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {isAnalyzing ? <><Loader2 className="animate-spin" size={16} /> ANALYZING</> : <><Zap size={16} /> ANALYZE</>}
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
              <a href="https://bags.fm" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-[#14F195] hover:bg-[#14F195]/10 transition-all flex items-center gap-2">
                Find Tokens on Bags.fm <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {isAnalyzing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center flex-col gap-6">
              <div className="w-20 h-20 border-4 border-[#14F195]/20 border-t-[#14F195] rounded-full animate-spin" />
              <div className="text-xl font-bold tracking-[0.3em] animate-pulse text-white">SCANNING ONCHAIN DATA</div>
            </motion.div>
          )}
        </AnimatePresence>

        {analysis ? (
           <div className="space-y-8 animate-in fade-in duration-700">
             <div className="flex flex-wrap items-center justify-between gap-4">
               <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                 {["Stats", "AI Coach", "Content Gen", "Raid Mode"].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activeTab === tab ? "bg-[#14F195] text-black" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
                   >
                     {tab}
                   </button>
                 ))}
               </div>
               <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs text-white/50 hover:text-[#14F195]">
                 <Share2 size={12} /> {copied ? "Link copied! ✓" : "Share Score"}
               </button>
             </div>

             <ErrorBoundary>
               {activeTab === "Stats" && (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-8">
                     <div className="flex flex-col md:flex-row gap-8">
                       <GrowthScore tokenMint={analysis.mint} initialData={analysis.data} />
                       <div className="flex-1 space-y-6">
                         {/* AI Intelligence Brief */}
                         <div className="p-6 border border-[#14F195]/20 bg-[#14F195]/5 backdrop-blur-3xl rounded-[2rem] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                             <Zap size={40} className="text-[#14F195]" />
                           </div>
                           <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#14F195] mb-3 flex items-center gap-2">
                             <Sparkles size={12} /> AI Intelligence Brief
                           </h4>
                           {insight ? (
                             <p className="text-white/80 text-sm leading-relaxed font-sans italic">
                               "{insight}"
                             </p>
                           ) : (
                             <div className="flex items-center gap-3 py-2">
                               <div className="w-4 h-4 border-2 border-[#14F195] border-t-transparent rounded-full animate-spin" />
                               <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest animate-pulse">Generating sharp insight...</span>
                             </div>
                           )}
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <SentimentPulse score={analysis.data?.growthScore || 82} />
                           <BondingCurveHUD progress={64} />
                         </div>
                       </div>
                     </div>
                     <TokenStats tokenMint={analysis.mint} initialData={analysis.data} />
                   </div>
                   <div className="lg:col-span-1">
                     <WhaleTracker tokenMint={analysis.mint} />
                   </div>
                 </div>
               )}
               {activeTab === "AI Coach" && <AICoach tokenMint={analysis.mint} />}
               {activeTab === "Content Gen" && <ContentGenerator tokenMint={analysis.mint} />}
               {activeTab === "Raid Mode" && <AlphaRadar tokenMint={analysis.mint} />}
             </ErrorBoundary>
           </div>
        ) : !isAnalyzing && (
          <div className="py-20 text-center opacity-30">
            <h1 className="text-9xl font-bold text-white tracking-widest opacity-10">MOGUL</h1>
            <p className="text-xl italic text-white/50">Enter a mint address to load your command center</p>
          </div>
        )}
      </main>
    </div>
  );
}
