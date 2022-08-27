import { ApiProperty } from '@nestjs/swagger';
import { User as UserInterface } from '../interfaces/user.interface';

import * as crypto from 'crypto';
export class User {
  @ApiProperty()
  public userId: string;
  @ApiProperty()
  public name: string;
  @ApiProperty()
  public username: string;
  @ApiProperty()
  public role: 'admin' | 'customer';
  private password: string;
  @ApiProperty()
  public deletedAt: Date;

  constructor(data: UserInterface) {
    this.userId = data._id;
    this.username = data.username;
    this.name = data.name;
    this.role = data.role;
    this.deletedAt = data.deletedAt;
  }

  validatePassword(password) {
    const hash = crypto
      .createHash('sha256')
      .update(password, 'utf8')
      .digest('hex')
      .toString();
    return hash === this.password;
  }

  setPassword(password) {
    this.password = password;
  }
}
