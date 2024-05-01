import { PrismaClient } from '@prisma/client';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@authentication/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'authDatabaseServer',
  'debug',
);

export class MySqlDBInstance {
  private static instance: MySqlDBInstance;
  private database: PrismaClient;

  private constructor() {
    this.database = new PrismaClient();
    this.connectToDatabase();
  }

  public static async getInstance() {
    if (!this.instance) {
      this.instance = new MySqlDBInstance();
    }
    return this.instance;
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await this.database.$connect();

      logger.info(
        'Authentication MySQL database connection has been successfully established!',
      );
    } catch (error) {
      logger.error('Authentication Service - Unable to connect to database.');
      logger.log(
        'error',
        'Authentication Service connectToDatabase() method:',
        error,
      );

      await this.disconnectFromDatabase();

      process.exit(1);
    }
  }

  private async disconnectFromDatabase(): Promise<void> {
    try {
      await this.database.$disconnect();
      logger.error('Authentication Service - Disconnected from database.');
    } catch (error) {
      logger.error(`Error disconnecting from database: ${error}`);
    }
  }

  public async close(): Promise<void> {
    await this.disconnectFromDatabase();

    MySqlDBInstance.instance = null;
  }
}
