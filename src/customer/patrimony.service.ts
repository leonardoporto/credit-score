import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
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
    updatePatrimonyDto: UpdatePatrimonyDto,
  ): Promise<Patrimony> {
    await this.patrimonyExists(id);
    return this.patrimomyModel
      .findOneAndUpdate(
        { _id: id },
        { $set: updatePatrimonyDto },
        { new: true },
      )
      .then((result) => new Patrimony(result));
  }

  async findOne(id: string): Promise<Patrimony> {
    return this.patrimonyExists(id);
  }

  async findByUserId(userId: string): Promise<Patrimony[]> {
    return this.patrimomyModel
      .find({ userId, deletedAt: null })
      .then((result) => result.map((item) => new Patrimony(item)));
  }

  async remove(id: string): Promise<boolean> {
    await this.patrimonyExists(id);
    const result = await this.patrimomyModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
    return result.acknowledged;
  }

  private async patrimonyExists(id: string): Promise<Patrimony> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({ message: 'invalid patrimony Id' });
    }
    const patrimony = await this.patrimomyModel
      .findOne({ _id: id, deletedAt: null })
      .then((result) => result && new Patrimony(result));
    if (!patrimony) {
      throw new NotFoundException({ message: 'patrimony not found' });
    }
    return patrimony;
  }
}
