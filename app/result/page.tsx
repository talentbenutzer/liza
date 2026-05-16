'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeIngredients } from '@/lib/analyzer/analyzeIngredients';
import { analyzeLisaProfile } from '@/lib/lisa/analyzeLisaProfile';
import { getFoodRestrictions } from '@/lib/storage/localProfileStorage';
import { getUseLisaProfile, getMergedLisaFoods } from '@/lib/storage/localLisaProfileStorage';
import { saveScanResult } from '@/lib/storage/localScanHistoryStorage';
import { AnalysisResult, ScanHistoryItem } from '@/lib/analyzer/types';
import { LisaProfileAnalysisResult } from '@/lib/lisa/types';
import { generateId } from '@/lib/utils/id';

function RiskBadge({ level, label }: { level: string, label?: string }) {
  if (level === 'red') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">{label || 'Rot'}</span>;
  if (level === 'yellow') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">{label || 'Gelb'}</span>;
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{label || 'Grün'}</span>;
}

export default function ResultPage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [userResult, setUserResult] = useState<AnalysisResult | null>(null);
  const [lisaResult, setLisaResult] = useState<LisaProfileAnalysisResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const scanText = sessionStorage.getItem('liza_current_scan');
    if (!scanText) {
      router.push('/scan');
      return;
    }
    setText(scanText);

    const restrictions = getFoodRestrictions();
    const result = analyzeIngredients(scanText, restrictions);
    setUserResult(result);

    if (getUseLisaProfile()) {
      const lisaRes = analyzeLisaProfile(scanText, getMergedLisaFoods());
      setLisaResult(lisaRes);
    }
  }, [router]);

  if (!userResult) return <div className="p-8 text-center">Analysiere...</div>;

  const handleSave = () => {
    const overallRisk = lisaResult && lisaResult.status === 'red' ? 'red' : userResult.status === 'red' ? 'red' : (lisaResult && lisaResult.status === 'yellow') || userResult.status === 'yellow' ? 'yellow' : 'green';
    
    const item: ScanHistoryItem = {
      id: generateId(),
      createdAt: Date.now(),
      originalText: text,
      resultStatus: overallRisk,
      matches: userResult.matches,
      lisaProfileResult: lisaResult || undefined,
    };
    saveScanResult(item);
    setIsSaved(true);
  };

  const getOverallStatus = () => {
    if (userResult.status === 'red' || lisaResult?.status === 'red') return 'red';
    if (userResult.status === 'yellow' || lisaResult?.status === 'yellow') return 'yellow';
    return 'green';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Analyse-Ergebnis</h1>
        <div className="mt-4 flex justify-center">
          <div className={`px-6 py-2 rounded-full text-xl font-bold uppercase tracking-wider ${
            overallStatus === 'red' ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' : 
            overallStatus === 'yellow' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50' : 
            'bg-green-500 text-white shadow-lg shadow-green-500/50'
          }`}>
            Gesamtbewertung: {overallStatus === 'red' ? 'Kritisch' : overallStatus === 'yellow' ? 'Vorsicht' : 'Unauffällig'}
          </div>
        </div>
      </div>

      <Card className="border-t-4" style={{ borderTopColor: overallStatus === 'red' ? 'var(--liza-red)' : overallStatus === 'yellow' ? 'var(--liza-yellow)' : 'var(--liza-green)' }}>
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-2">Nutzerprofil-Ergebnis</h2>
          <p className="text-sm font-medium mb-4">{userResult.summary}</p>
          
          {userResult.matches.length > 0 ? (
            <ul className="space-y-3">
              {userResult.matches.map((m, i) => (
                <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <span className="font-semibold">{m.matchedText}</span>
                    <span className="text-xs text-muted-foreground ml-2">({m.explanation})</span>
                  </div>
                  <div className="mt-2 sm:mt-0"><RiskBadge level={m.riskLevel} /></div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">Keine Übereinstimmungen mit deinem persönlichen Profil gefunden.</div>
          )}
        </CardContent>
      </Card>

      {lisaResult && (
        <Card className="border-t-4" style={{ borderTopColor: lisaResult.status === 'red' ? 'var(--liza-red)' : lisaResult.status === 'yellow' ? 'var(--liza-yellow)' : 'var(--liza-green)' }}>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-2">Lisa-Profil-Ergebnis</h2>
            <p className="text-sm font-medium mb-4">{lisaResult.summary}</p>
            
            <div className="space-y-4">
              {lisaResult.noGoMatches.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-2">Gefundene No-Gos:</h3>
                  <div className="flex flex-wrap gap-2">
                    {lisaResult.noGoMatches.map(m => (
                      <span key={m} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{m}</span>
                    ))}
                  </div>
                </div>
              )}
              {lisaResult.happyMatches.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-green-600 mb-2">Gefundene Happy Foods:</h3>
                  <div className="flex flex-wrap gap-2">
                    {lisaResult.happyMatches.map(m => (
                      <span key={m} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{m}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Erkannter Text</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{text}</p>
        </CardContent>
      </Card>

      <div className="bg-muted/50 p-4 rounded-xl text-xs text-muted-foreground border">
        <strong>Disclaimer:</strong> LIZA ersetzt keine medizinische Beratung. Die Analyse basiert auf automatisch erkanntem Text und persönlichen Angaben. OCR kann Fehler enthalten. Besonders bei Allergien oder schweren Reaktionen prüfe die Angaben auf der Verpackung immer selbst.
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button size="lg" onClick={() => router.push('/scan')} variant="outline">
          Neuen Scan starten
        </Button>
        <Button size="lg" onClick={handleSave} disabled={isSaved}>
          {isSaved ? 'Gespeichert!' : 'Scan speichern'}
        </Button>
      </div>
    </div>
  );
}
