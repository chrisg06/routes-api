import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Route } from './routes/routes.entity';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: [Route],
      synchronize: true,
    }),
    inject: [ConfigService],
  }),
  ConfigModule.forRoot({ isGlobal: true }),
  RoutesModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
