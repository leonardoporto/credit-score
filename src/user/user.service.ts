import * as crypto from 'crypto';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { User as UserInterface } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@Inject('USER_MODEL') private userModel: Model<UserInterface>) {}

  async create(createUserDto: CreateUserDto) {
    await this.isDuplicated(createUserDto.username);
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save().then((result) => new User(result));
  }

  findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .then((result) => result.map((item) => new User(item)));
  }

  async findOne(id: string) {
    return this.userExists(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userExists(id);
    await this.isDuplicated(updateUserDto.username, id);
    return this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUserDto }, { new: true })
      .then((result) => {
        if (result) {
          const user = new User(result);
          user.setPassword(result.password);
          return user;
        }
        return null;
      });
  }

  async remove(id: string): Promise<boolean> {
    await this.userExists(id);
    const result = await this.userModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
    return result.acknowledged;
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userModel
      .findOne({ username, deletedAt: null })
      .then((data) => {
        if (data) {
          const user = new User(data);
          user.setPassword(data.password);
          return user;
        }
        return null;
      });
  }

  private async userExists(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({ message: 'invalid user Id' });
    }
    const user = await this.userModel
      .findOne({ _id: id, deletedAt: null })
      .then((result) => result && new User(result));
    if (!user) {
      throw new NotFoundException({ message: 'user not found' });
    }
    return user;
  }

  private async isDuplicated(
    username: string,
    id: string = null,
  ): Promise<void> {
    const query = { username, deletedAt: null };
    if (id) {
      query['_id'] = { $ne: id };
    }
    const found = await this.userModel.findOne(query);
    if (found) {
      throw new BadRequestException({ message: 'username already exists' });
    }
  }
}
