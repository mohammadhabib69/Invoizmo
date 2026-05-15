import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'free' | 'pro' | 'business';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  startDate: Date;
  endDate?: Date;
  paymentProvider?: string;
  subscriptionId?: string;
  customerId?: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan: { type: String, enum: ['free', 'pro', 'business'], required: true, default: 'free' },
    status: { type: String, enum: ['active', 'cancelled', 'past_due', 'trialing'], required: true, default: 'active' },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    paymentProvider: { type: String },
    subscriptionId: { type: String },
    customerId: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

subscriptionSchema.index({ status: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
