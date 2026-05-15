import { z } from 'zod';

export const createClientSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    website: z.string().url().optional(),
    taxId: z.string().optional(),
    currency: z.string().default('USD'),
    notes: z.string().optional(),
  }),
});

export const updateClientSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    website: z.string().url().optional(),
    taxId: z.string().optional(),
    currency: z.string().optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
