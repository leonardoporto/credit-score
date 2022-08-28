import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { debtsProviders, patrimoniesProviders } from './providers';
import { DebtService } from './debt.service';
import { PatrimonyService } from './patrimony.service';
import { usersProviders } from '@/user/user.providers';
console.log('customer', process.env.NODE_ENV);
@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    DebtService,
    PatrimonyService,
    ...debtsProviders,
    ...patrimoniesProviders,
    ...usersProviders,
  ],
})
export class CustomerModule {}
