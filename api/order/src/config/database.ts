import mongoose from 'mongoose';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@order/config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'orderDatabaseServer',
  'debug',
);

export class MongoDBInstance {
  private static instance: MongoDBInstance;

  private constructor() {
    this.getDbConnection();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MongoDBInstance();
    }
    return this.instance;
  }

  private async getDbConnection() {
    try {
      // checks if mongoose is not connected
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(config.DATABASE_URL);
        logger.info(
          'Order MongoDB database connection has been successfully established!',
        );
      }
    } catch (error) {
      logger.error('Order Service - Unable to connect to database.');
      logger.log('error', 'OrderService connectToDatabase() method:', error);

      await this.disconnectFromDatabase();

      process.exit(1);
    }
  }

  private async disconnectFromDatabase(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.error('Orders Service - Disconnected from database.');
    } catch (error) {
      logger.error(`Error disconnecting from database: ${error}`);
    }
  }

  public async close(): Promise<void> {
    await this.disconnectFromDatabase();

    MongoDBInstance.instance = null;
  }
}
