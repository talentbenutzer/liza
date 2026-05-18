'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartScan = () => {
    router.push('/scan');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-foreground bg-clip-text">
        LIZA
      </h1>
      
      <p className="text-2xl md:text-3xl font-bold mb-6 max-w-2xl text-foreground/90">
        Zutaten prüfen. Risiken erkennen. Bewusster entscheiden.
      </p>
      
      <p className="text-lg mb-10 max-w-2xl text-muted-foreground">
        LIZA hilft dir, Zutatenlisten anhand deiner Allergien, Unverträglichkeiten oder persönlichen Lebensmittel-Einschränkungen schneller einzuschätzen.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Button size="lg" onClick={handleStartScan} className="rounded-full text-lg h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
          Scan starten
        </Button>
      </div>
    </div>
  );
}
