export type FoodEntry = {
  id: string;
  food: string;
  quantity?: string | number;
  protein: number;
  calories: number;
};

export type DailyLog = {
  date: string; // YYYY-MM-DD
  foods: FoodEntry[];
};

export type AppState = {
  history: Record<string, DailyLog>;
  dietary_constraints: string[];
  protein_goal: number;
};
