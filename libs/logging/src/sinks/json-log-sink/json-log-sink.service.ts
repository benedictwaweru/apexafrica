import { Injectable } from '@nestjs/common';

import { promises as fs } from 'fs';
import { dirname } from 'path';

import { LogEntry, LogSink } from '../../interfaces/log-interface';

export interface JsonFileSinkOptions {
  /** Absolute or relative path to the .jsonl (JSON-lines) log file. */
  filePath: string;

  /** Whether this sink is the guaranteed durable target. Defaults to false. */
  isSourceOfTruth?: boolean;
}

export class JsonLogSinkService implements LogSink {
  readonly name: string = 'json-file';
  readonly isSourceOfTruth: boolean;

  private readonly filePath: string;
  private writeQueue: Promise<void> = Promise.resolve();
  private dirEnsured = false;

  constructor(options: JsonFileSinkOptions) {
    this.filePath = options.filePath;
    this.isSourceOfTruth = options.isSourceOfTruth ?? false;
  }

  write(entry: LogEntry): Promise<void> {
    // Chain onto the queue rather than awaiting fs directly, so a slow or
    // concurrent write never races with another and mangles a line.
    this.writeQueue = this.writeQueue.then(() => this.append(entry));
    return this.writeQueue;
  }

  private async append(entry: LogEntry): Promise<void> {
    await this.ensureDir();
    const line = JSON.stringify(entry) + '\n';
    await fs.appendFile(this.filePath, line, { encoding: 'utf8' });
  }

  private async ensureDir(): Promise<void> {
    if (this.dirEnsured) return;

    await fs.mkdir(dirname(this.filePath), { recursive: true });
    this.dirEnsured = true;
  }
}
