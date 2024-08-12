import {
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
