import express, { Router } from 'express';

import { validateRequest } from '@francislagares/jobber-shared';

import { notificationsById } from '@order/controllers/notification/get';
import {
  orderCreate,
  stripePaymentIntent,
} from '@order/controllers/order/create';
import {
  buyerOrders,
  orderId,
  sellerOrders,
} from '@order/controllers/order/get';
import {
  buyerApproveOrder,
  cancel,
  deliverOrder,
  deliveryDate,
  requestExtension,
} from '@order/controllers/order/update';
import { orderSchema, orderUpdateSchema } from '@order/schemes/order';
import { markNotificationAsRead } from '@order/services/notification.service';

const router: Router = express.Router();

const orderRoutes = (): Router => {
  router.get('/notification/:userTo', notificationsById);
  router.get('/:orderId', orderId);
  router.get('/seller/:sellerId', sellerOrders);
  router.get('/buyer/:buyerId', buyerOrders);

  router.post('/', validateRequest(orderSchema), orderCreate);
  router.post(
    '/create-payment-intent',
    validateRequest(orderSchema),
    stripePaymentIntent,
  );

  router.put('/cancel/:orderId', cancel);
  router.put(
    '/extension/:orderId',
    validateRequest(orderUpdateSchema),
    requestExtension,
  );
  router.put('/deliver-order/:orderId', deliverOrder);
  router.put('/approve-order/:orderId', buyerApproveOrder);
  router.put(
    '/gig/:type/:orderId',
    validateRequest(orderUpdateSchema),
    deliveryDate,
  );
  router.put('/notification/mark-as-read', markNotificationAsRead);

  return router;
};

export { orderRoutes };
