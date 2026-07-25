import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { resolve } from 'path';

import { LoggingModule } from '@apexafrica/logging';
import { JsonLogSinkService } from '@apexafrica/logging/sinks/json-log-sink/json-log-sink.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DpopModule } from './dpop/dpop.module';
import { WebAuthnModule } from './web-authn/web-authn.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '.env'),
        resolve(process.cwd(), 'apps/apexafrica/.env'),
      ],
    }),

    LoggingModule.forRoot({
      sinks: [
        new JsonLogSinkService({
          filePath: 'logs/security-service.jsonl',
          isSourceOfTruth: true,
        }),
      ],
    }),

    HttpModule.register({
      global: true,
    }),

    WebAuthnModule,
    DpopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
