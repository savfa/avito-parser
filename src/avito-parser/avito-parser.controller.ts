import { Controller, Post, Param, Logger } from '@nestjs/common';
import { AvitoParserService } from './avito-parser.service';

@Controller('avito-parser')
export class AvitoParserController {
  private readonly logger = new Logger(AvitoParserController.name);

  constructor(private readonly avitoParserService: AvitoParserService) {}

  @Post('parse/:keyword')
  async parseKeyword(@Param('keyword') keyword: string) {
    this.logger.log(`Запрос на ручной парсинг по ключевому слову: ${keyword}`);
    await this.avitoParserService.parseAvito(keyword);
    return { message: `Парсинг по ключевому слову "${keyword}" запущен.` };
  }

  @Post('add-keyword/:keyword')
  async addKeyword(@Param('keyword') keyword: string) {
    this.logger.log(`Запрос на добавление ключевого слова: ${keyword}`);
    const newKeyword = await this.avitoParserService.addKeyword(keyword);
    return {
      message: `Ключевое слово "${newKeyword.keyword}" добавлено.`,
      keyword: newKeyword,
    };
  }
}
