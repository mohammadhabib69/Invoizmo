import { z } from 'zod';

export const createInvoiceSchema = z.object({
  body: z.object({
    invoiceNumber: z.string().optional(),
    status: z.string().default('draft'),
    template: z.string().default('modern'),
    customization: z.any().optional(),
    sender: z.any().optional(),
    client: z.any().optional(),
    lineItems: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
      unit: z.string().optional(),
      total: z.number().min(0),
    })),
    currency: z.string().default('USD'),
    taxPercentage: z.number().default(0),
    taxAmount: z.number().default(0).optional(),
    subtotal: z.number().min(0).optional(),
    total: z.number().min(0).optional(),
    notes: z.string().optional().default(''),
    invoiceDate: z.string(),
    dueDate: z.string(),
  }),
});

export const updateInvoiceSchema = z.object({
  body: z.object({
    invoiceNumber: z.string().optional(),
    status: z.string().optional(),
    template: z.string().optional(),
    customization: z.any().optional(),
    sender: z.any().optional(),
    client: z.any().optional(),
    lineItems: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
      unit: z.string().optional(),
      total: z.number().min(0),
    })).optional(),
    currency: z.string().optional(),
    taxPercentage: z.number().min(0).max(100).optional(),
    taxAmount: z.number().min(0).optional(),
    subtotal: z.number().min(0).optional(),
    total: z.number().min(0).optional(),
    notes: z.string().optional(),
    invoiceDate: z.string().optional(),
    dueDate: z.string().optional(),
  }),
});
