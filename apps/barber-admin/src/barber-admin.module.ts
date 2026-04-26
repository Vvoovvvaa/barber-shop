import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BarberAdminController } from './barber-admin.controller';
import { BarberAdminService } from './barber-admin.service';
import { validationSchema, mongoConfig, jwtConfig, IJWTConfig, redisConfig, EmailModule, RequestLoggerMiddleware, smtpConfig } from '@app/common-barber';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


import { AuthModule } from './resource/auth/auth.module';
import { AdminsModule } from './resource/admins/admins.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { RedisModule } from '@app/redis';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      load: [mongoConfig, jwtConfig,redisConfig,smtpConfig],
    }),
    JwtModule.registerAsync({
      global:true,
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const jwt = config.get<IJWTConfig>('JWT_CONFIG');
        if (!jwt) {
          throw new Error('JWT_CONFIG not found');
        }
        return {
          secret: jwt.admin,
          signOptions: { expiresIn: jwt.expiresIn },
        };
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mongo = config.get('mongo');
        if (!mongo) {
          throw new Error('Mongo config not found');
        }
        return {
          uri: mongo.uri,
          dbName: mongo.dbName,
          retryAttempts: 5,
          retryDelay: 3000,
          serverSelectionTimeoutMS: 5000,
        };
      },
    }),
    AuthModule,
    AdminsModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [BarberAdminController],
  providers: [BarberAdminService],
})
export class BarberAdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*')
  }
 }
