import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvitoAdEntity } from './avito-ad.entity';
import { AvitoKeywordEntity } from './avito-keyword.entity';
import { AvitoParserService } from './avito-parser.service';
import { AvitoParserController } from './avito-parser.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AvitoAdEntity, AvitoKeywordEntity])],
  controllers: [AvitoParserController],
  providers: [AvitoParserService],
  exports: [AvitoParserService, TypeOrmModule],
})
export class AvitoParserModule {}
