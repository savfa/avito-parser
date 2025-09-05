import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';
import { AvitoAdEntity } from '../avito-parser/avito-ad.entity';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private bot: TelegramBot;
  private chatId: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    if (!token || !this.chatId) {
      this.logger.error(
        'Telegram bot token or chat ID not configured. Check your .env file.',
      );
      return;
    }

    this.bot = new TelegramBot(token, { polling: false });
    this.logger.log('Telegram service initialized');
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.bot) {
      this.logger.error('Telegram bot not initialized');
      return;
    }

    try {
      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'HTML' });
      this.logger.log(
        `Message sent to Telegram: ${message.substring(0, 50)}...`,
      );
    } catch (error) {
      this.logger.error(`Failed to send message to Telegram: ${error.message}`);
    }
  }

  async sendAdNotification(ad: AvitoAdEntity): Promise<void> {
    const message = `
    <b>🔔 Новое объявление на Avito!</b>

    <b>Название:</b> ${ad.title}
    <b>Цена:</b> ${ad.price}
    <b>Ссылка:</b> <a href="${ad.url}">Перейти на Avito</a>

    ${ad.description ? `<b>Описание:</b> ${ad.description.substring(0, 200)}...` : ''}
    `;

    await this.sendMessage(message);
  }
}
