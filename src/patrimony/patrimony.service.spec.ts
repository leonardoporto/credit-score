import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyService } from './patrimony.service';

describe('PatrimonyService', () => {
  let service: PatrimonyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatrimonyService],
    }).compile();

    service = module.get<PatrimonyService>(PatrimonyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
