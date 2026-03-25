"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw, Wand2 } from "lucide-react";

const STYLES = [
  { id: "hype", label: "🔥 Hype", color: "text-orange-400" },
  { id: "milestone", label: "🏆 Milestone", color: "text-yellow-400" },
  { id: "holders", label: "💎 Holders", color: "text-blue-400" },
  { id: "cta", label: "⚡ CTA", color: "text-accent" },
  { id: "update", label: "📊 Update", color: "text-purple-400" },
  { id: "raid", label: "💥 Raid", color: "text-red-500" },
];

export default function ContentGenerator({ tokenMint }: { tokenMint: string }) {
  const [style, setStyle] = useState("hype");
  const [context, setContext] = useState("");
  const [generatedPost, setGeneratedPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenMint, style, context }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedPost(data.post);
      } else {
        // Mock data for demonstration
        setTimeout(() => {
          if (style === "raid") {
            setGeneratedPost(
              `💥 RAID MISSION: $MOGUL is ascending! 🚀\n\n1️⃣ Like & RT our last post\n2️⃣ Reply with "LFG MOGULS"\n3️⃣ Tag 3 bags holders\n\nMISSION START NOW! 💎🙌\n\n#Solana #Bags #MogulRaid`
            );
          } else {
            setGeneratedPost(
              `🚀 Mogul ALERT: Our Bags token is seeing insane volume! Just hit a new growth score of 85. 📈\n\nLFG Moguls! 💎🙌\n\n#Solana #BagsApp #Mogul`
            );
          }
        }, 1200);
      }
    } catch (err) {
      console.error("Gen error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = generatedPost.length;
  const charColor = charCount >= 260 ? "text-red-500" : charCount >= 220 ? "text-yellow-500" : "text-white/40";

  return (
    <div className="p-10 border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
            <Wand2 size={24} />
          </div>
          <h3 className="text-4xl font-display">Content Gen</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`px-4 py-2 rounded-xl border text-sm font-sans transition-all ${
                style === s.id 
                  ? "bg-white/10 border-white/20 text-white shadow-lg" 
                  : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10"
              }`}
            >
              <span className={s.color}>{s.label.split(' ')[0]}</span> {s.label.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">
            Extra Context (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 'Just hit 500 holders' or 'New partnership announced'"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 transition-colors font-sans text-sm"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-accent text-black py-4 rounded-2xl font-display text-2xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_20px_rgba(20,241,149,0.2)]"
        >
          {loading ? <RefreshCw className="animate-spin" /> : <Wand2 size={20} />}
          {loading ? "Generating..." : "Generate Viral Post"}
        </button>

        {generatedPost && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative p-8 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl">
                <textarea
                  value={generatedPost}
                  onChange={(e) => setGeneratedPost(e.target.value)}
                  className="w-full bg-transparent border-none outline-none resize-none font-sans text-lg leading-relaxed mb-6 h-32"
                />
                <div className="flex items-center justify-between">
                  <div className={`font-mono text-xs ${charColor}`}>
                    {charCount} / 280 chars
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleGenerate}
                      className="text-[10px] items-center gap-1 font-mono uppercase tracking-widest text-white/30 hover:text-accent transition-colors flex"
                    >
                      <RefreshCw size={10} /> Regenerate
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/10"
                    >
                      {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
                      <span className="text-xs font-mono uppercase tracking-widest">{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
