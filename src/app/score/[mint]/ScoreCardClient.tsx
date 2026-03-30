"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TokenIntelligence } from "@/lib/bags";
import { Share2, ExternalLink } from "lucide-react";

interface Props {
  mint: string;
  tokenData: TokenIntelligence | null;
  error: string | null;
}

function getScoreColor(score: number) {
  if (score >= 65) return { text: "#14F195", glow: "rgba(20,241,149,0.4)", label: "🔥 HOT TOKEN" };
  if (score >= 35) return { text: "#F59E0B", glow: "rgba(245,158,11,0.4)", label: "⚡ BUILDING" };
  return { text: "#94A3B8", glow: "rgba(148,163,184,0.3)", label: "🌱 EARLY STAGE" };
}

function AnimatedScore({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [target]);

  return <>{display}</>;
}

export default function ScoreCardClient({ mint, tokenData, error }: Props) {
  const [insight, setInsight] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const scoreCardUrl = typeof window !== "undefined" ? `${window.location.origin}/score/${mint}` : `/score/${mint}`;

  useEffect(() => {
    if (!tokenData) return;
    fetch(`/api/dashboard-insight?mint=${mint}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setInsight(d.insight); })
      .catch(() => {});
  }, [mint, tokenData]);

  const handleShare = async () => {
    await navigator.clipboard.writeText(scoreCardUrl).catch(() => {});
    const tweetText = encodeURIComponent(
      `My token just got its Mogul Score 🧠 ${tokenData?.growthScore ?? 0}/100 — built by @adejoke_btc on @BagsApp #BagsHackathon`
    );
    const tweetUrl = encodeURIComponent(scoreCardUrl);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, "_blank");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error || !tokenData) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="text-6xl font-display">MOGUL</div>
          <p className="font-mono text-white/40 text-sm">Token not found or invalid mint address.</p>
          <Link href="/" className="text-accent underline font-mono text-xs">← Return Home</Link>
        </div>
      </div>
    );
  }

  const { growthScore, totalFees, feeVelocity, claimEvents } = tokenData;
  const { text: scoreColor, glow: scoreGlow, label: statusLabel } = getScoreColor(growthScore);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${scoreGlow} 0%, transparent 70%)`,
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-xl bg-white/[0.03] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl">

        {/* Header */}
        <div className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-black font-display text-base">M</div>
            <span className="font-display text-xl tracking-widest">MOGUL</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 border border-white/10 px-3 py-1 rounded-full">
            TOKEN INTELLIGENCE REPORT
          </span>
        </div>

        {/* Score Hero */}
        <div className="flex flex-col items-center py-12 px-8">
          {/* Score circle */}
          <div className="relative mb-6">
            <div
              className="w-44 h-44 rounded-full border-4 flex items-center justify-center"
              style={{
                borderColor: scoreColor,
                boxShadow: `0 0 60px ${scoreGlow}, 0 0 120px ${scoreGlow}`,
              }}
            >
              <div className="text-center">
                <div
                  className="font-display leading-none"
                  style={{ fontSize: "4.5rem", color: scoreColor }}
                >
                  <AnimatedScore target={growthScore} />
                </div>
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">/100</div>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div
            className="px-5 py-2 rounded-full font-mono text-xs uppercase tracking-widest mb-10 border"
            style={{ color: scoreColor, borderColor: `${scoreColor}44`, backgroundColor: `${scoreColor}11` }}
          >
            {statusLabel}
          </div>

          {/* Stats row */}
          <div className="w-full grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Lifetime Fees", value: totalFees > 0 ? totalFees.toFixed(4) : "0.0000", unit: "SOL" },
              { label: "7-Day Velocity", value: feeVelocity > 0 ? feeVelocity.toFixed(4) : "0.0000", unit: "SOL" },
              { label: "Claim Events", value: claimEvents.length.toString(), unit: "total" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                <div className="font-mono text-lg text-white" style={{ fontFamily: "var(--font-jetbrains-mono, monospace)" }}>
                  {stat.value}
                </div>
                <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">{stat.unit}</div>
                <div className="font-mono text-[9px] text-white/20 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* AI Brief */}
          <div className="w-full p-5 bg-accent/5 border border-accent/10 rounded-2xl mb-8">
            <div className="font-mono text-[9px] uppercase tracking-widest text-accent/50 mb-2">AI Intelligence Brief</div>
            {insight ? (
              <p className="font-sans text-sm text-white/70 leading-relaxed">{insight}</p>
            ) : (
              <div className="flex items-center gap-2 text-white/30">
                <div className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin" />
                <span className="font-mono text-xs">Generating insight...</span>
              </div>
            )}
          </div>

          {/* Mint address */}
          <div className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl mb-6">
            <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-1">Token Mint</div>
            <div className="font-mono text-[11px] text-white/40 break-all">{mint}</div>
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 w-full justify-center bg-accent text-black py-3 rounded-full font-display text-lg hover:shadow-[0_0_20px_rgba(20,241,149,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Share2 size={16} />
            {copied ? "Link Copied! Opening X..." : "Share on X"}
          </button>

          <Link
            href="/dashboard"
            className="mt-4 flex items-center gap-1 font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest"
          >
            <ExternalLink size={10} /> Analyze another token on Mogul
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 px-8 py-4 text-center">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/20">
            Analyzed by Mogul · Built on Bags.fm · Powered by Claude
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
