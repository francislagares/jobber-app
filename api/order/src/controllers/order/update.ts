import crypto from 'crypto';

import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';

import {
  BadRequestError,
  DeliveredWork,
  OrderDocument,
  uploadImage,
} from '@francislagares/jobber-shared';

import { config } from '@order/config';
import {
  approveDeliveryDate,
  approveOrder,
  cancelOrder,
  rejectDeliveryDate,
  requestDeliveryExtension,
  sellerDeliverOrder,
} from '@order/services/order.service';

const stripe: Stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  typescript: true,
});

export const cancel = async (req: Request, res: Response): Promise<void> => {
  await stripe.refunds.create({
    payment_intent: `${req.body.paymentIntent}`,
  });
  const { orderId } = req.params;

  await cancelOrder(orderId, req.body.orderData);

  res.status(StatusCodes.OK).json({ message: 'Order cancelled successfully.' });
};

export const requestExtension = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { orderId } = req.params;
  const order: OrderDocument = await requestDeliveryExtension(
    orderId,
    req.body,
  );

  res.status(StatusCodes.OK).json({ message: 'Order delivery request', order });
};

export const deliveryDate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { orderId, type } = req.params;
  const order: OrderDocument =
    type === 'approve'
      ? await approveDeliveryDate(orderId, req.body)
      : await rejectDeliveryDate(orderId);

  res
    .status(StatusCodes.OK)
    .json({ message: 'Order delivery date extension', order });
};

export const buyerApproveOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { orderId } = req.params;
  const order: OrderDocument = await approveOrder(orderId, req.body);

  res
    .status(StatusCodes.OK)
    .json({ message: 'Order approved successfully.', order });
};

export const deliverOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { orderId } = req.params;
  let file: string = req.body.file;
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  let result: UploadApiResponse;

  if (file) {
    result = (
      req.body.fileType === 'zip'
        ? await uploadImage(file, `${randomCharacters}.zip`)
        : await uploadImage(file)
    ) as UploadApiResponse;

    if (!result.public_id) {
      throw new BadRequestError(
        'File upload error. Try again',
        'Update deliverOrder() method',
      );
    }

    file = result?.secure_url;
  }

  const deliveredWork: DeliveredWork = {
    message: req.body.message,
    file,
    fileType: req.body.fileType,
    fileName: req.body.fileName,
    fileSize: req.body.fileSize,
  };

  const order: OrderDocument = await sellerDeliverOrder(
    orderId,
    true,
    deliveredWork,
  );

  res
    .status(StatusCodes.OK)
    .json({ message: 'Order delivered successfully.', order });
};
