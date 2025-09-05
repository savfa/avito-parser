import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AvitoParserService } from './avito-parser/avito-parser.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const avitoParserService = app.get(AvitoParserService);
  await avitoParserService.addKeyword(`toyota tank`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
