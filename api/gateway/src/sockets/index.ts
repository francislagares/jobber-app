import { Socket, Server as SocketIOServer } from 'socket.io';
import { io, Socket as SocketClient } from 'socket.io-client';
import { Logger } from 'winston';

import { MessageDocument, winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@gateway/config';
import { GatewayCache } from '@gateway/redis/gateway.cache';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'gatewaySocket',
  'debug',
);
let chatSocketClient: SocketClient;

export class SocketIOAppHandler {
  private io: SocketIOServer;
  private gatewayCache: GatewayCache;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.gatewayCache = new GatewayCache();
    this.chatSocketServiceIOConnections();
  }

  public listen(): void {
    this.chatSocketServiceIOConnections();
    this.io.on('connection', async (socket: Socket) => {
      socket.on('getLoggedInUsers', async () => {
        const response: string[] =
          await this.gatewayCache.getLoggedInUsersFromCache('loggedInUsers');
        this.io.emit('online', response);
      });

      socket.on('loggedInUsers', async (username: string) => {
        const response: string[] =
          await this.gatewayCache.saveLoggedInUserToCache(
            'loggedInUsers',
            username,
          );
        this.io.emit('online', response);
      });

      socket.on('removeLoggedInUser', async (username: string) => {
        const response: string[] =
          await this.gatewayCache.removeLoggedInUserFromCache(
            'loggedInUsers',
            username,
          );
        this.io.emit('online', response);
      });

      socket.on('category', async (category: string, username: string) => {
        await this.gatewayCache.saveUserSelectedCategory(
          `selectedCategories:${username}`,
          category,
        );
      });
    });
  }

  private chatSocketServiceIOConnections(): void {
    chatSocketClient = io(`${config.MESSAGE_BASE_URL}`, {
      transports: ['websocket', 'polling'],
      secure: true,
    });

    chatSocketClient.on('connect', () => {
      logger.info('ChatService socket connected');
    });

    chatSocketClient.on(
      'disconnect',
      (reason: SocketClient.DisconnectReason) => {
        logger.log('error', 'ChatSocket disconnect reason:', reason);
        chatSocketClient.connect();
      },
    );

    chatSocketClient.on('connect_error', (error: Error) => {
      logger.log('error', 'ChatService socket connection error:', error);
      chatSocketClient.connect();
    });

    // Custom Events
    chatSocketClient.on('message received', (data: MessageDocument) => {
      this.io.emit('message received', data);
    });

    chatSocketClient.on('message updated', (data: MessageDocument) => {
      this.io.emit('message updated', data);
    });
  }
}