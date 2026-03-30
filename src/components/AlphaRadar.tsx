"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Share2, TrendingUp, Users, Target, Rocket } from "lucide-react";

interface AlphaEvent {
  id: string;
  type: "WHALE" | "MILESTONE" | "VOLUME" | "HYPE";
  title: string;
  description: string;
  timestamp: string;
  tweet: string;
  icon: React.ReactNode;
}

const EVENT_TEMPLATES = [
  {
    type: "WHALE",
    title: "Whale Buy Detected 🐋",
    description: "A major player just swapped 45 SOL into the bag. High confidence entry.",
    icon: <Target className="text-purple-400" />,
    tweet: (mint: string) => `🚨 ALPHA ALERT: A major whale just swapped 45 SOL into the bag! The smart money is moving on @BagsApp. 💎🙌 %23Solana %23BagsHackathon %23Mogul %23${mint.slice(0, 8)}`,
  },
  {
    type: "VOLUME",
    title: "Volume Spike ⚡",
    description: "Fee velocity increased by 300% in the last hour. Trading activity is surging.",
    icon: <Zap className="text-[#14F195]" />,
    tweet: (mint: string) => `⚡ MOGUL MOMENT: Fee velocity just spiked 300%! Trading activity is through the roof. Catch the move on @BagsApp! 📈 %23Solana %23MogulRadar %23${mint.slice(0, 8)}`,
  },
  {
    type: "MILESTONE",
    title: "Holder Milestone 🏆",
    description: "Your token just crossed 1,500 unique holders. The community is scaling fast.",
    icon: <Users className="text-blue-400" />,
    tweet: (mint: string) => `🏆 MILESTONE: Just crossed 1,500 unique holders! The @BagsApp community is scaling fast. We are all MOGULS. 🚀 %23Solana %23Bags %23Mogul %23${mint.slice(0, 8)}`,
  },
  {
    type: "HYPE",
    title: "Ascension Near 🚀",
    description: "Bonding curve is 95% complete. This token is about to graduate to the next stage.",
    icon: <Rocket className="text-orange-400" />,
    tweet: (mint: string) => `🚀 ASCENSION NEAR: The bonding curve is 95% complete! This @BagsApp launch is about to enter the next phase. Don't blink! 💎 %23Solana %23BagsHackathon %23Mogul %23${mint.slice(0, 8)}`,
  }
];

export default function AlphaRadar({ tokenMint }: { tokenMint: string }) {
  const [events, setEvents] = useState<AlphaEvent[]>([]);

  // Simulation: Add a new event every 20-30 seconds
  useEffect(() => {
    // Initial events
    const initial = EVENT_TEMPLATES.slice(0, 2).map((tmp, i) => ({
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
      const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      const newEvent: AlphaEvent = {
        id: Date.now().toString(),
        type: template.type as any,
        title: template.title,
        description: template.description,
        timestamp: "Live",
        tweet: template.tweet(tokenMint),
        icon: template.icon,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 4)]);
    }, 25000);

    return () => clearInterval(interval);
  }, [tokenMint]);

  const handleShare = (tweet: string) => {
    const url = `https://twitter.com/intent/tweet?text=${tweet}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#14F195]/10 flex items-center justify-center text-[#14F195]">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="font-display text-2xl tracking-wide uppercase">Alpha Radar</h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" /> Live Tracking
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
              className="p-6 border border-white/5 bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] group hover:border-[#14F195]/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {event.icon}
                  </div>
                  <div>
                    <h4 className="font-display text-xl tracking-wide mb-1 flex items-center gap-2">
                      {event.title}
                      <span className="text-[8px] font-mono p-1 bg-white/5 rounded border border-white/10 text-white/40 uppercase animate-pulse">
                        {event.timestamp}
                      </span>
                    </h4>
                    <p className="font-sans text-sm text-white/40 leading-relaxed max-w-md">
                      {event.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleShare(event.tweet)}
                  className="flex items-center gap-2 px-6 py-2 bg-[#14F195] text-black rounded-full font-bold text-xs hover:shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all shrink-0 mt-2"
                >
                  <Share2 size={12} />
                  Share Alpha
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <p className="text-center text-[10px] font-mono text-white/10 uppercase tracking-[0.3em] mt-4">
        Powered by Mogul Alpha Scout Engine
      </p>
    </div>
  );
}
