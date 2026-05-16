import { client } from './client';

export interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  taxId?: string;
  currency: string;
  notes?: string;
  totalInvoiced: number;
  totalPaid: number;
  createdAt: string;
  updatedAt: string;
}

export const clientsApi = {
  getClients: async () => {
    const response = await client.get('/clients');
    return response.data.data as Client[];
  },

  getClient: async (id: string) => {
    const response = await client.get(`/clients/${id}`);
    return response.data.data as Client;
  },

  createClient: async (data: Partial<Client>) => {
    const response = await client.post('/clients', data);
    return response.data.data as Client;
  },

  updateClient: async (id: string, data: Partial<Client>) => {
    const response = await client.patch(`/clients/${id}`, data);
    return response.data.data as Client;
  },

  deleteClient: async (id: string) => {
    const response = await client.delete(`/clients/${id}`);
    return response.data;
  },
};
