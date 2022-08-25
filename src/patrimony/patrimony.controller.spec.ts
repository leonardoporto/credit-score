import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyController } from './patrimony.controller';
import { PatrimonyService } from './patrimony.service';

describe('PatrimonyController', () => {
  let controller: PatrimonyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatrimonyController],
      providers: [PatrimonyService],
    }).compile();

    controller = module.get<PatrimonyController>(PatrimonyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
