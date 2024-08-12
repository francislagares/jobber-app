import express, { Router } from 'express';

import { validateRequest } from '@francislagares/jobber-shared';

import { createMessage } from '@chat/controllers/create';
import {
  conversation,
  conversationList,
  messages,
  userMessages,
} from '@chat/controllers/get';
import {
  markMultipleMessages,
  markSingleMessage,
  offerUpdate,
} from '@chat/controllers/update';
import { messageSchema } from '@chat/schemes/message';

const router: Router = express.Router();

const messageRoutes = (): Router => {
  router.get('/conversation/:senderUsername/:receiverUsername', conversation);
  router.get('/conversations/:username', conversationList);
  router.get('/:senderUsername/:receiverUsername', messages);
  router.get('/:conversationId', userMessages);
  router.post('/', validateRequest(messageSchema), createMessage);
  router.put('/offer', offerUpdate);
  router.put('/mark-as-read', markSingleMessage);
  router.put('/mark-multiple-as-read', markMultipleMessages);

  return router;
};

export { messageRoutes };
