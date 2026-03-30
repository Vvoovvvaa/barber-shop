import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { RedisService } from './redis.service';
import { TokenService } from './tokenservice';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const config = configService.get('REDIS_CONFIG');

        const redis = new Redis({
          host: config.host,
          port: config.port,
          password: config.password,
          db: config.db,
        });

        return redis;
      },
      inject: [ConfigService],
    },
    RedisService,TokenService
  ],
  exports: ['REDIS_CLIENT', RedisService,TokenService],
})
export class RedisModule {}