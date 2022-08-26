import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreatePatrimonyDto, UpdatePatrimonyDto } from './dto';
import { Patrimony } from './entities/patrimony.entity';
import { Patrimony as PatrimonyInterface } from './interfaces';

@Injectable()
export class PatrimonyService {
  constructor(
    @Inject('PATRIMONY_MODEL')
    private patrimomyModel: Model<PatrimonyInterface>,
  ) {}

  async create(createPatrimonyDto: CreatePatrimonyDto): Promise<Patrimony> {
    const createdPatrimony = new this.patrimomyModel(createPatrimonyDto);
    return createdPatrimony.save().then((result) => new Patrimony(result));
  }

  async update(
    id: string,
    updateDebtDto: UpdatePatrimonyDto,
  ): Promise<Patrimony> {
    return this.patrimomyModel
      .findOneAndUpdate({ _id: id }, { $set: updateDebtDto }, { new: true })
      .then((result) => new Patrimony(result));
  }

  async findOne(id: string): Promise<Patrimony> {
    return this.patrimomyModel
      .findById(id)
      .then((result) => new Patrimony(result));
  }

  async findByUserId(userId: string): Promise<Patrimony[]> {
    return this.patrimomyModel
      .find({ userId, deletedAt: null })
      .then((result) => result.map((item) => new Patrimony(item)));
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.patrimomyModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
    return result.acknowledged;
  }
}
