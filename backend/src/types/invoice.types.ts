export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number; // in cents
  total: number; // in cents
}

export interface IInvoice {
  invoiceNumber: string;
  clientId: string;
  userId: string;
  items: IInvoiceItem[];
  subtotal: number; // in cents
  taxRate: number; // percentage
  taxAmount: number; // in cents
  total: number; // in cents
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: Date;
  dueDate: Date;
  notes?: string;
}