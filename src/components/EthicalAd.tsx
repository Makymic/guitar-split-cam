import { EthicalAd } from './components/EthicalAd';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
        {/* Nav content */}
      </nav>

      {/* Hero Container */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Hero Copy & CTA */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Instrument Split-Cam
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Multi-angle tracking for guitar, piano, and percussion.
            </p>
          </div>

          {/* Right Column: Dark Video HUD Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            {/* Webcam / MediaPipe canvas goes here */}
          </div>
        </div>

        {/* --- AD / SPONSOR SLOT HERE --- */}
        <div className="mt-12">
          <EthicalAd publisherId="your-publisher-id" type="banner" />
        </div>
      </main>
    </div>
  );
}