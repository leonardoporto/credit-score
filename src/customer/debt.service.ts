import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { CreateDebtDto, UpdateDebtDto } from './dto';
import { Debt } from './entities/debt.entity';
import { Debt as DebtInterface } from './interfaces';

@Injectable()
export class DebtService {
  constructor(
    @Inject('DEBT_MODEL')
    private debtModel: Model<DebtInterface>,
  ) {}

  async create(createDebtDto: CreateDebtDto): Promise<Debt> {
    const createdDebt = new this.debtModel(createDebtDto);
    return createdDebt.save().then((result) => new Debt(result));
  }

  async update(id: string, updateDebtDto: UpdateDebtDto): Promise<Debt> {
    await this.debtExists(id);
    return this.debtModel
      .findOneAndUpdate({ _id: id }, { $set: updateDebtDto }, { new: true })
      .then((result) => new Debt(result));
  }

  async findOne(id: string): Promise<Debt> {
    return this.debtExists(id);
  }

  async findByUserId(userId: string): Promise<Debt[]> {
    return this.debtModel
      .find({ userId, deletedAt: null })
      .then((result) => result.map((item) => new Debt(item)));
  }

  async remove(id: string): Promise<boolean> {
    await this.debtExists(id);
    const result = await this.debtModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
    return result.acknowledged;
  }

  private debtExists(id: string): Promise<Debt> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({ message: 'invalid debt Id' });
    }
    const debt = this.debtModel
      .findOne({ _id: id, deletedAt: null })
      .then((result) => new Debt(result));
    if (!debt) {
      throw new NotFoundException({ message: 'debt not found' });
    }
    return debt;
  }
}
