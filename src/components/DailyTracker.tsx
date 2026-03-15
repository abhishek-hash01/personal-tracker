'use client';

import { useState } from 'react';
import { useProteinTracker } from '@/hooks/useProteinTracker';
import { Send, Loader2, Plus, Info, X, Flame } from 'lucide-react';
import { FoodEntry } from '@/lib/types';
import { toast } from 'sonner';

const MINI_LIBRARY = [
  { food: '4 eggs', protein: 24, calories: 280 },
  { food: 'soya chunks (50g)', protein: 26, calories: 172 },
  { food: 'oats + milk', protein: 15, calories: 300 },
  { food: 'dal + roti', protein: 12, calories: 350 },
  { food: '2 eggs + milk', protein: 18, calories: 280 },
  { food: 'banana + milk', protein: 10, calories: 250 },
];

export function DailyTracker() {
  const { todayLog, goal, todayProtein, remainingProtein, addFoodToToday, removeFoodFromToday, state, currentStreak } = useProteinTracker();
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const progressPercent = Math.min(100, Math.round((todayProtein / goal) * 100));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/parse-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: input, 
          constraints: state?.dietary_constraints || [] 
        }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      
      if (data.items && Array.isArray(data.items)) {
        data.items.forEach((item: any) => {
          // add securely
          addFoodToToday({
            food: item.food,
            quantity: item.quantity,
            protein: item.protein || 0,
            calories: item.calories || 0,
          });
        });
        
        toast.success(`Parsed and added ${data.items.length} item${data.items.length > 1 ? 's' : ''}!`);
      }
      
      setInput('');
    } catch (err) {
      setErrorMsg('Failed to parse food. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Generate Suggestions 
  const suggestions = MINI_LIBRARY.filter(item => item.protein <= remainingProtein + 5).sort((a,b) => b.protein - a.protein).slice(0, 3);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Progress Section */}
      <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-muted-foreground font-medium">Daily Goal: {goal}g</p>
              {currentStreak > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-900">
                  <Flame size={12} className="fill-orange-500" /> {currentStreak} Day Streak
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{todayProtein}g <span className="text-lg text-muted-foreground font-normal">consumed</span></h2>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold text-primary">{Math.max(0, goal - todayProtein)}g</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Remaining</p>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="h-4 bg-muted rounded-full overflow-hidden relative border border-border/50">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* Input Section */}
      <section>
        <form onSubmit={handleSubmit} className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSubmitting}
            placeholder="What did you eat?"
            className="w-full bg-card border border-border rounded-2xl p-5 pr-16 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow min-h-[100px] text-lg shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button 
            type="submit"
            disabled={isSubmitting || !input.trim()}
            className="absolute right-3 bottom-3 p-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring shadow-md"
          >
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </form>
        {errorMsg && <p className="text-destructive text-sm mt-2 font-medium">{errorMsg}</p>}
      </section>

      {/* Smart Suggestions */}
      {remainingProtein > 0 && suggestions.length > 0 && (
        <section className="animate-in fade-in duration-700">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Info size={16} /> Smart Suggestions
          </h3>
          <div className="grid gap-2">
            {suggestions.map((sug, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-border bg-card hover:bg-secondary hover:border-ring transition-colors cursor-pointer shadow-sm">
                <span className="font-medium text-foreground">{sug.food}</span>
                <span className="text-primary font-bold">{sug.protein}g</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Daily Log List */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Today</h3>
        {todayLog.foods.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border bg-card/50 text-muted-foreground">
            No foods logged yet today. Start tracking!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todayLog.foods.map((entry: FoodEntry) => (
              <div key={entry.id} className="group flex justify-between items-center p-4 bg-card rounded-xl border border-border shadow-sm highlight">
                <div>
                  <h4 className="font-medium text-lg text-foreground">
                    {entry.food} {entry.quantity && <span className="text-muted-foreground text-sm font-normal ml-1">({entry.quantity})</span>}
                  </h4>
                  <p className="text-muted-foreground text-sm">{entry.calories} kcal</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-primary">{entry.protein}g</span>
                  <button
                    onClick={() => {
                        removeFoodFromToday(entry.id);
                        toast.info(`Removed ${entry.food}`);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all focus:outline-none focus:opacity-100"
                    title="Remove entry"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
