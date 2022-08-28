import { Module, Global } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.providers';
console.log('database', process.env.NODE_ENV);
@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
