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
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased">
      
      {/* 1. TOP SPONSOR BANNER */}
      <div className="bg-slate-900 text-slate-300 border-b border-slate-800 py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] tracking-wider uppercase">
              Sponsor
            </span>
            <span className="text-slate-300 font-medium">
              Top-rated desk mounts & webcams for multi-instrument recording
            </span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">AdSpace #1</span>
        </div>
      </div>

      {/* 2. DEEP BLUE TOPBAR / HEADER */}
      <header className="bg-blue-900 text-white shadow-xl sticky top-0 z-50 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Brand Left-Aligned */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-lg font-bold shadow-md border border-blue-400/30">
              🎹
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-lg tracking-tight leading-none text-white">
                INSTRUMENT SPLIT-CAM
              </span>
              <span className="text-[10px] text-blue-300 font-semibold tracking-widest uppercase mt-0.5">
                Open Source Desktop Studio
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-blue-200 tracking-wide uppercase">
            <a href="#overview" className="hover:text-white transition-colors">Overview</a>
            <a href="#instruments" className="hover:text-white transition-colors">Instruments</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/Makymic/guitar-split-cam" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-semibold text-blue-200 hover:text-white transition-colors px-3 py-2 hidden sm:block"
            >
              GitHub
            </a>
            <a
              href={DOWNLOAD_LINK}
              className="text-xs font-bold px-5 py-2.5 rounded-md bg-blue-500 hover:bg-blue-400 text-white transition-all shadow-md uppercase tracking-wider"
            >
              Free Download
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (50/50 Asymmetric SaaS Layout) */}
      <section id="overview" className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Persuasive Copy */}
            <div className="lg:col-span-6 text-justify">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded mb-6">
                PRO VISION TRACKING FOR MUSICIANS
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6 text-left">
                Two Dynamic Views. <br />
                <span className="text-blue-700">One Single Camera.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                Whether capturing delicate fretwork on a guitar neck, spanning 88 keys on a piano, or tracking mallet velocity across a xylophone—standard static webcams force you to compromise on detail.
              </p>

              <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
                Instrument Split-Cam uses AI hand tracking to lock onto both hands independently. It automatically crops and isolates two stable, high-definition video feeds out of a single camera stream in real time.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 text-left">
                <a
                  href={DOWNLOAD_LINK}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-blue-700 hover:bg-blue-800 font-bold text-white shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Download Desktop App</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                
                <button
                  onClick={handleCopyInstall}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-md border-2 border-slate-300 bg-slate-50 hover:bg-slate-100 font-mono text-xs text-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-slate-400">$</span>
                  <span>git clone guitar-split-cam</span>
                  <span className="ml-2 text-blue-700 font-sans font-bold text-[10px] uppercase">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Side Video HUD Display Box */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 rounded-lg p-3 shadow-2xl border-4 border-slate-800">
                <div className="h-8 bg-slate-800 rounded-t px-3 flex items-center justify-between border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest">
                    Live Split Engine Output
                  </span>
                  <div className="w-12" />
                </div>
                
                <div className="aspect-video bg-slate-950 grid grid-cols-2 gap-2 p-2 relative">
                  <div className="bg-slate-900 rounded border border-slate-800 flex flex-col items-center justify-center relative p-2">
                    <span className="text-xs font-mono font-bold text-blue-400 mb-1">[ LEFT HAND FEED ]</span>
                    <span className="text-[10px] text-slate-500">Bass / Fretboard Zone</span>
                    <span className="absolute bottom-2 left-2 text-[9px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                      TRACKING: ACTIVE
                    </span>
                  </div>

                  <div className="bg-slate-900 rounded border border-slate-800 flex flex-col items-center justify-center relative p-2">
                    <span className="text-xs font-mono font-bold text-blue-400 mb-1">[ RIGHT HAND FEED ]</span>
                    <span className="text-[10px] text-slate-500">Treble / Picking Zone</span>
                    <span className="absolute bottom-2 right-2 text-[9px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                      CROP: AUTOMATIC
                    </span>
                  </div>

                  <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-900/90 border border-blue-500 rounded-full text-white text-[11px] font-mono font-bold shadow-lg">
                    TUNER: 440.0 Hz (A4)
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MAIN IN-FEED ADVERTISEMENT SLOT */}
      <section className="py-8 bg-slate-200/60 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-full min-h-[100px] rounded-lg border-2 border-dashed border-slate-400 bg-white p-4 flex flex-col items-center justify-center text-center shadow-inner">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-1">
              Advertisement Leaderboard (728x90)
            </span>
            <p className="text-xs text-slate-600">
              Insert your Google AdSense code or affiliate partnership banner here.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INSTRUMENT SUPPORT CARDS */}
      <section id="instruments" className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12 text-justify">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-3 text-left">
              Engineered for Every Instrument Discipline
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Traditional framing requires setting up multiple tripod angles or purchasing expensive dual-lens hardware. Instrument Split-Cam treats left and right hands as distinct subjects, giving every musician studio-level video output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-justify">
            
            {/* Card 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-600 border-t border-r border-b border-slate-200">
              <div className="text-3xl mb-3">🎸</div>
              <h3 className="font-bold text-base text-slate-900 mb-2 text-left">Guitar & Bass</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simultaneously display chord fretting technique alongside picking, strumming, or fingerstyle details from one camera angle.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-600 border-t border-r border-b border-slate-200">
              <div className="text-3xl mb-3">🎹</div>
              <h3 className="font-bold text-base text-slate-900 mb-2 text-left">Piano & Keyboards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Capture the lower bass register and upper treble octave without needing overhead mounting hardware or wide fisheye distortion.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-600 border-t border-r border-b border-slate-200">
              <div className="text-3xl mb-3">🥁</div>
              <h3 className="font-bold text-base text-slate-900 mb-2 text-left">Xylophone & Percussion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track rapid mallet strikes on marimbas, xylophones, or vibraphones with responsive bounding-box centering.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ & SIDEBAR AD DISPLAY */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* FAQ Area */}
            <div className="lg:col-span-8 text-justify">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-8 text-left">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 mb-2 text-left">
                    Does this require two webcams or dedicated capture cards?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No. The core feature of Instrument Split-Cam is taking a single video stream (standard built-in or USB webcam) and automatically splitting it into two independently tracked cropped views.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 mb-2 text-left">
                    Does hand tracking lag during fast musical passages?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All computer vision computations run locally via optimized MediaPipe algorithms, maintaining low latency even on modest laptop hardware without sending video data to cloud servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Ad Unit */}
            <div className="lg:col-span-4">
              <div className="h-full min-h-[260px] p-4 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-2">
                  Sidebar Sponsor Slot (300x250)
                </span>
                <div className="w-full h-44 bg-white rounded border border-slate-300 flex items-center justify-center text-xs text-slate-400 font-mono">
                  Square Banner Ad Space
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Instrument Split-Cam. Released under the MIT Open Source License.</p>
          <div className="flex gap-6 font-semibold">
            <a href="https://github.com/Makymic/guitar-split-cam" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub Repository
            </a>
            <a href={DOWNLOAD_LINK} className="hover:text-white transition-colors">
              Releases & Downloads
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}