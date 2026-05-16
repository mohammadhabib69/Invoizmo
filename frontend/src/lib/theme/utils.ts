import type { ThemeMode, ColorTheme, CustomThemeColors } from './types';

export const THEME_STORAGE_KEY = 'invoizmo-theme';

export function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(`${THEME_STORAGE_KEY}-mode`);
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    return stored as ThemeMode;
  }
  return 'light';
}

export function getInitialColorTheme(): ColorTheme {
  if (typeof window === 'undefined') return 'slate';
  const stored = localStorage.getItem(`${THEME_STORAGE_KEY}-color`);
  if (stored) {
    return stored as ColorTheme;
  }
  return 'slate';
}

export function getInitialCustomColors(): CustomThemeColors | undefined {
  if (typeof window === 'undefined') return undefined;
  const stored = localStorage.getItem(`${THEME_STORAGE_KEY}-custom`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function applyThemeMode(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;
  
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  
  if (mode === 'system') {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(systemDark ? 'dark' : 'light');
  } else {
    root.classList.add(mode);
  }
  
  localStorage.setItem(`${THEME_STORAGE_KEY}-mode`, mode);
}

export function applyColorTheme(theme: ColorTheme): void {
  if (typeof window === 'undefined') return;
  
  const root = window.document.documentElement;
  root.removeAttribute('data-theme');
  root.setAttribute('data-theme', theme);
  
  localStorage.setItem(`${THEME_STORAGE_KEY}-color`, theme);
}

export function applyCustomColors(colors: CustomThemeColors | undefined): void {
  if (typeof window === 'undefined') return;
  
  const root = window.document.documentElement;
  
  if (colors) {
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--muted-foreground', colors.mutedForeground);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--input', colors.input);
    root.style.setProperty('--ring', colors.ring);
    
    localStorage.setItem(`${THEME_STORAGE_KEY}-custom`, JSON.stringify(colors));
  } else {
    root.style.removeProperty('--primary');
    root.style.removeProperty('--primary-foreground');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--background');
    root.style.removeProperty('--foreground');
    root.style.removeProperty('--muted');
    root.style.removeProperty('--muted-foreground');
    root.style.removeProperty('--border');
    root.style.removeProperty('--input');
    root.style.removeProperty('--ring');
    
    localStorage.removeItem(`${THEME_STORAGE_KEY}-custom`);
  }
}

export function setupSystemThemeListener(callback: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}
