import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { usersProviders } from './user.providers';
import { PatrimonyModule } from './patrimony/patrimony.module';
import { PatrimonyModule } from './patrimony/patrimony.module';

@Module({
  imports: [DatabaseModule, PatrimonyModule],
  controllers: [UserController],
  providers: [UserService, ...usersProviders],
  exports: [UserService],
})
export class UserModule {}
