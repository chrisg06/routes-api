import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register for cookies
  const configService = app.get(ConfigService);
  const cookieSecret = configService.get('COOKIE_SECRET');
  app.use(cookieParser(cookieSecret));

  // Increase body size limit
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Register Sentry error tracking
  Sentry.init({
    dsn: configService.get('SENTRY_DSN'),
  });
  
  // Enable CORS
  app.enableCors({
    origin: [/chrisgardiner\.org$/, /localhost(:\d+)?$/],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Use helmet
  /* @ts-ignore */
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Routes API')
    .setDescription('API to get routes from the ERSA FPR')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
