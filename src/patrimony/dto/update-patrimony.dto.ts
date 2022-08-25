import { PartialType } from '@nestjs/swagger';
import { CreatePatrimonyDto } from './create-patrimony.dto';

export class UpdatePatrimonyDto extends PartialType(CreatePatrimonyDto) {}
