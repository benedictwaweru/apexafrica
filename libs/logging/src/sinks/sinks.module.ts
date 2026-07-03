import { Module } from '@nestjs/common';

import { DatabaseLogSinkService } from './database-log-sink/database-log-sink.service';
import { JsonLogSinkService } from './json-log-sink/json-log-sink.service';
import { SinksService } from './sinks.service';

@Module({
  providers: [SinksService, JsonLogSinkService, DatabaseLogSinkService],
})
export class SinksModule {}
