import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HostsMiddleware } from './common/middleware/hosts.middleware';
import { AvitoParserModule } from './avito-parser/avito-parser.module';
import { AvitoAdEntity } from './avito-parser/avito-ad.entity';
import { AvitoKeywordEntity } from './avito-parser/avito-keyword.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [AvitoAdEntity, AvitoKeywordEntity],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    ScheduleModule.forRoot(),
    AvitoParserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HostsMiddleware).forRoutes('*');
  }
}
