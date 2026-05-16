'use client';

import { UserFoodRestriction } from '../lib/analyzer/types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function RestrictionList({
  restrictions,
  onDelete,
  onEdit
}: {
  restrictions: UserFoodRestriction[];
  onDelete: (id: string) => void;
  onEdit: (item: UserFoodRestriction) => void;
}) {
  if (restrictions.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
        Keine Einträge vorhanden.
      </div>
    );
  }

  const getTypeLabel = (t: string) => {
    switch(t) {
      case 'allergy': return 'Allergie';
      case 'intolerance': return 'Unverträglichkeit';
      case 'avoidance': return 'Vermeidung';
      default: return t;
    }
  };

  const getSeverityColor = (s: string) => {
    switch(s) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      {restrictions.map(r => (
        <Card key={r.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg flex items-center gap-2">
                {r.name}
                {r.avoidTraces && (
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Keine Spuren
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1 flex gap-2 items-center">
                <span className="capitalize">{getTypeLabel(r.restrictionType)}</span>
                <span>•</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(r.severity)}`}>
                  Schweregrad: {r.severity}
                </span>
              </div>
              {r.notes && <div className="text-xs text-muted-foreground mt-2 italic">{r.notes}</div>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(r)}>
                Bearbeiten
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(r.id)}>
                Löschen
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
