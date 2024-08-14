import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { OrderNotifcation } from '@francislagares/jobber-shared';

import { getNotificationsById } from '@order/services/notification.service';

export const notificationsById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const notifications: OrderNotifcation[] = await getNotificationsById(
    req.params.userTo,
  );

  res.status(StatusCodes.OK).json({ message: 'Notifications', notifications });
};
