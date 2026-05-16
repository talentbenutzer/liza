'use client';

import { useEffect, useState } from 'react';
import { getUseLisaProfile, setUseLisaProfile, getMergedLisaFoods, saveLisaFoodOverride } from '@/lib/storage/localLisaProfileStorage';
import { lisaCategories } from '@/lib/lisa/lisaFoods';
import { LisaFoodItem } from '@/lib/lisa/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LisaProfilePage() {
  const [isActive, setIsActive] = useState(false);
  const [foods, setFoods] = useState<LisaFoodItem[]>([]);

  useEffect(() => {
    setIsActive(getUseLisaProfile());
    setFoods(getMergedLisaFoods());
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    setUseLisaProfile(checked);
  };

  const handleDelete = (id: string) => {
    if (confirm('Möchtest du diesen Eintrag wirklich aus dem Lisa-Profil löschen?')) {
      saveLisaFoodOverride(id, null);
      setFoods(getMergedLisaFoods());
    }
  };

  const handleEdit = (food: LisaFoodItem) => {
    const newName = prompt('Name bearbeiten:', food.name);
    if (newName === null) return;
    
    const newAliases = prompt('Aliase bearbeiten (kommagetrennt):', (food.aliases || []).join(', '));
    if (newAliases === null) return;

    const updated: LisaFoodItem = {
      ...food,
      name: newName.trim() || food.name,
      aliases: newAliases.split(',').map(s => s.trim()).filter(Boolean)
    };

    saveLisaFoodOverride(food.id, updated);
    setFoods(getMergedLisaFoods());
  };

  const nogoFoods = foods.filter(f => f.status === 'no_go');
  const happyFoods = foods.filter(f => f.status === 'happy');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Lisa-Profil</h1>
        <p className="text-muted-foreground">
          "Lisa's Happy Nahrungsmittel" - Ein vordefiniertes Profil mit sicheren und zu vermeidenden Lebensmitteln.
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">Lisa-Profil aktivieren</h2>
            <p className="text-sm text-muted-foreground">
              Wenn aktiviert, wird jede Zutatenliste zusätzlich gegen Lisa's Liste abgeglichen.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="activate-lisa" checked={isActive} onCheckedChange={(checked) => handleToggle(checked as boolean)} className="w-6 h-6" />
            <Label htmlFor="activate-lisa" className="font-semibold text-lg cursor-pointer">Aktiv</Label>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">No-Go Foods</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                {nogoFoods.map(food => (
                  <li key={food.id} className="p-4 hover:bg-muted/50 transition-colors flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{food.name}</div>
                      {food.aliases && food.aliases.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Aliase: {food.aliases.join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(food)}>Bearbeiten</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(food.id)}>Löschen</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Happy Foods (MVP Auswahl)</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                {happyFoods.map(food => (
                  <li key={food.id} className="p-4 hover:bg-muted/50 transition-colors flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{food.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">Kategorie: {food.category}</div>
                      {food.aliases && food.aliases.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Aliase: {food.aliases.join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(food)}>Bearbeiten</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(food.id)}>Löschen</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Alle Happy-Kategorien</h3>
            <div className="flex flex-wrap gap-2">
              {lisaCategories.filter(c => c !== 'Das gar nicht').map(cat => (
                <span key={cat} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
