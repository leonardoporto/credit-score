import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PatrimonyService } from './patrimony.service';
import { CreatePatrimonyDto } from './dto/create-patrimony.dto';
import { UpdatePatrimonyDto } from './dto/update-patrimony.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Patrimony } from './entities/patrimony.entity';

@ApiTags('patrimony')
@Controller('patrimony')
export class PatrimonyController {
  constructor(private readonly patrimonyService: PatrimonyService) {}

  @ApiOperation({ summary: 'Create patrimony' })
  @ApiCreatedResponse({ description: 'Patrimony created.' })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Customer)
  @Post()
  async create(
    @Body() createPatrimonyDto: CreatePatrimonyDto,
  ): Promise<Patrimony> {
    return this.patrimonyService.create(createPatrimonyDto);
  }

  @Get()
  findAll() {
    return this.patrimonyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patrimonyService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatrimonyDto: UpdatePatrimonyDto,
  ) {
    return this.patrimonyService.update(+id, updatePatrimonyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patrimonyService.remove(+id);
  }
}
