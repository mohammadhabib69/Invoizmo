import { Request, Response, NextFunction } from 'express';
import { Client } from '../../models/Client';

export const createClient = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const client = await Client.create({
      ...req.body,
      userId: req.user!.id,
    });
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

export const getAllClients = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const clients = await Client.find({
      userId: req.user!.id,
      isDeleted: false,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
};

export const getClient = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user!.id,
      isDeleted: false,
    });
    if (!client) {
      return res.status(404).json({ success: false, error: 'CLIENT_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: false,
      },
      { $set: req.body },
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ success: false, error: 'CLIENT_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: false,
      },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ success: false, error: 'CLIENT_NOT_FOUND' });
    }
    res.status(200).json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTrashedClients = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const clients = await Client.find({
      userId: req.user!.id,
      isDeleted: true,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
};

export const restoreClient = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        isDeleted: true,
      },
      { $set: { isDeleted: false, deletedAt: undefined } },
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ success: false, error: 'CLIENT_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: client, message: 'Client restored successfully' });
  } catch (error) {
    next(error);
  }
};
