import { Module } from '@nestjs/common';
import { BarberAdminController } from './barber-admin.controller';
import { BarberAdminService } from './barber-admin.service';
import { validationSchema, mongoConfig, jwtConfig } from '@app/common-barber';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from 'apps/best-barber/src/app.controller';
import { AppService } from 'apps/best-barber/src/app.service';
import { AppoitmentModule } from 'apps/best-barber/src/resource/appoitment/appoitment.module';
import { AuthModule } from 'apps/best-barber/src/resource/auth/auth.module';
import { BarberModule } from 'apps/best-barber/src/resource/barber/barber.module';

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
    BarberModule,
    AppoitmentModule
    // UserModule,
  ],
  controllers: [BarberAdminController],
  providers: [BarberAdminService],
})
export class BarberAdminModule {}
