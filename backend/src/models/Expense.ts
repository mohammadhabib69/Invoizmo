import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  category: string;
  description: string;
  amount: number;
  currency: string;
  receiptUrl?: string;
  notes?: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    category: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    receiptUrl: { type: String },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

expenseSchema.index({ userId: 1, isDeleted: 1, date: -1 });
expenseSchema.index({ userId: 1, isDeleted: 1, category: 1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
