import axios, { AxiosResponse } from 'axios';

import {
  DeliveredWork,
  ExtendedDelivery,
  OrderDocument,
  OrderMessage,
} from '@francislagares/jobber-shared';

import { AxiosService } from '@gateway/services/axios';

export let axiosOrderInstance: ReturnType<typeof axios.create>;

class OrderService {
  constructor() {
    const axiosService: AxiosService = new AxiosService(
      `${process.env.ORDER_BASE_URL}/api/v1/order`,
      'order',
    );

    axiosOrderInstance = axiosService.axios;
  }

  async getOrderById(orderId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.get(`/${orderId}`);

    return response;
  }

  async sellerOrders(sellerId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.get(
      `/seller/${sellerId}`,
    );

    return response;
  }

  async buyerOrders(buyerId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.get(
      `/buyer/${buyerId}`,
    );

    return response;
  }

  async createOrderIntent(
    price: number,
    buyerId: string,
  ): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.post(
      '/create-payment-intent',
      { price, buyerId },
    );

    return response;
  }

  async createOrder(body: OrderDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.post('/', body);

    return response;
  }

  async cancelOrder(
    paymentIntentId: string,
    orderId: string,
    body: OrderMessage,
  ): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.put(
      `/cancel/${orderId}`,
      { paymentIntentId, orderData: body },
    );

    return response;
  }

  async requestDeliveryDateExtension(
    orderId: string,
    body: ExtendedDelivery,
  ): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.put(
      `/extension/${orderId}`,
      body,
    );

    return response;
  }

  async updateDeliveryDate(
    orderId: string,
    type: string,
    body: ExtendedDelivery,
  ): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.put(
      `/gig/${type}/${orderId}`,
      body,
    );

    return response;
  }

  async deliverOrder(
    orderId: string,
    body: DeliveredWork,
  ): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.put(
      `/deliver-order/${orderId}`,
      body,
    );

    return response;
  }

  async approveOrder(
    orderId: string,
    body: OrderMessage,
  ): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.put(
      `/approve-order/${orderId}`,
      body,
    );

    return response;
  }

  async getNotifications(userTo: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.get(
      `/notification/${userTo}`,
    );

    return response;
  }

  async markNotificationAsRead(notificationId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosOrderInstance.put(
      '/notification/mark-as-read',
      { notificationId },
    );

    return response;
  }
}

export const orderService: OrderService = new OrderService();
