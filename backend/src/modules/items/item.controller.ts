import { Request, Response, NextFunction } from 'express';
import { Item } from '../../models/Item';

export const createItem = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const item = await Item.create({
      ...req.body,
      userId: req.user!.id,
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const getAllItems = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const items = await Item.find({
      userId: req.user!.id,
      isDeleted: false,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const getItem = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      userId: req.user!.id,
      isDeleted: false,
    });
    if (!item) {
      return res.status(404).json({ success: false, error: 'ITEM_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const item = await Item.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: false,
      },
      { $set: req.body },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, error: 'ITEM_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const item = await Item.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: false,
      },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, error: 'ITEM_NOT_FOUND' });
    }
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTrashedItems = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const items = await Item.find({
      userId: req.user!.id,
      isDeleted: true,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const restoreItem = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const item = await Item.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: true,
      },
      { $set: { isDeleted: false, deletedAt: undefined } },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, error: 'ITEM_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: item, message: 'Item restored successfully' });
  } catch (error) {
    next(error);
  }
};
