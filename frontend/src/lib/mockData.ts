export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Sent' | 'Overdue' | 'Draft';
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  totalInvoiced: number;
  invoiceCount: number;
  color: string;
}

export interface Item {
  id: string;
  name: string;
  unit: string;
  price: number;
  tax: number;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  method: 'Stripe' | 'Bank Transfer' | 'PayPal' | 'Cash';
  date: string;
}

export const invoices: Invoice[] = [
  { id: '1', number: 'INV-001', clientName: 'Acme Corporation', clientEmail: 'billing@acme.com', date: '2024-05-15', dueDate: '2024-06-15', amount: 2500.00, status: 'Paid' },
  { id: '2', number: 'INV-002', clientName: 'Tech Solutions Inc', clientEmail: 'accounts@techsolutions.com', date: '2024-05-12', dueDate: '2024-06-12', amount: 1800.00, status: 'Pending' },
  { id: '3', number: 'INV-003', clientName: 'Design Studio', clientEmail: 'hello@designstudio.io', date: '2024-05-10', dueDate: '2024-06-10', amount: 950.00, status: 'Paid' },
  { id: '4', number: 'INV-004', clientName: 'StartupXYZ', clientEmail: 'finance@startupxyz.com', date: '2024-05-01', dueDate: '2024-05-15', amount: 3200.00, status: 'Overdue' },
  { id: '5', number: 'INV-005', clientName: 'Marketing Agency', clientEmail: 'invoice@marketingagency.com', date: '2024-04-28', dueDate: '2024-05-28', amount: 1500.00, status: 'Paid' },
  { id: '6', number: 'INV-006', clientName: 'Global Logistics', clientEmail: 'billing@globallog.com', date: '2024-05-18', dueDate: '2024-06-18', amount: 4500.00, status: 'Sent' },
  { id: '7', number: 'INV-007', clientName: 'Pioneer Soft', clientEmail: 'accounts@pioneersoft.com', date: '2024-05-20', dueDate: '2024-06-20', amount: 1200.00, status: 'Draft' },
  { id: '8', number: 'INV-008', clientName: 'Creative Minds', clientEmail: 'contact@creativeminds.com', date: '2024-05-22', dueDate: '2024-06-22', amount: 2100.00, status: 'Sent' },
];

export const clients: Client[] = [
  { id: '1', name: 'John Doe', company: 'Acme Corporation', email: 'john@acme.com', totalInvoiced: 12500, invoiceCount: 5, color: '#FF5733' },
  { id: '2', name: 'Sarah Smith', company: 'Tech Solutions Inc', email: 'sarah@techsolutions.com', totalInvoiced: 8400, invoiceCount: 3, color: '#33FF57' },
  { id: '3', name: 'Mike Johnson', company: 'Design Studio', email: 'mike@designstudio.io', totalInvoiced: 4200, invoiceCount: 4, color: '#3357FF' },
  { id: '4', name: 'Emily Brown', company: 'StartupXYZ', email: 'emily@startupxyz.com', totalInvoiced: 15600, invoiceCount: 6, color: '#F333FF' },
  { id: '5', name: 'David Wilson', company: 'Marketing Agency', email: 'david@marketingagency.com', totalInvoiced: 9800, invoiceCount: 2, color: '#FF33A8' },
  { id: '6', name: 'Lisa Anderson', company: 'Global Logistics', email: 'lisa@globallog.com', totalInvoiced: 21000, invoiceCount: 8, color: '#33FFF3' },
];

export const items: Item[] = [
  { id: '1', name: 'Web Design', unit: 'Project', price: 1500.00, tax: 10 },
  { id: '2', name: 'Logo Design', unit: 'Flat', price: 500.00, tax: 5 },
  { id: '3', name: 'SEO Optimization', unit: 'Month', price: 800.00, tax: 12 },
  { id: '4', name: 'Content Writing', unit: 'Word', price: 0.15, tax: 0 },
  { id: '5', name: 'Social Media Management', unit: 'Month', price: 1200.00, tax: 10 },
];

export const payments: Payment[] = [
  { id: '1', invoiceNumber: 'INV-001', clientName: 'Acme Corporation', amount: 2500.00, method: 'Stripe', date: '2024-05-16' },
  { id: '2', invoiceNumber: 'INV-003', clientName: 'Design Studio', amount: 950.00, method: 'Bank Transfer', date: '2024-05-14' },
  { id: '3', invoiceNumber: 'INV-005', clientName: 'Marketing Agency', amount: 1500.00, method: 'PayPal', date: '2024-05-10' },
  { id: '4', invoiceNumber: 'INV-010', clientName: 'Creative Minds', amount: 1200.00, method: 'Cash', date: '2024-05-08' },
  { id: '5', invoiceNumber: 'INV-012', clientName: 'Tech Solutions Inc', amount: 3000.00, method: 'Stripe', date: '2024-05-05' },
  { id: '6', invoiceNumber: 'INV-014', clientName: 'StartupXYZ', amount: 450.00, method: 'Bank Transfer', date: '2024-05-01' },
  { id: '7', invoiceNumber: 'INV-015', clientName: 'Global Logistics', amount: 5600.00, method: 'Stripe', date: '2024-04-28' },
  { id: '8', invoiceNumber: 'INV-018', clientName: 'Pioneer Soft', amount: 1100.00, method: 'PayPal', date: '2024-04-25' },
  { id: '9', invoiceNumber: 'INV-020', clientName: 'Acme Corporation', amount: 2200.00, method: 'Bank Transfer', date: '2024-04-20' },
  { id: '10', invoiceNumber: 'INV-022', clientName: 'Design Studio', amount: 800.00, method: 'Stripe', date: '2024-04-15' },
];

export const analyticsData = {
  monthlyRevenue: [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 5000 },
    { name: 'Apr', amount: 4500 },
    { name: 'May', amount: 6000 },
    { name: 'Jun', amount: 5500 },
  ],
  statusBreakdown: [
    { name: 'Paid', value: 45, color: '#0f1117' },
    { name: 'Pending', value: 25, color: '#FBCC14' },
    { name: 'Overdue', value: 15, color: '#EF4444' },
    { name: 'Draft', value: 15, color: '#94A3B8' },
  ],
  topClients: [
    { name: 'Global Logistics', amount: 21000 },
    { name: 'StartupXYZ', amount: 15600 },
    { name: 'Acme Corp', amount: 12500 },
    { name: 'Marketing Agency', amount: 9800 },
    { name: 'Tech Solutions', amount: 8400 },
  ]
};

export const analyticsDashboardStats = {
  kpis: {
    totalRevenue: 124500,
    totalClients: 42,
    totalPaidInvoices: 156,
    avgPaymentDays: 12,
  },
  revenueChart: analyticsData.monthlyRevenue,
  statusBreakdown: analyticsData.statusBreakdown,
  topClients: analyticsData.topClients,
  recentActivity: [
    { type: 'Payment', desc: 'Payment received from Acme Corp', date: '2024-05-16T10:00:00Z', amount: '$2,500.00' },
    { type: 'Invoice', desc: 'New invoice INV-009 sent to Tech Solutions', date: '2024-05-15T14:30:00Z', amount: '$1,800.00' },
    { type: 'Payment', desc: 'Payment received from Design Studio', date: '2024-05-14T09:15:00Z', amount: '$950.00' },
    { type: 'Invoice', desc: 'Invoice INV-004 is now overdue', date: '2024-05-14T00:00:00Z', amount: '$3,200.00', warning: true },
    { type: 'Payment', desc: 'Payment received from Marketing Agency', date: '2024-05-10T16:45:00Z', amount: '$1,500.00' },
  ]
};

export const mockProfile = {
  businessName: 'Antigravity Creative Studio',
  businessEmail: 'hello@antigravity.design',
  businessWebsite: 'antigravity.design',
  taxId: 'TX-99887766',
  logoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
  accentColor: '#C8E600',
  businessAddress: {
    line1: '123 Gravity Lane, Space City, Mars 45678',
  },
  notifications: {
    paymentReceived: true,
    invoiceOverdue: true,
    newClientActivity: false,
    weeklyReports: true,
  }
};
