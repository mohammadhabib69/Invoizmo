'use client';

import { useTheme } from '@/hooks/useTheme';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const themes = [
  { id: 'default', label: 'Onyx Dark', color: '#0f1117', accent: '#C8E600', description: 'High contrast power mode' },
  { id: 'blue', label: 'Oceanic', color: '#1e293b', accent: '#3b82f6', description: 'Deep sea professional' },
  { id: 'purple', label: 'Royal', color: '#2e1065', accent: '#a855f7', description: 'Regal business aesthetic' },
  { id: 'green', label: 'Forest', color: '#064e3b', accent: '#10b981', description: 'Organic growth focus' },
];

export function ColorThemeSelector() {
  const { colorTheme, setColorTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {themes.map((theme) => {
        const isActive = colorTheme === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => setColorTheme(theme.id as any)}
            className={cn(
              "group relative flex flex-col p-6 rounded-[2rem] border-2 transition-all duration-500 text-left overflow-hidden",
              isActive 
                ? "bg-white border-primary shadow-2xl shadow-primary/10 scale-[1.02]" 
                : "bg-tertiary/10 border-transparent hover:border-border/50 hover:bg-tertiary/20"
            )}
          >
            {/* Visual Preview */}
            <div className="flex gap-2 mb-6">
              <div 
                className="w-12 h-16 rounded-xl border border-white/20 shadow-inner"
                style={{ backgroundColor: theme.color }}
              />
              <div 
                className="w-4 h-16 rounded-lg opacity-80"
                style={{ backgroundColor: theme.accent }}
              />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 w-full bg-neutral/10 rounded-md" />
                <div className="h-4 w-2/3 bg-neutral/10 rounded-md" />
                <div className="h-4 w-full bg-primary/10 rounded-md" />
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <p className={cn(
                  "font-black uppercase tracking-tight text-lg transition-colors",
                  isActive ? "text-primary" : "text-neutral"
                )}>
                  {theme.label}
                </p>
                <p className="text-xs font-bold text-neutral/60 mt-1">{theme.description}</p>
              </div>
              
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                isActive ? "bg-primary text-white rotate-0" : "bg-neutral/10 text-transparent -rotate-90"
              )}>
                <Check className="w-5 h-5" />
              </div>
            </div>

            {isActive && (
              <motion.div 
                layoutId="active-border"
                className="absolute inset-0 border-2 border-primary rounded-[2rem] pointer-events-none"
                transition={{ duration: 0.5 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
