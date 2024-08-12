import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  ConversationDocument,
  MessageDocument,
} from '@francislagares/jobber-shared';

import {
  getConversation,
  getMessages,
  getUserConversationList,
  getUserMessages,
} from '@chat/services/message.service';

const conversation = async (req: Request, res: Response): Promise<void> => {
  const { senderUsername, receiverUsername } = req.params;
  const conversations: ConversationDocument[] = await getConversation(
    senderUsername,
    receiverUsername,
  );

  res
    .status(StatusCodes.OK)
    .json({ message: 'Chat conversation', conversations });
};

const messages = async (req: Request, res: Response): Promise<void> => {
  const { senderUsername, receiverUsername } = req.params;
  const messages: MessageDocument[] = await getMessages(
    senderUsername,
    receiverUsername,
  );

  res.status(StatusCodes.OK).json({ message: 'Chat messages', messages });
};

const conversationList = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  const messages: MessageDocument[] = await getUserConversationList(username);

  res
    .status(StatusCodes.OK)
    .json({ message: 'Conversation list', conversations: messages });
};

const userMessages = async (req: Request, res: Response): Promise<void> => {
  const { conversationId } = req.params;
  const messages: MessageDocument[] = await getUserMessages(conversationId);

  res.status(StatusCodes.OK).json({ message: 'Chat messages', messages });
};

export { conversation, conversationList, messages, userMessages };
