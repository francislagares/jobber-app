import { Pool } from 'pg';
import { Logger } from 'winston';

import { winstonLogger } from '@francislagares/jobber-shared';

import { config } from '@review/config';

export class PostgresDB {
  private static instance: PostgresDB;
  private pool: Pool;
  private logger: Logger;

  private constructor() {
    this.logger = winstonLogger(
      `${config.ELASTIC_SEARCH_URL}`,
      'reviewDatabaseServer',
      'debug',
    );

    this.pool = new Pool({
      host: `${config.DATABASE_HOST}`,
      user: `${config.DATABASE_USER}`,
      password: `${config.DATABASE_PASSWORD}`,
      port: 5432,
      database: `${config.DATABASE_NAME}`,
    });

    this.pool.on('error', (error: Error) => {
      this.logger.log('error', 'pg client error', error);
      process.exit(-1);
    });
  }

  public static getInstance(): PostgresDB {
    if (!PostgresDB.instance) {
      PostgresDB.instance = new PostgresDB();
    }

    return PostgresDB.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.pool.connect();
      this.logger.info(
        'Review service successfully connected to postgresql database.',
      );
      await this.pool.query(this.createTableText);
    } catch (error) {
      this.logger.error('ReviewService - Unable to connect to database');
      this.logger.log('error', 'ReviewService () method error:', error);
    }
  }

  private get createTableText(): string {
    return `
      CREATE TABLE IF NOT EXISTS public.reviews (
        id SERIAL UNIQUE,
        gigId text NOT NULL,
        reviewerId text NOT NULL,
        orderId text NOT NULL,
        sellerId text NOT NULL,
        review text NOT NULL,
        reviewerImage text NOT NULL,
        reviewerUsername text NOT NULL,
        country text NOT NULL,
        reviewType text NOT NULL,
        rating integer DEFAULT 0 NOT NULL,
        createdAt timestamp DEFAULT CURRENT_DATE,
        PRIMARY KEY (id)
      );

      CREATE INDEX IF NOT EXISTS gigId_idx ON public.reviews (gigId);
      CREATE INDEX IF NOT EXISTS sellerId_idx ON public.reviews (sellerId);
    `;
  }

  public getPool(): Pool {
    return this.pool;
  }
}
