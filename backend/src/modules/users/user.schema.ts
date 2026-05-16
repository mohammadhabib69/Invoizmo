import { z } from 'zod';

const customThemeColorsSchema = z.object({
  primary: z.string(),
  primaryForeground: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  foreground: z.string(),
  muted: z.string(),
  mutedForeground: z.string(),
  border: z.string(),
  input: z.string(),
  ring: z.string(),
});

export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    businessName: z.string().optional(),
    businessPhone: z.string().optional(),
    businessEmail: z.string().email().optional(),
    businessWebsite: z.string().url().optional(),
    defaultCurrency: z.string().optional(),
    defaultTaxRate: z.number().min(0).max(100).optional(),
    defaultPaymentTerms: z.number().min(1).optional(),
    defaultNotes: z.string().optional(),
    invoicePrefix: z.string().optional(),
    defaultTemplate: z.enum(['classic', 'modern', 'minimal']).optional(),
    accentColor: z.string().optional(),
    themeMode: z.enum(['light', 'dark', 'system']).optional(),
    colorTheme: z.string().optional(),
    customThemeColors: customThemeColorsSchema.optional(),
    logoUrl: z.string().url().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
  }),
});
