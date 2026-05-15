import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  unitPrice: number;
  unit: string;
  taxable: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
}

const itemSchema = new Schema<IItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    unitPrice: { type: Number, required: true },
    unit: { type: String, default: 'unit' },
    taxable: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

itemSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });
itemSchema.index({ userId: 1, name: 1 });

export const Item = mongoose.model<IItem>('Item', itemSchema);