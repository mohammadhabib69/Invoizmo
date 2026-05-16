import { client } from './client';

export interface InvoiceLineItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
  total: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'partially_paid' | 'void' | 'trashed';
  template: string;
  client: any; // Can be string ID or populated object
  lineItems: InvoiceLineItem[];
  currency: string;
  taxPercentage: number;
  taxAmount: number;
  subtotal: number;
  discountPercentage?: number;
  discountAmount?: number;
  total: number;
  amountPaid: number;
  amountRemaining: number;
  notes?: string;
  invoiceDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export const invoicesApi = {
  getInvoices: async (params?: any) => {
    const response = await client.get('/invoices', { params });
    return response.data.data as Invoice[];
  },

  getInvoice: async (id: string) => {
    const response = await client.get(`/invoices/${id}`);
    return response.data.data as Invoice;
  },

  getNextInvoiceNumber: async () => {
    const response = await client.get('/invoices/next-number');
    return response.data.data as string;
  },

  createInvoice: async (data: Partial<Invoice>) => {
    const response = await client.post('/invoices', data);
    return response.data.data as Invoice;
  },

  updateInvoice: async (id: string, data: Partial<Invoice>) => {
    const response = await client.patch(`/invoices/${id}`, data);
    return response.data.data as Invoice;
  },

  updateInvoiceStatus: async (id: string, status: string) => {
    const response = await client.patch(`/invoices/${id}/status`, { status });
    return response.data.data as Invoice;
  },

  deleteInvoice: async (id: string) => {
    const response = await client.delete(`/invoices/${id}`);
    return response.data;
  },

  getTrashedInvoices: async () => {
    const response = await client.get('/invoices/trash');
    return response.data.data as Invoice[];
  },

  restoreInvoice: async (id: string) => {
    const response = await client.patch(`/invoices/${id}/restore`);
    return response.data.data as Invoice;
  },
};
