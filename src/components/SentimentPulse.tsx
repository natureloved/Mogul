"use client";

import { motion } from "framer-motion";
import { Smile, Frown, Equal } from "lucide-react";

export default function SentimentPulse({ score }: { score: number }) {
  // score is 0-100
  const getColor = (s: number) => {
    if (s > 70) return "text-accent border-accent/20 bg-accent/5";
    if (s < 40) return "text-red-400 border-red-400/20 bg-red-400/5";
    return "text-yellow-400 border-yellow-400/20 bg-yellow-400/5";
  };

  const getEmoji = (s: number) => {
    if (s > 70) return <Smile size={24} />;
    if (s < 40) return <Frown size={24} />;
    return <Equal size={24} />;
  };

  const getLabel = (s: number) => {
    if (s > 70) return "Bullish Vibe";
    if (s < 40) return "Bearish Fear";
    return "Neutral Neutral";
  };

  return (
    <div className={`p-3 rounded-2xl border transition-all duration-500 ${getColor(score)} flex items-center justify-between relative overflow-hidden group hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/20 text-current">
          {getEmoji(score)}
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-tight leading-none mb-0.5">{getLabel(score)}</h4>
          <p className="font-mono text-[7px] tracking-widest opacity-50 uppercase">Sentiment Pulse</p>
        </div>
      </div>
      
      <div className="text-right shrink-0 z-10">
        <div className="text-xl font-display leading-[0.8] mb-0.5">{score}</div>
        <div className="font-mono text-[6px] uppercase tracking-widest opacity-30">Mogul Index</div>
      </div>

      <div className="absolute right-0 top-0 overflow-hidden h-full w-24 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
         <motion.div 
           animate={{ x: [0, -100, 0] }} 
           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           className="h-full w-[200%] bg-gradient-to-r from-transparent via-current to-transparent"
         />
      </div>
    </div>
  );
}
