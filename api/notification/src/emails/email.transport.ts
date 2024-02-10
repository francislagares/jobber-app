import { EmailLocals, winstonLogger } from '@francislagares/jobber-shared';
import { config } from '@notification/config';
import { emailTemplates } from '@notification/helpers/email';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'mailTransport',
  'debug',
);

export const sendEmail = async (
  template: string,
  receiverEmail: string,
  locals: EmailLocals,
): Promise<void> => {
  try {
    emailTemplates(template, receiverEmail, locals);

    logger.info('Email sent successfully.');
  } catch (error) {
    logger.log(
      'error',
      'NotificationService MailTransport sendEmail() method:',
      error,
    );
  }
};
