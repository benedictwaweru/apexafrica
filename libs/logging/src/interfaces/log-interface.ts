import { LogLevel } from '@nestjs/common';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  environment: string;
  service?: string;
  version?: string;
  requestId?: string;
  context?: string;
  trace?: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

export interface LogSink {
  /** Human-readable identifier, used in failure reporting. */
  readonly name: string;

  /**
   * Mark exactly one sink as the source of truth. SinkManager writes to it
   * first and awaits it, guaranteeing every entry lands somewhere durable
   * even if every other sink is down. If no sink is marked, SinkManager
   * defaults to the first sink in the array.
   */
  readonly isSourceOfTruth?: boolean;

  write(entry: LogEntry): Promise<void>;

  /** Optional cleanup hook (flush buffers, close connections, ...). */
  onDestroy?(): Promise<void>;
}
