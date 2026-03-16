'use client';

import { useProteinTracker } from '@/hooks/useProteinTracker';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState, useRef } from 'react';
import { AppState, DailyLog } from '@/lib/types';
import { Save, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export function HistoryGraph() {
  const { state, goal, updateGoal, updateConstraints, weeklyAverage } = useProteinTracker();
  
  const [goalInput, setGoalInput] = useState(goal.toString());
  const [constraintsInput, setConstraintsInput] = useState(state?.dietary_constraints.join(', ') || '');
  const [isSaved, setIsSaved] = useState(false);
  const [importError, setImportError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate last 7 days data for chart
  const getLast7Days = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const shortDate = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayLog: DailyLog | undefined = state?.history[dateStr];
      const protein = dayLog ? dayLog.foods.reduce((sum, f) => sum + f.protein, 0) : 0;
      
      data.push({
        name: shortDate,
        date: dateStr,
        protein: Number(protein.toFixed(1)),
        goal: state?.protein_goal || 100
      });
    }
    return data;
  };

  const chartData = getLast7Days();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal = parseInt(goalInput);
    if (!isNaN(newGoal) && newGoal > 0) {
      updateGoal(newGoal);
    }
    
    const constraintsArray = constraintsInput.split(',').map(s => s.trim()).filter(Boolean);
    updateConstraints(constraintsArray);
    
    toast.success('Settings saved successfully!');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExport = () => {
    if (!state) return;
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protein-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup exported successfully');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        // Basic validation
        if (!parsed.history || typeof parsed.protein_goal !== 'number') {
          throw new Error('Invalid backup file format');
        }
        
        localStorage.setItem('protein-tracker-state', JSON.stringify(parsed));
        toast.success('Data imported! Reloading...');
        setTimeout(() => window.location.reload(), 1500);
        
      } catch (err) {
        console.error('Import failed', err);
        setImportError('Failed to import: Invalid JSON or corrupted file.');
        toast.error('Import failed');
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read file.');
      toast.error('Failed to read file');
    }
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Chart Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold">Weekly Progress</h2>
          <div className="text-right">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">7-Day Avg</span>
            <p className="text-lg font-bold text-primary">{weeklyAverage}g</p>
          </div>
        </div>
        <div className="h-64 w-full bg-card rounded-2xl p-4 border border-border">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'var(--color-secondary)' }}
                contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-foreground)' }}
              />
              <Bar dataKey="protein" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.protein >= entry.goal ? 'var(--color-primary)' : 'var(--color-muted-foreground)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Settings Section */}
      <section className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        
        <form onSubmit={handleSaveSettings} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Daily Protein Goal (g)
            </label>
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Dietary Constraints (Comma separated)
            </label>
            <textarea
              value={constraintsInput}
              onChange={(e) => setConstraintsInput(e.target.value)}
              placeholder="e.g., budget friendly, no whey, mostly eggs"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground mt-2">
              The AI uses these constraints when parsing ambiguous entries.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-opacity-90 transition-colors"
          >
            <Save size={18} />
            {isSaved ? 'Saved!' : 'Save Settings'}
          </button>
        </form>

        {/* Data Management Section */}
        <div className="pt-6 border-t border-border">
           <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4">Data Management</h3>
           <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-secondary text-secondary-foreground rounded-xl font-medium hover:opacity-80 transition-opacity text-sm"
              >
                <Download size={16} /> Export Data
              </button>
              
              <button
                type="button"
                onClick={handleImportClick}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-secondary text-secondary-foreground rounded-xl font-medium hover:opacity-80 transition-opacity text-sm"
              >
                <Upload size={16} /> Import Data
              </button>
              <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
           </div>
           {importError && (
             <p className="text-destructive text-sm mt-3 font-medium">{importError}</p>
           )}
        </div>
      </section>

    </div>
  );
}
