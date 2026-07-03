import { Test, TestingModule } from '@nestjs/testing';
import { JsonLogSinkService } from './json-log-sink.service';

describe('JsonLogSinkService', () => {
  let service: JsonLogSinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonLogSinkService],
    }).compile();

    service = module.get<JsonLogSinkService>(JsonLogSinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
