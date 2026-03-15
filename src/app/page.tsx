'use client';

import { useState } from 'react';
import { useProteinTracker } from '@/hooks/useProteinTracker';
import { DailyTracker } from '@/components/DailyTracker';
import { SuggestionsLibrary } from '@/components/SuggestionsLibrary';
import { HistoryGraph } from '@/components/HistoryGraph';
import { Dumbbell, ListPlus, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'daily' | 'library' | 'history'>('daily');
  const { isLoaded } = useProteinTracker();

  if (!isLoaded) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <main className="min-h-screen bg-background flex justify-center text-foreground font-sans">
      <div className="w-full max-w-lg min-h-screen flex flex-col pt-8 pb-24 px-4 sm:px-6 relative">
        
        {/* Header */}
        <header className="mb-8 flex flex-col items-center">
          <div className="h-10 w-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-3">
            <Dumbbell size={24} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Protein Tracker</h1>
        </header>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'daily' && <DailyTracker />}
          {activeTab === 'library' && <SuggestionsLibrary />}
          {activeTab === 'history' && <HistoryGraph />}
        </div>
        
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border pb-safe z-50">
          <div className="max-w-lg mx-auto flex justify-around p-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${activeTab === 'daily' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Dumbbell size={20} className="mb-1" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Today</span>
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${activeTab === 'library' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ListPlus size={20} className="mb-1" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Combos</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${activeTab === 'history' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <BarChart3 size={20} className="mb-1" />
              <span className="text-[10px] uppercase font-bold tracking-wider">History</span>
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
