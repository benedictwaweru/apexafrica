import { Injectable } from '@nestjs/common';

import { LogEntry, LogSink } from '../../interfaces/log-interface';

@Injectable()
export class JsonLogSinkService implements LogSink {
  async write(entry: LogEntry): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
