import { useState, useEffect, useCallback } from 'react';
import { AppState, DailyLog, FoodEntry } from '@/lib/types';

const STORAGE_KEY = 'protein-tracker-state';

const DEFAULT_GOAL = 100;

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export function useProteinTracker() {
  const [state, setState] = useState<AppState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState) as AppState;
        
        // Handle daily reset logic upon loading
        const today = getTodayDateString();
        if (!parsed.history[today]) {
          parsed.history[today] = {
            date: today,
            foods: []
          };
        }
        
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse state from localStorage', e);
        initializeState();
      }
    } else {
      initializeState();
    }
    setIsLoaded(true);
  }, []);

  const initializeState = () => {
    const today = getTodayDateString();
    const initialState: AppState = {
      history: {
        [today]: {
          date: today,
          foods: [],
        }
      },
      dietary_constraints: [],
      protein_goal: DEFAULT_GOAL,
    };
    setState(initialState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
  };

  // Sync state changes to localStorage
  useEffect(() => {
    if (state && isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  // Derived Values for "Today"
  const today = getTodayDateString();
  const todayLog: DailyLog = state?.history[today] || { date: today, foods: [] };
  
  const todayProtein = todayLog.foods.reduce((sum: number, item: FoodEntry) => sum + item.protein, 0);
  const todayCalories = todayLog.foods.reduce((sum: number, item: FoodEntry) => sum + item.calories, 0);
  const goal = state?.protein_goal || DEFAULT_GOAL;
  const remainingProtein = Math.max(0, goal - todayProtein);

  // Actions
  const addFoodToToday = useCallback((food: Omit<FoodEntry, 'id'>) => {
    setState((prev) => {
      if (!prev) return prev;
      
      const newFood: FoodEntry = {
        ...food,
        id: crypto.randomUUID(),
      };
      
      const today = getTodayDateString();
      const currentLog = prev.history[today] || { date: today, foods: [] };
      
      return {
        ...prev,
        history: {
          ...prev.history,
          [today]: {
            ...currentLog,
            foods: [...currentLog.foods, newFood]
          }
        }
      };
    });
  }, []);

  const removeFoodFromToday = useCallback((id: string) => {
    setState((prev) => {
      if (!prev) return prev;
      
      const today = getTodayDateString();
      const currentLog = prev.history[today];
      if (!currentLog) return prev;
      
      return {
        ...prev,
        history: {
          ...prev.history,
          [today]: {
            ...currentLog,
            foods: currentLog.foods.filter(f => f.id !== id)
          }
        }
      };
    });
  }, []);

  const updateGoal = useCallback((newGoal: number) => {
    setState(prev => prev ? { ...prev, protein_goal: newGoal } : prev);
  }, []);

  const updateConstraints = useCallback((constraints: string[]) => {
    setState(prev => prev ? { ...prev, dietary_constraints: constraints } : prev);
  }, []);

  return {
    state,
    isLoaded,
    todayLog,
    todayProtein,
    todayCalories,
    remainingProtein,
    goal,
    addFoodToToday,
    removeFoodFromToday,
    updateGoal,
    updateConstraints,
  };
}
