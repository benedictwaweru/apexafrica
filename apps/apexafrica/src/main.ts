import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const httpPort = configService.getOrThrow<string>('SECURITY_HTTP_PORT');

    process.on('unhandledRejection', (reason) => {
      process.exit(1);
    });

    process.on('uncaughtException', (error) => {
      process.exit(1);
    });

    await app.listen(httpPort);
  } catch (error: unknown) {
    const fallbackLogger = new Logger('Bootstrap');
    fallbackLogger.error(
      'Application failed to start',
      error instanceof Error ? error.stack : String(error),
    );

    process.exit(1);
  }
}

bootstrap();
