import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {
  constructor(context: string) {
    super(context);
  }
}
