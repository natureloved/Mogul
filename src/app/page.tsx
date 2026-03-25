import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-accent selection:text-black overflow-hidden relative">
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      >
      </div>

      {/* Radial Glow behind Hero */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-accent/20 rounded-full blur-[140px] z-0 pointer-events-none"></div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-8 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-display tracking-wider">Mogul</h1>
          <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-widest text-accent">
            Bags Hackathon
          </span>
        </div>
        <Link 
          href="/dashboard" 
          className="hidden md:block bg-accent text-black px-6 py-2 rounded-full font-display text-xl hover:scale-105 transition-transform"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero */}
      <header className="relative z-10 flex flex-col items-center text-center px-6 py-20 md:py-32 max-w-5xl mx-auto">
        <h2 className="text-6xl md:text-9xl font-display leading-[0.9] mb-8">
          THE <span className="text-accent underline decoration-4 underline-offset-[12px]">AI COACH</span> <br/>
          YOUR BAGS TOKEN DESERVES
        </h2>
        <p className="text-lg md:text-2xl font-sans text-white/70 mb-12 max-w-2xl leading-relaxed">
          Connect your Bags.fm token and get live onchain intelligence, AI-powered growth advice, and social content — all in one dashboard.
        </p>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Link 
            href="/dashboard" 
            className="w-full md:w-auto bg-accent text-black px-12 py-5 rounded-full font-display text-2xl hover:shadow-[0_0_30px_rgba(20,241,149,0.3)] hover:-translate-y-1 transition-all"
          >
            Start for Free
          </Link>
          <a 
            href="https://docs.bags.fm" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full md:w-auto border border-white/10 bg-white/5 backdrop-blur-md px-12 py-5 rounded-full font-display text-2xl hover:bg-white/10 transition-all"
          >
            View Docs
          </a>
        </div>
      </header>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-20 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: "Token Intelligence", desc: "Real-time analytics on liquidity, volume, and holder dynamics." },
            { title: "AI Growth Coach", desc: "Personalized advice to scale your token's reach and impact." },
            { title: "Content Generator", desc: "Auto-generate viral social posts tailored to your token mission." },
            { title: "Holder Insights", desc: "Deep analysis of who is holding and how they influence the price." },
            { title: "Growth Score", desc: "Proprietary metric to track your token's overall health and potential." },
            { title: "Fee Tracker", desc: "Monitor creator rewards and protocol fees in one clear view." }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group p-10 border border-white/5 bg-white/[0.02] backdrop-blur-2xl rounded-[2.5rem] hover:border-accent/30 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-12 h-12 mb-6 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-mono text-xl group-hover:scale-110 transition-transform">
                0{i + 1}
              </div>
              <h3 className="text-3xl font-display mb-4 group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              <p className="font-sans text-white/40 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/20">
          Built for the <span className="text-white/50">Bags Hackathon</span> · Powered by <span className="text-white/50">Claude AI</span> · <span className="text-accent/80 whitespace-nowrap">Solana Network</span>
        </p>
      </footer>
    </div>
  );
}
