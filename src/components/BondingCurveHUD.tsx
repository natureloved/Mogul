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
    <div className="p-4 border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[1.5rem] relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display mb-0.5 uppercase tracking-tight leading-none text-white/80">Bonding Curve</h3>
          <p className="font-mono text-[7px] text-white/20 tracking-widest uppercase italic">Path to Ascent</p>
        </div>
        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
          <TrendingUp size={14} />
        </div>
      </div>

      <div className="h-28 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={50}
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
        
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-display leading-[0.8] text-white"
          >
            {progress}%
          </motion.div>
          <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/20 mt-1">Bonded</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 border-t border-white/5 pt-4">
        <div>
          <div className="font-mono text-[7px] uppercase tracking-widest text-white/20 mb-0.5">Target</div>
          <div className="font-display text-base">100 SOL</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[7px] uppercase tracking-widest text-white/20 mb-0.5">Status</div>
          <div className="font-display text-base text-accent animate-pulse">Growing</div>
        </div>
      </div>
    </div>
  );
}
