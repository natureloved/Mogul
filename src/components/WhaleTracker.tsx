"use client";

import { motion } from "framer-motion";
import { Anchor, ArrowDownRight, ArrowUpRight, Clock } from "lucide-react";

export default function WhaleTracker({ tokenMint }: { tokenMint: string }) {
  const transactions = [
    { type: "buy", amount: "5.2 SOL", time: "2m ago", address: "Gv6...x9P", value: "$840" },
    { type: "sell", amount: "12.0 SOL", time: "5m ago", address: "8kN...2fA", value: "$1,920" },
    { type: "buy", amount: "8.5 SOL", time: "12m ago", address: "3jQ...r4L", value: "$3,360" },
    { type: "buy", amount: "15.0 SOL", time: "18m ago", address: "9aW...u8Y", value: "$2,400" },
  ];

  return (
    <div className="p-5 md:p-6 border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] h-full overflow-hidden flex flex-col transition-all hover:border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <Anchor size={16} />
          </div>
          <div>
            <h3 className="text-xl font-display uppercase tracking-wider">Whale Tracker</h3>
            <p className="font-mono text-[7px] text-white/20 tracking-[0.2em] uppercase italic leading-none">Recent Activity</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 no-scrollbar">
        {transactions.map((tx, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'buy' ? 'bg-accent/10 text-accent' : 'bg-red-400/10 text-red-400'}`}>
                {tx.type === 'buy' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
              <div>
                <div className="font-display text-base leading-none mb-0.5">{tx.amount}</div>
                <div className="font-mono text-[7px] text-white/20 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={8} /> {tx.time} · {tx.address}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-sm leading-none mb-0.5">{tx.value}</div>
              <div className={`font-mono text-[7px] uppercase tracking-widest ${tx.type === 'buy' ? 'text-accent' : 'text-red-400'}`}>
                {tx.type === 'buy' ? 'ENTRY' : 'EXIT'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
            <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/20">Live Feed</span>
         </div>
         <button className="text-[7px] font-mono uppercase tracking-[0.2em] text-accent/60 hover:text-accent transition-colors">Details →</button>
      </div>
    </div>
  );
}
