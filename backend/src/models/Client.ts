import mongoose, { Schema, Document } from 'mongoose';

interface IClientAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IClient extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: IClientAddress;
  taxId?: string;
  currency: string;
  notes?: string;
  totalInvoiced: number;
  totalPaid: number;
  isDeleted: boolean;
  deletedAt?: Date;
}

const clientAddressSchema = new Schema<IClientAddress>({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const clientSchema = new Schema<IClient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    company: { type: String },
    website: { type: String },
    address: clientAddressSchema,
    taxId: { type: String },
    currency: { type: String, default: 'USD' },
    notes: { type: String },
    totalInvoiced: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

clientSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });
clientSchema.index({ userId: 1, name: 1 });
clientSchema.index({ userId: 1, email: 1 });

export const Client = mongoose.model<IClient>('Client', clientSchema);