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
  HttpCode,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';

import { Cache } from 'cache-manager';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { DebtService } from './debt.service';
import {
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOperation({ summary: 'Find Customer' })
  @ApiCreatedResponse({ description: 'Find Customer' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Admin, Role.Customer)
  @Get(':id')
  async findOne(@Param('id') userId: string) {
    let customerData = await this.cacheManager.get(`data_${userId}`);
    if (!customerData) {
      const customer = await this.customerService.existsCustomer(userId);
      const patrimonies = await this.patrimonyService.findByUserId(userId);
      const debts = await this.debtService.findByUserId(userId);
      customerData = { ...customer, patrimonies, debts };
      await this.cacheManager.set(`data_${userId}`, customerData, {
        ttl: 3600,
      });
    }
    return customerData;
  }

  @ApiOperation({ summary: 'Calculate Credit Score' })
  @ApiCreatedResponse({ description: 'Calculate Credit Score' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Admin, Role.Customer)
  @Get(':id/credit-score')
  async creditScore(@Param('id') userId: string) {
    let score = await this.cacheManager.get(`score_${userId}`);
    if (!score) {
      await this.customerService.existsCustomer(userId);
      const patrimonies = await this.patrimonyService.findByUserId(userId);
      const debts = await this.debtService.findByUserId(userId);
      score = this.customerService.creditScore(patrimonies, debts);
      await this.cacheManager.set(`score_${userId}`, score, { ttl: 3600 });
    }

    return score;
  }

  @ApiOperation({ summary: 'Create patrimony' })
  @ApiCreatedResponse({ description: 'Patrimony created' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Admin, Role.Customer)
  @Post(':id/patrimony')
  async createPatrimony(
    @Param('id') userId: string,
    @Body() createPatrimonyDto: CreatePatrimonyDto,
  ) {
    await this.customerService.existsCustomer(userId);
    await this.cacheManager.del(`data_${userId}`);
    await this.cacheManager.del(`score_${userId}`);
    return this.patrimonyService.create({
      ...createPatrimonyDto,
      userId: userId,
    });
  }

  @ApiOperation({ summary: 'Update patrimony' })
  @ApiCreatedResponse({ description: 'Patrimony updated' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Admin, Role.Customer)
  @Patch(':id/patrimony/:patrimonyId')
  async updatePatrimony(
    @Param('id') userId: string,
    @Param('patrimonyId') patrimonyId: string,
    @Body() updatePatrimonyDto: UpdatePatrimonyDto,
  ) {
    await this.customerService.existsCustomer(userId);
    await this.cacheManager.del(`data_${userId}`);
    await this.cacheManager.del(`score_${userId}`);
    return this.patrimonyService.update(patrimonyId, updatePatrimonyDto);
  }

  @ApiOperation({ summary: 'Delete patrimony' })
  @ApiNoContentResponse({ description: 'Patrimony deleted' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Admin, Role.Customer)
  @HttpCode(204)
  @Delete(':id/patrimony/:patrimonyId')
  async deletePatrimony(
    @Param('id') userId: string,
    @Param('patrimonyId') patrimonyId: string,
  ) {
    await this.customerService.existsCustomer(userId);
    await this.cacheManager.del(`data_${userId}`);
    await this.cacheManager.del(`score_${userId}`);
    return this.patrimonyService.remove(patrimonyId);
  }

  @ApiOperation({ summary: 'Create debt' })
  @ApiCreatedResponse({ description: 'Debt created' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Admin)
  @Post(':id/debt')
  async createDebt(
    @Param('id') userId: string,
    @Body() createDebtDto: CreateDebtDto,
  ) {
    await this.customerService.existsCustomer(userId);
    await this.cacheManager.del(`data_${userId}`);
    await this.cacheManager.del(`score_${userId}`);
    return this.debtService.create({ ...createDebtDto, userId: userId });
  }

  @ApiOperation({ summary: 'Update debt' })
  @ApiCreatedResponse({ description: 'Debt updated' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Admin)
  @Patch(':id/debt/:debtId')
  async updateDebt(
    @Param('id') userId: string,
    @Param('debtId') debtId: string,
    @Body() updateDebtDto: UpdateDebtDto,
  ) {
    await this.customerService.existsCustomer(userId);
    await this.cacheManager.del(`data_${userId}`);
    await this.cacheManager.del(`score_${userId}`);
    return this.debtService.update(debtId, updateDebtDto);
  }

  @ApiOperation({ summary: 'Delete debt' })
  @ApiNoContentResponse({ description: 'Debt deleted' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles(Role.Admin)
  @HttpCode(204)
  @Delete(':id/debt/:debtId')
  async deleteDebt(
    @Param('id') userId: string,
    @Param('debtId') debtId: string,
  ) {
    await this.customerService.existsCustomer(userId);
    await this.cacheManager.del(`data_${userId}`);
    await this.cacheManager.del(`score_${userId}`);
    return this.debtService.remove(debtId);
  }
}
