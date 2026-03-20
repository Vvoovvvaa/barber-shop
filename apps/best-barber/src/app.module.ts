import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from '../../../libs/common-barber/src/validation/validation.schema';
import { jwtConfig, mongoConfig } from '../../../libs/common-barber/src/configs';
// import { UserModule } from './user/user.module';
import { AuthModule } from './resource/auth/auth.module';
import { BarberModule } from './resource/barber/barber.module';
import { AppoitmentModule } from './resource/appoitment/appoitment.module';
import { IJWTConfig } from '@app/common-barber';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { S3Module } from '@app/common-barber/s3';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      load: [mongoConfig, jwtConfig],
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
          secret: jwt.secret,
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
    BarberModule,
    AppoitmentModule,
    S3Module
    // UserModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }