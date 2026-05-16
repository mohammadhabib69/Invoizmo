'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ThemeMode, ColorTheme, CustomThemeColors, ThemeState } from '@/lib/theme/types';
import {
  getInitialThemeMode,
  getInitialColorTheme,
  getInitialCustomColors,
  applyThemeMode,
  applyColorTheme,
  applyCustomColors,
  setupSystemThemeListener,
} from '@/lib/theme/utils';

interface ThemeContextType extends ThemeState {
  setMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setCustomColors: (colors: CustomThemeColors | undefined) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_STATE: ThemeState = {
  mode: 'light',
  colorTheme: 'slate',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('slate');
  const [customColors, setCustomColorsState] = useState<CustomThemeColors | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const initialMode = getInitialThemeMode();
    const initialColor = getInitialColorTheme();
    const initialCustom = getInitialCustomColors();

    setModeState(initialMode);
    setColorThemeState(initialColor);
    setCustomColorsState(initialCustom);

    applyThemeMode(initialMode);
    applyColorTheme(initialColor);
    if (initialCustom) {
      applyCustomColors(initialCustom);
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const cleanup = setupSystemThemeListener((isDark) => {
      if (mode === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(isDark ? 'dark' : 'light');
      }
    });

    return cleanup;
  }, [mode, isMounted]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    applyThemeMode(newMode);
  };

  const setColorTheme = (newTheme: ColorTheme) => {
    setColorThemeState(newTheme);
    applyColorTheme(newTheme);
  };

  const setCustomColors = (newColors: CustomThemeColors | undefined) => {
    setCustomColorsState(newColors);
    applyCustomColors(newColors);
  };

  const resetTheme = () => {
    setModeState('light');
    setColorThemeState('slate');
    setCustomColorsState(undefined);
    applyThemeMode('light');
    applyColorTheme('slate');
    applyCustomColors(undefined);
  };

  const value = useMemo(
    () => ({
      mode,
      colorTheme,
      customColors,
      setMode,
      setColorTheme,
      setCustomColors,
      resetTheme,
    }),
    [mode, colorTheme, customColors]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
