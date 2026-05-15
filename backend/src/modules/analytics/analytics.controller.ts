import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../../models/Invoice';
import { Payment } from '../../models/Payment';

export const getDashboardStats = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalRevenueMtd = await Invoice.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user!.id), status: 'paid', createdAt: { $gte: startOfMonth }, isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);

    const totalInvoicesMtd = await Invoice.countDocuments({
      userId: req.user!.id,
      createdAt: { $gte: startOfMonth },
      isDeleted: false,
    });

    const overdueCount = await Invoice.countDocuments({
      userId: req.user!.id,
      status: 'overdue',
      isDeleted: false,
    });

    const outstandingAmount = await Invoice.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user!.id), status: { $in: ['sent', 'viewed', 'overdue'] }, isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$amountDue' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenueMtd: totalRevenueMtd[0]?.total || 0,
        totalInvoicesMtd,
        overdueCount,
        outstandingAmount: outstandingAmount[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
