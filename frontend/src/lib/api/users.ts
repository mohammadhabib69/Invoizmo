import { fetchApi } from './client';

export interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  businessAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  businessPhone?: string;
  businessEmail?: string;
  businessWebsite?: string;
  logoUrl?: string;
  defaultCurrency: string;
  defaultTaxRate: number;
  defaultPaymentTerms: number;
  defaultNotes?: string;
  invoicePrefix: string;
  defaultTemplate: string;
  accentColor: string;
  themeMode: 'light' | 'dark' | 'system';
}

export const usersApi = {
  getProfile: async (): Promise<UserProfile> => {
    return fetchApi('/users/me');
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return fetchApi('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  uploadLogo: async (file: File): Promise<{ logoUrl: string }> => {
    const formData = new FormData();
    formData.append('logo', file);
    return fetchApi('/users/logo', {
      method: 'POST',
      body: formData,
    });
  },
};
