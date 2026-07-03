import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseLogSinkService } from './database-log-sink.service';

describe('DatabaseLogSinkService', () => {
  let service: DatabaseLogSinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseLogSinkService],
    }).compile();

    service = module.get<DatabaseLogSinkService>(DatabaseLogSinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
