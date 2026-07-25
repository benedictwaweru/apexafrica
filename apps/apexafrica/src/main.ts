import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { LoggingService } from '@apexafrica/logging';

import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const httpPort = configService.getOrThrow<string>('SECURITY_HTTP_PORT');

    const appLogger = app.get(LoggingService);
    app.useLogger(appLogger);

    process.on('unhandledRejection', (reason) => {
      appLogger.error(
        'Unhandled rejection during runtime',
        reason instanceof Error ? reason.stack : String(reason),
      );
      process.exit(1);
    });

    process.on('uncaughtException', (error) => {
      appLogger.fatal(
        'Uncaught exception',
        error instanceof Error ? error.stack : String(error),
      );
      process.exit(1);
    });

    await app.listen(httpPort);
    appLogger.log(
      `Security microservice is listening on HTTP port ${httpPort}`,
    );
  } catch (error: unknown) {
    const logger = new Logger('Bootstrap');
    logger.error(
      'Application failed to start',
      error instanceof Error ? error.stack : String(error),
    );

    process.exit(1);
  }
}

bootstrap();
