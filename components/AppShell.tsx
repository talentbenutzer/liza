'use client';

import { AppHeader } from './AppHeader';
import { DemoModeBanner } from './DemoModeBanner';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
      <DemoModeBanner />
      <main className="flex-1 container mx-auto px-4 pt-8 pb-32">
        {children}
      </main>
      <footer className="py-6 mt-12 bg-transparent">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} LIZA - Lebensmittel-Intoleranz- & Zutaten-Analyse
        </div>
      </footer>
      <AppHeader />
    </div>
  );
}
