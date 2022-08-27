import { DatabaseModule } from '../../database';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DebtService } from '../debt.service';
import { debtsProviders } from '../providers';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CustomerServive', () => {
  let service: DebtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
      providers: [DebtService, ...debtsProviders],
    }).compile();

    service = module.get<DebtService>(DebtService);
  });

  it('should able create debt', async () => {
    const data = {
      description: 'emprestimo',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    const debt = await service.create(data);

    expect(debt).toHaveProperty('description', data.description);
    expect(debt).toHaveProperty('amount', data.amount);
    expect(debt).toHaveProperty('debtId');
  });

  it('should not able update debt - invalid id', async () => {
    await expect(service.update('invalid-id', {})).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not able update debt - debt not found', async () => {
    await expect(
      service.update('6307aecb80f5e1477219cac1', {}),
    ).rejects.toThrow(NotFoundException);
  });

  it('should able update debt', async () => {
    const data = {
      description: 'emprestimo',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    const debt = await service.create(data);

    data.amount = 200013;

    const updateDebt = await service.update(debt.debtId, data);

    expect(updateDebt).toHaveProperty('amount', 200013);
  });

  it('should not able delete debt - invalid id', async () => {
    await expect(service.remove('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not able delete debt - debt not found', async () => {
    await expect(service.remove('6307aecb80f5e1477219cac1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should able delete debt', async () => {
    const data = {
      description: 'emprestimo',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    const debt = await service.create(data);

    const deleteDebt = await service.remove(debt.debtId);

    expect(deleteDebt).toBeTruthy();
  });

  it('should able returns debts from user', async () => {
    const data = {
      description: 'emprestimo',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    const debt = await service.create(data);

    const debts = await service.findByUserId(data.userId);

    expect(debts).toHaveLength(1);
    expect(debts[0]).toMatchObject(debt);
  });
});
