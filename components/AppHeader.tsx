import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-2xl tracking-tighter text-primary">
            LIZA
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/profile" className="hover:text-primary transition-colors">Profil</Link>
          <Link href="/lisa-profile" className="hover:text-primary transition-colors">Lisa-Profil</Link>
          <Link href="/scan" className="hover:text-primary transition-colors">Scan</Link>
          <Link href="/history" className="hover:text-primary transition-colors">Historie</Link>
          <Link href="/settings" className="hover:text-primary transition-colors">Einstellungen</Link>
        </nav>
      </div>
    </header>
  );
}
