import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Payment } from '../../models/Payment';

export const recordPayment = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const { paymentDate, ...rest } = req.body;

    const payment = await Payment.create({
      ...rest,
      invoiceId: rest.invoiceId ? new mongoose.Types.ObjectId(rest.invoiceId) : undefined,
      clientId: rest.clientId ? new mongoose.Types.ObjectId(rest.clientId) : undefined,
      userId: req.user!.id,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const getAllPayments = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const payments = await Payment.find({
      userId: req.user!.id,
      isDeleted: false,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user!.id,
      isDeleted: false,
    });
    if (!payment) {
      return res.status(404).json({ success: false, error: 'PAYMENT_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const deletePayment = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: false,
      },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ success: false, error: 'PAYMENT_NOT_FOUND' });
    }
    res.status(200).json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTrashedPayments = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const payments = await Payment.find({
      userId: req.user!.id,
      isDeleted: true,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

export const restorePayment = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: true,
      },
      { $set: { isDeleted: false, deletedAt: undefined } },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ success: false, error: 'PAYMENT_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: payment, message: 'Payment restored successfully' });
  } catch (error) {
    next(error);
  }
};
