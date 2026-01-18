import { Module } from '@nestjs/common';
import { BarberAdminController } from './barber-admin.controller';
import { BarberAdminService } from './barber-admin.service';
import { validationSchema, mongoConfig, jwtConfig } from '@app/common-barber';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


import { AuthModule } from './resource/auth/auth.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      load: [mongoConfig, jwtConfig],
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
  ],
  controllers: [BarberAdminController],
  providers: [BarberAdminService],
})
export class BarberAdminModule {}
