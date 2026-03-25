"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function BondingCurveHUD({ progress }: { progress: number }) {
  // progress is 0-100 (how close to ascent)
  const data = [
    { value: progress },
    { value: 100 - progress },
  ];

  const COLORS = ["#14F195", "#1a1a1a"];

  return (
    <div className="p-8 glass-panel rounded-[3rem] relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-display mb-1 uppercase tracking-tighter">Bonding Curve</h3>
          <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase italic">Path to Ascent</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
          <TrendingUp size={20} />
        </div>
      </div>

      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-display leading-[0.8]"
          >
            {progress}%
          </motion.div>
          <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40 mt-2">Bonded</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 border-t border-white/5 pt-6">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-widest text-white/20 mb-1">Target</div>
          <div className="font-display text-xl">100 SOL</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[8px] uppercase tracking-widest text-white/20 mb-1">Status</div>
          <div className="font-display text-xl text-accent animate-pulse">Growing</div>
        </div>
      </div>

      <div className="absolute top-0 right-[-10px] w-20 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none group-hover:from-accent/10 transition-all"></div>
    </div>
  );
}
