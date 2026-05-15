import mongoose, { Schema, Document } from 'mongoose';

interface ILineItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
  total: number;
}

interface ICustomization {
  [key: string]: any;
}

interface ISender {
  [key: string]: any;
}

interface IClient {
  [key: string]: any;
}

export interface IInvoiceDoc extends Document {
  userId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  status: string;
  template: string;
  customization?: ICustomization;
  sender?: ISender;
  client?: IClient;
  lineItems: ILineItem[];
  currency: string;
  taxPercentage: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  notes?: string;
  invoiceDate: Date;
  dueDate: Date;
  isDeleted: boolean;
}

const lineItemSchema = new Schema<ILineItem>({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  unit: { type: String },
  total: { type: Number, required: true },
});

const invoiceSchema = new Schema<IInvoiceDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    invoiceNumber: { type: String, required: true },
    status: { type: String, default: 'draft' },
    template: { type: String, default: 'modern' },
    customization: { type: Object },
    sender: { type: Object },
    client: { type: Object },
    lineItems: [lineItemSchema],
    currency: { type: String, default: 'USD' },
    taxPercentage: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    notes: { type: String, default: '' },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model<IInvoiceDoc>('Invoice', invoiceSchema);