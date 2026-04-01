"use client";

import { useEffect, useRef, useState } from "react";
import { Send, User, Bot, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "What should I do to grow my token right now?",
  "How is my fee velocity trending?",
  "When is the best time to post about my token?",
  "How do I get more active traders?",
];

export default function AICoach({ tokenMint }: { tokenMint: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleSend = async (content: string) => {
    if (!content.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenMint,
          message: content,
          history: messages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { role: "assistant", content: data.advice }]);
      } else {
        // Mock reply if API not yet implemented
        setTimeout(() => {
          setMessages([...newMessages, { 
            role: "assistant", 
            content: "I'm currently looking at your fee velocity and holder psychology. To grow, you should engage your top 10 holders and leverage the recent spike in claim events to build social proof on X." 
          }]);
        }, 1500);
      }
    } catch (err) {
      console.error("Coach error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[450px] md:h-[500px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] overflow-hidden transition-all hover:border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 md:px-6 md:py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-display text-lg md:text-xl tracking-tight">Growth Coach</h3>
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Powered by Claude</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
              <Bot size={32} />
            </div>
            <div>
              <p className="font-display text-2xl mb-2 text-white/60">Ready to scale your token?</p>
              <p className="font-sans text-sm text-white/30">Select a prompt below to get started.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mx-auto">
              {STARTER_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="p-4 text-xs font-sans text-white/50 border border-white/5 bg-white/[0.03] rounded-2xl hover:border-accent/40 hover:text-white hover:bg-white/10 transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-accent/10 text-accent" : "bg-white/5 text-white/40"
              }`}>
                {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl font-sans text-xs md:text-sm leading-relaxed ${
                msg.role === "user" 
                  ? "bg-accent text-black rounded-tr-none" 
                  : "bg-white/5 text-white/80 rounded-tl-none border border-white/5"
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/5 text-white/40 flex items-center justify-center">
              <Bot size={14} />
            </div>
            <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 md:p-5 border-t border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-1.5 focus-within:border-accent/30 transition-colors">
          <input
            id="coach-message"
            name="coach-message"
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            className="flex-1 bg-transparent py-1.5 grow outline-none font-sans text-xs md:text-sm text-white/80"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl bg-accent text-black flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
