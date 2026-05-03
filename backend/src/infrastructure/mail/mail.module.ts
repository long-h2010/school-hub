import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        const host = process.env.MAIL_HOST;
        const port = Number(process.env.MAIL_PORT) ?? 587;
        const user = process.env.MAIL_USER;
        const pass = process.env.MAIL_PASS;
        const secure = port == 465;

        const transport = `smtp${secure ? 's' : ''}://${user}:${encodeURIComponent(pass)}@${host}:${port}`;

        return {
          transport,
          defaults: {
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>`,
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
