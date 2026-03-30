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
    <div className="flex flex-col h-[500px] md:h-[600px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-display text-xl md:text-2xl tracking-wide">AI Growth Coach</h3>
            <p className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-widest">Powered by Claude</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide md:max-h-[420px]"
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
              className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-white/40"
              }`}>
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-3xl font-sans text-sm leading-relaxed ${
                msg.role === "user" 
                  ? "bg-purple-500 text-white rounded-br-none" 
                  : "bg-white/10 text-white/90 rounded-bl-none"
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 text-white/40 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white/10 p-4 rounded-3xl rounded-bl-none flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-6 py-2 focus-within:border-accent/40 transition-colors">
          <input
            id="coach-message"
            name="coach-message"
            type="text"
            placeholder="Ask your coach anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            className="flex-1 bg-transparent py-2 grow outline-none font-sans text-sm"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
