import React from 'react';

export default function LandingPage() {
  // Replace this URL with your exact installer release link on GitHub
  const DOWNLOAD_LINK = "https://github.com/Makymic/guitar-split-cam/releases/latest";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-2xl">🎸</span> 
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Guitar Split-Cam
            </span>
          </div>
          <a 
            href="https://github.com/Makymic/guitar-split-cam" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>GitHub</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-950/80 text-blue-400 text-xs font-semibold rounded-full border border-blue-800/60 mb-8 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          v1.0.0 Live for Windows
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
          Split Your Camera Feed for Guitar Lessons & Practice
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Track fretting and picking hands simultaneously in real time. Features built-in pitch detection tuner, custom audio recording, and automated hand tracking.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a
            href={DOWNLOAD_LINK}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Download for Windows</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          <a
            href="https://github.com/Makymic/guitar-split-cam"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 font-semibold text-slate-300 transition-all text-center"
          >
            View Source Code
          </a>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-slate-800/80 pt-16">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-xl mb-4">
              🖐️
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-100">MediaPipe Hand Tracking</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dynamically pans and frames both hands independently with smooth interpolation and tracking lock modes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-xl mb-4">
              🎯
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-100">Built-in Autocorrelation Tuner</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Includes a real-time pitch detection tuner overlay right on top of your video stream for quick tuning during lessons.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-xl mb-4">
              ⏺️
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-100">Direct Recording Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Capture high-quality split video and audio straight from your selected input devices with zero setup.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} Guitar Split-Cam. Released under the MIT License.</p>
      </footer>
    </div>
  );
}