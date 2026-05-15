import { z } from 'zod';

export const recordPaymentSchema = z.object({
  body: z.object({
    invoiceId: z.string().optional(),
    clientId: z.string().optional(),
    amount: z.number().min(0),
    currency: z.string().default('USD'),
    paymentDate: z.string().optional(),
    paymentMethod: z.enum([
      'bank_transfer',
      'cash',
      'cheque',
      'card',
      'paypal',
      'crypto',
      'other',
    ]),
    reference: z.string().optional(),
    notes: z.string().optional(),
  }),
});
