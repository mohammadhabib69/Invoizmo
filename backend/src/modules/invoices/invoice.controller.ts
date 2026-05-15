import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../../models/Invoice';
import { User } from '../../models/User';

export const getNextInvoiceNumber = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
    }
    const nextNumber = `${user.invoicePrefix}-${String(user.invoiceCounter + 1).padStart(4, '0')}`;
    res.status(200).json({ success: true, data: { invoiceNumber: nextNumber } });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
    }

    const { invoiceDate, dueDate, lineItems, subtotal: reqSubtotal, taxPercentage: reqTaxPercentage, taxAmount: reqTaxAmount, total: reqTotal, ...rest } = req.body;

    const subtotal = lineItems ? lineItems.reduce((sum: number, item: any) => sum + item.total, 0) : reqSubtotal || 0;
    const taxPercentage = reqTaxPercentage || 0;
    const taxAmount = (subtotal * taxPercentage) / 100;
    const total = subtotal + taxAmount;

    const invoice = await Invoice.create({
      ...rest,
      userId: req.user!.id,
      invoiceNumber: rest.invoiceNumber || `INV-${String(user.invoiceCounter + 1).padStart(4, '0')}`,
      invoiceDate: new Date(invoiceDate),
      dueDate: new Date(dueDate),
      lineItems: lineItems || [],
      subtotal,
      taxPercentage,
      taxAmount,
      total,
    });

    user.invoiceCounter += 1;
    await user.save();

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const getAllInvoices = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const { q, status } = req.query;
    const query: any = { userId: req.user!.id, isDeleted: false };
    
    if (status) {
      query.status = status;
    }

    if (q) {
      query.$or = [
        { invoiceNumber: { $regex: q, $options: 'i' } },
        { 'client.name': { $regex: q, $options: 'i' } },
        { 'client.email': { $regex: q, $options: 'i' } },
      ];
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

export const getInvoice = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user!.id,
      isDeleted: false,
    });
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'INVOICE_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const { invoiceDate, dueDate, lineItems, subtotal: reqSubtotal, taxPercentage: reqTaxPercentage, taxAmount: reqTaxAmount, total: reqTotal, ...rest } = req.body;

    let updateData: any = { ...rest };

    if (invoiceDate) updateData.invoiceDate = new Date(invoiceDate);
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (lineItems) updateData.lineItems = lineItems;

    if (lineItems || reqSubtotal !== undefined || reqTaxPercentage !== undefined) {
      const currentInvoice = await Invoice.findOne({
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: false,
      });

      if (!currentInvoice) {
        return res.status(404).json({ success: false, error: 'INVOICE_NOT_FOUND' });
      }

      const itemsToUse = lineItems || currentInvoice.lineItems;
      const subtotal = itemsToUse.reduce((sum: number, item: any) => sum + item.total, 0);
      const taxPercentage = reqTaxPercentage !== undefined ? reqTaxPercentage : currentInvoice.taxPercentage;
      const taxAmount = (subtotal * taxPercentage) / 100;
      const total = subtotal + taxAmount;

      updateData.subtotal = subtotal;
      updateData.taxPercentage = taxPercentage;
      updateData.taxAmount = taxAmount;
      updateData.total = total;
    }

    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: false,
      },
      { $set: updateData },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ success: false, error: 'INVOICE_NOT_FOUND' });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceStatus = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: false,
      },
      { $set: { status } },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ success: false, error: 'INVOICE_NOT_FOUND' });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const getInvoicePreview = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user!.id,
      isDeleted: false,
    });
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'INVOICE_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const getInvoicePDF = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user!.id,
      isDeleted: false,
    });
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'INVOICE_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: invoice, message: 'PDF generation endpoint (placeholder)' });
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: false,
      },
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'INVOICE_NOT_FOUND' });
    }
    res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTrashedInvoices = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const invoices = await Invoice.find({
      userId: req.user!.id,
      isDeleted: true,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

export const restoreInvoice = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: true,
      },
      { $set: { isDeleted: false } },
      { new: true }
    );
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'INVOICE_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: invoice, message: 'Invoice restored successfully' });
  } catch (error) {
    next(error);
  }
};
