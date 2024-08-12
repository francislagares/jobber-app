import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { MessageDocument } from '@francislagares/jobber-shared';

import {
  markManyMessagesAsRead,
  markMessageAsRead,
  updateOffer,
} from '@chat/services/message.service';

export const offerUpdate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { messageId, type } = req.body;
  const message: MessageDocument = await updateOffer(messageId, type);

  res
    .status(StatusCodes.OK)
    .json({ message: 'Message updated', singleMessage: message });
};

export const markMultipleMessages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { messageId, senderUsername, receiverUsername } = req.body;
  await markManyMessagesAsRead(receiverUsername, senderUsername, messageId);

  res.status(StatusCodes.OK).json({ message: 'Messages marked as read' });
};

export const markSingleMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { messageId } = req.body;
  const message: MessageDocument = await markMessageAsRead(messageId);

  res
    .status(StatusCodes.OK)
    .json({ message: 'Message marked as read', singleMessage: message });
};
