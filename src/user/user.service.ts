import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { User as UserInterface } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@Inject('USER_MODEL') private userModel: Model<UserInterface>) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: id }, { $set: updateUserDto });
  }

  remove(id: number) {
    return this.userModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).then((data) => {
      if (data) {
        return new User(data);
      }
      return null;
    });
  }
}
