import { OrderDocument, OrderNotifcation } from '@francislagares/jobber-shared';

import { OrderNotificationModel } from '@order/models/notification.schema';
import { socketIOOrderObject } from '@order/server';

import { getOrderByOrderId } from './order.service';

export const createNotification = async (
  data: OrderNotifcation,
): Promise<OrderNotifcation> => {
  const notification: OrderNotifcation =
    await OrderNotificationModel.create(data);

  return notification;
};

export const getNotificationsById = async (
  userToId: string,
): Promise<OrderNotifcation[]> => {
  const notifications: OrderNotifcation[] =
    await OrderNotificationModel.aggregate([{ $match: { userTo: userToId } }]);

  return notifications;
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<OrderNotifcation> => {
  const notification: OrderNotifcation =
    (await OrderNotificationModel.findOneAndUpdate(
      { _id: notificationId },
      {
        $set: {
          isRead: true,
        },
      },
      { new: true },
    )) as OrderNotifcation;
  const order: OrderDocument = await getOrderByOrderId(notification.orderId);

  socketIOOrderObject.emit('order notification', order, notification);

  return notification;
};

export const sendNotification = async (
  data: OrderDocument,
  userToId: string,
  message: string,
): Promise<void> => {
  const notification: OrderNotifcation = {
    userTo: userToId,
    senderUsername: data.sellerUsername,
    senderPicture: data.sellerImage,
    receiverUsername: data.buyerUsername,
    receiverPicture: data.buyerImage,
    message,
    orderId: data.orderId,
  } as OrderNotifcation;
  const orderNotification: OrderNotifcation =
    await createNotification(notification);

  socketIOOrderObject.emit('order notification', data, orderNotification);
};
