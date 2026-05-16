'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getScanHistory, deleteScanResult } from '@/lib/storage/localScanHistoryStorage';
import { ScanHistoryItem } from '@/lib/analyzer/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteScanResult(id);
    setHistory(getScanHistory());
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Scan-Historie</h1>
        <p className="text-muted-foreground">
          Deine zuletzt gespeicherten Analysen (nur lokal in diesem Browser).
        </p>
      </div>

      {history.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
          Noch keine Scans gespeichert.
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className={`w-full sm:w-3 h-2 sm:h-auto self-stretch ${
                    item.resultStatus === 'red' ? 'bg-red-500' :
                    item.resultStatus === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{formatDate(item.createdAt)}</div>
                      <div className="line-clamp-2 text-sm font-medium">{item.originalText}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/history/${item.id}`}>
                        <Button variant="secondary" size="sm">Details</Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Löschen</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
