import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../../models/Invoice';
import { Payment } from '../../models/Payment';

export const getDashboardStats = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!.id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // KPI Metrics
    const totalRevenueMtd = await Invoice.aggregate([
      { $match: { userId, status: 'paid', createdAt: { $gte: startOfMonth }, isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const totalRevenue = await Invoice.aggregate([
      { $match: { userId, status: 'paid', isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const totalPaidInvoices = await Invoice.countDocuments({
      userId,
      status: 'paid',
      isDeleted: false,
    });

    const totalClients = await mongoose.model('Client').countDocuments({
      userId,
      isDeleted: false,
    });

    const totalInvoicesMtd = await Invoice.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth },
      isDeleted: false,
    });

    const overdueCount = await Invoice.countDocuments({
      userId,
      status: 'overdue',
      isDeleted: false,
    });

    const outstandingAmount = await Invoice.aggregate([
      { $match: { userId, status: { $in: ['sent', 'viewed', 'overdue', 'partially_paid'] }, isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    // Average Payment Days
    const avgPaymentStats = await Payment.aggregate([
      { $match: { userId, isDeleted: false, invoiceId: { $ne: null } } },
      {
        $lookup: {
          from: 'invoices',
          localField: 'invoiceId',
          foreignField: '_id',
          as: 'invoice'
        }
      },
      { $unwind: '$invoice' },
      {
        $project: {
          daysToPay: {
            $divide: [
              { $subtract: ['$paymentDate', '$invoice.invoiceDate'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      { $group: { _id: null, avgDays: { $avg: '$daysToPay' } } }
    ]);

    // Revenue Chart (Last 6 Months)
    const revenueChart = await Invoice.aggregate([
      { 
        $match: { 
          userId, 
          status: 'paid', 
          createdAt: { $gte: sixMonthsAgo },
          isDeleted: false 
        } 
      },
      {
        $group: {
          _id: { 
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          amount: { $sum: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Status Breakdown
    const statusBreakdown = await Invoice.aggregate([
      { $match: { userId, isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Top Clients
    const topClients = await Invoice.aggregate([
      { $match: { userId, status: 'paid', isDeleted: false } },
      { $group: { _id: '$client.name', amount: { $sum: '$total' } } },
      { $sort: { amount: -1 } },
      { $limit: 5 }
    ]);

    // Recent Activity (Combined)
    const recentInvoices = await Invoice.find({ userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('invoiceNumber client status total createdAt');

    const recentPayments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('clientId', 'name');

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalRevenueMtd: totalRevenueMtd[0]?.total || 0,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalInvoicesMtd,
          totalPaidInvoices,
          totalClients,
          overdueCount,
          outstandingAmount: outstandingAmount[0]?.total || 0,
          avgPaymentDays: Math.round(avgPaymentStats[0]?.avgDays || 0),
        },
        revenueChart: revenueChart.map(item => ({
          name: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
          amount: item.amount
        })),
        statusBreakdown: statusBreakdown.map(item => ({
          name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
          value: item.count,
          color: item._id === 'paid' ? '#10b981' : item._id === 'pending' ? '#f59e0b' : '#ef4444'
        })),
        topClients: topClients.map(item => ({
          name: item._id || 'Unknown',
          amount: item.amount
        })),
        recentActivity: [
          ...recentInvoices.map(inv => ({
            type: 'Invoice',
            desc: `Invoice ${inv.invoiceNumber} created for ${(inv.client as any)?.name || 'Client'}`,
            amount: `$${inv.total.toLocaleString()}`,
            date: inv.createdAt,
            status: inv.status
          })),
          ...recentPayments.map(pay => ({
            type: 'Payment',
            desc: `Received payment from ${(pay.clientId as any)?.name || 'Client'}`,
            amount: `+$${pay.amount.toLocaleString()}`,
            date: pay.createdAt,
            status: 'paid'
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)
      },
    });
  } catch (error) {
    next(error);
  }
};
