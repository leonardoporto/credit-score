import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsIn(['admin', 'customer'])
  role: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
