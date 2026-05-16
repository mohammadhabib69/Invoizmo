'use client';

import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ThemeToggle({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const { mode, setMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <div className={cn(
      "flex bg-tertiary/30 p-1.5 rounded-2xl border border-border/50",
      variant === 'full' ? "w-full h-14 max-w-sm" : "w-10 h-10"
    )} />
  );

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        className="w-10 h-10 rounded-xl bg-tertiary/50 border border-border/50 flex items-center justify-center hover:bg-tertiary transition-all active:scale-95"
      >
        {mode === 'dark' ? (
          <Sun className="w-5 h-5 text-accent" />
        ) : (
          <Moon className="w-5 h-5 text-primary" />
        )}
      </button>
    );
  }

  const options = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex bg-tertiary/50 p-1.5 rounded-2xl border border-border/50 w-full max-w-sm">
      {options.map((option) => {
        const isActive = mode === option.id;
        return (
          <button
            key={option.id}
            onClick={() => setMode(option.id as any)}
            className={cn(
              "flex-1 relative flex items-center justify-center gap-2 h-11 px-4 rounded-xl transition-all duration-300 z-10",
              isActive ? "text-primary font-black" : "text-neutral hover:text-foreground font-bold"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-theme"
                className="absolute inset-0 bg-white shadow-lg rounded-xl z-[-1]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <option.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-neutral/60")} />
            <span className="text-[10px] uppercase tracking-widest">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
