import { client } from './client';

export interface DashboardStats {
  kpis: {
    totalRevenueMtd: number;
    totalRevenue: number;
    totalInvoicesMtd: number;
    totalPaidInvoices: number;
    totalClients: number;
    overdueCount: number;
    outstandingAmount: number;
    avgPaymentDays: number;
  };
  revenueChart: {
    name: string;
    amount: number;
  }[];
  statusBreakdown: {
    name: string;
    value: number;
    color: string;
  }[];
  topClients: {
    name: string;
    amount: number;
  }[];
  recentActivity: {
    type: 'Invoice' | 'Payment';
    desc: string;
    amount: string;
    date: string;
    status: string;
    warning?: boolean;
  }[];
}

export const analyticsApi = {
  getDashboardStats: async () => {
    const response = await client.get('/analytics/dashboard');
    return response.data.data as DashboardStats;
  },
};
