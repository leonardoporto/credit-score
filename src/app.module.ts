import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';

console.log('app', process.env.NODE_ENV);
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register(
      ['development', 'test'].includes(process.env.NODE_ENV)
        ? { isGlobal: true, ttl: 86400 }
        : {
            isGlobal: true,
            ttl: 86400,
            store: redisStore,
            host: process.env.REDIS_URI,
            port: 6379,
            db: 0,
          },
    ),
    DatabaseModule,
    CustomerModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseModule],
})
export class AppModule {}
