'use client';

import { useEffect, useState } from 'react';
import { getDemoMode } from '../lib/storage/localProfileStorage';

export function DemoModeBanner() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(getDemoMode());
  }, []);

  if (!isDemo) return null;

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-4 py-1.5 text-center">
      Lokaler MVP-Modus aktiv. Daten werden nur in diesem Browser gespeichert.
    </div>
  );
}
