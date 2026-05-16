'use client';

import { useEffect, useState } from 'react';
import { UserFoodRestriction } from '@/lib/analyzer/types';
import { getFoodRestrictions, setFoodRestrictions } from '@/lib/storage/localProfileStorage';
import { RestrictionForm } from '@/components/RestrictionForm';
import { RestrictionList } from '@/components/RestrictionList';

export default function ProfilePage() {
  const [restrictions, setRestrictionsState] = useState<UserFoodRestriction[]>([]);
  const [editingItem, setEditingItem] = useState<UserFoodRestriction | null>(null);

  useEffect(() => {
    setRestrictionsState(getFoodRestrictions());
  }, []);

  const handleAddOrEdit = (r: UserFoodRestriction) => {
    let newList;
    if (editingItem) {
      newList = restrictions.map(item => item.id === r.id ? r : item);
      setEditingItem(null);
    } else {
      newList = [...restrictions, r];
    }
    setRestrictionsState(newList);
    setFoodRestrictions(newList);
  };

  const handleDelete = (id: string) => {
    const newList = restrictions.filter(r => r.id !== id);
    setRestrictionsState(newList);
    setFoodRestrictions(newList);
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  const handleEdit = (item: UserFoodRestriction) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Dein Profil</h1>
        <p className="text-muted-foreground">
          Hier verwaltest du deine Allergien, Unverträglichkeiten und Lebensmittel, die du vermeiden möchtest.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Eintrag bearbeiten' : 'Neuen Eintrag hinzufügen'}
          </h2>
          <RestrictionForm 
            onAdd={handleAddOrEdit} 
            editingItem={editingItem}
            onCancelEdit={() => setEditingItem(null)}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Deine Einschränkungen</h2>
          <RestrictionList 
            restrictions={restrictions} 
            onDelete={handleDelete} 
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}
