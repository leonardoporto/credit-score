import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { Debt } from './entities/debt.entity';
import { Debt as DebtInterface } from './interfaces/debt.interface';

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

  findAll() {
    return `This action returns all debt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} debt`;
  }

  update(id: number, updateDebtDto: UpdateDebtDto) {
    return `This action updates a #${id} debt`;
  }

  remove(id: number) {
    return `This action removes a #${id} debt`;
  }
}
