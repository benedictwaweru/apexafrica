import { LogLevel } from '@nestjs/common';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  version: string;
  environment: string;
  requestId?: string;
  context?: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

export interface LogSink {
  write(entry: LogEntry): Promise<void>;
}
