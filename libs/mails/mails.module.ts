import { Module } from '@nestjs/common';
import { EmailSendingUseCase } from './application/use-case/email-sending-use-case';
import { SendConfirmationCodesUseCase } from './application/use-case/send-confirmation-codes.use-case';
import { SendRecoveryCodesUseCase } from './application/use-case/send-recovery-codes.use-case';
import { SendRecoveryCodeEventHandler } from './events-handlers/send-recovery-code.event.handler';
import { ReSendConfirmationCodeEventHandler } from './events-handlers/re-send-confirmation-code.event.handler';
import { SendConfirmationCodeWhenRegistrationUserEventHandler } from './events-handlers/send-confirmation-code-when-registration-user.event.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentCodesLogEntity } from './entities/sent-codes-log.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailsService } from './application/mails.service';
import { SentCodeLogRepo } from './infrastructure/sent-code-log.repo';
import { MailOptionsBuilder } from './mail-options/mail-options-builder';
import { MailsConfig } from '../../apps/backend/src/config/mails/mails.config';
import { PostgresConfig } from '../../apps/backend/src/config/db/postgres/postgres.config';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../apps/backend/src/config/configuration';
import { join } from 'path';

const mailsUseCases = [
  EmailSendingUseCase,
  SendConfirmationCodesUseCase,
  SendRecoveryCodesUseCase,
];

const mailsEventHandlers = [
  SendRecoveryCodeEventHandler,
  ReSendConfirmationCodeEventHandler,
  SendConfirmationCodeWhenRegistrationUserEventHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([SentCodesLogEntity]),
    CqrsModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<ConfigType, true>) => {
        const mailConfig = configService.get('mail', { infer: true });

        return {
          transport: {
            host: mailConfig.MAIL_HOST,
            port: mailConfig.EMAIL_PORT,
            ignoreTLS: true,
            secure: true,
            auth: {
              user: mailConfig.NODEMAILER_EMAIL,
              pass: mailConfig.NODEMAILER_APP_PASSWORD,
            },
          },
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
          template: {
            dir: join(__dirname, 'templates'),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [
    MailsConfig,
    PostgresConfig,
    MailOptionsBuilder,
    MailsService,
    SentCodeLogRepo,
    ...mailsEventHandlers,
    ...mailsUseCases,
  ],
  exports: [MailsService],
})
export class MailsModule {}
