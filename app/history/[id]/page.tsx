'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getScanHistory } from '@/lib/storage/localScanHistoryStorage';
import { ScanHistoryItem } from '@/lib/analyzer/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HistoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<ScanHistoryItem | null>(null);

  useEffect(() => {
    const history = getScanHistory();
    const found = history.find(h => h.id === params.id);
    if (found) {
      setItem(found);
    } else {
      router.push('/history');
    }
  }, [params.id, router]);

  if (!item) return <div className="p-8 text-center">Lade...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/history">
          <Button variant="outline" size="sm">Zurück zur Historie</Button>
        </Link>
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Gespeicherter Scan</h1>
        <p className="text-muted-foreground text-sm">
          Vom {new Date(item.createdAt).toLocaleString('de-DE')}
        </p>
        <div className="mt-4 flex justify-center">
          <div className={`px-6 py-2 rounded-full text-xl font-bold uppercase tracking-wider ${
            item.resultStatus === 'red' ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' : 
            item.resultStatus === 'yellow' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50' : 
            'bg-green-500 text-white shadow-lg shadow-green-500/50'
          }`}>
            Gesamtbewertung: {item.resultStatus === 'red' ? 'Kritisch' : item.resultStatus === 'yellow' ? 'Vorsicht' : 'Unauffällig'}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Erkannter Text</h2>
          <p className="text-sm whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">{item.originalText}</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Treffer: Nutzerprofil</h2>
            {(item.matches || []).length > 0 ? (
              <ul className="space-y-2">
                {item.matches.map((m, i) => (
                  <li key={i} className="text-sm p-2 bg-muted/30 rounded">
                    <span className="font-semibold">{m.matchedText}</span>
                    <span className="text-muted-foreground ml-2">({m.explanation})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Keine Treffer im persönlichen Profil.</p>
            )}
          </CardContent>
        </Card>

        {item.lisaProfileResult && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Treffer: Lisa-Profil</h2>
              <div className="space-y-4">
                {item.lisaProfileResult.noGoMatches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-red-600 mb-1">No-Gos:</h3>
                    <div className="flex flex-wrap gap-1">
                      {item.lisaProfileResult.noGoMatches.map(m => (
                        <span key={m} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                {item.lisaProfileResult.happyMatches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-600 mb-1">Happy Foods:</h3>
                    <div className="flex flex-wrap gap-1">
                      {item.lisaProfileResult.happyMatches.map(m => (
                        <span key={m} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                {item.lisaProfileResult.noGoMatches.length === 0 && item.lisaProfileResult.happyMatches.length === 0 && (
                  <p className="text-sm text-muted-foreground">Keine bekannten Lisa-Profil-Begriffe gefunden.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
