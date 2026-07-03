import { Global, Module } from '@nestjs/common';

import { LoggingService } from './logging.service';
import { SinksModule } from './sinks/sinks.module';

@Global()
@Module({
  providers: [LoggingService],
  exports: [LoggingService],
  imports: [SinksModule],
})
export class LoggingModule {}
