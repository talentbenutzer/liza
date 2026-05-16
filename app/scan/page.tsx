'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function ScanPage() {
  const router = useRouter();
  const [text, setText] = useState('');

  const handleMockData = () => {
    setText('Zutaten: Zucker, Weizenmehl, Magermilchpulver, Kakaobutter, Erdnüsse, Sojalecithin. Kann Spuren von Haselnüssen enthalten.');
  };

  const handleAnalyze = () => {
    if (!text.trim()) return;
    // Pass text to result page via sessionStorage for MVP (or URL params if short)
    sessionStorage.setItem('liza_current_scan', text);
    router.push('/result');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Zutaten scannen</h1>
        <p className="text-muted-foreground">
          Füge hier die Zutatenliste ein oder nutze die Mock-Daten für einen Test.
        </p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <Textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Zutatenliste hier einfügen..."
            className="min-h-[200px] text-lg p-4 resize-y"
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Button variant="outline" onClick={handleMockData} className="w-full sm:w-auto">
              Mock-Zutatenliste verwenden
            </Button>
            <Button size="lg" onClick={handleAnalyze} disabled={!text.trim()} className="w-full sm:w-auto px-8">
              Analyse starten
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Später wird hier ein Bild-Upload für OCR-Erkennung verfügbar sein.
      </div>
    </div>
  );
}
