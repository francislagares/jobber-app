import {
  ConversationDocument,
  MessageDetails,
  MessageDocument,
  toLowerCase,
} from '@francislagares/jobber-shared';

import { ConversationModel } from '@chat/models/conversation.schema';
import { MessageModel } from '@chat/models/message.schema';
import { publishDirectMessage } from '@chat/queues/message.producer';
import { chatChannel, socketIOChatObject } from '@chat/server';

export const createConversation = async (
  conversationId: string,
  sender: string,
  receiver: string,
): Promise<void> => {
  await ConversationModel.create({
    conversationId,
    senderUsername: sender,
    receiverUsername: receiver,
  });
};

export const addMessage = async (
  data: MessageDocument,
): Promise<MessageDocument> => {
  const message: MessageDocument = await MessageModel.create(data);

  if (data.hasOffer) {
    const emailMessageDetails: MessageDetails = {
      sender: data.senderUsername,
      amount: `${data.offer?.price}`,
      buyerUsername: toLowerCase(`${data.receiverUsername}`),
      sellerUsername: toLowerCase(`${data.senderUsername}`),
      title: data.offer?.gigTitle,
      description: data.offer?.description,
      deliveryDays: `${data.offer?.deliveryInDays}`,
      template: 'offer',
    };

    // Send email
    await publishDirectMessage(
      chatChannel,
      'jobber-order-notification',
      'order-email',
      JSON.stringify(emailMessageDetails),
      'Order email sent to notification service.',
    );
  }

  socketIOChatObject.emit('message received', message);

  return message;
};

export const getConversation = async (
  sender: string,
  receiver: string,
): Promise<ConversationDocument[]> => {
  const query = {
    $or: [
      { senderUsername: sender, receiverUsername: receiver },
      { senderUsername: receiver, receiverUsername: sender },
    ],
  };
  const conversation: ConversationDocument[] =
    await ConversationModel.aggregate([{ $match: query }]);

  return conversation;
};

export const getUserConversationList = async (
  username: string,
): Promise<MessageDocument[]> => {
  const query = {
    $or: [{ senderUsername: username }, { receiverUsername: username }],
  };
  const messages: MessageDocument[] = await MessageModel.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$conversationId',
        result: { $top: { output: '$$ROOT', sortBy: { createdAt: -1 } } },
      },
    },
    {
      $project: {
        _id: '$result._id',
        conversationId: '$result.conversationId',
        sellerId: '$result.sellerId',
        buyerId: '$result.buyerId',
        receiverUsername: '$result.receiverUsername',
        receiverPicture: '$result.receiverPicture',
        senderUsername: '$result.senderUsername',
        senderPicture: '$result.senderPicture',
        body: '$result.body',
        file: '$result.file',
        gigId: '$result.gigId',
        isRead: '$result.isRead',
        hasOffer: '$result.hasOffer',
        createdAt: '$result.createdAt',
      },
    },
  ]);

  return messages;
};

export const getMessages = async (
  sender: string,
  receiver: string,
): Promise<MessageDocument[]> => {
  const query = {
    $or: [
      { senderUsername: sender, receiverUsername: receiver },
      { senderUsername: receiver, receiverUsername: sender },
    ],
  };
  const messages: MessageDocument[] = await MessageModel.aggregate([
    { $match: query },
    { $sort: { createdAt: 1 } },
  ]);

  return messages;
};

export const getUserMessages = async (
  messageConversationId: string,
): Promise<MessageDocument[]> => {
  const messages: MessageDocument[] = await MessageModel.aggregate([
    { $match: { conversationId: messageConversationId } },
    { $sort: { createdAt: 1 } },
  ]);

  return messages;
};
