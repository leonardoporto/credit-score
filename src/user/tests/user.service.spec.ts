import { DatabaseModule } from '../../database';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { usersProviders } from '../user.providers';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
      providers: [UserService, ...usersProviders],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should not able create user - duplicated username', async () => {
    await service.create({
      name: 'Customer ',
      username: 'customer',
      role: 'customer',
      password: '1qaz2wsx',
    });

    await expect(
      service.create({
        name: 'Customer 2',
        username: 'customer',
        role: 'customer',
        password: '1qaz2wsx2',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should be able create user', async () => {
    const user = await service.create({
      name: 'Customer ',
      username: 'customer',
      role: 'customer',
      password: '1qaz2wsx',
    });

    expect(user).toHaveProperty('name', 'Customer ');
    expect(user).toHaveProperty('role', 'customer');
    expect(user).toHaveProperty('userId');
    expect(user).not.toHaveProperty('password');
  });

  it('should not able returns user - invalid id', async () => {
    await expect(service.findOne('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not able returns user - user not found', async () => {
    await expect(service.findOne('6307aecb80f5e1477219cac1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should able returns user', async () => {
    const user = await service.create({
      name: 'Customer ',
      username: 'customer',
      role: 'customer',
      password: '1qaz2wsx',
    });

    const retrieveUser = await service.findOne(user.userId);

    expect(retrieveUser).toMatchObject(user);
  });

  it('should able returns user by username with password attribute', async () => {
    const user = await service.create({
      name: 'Customer ',
      username: 'customer',
      role: 'customer',
      password: '1qaz2wsx',
    });

    const retrieveUser = await service.findOneByUsername(user.username);

    expect(retrieveUser).toHaveProperty('userId', user.userId);
    expect(retrieveUser).toHaveProperty('name', user.name);
    expect(retrieveUser).toHaveProperty('password');
    expect(retrieveUser.validatePassword('1qaz2wsx')).toBeTruthy();
  });

  it('should not able update user - invalid user', async () => {
    await expect(service.update('invalid-id', {})).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not able update user - user not found', async () => {
    await expect(
      service.update('6307aecb80f5e1477219cac1', {}),
    ).rejects.toThrow(NotFoundException);
  });

  it('should not able update user - duplicated username', async () => {
    await service.create({
      name: 'Customer ',
      username: 'customer',
      role: 'customer',
      password: '1qaz2wsx',
    });

    const user = await service.create({
      name: 'Customer ',
      username: 'customer2',
      role: 'customer',
      password: '1qaz2wsx',
    });

    await expect(
      service.update(user.userId, { username: 'customer' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should able update user', async () => {
    const user = await service.create({
      name: 'Customer ',
      username: 'customer',
      role: 'customer',
      password: '1qaz2wsx',
    });
    const updateResult = await service.update(user.userId, {
      name: 'Customer updated',
      username: 'customer',
      role: 'admin',
      password: '2wsx1qaz',
    });

    expect(updateResult).toHaveProperty('userId', user.userId);
    expect(updateResult).toHaveProperty('name', 'Customer updated');
    expect(updateResult).toHaveProperty('role', 'admin');
    expect(updateResult).toHaveProperty('password');
    expect(updateResult.validatePassword('1qaz2wsx')).toBeFalsy();
    expect(updateResult.validatePassword('2wsx1qaz')).toBeTruthy();
  });

  it('should not able delete user - invalid user', async () => {
    await expect(service.remove('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not able delete user - user not found', async () => {
    await expect(service.remove('6307aecb80f5e1477219cac1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should able delete user', async () => {
    const user = await service.create({
      name: 'Customer ',
      username: 'customer',
      role: 'customer',
      password: '1qaz2wsx',
    });

    const deleteResult = await service.remove(user.userId);

    expect(deleteResult).toBeTruthy();
  });
});
