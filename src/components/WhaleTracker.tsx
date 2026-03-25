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
    <div className="p-8 glass-panel rounded-[3rem] h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
            <Anchor size={20} />
          </div>
          <div>
            <h3 className="text-3xl font-display uppercase tracking-tighter">Whale Tracker</h3>
            <p className="font-mono text-[8px] text-white/40 tracking-widest uppercase italic">Recent Large Txns</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {transactions.map((tx, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'buy' ? 'bg-accent/10 text-accent' : 'bg-red-400/10 text-red-400'}`}>
                {tx.type === 'buy' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
              <div>
                <div className="font-display text-lg leading-none mb-1">{tx.amount}</div>
                <div className="font-mono text-[8px] text-white/30 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={8} /> {tx.time} · {tx.address}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-md">{tx.value}</div>
              <div className={`font-mono text-[8px] uppercase tracking-widest ${tx.type === 'buy' ? 'text-accent' : 'text-red-400'}`}>
                {tx.type === 'buy' ? 'ENTRY' : 'EXIT'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">Monitoring Webhooks</span>
         </div>
         <button className="text-[8px] font-mono uppercase tracking-widest text-accent hover:underline">View All →</button>
      </div>
    </div>
  );
}
