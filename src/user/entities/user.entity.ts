import { ApiProperty } from '@nestjs/swagger';
import { User as UserInterface } from '../interfaces/user.interface';

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

  constructor(data: UserInterface) {
    this.userId = data._id;
    this.username = data.username;
    this.name = data.name;
    this.role = data.role;
    this.password = data.password;
  }

  validatePassword(password) {
    return password === this.password;
  }
}
