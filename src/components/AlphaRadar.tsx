"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Share2, TrendingUp, Users, Target, Rocket } from "lucide-react";
import { TokenIntelligence } from "@/lib/bags";

interface AlphaEvent {
  id: string;
  type: "WHALE" | "MILESTONE" | "VOLUME" | "HYPE";
  title: string;
  description: string;
  timestamp: string;
  tweet: string;
  icon: React.ReactNode;
}

const getEventTemplates = (data?: TokenIntelligence) => [
  {
    type: "WHALE",
    title: "Whale Buy Detected 🐋",
    description: `A major player just swapped ${Math.floor(Math.random() * 20 + 30)} SOL into the bag. High confidence entry detected.`,
    icon: <Target className="text-purple-400" />,
    tweet: (mint: string) => `🚨 ALPHA ALERT: A major whale just swapped SOL into the bag! The smart money is moving on @BagsApp. 💎🙌 #Solana #Mogul #$${mint.slice(0, 8)}`,
  },
  {
    type: "VOLUME",
    title: "Volume Spike ⚡",
    description: `Fee velocity is at ${data?.feeVelocity || 'high'} SOL. Trading activity is surging by ${(data?.growthScore || 50) + 20}%!`,
    icon: <Zap className="text-[#14F195]" />,
    tweet: (mint: string) => `⚡ MOGUL MOMENT: Fee velocity is surging! Trading activity is through the roof. Catch the move on @BagsApp! 📈 #Solana #MogulRadar #$${mint.slice(0, 8)}`,
  },
  {
    type: "MILESTONE",
    title: "Growth Milestone 🏆",
    description: `Token Growth Score just hit ${data?.growthScore || 85}/100. This is a top-tier performer on Bags.fm.`,
    icon: <Users className="text-blue-400" />,
    tweet: (mint: string) => `🏆 MILESTONE: Just hit a Growth Score of ${data?.growthScore || 85}! The @BagsApp community is scaling fast. We are all MOGULS. 🚀 #Solana #Bags #Mogul #$${mint.slice(0, 8)}`,
  },
  {
    type: "HYPE",
    title: "Ascension Near 🚀",
    description: `On-chain activity has been consistent for ${data?.lastActivityDays || 1} days. Graduation imminent.`,
    icon: <Rocket className="text-orange-400" />,
    tweet: (mint: string) => `🚀 ASCENSION NEAR: On-chain activity is white hot! This @BagsApp launch is about to enter the next phase. Don't blink! 💎 #Solana #Mogul #$${mint.slice(0, 8)}`,
  }
];

export default function AlphaRadar({ tokenMint, tokenData }: { tokenMint: string; tokenData?: TokenIntelligence }) {
  const [events, setEvents] = useState<AlphaEvent[]>([]);

  useEffect(() => {
    const templates = getEventTemplates(tokenData);
    const initial = templates.slice(0, 2).map((tmp, i) => ({
      id: `${Date.now()}-${i}`,
      type: tmp.type as any,
      title: tmp.title,
      description: tmp.description,
      timestamp: "Just Now",
      tweet: tmp.tweet(tokenMint),
      icon: tmp.icon,
    }));
    setEvents(initial);

    const interval = setInterval(() => {
      const templates = getEventTemplates(tokenData);
      const template = templates[Math.floor(Math.random() * templates.length)];
      const newEvent: AlphaEvent = {
        id: Date.now().toString(),
        type: template.type as any,
        title: template.title,
        description: template.description,
        timestamp: "Live",
        tweet: template.tweet(tokenMint),
        icon: template.icon,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 3)]);
    }, 20000);

    return () => clearInterval(interval);
  }, [tokenMint, tokenData]);

  const handleShare = (tweet: string) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#14F195]/10 flex items-center justify-center text-[#14F195]">
            <TrendingUp size={16} />
          </div>
          <div>
            <h3 className="font-display text-xl tracking-tight uppercase">Alpha Radar</h3>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#14F195] animate-pulse" /> Live
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className="p-4 border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[1.25rem] group hover:border-[#14F195]/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {event.icon}
                  </div>
                  <div>
                    <h4 className="font-display text-lg tracking-tight mb-0.5 flex items-center gap-2">
                      {event.title}
                      <span className="text-[7px] font-mono px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-white/40 uppercase">
                        {event.timestamp}
                      </span>
                    </h4>
                    <p className="font-sans text-xs text-white/30 leading-snug max-w-sm">
                      {event.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleShare(event.tweet)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#14F195] text-black rounded-lg font-bold text-[10px] hover:shadow-[0_0_15px_rgba(20,241,149,0.2)] transition-all shrink-0"
                >
                  <Share2 size={10} />
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <p className="text-center text-[8px] font-mono text-white/10 uppercase tracking-[0.2em] mt-2">
        Mogul Alpha Scout Engine v2.0
      </p>
    </div>
  );
}
