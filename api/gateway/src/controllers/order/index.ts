import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { orderService } from '@gateway/services/order';

export class Order {
  public async createOrderIntent(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.createOrderIntent(
      req.body.price,
      req.body.buyerId,
    );

    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      clientSecret: response.data.clientSecret,
      paymentIntentId: response.data.paymentIntentId,
    });
  }

  public async createOrder(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.createOrder(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: response.data.message, order: response.data.order });
  }

  public async getOrderById(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.getOrderById(
      req.params.orderId,
    );

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, order: response.data.order });
  }

  public async sellerOrders(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.sellerOrders(
      req.params.sellerId,
    );

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, orders: response.data.orders });
  }

  public async buyerOrders(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.buyerOrders(
      req.params.buyerId,
    );

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, orders: response.data.orders });
  }

  public async getNotifications(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.getNotifications(
      req.params.userTo,
    );

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      notifications: response.data.notifications,
    });
  }

  public async cancelOrder(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { orderData, paymentIntentId } = req.body;
    const response: AxiosResponse = await orderService.cancelOrder(
      paymentIntentId,
      orderId,
      orderData,
    );

    res.status(StatusCodes.CREATED).json({ message: response.data.message });
  }

  public async requestExtension(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const response: AxiosResponse =
      await orderService.requestDeliveryDateExtension(orderId, req.body);

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, order: response.data.order });
  }

  public async deliveryDate(req: Request, res: Response): Promise<void> {
    const { orderId, type } = req.params;
    const response: AxiosResponse = await orderService.updateDeliveryDate(
      orderId,
      type,
      req.body,
    );

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, order: response.data.order });
  }

  public async deliverOrder(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const response: AxiosResponse = await orderService.deliverOrder(
      orderId,
      req.body,
    );

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, order: response.data.order });
  }

  public async approveOrder(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const response: AxiosResponse = await orderService.approveOrder(
      orderId,
      req.body,
    );

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, order: response.data.order });
  }

  public async markNotificationAsRead(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { notificationId } = req.body;
    const response: AxiosResponse =
      await orderService.markNotificationAsRead(notificationId);

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      notification: response.data.notification,
    });
  }
}
