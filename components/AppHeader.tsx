'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-2xl tracking-tighter text-primary">
            LIZA
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium overflow-x-auto whitespace-nowrap">
          <Link href="/profile" className="hover:text-primary transition-colors">Profil</Link>
          <Link href="/lisa-profile" className="hover:text-primary transition-colors">Lisa-Profil</Link>
          <Link href="/scan" className="hover:text-primary transition-colors">Scan</Link>
          <Link href="/history" className="hover:text-primary transition-colors">Historie</Link>
          <Link href="/settings" className="hover:text-primary transition-colors">Einstellungen</Link>
          
          <div className="h-4 w-px bg-border mx-2" />
          
          {user ? (
            <button onClick={handleLogout} className="text-muted-foreground hover:text-primary transition-colors">
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
