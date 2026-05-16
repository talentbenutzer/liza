'use client';

import { useState, useEffect } from 'react';
import { UserFoodRestriction, RestrictionType, Severity } from '../lib/analyzer/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { generateId } from '../lib/utils/id';

export function RestrictionForm({ 
  onAdd, 
  editingItem,
  onCancelEdit
}: { 
  onAdd: (r: UserFoodRestriction) => void,
  editingItem?: UserFoodRestriction | null,
  onCancelEdit?: () => void
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<RestrictionType>('intolerance');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [avoidTraces, setAvoidTraces] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setType(editingItem.restrictionType);
      setSeverity(editingItem.severity);
      setAvoidTraces(editingItem.avoidTraces);
      setNotes(editingItem.notes || '');
    } else {
      setName('');
      setType('intolerance');
      setSeverity('medium');
      setAvoidTraces(false);
      setNotes('');
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      id: editingItem ? editingItem.id : generateId(),
      name: name.trim(),
      restrictionType: type,
      severity,
      avoidTraces,
      notes: notes.trim() || undefined,
      createdAt: editingItem ? editingItem.createdAt : Date.now()
    });

    if (!editingItem) {
      setName('');
      setNotes('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 p-6 rounded-xl border ${editingItem ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
      <div className="space-y-2">
        <Label htmlFor="name">Zutat / Lebensmittelgruppe</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Laktose, Erdnuss..." required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Art der Einschränkung</Label>
          <Select value={type} onValueChange={(val) => setType(val as RestrictionType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allergy">Allergie</SelectItem>
              <SelectItem value="intolerance">Unverträglichkeit</SelectItem>
              <SelectItem value="avoidance">Persönliche Vermeidung</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Schweregrad</Label>
          <Select value={severity} onValueChange={(val) => setSeverity(val as Severity)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Niedrig</SelectItem>
              <SelectItem value="medium">Mittel</SelectItem>
              <SelectItem value="high">Hoch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox id="traces" checked={avoidTraces} onCheckedChange={(checked) => setAvoidTraces(checked as boolean)} />
        <Label htmlFor="traces">Auch Spuren vermeiden ("Kann Spuren von ... enthalten")</Label>
      </div>

      <div className="space-y-2 pt-2">
        <Label htmlFor="notes">Optionale Notiz</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Weitere Details..." className="min-h-[80px]" />
      </div>

      <div className="flex gap-2">
        {editingItem && (
          <Button type="button" variant="outline" className="w-full" onClick={onCancelEdit}>Abbrechen</Button>
        )}
        <Button type="submit" className="w-full">{editingItem ? 'Änderungen speichern' : 'Eintrag hinzufügen'}</Button>
      </div>
    </form>
  );
}
