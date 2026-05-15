import { z } from 'zod';

export const createItemSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    unitPrice: z.number().min(0),
    unit: z.string().default('unit'),
    taxable: z.boolean().default(true),
  }),
});

export const updateItemSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    unitPrice: z.number().min(0).optional(),
    unit: z.string().optional(),
    taxable: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
