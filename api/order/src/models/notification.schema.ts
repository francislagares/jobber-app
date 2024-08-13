import { model, Model, Schema } from 'mongoose';

import { OrderNotifcation } from '@francislagares/jobber-shared';

const notificationSchema: Schema = new Schema({
  userTo: { type: String, default: '', index: true },
  senderUsername: { type: String, default: '' },
  senderPicture: { type: String, default: '' },
  receiverUsername: { type: String, default: '' },
  receiverPicture: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  message: { type: String, default: '' },
  orderId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const OrderNotificationModel: Model<OrderNotifcation> = model<OrderNotifcation>(
  'OrderNotification',
  notificationSchema,
  'OrderNotification',
);
export { OrderNotificationModel };
