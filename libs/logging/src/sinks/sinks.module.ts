import { Module } from '@nestjs/common';

import { SinksService } from './sinks.service';

@Module({
  providers: [
    SinksService,

    { provide: 'LOG_SINKS', useValue: [] },
  ],
})
export class SinksModule {}
