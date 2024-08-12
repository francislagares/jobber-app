import crypto from 'crypto';

import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  BadRequestError,
  MessageDocument,
  uploadImage,
} from '@francislagares/jobber-shared';

import { addMessage, createConversation } from '@chat/services/message.service';

export const createMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
        'Create message() method',
      );
    }

    file = result?.secure_url;
  }

  const messageData: MessageDocument = {
    conversationId: req.body.conversationId,
    body: req.body.body,
    file,
    fileType: req.body.fileType,
    fileSize: req.body.fileSize,
    fileName: req.body.fileName,
    gigId: req.body.gigId,
    buyerId: req.body.buyerId,
    sellerId: req.body.sellerId,
    senderUsername: req.body.senderUsername,
    senderPicture: req.body.senderPicture,
    receiverUsername: req.body.receiverUsername,
    receiverPicture: req.body.receiverPicture,
    isRead: req.body.isRead,
    hasOffer: req.body.hasOffer,
    offer: req.body.offer,
  };

  if (!req.body.hasConversationId) {
    await createConversation(
      `${messageData.conversationId}`,
      `${messageData.senderUsername}`,
      `${messageData.receiverUsername}`,
    );
  }

  await addMessage(messageData);

  res.status(StatusCodes.OK).json({
    message: 'Message added',
    conversationId: req.body.conversationId,
    messageData,
  });
};
