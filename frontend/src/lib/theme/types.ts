export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorTheme =
  | 'slate'
  | 'blue'
  | 'purple'
  | 'emerald'
  | 'rose'
  | 'amber'
  | 'cyan'
  | 'violet';

export interface CustomThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemeState {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  customColors?: CustomThemeColors;
}

export interface PredefinedTheme {
  name: ColorTheme;
  label: string;
  primary: string;
  description: string;
}
