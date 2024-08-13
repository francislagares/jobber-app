import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { messageService } from '@gateway/services/chat';

export class Chat {
  public async message(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.addMessage(req.body);

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      conversationId: response.data.conversationId,
      messageData: response.data.messageData,
    });
  }

  public async conversation(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.getConversation(
      req.params.senderUsername,
      req.params.receiverUsername,
    );

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      conversations: response.data.conversations,
    });
  }

  public async messages(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.getMessages(
      req.params.senderUsername,
      req.params.receiverUsername,
    );

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      messages: response.data.messages,
    });
  }

  public async conversationList(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    const response: AxiosResponse =
      await messageService.getConversationList(username);

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      conversations: response.data.conversations,
    });
  }

  public async userMessages(req: Request, res: Response): Promise<void> {
    const { conversationId } = req.params;
    const response: AxiosResponse =
      await messageService.getUserMessages(conversationId);

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      messages: response.data.messages,
    });
  }

  public async offer(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.updateOffer(
      req.body.messageId,
      req.body.type,
    );

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      singleMessage: response.data.singleMessage,
    });
  }

  public async markMultipleMessages(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { messageId, senderUsername, receiverUsername } = req.body;
    const response: AxiosResponse =
      await messageService.markMultipleMessagesAsRead(
        receiverUsername,
        senderUsername,
        messageId,
      );

    res.status(StatusCodes.OK).json({ message: response.data.message });
  }

  public async markSingleMessage(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.markMessageAsRead(
      req.body.messageId,
    );

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      singleMessage: response.data.singleMessage,
    });
  }
}
