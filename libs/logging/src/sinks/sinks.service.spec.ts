import { Test, TestingModule } from '@nestjs/testing';
import { SinksService } from './sinks.service';

describe('SinksService', () => {
  let service: SinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SinksService],
    }).compile();

    service = module.get<SinksService>(SinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
