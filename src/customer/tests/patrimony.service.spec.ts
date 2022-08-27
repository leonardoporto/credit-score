import { DatabaseModule } from '../../database';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyService } from '../patrimony.service';
import { patrimoniesProviders } from '../providers';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CustomerServive', () => {
  let service: PatrimonyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
      providers: [PatrimonyService, ...patrimoniesProviders],
    }).compile();

    service = module.get<PatrimonyService>(PatrimonyService);
  });

  it('should able create patrimony', async () => {
    const data = {
      description: 'Casa',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    const patrimony = await service.create(data);

    expect(patrimony).toHaveProperty('description', data.description);
    expect(patrimony).toHaveProperty('amount', data.amount);
    expect(patrimony).toHaveProperty('patrimonyId');
  });

  it('should not able update patrimony - invalid id', async () => {
    await expect(service.update('invalid-id', {})).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not able update patrimony - patrimony not found', async () => {
    await expect(
      service.update('6307aecb80f5e1477219cac1', {}),
    ).rejects.toThrow(NotFoundException);
  });

  it('should able update patrimony', async () => {
    const data = {
      description: 'Casa',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    const patrimony = await service.create(data);

    data.amount = 200013;

    const updatePatrimony = await service.update(patrimony.patrimonyId, data);

    expect(updatePatrimony).toHaveProperty('amount', 200013);
  });

  it('should not able delete patrimony - invalid id', async () => {
    await expect(service.remove('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not able delete patrimony - patrimony not found', async () => {
    await expect(service.remove('6307aecb80f5e1477219cac1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should able delete patrimony', async () => {
    const data = {
      description: 'Casa',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    const patrimony = await service.create(data);

    const deletePatrimony = await service.remove(patrimony.patrimonyId);

    expect(deletePatrimony).toBeTruthy();
  });

  it('should able returns patrimonies from user', async () => {
    const data = {
      description: 'Casa',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    const patrimony = await service.create(data);

    const patrimonies = await service.findByUserId(data.userId);

    expect(patrimonies).toHaveLength(1);
    expect(patrimonies[0]).toMatchObject(patrimony);
  });
});
