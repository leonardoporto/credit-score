import { Module } from '@nestjs/common';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { DatabaseModule } from '../database/database.module';
import { debtsProviders } from './debt.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [DebtController],
  providers: [DebtService, ...debtsProviders],
  exports: [DebtService],
})
export class DebtModule {}
