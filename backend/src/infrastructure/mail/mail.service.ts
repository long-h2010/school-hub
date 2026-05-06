import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

export interface SendOtpOptions {
  to: string;
  name: string;
  otp: string;
  expiresInMinutes?: number;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly templatesDir = path.join(__dirname, 'templates');

  constructor(private readonly mailerService: MailerService) {}

  private renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): string {
    const filePath = path.join(this.templatesDir, `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf-8');
    const compiled = Handlebars.compile(source);
    return compiled(context);
  }

  async sendOtp(options: SendOtpOptions): Promise<void> {
    const { to, name, otp, expiresInMinutes = 5 } = options;

    const html = this.renderTemplate('send-otp', {
      name,
      otp,
      expiresInMinutes,
      year: new Date().getFullYear(),
    });

    try {
      await this.mailerService.sendMail({
        to,
        subject: `${otp} is your verification code`,
        html,
      });
      this.logger.log(`OTP email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${to}`, error);
      throw error;
    }
  }
}
