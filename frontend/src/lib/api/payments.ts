import { client } from './client';

export interface Payment {
  _id: string;
  invoiceId?: {
    _id: string;
    invoiceNumber: string;
  };
  clientId?: {
    _id: string;
    name: string;
  };
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: 'bank_transfer' | 'cash' | 'cheque' | 'card' | 'paypal' | 'crypto' | 'other';
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const paymentsApi = {
  getPayments: async (params?: any) => {
    const response = await client.get('/payments', { params });
    return response.data.data as Payment[];
  },

  recordPayment: async (data: Partial<Payment>) => {
    const response = await client.post('/payments', data);
    return response.data.data as Payment;
  },

  deletePayment: async (id: string) => {
    const response = await client.delete(`/payments/${id}`);
    return response.data;
  },
};
