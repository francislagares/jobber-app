import path from 'path';

import { EmailLocals, winstonLogger } from '@francislagares/jobber-shared';
import { config } from '@notification/config';
import Email from 'email-templates';
import nodemailer, { Transporter } from 'nodemailer';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'mailTransportHelper',
  'debug',
);

export const emailTemplates = async (
  template: string,
  receiver: string,
  locals: EmailLocals,
): Promise<void> => {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });
    const email: Email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs',
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build'),
        },
      },
    });

    await email.send({
      template: path.join(__dirname, '..', 'emails', template),
      message: { to: receiver },
      locals,
    });
  } catch (error) {
    logger.error(error);
  }
};
