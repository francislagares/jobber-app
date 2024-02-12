import * as connection from '@notification/queues/connection';
import { consumeAuthEmailMessage } from '@notification/queues/email.consumer';
import { Channel } from 'amqplib';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@notification/queues/connection');
vi.mock('amqplib');
vi.mock('@francislagares/jobber-shared');

describe('Email Consumer', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('consumeAuthEmailMessage method', () => {
    test('should connect to channel and create a queue', async () => {
      const channel = {
        assertExchange: vi.fn(),
        assertQueue: vi.fn(),
        bindQueue: vi.fn(),
        publish: vi.fn(),
        consume: vi.fn(),
      };

      vi.spyOn(connection, 'createConnection').mockReturnValue(
        channel as never,
      );
      vi.spyOn(channel, 'assertExchange');
      vi.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: 'auth-email-queue',
        messageCount: 0,
        consumerCount: 0,
      });

      const connectionChannel: Channel | undefined =
        await connection.createConnection();

      await consumeAuthEmailMessage(connectionChannel);

      expect(connectionChannel.assertExchange).toHaveBeenCalledWith(
        'jobber-email-notification',
        'direct',
      );
      expect(connectionChannel.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel.bindQueue).toHaveBeenCalledWith(
        'auth-email-queue',
        'jobber-email-notification',
        'auth-email',
      );
    });
  });
});
