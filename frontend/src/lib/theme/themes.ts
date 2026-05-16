import type { PredefinedTheme, ColorTheme, CustomThemeColors } from './types';

export const PREDEFINED_THEMES: PredefinedTheme[] = [
  {
    name: 'slate',
    label: 'Slate',
    primary: '#1e293b',
    description: 'Default dark professional',
  },
  {
    name: 'blue',
    label: 'Blue',
    primary: '#3b82f6',
    description: 'Trustworthy blue',
  },
  {
    name: 'purple',
    label: 'Purple',
    primary: '#8b5cf6',
    description: 'Creative purple',
  },
  {
    name: 'emerald',
    label: 'Emerald',
    primary: '#10b981',
    description: 'Fresh green',
  },
  {
    name: 'rose',
    label: 'Rose',
    primary: '#f43f5e',
    description: 'Bold red',
  },
  {
    name: 'amber',
    label: 'Amber',
    primary: '#f59e0b',
    description: 'Warm orange',
  },
  {
    name: 'cyan',
    label: 'Cyan',
    primary: '#06b6d4',
    description: 'Techy cyan',
  },
  {
    name: 'violet',
    label: 'Violet',
    primary: '#8b5cf6',
    description: 'Soft violet',
  },
];

export const DEFAULT_THEME_COLORS: CustomThemeColors = {
  primary: 'hsl(222.2 47.4% 11.2%)',
  primaryForeground: 'hsl(210 40% 98%)',
  secondary: 'hsl(210 40% 96.1%)',
  accent: 'hsl(210 40% 96.1%)',
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222.2 84% 4.9%)',
  muted: 'hsl(210 40% 96.1%)',
  mutedForeground: 'hsl(215.4 16.3% 46.9%)',
  border: 'hsl(214.3 31.8% 91.4%)',
  input: 'hsl(214.3 31.8% 91.4%)',
  ring: 'hsl(222.2 84% 4.9%)',
};
