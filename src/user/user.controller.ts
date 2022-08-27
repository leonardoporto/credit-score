import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'User created.', type: User })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Retrieve users' })
  @ApiOkResponse({
    description: 'Retrieve users',
    type: User,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Retrive a user' })
  @ApiOkResponse({ description: 'Retrive a user', type: User })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Partial update of a user' })
  @ApiNoContentResponse({ description: 'Partial update of a user' })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @HttpCode(204)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiNoContentResponse({ description: 'Delete user' })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
