/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as helper from '@francislagares/jobber-shared';
import { BadRequestError, OrderDocument } from '@francislagares/jobber-shared';

import {
  authUserPayload,
  orderDocument,
  orderMockRequest,
  orderMockResponse,
} from '@order/controllers/order/test/mocks/order.mock';
import * as orderService from '@order/services/order.service';

import { orderCreate, stripePaymentIntent } from '../create';

vi.mock('@order/services/order.service');
vi.mock('@francislagares/jobber-shared');
vi.mock('@order/schemes/orderSchema');
vi.mock('@elastic/elasticsearch');

const mockPaymentIntentsCreate = vi.fn();
const mockCustomersSearch = vi.fn();
vi.mock('stripe', () => {
  return {
    __esModule: true,
    default: vi.fn(() => ({
      paymentIntents: {
        create: (...args: any) => mockPaymentIntentsCreate(...args) as unknown,
      },
      customers: {
        search: (...args: any) => mockCustomersSearch(...args) as unknown,
      },
    })),
  };
});

describe('Order Controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('intent method', () => {
    it('should create a new intent and return the corrct response', async () => {
      const req: Request = orderMockRequest(
        {},
        orderDocument,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = orderMockResponse();

      mockCustomersSearch.mockResolvedValueOnce({ data: [{ id: '12236362' }] });
      mockPaymentIntentsCreate.mockResolvedValueOnce({
        client_secret: '123443',
        id: '23485848',
      });

      await stripePaymentIntent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order intent created successfully.',
        clientSecret: '123443',
        paymentIntentId: '23485848',
      });
    });
  });

  describe('order method', () => {
    it('should throw an error for invalid schema data', async () => {
      const req: Request = orderMockRequest(
        {},
        orderDocument,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = orderMockResponse();

      vi.spyOn(helper, 'validateRequest').mockImplementation((): any =>
        Promise.resolve({
          error: {
            name: 'ValidationError',
            details: [{ message: 'This is an error message' }],
          },
        }),
      );

      orderCreate(req, res).catch(() => {
        expect(BadRequestError).toHaveBeenCalledWith(
          'This is an error message',
          'Create order() method',
        );
      });
    });

    it('should return correct json response', async () => {
      const req: Request = orderMockRequest(
        {},
        orderDocument,
        authUserPayload,
      ) as unknown as Request;
      const res: Response = orderMockResponse();
      const serviceFee: number =
        req.body.price < 50
          ? (5.5 / 100) * req.body.price + 2
          : (5.5 / 100) * req.body.price;
      let orderData: OrderDocument = req.body;

      orderData = { ...orderData, serviceFee };

      vi.spyOn(helper, 'validateRequest').mockImplementation((): any =>
        Promise.resolve({ error: {} }),
      );
      vi.spyOn(orderService, 'createOrder').mockResolvedValue(orderData);

      await orderCreate(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order created successfully.',
        order: orderData,
      });
    });
  });
});
