'use client';

import { useEffect, useState } from 'react';
import { getUseLisaProfile, setUseLisaProfile, getMergedLisaFoods, saveLisaFoodOverride } from '@/lib/storage/localLisaProfileStorage';
import { lisaCategories } from '@/lib/lisa/lisaFoods';
import { LisaFoodItem } from '@/lib/lisa/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LisaProfilePage() {
  const [isActive, setIsActive] = useState(false);
  const [foods, setFoods] = useState<LisaFoodItem[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'happy' | 'no_go'>('all');

  useEffect(() => {
    setIsActive(getUseLisaProfile());
    setFoods(getMergedLisaFoods());
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    setUseLisaProfile(checked);
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

  const nogoCount = foods.filter(f => f.status === 'no_go').length;
  const happyCount = foods.filter(f => f.status === 'happy').length;

  const filteredFoods = foods.filter(food => {
    if (filter !== 'all' && food.status !== filter) return false;
    
    if (search.trim()) {
      const s = search.toLowerCase();
      const matchName = food.name.toLowerCase().includes(s);
      const matchAlias = food.aliases?.some(a => a.toLowerCase().includes(s));
      return matchName || matchAlias;
    }
    
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Lisa-Profil</h1>
        <p className="text-muted-foreground">
          "Lisa's Happy Nahrungsmittel" - Ein vordefiniertes Profil mit sicheren und zu vermeidenden Lebensmitteln.
        </p>
        <div className="mt-4 flex gap-4 text-sm font-medium">
          <div className="text-green-600 dark:text-green-400">{happyCount} Happy Foods</div>
          <div className="text-red-600 dark:text-red-400">{nogoCount} No-Go Foods</div>
        </div>
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

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-end">
        <div className="w-full sm:w-2/3">
          <Label htmlFor="search" className="mb-2 block">Suchen (Name oder Alias)</Label>
          <Input 
            id="search" 
            placeholder="z.B. Weizen oder Mandeln..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="filter" className="mb-2 block">Filter</Label>
          <Select value={filter} onValueChange={(val: any) => setFilter(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Alle anzeigen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle anzeigen</SelectItem>
              <SelectItem value="happy">Nur Happy Foods</SelectItem>
              <SelectItem value="no_go">Nur No-Go Foods</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y max-h-[600px] overflow-y-auto">
              {filteredFoods.map(food => (
                <li key={food.id} className="p-4 hover:bg-muted/50 transition-colors flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{food.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${food.status === 'no_go' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {food.status === 'no_go' ? 'No-Go' : 'Happy'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Kategorie: {food.category}</div>
                    {food.aliases && food.aliases.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Aliase: {food.aliases.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(food)}>Bearbeiten</Button>
                  </div>
                </li>
              ))}
              {filteredFoods.length === 0 && (
                <li className="p-8 text-center text-muted-foreground">Keine Lebensmittel gefunden.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Alle Kategorien</h3>
        <div className="flex flex-wrap gap-2">
          {lisaCategories.map(cat => (
            <span key={cat} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
