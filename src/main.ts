import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import dbConnect from './utils/db';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  await dbConnect();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("ТЗ для REON")
    .setDescription("API, которое чем-то напоминает Trello")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, documentFactory);

  await app.listen(3000);
}
bootstrap();
