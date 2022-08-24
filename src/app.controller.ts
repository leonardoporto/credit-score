import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthCheck } from './healthcheck.entity';

@ApiTags('core')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health Check' })
  @ApiOkResponse({
    description: 'Application is up',
    type: HealthCheck,
  })
  @Get('healthcheck')
  healthcheck(): HealthCheck {
    return this.appService.healthcheck();
  }
}
