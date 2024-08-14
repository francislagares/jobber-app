import express, { Router } from 'express';

import { Order } from '@gateway/controllers/order';

class OrderRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const orderController = new Order();

    this.router.get(
      '/order/notification/:userTo',
      orderController.getNotifications,
    );
    this.router.get('/order/:orderId', orderController.getOrderById);
    this.router.get('/order/seller/:sellerId', orderController.sellerOrders);
    this.router.get('/order/buyer/:buyerId', orderController.buyerOrders);

    this.router.post('/order', orderController.createOrder);
    this.router.post(
      '/order/create-payment-intent',
      orderController.createOrderIntent,
    );

    this.router.put('/order/cancel/:orderId', orderController.cancelOrder);
    this.router.put(
      '/order/extension/:orderId',
      orderController.requestExtension,
    );
    this.router.put(
      '/order/deliver-order/:orderId',
      orderController.deliverOrder,
    );
    this.router.put(
      '/order/approve-order/:orderId',
      orderController.approveOrder,
    );
    this.router.put('/order/gig/:type/:orderId', orderController.deliveryDate);
    this.router.put(
      '/order/notification/mark-as-read',
      orderController.markNotificationAsRead,
    );

    return this.router;
  }
}

export const orderRoutes: OrderRoutes = new OrderRoutes();
