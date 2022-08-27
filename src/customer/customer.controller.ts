import { JwtAuthGuard, PermissionGuard, Role, Roles } from '@/auth';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { DebtService } from './debt.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CreateDebtDto,
  CreatePatrimonyDto,
  UpdatePatrimonyDto,
  UpdateDebtDto,
} from './dto';
import { PatrimonyService } from './patrimony.service';

@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly patrimonyService: PatrimonyService,
    private readonly debtService: DebtService,
  ) {}

  @ApiOperation({ summary: 'Find Customer' })
  @ApiCreatedResponse({ description: 'Find Customer' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Admin, Role.Customer)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customerService.findOne(id);
    const patrimonies = await this.patrimonyService.findByUserId(id);
    const debts = await this.debtService.findByUserId(id);
    return { ...customer, patrimonies, debts };
  }

  @ApiOperation({ summary: 'Calculate Credit Score' })
  @ApiCreatedResponse({ description: 'Calculate Credit Score' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Admin, Role.Customer)
  @Get(':id/credit-score')
  async creditScore(@Param('id') id: string) {
    const patrimonies = await this.patrimonyService.findByUserId(id);
    const debts = await this.debtService.findByUserId(id);
    return this.customerService.creditScore(patrimonies, debts);
  }

  @ApiOperation({ summary: 'Create patrimony' })
  @ApiCreatedResponse({ description: 'Patrimony created' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Customer)
  @Post(':id/patrimony')
  createPatrimony(
    @Param('id') id: string,
    @Body() CreatePatrimonyDto: CreatePatrimonyDto,
  ) {
    return this.patrimonyService.create({ ...CreatePatrimonyDto, userId: id });
  }

  @ApiOperation({ summary: 'Update patrimony' })
  @ApiCreatedResponse({ description: 'Patrimony updated' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Customer)
  @Patch(':id/patrimony/:patrimonyId')
  updatePatrimony(
    @Param('patrimonyId') patrimonyId: string,
    @Body() updatePatrimonyDto: UpdatePatrimonyDto,
  ) {
    return this.patrimonyService.update(patrimonyId, updatePatrimonyDto);
  }

  @ApiOperation({ summary: 'Delete patrimony' })
  @ApiNoContentResponse({ description: 'Patrimony deleted' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Customer)
  @HttpCode(204)
  @Delete(':id/patrimony/:patrimonyId')
  deletePatrimony(@Param('patrimonyId') patrimonyId: string) {
    return this.patrimonyService.remove(patrimonyId);
  }

  @ApiOperation({ summary: 'Create debt' })
  @ApiCreatedResponse({ description: 'Debt created' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Customer)
  @Post(':id/debt')
  createDebt(@Param('id') id: string, @Body() createDebtDto: CreateDebtDto) {
    return this.debtService.create({ ...createDebtDto, userId: id });
  }

  @ApiOperation({ summary: 'Update debt' })
  @ApiCreatedResponse({ description: 'Debt updated' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Customer)
  @Patch(':id/debt/:debtId')
  updateDebt(
    @Param('debtId') debtId: string,
    @Body() updateDebtDto: UpdateDebtDto,
  ) {
    return this.debtService.update(debtId, updateDebtDto);
  }

  @ApiOperation({ summary: 'Delete debt' })
  @ApiNoContentResponse({ description: 'Debt deleted' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Customer)
  @HttpCode(204)
  @Delete(':id/debt/:debtId')
  deleteDebt(@Param('debtId') debtId: string) {
    return this.debtService.remove(debtId);
  }
}
