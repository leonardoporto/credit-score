import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { User as UserInterface } from '@/user/interfaces/user.interface';
import { User } from '@/user/entities/user.entity';
import { Debt, Patrimony } from './entities';

@ApiTags('customer')
@Injectable()
export class CustomerService {
  constructor(@Inject('USER_MODEL') private userModel: Model<UserInterface>) {}

  findOne(id: string) {
    return this.userModel
      .findOne({ _id: id, role: 'customer' })
      .then((result) => {
        if (!result) {
          throw new NotFoundException();
        }
        return new User(result);
      });
  }

  creditScore(patrimonies: Patrimony[], debts: Debt[]): number {
    const totalPatrimony = patrimonies.reduce((response, patrimony) => {
      return response + patrimony.amount;
    }, 0);

    const totalDebts = debts.reduce((response, debt) => {
      return response + debt.amount;
    }, 0);

    const diference = totalPatrimony - totalDebts;

    console.log({ totalPatrimony, totalDebts, diference });

    if (diference <= 0) {
      return 0;
    }

    return Math.round((diference * 100) / totalPatrimony) * 10;
  }
}
