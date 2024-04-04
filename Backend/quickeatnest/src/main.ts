import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  // Increase payload size limit
  app.use(express.json({ limit: '50mb' }));

  app.use(cookieParser());
  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
