import { ApiProperty } from '@nestjs/swagger';

import { Patrimony as PatrimonyInterface } from '../interfaces/patrimony.interface';

export class Patrimony {
  @ApiProperty()
  public patrimonyId: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public deletedAt: Date;

  constructor(data: PatrimonyInterface) {
    this.patrimonyId = data._id;
    this.description = data.description;
    this.amount = data.amount;
    this.deletedAt = data.deletedAt;
  }
}
