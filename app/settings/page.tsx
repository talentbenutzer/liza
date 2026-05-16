'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { initializeDemoData, setDemoMode, getDemoMode } from '@/lib/storage/localProfileStorage';
import { getUseLisaProfile, setUseLisaProfile } from '@/lib/storage/localLisaProfileStorage';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const [lisaActive, setLisaActive] = useState(false);
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    setLisaActive(getUseLisaProfile());
    setDemoActive(getDemoMode());
  }, []);

  const handleToggleLisa = (checked: boolean) => {
    setLisaActive(checked);
    setUseLisaProfile(checked);
  };

  const handleResetDemo = () => {
    if (confirm('Möchtest du die Demo-Daten wirklich neu laden? Alle deine aktuellen Profil-Einträge werden überschrieben.')) {
      initializeDemoData();
      setDemoActive(true);
      alert('Demo-Daten wurden geladen.');
    }
  };

  const handleClearData = () => {
    if (confirm('Möchtest du wirklich ALLE lokalen Daten löschen? Dies betrifft dein Profil, Scans und Einstellungen.')) {
      localStorage.removeItem('liza_demo_mode');
      localStorage.removeItem('liza_food_restrictions');
      localStorage.removeItem('liza_scan_history');
      localStorage.removeItem('liza_use_lisa_profile');
      setLisaActive(false);
      setDemoActive(false);
      alert('Alle Daten wurden gelöscht.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Einstellungen</h1>
        <p className="text-muted-foreground">
          Verwalte deine App-Einstellungen und lokalen Daten.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">Lisa-Profil standardmäßig aktiv</h2>
              <p className="text-sm text-muted-foreground">Aktiviere oder deaktiviere die Analyse nach dem vordefinierten Lisa-Profil.</p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="settings-lisa" checked={lisaActive} onCheckedChange={(checked) => handleToggleLisa(checked as boolean)} className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-lg text-red-600">Gefahrenzone / MVP Datenverwaltung</h2>
              <p className="text-sm text-muted-foreground">Aktionen können nicht rückgängig gemacht werden.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button variant="outline" onClick={handleResetDemo} className="w-full sm:w-auto self-start">
                Demo-Daten neu laden
              </Button>
              <Button variant="destructive" onClick={handleClearData} className="w-full sm:w-auto self-start">
                Alle lokalen Daten löschen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
