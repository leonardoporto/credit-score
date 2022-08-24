import { Injectable } from '@nestjs/common';
import { HealthCheck } from './healthcheck.entity';

@Injectable()
export class AppService {
  healthcheck(): HealthCheck {
    return {
      uptime: process.uptime(),
      environment: process?.env?.NODE_ENV || 'development',
    };
  }
}
