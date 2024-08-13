import express, { Router } from 'express';

import { Chat } from '@gateway/controllers/chat';

class MessageRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const messageController = new Chat();

    this.router.get(
      '/message/conversation/:senderUsername/:receiverUsername',
      messageController.conversation,
    );
    this.router.get(
      '/message/conversations/:username',
      messageController.conversationList,
    );
    this.router.get(
      '/message/:senderUsername/:receiverUsername',
      messageController.messages,
    );
    this.router.get('/message/:conversationId', messageController.userMessages);

    this.router.post('/message', messageController.message);

    this.router.put('/message/offer', messageController.offer);
    this.router.put(
      '/message/mark-as-read',
      messageController.markSingleMessage,
    );
    this.router.put(
      '/message/mark-multiple-as-read',
      messageController.markMultipleMessages,
    );

    return this.router;
  }
}

export const messageRoutes: MessageRoutes = new MessageRoutes();
