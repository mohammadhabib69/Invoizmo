import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  invoiceId?: mongoose.Types.ObjectId;
  clientId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentDate: Date;
  paymentMethod: 'bank_transfer' | 'cash' | 'cheque' | 'card' | 'paypal' | 'crypto' | 'other';
  reference?: string;
  notes?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentDate: { type: Date, required: true, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'cash', 'cheque', 'card', 'paypal', 'crypto', 'other'],
      required: true,
    },
    reference: { type: String },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });
paymentSchema.index({ userId: 1, invoiceId: 1 });
paymentSchema.index({ userId: 1, clientId: 1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);