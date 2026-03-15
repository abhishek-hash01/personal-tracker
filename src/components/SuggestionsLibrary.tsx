'use client';

import { useProteinTracker } from '@/hooks/useProteinTracker';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const MINI_LIBRARY = [
  { food: '4 eggs', protein: 24, calories: 280 },
  { food: '2 eggs + milk', protein: 18, calories: 280 },
  { food: 'soya chunks (50g)', protein: 26, calories: 172 },
  { food: 'oats + milk', protein: 15, calories: 300 },
  { food: 'dal + roti', protein: 12, calories: 350 },
  { food: 'banana + milk', protein: 10, calories: 250 },
  { food: 'paneer bhurji', protein: 18, calories: 320 },
  { food: 'chicken breast (100g)', protein: 31, calories: 165 },
];

export function SuggestionsLibrary() {
  const { addFoodToToday } = useProteinTracker();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const handleAdd = (item: any) => {
    addFoodToToday({
      food: item.food,
      protein: item.protein,
      calories: item.calories,
    });
    setJustAdded(item.food);
    setTimeout(() => setJustAdded(null), 1500);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-2">
        <h2 className="text-2xl font-bold mb-2">Protein Combos</h2>
        <p className="text-muted-foreground text-sm">
          Quick and affordable meals to hit your goals without thinking too much.
        </p>
      </div>

      <div className="grid gap-3">
        {MINI_LIBRARY.map((item, i) => (
          <div 
            key={i} 
            className="group flex justify-between items-center p-4 bg-card rounded-2xl border border-border shadow-sm highlight"
          >
            <div>
              <h3 className="text-lg font-medium text-foreground">{item.food}</h3>
              <p className="text-sm text-muted-foreground">{item.calories} kcal</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-primary">{item.protein}g</span>
              <button 
                onClick={() => handleAdd(item)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
              >
                {justAdded === item.food ? (
                  <span className="text-xs font-bold leading-none animate-in fade-in zoom-in spin-in-12 duration-300">✓</span>
                ) : (
                  <Plus size={20} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
