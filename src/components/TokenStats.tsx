"use client";

import { useEffect, useState } from "react";

interface TokenStatsData {
  lifetimeFees: number;
  claimableNow: number;
  feeVelocity7d: number;
  totalClaimEvents: number;
  creatorName: string;
  royaltyPercentage: number;
}

export default function TokenStats({ tokenMint }: { tokenMint: string }) {
  const [stats, setStats] = useState<TokenStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/token-stats?mint=${tokenMint}`);
        const result = await res.json();
        
        if (res.ok && result.success && result.data) {
          const statsData = result.data;
          setStats({
            lifetimeFees: statsData.totalFees || 0,
            claimableNow: statsData.claimableNow || 0,
            feeVelocity7d: statsData.feeVelocity || 0,
            totalClaimEvents: statsData.claimEvents?.length || 0,
            creatorName: statsData.creators?.[0]?.name || "Creator",
            royaltyPercentage: statsData.creators?.[0]?.royalty || 5,
          });
        } else {
          // Mock data for demonstration if API isn't live
          setStats({
            lifetimeFees: 42.5,
            claimableNow: 3.2,
            feeVelocity7d: 1.8,
            totalClaimEvents: 156,
            creatorName: "SolanaMogul",
            royaltyPercentage: 2.5,
          });
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [tokenMint]);

  if (loading) {
    return (
      <div className="flex-1 p-6 md:p-8 border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded-lg mb-8"></div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-12 bg-white/5 rounded-2xl w-full"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex-1 p-6 md:p-8 border border-red-500/20 bg-red-500/5 backdrop-blur-3xl rounded-[2.5rem] flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-2xl font-display mb-2">Error Loading Stats</h3>
        <p className="text-white/40 font-sans text-sm">Could not retrieve onchain intelligence for this mint.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest hover:bg-white/5 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const StatCard = ({ label, value, unit, accented = false }: { label: string, value: string | number, unit: string, accented?: boolean }) => (
    <div className="p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-white/10 transition-colors">
      <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-2xl md:text-3xl font-bold tracking-tighter ${accented ? 'text-accent' : 'text-white'}`}>
          {value}
        </span>
        <span className="font-mono text-[9px] md:text-[10px] text-white/20 uppercase tracking-widest">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-6 md:p-8 border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem]">
      <h3 className="text-2xl md:text-3xl font-display mb-6 md:mb-8 text-white/80 uppercase tracking-wider">Token Intelligence</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard 
          label="Lifetime Fees" 
          value={stats.lifetimeFees.toFixed(2)} 
          unit="SOL" 
          accented={true} 
        />
        <StatCard 
          label="Claimable Now" 
          value={stats.claimableNow.toFixed(2)} 
          unit="SOL" 
        />
        <StatCard 
          label="7D Fee Velocity" 
          value={stats.feeVelocity7d.toFixed(2)} 
          unit="SOL/Day" 
        />
        <StatCard 
          label="Total Claims" 
          value={stats.totalClaimEvents} 
          unit="Events" 
        />
      </div>

      <div className="p-5 md:p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-mono text-sm md:text-lg">
            {stats.creatorName[0].toUpperCase()}
          </div>
          <div>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-white/30">Creator</p>
            <p className="font-sans font-medium text-sm md:text-base">@{stats.creatorName}</p>
          </div>
        </div>
        <div className="text-center sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
          <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-white/30">Royalty Rate</p>
          <p className="font-mono text-lg md:text-xl text-white/80">{stats.royaltyPercentage}%</p>
        </div>
      </div>
    </div>
  );
}
