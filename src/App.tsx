import React, { useEffect, useState } from 'react';
import LandingPage from './LandingPage';
import DesktopApp from './DesktopApp';

export default function App() {
  const [isTauri, setIsTauri] = useState<boolean>(false);

  useEffect(() => {
    // Detects if running inside the Tauri desktop app window
    if (typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)) {
      setIsTauri(true);
    }
  }, []);

  // Loads desktop UI when inside Tauri, loads web landing page when on Vercel
  return isTauri ? <DesktopApp /> : <LandingPage />;
}