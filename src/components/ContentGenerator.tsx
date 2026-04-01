"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw, Wand2 } from "lucide-react";
import { TokenIntelligence } from "@/lib/bags";

const STYLES = [
  { id: "hype", label: "🔥 Hype", color: "text-orange-400" },
  { id: "milestone", label: "🏆 Milestone", color: "text-yellow-400" },
  { id: "holders", label: "💎 Holders", color: "text-blue-400" },
  { id: "cta", label: "⚡ CTA", color: "text-accent" },
  { id: "update", label: "📊 Update", color: "text-purple-400" },
  { id: "raid", label: "💥 Raid", color: "text-red-500" },
];

export default function ContentGenerator({ tokenMint, tokenData }: { tokenMint: string; tokenData?: TokenIntelligence }) {
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
        const errData = await res.json().catch(() => ({}));
        setGeneratedPost(`⚠️ Generation Error: ${errData.error || "Unable to reach AI."}`);
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
    <div className="p-6 border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[2rem]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
            <Wand2 size={16} />
          </div>
          <h3 className="text-xl md:text-2xl font-display uppercase tracking-tight">Content Center</h3>
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
            id="content-context"
            name="content-context"
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
          className="w-full bg-accent text-black py-3 rounded-xl font-display text-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_15px_rgba(20,241,149,0.15)]"
        >
          {loading ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
          {loading ? "Analyzing Context..." : "Generate High-Impact Post"}
        </button>

        {generatedPost && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
              <div className="relative p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
                <textarea
                  value={generatedPost}
                  onChange={(e) => setGeneratedPost(e.target.value)}
                  className="w-full bg-transparent border-none outline-none resize-none font-sans text-sm leading-relaxed mb-4 h-28 text-white/90"
                />
                <div className="flex items-center justify-between">
                  <div className={`font-mono text-[9px] uppercase tracking-widest ${charColor}`}>
                    {charCount} / 280
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleGenerate}
                      className="text-[9px] items-center gap-1 font-mono uppercase tracking-widest text-white/20 hover:text-accent transition-colors flex"
                    >
                      <RefreshCw size={10} /> Regen
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/5"
                    >
                      {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
                      <span className="text-[10px] font-mono uppercase tracking-widest">{copied ? "Copied" : "Copy"}</span>
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
