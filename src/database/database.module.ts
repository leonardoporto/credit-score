import { Module, Global } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.providers';
@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
