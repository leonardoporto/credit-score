import { Module } from '@nestjs/common';
import { PatrimonyService } from './patrimony.service';
import { PatrimonyController } from './patrimony.controller';
import { DatabaseModule } from '../database/database.module';
import { patrimoniesProviders } from './patrimony.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PatrimonyController],
  providers: [PatrimonyService, ...patrimoniesProviders],
  exports: [PatrimonyService],
})
export class PatrimonyModule {}
