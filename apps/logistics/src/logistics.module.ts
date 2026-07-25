import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { resolve } from 'path';

import { LoggingModule } from '@apexafrica/logging';
import { JsonLogSinkService } from '@apexafrica/logging/sinks/json-log-sink/json-log-sink.service';

import { LogisticsController } from './logistics.controller';
import { LogisticsService } from './logistics.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '.env'),
        resolve(process.cwd(), 'apps/logistics/.env'),
      ],
    }),

    LoggingModule.forRoot({
      sinks: [
        new JsonLogSinkService({
          filePath: 'logs/main-app.jsonl',
          isSourceOfTruth: true,
        }),
      ],
    }),
  ],
  controllers: [LogisticsController],
  providers: [LogisticsService],
})
export class LogisticsModule {}
