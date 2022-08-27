import { DatabaseModule } from '../../database';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { usersProviders } from '../../user/user.providers';
import { CustomerService } from '../customer.service';
import { PatrimonyService } from '../patrimony.service';
import { DebtService } from '../debt.service';
import { debtsProviders, patrimoniesProviders } from '../providers';
import {
  BadRequestException,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Patrimony } from '../entities';

describe('CustomerServive', () => {
  let service: CustomerService;
  let debtService: DebtService;
  let patrimonyService: PatrimonyService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
      providers: [
        UserService,
        CustomerService,
        ...usersProviders,
        DebtService,
        ...debtsProviders,
        PatrimonyService,
        ...patrimoniesProviders,
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    debtService = module.get<DebtService>(DebtService);
    patrimonyService = module.get<PatrimonyService>(PatrimonyService);
    userService = module.get<UserService>(UserService);
  });

  it('should not able to check if a user is valid - invalid id', async () => {
    await expect(service.existsCustomer('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not able to check if a user is valid - debt not found', async () => {
    await expect(
      service.existsCustomer('6307aecb80f5e1477219cac1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should not able to check if a user is valid - user is not customer', async () => {
    const user = await userService.create({
      name: 'Customer ',
      username: 'customer',
      role: 'admin',
      password: '1qaz2wsx',
    });
    await expect(service.existsCustomer(user.userId)).rejects.toThrow(
      PreconditionFailedException,
    );
  });

  it('should able to check if a user is valid', async () => {
    const user = await userService.create({
      name: 'Customer ',
      username: 'customer',
      role: 'customer',
      password: '1qaz2wsx',
    });

    const retrieveUser = await service.existsCustomer(user.userId);

    expect(retrieveUser).toHaveProperty('name', user.name);
    expect(retrieveUser).toHaveProperty('username', user.username);
    expect(retrieveUser).toHaveProperty('role', user.role);
  });

  it('should able calculate credit score - 0 points', async () => {
    const score = service.creditScore([], []);
    expect(score).toBe(0);
  });

  it('should able calculate credit score - only debts - 0 points', async () => {
    const debtsData = {
      description: 'casa',
      amount: 100000,
      userId: '6307aecb80f5e1477219cac1',
    };

    await debtService.create(debtsData);

    const debts = await debtService.findByUserId(debtsData.userId);

    const score = service.creditScore([], debts);

    expect(score).toBe(0);
  });

  it('should able calculate credit score - only patrimonies - 1000 points', async () => {
    const data = {
      description: 'casa',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    await patrimonyService.create(data);

    const patrimonies = await patrimonyService.findByUserId(data.userId);

    const score = service.creditScore(patrimonies, []);

    expect(score).toBe(1000);
  });

  it('should able calculate credit score - 500 points', async () => {
    const patrimoniesData = {
      description: 'casa',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    await patrimonyService.create(patrimoniesData);

    const patrimonies = await patrimonyService.findByUserId(
      patrimoniesData.userId,
    );

    const debtsData = {
      description: 'casa',
      amount: 100000,
      userId: '6307aecb80f5e1477219cac1',
    };

    await debtService.create(debtsData);

    const debts = await debtService.findByUserId(debtsData.userId);

    const score = service.creditScore(patrimonies, debts);

    expect(score).toBe(500);
  });

  it('should able calculate credit score - 590 points', async () => {
    const patrimoniesData = {
      description: 'casa',
      amount: 200000,
      userId: '6307aecb80f5e1477219cac1',
    };

    await patrimonyService.create(patrimoniesData);

    const patrimonies = await patrimonyService.findByUserId(
      patrimoniesData.userId,
    );

    const debtsData = [
      {
        description: 'empresatimo 1',
        amount: 70000,
        userId: '6307aecb80f5e1477219cac1',
      },
      {
        description: 'emprestimo 2',
        amount: 12000,
        userId: '6307aecb80f5e1477219cac1',
      },
    ];

    await Promise.all(debtsData.map((data) => debtService.create(data)));

    const debts = await debtService.findByUserId(patrimoniesData.userId);

    const score = service.creditScore(patrimonies, debts);

    expect(score).toBe(590);
  });
});
