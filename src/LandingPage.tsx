import React, { useState } from 'react';

export default function LandingPage() {
  const DOWNLOAD_LINK = "https://github.com/Makymic/guitar-split-cam/releases/latest";
  const [copied, setCopied] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("git clone https://github.com/Makymic/guitar-split-cam.git");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Background Subtle Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: `24px 24px`
        }}
      />

      {/* TOP ANNOUNCEMENT / TOP AD BANNER SLOT */}
      <div className="bg-slate-100 border-b border-slate-200/80 text-center py-2 px-4 text-xs text-slate-600 relative z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          {/* REPLACE THIS INNER DIV WITH YOUR AD CODE (e.g. Google AdSense Banner 728x90 or text ad) */}
          <span className="font-semibold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] uppercase tracking-wider">
            Sponsor
          </span>
          <span>Check out top-rated guitar accessories & audio interfaces on Sale today.</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200/60 bg-[#FBFBFD]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 font-semibold text-sm tracking-tight text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
              🎸
            </div>
            <span>Guitar Split-Cam</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/Makymic/guitar-split-cam" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
            >
              GitHub
            </a>
            <a
              href={DOWNLOAD_LINK}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm"
            >
              Download App
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Open Source & Built with Tauri v2
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
            Dual hand tracking. <br />
            Single webcam setup.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-10 font-normal leading-relaxed">
            The lightweight desktop studio for guitarists. Split your fretting and picking hands into two clean dynamic frames with zero extra hardware.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <a
              href={DOWNLOAD_LINK}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 font-semibold text-white shadow-md transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>Download for Desktop</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            
            <button
              onClick={handleCopyInstall}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 font-mono text-xs text-slate-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="text-slate-400">$</span>
              <span>git clone guitar-split-cam</span>
              <span className="ml-2 text-slate-900 font-sans font-bold text-[11px]">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>

          {/* Clean Interactive-Style Mockup Frame */}
          <div className="rounded-2xl p-3 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 max-w-4xl mx-auto">
            <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-900">
              {/* Window Controls bar */}
              <div className="h-8 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">Guitar Split-Cam Studio</span>
                <div className="w-10" />
              </div>
              
              {/* Viewport */}
              <div className="aspect-[2/1] bg-slate-950 grid grid-cols-2 gap-1 p-1 relative">
                <div className="bg-slate-900 rounded-l-lg border border-slate-800/80 flex flex-col items-center justify-center relative p-4">
                  <span className="text-xs font-mono text-slate-400 mb-2">[LEFT FRAME - FRETTING]</span>
                  <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs">
                    Hand
                  </div>
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono px-2 py-0.5 bg-slate-950/80 text-emerald-400 border border-slate-800 rounded">
                    MediaPipe: Active
                  </span>
                </div>

                <div className="bg-slate-900 rounded-r-lg border border-slate-800/80 flex flex-col items-center justify-center relative p-4">
                  <span className="text-xs font-mono text-slate-400 mb-2">[RIGHT FRAME - PICKING]</span>
                  <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs">
                    Hand
                  </div>
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-0.5 bg-slate-950/80 text-emerald-400 border border-slate-800 rounded">
                    Auto-Center: ON
                  </span>
                </div>

                {/* Pitch Overlay Mock */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900/90 border border-slate-700 rounded-full text-slate-200 text-xs font-mono flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>TUNER: 82.4Hz (E2)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MIDDLE ADVERTISEMENT BANNER SLOT */}
        <section className="my-12">
          <div className="w-full min-h-[90px] rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 flex flex-col items-center justify-center text-center">
            {/* REPLACE THIS WITH YOUR AD DISPLAY CODE (e.g., 728x90 Leaderboard or Responsive Unit) */}
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
              Advertisement
            </span>
            <p className="text-xs text-slate-500">
              Sponsor slot available — Place responsive Google AdSense or Custom Partner Banners here.
            </p>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-16 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Designed specifically for practice & instruction
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Eliminate awkward camera angles and dual-webcam sync issues with automatic computer vision framing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 font-bold mb-4 text-sm">
                01
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Smart Camera Crop</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uses MediaPipe hand tracking to continuously center both picking and fretting hands in dedicated viewports.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 font-bold mb-4 text-sm">
                02
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Real-Time Pitch HUD</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated Web Audio autocorrelation engine detects frequencies and notes live right on top of your videofeed.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 font-bold mb-4 text-sm">
                03
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Zero Extra Hardware</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed to run natively via standard built-in webcams or USB capture devices with minimal memory footprint.
              </p>
            </div>
          </div>
        </section>

        {/* SIDE-BY-SIDE CONTENT + ADVERTISEMENT / FAQ SECTION */}
        <section id="faq" className="py-16 border-t border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* FAQ (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1">
                    Do I need high-end webcams for hand tracking?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No. Standard 720p or 1080p webcams work seamlessly. MediaPipe runs locally on your CPU/GPU efficiently.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1">
                    Is the software completely free?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Yes, it is released under the MIT open-source license with no subscriptions, ads in-app, or paid features.
                  </p>
                </div>
              </div>
            </div>

            {/* SIDEBAR ADVERTISEMENT SLOT */}
            <div className="lg:col-span-1">
              <div className="h-full min-h-[250px] p-5 rounded-xl bg-slate-100/70 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                {/* REPLACE THIS WITH YOUR SIDEBAR AD UNIT (e.g., 300x250 Medium Rectangle) */}
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
                  Sidebar Sponsor
                </span>
                <p className="text-xs text-slate-500 mb-4">
                  300x250 Ad Display Unit Location
                </p>
                <div className="w-full h-32 rounded bg-slate-200/60 border border-slate-300/60 flex items-center justify-center text-[11px] text-slate-400 font-mono">
                  Ad Unit Placeholder
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 bg-white text-xs text-slate-500 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Guitar Split-Cam. Open Source Software.</p>
          <div className="flex gap-6">
            <a href="https://github.com/Makymic/guitar-split-cam" target="_blank" rel="noreferrer" className="hover:text-slate-900">
              GitHub Repository
            </a>
            <a href={DOWNLOAD_LINK} className="hover:text-slate-900">
              Releases
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}