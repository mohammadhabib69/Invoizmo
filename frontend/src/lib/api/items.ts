import { client } from './client';

export interface Item {
  _id: string;
  name: string;
  description?: string;
  price: number;
  tax: number;
  unit?: string;
  category?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export const itemsApi = {
  getItems: async () => {
    const response = await client.get('/items');
    return response.data.data as Item[];
  },

  getItem: async (id: string) => {
    const response = await client.get(`/items/${id}`);
    return response.data.data as Item;
  },

  createItem: async (data: Partial<Item>) => {
    const response = await client.post('/items', data);
    return response.data.data as Item;
  },

  updateItem: async (id: string, data: Partial<Item>) => {
    const response = await client.patch(`/items/${id}`, data);
    return response.data.data as Item;
  },

  deleteItem: async (id: string) => {
    const response = await client.delete(`/items/${id}`);
    return response.data;
  },
};
