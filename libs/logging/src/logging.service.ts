import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

import { LogEntry } from './interfaces/log-interface';
import { SinksService } from './sinks/sinks.service';

@Injectable()
export class LoggingService extends ConsoleLogger {
  constructor(private readonly sinksService: SinksService) {
    super();
  }

  override log(message: unknown, context?: string): void {
    super.log(message, context);
    this.dispatch('log', message, context);
  }

  override error(message: unknown, trace?: string, context?: string): void {
    super.error(message, trace, context);
    this.dispatch('error', message, context, trace);
  }

  override warn(message: unknown, context?: string): void {
    super.warn(message, context);
    this.dispatch('warn', message, context);
  }

  override debug(message: unknown, context?: string): void {
    super.debug(message, context);
    this.dispatch('debug', message, context);
  }

  override verbose(message: unknown, context?: string): void {
    super.verbose(message, context);
    this.dispatch('verbose', message, context);
  }

  private dispatch(
    level: LogLevel,
    message: unknown,
    context?: string,
    trace?: string,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: this.toEntryMessage(message),
      context,
      trace,
      environment: `${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`,
    };

    // Nest's LoggerService methods are synchronous/void, and sinks do I/O,
    // so this is intentionally fire-and-forget. SinkManager already isolates
    // per-sink failures internally - this catch only guards against
    // SinkManager itself throwing (e.g. misconfiguration at construction).
    this.sinksService.dispatch(entry).catch((err) => {
      process.stderr.write(
        `[SinksService] failed to dispatch log entry: ${String(err)}\n`,
      );
    });
  }

  private toEntryMessage(message: unknown): string {
    if (typeof message === 'string') return message;
    if (message instanceof Error) return message.message;
    try {
      return JSON.stringify(message);
    } catch {
      return String(message);
    }
  }
}
