'use client';

import Link from 'next/link';
import { Camera, Clock } from 'lucide-react';

const FemaleAvatar = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    <path d="M7 8c-1 2-1 4-1 6" />
    <path d="M17 8c1 2 1 4 1 6" />
  </svg>
);

export function AppHeader() {
  return (
    <header className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[320px] rounded-full bg-foreground text-background shadow-2xl">
      <div className="px-6 h-16 flex items-center justify-between relative">
        <Link href="/lisa-profile" className="p-2 hover:text-primary transition-colors" aria-label="Profil">
          <FemaleAvatar className="w-6 h-6" />
        </Link>

        {/* Prominenter Scan Button in der Mitte */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5">
          <Link 
            href="/scan" 
            className="flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 transition-transform border-4 border-background"
            aria-label="Scan"
          >
            <Camera className="w-7 h-7" />
          </Link>
        </div>

        <Link href="/history" className="p-2 hover:text-primary transition-colors" aria-label="Historie">
          <Clock className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
