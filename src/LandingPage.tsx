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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* TOP AD BANNER SLOT */}
      <div className="bg-slate-100 border-b border-slate-200 text-center py-2 px-4 text-xs text-slate-600">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <span className="font-semibold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] uppercase tracking-wider">
            Sponsor
          </span>
          <span>Featured Gear: High-definition webcams & desk clamps optimized for multi-instrument streaming.</span>
        </div>
      </div>

      {/* TOPBAR / HEADER (Blue Topbar with Title to Left) */}
      <header className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Title / Logo Left-Aligned */}
          <div className="flex items-center gap-3">
            <span className="text-xl p-1 bg-blue-800 rounded-lg shadow-inner">🎹</span>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-base tracking-tight leading-none text-white">
                Guitar & Instrument Split-Cam
              </span>
              <span className="text-[10px] text-blue-200 font-medium tracking-wide">
                Multi-Instrument Dual-View Studio
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-blue-100">
            <a href="#overview" className="hover:text-white transition-colors">Overview</a>
            <a href="#instruments" className="hover:text-white transition-colors">Supported Instruments</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/Makymic/guitar-split-cam" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-medium text-blue-100 hover:text-white transition-colors px-3 py-2 hidden sm:block"
            >
              GitHub
            </a>
            <a
              href={DOWNLOAD_LINK}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-all shadow-sm"
            >
              Download Free
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        
        {/* HERO SECTION - PERSUASIVE & INFORMATIVE */}
        <section id="overview" className="pt-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Persuasive Copy (Justified Text) */}
            <div className="lg:col-span-7 text-justify">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full mb-4">
                100% Free & Open Source
              </span>
              
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6 text-left">
                Dual Hand Tracking. <br />
                Single Webcam Setup.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                Capturing wide instrumental performances—whether fretting a guitar neck, spanning eighty-eight piano keys, or striking xylophone bars—usually requires multi-camera setups, complex OBS routing, or manual camera readjustments mid-lesson.
              </p>

              <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
                Instrument Split-Cam uses client-side computer vision to solve this framing problem. By automatically tracking left and right hand gestures via MediaPipe, the application dynamically crops and isolates two steady video feeds from a single camera—delivering clean split-screen monitoring for guitarists, pianists, xylophonists, and percussionists alike.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 text-left">
                <a
                  href={DOWNLOAD_LINK}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  <span>Download Desktop App</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                
                <button
                  onClick={handleCopyInstall}
                  className="w-full sm:w-auto px-4 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 font-mono text-xs text-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="text-slate-400">$</span>
                  <span>git clone guitar-split-cam</span>
                  <span className="ml-1 text-blue-600 font-sans font-bold text-[10px]">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Interactive Mockup Frame */}
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-slate-900 p-2 shadow-xl border border-slate-800">
                <div className="h-7 bg-slate-800 rounded-t-md px-3 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Live Multi-Cam HUD</span>
                </div>
                <div className="aspect-[4/3] bg-slate-950 grid grid-rows-2 gap-1 p-1">
                  <div className="bg-slate-900 rounded border border-slate-800 flex items-center justify-center relative">
                    <span className="text-xs font-mono text-blue-400">Left Hand / Bass Register</span>
                    <span className="absolute bottom-2 left-2 text-[9px] font-mono px-1.5 py-0.5 bg-slate-950/80 text-emerald-400 border border-slate-800 rounded">
                      Tracked: Active
                    </span>
                  </div>
                  <div className="bg-slate-900 rounded border border-slate-800 flex items-center justify-center relative">
                    <span className="text-xs font-mono text-blue-400">Right Hand / Treble Register</span>
                    <span className="absolute bottom-2 right-2 text-[9px] font-mono px-1.5 py-0.5 bg-slate-950/80 text-emerald-400 border border-slate-800 rounded">
                      Auto-Crop: ON
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* IN-FEED ADVERTISEMENT SLOT */}
        <section className="my-8">
          <div className="w-full min-h-[90px] rounded-xl border border-dashed border-slate-300 bg-white p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
              Sponsored Advertisement
            </span>
            <p className="text-xs text-slate-500">
              Responsive Leaderboard Ad Unit Space (728x90) — Place Google AdSense / Affiliate Banners Here.
            </p>
          </div>
        </section>

        {/* SUPPORTED INSTRUMENTS SECTION */}
        <section id="instruments" className="py-12 border-t border-slate-200">
          <div className="max-w-3xl mx-auto mb-10 text-justify">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4 text-left">
              Tailored for Diverse Musical Performance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
              Most video software assumes a single static subject. Instrument Split-Cam treats both hands as independent subjects of interest, allowing musicians across various disciplines to showcase intricate techniques without secondary cameras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-justify">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl mb-2">🎸</div>
              <h3 className="font-bold text-sm text-slate-900 mb-2 text-left">Guitar & Stringed</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Isolate complex chord voicings on the fretboard while simultaneously tracking picking, fingerstyle, or strumming hand placement.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl mb-2">🎹</div>
              <h3 className="font-bold text-sm text-slate-900 mb-2 text-left">Piano & Keyboards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simultaneously view bass and treble octaves on long keyboards without needing an overhead boom arm or secondary webcam lens.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl mb-2">🥁</div>
              <h3 className="font-bold text-sm text-slate-900 mb-2 text-left">Percussion & Xylophone</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track mallets on wide tuned percussion instruments like xylophones, marimbas, or vibraphones with dynamic hand-centered cropping.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-12 border-t border-slate-200">
          <div className="max-w-3xl mx-auto mb-10 text-justify">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4 text-left">
              Core Technical Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-justify">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs mb-3">
                01
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-2 text-left">Auto Hand Isolation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                MediaPipe hand detection continually adjusts bounding boxes around both active hands to keep technique in focus.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs mb-3">
                02
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-2 text-left">Audio Pitch HUD</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Built-in audio pitch estimation offers visual note and frequency feedback directly overlaid onto your live camera stream.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs mb-3">
                03
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-2 text-left">Tauri Native Performance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Built using Rust and Web API primitives for instantaneous startup times, minimal RAM footprint, and full offline execution.
              </p>
            </div>
          </div>
        </section>

        {/* SIDE-BY-SIDE FAQ & SIDEBAR AD SLOT */}
        <section id="faq" className="py-12 border-t border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* FAQ Area (Justified Text) */}
            <div className="lg:col-span-8 text-justify">
              <h2 className="text-xl font-bold text-slate-900 mb-6 text-left">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1 text-left">
                    Does this work for wide percussion or piano setups?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Yes. The hand tracking logic detects key hand landmarks independently, making it suitable for wide keyboard instruments, xylophones, marimbas, and acoustic instruments where two hands operate apart.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1 text-left">
                    Do I need high-end hardware or a secondary webcam?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No. The software is engineered to work with standard laptop webcams or USB cameras. All tracking calculations occur locally through optimized client-side processing algorithms.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1 text-left">
                    Can I record my practice sessions directly?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Yes. Built-in recording options allow you to record your practice sessions or lesson materials directly into standard web-compatible video formats without needing external software.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Ad Unit (300x250 Box) */}
            <div className="lg:col-span-4">
              <div className="h-full min-h-[220px] p-4 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
                  Sidebar Sponsor Slot
                </span>
                <div className="w-full h-36 bg-slate-200 rounded border border-slate-300 flex items-center justify-center text-xs text-slate-500 font-mono">
                  300x250 Ad Display
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-600">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Instrument Split-Cam. Released under the open-source MIT License.</p>
          <div className="flex gap-6">
            <a href="https://github.com/Makymic/guitar-split-cam" target="_blank" rel="noreferrer" className="hover:text-blue-700">
              GitHub Repository
            </a>
            <a href={DOWNLOAD_LINK} className="hover:text-blue-700">
              Releases
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}