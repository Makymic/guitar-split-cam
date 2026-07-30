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
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-[400px] right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Header Navigation */}
      <header className="border-b border-slate-800/60 bg-[#090d16]/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
            <span className="text-xl p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">🎸</span> 
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Guitar Split-Cam
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/Makymic/guitar-split-cam" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800/50"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href={DOWNLOAD_LINK}
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm shadow-blue-500/20"
            >
              Download Free
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-16 sm:pt-24 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          v1.0.0 Windows Build Live
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-[1.15]">
          One Camera. <br className="hidden sm:inline" />
          Both Hands Framed Perfectly.
        </h1>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Automated hand-tracking software for guitar teachers, students, and content creators. Crop and split fretting and picking views in real-time from a single video stream.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <a
            href={DOWNLOAD_LINK}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-lg shadow-blue-600/25 transition-all text-center flex items-center justify-center gap-2 group"
          >
            <span>Download for Windows</span>
            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          <button
            onClick={handleCopyInstall}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 font-mono text-xs text-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-slate-500">$</span>
            <span>git clone guitar-split-cam</span>
            <span className="ml-2 text-blue-400 text-[10px] uppercase font-sans font-bold">
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>
        </div>

        {/* UI App Mockup Preview */}
        <div className="relative mx-auto max-w-4xl rounded-2xl p-2 bg-gradient-to-b from-slate-700/40 to-slate-900/40 border border-slate-700/50 shadow-2xl backdrop-blur-xl">
          <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 shadow-inner">
            {/* Mock Header */}
            <div className="h-9 bg-slate-900/80 border-b border-slate-800 px-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">Guitar Split-Cam Workspace</span>
              <div className="w-10" />
            </div>
            
            {/* Mock Split Video Area */}
            <div className="aspect-[2/1] bg-slate-900/50 grid grid-cols-2 gap-0.5 p-1 relative">
              {/* Left View Mockup */}
              <div className="bg-slate-950 rounded-l-lg relative overflow-hidden flex items-center justify-center border-r border-slate-800/80">
                <span className="text-4xl opacity-20">🎸</span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-900/80 text-[10px] font-mono text-blue-400 border border-slate-800 rounded">
                  Fretting Hand (Auto-Track)
                </span>
              </div>
              {/* Right View Mockup */}
              <div className="bg-slate-950 rounded-r-lg relative overflow-hidden flex items-center justify-center">
                <span className="text-4xl opacity-20">🎼</span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-slate-900/80 text-[10px] font-mono text-emerald-400 border border-slate-800 rounded">
                  Picking Hand (Auto-Track)
                </span>
              </div>

              {/* Mock Tuner Overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/90 border border-slate-700/60 rounded-xl backdrop-blur-md shadow-lg flex items-center gap-3">
                <span className="text-xs font-bold text-amber-400">E2</span>
                <div className="w-16 h-1.5 bg-slate-800 rounded-full relative">
                  <div className="w-1.5 h-3 bg-emerald-400 rounded-full absolute -top-0.75 left-1/2 -translate-x-1/2" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">82.4 Hz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-24">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-slate-800/80 hover:border-slate-700/80 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg mb-4 text-blue-400">
              🖐️
            </div>
            <h3 className="font-bold text-base mb-2 text-slate-100">MediaPipe Hand Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic frame-centering for both picking and fretting hands using low-latency hand detection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-slate-800/80 hover:border-slate-700/80 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg mb-4 text-amber-400">
              🎯
            </div>
            <h3 className="font-bold text-base mb-2 text-slate-100">Built-in Tuner & Mic Input</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pitch estimation autocorrelation engine built directly onto the HUD with custom device selection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-slate-800/80 hover:border-slate-700/80 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg mb-4 text-emerald-400">
              ⚡
            </div>
            <h3 className="font-bold text-base mb-2 text-slate-100">Tauri v2 Native Performance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lightweight desktop executable with minimal RAM utilization and zero forced account logins.
            </p>
          </div>
        </div>

        {/* Short FAQ Section */}
        <section className="pt-24 border-t border-slate-800/60 text-left">
          <h2 className="text-xl font-bold mb-8 text-center bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-5 rounded-xl bg-slate-900/30 border border-slate-800/60">
              <h4 className="font-semibold text-slate-200 mb-2">Do I need two webcams?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No! The software takes a single webcam stream and crops/tracks both hands into a split screen layout.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/30 border border-slate-800/60">
              <h4 className="font-semibold text-slate-200 mb-2">Is it completely free?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes, Guitar Split-Cam is 100% open-source under the MIT license with no paywalls or recurring subscriptions.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 text-center text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} Guitar Split-Cam. Released under the MIT License.</p>
      </footer>
    </div>
  );
}