import { ApiProperty } from '@nestjs/swagger';

import { Debt as DebtInterface } from '../interfaces';

export class Debt {
  @ApiProperty()
  public debtId: string;

  @ApiProperty()
  public userId: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public deletedAt: Date;

  constructor(data: DebtInterface) {
    this.debtId = data._id;
    this.userId = data.userId;
    this.description = data.description;
    this.amount = data.amount;
    this.deletedAt = data.deletedAt;
  }
}
