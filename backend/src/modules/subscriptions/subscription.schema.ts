import { z } from 'zod';

export const updatePlanSchema = z.object({
  body: z.object({
    plan: z.enum(['free', 'pro', 'business']),
  }),
});
