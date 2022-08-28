import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { User as UserInterface } from '@/user/interfaces/user.interface';
import { User } from '../user/entities/user.entity';
import { Debt, Patrimony } from './entities';

@ApiTags('customer')
@Injectable()
export class CustomerService {
  constructor(@Inject('USER_MODEL') private userModel: Model<UserInterface>) {}

  creditScore(patrimonies: Patrimony[], debts: Debt[]): number {
    const totalPatrimony = patrimonies.reduce((response, patrimony) => {
      return response + patrimony.amount;
    }, 0);

    const totalDebts = debts.reduce((response, debt) => {
      return response + debt.amount;
    }, 0);

    const diference = totalPatrimony - totalDebts;

    if (diference <= 0) {
      return 0;
    }

    return Math.round((diference * 1000) / totalPatrimony);
  }

  async existsCustomer(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({ message: 'invalid user Id' });
    }
    const user = await this.userModel
      .findOne({ _id: id, deletedAt: null })
      .then((result) => result && new User(result));
    if (!user) {
      throw new NotFoundException({ message: 'customer not found' });
    }
    if (user.role !== 'customer') {
      throw new PreconditionFailedException({
        message: 'the user is not a customer',
      });
    }

    return user;
  }
}
