import {
  DynamicModule,
  Global,
  Module,
  ModuleMetadata,
  Type,
} from '@nestjs/common';

import { LogSink } from './interfaces/log-interface';
import { LoggingService } from './logging.service';
import { SinksModule } from './sinks/sinks.module';
import { SinksService } from './sinks/sinks.service';

export interface LoggingModuleOptions {
  sinks: LogSink[];
}

export interface LoggerModuleAsyncOptions extends Pick<
  ModuleMetadata,
  'imports'
> {
  inject?: Array<Type<unknown> | string | symbol>;
  useFactory: (...args: unknown[]) => LogSink[] | Promise<LogSink[]>;
}

@Global()
@Module({})
export class LoggingModule {
  /**
   * Register sinks directly. Fine for sinks with no external dependencies,
   * like JsonFileSink.
   *
   *   LoggerModule.forRoot({
   *     sinks: [new JsonFileSink({ filePath: 'logs/app.jsonl', isSourceOfTruth: true })],
   *   })
   */
  static forRoot(options: LoggingModuleOptions): DynamicModule {
    return {
      module: LoggingModule,
      providers: [
        { provide: 'LOG_SINKS', useValue: options.sinks },
        SinksService,
        LoggingService,
      ],
      exports: [LoggingService, SinksService],
      global: true,
    };
  }

  /**
   * Register sinks that need DI-provided config, e.g. a future
   * CloudWatchSink or DatabaseSink built from ConfigService values.
   *
   *   LoggerModule.forRootAsync({
   *     imports: [ConfigModule],
   *     inject: [ConfigService],
   *     useFactory: (config: ConfigService) => [
   *       new JsonFileSink({ filePath: config.get('LOG_FILE'), isSourceOfTruth: true }),
   *       new CloudWatchSink({ region: config.get('AWS_REGION') }),
   *     ],
   *   })
   */
  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    return {
      module: LoggingModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: 'LOG_SINKS',
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        SinksService,
        LoggingService,
      ],
      exports: [LoggingService, SinksService],
      global: true,
    };
  }
}
