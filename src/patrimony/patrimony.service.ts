import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreatePatrimonyDto } from './dto/create-patrimony.dto';
import { UpdatePatrimonyDto } from './dto/update-patrimony.dto';
import { Patrimony } from './entities/patrimony.entity';
import { Patrimony as PatrimonyInterface } from './interfaces/patrimony.interface';

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

  findAll() {
    return `This action returns all patrimony`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patrimony`;
  }

  update(id: number, updatePatrimonyDto: UpdatePatrimonyDto) {
    return `This action updates a #${id} patrimony`;
  }

  remove(id: number) {
    return `This action removes a #${id} patrimony`;
  }
}
