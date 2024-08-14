import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { OrderNotifcation } from '@francislagares/jobber-shared';

import { markNotificationAsRead } from '@order/services/notification.service';

export const markSingleNotificationAsRead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { notificationId } = req.body;
  const notification: OrderNotifcation =
    await markNotificationAsRead(notificationId);

  res
    .status(StatusCodes.OK)
    .json({ message: 'Notification updated successfully.', notification });
};
