import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { resolve } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '.env'),
        resolve(process.cwd(), 'apps/apexafrica/.env'),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
