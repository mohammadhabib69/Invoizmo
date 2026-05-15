import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'invoice_sent' | 'invoice_viewed' | 'invoice_paid' | 'invoice_overdue' | 'payment_received' | 'reminder' | 'system';
  title: string;
  message: string;
  relatedId?: mongoose.Types.ObjectId;
  relatedType?: 'invoice' | 'payment' | 'client';
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['invoice_sent', 'invoice_viewed', 'invoice_paid', 'invoice_overdue', 'payment_received', 'reminder', 'system'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: { type: Schema.Types.ObjectId },
    relatedType: { type: String, enum: ['invoice', 'payment', 'client'] },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, isDeleted: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
