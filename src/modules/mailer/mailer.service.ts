import { Injectable } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';
import * as dotenv from 'dotenv';
import EnvironmentVariables from 'src/common/interfaces/environmentVariables';

dotenv.config();

const { SENDGRID_SENDER_EMAIL, SENDGRID_API_KEY } =
  process.env as EnvironmentVariables;

@Injectable()
export class MailerService {
  private readonly mailService: MailService;

  constructor() {
    this.mailService = new MailService();
    this.mailService.setApiKey(SENDGRID_API_KEY);
  }

  async sendEmail(to: string, subject: string, otp: number): Promise<void> {
    const message = {
      to,
      from: SENDGRID_SENDER_EMAIL,
      subject,
      templateId: 'd-021164b62a7f4f29888570a3b023f339',
      dynamicTemplateData: {
        otp,
      },
    };
    try {
      await this.mailService.send(message);
    } catch (err) {
      console.log(err.response.body);
    }
  }
}
