import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as cookieparser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const cookieSecret = configService.get('COOKIE_SECRET');
  app.use(cookieparser(cookieSecret))

  app.enableCors({
    origin: [/vatpac\.org$/, /localhost(:\d+)?$/],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
  .setTitle('Routes API')
  .setDescription('API to get routes from the ERSA FPR')
  .setVersion('1.0')
  .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(3000);
}
bootstrap();
