import { Inject, Injectable } from '@nestjs/common';

import { LogEntry, LogSink } from '../interfaces/log-interface';

@Injectable()
export class SinksService {
  private readonly sourceOfTruth: LogSink;
  private readonly otherSinks: LogSink[];

  constructor(@Inject('LOG_SINKS') private readonly sinks: LogSink[]) {
    if (!sinks || sinks.length === 0) {
      throw new Error('SinkManager requires at least one ILogSink.');
    }

    const truthCandidates = sinks.filter((sink) => sink.isSourceOfTruth);
    if (truthCandidates.length > 1) {
      throw new Error('Only one ILogSink may be marked isSourceOfTruth.');
    }

    // Falls back to the first sink so there is always a guaranteed target,
    // even if the caller forgot to flag one explicitly.
    this.sourceOfTruth = truthCandidates[0] ?? sinks[0];
    this.otherSinks = sinks.filter((sink) => sink !== this.sourceOfTruth);
  }

  /**
   * Writes an entry to every sink. The source-of-truth sink is awaited
   * directly - if it throws, we fall back to stderr rather than lose the
   * entry. All other sinks run in parallel and are isolated with
   * Promise.allSettled, so one bad sink (e.g. CloudWatch throttling, DB
   * connection drop) never blocks or breaks the others.
   */
  async dispatch(entry: LogEntry): Promise<void> {
    try {
      await this.sourceOfTruth.write(entry);
    } catch (err) {
      this.emergencyWrite(entry, err);
    }

    if (this.otherSinks.length === 0) return;

    const results = await Promise.allSettled(
      this.otherSinks.map((sink) => sink.write(entry)),
    );

    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        this.recordSinkFailure(this.otherSinks[i], result.reason);
      }
    });
  }

  /** Cleans up every sink that exposes an onDestroy hook (flush, disconnect, ...). */
  async closeAll(): Promise<void> {
    await Promise.allSettled(
      this.sinks
        .filter((sink) => sink.onDestroy)
        .map((sink) => sink.onDestroy!()),
    );
  }

  private recordSinkFailure(sink: LogSink, reason: unknown): void {
    const failureEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: `Log sink "${sink.name}" failed to write an entry.`,
      service: 'log-service',
      environment: `${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`,
      context: 'SinkManager',
      metadata: {
        sink: sink.name,
        reason: reason instanceof Error ? reason.message : String(reason),
      },
    };

    // Write straight to the source of truth, never back through dispatch(),
    // so a persistently failing sink can't create a feedback loop.
    this.sourceOfTruth
      .write(failureEntry)
      .catch((err) => this.emergencyWrite(failureEntry, err));
  }

  private emergencyWrite(entry: LogEntry, err: unknown): void {
    const reason = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `[SinkManager] source-of-truth sink failed, dumping to stderr: ${JSON.stringify(entry)} | error: ${reason}\n`,
    );
  }
}
