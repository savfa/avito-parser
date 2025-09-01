import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { AvitoAdEntity } from './avito-ad.entity';
import { AvitoKeywordEntity } from './avito-keyword.entity';

@Injectable()
export class AvitoParserService {
  private readonly logger = new Logger(AvitoParserService.name);

  constructor(
    @InjectRepository(AvitoAdEntity)
    private readonly adRepository: Repository<AvitoAdEntity>,
    @InjectRepository(AvitoKeywordEntity)
    private readonly keywordRepository: Repository<AvitoKeywordEntity>,
  ) {}

  async parseAvito(keyword: string): Promise<void> {
    this.logger.log(`Начинаем парсинг Avito по ключевому слову: ${keyword}`);
    try {
      const url = `https://www.avito.ru/all?q=${encodeURIComponent(keyword)}`;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const ads = [];
      $('div[data-marker="item"]').each((index, element) => {
        const title = $(element).find('h3[itemprop="name"]').text().trim();
        const price = $(element)
          .find('span[data-marker="item-price"]')
          .text()
          .trim();
        const link =
          'https://www.avito.ru' +
          $(element).find('a[data-marker="item-title"]').attr('href');

        if (title && price && link) {
          ads.push({ title, price, url: link });
        }
      });

      for (const ad of ads) {
        const existingAd = await this.adRepository.findOne({
          where: { url: ad.url },
        });
        if (!existingAd) {
          const newAd = this.adRepository.create(ad);
          await this.adRepository.save(newAd);
          this.logger.log(
            `Новое объявление найдено и сохранено: ${ad.title} - ${ad.url}`,
          );
          // Здесь можно добавить логику для отправки уведомления в Telegram
        }
      }
      this.logger.log(
        `Парсинг по ключевому слову "${keyword}" завершен. Найдено ${ads.length} объявлений.`,
      );
    } catch (error) {
      this.logger.error(
        `Ошибка при парсинге Avito по ключевому слову "${keyword}": ${error.message}`,
      );
    }
  }

  async addKeyword(keyword: string): Promise<AvitoKeywordEntity> {
    const existingKeyword = await this.keywordRepository.findOne({
      where: { keyword },
    });
    if (existingKeyword) {
      return existingKeyword;
    }
    const newKeyword = this.keywordRepository.create({ keyword });
    return this.keywordRepository.save(newKeyword);
  }

  async getActiveKeywords(): Promise<AvitoKeywordEntity[]> {
    return this.keywordRepository.find({ where: { active: true } });
  }
}
