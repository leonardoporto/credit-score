import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthCheck } from './healthcheck.entity';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@ApiTags('core')
@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly appService: AppService,
  ) {}

  @ApiOperation({ summary: 'Health Check' })
  @ApiOkResponse({
    description: 'Application is up',
    type: HealthCheck,
  })
  @Get('healthcheck')
  healthcheck(): HealthCheck {
    return this.appService.healthcheck();
  }

  @ApiOperation({ summary: 'Authenticate' })
  @UseGuards(AuthGuard('local'))
  @Post('authenticate')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Your Data' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
