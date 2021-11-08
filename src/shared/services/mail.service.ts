import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from './api-config.service';
import { ISendMailOptions } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ApiConfigService,
    ) {}

    async send(mailData: ISendMailOptions): Promise<void> {
        mailData.from = mailData.from || this.configService.defoultMailFrom;
        await this.mailerService.sendMail(mailData);
    }
}
