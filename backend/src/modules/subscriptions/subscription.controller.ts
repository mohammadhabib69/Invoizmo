import { Request, Response, NextFunction } from 'express';
import { Subscription } from '../../models/Subscription';
import { User } from '../../models/User';

export const getSubscription = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    let subscription = await Subscription.findOne({
      userId: req.user!.id,
      isDeleted: false,
    });

    if (!subscription) {
      subscription = await Subscription.create({
        userId: req.user!.id,
        plan: 'free',
        status: 'active',
        startDate: new Date(),
      });
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const { plan } = req.body;

    let subscription = await Subscription.findOne({
      userId: req.user!.id,
      isDeleted: false,
    });

    if (!subscription) {
      subscription = await Subscription.create({
        userId: req.user!.id,
        plan,
        status: 'active',
        startDate: new Date(),
      });
    } else {
      subscription.plan = plan;
      await subscription.save();
    }

    const user = await User.findById(req.user!.id);
    if (user) {
      user.plan = plan;
      await user.save();
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      {
        userId: req.user!.id,
        isDeleted: false,
      },
      {
        $set: {
          status: 'cancelled',
          endDate: new Date(),
        },
      },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'SUBSCRIPTION_NOT_FOUND' });
    }

    const user = await User.findById(req.user!.id);
    if (user) {
      user.plan = 'free';
      await user.save();
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};
