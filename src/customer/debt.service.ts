import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
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
    return this.debtModel
      .findOneAndUpdate({ _id: id }, { $set: updateDebtDto }, { new: true })
      .then((result) => new Debt(result));
  }

  async findOne(id: string): Promise<Debt> {
    return this.debtModel.findById(id).then((result) => new Debt(result));
  }

  async findByUserId(userId: string): Promise<Debt[]> {
    return this.debtModel
      .find({ userId, deletedAt: null })
      .then((result) => result.map((item) => new Debt(item)));
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.debtModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
    return result.acknowledged;
  }
}
